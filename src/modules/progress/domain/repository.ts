import type { PersistedStateV1 } from '../../../shared/domain/types';

export interface RepositoryStatus {
  kind: 'ready' | 'memory' | 'corrupt' | 'incompatible';
  message?: string;
}

export interface ProgressRepository {
  load(): PersistedStateV1;
  save(state: PersistedStateV1): void;
  readonly status: RepositoryStatus;
}

export function createEmptyState(): PersistedStateV1 {
  return {
    schemaVersion: 1,
    onboardingCompleted: false,
    evidences: [],
    completedChallengeIds: [],
    preferences: {},
  };
}
