import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { clearSession, userApi } from '../api/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { colors, fontSize, radius, spacing } from '../constants/theme';

type Step = 'request' | 'confirm';

export default function ChangeEmailScreen() {
  const [step, setStep] = useState<Step>('request');
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleGoBack = () => {
    if (step === 'confirm') {
      setStep('request');
      setTimer(0);
      setCode(['', '', '', '']);
    } else {
      router.back();
    }
  };

  const handleRequest = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    try {
      setLoading(true);
      await userApi.requestEmailChange(newEmail.trim());
      setStep('confirm');
      setTimer(60);
      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 300);
    } catch (err: any) {
      const msg = err.message || 'Request failed';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || loading) return;
    try {
      setLoading(true);
      await userApi.resendEmailChange(newEmail.trim());
      setTimer(60);
      setCode(['', '', '', '']);
      inputs.current[0]?.focus();
      Alert.alert('Success', 'New code sent to your email');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    const fullCode = code.join('').trim();
    if (fullCode.length < 4) {
      Alert.alert('Error', 'Please enter the 4-digit code');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    let success = false;

    try {
      await userApi.confirmEmailChange(fullCode);
      success = true;
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }

    if (!success) return;

    await clearSession();
    router.replace('/sign-in');
    Alert.alert('Success ✓', 'Email updated. Please log in again.');
  };

  const handleCodeChange = (val: string, i: number) => {
    const cleanVal = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const next = [...code];
    next[i] = cleanVal;
    setCode(next);
    if (cleanVal && i < 3) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleCodeKey = (e: any, i: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="always"
        >
          <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
            <Text style={styles.backText}>‹  Back</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {step === 'request' ? 'Change\nEmail ✉️' : 'Verify\nEmail 🛡️'}
              </Text>
              <Text style={styles.sub}>
                {step === 'request'
                  ? 'Enter your new email address.'
                  : `Sent to: ${newEmail}`}
              </Text>
            </View>

            {step === 'request' ? (
              <>
                <Input
                  placeholder="✉  New E-mail:"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
                <Button
                  title={loading ? 'Sending…' : 'Send Code'}
                  onPress={handleRequest}
                  style={styles.actionBtn}
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <View style={styles.codeRow}>
                  {code.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(r) => { inputs.current[i] = r; }}
                      style={[styles.codeBox, digit ? styles.codeBoxFilled : null]}
                      value={digit}
                      onChangeText={(v) => handleCodeChange(v.slice(-1), i)}
                      onKeyPress={(e) => handleCodeKey(e, i)}
                      keyboardType={Platform.OS === 'android' ? 'numeric' : 'default'}
                      maxLength={1}
                      textAlign="center"
                      placeholder="•"
                      placeholderTextColor={colors.textMuted}
                      editable={!loading}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.resendRow, (timer > 0 || loading) && { opacity: 0.5 }]}
                  onPress={handleResend}
                  disabled={timer > 0 || loading}
                >
                  <Text style={styles.resendText}>
                    {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                  </Text>
                </TouchableOpacity>
                <Button
                  title={loading ? 'Verifying…' : 'Confirm Email'}
                  onPress={handleConfirm}
                  style={styles.actionBtn}
                  disabled={loading}
                />
                {loading && <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: 40 },
  content: { flex: 1 },
  backBtn: { marginBottom: spacing.lg, width: 80 },
  backText: { color: colors.secondary, fontSize: fontSize.md, fontWeight: '600' },
  header: { marginBottom: spacing.xl, gap: spacing.sm },
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '800' },
  sub: { color: colors.secondary, fontSize: fontSize.sm },
  codeRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg, justifyContent: 'center' },
  codeBox: {
    width: 60, height: 60, backgroundColor: colors.bgInput, borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.border, color: colors.text,
    fontSize: 24, fontWeight: '700', textAlign: 'center'
  },
  codeBoxFilled: { borderColor: colors.primary },
  resendRow: { alignItems: 'center', marginBottom: spacing.xl },
  resendText: { color: colors.text, fontWeight: '700' },
  actionBtn: { width: '100%', marginTop: spacing.lg },
});