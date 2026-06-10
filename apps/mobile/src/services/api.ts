/** Central API client for UrSaKi backend. */
import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const resp = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!resp.ok) {
    throw new Error(`API ${path} failed: ${resp.status}`);
  }
  return resp.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>('/health'),
  computeAvatar: (userId: string, emotionHistory: unknown[]) =>
    request('/avatar/compute', {
      method: 'POST',
      body: JSON.stringify({ userId, emotionHistory }),
    }),
  analyzeBiometric: (userId: string, rrIntervalsMs: number[], isStationary = true) =>
    request('/biometric/analyze', {
      method: 'POST',
      body: JSON.stringify({ userId, rrIntervalsMs, isStationary }),
    }),
  getMemoryPalace: (userId: string) => request(`/memory-palace/${userId}`),
  getMods: () => request<unknown[]>('/marketplace/mods'),
  sendChat: (userId: string, message: string) =>
    request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ userId, message, persona: 'ursaki_core' }),
    }),
};

export { API_URL };
