import type { Challenge } from '../../shared/domain/types';
import { percentageChallenges } from './percentage';
import { proportionChallenges } from './proportion';
import { estimationChallenges } from './estimation';
import { unitsChallenges } from './units';
import { dataChallenges } from './data';

export const challenges: Challenge[] = [
  ...percentageChallenges,
  ...proportionChallenges,
  ...estimationChallenges,
  ...unitsChallenges,
  ...dataChallenges,
] satisfies Challenge[];
