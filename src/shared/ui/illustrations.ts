import type { FamilyId } from '../domain/types';

export interface Illustration {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
}

function pair(
  base: string,
  width: number,
  height: number,
  alt: string,
): Illustration {
  return {
    src: `${base}-640.png`,
    srcset: `${base}-320.png 320w, ${base}-640.png 640w`,
    width,
    height,
    alt,
  };
}

export const familyIllustrations: Record<FamilyId, Illustration> = {
  percentage: pair(
    '/learning/porcentajes',
    640,
    666,
    'Signo de porcentaje ilustrado con grecas',
  ),
  proportion: pair(
    '/learning/proporciones',
    640,
    624,
    'Dos engranajes conectados que representan una proporción',
  ),
  estimation: pair(
    '/learning/estimacion',
    640,
    628,
    'Dos filas de bloques que representan una estimación',
  ),
  units: pair(
    '/learning/unidades',
    640,
    648,
    'Una medida conectada que representa unidades',
  ),
  data: pair(
    '/learning/datos',
    640,
    668,
    'Una escalera de bloques que representa la lectura de datos',
  ),
};

export const areaIllustrations = {
  learn: pair(
    '/learning/aprender',
    640,
    612,
    'Un libro abierto que representa el aprendizaje',
  ),
  recall: pair(
    '/recall/recordar',
    640,
    639,
    'Una flecha circular que vuelve sobre una idea',
  ),
  diagnostic: pair(
    '/diagnostic/prueba',
    640,
    714,
    'Una pregunta que invita a poner a prueba una idea',
  ),
  map: pair('/map/mapa', 640, 664, 'Un mapa de ideas conectadas'),
} as const satisfies Record<string, Illustration>;
