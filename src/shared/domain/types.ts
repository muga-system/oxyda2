export const challengeKinds = [
  'recognize',
  'estimate',
  'calculate',
  'debug',
  'compare',
  'reverse',
  'decide',
] as const;
export type ChallengeKind = (typeof challengeKinds)[number];
export const difficulties = [
  'foundation',
  'application',
  'relation',
  'transfer',
] as const;
export type Difficulty = (typeof difficulties)[number];
export const errorKinds = [
  'operation-selection',
  'direction',
  'calculation',
  'unit',
  'magnitude',
  'interpretation',
  'concept',
] as const;
export type ErrorKind = (typeof errorKinds)[number];
export type FamilyId =
  'percentage' | 'proportion' | 'estimation' | 'units' | 'data';
export type EvidenceSource = 'challenge' | 'learning' | 'diagnostic' | 'recall';

export interface ChoiceOption {
  id: string;
  label: string;
  errorKind?: ErrorKind;
  feedback?: string;
}
export type AnswerSpec =
  | { type: 'single-choice'; correctOptionId: string; options: ChoiceOption[] }
  | {
      type: 'numeric';
      expected: number;
      tolerance?: number;
      unit?: string;
      errors?: { value: number; kind: ErrorKind; feedback: string }[];
    };

export interface ChallengeStep {
  id: string;
  kind: ChallengeKind;
  difficulty: Difficulty;
  label?: string;
  prompt: string;
  answer: AnswerSpec;
  skillIds: string[];
  hints?: string[];
  successFeedback: string;
  explanation: string;
  errorFeedback?: Partial<Record<ErrorKind, string>>;
  debug?: string;
}
export interface Challenge {
  id: string;
  familyId: FamilyId;
  title: string;
  scenario: string;
  skillIds: string[];
  steps: ChallengeStep[];
  takeaway: string;
  comparison?: { label: string; value: string; detail?: string }[];
  chart?: {
    title: string;
    values: { label: string; value: number }[];
    baseline: number;
    unit: string;
  };
}
export interface Skill {
  id: string;
  familyId: FamilyId;
  title: string;
  description: string;
  idea: string;
  example: string;
}
export interface Family {
  id: FamilyId;
  slug: string;
  title: string;
  description: string;
  question: string;
}
export interface RecallCard {
  id: string;
  familyId: FamilyId;
  question: string;
  idea: string;
  formula?: string;
  example: string;
  challengeId: string;
  keywords: string[];
}
export interface Evidence {
  id: string;
  sessionId?: string;
  skillId: string;
  challengeId: string;
  stepId: string;
  source: EvidenceSource;
  difficulty: Difficulty;
  kind: ChallengeKind;
  correct: boolean;
  usedHint: boolean;
  attempts: number;
  revealed: boolean;
  errorKind?: ErrorKind;
  answeredAt: string;
}
export interface PersistedStateV1 {
  schemaVersion: 1;
  onboardingCompleted: boolean;
  evidences: Evidence[];
  completedChallengeIds: string[];
  preferences: { reducedMotionOverride?: boolean };
}
export type Mastery = 'unexplored' | 'developing' | 'available' | 'solid';
export type Freshness = 'fresh' | 'cooling' | 'oxidized';
export type DisplayStatus =
  'Sin explorar' | 'En desarrollo' | 'Disponible' | 'Sólido' | 'Para refrescar';
export interface SkillProgress {
  skillId: string;
  mastery: Mastery;
  freshness: Freshness;
  status: DisplayStatus;
  evidenceCount: number;
  lastPracticedAt?: string;
  lastSuccessfulAt?: string;
  recurringError?: ErrorKind;
}
