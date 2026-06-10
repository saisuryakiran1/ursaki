import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export default function UserSettings(): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const [shadowMode, setShadowMode] = useState(false);
  const [bridgeMode, setBridgeMode] = useState(false);
  const [hrvSync, setHrvSync] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg_primary, padding: spacing.lg }}>
      <Text style={[styles.section, { color: colors.text_muted }]}>PRIVACY</Text>
      <View style={[styles.row, { backgroundColor: colors.bg_surface }]}>
        <Text style={{ color: colors.text_primary }}>Solid Data Pod sync</Text>
        <Switch value={false} trackColor={{ true: colors.accent_primary, false: '#333' }} />
      </View>

      <Text style={[styles.section, { color: colors.text_muted }]}>FEATURES</Text>
      <View style={[styles.row, { backgroundColor: colors.bg_surface }]}>
        <Text style={{ color: colors.text_primary }}>HRV / Biometric</Text>
        <Switch value={hrvSync} onValueChange={setHrvSync} trackColor={{ true: colors.accent_primary, false: '#333' }} />
      </View>
      <View style={[styles.row, { backgroundColor: colors.bg_surface }]}>
        <Text style={{ color: colors.text_primary }}>Shadow Mode</Text>
        <Switch value={shadowMode} onValueChange={setShadowMode} trackColor={{ true: colors.accent_primary, false: '#333' }} />
      </View>
      <View style={[styles.row, { backgroundColor: colors.bg_surface }]}>
        <Text style={{ color: colors.text_primary }}>Bridge Mode (BLE)</Text>
        <Switch value={bridgeMode} onValueChange={setBridgeMode} trackColor={{ true: colors.accent_primary, false: '#333' }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 12, fontWeight: '600', letterSpacing: 1, marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 8 },
});
