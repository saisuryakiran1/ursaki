import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { MemoryNode } from '@ursaki/shared';

interface Props {
  node: MemoryNode & { biomeType?: string };
  onClose: () => void;
  currentBetter?: boolean;
}

export default function EmotionCard({ node, onClose, currentBetter }: Props): React.JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <Modal transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.bg_surface, padding: spacing.xl }]}>
          <Text style={[styles.date, { color: colors.text_muted }]}>{node.date}</Text>
          <Text style={[styles.emotion, { color: colors.text_primary }]}>
            {node.emotionType.charAt(0).toUpperCase() + node.emotionType.slice(1)}
          </Text>

          <View style={styles.gauge}>
            <View
              style={[
                styles.gaugeFill,
                { width: `${node.intensity * 100}%`, backgroundColor: colors.accent_pulse },
              ]}
            />
          </View>
          <Text style={{ color: colors.text_muted, fontSize: 12 }}>
            Intensity: {Math.round(node.intensity * 100)}%
          </Text>

          <Text style={[styles.section, { color: colors.text_primary }]}>How you coped</Text>
          <Text style={{ color: colors.text_muted }}>
            Breathing exercise + short walk. Avatar was in {node.emotionType} form.
          </Text>

          {currentBetter && (
            <View style={[styles.marker, { backgroundColor: colors.accent_calm + '22' }]}>
              <Text style={{ color: colors.accent_calm, fontWeight: '600' }}>
                You&apos;ve come far ✦
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.accent_primary }]}
            onPress={onClose}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  card: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  date: { fontSize: 13, marginBottom: 4 },
  emotion: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  gauge: { height: 8, backgroundColor: '#1a1a24', borderRadius: 4, marginBottom: 4, overflow: 'hidden' },
  gaugeFill: { height: '100%', borderRadius: 4 },
  section: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 4 },
  marker: { padding: 12, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  closeBtn: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
});
