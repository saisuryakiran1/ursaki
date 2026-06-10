import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { startBridgeMode } from '../../services/BLEBridge';
import { BridgeProfile, MatchResult } from '../../types/bridge';

const RINGS = [5, 10, 20];

export default function BridgeModeScreen(): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const pulseAnim = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    if (!enabled) return;
    const profile: BridgeProfile = {
      token: 'anon-token',
      comfortLevel: 70,
      interestTags: ['music', 'meditation', 'anime'],
      isAdult: true,
    };
    let cleanup: (() => void) | undefined;
    void startBridgeMode(profile, (matches) => {
      if (matches.length > 0) setMatch(matches[0] as MatchResult);
    }).then((stop) => {
      cleanup = stop;
    });
    return () => cleanup?.();
  }, [enabled]);

  useEffect(() => {
    if (match) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [match, pulseAnim]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg_primary, padding: spacing.lg }]}>
      <Text style={[styles.title, { color: colors.text_primary }]}>Social Bridge</Text>
      <Text style={{ color: colors.text_muted, marginBottom: 16 }}>
        Anonymous proximity matching. No names, no photos.
      </Text>

      <TouchableOpacity
        style={[styles.toggle, { backgroundColor: enabled ? colors.accent_primary : colors.bg_surface }]}
        onPress={() => setEnabled(!enabled)}
      >
        <Text style={{ color: enabled ? '#fff' : colors.text_muted }}>
          {enabled ? 'Bridge Mode Active' : 'Enable Bridge Mode'}
        </Text>
      </TouchableOpacity>

      <View style={styles.radar}>
        {RINGS.map((m, i) => (
          <View
            key={m}
            style={[
              styles.ring,
              {
                width: 80 + i * 60,
                height: 80 + i * 60,
                borderRadius: (80 + i * 60) / 2,
                borderColor: colors.accent_primary + '44',
              },
            ]}
          />
        ))}
        <View style={[styles.centerOrb, { backgroundColor: colors.accent_calm }]} />
        {enabled && (
          <Animated.View
            style={[
              styles.matchOrb,
              { backgroundColor: colors.accent_pulse, transform: [{ scale: pulseAnim }] },
            ]}
          />
        )}
        <Text style={[styles.ringLabel, { color: colors.text_muted }]}>5m · 10m · 20m</Text>
      </View>

      <Modal visible={match !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.matchCard, { backgroundColor: colors.bg_surface }]}>
            <Text style={{ color: colors.text_primary, fontWeight: '700', fontSize: 18 }}>Match found</Text>
            <Text style={{ color: colors.text_muted, marginVertical: 8 }}>
              Shared: {match?.sharedInterests.join(', ')}
            </Text>
            <Text style={{ color: colors.accent_primary, marginBottom: 16 }}>{match?.icebreaker}</Text>
            <TouchableOpacity style={[styles.waveBtn, { backgroundColor: colors.accent_primary }]}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Wave 👋</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMatch(null)}>
              <Text style={{ color: colors.text_muted, textAlign: 'center', marginTop: 12 }}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700' },
  toggle: { padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  radar: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderWidth: 1 },
  centerOrb: { width: 16, height: 16, borderRadius: 8 },
  matchOrb: { position: 'absolute', top: '35%', right: '30%', width: 20, height: 20, borderRadius: 10 },
  ringLabel: { position: 'absolute', bottom: 40, fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  matchCard: { padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  waveBtn: { padding: 14, borderRadius: 12, alignItems: 'center' },
});
