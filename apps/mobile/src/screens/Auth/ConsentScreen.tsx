import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Consent'>;

interface ConsentToggle {
  id: string;
  label: string;
  description: string;
  required: boolean;
  extraWarning?: string;
}

const TOGGLES: ConsentToggle[] = [
  {
    id: 'mood',
    label: 'Basic mood tracking',
    description: 'Store emotion snapshots on your device for avatar evolution.',
    required: true,
  },
  {
    id: 'hrv',
    label: 'HRV / biometric data',
    description: 'Receive stress interventions from your smartwatch. Stays on-device unless you opt into cloud sync.',
    required: false,
  },
  {
    id: 'community',
    label: 'Community features',
    description: 'Access Mind-Mod marketplace and anonymous proximity matching.',
    required: false,
  },
  {
    id: 'shadow',
    label: 'Shadow Mode',
    description: 'Voice your inner critic in a guided, safety-monitored session.',
    required: false,
    extraWarning: 'Shadow Mode voices difficult thoughts. Only enable if you feel emotionally stable.',
  },
];

export default function ConsentScreen({ navigation }: Props): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [selections, setSelections] = useState<Record<string, boolean>>({
    mood: false,
    hrv: false,
    community: false,
    shadow: false,
  });
  const [shadowModalVisible, setShadowModalVisible] = useState(false);
  const [pendingShadowValue, setPendingShadowValue] = useState(false);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 24;
    if (isBottom) setScrolledToBottom(true);
  };

  const toggle = (id: string, value: boolean): void => {
    const item = TOGGLES.find((t) => t.id === id);
    if (item?.extraWarning && value) {
      setPendingShadowValue(true);
      setShadowModalVisible(true);
      return;
    }
    setSelections((prev) => ({ ...prev, [id]: value }));
  };

  const confirmShadow = (): void => {
    setSelections((prev) => ({ ...prev, shadow: pendingShadowValue }));
    setShadowModalVisible(false);
  };

  const canProceed = scrolledToBottom && selections.mood;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg_primary }]}>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 120 }}
      >
        <Text style={[styles.title, { color: colors.text_primary }]}>Informed Consent</Text>
        <Text style={[styles.disclaimer, { color: colors.danger }]}>
          UrSaKi is NOT a replacement for professional therapy, diagnosis, or emergency care.
        </Text>
        <Text style={[styles.body, { color: colors.text_muted }]}>
          Please read each section carefully. Your emotional data stays on your device unless you explicitly opt in below.
        </Text>

        {TOGGLES.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: colors.bg_surface }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.text_primary }]}>
                {item.label}
                {item.required ? ' *' : ''}
              </Text>
              <Switch
                value={selections[item.id]}
                onValueChange={(v) => toggle(item.id, v)}
                trackColor={{ false: '#333', true: colors.accent_primary }}
              />
            </View>
            <Text style={[styles.desc, { color: colors.text_muted }]}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.bg_surface }]}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: canProceed ? colors.accent_primary : colors.text_muted },
          ]}
          disabled={!canProceed}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.buttonText}>
            {scrolledToBottom ? 'I understand and agree' : 'Scroll to continue'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={shadowModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.bg_surface }]}>
            <Text style={[styles.modalTitle, { color: colors.danger }]}>Shadow Mode Warning</Text>
            <Text style={{ color: colors.text_muted, marginBottom: 16 }}>
              This mode voices difficult thoughts. Exit anytime. Your safety matters more than the exercise.
            </Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent_primary }]} onPress={confirmShadow}>
              <Text style={styles.buttonText}>I understand</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShadowModalVisible(false)}>
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
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  disclaimer: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  body: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  card: { padding: 16, borderRadius: 16, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600', flex: 1 },
  desc: { fontSize: 13, marginTop: 8, lineHeight: 18 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#1a1a24' },
  button: { padding: 16, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modal: { padding: 24, borderRadius: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
