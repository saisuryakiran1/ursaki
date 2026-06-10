import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<{ CreateMod: undefined }, 'CreateMod'>;

const STEPS = ['Name', 'Technique', 'Configure', 'Tags', 'Preview', 'Publish'];

export default function CreateModScreen({ navigation }: Props): React.JSX.Element {
  const { colors, spacing } = useTheme();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [technique, setTechnique] = useState('breathing');
  const [tags, setTags] = useState('');

  const next = (): void => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      Alert.alert(
        'Publish Mind-Mod',
        'Your mod will be reviewed for safety guidelines before going live.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg_primary, padding: spacing.lg }}>
      <Text style={{ color: colors.text_muted, marginBottom: 8 }}>
        Step {step + 1}/{STEPS.length}: {STEPS[step]}
      </Text>

      {step === 0 && (
        <TextInput
          style={[styles.input, { color: colors.text_primary, backgroundColor: colors.bg_surface }]}
          placeholder="Mod name"
          placeholderTextColor={colors.text_muted}
          value={title}
          onChangeText={setTitle}
        />
      )}
      {step === 1 && (
        <Text style={{ color: colors.text_primary }}>Technique: {technique}</Text>
      )}
      {step === 3 && (
        <TextInput
          style={[styles.input, { color: colors.text_primary, backgroundColor: colors.bg_surface }]}
          placeholder="Tags (comma separated)"
          placeholderTextColor={colors.text_muted}
          value={tags}
          onChangeText={setTags}
        />
      )}
      {step === 4 && (
        <View style={[styles.preview, { backgroundColor: colors.bg_surface }]}>
          <Text style={{ color: colors.text_primary, fontWeight: '600' }}>{title || 'Untitled Mod'}</Text>
          <Text style={{ color: colors.text_muted }}>Preview of guided session...</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.accent_primary }]} onPress={next}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          {step === STEPS.length - 1 ? 'Publish' : 'Next'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { padding: 14, borderRadius: 12, marginBottom: 16 },
  preview: { padding: 16, borderRadius: 12, marginBottom: 16 },
  btn: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
});
