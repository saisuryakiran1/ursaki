import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import AvatarRenderer from '../../components/Avatar/AvatarRenderer';
import { AvatarState } from '@ursaki/shared';

const DEFAULT_AVATAR: AvatarState = {
  form: 'seed',
  colorHex: '#7B6FFF',
  armorLevel: 0.3,
  crystallinity: 0.5,
  animationSpeed: 1,
  presence: 0.5,
};

const VIBE_OPTIONS = ['Energized', 'Anxious', 'Numb', 'Creative', 'Overwhelmed'] as const;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen(): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const [avatar] = useState<AvatarState>(DEFAULT_AVATAR);
  const [vibes, setVibes] = useState<Record<string, number>>(
    Object.fromEntries(VIBE_OPTIONS.map((v) => [v, 0.5]))
  );
  const [interventionActive] = useState(false);
  const fadeAnim = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    Animated.spring(fadeAnim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  }, [fadeAnim]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg_primary }}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[styles.greeting, { color: colors.text_primary }]}>
          {getGreeting()}, Sai
        </Text>

        {interventionActive && (
          <View style={[styles.banner, { backgroundColor: colors.accent_pulse + '33' }]}>
            <Text style={{ color: colors.accent_pulse }}>
              Your watch detected elevated stress — breathe with me?
            </Text>
          </View>
        )}

        <Animated.View style={[styles.avatarContainer, { opacity: fadeAnim, height: 320 }]}>
          <AvatarRenderer state={avatar} size={280} />
        </Animated.View>

        <View style={[styles.card, { backgroundColor: colors.bg_surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text_primary }]}>
            How&apos;s your energy?
          </Text>
          {VIBE_OPTIONS.map((vibe) => (
            <View key={vibe} style={styles.vibeRow}>
              <Text style={{ color: colors.text_muted, width: 100 }}>{vibe}</Text>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${vibes[vibe] * 100}%`,
                      backgroundColor: colors.accent_calm,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  greeting: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  banner: { padding: 12, borderRadius: 12, marginBottom: 16 },
  avatarContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  card: { padding: 16, borderRadius: 16 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  vibeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sliderTrack: { flex: 1, height: 8, backgroundColor: '#1a1a24', borderRadius: 4, overflow: 'hidden' },
  sliderFill: { height: '100%', borderRadius: 4 },
});
