import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { colors, fontSize, spacing } from '../constants/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Forgot your{'\n'}password?</Text>
            <Text style={styles.sub}>
              To recover your password,{'\n'}enter your email.
            </Text>
          </View>

          <Input
            placeholder="✉  Email:"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Button
            title="Send"
            onPress={() => router.push('/verification')}
            style={styles.sendBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Back to </Text>
            <TouchableOpacity onPress={() => router.push('/sign-in')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  sub: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  sendBtn: { width: '100%', marginTop: spacing.sm },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    justifyContent: 'center',
  },
  footerText: { color: colors.secondary, fontSize: fontSize.sm },
  footerLink: { color: colors.text, fontSize: fontSize.sm, fontWeight: '700' },
});