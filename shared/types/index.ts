/**
 * Shared TypeScript types for UrSaKi monorepo.
 * Imported by mobile, desktop, and shared utilities.
 * Exports core domain types for emotions, user pods, avatars, memory, and safety.
 */

export type EmotionSource = 'text' | 'hrv' | 'voice';

export interface EmotionSnapshot {
  timestamp: string;
  valence: number;
  arousal: number;
  dominance: number;
  source: EmotionSource;
}

export interface AvatarState {
  form: string;
  colorHex: string;
  armorLevel: number;
  crystallinity: number;
  animationSpeed?: number;
  presence?: number;
}

export interface MemoryNode {
  id: string;
  emotionType: string;
  intensity: number;
  date: string;
  spatialCoords: [number, number, number];
}

export interface UserPod {
  podId: string;
  avatarState: AvatarState;
  memoryPalace: MemoryNode[];
}

export type SafetyLevel = 'green' | 'yellow' | 'red';

export interface SafetyFlag {
  level: SafetyLevel;
  trigger: string;
  timestamp: string;
}

export interface SafetyCheckedResponse {
  content: string;
  safetyFlag: SafetyFlag;
  wasOverridden: boolean;
}

export interface UserSafetyContext {
  userId: string;
  recentFlags: SafetyFlag[];
  shadowModeActive: boolean;
  isMinor: boolean;
}

export interface BreathingPattern {
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
  cycles: number;
}

export interface ResilienceStats {
  level: number;
  totalXP: number;
  streakDays: number;
}

export type ResilienceSkill = 'Resilience' | 'Articulation' | 'Clarity';
