import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<{ ModDetail: { modId: string } }, 'ModDetail'>;

export default function ModDetailScreen({ route }: Props): React.JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg_primary, padding: spacing.lg }}>
      <Text style={[styles.title, { color: colors.text_primary }]}>Box Breathing Reset</Text>
      <View style={[styles.badge, { backgroundColor: colors.accent_calm + '22' }]}>
        <Text style={{ color: colors.accent_calm }}>Healer tier creator</Text>
      </View>
      <Text style={[styles.desc, { color: colors.text_muted }]}>
        A 4-4-6 breathing pattern designed for acute anxiety moments. Pair with soft haptics.
      </Text>
      <TouchableOpacity style={[styles.tryBtn, { backgroundColor: colors.accent_primary }]}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Try Now</Text>
      </TouchableOpacity>
      <Text style={[styles.ratingLabel, { color: colors.text_muted }]}>
        Rate after completing a session
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 16 },
  desc: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  tryBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  ratingLabel: { fontSize: 13, textAlign: 'center' },
});
