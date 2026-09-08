import type {
  Challenge,
  ChallengeStep,
  Evidence,
  EvidenceSource,
} from '../../../shared/domain/types';
import { evaluateAnswer, type AnswerEvaluation } from '../domain/evaluation';

export interface AttemptContext {
  attempts: number;
  usedHint: boolean;
  mode: 'normal' | 'diagnostic';
}
export interface AttemptResult {
  evaluation: AnswerEvaluation;
  attempts: number;
  usedHint: boolean;
  done: boolean;
  revealed: boolean;
}

export const UNKNOWN_ANSWER = '__unknown__';

export function resolveAttempt(
  step: ChallengeStep,
  raw: string,
  context: AttemptContext,
): AttemptResult {
  const evaluation: AnswerEvaluation =
    context.mode === 'diagnostic' && raw === UNKNOWN_ANSWER
      ? {
          valid: true,
          correct: false,
          feedback: 'Queda como una relación para explorar.',
        }
      : evaluateAnswer(step, raw);
  const attempts = context.attempts + (evaluation.valid ? 1 : 0);
  const done =
    evaluation.valid &&
    (evaluation.correct || context.mode === 'diagnostic' || attempts >= 2);
  // Diagnostic failures are independent evidence, not a guided solution.
  const revealed = done && !evaluation.correct && context.mode === 'normal';
  return {
    evaluation,
    attempts,
    usedHint: context.mode === 'normal' && context.usedHint,
    done,
    revealed,
  };
}

export interface EvidenceContext {
  id: string;
  sessionId: string;
  source: EvidenceSource;
  answeredAt: string;
}

export function makeEvidences(
  challenge: Challenge,
  step: ChallengeStep,
  result: AttemptResult,
  context: EvidenceContext,
): Evidence[] {
  if (!result.evaluation.valid) return [];
  return [...new Set(step.skillIds)].map((skillId) => ({
    id: `${context.id}:${skillId}`,
    sessionId: context.sessionId,
    skillId,
    challengeId: challenge.id,
    stepId: step.id,
    source: context.source,
    difficulty: step.difficulty,
    kind: step.kind,
    correct: result.evaluation.correct,
    usedHint: result.usedHint,
    attempts: result.attempts,
    revealed: result.revealed,
    ...(result.evaluation.errorKind
      ? { errorKind: result.evaluation.errorKind }
      : {}),
    answeredAt: context.answeredAt,
  }));
}
