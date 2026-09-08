import type {
  ChallengeKind,
  ChallengeStep,
  ChoiceOption,
  Difficulty,
  ErrorKind,
} from '../../shared/domain/types';

type StepInput = {
  id: string;
  kind: ChallengeKind;
  difficulty: Difficulty;
  prompt: string;
  skillIds: string[];
  hint: string;
  success: string;
  explanation: string;
  label?: string;
  debug?: string;
};

export function choice(
  input: StepInput & { options: ChoiceOption[]; correct: string },
): ChallengeStep {
  const { hint, success, options, correct, ...step } = input;
  return {
    ...step,
    hints: [hint],
    successFeedback: success,
    answer: { type: 'single-choice', options, correctOptionId: correct },
  };
}

export function numeric(
  input: StepInput & {
    expected: number;
    unit?: string;
    tolerance?: number;
    errors: { value: number; kind: ErrorKind; feedback: string }[];
  },
): ChallengeStep {
  const { hint, success, expected, unit, tolerance, errors, ...step } = input;
  return {
    ...step,
    hints: [hint],
    successFeedback: success,
    answer: {
      type: 'numeric',
      expected,
      ...(unit ? { unit } : {}),
      ...(tolerance !== undefined ? { tolerance } : {}),
      errors,
    },
    errorFeedback: {
      calculation:
        'Revisá la cuenta y qué representa el resultado. Usá la pista si necesitás orientar el cálculo.',
      unit: 'Revisá la unidad pedida antes de responder.',
    },
  };
}

export function option(
  id: string,
  label: string,
  errorKind?: ErrorKind,
  feedback?: string,
): ChoiceOption {
  return {
    id,
    label,
    ...(errorKind ? { errorKind } : {}),
    ...(feedback ? { feedback } : {}),
  };
}
