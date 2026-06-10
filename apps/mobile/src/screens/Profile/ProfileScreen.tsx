import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import AvatarEvolutionLog from '../../components/Avatar/AvatarEvolutionLog';

type Props = NativeStackScreenProps<{ ProfileHome: undefined; Settings: undefined }, 'ProfileHome'>;

export default function ProfileScreen({ navigation }: Props): React.JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg_primary }}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[styles.name, { color: colors.text_primary }]}>Sai Surya Kiran</Text>
        <View style={[styles.stats, { backgroundColor: colors.bg_surface }]}>
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.accent_primary }]}>3</Text>
            <Text style={{ color: colors.text_muted, fontSize: 12 }}>Level</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.accent_calm }]}>245</Text>
            <Text style={{ color: colors.text_muted, fontSize: 12 }}>Total XP</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.accent_pulse }]}>7</Text>
            <Text style={{ color: colors.text_muted, fontSize: 12 }}>Day Streak</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.link, { backgroundColor: colors.bg_surface }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={{ color: colors.text_primary }}>Settings & Data Pod</Text>
        </TouchableOpacity>
      </View>
      <AvatarEvolutionLog />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  stats: { flexDirection: 'row', borderRadius: 12, padding: 16, marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: '700' },
  link: { padding: 16, borderRadius: 12 },
});
