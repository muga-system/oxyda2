import { describe, expect, it } from 'vitest';
import type { Evidence, SkillProgress } from '../../../shared/domain/types';
import {
  calculateFreshness,
  calculateMastery,
  displayStatus,
  evidenceQuality,
  getFamilyStatus,
  getSkillProgress,
  recentRelevantEvidences,
  weightedQuality,
} from './progress';

function evidence(id: number, overrides: Partial<Evidence> = {}): Evidence {
  return {
    id: String(id),
    sessionId: 'session-' + id,
    skillId: 'percentage.change',
    challengeId: 'discount',
    stepId: 'calculate',
    source: 'challenge',
    difficulty: 'foundation',
    kind: 'calculate',
    correct: true,
    usedHint: false,
    attempts: 1,
    revealed: false,
    answeredAt: new Date(Date.UTC(2026, 8, 1, 0, id)).toISOString(),
    ...overrides,
  };
}
const setOf = (count: number, overrides: Partial<Evidence> = {}): Evidence[] =>
  Array.from({ length: count }, (_, index) => evidence(index, overrides));

describe('evidence quality and mastery', () => {
  it('tracks independent, supported, retried, revealed and incorrect answers', () => {
    expect(evidenceQuality(evidence(0))).toBe(1);
    expect(evidenceQuality(evidence(0, { usedHint: true }))).toBe(0.75);
    expect(evidenceQuality(evidence(0, { attempts: 2, usedHint: true }))).toBe(
      0.6,
    );
    expect(
      evidenceQuality(
        evidence(0, { correct: false, revealed: true, attempts: 2 }),
      ),
    ).toBe(0.25);
    expect(evidenceQuality(evidence(0, { correct: false }))).toBe(0);
    expect(
      weightedQuality([
        evidence(0),
        evidence(1, { difficulty: 'transfer', correct: false }),
      ]),
    ).toBeCloseTo(1 / 2.4);
  });
  it('requires a minimum count and weighted quality for availability', () => {
    expect(calculateMastery([])).toBe('unexplored');
    expect(calculateMastery(setOf(3))).toBe('developing');
    expect(calculateMastery(setOf(4))).toBe('available');
    expect(calculateMastery(setOf(4, { attempts: 2 }))).toBe('developing');
    expect(calculateMastery(setOf(4, { usedHint: true }))).toBe('available');
  });
  it('requires breadth and advanced success for solid mastery', () => {
    const candidates = setOf(8);
    expect(calculateMastery(candidates)).toBe('available');
    candidates[0] = evidence(0, { kind: 'recognize', difficulty: 'relation' });
    candidates[1] = evidence(1, { kind: 'decide' });
    expect(calculateMastery(candidates)).toBe('solid');
    candidates[0] = evidence(0, {
      kind: 'recognize',
      difficulty: 'relation',
      correct: false,
    });
    expect(calculateMastery(candidates)).toBe('available');
  });
  it('counts retries as one relevant step while retaining the final quality', () => {
    const attempts = [
      evidence(0, { sessionId: 'same', correct: false }),
      evidence(1, { sessionId: 'same', attempts: 2 }),
    ];
    expect(recentRelevantEvidences(attempts)).toHaveLength(1);
    expect(weightedQuality(recentRelevantEvidences(attempts))).toBe(0.6);
    expect(calculateMastery([...attempts, ...attempts])).toBe('developing');
    expect(
      recentRelevantEvidences([
        attempts[0]!,
        evidence(2, { sessionId: 'same', stepId: 'decide' }),
      ]),
    ).toHaveLength(2);
  });
  it('uses the latest 12 relevant answers instead of historical totals', () => {
    const history = [
      ...setOf(20),
      ...Array.from({ length: 12 }, (_, index) =>
        evidence(20 + index, { correct: false }),
      ),
    ];
    expect(recentRelevantEvidences(history)).toHaveLength(12);
    expect(calculateMastery(history)).toBe('developing');
  });
});

describe('freshness and visible state', () => {
  const practicedAt = '2026-08-01T12:00:00.000Z';
  it.each([
    [0, 'fresh'],
    [13, 'fresh'],
    [14, 'cooling'],
    [29, 'cooling'],
    [30, 'oxidized'],
    [80, 'oxidized'],
  ] as const)('uses boundary %s days', (days, freshness) => {
    expect(
      calculateFreshness(
        practicedAt,
        new Date(Date.parse(practicedAt) + days * 86400000),
      ),
    ).toBe(freshness);
  });
  it('does not erase mastery when time passes', () => {
    const history = setOf(8);
    history[0] = evidence(0, { kind: 'recognize', difficulty: 'transfer' });
    history[1] = evidence(1, { kind: 'decide' });
    const progress = getSkillProgress(
      'percentage.change',
      history,
      new Date('2026-11-01T00:00:00.000Z'),
    );
    expect(progress).toMatchObject({
      mastery: 'solid',
      freshness: 'oxidized',
      status: 'Para refrescar',
      evidenceCount: 8,
    });
    expect(getSkillProgress('units.time', history).status).toBe('Sin explorar');
  });
  it('unsuccessful practice does not refresh last success or claim an error from No sé', () => {
    const history = [
      evidence(0, { answeredAt: practicedAt }),
      evidence(1, { correct: false, answeredAt: '2026-09-01T12:00:00.000Z' }),
    ];
    expect(
      getSkillProgress(
        'percentage.change',
        history,
        new Date('2026-09-08T12:00:00.000Z'),
      ),
    ).toMatchObject({ freshness: 'oxidized', lastSuccessfulAt: practicedAt });
    expect(
      getSkillProgress('percentage.change', history).recurringError,
    ).toBeUndefined();
    const repeated = setOf(3, { correct: false, errorKind: 'unit' });
    expect(getSkillProgress('percentage.change', repeated).recurringError).toBe(
      'unit',
    );
    expect(
      getSkillProgress('percentage.change', repeated.slice(0, 2))
        .recurringError,
    ).toBeUndefined();
  });
  it('composes text from mastery and freshness', () => {
    expect(displayStatus('unexplored', 'oxidized')).toBe('Sin explorar');
    expect(displayStatus('developing', 'oxidized')).toBe('En desarrollo');
    expect(displayStatus('available', 'cooling')).toBe('Disponible');
    expect(displayStatus('solid', 'fresh')).toBe('Sólido');
    expect(displayStatus('available', 'oxidized')).toBe('Para refrescar');
    expect(calculateFreshness(undefined)).toBe('oxidized');
    expect(calculateFreshness(practicedAt, new Date('2026-07-01'))).toBe(
      'fresh',
    );
  });
  it('family summary requires all skills to be available or solid', () => {
    const skill = (
      mastery: SkillProgress['mastery'],
      freshness: SkillProgress['freshness'] = 'fresh',
    ): SkillProgress => ({
      skillId: 'skill',
      mastery,
      freshness,
      status: displayStatus(mastery, freshness),
      evidenceCount: 4,
    });
    expect(getFamilyStatus([])).toBe('Sin explorar');
    expect(getFamilyStatus([skill('unexplored')])).toBe('Sin explorar');
    expect(getFamilyStatus([skill('solid'), skill('unexplored')])).toBe(
      'En desarrollo',
    );
    expect(getFamilyStatus([skill('solid'), skill('available')])).toBe(
      'Disponible',
    );
    expect(getFamilyStatus([skill('solid'), skill('solid')])).toBe('Sólido');
    expect(
      getFamilyStatus([skill('solid', 'oxidized'), skill('unexplored')]),
    ).toBe('Para refrescar');
  });
});
