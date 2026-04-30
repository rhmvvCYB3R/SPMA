import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { authApi } from '../api/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { colors, fontSize, spacing } from '../constants/theme';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignUp = async () => {
    setErrorMsg(null);
    const cleanEmail = email.trim();

    if (!cleanEmail || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (!agreed) {
      setErrorMsg('Please agree to the privacy policy');
      return;
    }

    try {
      setLoading(true);
      await authApi.register(cleanEmail, password, confirmPassword);
      router.push({ pathname: '/email-verification', params: { email: cleanEmail } });
    } catch (err: any) {
      const message = err.message || '';
      
      if (message.includes('Email already exists')) {
        setErrorMsg('This email is already registered. Please try signing in.');
      } else {
        setErrorMsg(message || 'Something went wrong. Please try again.');
      }
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
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Sign Up ✏️</Text>
            <Text style={styles.sub}>We are glad that you want to{'\n'}join us!</Text>
          </View>

          <View style={styles.form}>
            <Input
              placeholder="✉  E-mail:"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMsg) setErrorMsg(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              placeholder="🔑  Password:"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMsg) setErrorMsg(null);
              }}
              secureTextEntry
            />
            <Input
              placeholder="🔑  Confirm Password:"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errorMsg) setErrorMsg(null);
              }}
              secureTextEntry
            />

            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setAgreed(!agreed)}
              style={styles.agreeRow}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                {agreed && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.agreeText}>
                I agree with{' '}
                <Text style={styles.agreeLink}>privacy policy</Text>
              </Text>
            </TouchableOpacity>

            <Button
              title={loading ? 'Creating Account...' : 'SIGN UP'}
              onPress={handleSignUp}
              style={styles.mainBtn}
              disabled={!agreed || loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/sign-in')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: 40,
  },
  header: { marginBottom: spacing.xl + 8, gap: spacing.sm },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl + 2,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sub: { color: colors.secondary, fontSize: fontSize.sm, lineHeight: 20 },
  form: {},
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: fontSize.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    marginTop: -spacing.xs,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkMark: { color: colors.bg, fontSize: 12, fontWeight: '800' },
  agreeText: { color: colors.secondary, fontSize: fontSize.sm },
  agreeLink: { color: colors.text, textDecorationLine: 'underline' },
  mainBtn: { width: '100%' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: { color: colors.secondary, fontSize: fontSize.sm },
  footerLink: { color: colors.text, fontSize: fontSize.sm, fontWeight: '700' },
});