import {
  challengeKinds,
  difficulties,
  errorKinds,
  type Evidence,
  type PersistedStateV1,
} from '../../../shared/domain/types';
import {
  createEmptyState,
  type ProgressRepository,
  type RepositoryStatus,
} from '../domain/repository';

export const PROGRESS_STORAGE_KEY = 'oxyda2:state:v1';
export const PROGRESS_SCHEMA_VERSION = 1;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isEvidence(value: unknown): value is Evidence {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    isString(value.skillId) &&
    isString(value.challengeId) &&
    isString(value.stepId) &&
    (value.sessionId === undefined || isString(value.sessionId)) &&
    ['challenge', 'learning', 'diagnostic', 'recall'].some(
      (source) => source === value.source,
    ) &&
    difficulties.some((difficulty) => difficulty === value.difficulty) &&
    challengeKinds.some((kind) => kind === value.kind) &&
    typeof value.correct === 'boolean' &&
    typeof value.usedHint === 'boolean' &&
    typeof value.revealed === 'boolean' &&
    typeof value.attempts === 'number' &&
    Number.isInteger(value.attempts) &&
    value.attempts > 0 &&
    (value.errorKind === undefined ||
      errorKinds.some((kind) => kind === value.errorKind)) &&
    isString(value.answeredAt) &&
    /^\d{4}-\d{2}-\d{2}T/.test(value.answeredAt) &&
    Number.isFinite(Date.parse(value.answeredAt))
  );
}

type DecodeResult =
  | { ok: true; state: PersistedStateV1 }
  | { ok: false; reason: 'corrupt' | 'incompatible' };

export function deserializeProgress(raw: string): DecodeResult {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'corrupt' };
  }
  if (!isRecord(value)) return { ok: false, reason: 'corrupt' };
  if (
    'schemaVersion' in value &&
    value.schemaVersion !== PROGRESS_SCHEMA_VERSION
  )
    return { ok: false, reason: 'incompatible' };
  if (
    value.schemaVersion !== PROGRESS_SCHEMA_VERSION ||
    typeof value.onboardingCompleted !== 'boolean' ||
    !Array.isArray(value.evidences) ||
    !value.evidences.every(isEvidence) ||
    !Array.isArray(value.completedChallengeIds) ||
    !value.completedChallengeIds.every(isString) ||
    !isRecord(value.preferences) ||
    (value.preferences.reducedMotionOverride !== undefined &&
      typeof value.preferences.reducedMotionOverride !== 'boolean')
  ) {
    return { ok: false, reason: 'corrupt' };
  }
  return { ok: true, state: value as unknown as PersistedStateV1 };
}

export function serializeProgress(state: PersistedStateV1): string {
  return JSON.stringify(state);
}

function mergeState(
  current: PersistedStateV1,
  incoming: PersistedStateV1,
): PersistedStateV1 {
  const evidences = new Map(
    current.evidences.map((evidence) => [evidence.id, evidence]),
  );
  for (const evidence of incoming.evidences)
    evidences.set(evidence.id, evidence);
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    onboardingCompleted:
      current.onboardingCompleted || incoming.onboardingCompleted,
    evidences: [...evidences.values()],
    completedChallengeIds: [
      ...new Set([
        ...current.completedChallengeIds,
        ...incoming.completedChallengeIds,
      ]),
    ],
    preferences: { ...current.preferences, ...incoming.preferences },
  };
}

const notices: Record<Exclude<RepositoryStatus['kind'], 'ready'>, string> = {
  memory:
    'El navegador no permite guardar el progreso. Podés continuar, pero los cambios se conservarán solo durante esta visita.',
  corrupt:
    'El progreso guardado no se pudo leer. Conservamos esos datos sin reemplazarlos; podés continuar con progreso temporal durante esta visita.',
  incompatible:
    'El progreso guardado pertenece a otra versión. Conservamos esos datos sin reemplazarlos; podés continuar con progreso temporal durante esta visita.',
};

export class LocalStorageProgressRepository implements ProgressRepository {
  private state = createEmptyState();
  private currentStatus: RepositoryStatus = { kind: 'ready' };
  private storage: StorageLike | undefined;
  private initialized = false;
  private lastRaw: string | null = null;

  constructor(
    private readonly storageProvider: StorageLike | (() => StorageLike) | null,
  ) {}

  get status(): RepositoryStatus {
    if (!this.initialized) this.load();
    return { ...this.currentStatus };
  }

  private fallBack(kind: Exclude<RepositoryStatus['kind'], 'ready'>): void {
    this.currentStatus = { kind, message: notices[kind] };
  }

  load(): PersistedStateV1 {
    if (this.currentStatus.kind !== 'ready') return structuredClone(this.state);
    try {
      if (!this.storage) {
        if (!this.storageProvider) throw new Error('Storage unavailable');
        this.storage =
          typeof this.storageProvider === 'function'
            ? this.storageProvider()
            : this.storageProvider;
      }
      const raw = this.storage.getItem(PROGRESS_STORAGE_KEY);
      if (!this.initialized || raw !== this.lastRaw) {
        if (raw === null) this.state = createEmptyState();
        else {
          const decoded = deserializeProgress(raw);
          if (decoded.ok) this.state = decoded.state;
          else this.fallBack(decoded.reason);
        }
        this.lastRaw = raw;
      }
    } catch {
      this.fallBack('memory');
    }
    this.initialized = true;
    return structuredClone(this.state);
  }

  save(state: PersistedStateV1): void {
    // Read once before mutation so another page or tab's completed work is preserved.
    const current = this.load();
    this.state = structuredClone(mergeState(current, state));
    if (this.currentStatus.kind !== 'ready') return;
    try {
      const raw = serializeProgress(this.state);
      this.storage?.setItem(PROGRESS_STORAGE_KEY, raw);
      this.lastRaw = raw;
    } catch {
      this.fallBack('memory');
    }
  }
}

/** Call from an island effect. Construction does not read the browser storage. */
export function createBrowserProgressRepository(): ProgressRepository {
  return new LocalStorageProgressRepository(
    typeof window === 'undefined' ? null : () => window.localStorage,
  );
}
