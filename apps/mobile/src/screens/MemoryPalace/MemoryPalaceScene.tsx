import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import EmotionCard from './EmotionCard';
import { MemoryNode } from '@ursaki/shared';

const { width } = Dimensions.get('window');

interface TerrainNode extends MemoryNode {
  biomeType: string;
  elevation: number;
  fogDensity: number;
}

const SAMPLE_NODES: TerrainNode[] = [
  { id: '1', emotionType: 'joy', intensity: 0.8, date: '2026-05-20', spatialCoords: [0, 0.2, 0], biomeType: 'meadow', elevation: 0.2, fogDensity: 0 },
  { id: '2', emotionType: 'anxiety', intensity: 0.7, date: '2026-05-22', spatialCoords: [2, 0.8, 1], biomeType: 'foggy_mountain', elevation: 0.8, fogDensity: 0.6 },
  { id: '3', emotionType: 'calm', intensity: 0.6, date: '2026-05-25', spatialCoords: [-1, 0.4, 2], biomeType: 'crystal_cave', elevation: 0.4, fogDensity: 0 },
  { id: '4', emotionType: 'sadness', intensity: 0.5, date: '2026-05-27', spatialCoords: [1, -0.2, -1], biomeType: 'ocean_depth', elevation: -0.2, fogDensity: 0.1 },
];

const BIOME_COLORS: Record<string, string> = {
  meadow: '#86EFAC',
  foggy_mountain: '#9CA3AF',
  crystal_cave: '#67E8F9',
  ocean_depth: '#60A5FA',
  volcanic: '#DC2626',
};

export default function MemoryPalaceScene(): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const [selected, setSelected] = useState<TerrainNode | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg_primary }]}>
      <Text style={[styles.title, { color: colors.text_primary, padding: spacing.lg }]}>
        Memory Palace
      </Text>

      <View style={[styles.scene, { backgroundColor: '#0d1117' }]}>
        {/* Fog layer for anxiety zones */}
        <View style={[styles.fog, { opacity: 0.3 }]} />

        {/* Instanced-style node orbs */}
        {SAMPLE_NODES.map((node, i) => {
          const size = 20 + node.intensity * 30;
          const left = (width / 2) + node.spatialCoords[0] * 40 - size / 2;
          const top = 120 + node.spatialCoords[2] * 30 + i * 10;
          return (
            <TouchableOpacity
              key={node.id}
              style={[
                styles.orb,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  left,
                  top,
                  backgroundColor: BIOME_COLORS[node.biomeType] ?? colors.accent_primary,
                  opacity: 0.7 + node.intensity * 0.3,
                  shadowColor: BIOME_COLORS[node.biomeType],
                  shadowOpacity: node.fogDensity > 0 ? 0.8 : 0.4,
                  shadowRadius: node.fogDensity > 0 ? 20 : 8,
                },
              ]}
              onPress={() => setSelected(node)}
            />
          );
        })}

        {/* Ocean depth particles */}
        <View style={styles.particles}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.particle,
                { left: 20 + i * 40, top: 200 + (i % 3) * 20, opacity: 0.3 + (i % 3) * 0.1 },
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView horizontal style={styles.legend} contentContainerStyle={{ padding: spacing.md, gap: 8 }}>
        {Object.entries(BIOME_COLORS).map(([biome, color]) => (
          <View key={biome} style={[styles.legendItem, { borderColor: color }]}>
            <Text style={{ color: colors.text_muted, fontSize: 11 }}>{biome.replace('_', ' ')}</Text>
          </View>
        ))}
      </ScrollView>

      {selected && (
        <EmotionCard
          node={selected}
          onClose={() => setSelected(null)}
          currentBetter={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700' },
  scene: { flex: 1, margin: 16, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  fog: { ...StyleSheet.absoluteFillObject, backgroundColor: '#6B7280' },
  orb: { position: 'absolute', elevation: 4 },
  particles: { ...StyleSheet.absoluteFillObject },
  particle: { position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: '#60A5FA' },
  legend: { maxHeight: 48 },
  legendItem: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
});
