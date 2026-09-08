import type { ChallengeKind, Difficulty, ErrorKind } from '../domain/types';

export const kindLabels: Record<ChallengeKind, string> = {
  recognize: 'Reconocer',
  estimate: 'Estimar',
  calculate: 'Resolver',
  debug: 'Revisar un razonamiento',
  compare: 'Comparar',
  reverse: 'Volver al origen',
  decide: 'Decidir',
};
export const difficultyLabels: Record<Difficulty, string> = {
  foundation: 'Fundamento',
  application: 'Aplicación',
  relation: 'Relación',
  transfer: 'Transferencia',
};
export const errorLabels: Record<ErrorKind, string> = {
  'operation-selection': 'Elegir la operación',
  direction: 'Reconocer la dirección de la relación',
  calculation: 'Revisar el cálculo',
  unit: 'Trabajar con la misma unidad',
  magnitude: 'Revisar la escala del resultado',
  interpretation: 'Interpretar qué representa el número',
  concept: 'Conectar la idea con la situación',
};
