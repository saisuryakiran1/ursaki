/**
 * BLEBridge — anonymous proximity matching via react-native-ble-plx.
 * ECDH key exchange stub for AES-256 encrypted payloads.
 */
import { BridgeProfile } from '../types/bridge';

const SERVICE_UUID = '0000ursa-0000-1000-8000-00805f9b34fb';

/** Stub: generate ephemeral ECDH key pair for session encryption. */
export async function initECDHKeyExchange(): Promise<{ publicKey: string; privateKey: string }> {
  const publicKey = `ecdh-pub-${Date.now()}`;
  const privateKey = `ecdh-priv-${Date.now()}`;
  return { publicKey, privateKey };
}

/** Stub: derive AES-256 session key from ECDH shared secret. */
export function deriveSessionKey(sharedSecret: string): string {
  return `aes256-${sharedSecret.slice(0, 32)}`;
}

/** Stub: encrypt BridgeProfile for BLE advertisement. */
export function encryptProfile(profile: BridgeProfile, sessionKey: string): string {
  return btoa(JSON.stringify({ ...profile, _key: sessionKey.slice(0, 8) }));
}

/** Stub: decrypt scanned BLE payload. */
export function decryptProfile(payload: string, sessionKey: string): BridgeProfile | null {
  try {
    const parsed = JSON.parse(atob(payload)) as BridgeProfile;
    return parsed;
  } catch {
    return null;
  }
}

export async function startBridgeMode(
  profile: BridgeProfile,
  onMatch: (matches: unknown[]) => void,
): Promise<() => void> {
  const { publicKey } = await initECDHKeyExchange();
  const sessionKey = deriveSessionKey(publicKey);
  const encrypted = encryptProfile(profile, sessionKey);

  // Stub: simulate scan/advertise cycle
  const interval = setInterval(async () => {
    const resp = await fetch(`${process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000'}/social/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ localProfile: profile, nearbyProfiles: [] }),
    });
    const matches = await resp.json();
    if (matches.length > 0) onMatch(matches);
  }, 10_000);

  return () => clearInterval(interval);
}

export { SERVICE_UUID };
