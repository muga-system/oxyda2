import type { Evidence, PersistedStateV1 } from '../../../shared/domain/types';
import type { ProgressRepository } from '../domain/repository';

export function recordEvidences(
  repository: ProgressRepository,
  evidences: readonly Evidence[],
): PersistedStateV1 {
  const state = repository.load();
  const byId = new Map(
    state.evidences.map((evidence) => [evidence.id, evidence]),
  );
  for (const evidence of evidences) byId.set(evidence.id, evidence);
  repository.save({ ...state, evidences: [...byId.values()] });
  return repository.load();
}

export function completeChallenge(
  repository: ProgressRepository,
  id: string,
  onboarding = false,
): PersistedStateV1 {
  const state = repository.load();
  repository.save({
    ...state,
    onboardingCompleted: state.onboardingCompleted || onboarding,
    completedChallengeIds: [...new Set([...state.completedChallengeIds, id])],
  });
  return repository.load();
}

export function updatePreferences(
  repository: ProgressRepository,
  preferences: PersistedStateV1['preferences'],
): PersistedStateV1 {
  const state = repository.load();
  repository.save({
    ...state,
    preferences: { ...state.preferences, ...preferences },
  });
  return repository.load();
}
