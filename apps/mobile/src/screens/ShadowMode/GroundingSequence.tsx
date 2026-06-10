import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AvatarRenderer from '../../components/Avatar/AvatarRenderer';
import { useTheme } from '../../theme/ThemeProvider';
import { AvatarState } from '@ursaki/shared';

const STEPS = [
  { count: 5, instruction: 'Name 5 things you can see.', duration: 30 },
  { count: 4, instruction: 'Name 4 things you can touch.', duration: 25 },
  { count: 3, instruction: 'Name 3 things you can hear.', duration: 20 },
  { count: 2, instruction: 'Name 2 things you can smell.', duration: 15 },
  { count: 1, instruction: 'Name 1 thing you can taste.', duration: 15 },
];

interface Props {
  onComplete: () => void;
}

const CALM_AVATAR: AvatarState = {
  form: 'softening',
  colorHex: '#93C5FD',
  armorLevel: 0.1,
  crystallinity: 0.7,
  animationSpeed: 0.3,
};

export default function GroundingSequence({ onComplete }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(STEPS[0].duration);
  const [finished, setFinished] = useState(false);
  const fadeAnim = useState(() => new Animated.Value(0))[0];

  const currentStep = STEPS[stepIndex];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (stepIndex < STEPS.length - 1) {
            setStepIndex((i) => i + 1);
            return STEPS[stepIndex + 1].duration;
          }
          setFinished(true);
          setTimeout(onComplete, 3000);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [stepIndex, finished, onComplete]);

  return (
    <View style={[styles.container, { backgroundColor: '#0A0A0F' }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {!finished ? (
          <>
            <Text style={[styles.count, { color: colors.accent_calm }]}>{currentStep.count}</Text>
            <Text style={[styles.instruction, { color: colors.text_primary }]}>
              {currentStep.instruction}
            </Text>
            <Text style={{ color: colors.text_muted }}>{secondsLeft}s</Text>
          </>
        ) : (
          <>
            <AvatarRenderer state={CALM_AVATAR} size={160} panicMode />
            <Text style={[styles.instruction, { color: colors.text_primary, marginTop: 24 }]}>
              You&apos;ve come back to yourself.
            </Text>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  count: { fontSize: 72, fontWeight: '800' },
  instruction: { fontSize: 20, textAlign: 'center', marginVertical: 16, lineHeight: 28 },
});
