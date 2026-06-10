import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props): React.JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg_primary, padding: spacing.xl }]}>
      <Text style={[styles.title, { color: colors.text_primary }]}>Welcome to UrSaKi</Text>
      <Text style={[styles.body, { color: colors.text_muted }]}>
        Your neuro-symbiotic companion for emotional wellness. Private, on-device first.
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent_primary }]}
        onPress={() => navigation.navigate('Consent')}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 16 },
  body: { fontSize: 16, lineHeight: 24, marginBottom: 32 },
  button: { padding: 16, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
