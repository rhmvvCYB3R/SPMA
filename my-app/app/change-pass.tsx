import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReset = async () => {
    setErrorMsg(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      await authApi.updatePassword(
        oldPassword,
        newPassword,
        confirmPassword
      );

      router.back(); 
    } catch (err: any) {
      console.error('Update Password Error:', err);
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
            <Text style={styles.title}>Change Password 🔑</Text>
            <Text style={styles.sub}>Enter your current and new password</Text>
          </View>

          <View style={styles.form}>
            <Input
              placeholder="🔒  Current Password"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              editable={!loading}
            />
            
            <Input
              placeholder="🔑  New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              editable={!loading}
            />
            
            <Input
              placeholder="✅  Confirm New Password"
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