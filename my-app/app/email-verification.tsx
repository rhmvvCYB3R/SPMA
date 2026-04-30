import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { authApi } from '../api/api';
import Button from '../components/ui/Button';
import { colors, fontSize, radius, spacing } from '../constants/theme';

export default function VerificationScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (errorMsg) setErrorMsg(null);
    if (successMsg) setSuccessMsg(null);
    
    const char = value.slice(-1).toUpperCase();
    const next = [...code];
    next[index] = char;
    setCode(next);

    if (char && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKey = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setErrorMsg(null);
    const fullCode = code.join('').trim().toUpperCase();

    if (fullCode.length !== 4) {
      setErrorMsg('Please enter the 4-digit code');
      return;
    }

    try {
      setLoading(true);
      await authApi.verify(fullCode);
      router.replace({ pathname: '/sign-in', params: { verified: 'true' } });
    } catch (error: any) {
      setErrorMsg(error?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMsg('Email address not found');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const response = await authApi.resendVerify(email);
      setSuccessMsg(response.message);
      setCode(['', '', '', '']);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Verification 🛡️</Text>
            <Text style={styles.sub}>
              Sent to{email ? ` ${email}` : ' your email'}
              {'\n'}
              Enter the 4-digit code
            </Text>
          </View>

          <View style={styles.codeRow}>
            {code.map((digit, index) => (
             <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                style={[
                  styles.codeBox,
                  digit ? styles.codeBoxFilled : null,
                  errorMsg ? styles.codeBoxError : null
                ]}
                value={digit}
                onChangeText={(v) => handleChange(v, index)}
                onKeyPress={(e) => handleKey(e, index)}
                maxLength={1}
                autoCapitalize="characters"
                autoCorrect={false}
                keyboardType="default"
                textAlign="center"
                placeholder="X"
                placeholderTextColor={colors.textMuted}
                editable={!loading}
              />
            ))}
          </View>

          {errorMsg && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {successMsg && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{successMsg}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.resendRow}
            onPress={handleResend}
            disabled={loading}
          >
            <Text style={styles.resendText}>
              Didn't receive code?{' '}
              <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </TouchableOpacity>

          <Button
            title={loading ? 'Processing...' : 'VERIFY'}
            onPress={handleVerify}
            style={styles.verifyBtn}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
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
  header: { alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '800' },
  sub: { color: colors.secondary, fontSize: fontSize.sm, textAlign: 'center' },
  codeRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  codeBox: {
    width: 58,
    height: 58,
    borderRadius: radius.md,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  codeBoxFilled: { borderColor: colors.primary },
  codeBoxError: { borderColor: '#FFCDD2' },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    width: '100%',
  },
  errorText: { color: '#D32F2F', fontSize: fontSize.sm, textAlign: 'center', fontWeight: '600' },
  successBox: {
    backgroundColor: '#E8F5E9',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    width: '100%',
  },
  successText: { color: '#2E7D32', fontSize: fontSize.sm, textAlign: 'center', fontWeight: '600' },
  resendRow: { marginBottom: spacing.xl },
  resendText: { color: colors.secondary, fontSize: fontSize.sm },
  resendLink: { color: colors.text, fontWeight: '700' },
  verifyBtn: { width: '100%' },
});