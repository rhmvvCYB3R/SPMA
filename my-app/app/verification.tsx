import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../components/ui/Button';
import { colors, fontSize, radius, spacing } from '../constants/theme';

export default function VerificationScreen() {
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (val: string, i: number) => {
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 3) inputs.current[i + 1]?.focus();
  };

  const handleKey = (e: any, i: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Verification 🛡️</Text>
          <Text style={styles.sub}>
            We have sent a confirmation code to your email. If you haven't received it,
            check your spam or click send again.
          </Text>
        </View>

        {/* Code boxes */}
        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => { inputs.current[i] = r; }}
              style={[styles.codeBox, digit ? styles.codeBoxFilled : null]}
              value={digit}
              onChangeText={(v) => handleChange(v.slice(-1), i)}
              onKeyPress={(e) => handleKey(e, i)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
              placeholder="X"
              placeholderTextColor={colors.textMuted}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.resendRow}>
          <Text style={styles.resendText}>
            If you didn't receive a code!{' '}
            <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </TouchableOpacity>

        <Button
          title="Verify"
          onPress={() => router.replace('/(tabs)')}
          style={styles.verifyBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl + 4,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
  },
  sub: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  codeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  codeBox: {
    width: 58,
    height: 58,
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  codeBoxFilled: {
    borderColor: colors.primary,
  },
  resendRow: {
    marginBottom: spacing.xl,
  },
  resendText: {
    color: colors.secondary,
    fontSize: fontSize.sm,
  },
  resendLink: {
    color: colors.text,
    fontWeight: '700',
  },
  verifyBtn: { width: '100%' },
});