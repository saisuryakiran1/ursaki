import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<{ Marketplace: undefined; ModDetail: { modId: string }; CreateMod: undefined }, 'Marketplace'>;

interface MindMod {
  modId: string;
  title: string;
  technique: string;
  tags: string[];
  avgEffectivenessRating: number;
  usageCount: number;
}

const SAMPLE_MODS: MindMod[] = [
  { modId: '1', title: 'Box Breathing Reset', technique: 'breathing', tags: ['anxiety', 'calm'], avgEffectivenessRating: 4.6, usageCount: 128 },
  { modId: '2', title: 'Morning Affirmations', technique: 'affirmation', tags: ['joy', 'focus'], avgEffectivenessRating: 4.2, usageCount: 89 },
  { modId: '3', title: 'Lo-Fi Grounding', technique: 'music', tags: ['sadness', 'calm'], avgEffectivenessRating: 4.8, usageCount: 256 },
];

export default function MindModFeed({ navigation }: Props): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? SAMPLE_MODS : SAMPLE_MODS.filter((m) => m.tags.includes(filter));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg_primary, padding: spacing.lg }}>
      <Text style={[styles.resonates, { color: colors.accent_primary }]}>
        ✦ Resonates with your current vibe
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {['all', 'anxiety', 'calm', 'joy'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, { backgroundColor: filter === f ? colors.accent_primary : colors.bg_surface }]}
            onPress={() => setFilter(f)}
          >
            <Text style={{ color: filter === f ? '#fff' : colors.text_muted, fontSize: 12 }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.grid}>
        {filtered.map((mod) => (
          <TouchableOpacity
            key={mod.modId}
            style={[styles.card, { backgroundColor: colors.bg_surface }]}
            onPress={() => navigation.navigate('ModDetail', { modId: mod.modId })}
          >
            <Text style={{ color: colors.text_primary, fontWeight: '600', fontSize: 14 }}>{mod.title}</Text>
            <Text style={{ color: colors.text_muted, fontSize: 11, marginTop: 4 }}>{mod.technique}</Text>
            <View style={styles.bar}>
              <View style={[styles.barFill, { width: `${(mod.avgEffectivenessRating / 5) * 100}%`, backgroundColor: colors.accent_calm }]} />
            </View>
            <Text style={{ color: colors.text_muted, fontSize: 10, marginTop: 4 }}>
              {mod.usageCount} uses · {mod.avgEffectivenessRating}★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.createBtn, { backgroundColor: colors.accent_primary }]}
        onPress={() => navigation.navigate('CreateMod')}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Create Mind-Mod</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  resonates: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginRight: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', padding: 12, borderRadius: 12 },
  bar: { height: 4, backgroundColor: '#1a1a24', borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  barFill: { height: '100%' },
  createBtn: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 24, marginBottom: 32 },
});
