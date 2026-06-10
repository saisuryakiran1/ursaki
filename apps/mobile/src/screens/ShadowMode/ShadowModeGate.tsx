import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';

type ShadowStackParamList = {
  ShadowGate: undefined;
  ShadowBattle: { topics: string[] };
};

type Props = NativeStackScreenProps<ShadowStackParamList, 'ShadowGate'>;

export default function ShadowModeGate({ navigation }: Props): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const [settingsEnabled, setSettingsEnabled] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const startSession = (): void => {
    if (!settingsEnabled) {
      Alert.alert('Enable Shadow Mode', 'Turn on Shadow Mode in settings first.');
      return;
    }
    setConfirmModal(true);
  };

  const confirmSession = (): void => {
    setConfirmModal(false);
    navigation.navigate('ShadowBattle', { topics: ['self-doubt', 'perfectionism'] });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg_primary, padding: spacing.xl }]}>
      <Text style={[styles.title, { color: colors.text_primary }]}>Shadow Self Training</Text>
      <Text style={[styles.warning, { color: colors.text_muted }]}>
        This mode voices difficult thoughts. Exit anytime. Your safety matters more than the exercise.
      </Text>

      <View style={[styles.card, { backgroundColor: colors.bg_surface }]}>
        <Text style={{ color: colors.text_primary, fontWeight: '600' }}>Enable in Settings</Text>
        <Switch
          value={settingsEnabled}
          onValueChange={setSettingsEnabled}
          trackColor={{ false: '#333', true: colors.accent_primary }}
        />
      </View>

      <TouchableOpacity
        style={[styles.startBtn, { backgroundColor: settingsEnabled ? colors.accent_primary : colors.text_muted }]}
        onPress={startSession}
        disabled={!settingsEnabled}
      >
        <Text style={styles.btnText}>Begin Session</Text>
      </TouchableOpacity>

      <Modal visible={confirmModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.bg_surface }]}>
            <Text style={[styles.modalTitle, { color: colors.danger }]}>Confirm Session</Text>
            <Text style={{ color: colors.text_muted, marginBottom: 20 }}>
              You are about to enter Shadow Mode. A 15-minute timer will start. You can exit anytime.
            </Text>
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: colors.accent_primary }]} onPress={confirmSession}>
              <Text style={styles.btnText}>I&apos;m ready</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmModal(false)}>
              <Text style={{ color: colors.text_muted, textAlign: 'center', marginTop: 12 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  warning: { fontSize: 14, lineHeight: 20, marginBottom: 24 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 24 },
  startBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  modal: { padding: 24, borderRadius: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
