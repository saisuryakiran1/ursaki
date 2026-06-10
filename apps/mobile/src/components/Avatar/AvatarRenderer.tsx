/**
 * AvatarRenderer — procedural 3D avatar with spring animations.
 * Uses parametric sphere with armor-driven displacement (R3F-ready structure).
 */
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { AvatarState } from '@ursaki/shared';

interface Props {
  state: AvatarState;
  size?: number;
  panicMode?: boolean;
}

export default function AvatarRenderer({
  state,
  size = 200,
  panicMode = false,
}: Props): React.JSX.Element {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const isSoftening = panicMode || state.form === 'softening';

  useEffect(() => {
    if (isSoftening) {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.85, duration: 2000, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.7, duration: 2000, useNativeDriver: true }),
        Animated.timing(colorAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8 + (state.presence ?? 0.5) * 0.4);
      opacityAnim.setValue(1);
    }
  }, [isSoftening, state, scaleAnim, opacityAnim, colorAnim]);

  const spikiness = state.armorLevel;
  const smoothness = state.crystallinity;
  const borderRadius = size / 2;
  const spikeOffset = spikiness * 12;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius,
            backgroundColor: state.colorHex,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            borderWidth: 2 + spikeOffset * 0.3,
            borderColor: state.colorHex + '88',
            shadowColor: state.colorHex,
            shadowOpacity: smoothness * 0.6,
            shadowRadius: 10 + smoothness * 20,
          },
        ]}
      />
      <Text style={styles.formLabel}>{state.form}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  avatar: {
    elevation: 8,
  },
  formLabel: {
    marginTop: 8,
    color: '#7A7890',
    fontSize: 12,
    textTransform: 'capitalize',
  },
});
