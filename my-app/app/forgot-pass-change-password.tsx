import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { authApi } from '../api/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { colors, fontSize, spacing } from '../constants/theme';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { tempCode, email } = useLocalSearchParams<{ tempCode: string, email: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    console.log('Reset Params:', { email, tempCode });
  }, [email, tempCode]);

  const handleReset = async () => {
    setErrorMsg(null);

    if (!email || !tempCode) {
      setErrorMsg('Session expired. Please request a new code.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword(
        email,     
        tempCode,   
        newPassword, 
        confirmPassword
      );

      router.replace({ pathname: '/sign-in', params: { resetSuccess: 'true' } });
    } catch (err: any) {
      console.error('Full API Error:', err);
      setErrorMsg(err.message || 'Failed to update password');
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
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.title}>New Password 🔑</Text>
            <Text style={styles.sub}>Enter your new secure password.</Text>
          </View>

          <View style={styles.form}>
            <Input
              placeholder="🔑  New Password:"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              editable={!loading}
            />
            <Input
              placeholder="🔑  Confirm New Password:"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />

            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            <Button
              title={loading ? 'Updating...' : 'UPDATE PASSWORD'}
              onPress={handleReset}
              style={styles.mainBtn}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl },
  header: { marginBottom: spacing.xl, gap: spacing.sm },
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '800' },
  sub: { color: colors.secondary, fontSize: fontSize.sm },
  form: { gap: spacing.md },
  errorBox: { 
    backgroundColor: '#FFEBEE', 
    padding: spacing.sm, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#FFCDD2' 
  },
  errorText: { 
    color: '#D32F2F', 
    fontSize: fontSize.sm, 
    textAlign: 'center', 
    fontWeight: '600' 
  },
  mainBtn: { width: '100%', marginTop: spacing.md },
});