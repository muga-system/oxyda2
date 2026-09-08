import { useCallback, useEffect, useRef, useState } from 'react';
import type { Evidence, PersistedStateV1 } from '../../../shared/domain/types';
import { createBrowserProgressRepository } from '../infrastructure/local-storage-repository';
import { completeChallenge, recordEvidences } from '../application/progress';

const emptyState: PersistedStateV1 = {
  schemaVersion: 1,
  onboardingCompleted: false,
  evidences: [],
  completedChallengeIds: [],
  preferences: {},
};

export function useProgress() {
  const repository = useRef<ReturnType<
    typeof createBrowserProgressRepository
  > | null>(null);
  const [snapshot, setSnapshot] = useState<PersistedStateV1>(emptyState);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string>();

  const refresh = useCallback(() => {
    const current = repository.current;
    if (!current) return;
    const state = current.load();
    setSnapshot(state);
    setMessage(current.status.message);
    document.documentElement.dataset.reducedMotion = String(
      state.preferences.reducedMotionOverride ?? false,
    );
  }, []);

  useEffect(() => {
    repository.current = createBrowserProgressRepository();
    refresh();
    setReady(true);
    window.addEventListener('storage', refresh);
    window.addEventListener('pageshow', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, [refresh]);

  const record = useCallback(
    (evidences: Evidence[]) => {
      if (!repository.current) return;
      recordEvidences(repository.current, evidences);
      refresh();
    },
    [refresh],
  );

  const complete = useCallback(
    (id: string, onboarding = false) => {
      if (!repository.current) return;
      completeChallenge(repository.current, id, onboarding);
      refresh();
    },
    [refresh],
  );

  return { snapshot, ready, message, record, complete };
}
