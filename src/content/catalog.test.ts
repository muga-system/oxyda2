import { describe, expect, it } from 'vitest';
import { evaluateAnswer } from '../modules/challenges/domain/evaluation';
import {
  challengeKinds,
  difficulties,
  errorKinds,
} from '../shared/domain/types';
import { challenges } from './challenges';
import { recallCards } from './recall';
import { families, skills } from './skills';

const requiredIds = [
  'percentage-discount-compare',
  'percentage-reverse-price',
  'percentage-successive-change',
  'percentage-headline',
  'proportion-unit-price',
  'proportion-recipe-scale',
  'proportion-travel-time',
  'proportion-map-scale',
  'estimation-download-time',
  'estimation-event-capacity',
  'estimation-grocery-total',
  'estimation-magnitude-error',
  'units-recipe-volume',
  'units-commute-distance',
  'units-schedule-time',
  'units-weight-price',
  'data-mean-outlier',
  'data-median-salaries',
  'data-graph-axis',
  'data-sample-claim',
];

describe('catálogo v0.1', () => {
  it('incluye los 20 escenarios, 18 habilidades, cinco familias y diez fichas', () => {
    expect(challenges.map(({ id }) => id)).toEqual(requiredIds);
    expect(skills).toHaveLength(18);
    expect(families).toHaveLength(5);
    expect(recallCards).toHaveLength(10);
    for (const collection of [challenges, skills, families, recallCards]) {
      expect(new Set(collection.map(({ id }) => id)).size).toBe(
        collection.length,
      );
    }
  });

  it('conserva la secuencia guiada sin ampliar ChallengeKind', () => {
    const first = challenges[0]!;
    expect(first.id).toBe('percentage-discount-compare');
    expect(first.steps.map(({ kind }) => kind)).toEqual([
      'recognize',
      'estimate',
      'calculate',
      'decide',
      'recognize',
    ]);
    expect(first.steps.at(-1)?.label).toBe('Verificar');
  });

  it('cada microhabilidad tiene explicación, ejemplo y un desafío que produce evidencia', () => {
    for (const skill of skills) {
      expect(families.some(({ id }) => id === skill.familyId)).toBe(true);
      expect(skill.idea.length).toBeGreaterThan(40);
      expect(skill.example.length).toBeGreaterThan(40);
      expect(
        challenges.some(
          (challenge) =>
            challenge.skillIds.includes(skill.id) &&
            challenge.steps.some((step) => step.skillIds.includes(skill.id)),
        ),
      ).toBe(true);
    }
    for (const family of families)
      expect(
        challenges.filter(({ familyId }) => familyId === family.id),
      ).toHaveLength(4);
  });

  it('todas las referencias son válidas y los pasos tienen feedback pedagógico', () => {
    const skillIds = new Set(skills.map(({ id }) => id));
    for (const challenge of challenges) {
      expect(challenge.steps.length).toBeGreaterThanOrEqual(3);
      expect(new Set(challenge.steps.map(({ id }) => id)).size).toBe(
        challenge.steps.length,
      );
      expect(challenge.takeaway.length).toBeGreaterThan(30);
      for (const id of challenge.skillIds) expect(skillIds.has(id)).toBe(true);
      for (const step of challenge.steps) {
        expect(challengeKinds).toContain(step.kind);
        expect(difficulties).toContain(step.difficulty);
        expect(step.skillIds.length).toBeGreaterThan(0);
        for (const id of step.skillIds)
          expect(challenge.skillIds).toContain(id);
        expect(step.explanation.length).toBeGreaterThan(30);
        expect(step.successFeedback.length).toBeGreaterThan(10);
        expect(step.hints?.[0]?.length).toBeGreaterThan(15);
        if (step.answer.type === 'single-choice') {
          const answer = step.answer;
          expect(
            answer.options.filter(({ id }) => id === answer.correctOptionId),
          ).toHaveLength(1);
          expect(new Set(answer.options.map(({ id }) => id)).size).toBe(
            answer.options.length,
          );
          for (const option of answer.options) {
            const result = evaluateAnswer(step, option.id);
            expect(result.valid).toBe(true);
            expect(result.correct).toBe(option.id === answer.correctOptionId);
            if (option.id !== answer.correctOptionId) {
              expect(errorKinds).toContain(option.errorKind);
              expect(option.feedback?.length).toBeGreaterThan(20);
            }
          }
        } else {
          const answer = step.answer;
          expect(Number.isFinite(answer.expected)).toBe(true);
          expect(evaluateAnswer(step, String(answer.expected)).correct).toBe(
            true,
          );
          expect(
            evaluateAnswer(
              step,
              new Intl.NumberFormat('es-AR').format(answer.expected),
            ).correct,
          ).toBe(true);
          expect(answer.errors?.length).toBeGreaterThan(0);
          for (const error of answer.errors ?? []) {
            expect(error.value).not.toBe(answer.expected);
            const result = evaluateAnswer(step, String(error.value));
            expect(result.correct).toBe(false);
            expect(result.errorKind).toBe(error.kind);
          }
        }
      }
    }
  });

  it('valida los resultados numéricos contra las cantidades de cada escenario', () => {
    const results: Record<string, number> = {
      'percentage-discount-compare/discount-amount': (80000 * 25) / 100,
      'percentage-reverse-price/original-price': 64000 / (1 - 20 / 100),
      'percentage-headline/current-share': (10 / 200) * 100,
      'proportion-unit-price/price-per-kilo': 3600 / (750 / 1000),
      'proportion-recipe-scale/scaled-rice': (300 / 6) * 14,
      'proportion-travel-time/travel-minutes': (150 / 60) * 60,
      'proportion-map-scale/real-distance': (6 * 50000) / 100 / 1000,
      'estimation-download-time/download-seconds': 600 / 10,
      'estimation-grocery-total/grocery-estimate': 2000 + 3000 + 4000,
      'estimation-magnitude-error/correct-total': 24 * 1500,
      'units-recipe-volume/total-milliliters': 250 * 3,
      'units-commute-distance/commute-total': (850 + 1.2 * 1000) / 1000,
      'units-schedule-time/total-duration': 18 + 42 + 15,
      'units-weight-price/quarter-kilo-price': (8000 * 250) / 1000,
      'data-mean-outlier/mean-time': (10 + 10 + 10 + 10 + 60) / 5,
    };
    let covered = 0;
    for (const challenge of challenges) {
      for (const step of challenge.steps) {
        if (step.answer.type !== 'numeric') continue;
        const independentlyCalculated = results[`${challenge.id}/${step.id}`];
        expect(independentlyCalculated).toBeDefined();
        expect(step.answer.expected).toBeCloseTo(independentlyCalculated!, 8);
        covered++;
      }
    }
    expect(covered).toBe(Object.keys(results).length);
  });

  it('incluye un gráfico truncado verificable y fichas con ejercicios existentes', () => {
    const chart = challenges.find(({ id }) => id === 'data-graph-axis')!.chart!;
    expect(chart.baseline).toBe(90);
    expect(chart.values.map(({ value }) => value)).toEqual([95, 100]);
    for (const card of recallCards) {
      expect(challenges.some(({ id }) => id === card.challengeId)).toBe(true);
      expect(families.some(({ id }) => id === card.familyId)).toBe(true);
      expect(card.idea.length).toBeGreaterThan(30);
      expect(card.example.length).toBeGreaterThan(30);
      expect(card.keywords.length).toBeGreaterThan(1);
    }
  });
});
