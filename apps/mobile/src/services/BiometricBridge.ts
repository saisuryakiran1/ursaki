/**
 * BiometricBridge — receives HRV from watch, POSTs to backend, handles interventions.
 */
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export interface Intervention {
  types: string[];
  message?: string;
  breathingPattern?: { inhale: number; hold: number; exhale: number };
}

export type AvatarUpdateCallback = (intervention: Intervention) => void;

let avatarCallback: AvatarUpdateCallback | null = null;

export function onAvatarUpdate(cb: AvatarUpdateCallback): void {
  avatarCallback = cb;
}

export async function analyzeHRV(
  userId: string,
  rrIntervalsMs: number[],
  isStationary = true,
): Promise<Intervention | null> {
  try {
    const resp = await fetch(`${API_URL}/biometric/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, rrIntervalsMs, isStationary }),
    });
    const data = await resp.json();
    if (!data.stressDetected || !data.intervention) return null;

    await handleIntervention(data.intervention);
    return data.intervention;
  } catch {
    return null;
  }
}

export async function handleIntervention(intervention: Intervention): Promise<void> {
  for (const type of intervention.types) {
    switch (type) {
      case 'haptic_breathe':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'haptic_heartbeat':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'notification_soft':
        break;
      case 'avatar_shift':
        avatarCallback?.(intervention);
        break;
    }
  }
}

/** Poll watch data every 30 seconds (stub — wire to native BLE bridge). */
export function startBiometricPolling(userId: string): ReturnType<typeof setInterval> {
  return setInterval(() => {
    void analyzeHRV(userId, [800, 820, 790, 810, 795], true);
  }, 30_000);
}
