import type { Challenge, ChallengeStep } from '../../../shared/domain/types';

export interface DiagnosticItem {
  challenge: Challenge;
  step: ChallengeStep;
}

// Each selected step stands on its scenario alone: no preceding answer is needed.
const diagnosticSelection = [
  ['estimation-download-time', 'download-estimate'],
  ['proportion-travel-time', 'choose-operation'],
  ['percentage-headline', 'current-share'],
  ['estimation-magnitude-error', 'magnitude-debug'],
  ['units-commute-distance', 'kilometers-to-meters'],
  ['proportion-recipe-scale', 'scaled-rice'],
  ['data-graph-axis', 'read-values'],
  ['data-sample-claim', 'sample-decision'],
] as const;

export function selectDiagnostic(
  challenges: readonly Challenge[],
): DiagnosticItem[] {
  return diagnosticSelection.map(([challengeId, stepId]) => {
    const challenge = challenges.find(
      (candidate) => candidate.id === challengeId,
    );
    const step = challenge?.steps.find((candidate) => candidate.id === stepId);
    if (!challenge || !step) {
      throw new Error(
        `El catálogo no contiene el paso diagnóstico ${challengeId}/${stepId}.`,
      );
    }
    return { challenge, step };
  });
}
