import { describe, expect, it } from 'vitest';
import type { ChallengeStep } from '../../../shared/domain/types';
import { evaluateAnswer, parseLocalizedNumber } from './evaluation';

const choice: ChallengeStep = {
  id: 'recognize',
  kind: 'recognize',
  difficulty: 'foundation',
  prompt: '¿Qué comparás?',
  skillIds: ['percentage.change'],
  answer: {
    type: 'single-choice',
    correctOptionId: 'money',
    options: [
      { id: 'money', label: 'Descuentos en pesos' },
      {
        id: 'raw',
        label: '25 y 18.000',
        errorKind: 'unit',
        feedback: 'Son unidades diferentes.',
      },
    ],
  },
  successFeedback: 'Ambos descuentos están en pesos.',
  explanation: 'Una misma unidad permite comparar.',
};
const numeric: ChallengeStep = {
  ...choice,
  id: 'calculate',
  kind: 'calculate',
  answer: {
    type: 'numeric',
    expected: 20000,
    unit: '$',
    errors: [
      {
        value: 60000,
        kind: 'interpretation',
        feedback: 'Ese es el precio final, no el descuento.',
      },
    ],
  },
};

describe('localized numeric input', () => {
  it.each([
    ['20.000', 20000],
    ['80000', 80000],
    ['80.000', 80000],
    ['1.234.567', 1234567],
    ['2,5', 2.5],
    ['2.5', 2.5],
    ['0.125', 0.125],
    ['0,125', 0.125],
    ['2,000', 2],
    ['1.234,50', 1234.5],
    ['1,234.50', 1234.5],
    ['20 000', 20000],
    ['20\u00a0000', 20000],
    ['-2,5', -2.5],
  ])('parses %s deterministically', (raw, value) => {
    expect(parseLocalizedNumber(raw)).toEqual({ valid: true, value });
  });
  it.each([
    ['$ 20.000', '$', 20000],
    ['20.000 pesos', '$', 20000],
    ['2.05 kilómetros', 'km', 2.05],
    ['2,5 litros', 'l', 2.5],
    ['500 g', 'g', 500],
    ['25%', '%', 25],
  ])('normalizes compatible unit in %s', (raw, unit, value) => {
    expect(parseLocalizedNumber(raw, unit)).toEqual({ valid: true, value });
  });
  it.each([
    '1+1',
    '20 / 2',
    'Math.random()',
    'Infinity',
    'NaN',
    '1e3',
    '2,5,5',
    '1.00.000',
    '20 00',
    '2.5 apples',
    '1<2',
    '--2',
  ])('rejects %s', (raw) => {
    expect(parseLocalizedNumber(raw).valid).toBe(false);
  });
  it('distinguishes unit mismatch and empty input', () => {
    expect(parseLocalizedNumber('2 m', 'km')).toEqual({
      valid: false,
      reason: 'unit',
    });
    expect(parseLocalizedNumber(' ')).toEqual({
      valid: false,
      reason: 'empty',
    });
  });
});

describe('answer evaluation', () => {
  it('evaluates an actual choice and its conceptual error', () => {
    expect(evaluateAnswer(choice, 'money')).toMatchObject({
      valid: true,
      correct: true,
    });
    expect(evaluateAnswer(choice, 'raw')).toMatchObject({
      valid: true,
      correct: false,
      errorKind: 'unit',
      feedback: 'Son unidades diferentes.',
    });
    expect(evaluateAnswer(choice, 'forged')).toMatchObject({
      valid: false,
      correct: false,
    });
  });
  it('accepts money and distinguishes a known wrong result', () => {
    expect(evaluateAnswer(numeric, '$20.000')).toMatchObject({
      valid: true,
      correct: true,
    });
    expect(evaluateAnswer(numeric, '60000')).toMatchObject({
      correct: false,
      errorKind: 'interpretation',
    });
    expect(evaluateAnswer(numeric, ' ')).toMatchObject({ valid: false });
    expect(evaluateAnswer(numeric, '20 kg')).toMatchObject({
      valid: true,
      errorKind: 'unit',
    });
  });
  it('honors tolerance including floating point boundaries', () => {
    const toleranceStep: ChallengeStep = {
      ...numeric,
      answer: { type: 'numeric', expected: 2.1, tolerance: 0.1 },
    };
    expect(evaluateAnswer(toleranceStep, '2.2').correct).toBe(true);
    expect(evaluateAnswer(toleranceStep, '1.99').correct).toBe(false);
    const exactStep: ChallengeStep = {
      ...numeric,
      answer: { type: 'numeric', expected: 0.1 + 0.2 },
    };
    expect(evaluateAnswer(exactStep, '0.3').correct).toBe(true);
  });
});
