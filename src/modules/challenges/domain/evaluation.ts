import type { ChallengeStep, ErrorKind } from '../../../shared/domain/types';

export type NumberParseResult =
  | { valid: true; value: number }
  | { valid: false; reason: 'empty' | 'format' | 'unit' };

const unitAliases: Record<string, readonly string[]> = {
  $: ['$', 'ars', 'peso', 'pesos'],
  '%': ['%', 'por ciento'],
  km: ['km', 'kilometro', 'kilometros'],
  m: ['m', 'metro', 'metros'],
  kg: ['kg', 'kilo', 'kilos', 'kilogramo', 'kilogramos'],
  g: ['g', 'gr', 'gramo', 'gramos'],
  l: ['l', 'litro', 'litros'],
  ml: ['ml', 'mililitro', 'mililitros'],
  h: ['h', 'hs', 'hora', 'horas'],
  min: ['min', 'minuto', 'minutos'],
  s: ['s', 'seg', 'segundo', 'segundos'],
};

function normalizeUnit(unit: string): string {
  return unit
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function canonicalUnit(unit: string): string {
  const normalized = normalizeUnit(unit);
  return (
    Object.entries(unitAliases).find(([, aliases]) =>
      aliases.includes(normalized),
    )?.[0] ?? normalized
  );
}

/** Spanish grouping takes precedence for 20.000; 0.125 remains a decimal. */
export function parseLocalizedNumber(
  raw: string,
  expectedUnit?: string,
): NumberParseResult {
  const input = raw.trim().replace(/[\u00a0\u202f]/g, ' ');
  if (!input) return { valid: false, reason: 'empty' };

  const parts = /^([^\d+\-.,]*)([+\-]?[\d][\d., ]*)([^\d]*)$/u.exec(input);
  if (!parts) return { valid: false, reason: 'format' };
  const prefix = parts[1]?.trim() ?? '';
  const suffix = parts[3]?.trim() ?? '';
  const suppliedUnits = [prefix, suffix].filter(Boolean);
  const canonicalExpected = expectedUnit
    ? canonicalUnit(expectedUnit)
    : undefined;
  for (const unit of suppliedUnits) {
    const canonical = canonicalUnit(unit);
    if (!canonicalExpected || canonical !== canonicalExpected) {
      const knownUnit = Object.keys(unitAliases).includes(canonical);
      return { valid: false, reason: knownUnit ? 'unit' : 'format' };
    }
  }

  let numeric = parts[2]?.trim() ?? '';
  // Spaces are accepted only as complete thousands groups, never as expressions.
  if (numeric.includes(' ')) {
    if (!/^[+\-]?\d{1,3}(?: \d{3})+(?:[.,]\d+)?$/.test(numeric)) {
      return { valid: false, reason: 'format' };
    }
    numeric = numeric.replaceAll(' ', '');
  }
  const hasComma = numeric.includes(',');
  const hasDot = numeric.includes('.');
  if (hasComma && hasDot) {
    if (/^[+\-]?\d{1,3}(?:\.\d{3})+,\d+$/.test(numeric)) {
      numeric = numeric.replaceAll('.', '').replace(',', '.');
    } else if (/^[+\-]?\d{1,3}(?:,\d{3})+\.\d+$/.test(numeric)) {
      numeric = numeric.replaceAll(',', '');
    } else return { valid: false, reason: 'format' };
  } else if (hasComma) {
    if (!/^[+\-]?\d+,\d+$/.test(numeric))
      return { valid: false, reason: 'format' };
    numeric = numeric.replace(',', '.');
  } else if (/^[+\-]?[1-9]\d{0,2}(?:\.\d{3})+$/.test(numeric)) {
    numeric = numeric.replaceAll('.', '');
  } else if (!/^[+\-]?\d+(?:\.\d+)?$/.test(numeric)) {
    return { valid: false, reason: 'format' };
  }
  const value = Number(numeric);
  return Number.isFinite(value)
    ? { valid: true, value }
    : { valid: false, reason: 'format' };
}

export interface AnswerEvaluation {
  valid: boolean;
  correct: boolean;
  errorKind?: ErrorKind;
  feedback: string;
}

const genericFeedback: Record<ErrorKind, string> = {
  'operation-selection':
    'Revisá qué relación une los datos antes de elegir una operación.',
  direction: 'Revisá desde qué cantidad partís y cuál querés encontrar.',
  calculation: 'Revisá el cálculo y comparalo con tu estimación.',
  unit: 'Revisá la unidad: el resultado debe expresarse en la unidad solicitada.',
  magnitude:
    'Revisá el orden de magnitud: ¿el resultado entra en la escala del problema?',
  interpretation: 'Revisá qué representa el resultado en esta situación.',
  concept: 'Volvé a la relación entre los datos de la situación.',
};

export function evaluateAnswer(
  step: ChallengeStep,
  raw: string,
): AnswerEvaluation {
  const answer = step.answer;
  if (answer.type === 'single-choice') {
    const option = answer.options.find((candidate) => candidate.id === raw);
    if (!option)
      return {
        valid: false,
        correct: false,
        feedback: 'Elegí una de las opciones para continuar.',
      };
    if (option.id === answer.correctOptionId)
      return { valid: true, correct: true, feedback: step.successFeedback };
    const errorKind = option.errorKind ?? 'concept';
    return {
      valid: true,
      correct: false,
      errorKind,
      feedback:
        option.feedback ??
        step.errorFeedback?.[errorKind] ??
        genericFeedback[errorKind],
    };
  }

  const parsed = parseLocalizedNumber(raw, answer.unit);
  if (!parsed.valid) {
    if (parsed.reason === 'unit')
      return {
        valid: true,
        correct: false,
        errorKind: 'unit',
        feedback: step.errorFeedback?.unit ?? genericFeedback.unit,
      };
    return {
      valid: false,
      correct: false,
      feedback:
        parsed.reason === 'empty'
          ? 'Escribí un número para continuar.'
          : 'Escribí un número, sin operaciones. Podés usar coma o punto decimal.',
    };
  }
  const tolerance = Math.max(0, answer.tolerance ?? 0);
  const margin =
    Number.EPSILON *
    Math.max(1, Math.abs(parsed.value), Math.abs(answer.expected)) *
    4;
  if (Math.abs(parsed.value - answer.expected) <= tolerance + margin)
    return { valid: true, correct: true, feedback: step.successFeedback };
  const knownError = answer.errors?.find(
    (error) => Math.abs(error.value - parsed.value) <= margin,
  );
  const errorKind = knownError?.kind ?? 'calculation';
  return {
    valid: true,
    correct: false,
    errorKind,
    feedback:
      knownError?.feedback ??
      step.errorFeedback?.[errorKind] ??
      genericFeedback[errorKind],
  };
}
