import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { colors, fontSize, spacing } from '../constants/theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

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
          {/* Header row */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Welcome{'\n'}Back!</Text>
              <Text style={styles.sub}>Glad to see you again!</Text>
            </View>
            <Text style={styles.waveEmoji}>👋</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              placeholder="✉  E-mail:"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Input
              placeholder="🔑  Password:"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.optionsRow}>
              <TouchableOpacity
                onPress={() => setRemember(!remember)}
                style={styles.rememberRow}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, remember && styles.checkboxActive]}>
                  {remember && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.rememberLabel}>Remember me!</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                <Text style={styles.forgotLink}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="SIGN IN"
              onPress={() => router.replace('/(tabs)')}
              style={styles.mainBtn}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/sign-up')}>
              <Text style={styles.footerLink}>Sign Up!</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl + 8,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl + 2,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  sub: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  waveEmoji: {
    fontSize: 44,
    marginTop: 4,
  },
  form: { gap: 0 },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: -spacing.xs,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: {
    color: colors.bg,
    fontSize: 10,
    fontWeight: '800',
  },
  rememberLabel: {
    color: colors.secondary,
    fontSize: fontSize.sm,
  },
  forgotLink: {
    color: colors.secondary,
    fontSize: fontSize.sm,
  },
  mainBtn: { width: '100%' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: { color: colors.secondary, fontSize: fontSize.sm },
  footerLink: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
});