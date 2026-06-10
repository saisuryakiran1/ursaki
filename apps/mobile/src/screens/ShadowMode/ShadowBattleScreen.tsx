import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import GroundingSequence from './GroundingSequence';

type Props = NativeStackScreenProps<{ ShadowBattle: { topics: string[] } }, 'ShadowBattle'>;

interface Message {
  id: string;
  text: string;
  isShadow: boolean;
  xp?: number;
}

const SESSION_SECONDS = 15 * 60;

export default function ShadowBattleScreen({ navigation, route }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'You always hold back when it matters most.', isShadow: true },
  ]);
  const [showGrounding, setShowGrounding] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setShowGrounding(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number): string => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const sendRebuttal = (): void => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, isShadow: false };
    const xp = Math.floor(Math.random() * 5) + 3;
    setTotalXP((t) => t + xp);
    const shadowReply: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Is that really true, or is it just fear talking?',
      isShadow: true,
      xp,
    };
    setMessages((prev) => [...prev, userMsg, shadowReply]);
    setInput('');
  };

  const panicExit = (): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowGrounding(true);
  };

  if (showGrounding) {
    return <GroundingSequence onComplete={() => navigation.goBack()} />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg_primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={{ color: colors.text_muted }}>{formatTime(secondsLeft)}</Text>
        <Text style={{ color: colors.accent_primary }}>+{totalXP} XP</Text>
      </View>

      <ScrollView style={styles.messages} contentContainerStyle={{ padding: 16 }}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.isShadow ? styles.shadowBubble : styles.userBubble,
              { backgroundColor: msg.isShadow ? '#1a1020' : colors.accent_primary + '33' },
            ]}
          >
            <Text
              style={[
                { color: msg.isShadow ? '#9a8aaa' : colors.text_primary },
                msg.isShadow && styles.shadowText,
              ]}
            >
              {msg.text}
            </Text>
            {msg.xp !== undefined && (
              <Text style={{ color: colors.accent_calm, fontSize: 11, marginTop: 4 }}>
                +{msg.xp} Resilience XP
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { color: colors.text_primary, backgroundColor: colors.bg_surface }]}
          placeholder="Your rebuttal..."
          placeholderTextColor={colors.text_muted}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.accent_primary }]} onPress={sendRebuttal}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.exitBtn, { backgroundColor: colors.danger }]} onPress={panicExit}>
        <Text style={styles.exitText}>EXIT</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingTop: 48 },
  messages: { flex: 1 },
  bubble: { padding: 12, borderRadius: 12, marginBottom: 8, maxWidth: '80%' },
  shadowBubble: { alignSelf: 'flex-start' },
  userBubble: { alignSelf: 'flex-end' },
  shadowText: { fontStyle: 'italic' },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8 },
  input: { flex: 1, padding: 12, borderRadius: 12 },
  sendBtn: { padding: 12, borderRadius: 12, justifyContent: 'center' },
  exitBtn: { padding: 16, alignItems: 'center', marginBottom: 24 },
  exitText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 2 },
});
