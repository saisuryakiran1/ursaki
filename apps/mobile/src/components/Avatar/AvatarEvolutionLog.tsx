import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import AvatarRenderer from './AvatarRenderer';
import { AvatarState } from '@ursaki/shared';

interface EvolutionEntry {
  date: string;
  context: string;
  state: AvatarState;
}

const SAMPLE_LOG: EvolutionEntry[] = [
  {
    date: '2026-05-28',
    context: 'Calm after morning meditation',
    state: { form: 'calm_crystal', colorHex: '#67E8F9', armorLevel: 0.2, crystallinity: 0.8 },
  },
  {
    date: '2026-05-25',
    context: 'Anxiety before exam',
    state: { form: 'armored', colorHex: '#6B7280', armorLevel: 0.7, crystallinity: 0.3 },
  },
];

export default function AvatarEvolutionLog(): React.JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg_primary, padding: spacing.lg }}>
      <Text style={[styles.title, { color: colors.text_primary }]}>Avatar Evolution</Text>
      {SAMPLE_LOG.map((entry) => (
        <View key={entry.date} style={[styles.entry, { backgroundColor: colors.bg_surface }]}>
          <AvatarRenderer state={entry.state} size={64} />
          <View style={styles.meta}>
            <Text style={{ color: colors.text_primary, fontWeight: '600' }}>{entry.date}</Text>
            <Text style={{ color: colors.text_muted, fontSize: 13 }}>{entry.context}</Text>
            <Text style={{ color: colors.accent_primary, fontSize: 12 }}>{entry.state.form}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  entry: { flexDirection: 'row', padding: 12, borderRadius: 12, marginBottom: 12, gap: 12 },
  meta: { flex: 1, justifyContent: 'center' },
});
