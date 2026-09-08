import { describe, expect, it } from 'vitest';
import type { Evidence } from '../../../shared/domain/types';
import {
  completeChallenge,
  recordEvidences,
  updatePreferences,
} from '../application/progress';
import { createEmptyState } from '../domain/repository';
import {
  createBrowserProgressRepository,
  deserializeProgress,
  LocalStorageProgressRepository,
  PROGRESS_STORAGE_KEY,
  serializeProgress,
  type StorageLike,
} from './local-storage-repository';

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();
  writes = 0;
  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.writes += 1;
    this.values.set(key, value);
  }
}
const answer: Evidence = {
  id: 'answer-1',
  sessionId: 'session-1',
  skillId: 'percentage.change',
  challengeId: 'discount',
  stepId: 'calculate',
  source: 'challenge',
  kind: 'calculate',
  difficulty: 'application',
  correct: true,
  usedHint: false,
  attempts: 1,
  revealed: false,
  answeredAt: '2026-09-08T12:00:00.000Z',
};

describe('versioned progress and application boundary', () => {
  it('persists the first experience, complete evidence and preferences after reopening', () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageProgressRepository(storage);
    expect(repository.load()).toEqual(createEmptyState());
    recordEvidences(repository, [answer]);
    completeChallenge(repository, 'discount', true);
    completeChallenge(repository, 'discount');
    updatePreferences(repository, { reducedMotionOverride: true });
    const reopened = new LocalStorageProgressRepository(storage);
    expect(reopened.load()).toEqual({
      schemaVersion: 1,
      onboardingCompleted: true,
      evidences: [answer],
      completedChallengeIds: ['discount'],
      preferences: { reducedMotionOverride: true },
    });
    expect(reopened.status.kind).toBe('ready');
  });
  it('round-trips state and rejects malformed evidence and preferences', () => {
    const state = { ...createEmptyState(), evidences: [answer] };
    expect(deserializeProgress(serializeProgress(state))).toEqual({
      ok: true,
      state,
    });
    for (const patch of [
      { attempts: 0 },
      { correct: 'true' },
      { errorKind: 'unknown' },
      { answeredAt: 'yesterday' },
      { sessionId: 12 },
      { difficulty: 'hard' },
    ]) {
      expect(
        deserializeProgress(
          JSON.stringify({ ...state, evidences: [{ ...answer, ...patch }] }),
        ),
      ).toEqual({ ok: false, reason: 'corrupt' });
    }
    expect(
      deserializeProgress(
        JSON.stringify({
          ...state,
          preferences: { reducedMotionOverride: 'yes' },
        }),
      ),
    ).toEqual({ ok: false, reason: 'corrupt' });
    expect(deserializeProgress('null')).toEqual({
      ok: false,
      reason: 'corrupt',
    });
  });
  it.each([
    ['{bad json', 'corrupt'],
    [JSON.stringify({ schemaVersion: 5, important: 'keep' }), 'incompatible'],
    [JSON.stringify({ schemaVersion: 1 }), 'corrupt'],
  ] as const)('preserves unreadable raw data for %s', (raw, kind) => {
    const storage = new MemoryStorage();
    storage.values.set(PROGRESS_STORAGE_KEY, raw);
    const repository = new LocalStorageProgressRepository(storage);
    expect(repository.load()).toEqual(createEmptyState());
    expect(repository.status).toMatchObject({
      kind,
      message: expect.any(String),
    });
    recordEvidences(repository, [answer]);
    completeChallenge(repository, 'discount', true);
    expect(repository.load().evidences).toEqual([answer]);
    expect(repository.load().onboardingCompleted).toBe(true);
    expect(storage.values.get(PROGRESS_STORAGE_KEY)).toBe(raw);
    expect(storage.writes).toBe(0);
  });
  it('continues in memory when access is denied or quota is exceeded', () => {
    const denied = new LocalStorageProgressRepository(() => {
      throw new Error('SecurityError');
    });
    recordEvidences(denied, [answer]);
    expect(denied.load().evidences).toEqual([answer]);
    expect(denied.status.kind).toBe('memory');
    const full = new LocalStorageProgressRepository({
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    });
    completeChallenge(full, 'discount', true);
    expect(full.load().onboardingCompleted).toBe(true);
    expect(full.status.kind).toBe('memory');
  });
  it('reads changed storage before mutating and merges a stale snapshot without duplicate answers', () => {
    const storage = new MemoryStorage();
    const first = new LocalStorageProgressRepository(storage);
    const second = new LocalStorageProgressRepository(storage);
    const stale = second.load();
    recordEvidences(first, [answer]);
    second.save({ ...stale, completedChallengeIds: ['another'] });
    recordEvidences(first, [answer]);
    expect(first.load().evidences).toEqual([answer]);
    expect(first.load().completedChallengeIds).toEqual(['another']);
    expect(second.load()).toEqual(first.load());
  });
  it('protects repository state from consumer mutations and preserves latest valid state if disk becomes corrupt', () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageProgressRepository(storage);
    recordEvidences(repository, [answer]);
    const loaded = repository.load();
    loaded.evidences.length = 0;
    expect(repository.load().evidences).toEqual([answer]);
    storage.values.set(PROGRESS_STORAGE_KEY, 'damaged');
    expect(repository.load().evidences).toEqual([answer]);
    expect(repository.status.kind).toBe('corrupt');
    completeChallenge(repository, 'discount');
    expect(storage.values.get(PROGRESS_STORAGE_KEY)).toBe('damaged');
  });
  it('browser factory is safe to construct and use during server rendering', () => {
    const repository = createBrowserProgressRepository();
    expect(repository.load()).toEqual(createEmptyState());
    expect(repository.status.kind).toBe('memory');
  });
});
