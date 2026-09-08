import { describe, expect, it } from 'vitest';
import type { Challenge, ChallengeStep } from '../../../shared/domain/types';
import { makeEvidences, resolveAttempt, UNKNOWN_ANSWER } from './attempts';

const step: ChallengeStep = {
  id: 'discount',
  kind: 'calculate',
  difficulty: 'application',
  prompt: '¿Cuánto es el descuento?',
  skillIds: ['percentage.change', 'estimation.reasonableness'],
  answer: { type: 'numeric', expected: 20000, unit: '$' },
  successFeedback: 'El descuento es de $20.000.',
  explanation: 'Un cuarto de $80.000 es $20.000.',
};
const challenge: Challenge = {
  id: 'campera',
  slug: 'campera',
  familyId: 'percentage',
  title: 'La campera',
  scenario: 'Descuento de 25%.',
  skillIds: step.skillIds,
  steps: [step],
  takeaway: 'Comparar en la misma unidad.',
};

describe('attempt flow', () => {
  it('allows one retry, then reveals, without counting malformed input', () => {
    const invalid = resolveAttempt(step, '', {
      attempts: 0,
      usedHint: false,
      mode: 'normal',
    });
    expect(invalid).toMatchObject({
      attempts: 0,
      done: false,
      revealed: false,
    });
    const first = resolveAttempt(step, '20', {
      attempts: 0,
      usedHint: false,
      mode: 'normal',
    });
    expect(first).toMatchObject({ attempts: 1, done: false, revealed: false });
    const second = resolveAttempt(step, '25', {
      attempts: 1,
      usedHint: true,
      mode: 'normal',
    });
    expect(second).toMatchObject({
      attempts: 2,
      done: true,
      revealed: true,
      usedHint: true,
    });
    const corrected = resolveAttempt(step, '20000', {
      attempts: 1,
      usedHint: true,
      mode: 'normal',
    });
    expect(corrected).toMatchObject({
      attempts: 2,
      done: true,
      revealed: false,
      usedHint: true,
    });
  });
  it('diagnostic gives one independent answer and supports No sé', () => {
    const wrong = resolveAttempt(step, '20', {
      attempts: 0,
      usedHint: true,
      mode: 'diagnostic',
    });
    expect(wrong).toMatchObject({
      done: true,
      revealed: false,
      usedHint: false,
    });
    const unknown = resolveAttempt(step, UNKNOWN_ANSWER, {
      attempts: 0,
      usedHint: false,
      mode: 'diagnostic',
    });
    expect(unknown).toMatchObject({
      attempts: 1,
      done: true,
      evaluation: { valid: true, correct: false },
    });
    expect(unknown.evaluation.errorKind).toBeUndefined();
  });
  it('creates distinct evidence for each skill with independence and session context', () => {
    const result = resolveAttempt(step, '20000', {
      attempts: 1,
      usedHint: true,
      mode: 'normal',
    });
    const context = {
      id: 'answer',
      sessionId: 'session',
      source: 'learning' as const,
      answeredAt: '2026-09-08T12:00:00.000Z',
    };
    const evidences = makeEvidences(challenge, step, result, context);
    expect(evidences).toHaveLength(2);
    expect(new Set(evidences.map((evidence) => evidence.id)).size).toBe(2);
    expect(evidences[0]).toMatchObject({
      source: 'learning',
      sessionId: 'session',
      attempts: 2,
      usedHint: true,
      correct: true,
      revealed: false,
    });
    expect(
      makeEvidences(
        challenge,
        step,
        resolveAttempt(step, '', {
          attempts: 0,
          usedHint: false,
          mode: 'normal',
        }),
        context,
      ),
    ).toEqual([]);
  });
});
