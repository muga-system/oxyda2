import { describe, expect, it } from 'vitest';
import { challenges } from '../../../content/challenges';
import { selectDiagnostic } from './selectDiagnostic';

describe('selección del diagnóstico', () => {
  it('elige ocho situaciones distintas con la mezcla conceptual requerida', () => {
    const selection = selectDiagnostic(challenges);
    expect(selection).toHaveLength(8);
    expect(new Set(selection.map(({ challenge }) => challenge.id)).size).toBe(
      8,
    );
    expect(selection.map(({ step }) => step.id)).toEqual([
      'download-estimate',
      'choose-operation',
      'current-share',
      'magnitude-debug',
      'kilometers-to-meters',
      'scaled-rice',
      'read-values',
      'sample-decision',
    ]);
    expect(
      new Set(selection.map(({ challenge }) => challenge.familyId)).size,
    ).toBe(5);
    expect(new Set(selection.map(({ step }) => step.answer.type))).toEqual(
      new Set(['single-choice', 'numeric']),
    );
    expect(
      selection.some(
        ({ challenge }) => challenge.id === 'percentage-discount-compare',
      ),
    ).toBe(false);
  });

  it('no depende del orden del catálogo y no modifica su contenido', () => {
    const before = JSON.stringify(challenges);
    expect(selectDiagnostic([...challenges].reverse())).toEqual(
      selectDiagnostic(challenges),
    );
    expect(selectDiagnostic(challenges)).toEqual(selectDiagnostic(challenges));
    expect(JSON.stringify(challenges)).toBe(before);
  });

  it('falla explícitamente si falta un escenario obligatorio', () => {
    expect(() => selectDiagnostic([])).toThrow('paso diagnóstico');
  });
});
