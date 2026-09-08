import type {
  Difficulty,
  DisplayStatus,
  ErrorKind,
  Evidence,
  Freshness,
  Mastery,
  SkillProgress,
} from '../../../shared/domain/types';

export const progressRules = {
  evidenceWindow: 12,
  availableMinimum: 4,
  availableQuality: 0.65,
  solidMinimum: 8,
  solidQuality: 0.82,
  solidKinds: 3,
  coolingAfterDays: 14,
  oxidizedAfterDays: 30,
  recurringErrorMinimum: 3,
} as const;

const difficultyWeights: Record<Difficulty, number> = {
  foundation: 1,
  application: 1.1,
  relation: 1.25,
  transfer: 1.4,
};

export function evidenceQuality(evidence: Evidence): number {
  if (evidence.revealed) return 0.25;
  if (!evidence.correct) return 0;
  if (evidence.attempts > 1) return 0.6;
  return evidence.usedHint ? 0.75 : 1;
}

/** Retain every answer in storage, but only the latest attempt of a session step in mastery. */
export function recentRelevantEvidences(
  evidences: readonly Evidence[],
): Evidence[] {
  const ordered = [...evidences].sort(
    (a, b) => Date.parse(a.answeredAt) - Date.parse(b.answeredAt),
  );
  const unique = new Map<string, Evidence>();
  for (const evidence of ordered) {
    const key = evidence.sessionId
      ? JSON.stringify([
          evidence.sessionId,
          evidence.skillId,
          evidence.challengeId,
          evidence.stepId,
        ])
      : evidence.id;
    unique.delete(key);
    unique.set(key, evidence);
  }
  return [...unique.values()].slice(-progressRules.evidenceWindow);
}

export function weightedQuality(evidences: readonly Evidence[]): number {
  let totalWeight = 0;
  let weighted = 0;
  for (const evidence of evidences) {
    const weight = difficultyWeights[evidence.difficulty];
    totalWeight += weight;
    weighted += evidenceQuality(evidence) * weight;
  }
  return totalWeight ? weighted / totalWeight : 0;
}

export function calculateMastery(evidences: readonly Evidence[]): Mastery {
  const recent = recentRelevantEvidences(evidences);
  if (!recent.length) return 'unexplored';
  const quality = weightedQuality(recent);
  const distinctKinds = new Set(
    recent
      .filter((evidence) => evidence.correct && !evidence.revealed)
      .map((evidence) => evidence.kind),
  );
  const hasAdvancedSuccess = recent.some(
    (evidence) =>
      (evidence.difficulty === 'relation' ||
        evidence.difficulty === 'transfer') &&
      evidence.correct &&
      !evidence.revealed &&
      evidenceQuality(evidence) >= 0.6,
  );
  if (
    recent.length >= progressRules.solidMinimum &&
    quality >= progressRules.solidQuality &&
    distinctKinds.size >= progressRules.solidKinds &&
    hasAdvancedSuccess
  )
    return 'solid';
  if (
    recent.length >= progressRules.availableMinimum &&
    quality >= progressRules.availableQuality
  )
    return 'available';
  return 'developing';
}

export function calculateFreshness(
  lastSuccessfulAt: string | undefined,
  now: Date = new Date(),
): Freshness {
  if (!lastSuccessfulAt) return 'oxidized';
  const elapsedDays = Math.max(
    0,
    (now.getTime() - Date.parse(lastSuccessfulAt)) / 86_400_000,
  );
  if (elapsedDays >= progressRules.oxidizedAfterDays) return 'oxidized';
  if (elapsedDays >= progressRules.coolingAfterDays) return 'cooling';
  return 'fresh';
}

export function displayStatus(
  mastery: Mastery,
  freshness: Freshness,
): DisplayStatus {
  if (mastery === 'unexplored') return 'Sin explorar';
  if (mastery === 'developing') return 'En desarrollo';
  if (freshness === 'oxidized') return 'Para refrescar';
  return mastery === 'solid' ? 'Sólido' : 'Disponible';
}

export function getFamilyStatus(
  progress: readonly SkillProgress[],
): DisplayStatus {
  if (
    !progress.length ||
    progress.every((skill) => skill.mastery === 'unexplored')
  )
    return 'Sin explorar';
  if (progress.some((skill) => skill.status === 'Para refrescar'))
    return 'Para refrescar';
  if (progress.every((skill) => skill.mastery === 'solid')) return 'Sólido';
  if (
    progress.every(
      (skill) => skill.mastery === 'available' || skill.mastery === 'solid',
    )
  )
    return 'Disponible';
  return 'En desarrollo';
}

export function getSkillProgress(
  skillId: string,
  evidences: readonly Evidence[],
  now: Date = new Date(),
): SkillProgress {
  const all = evidences
    .filter((evidence) => evidence.skillId === skillId)
    .sort((a, b) => Date.parse(a.answeredAt) - Date.parse(b.answeredAt));
  const recent = recentRelevantEvidences(all);
  const mastery = calculateMastery(recent);
  const lastPracticedAt = all.at(-1)?.answeredAt;
  const lastSuccessfulAt = all
    .filter((evidence) => evidence.correct && !evidence.revealed)
    .at(-1)?.answeredAt;
  const freshness = calculateFreshness(lastSuccessfulAt, now);
  const errors = new Map<ErrorKind, number>();
  for (const evidence of recent) {
    if (!evidence.correct && evidence.errorKind)
      errors.set(evidence.errorKind, (errors.get(evidence.errorKind) ?? 0) + 1);
  }
  const recurringError = [...errors.entries()]
    .sort((a, b) => b[1] - a[1])
    .find(([, count]) => count >= progressRules.recurringErrorMinimum)?.[0];
  return {
    skillId,
    mastery,
    freshness,
    status: displayStatus(mastery, freshness),
    evidenceCount: recent.length,
    ...(lastPracticedAt ? { lastPracticedAt } : {}),
    ...(lastSuccessfulAt ? { lastSuccessfulAt } : {}),
    ...(recurringError ? { recurringError } : {}),
  };
}
