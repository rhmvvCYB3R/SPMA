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

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

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
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Input
              placeholder="🔑  Password:"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Input
              placeholder="🔑  Confirm Password:"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

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
              title="SIGN UP"
              onPress={() => router.push('/verification')}
              style={styles.mainBtn}
              disabled={!agreed}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>You already have an account? </Text>
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
  header: {
    marginBottom: spacing.xl + 8,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl + 2,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sub: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  form: {},
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    marginTop: -spacing.xs,
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
  checkMark: { color: colors.bg, fontSize: 10, fontWeight: '800' },
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