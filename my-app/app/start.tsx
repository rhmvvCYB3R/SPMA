
import { router } from 'expo-router';
import { useEffect } from 'react'; // Добавили useEffect
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getToken } from '../api/api'; // Импортируем проверку токена
import Button from '../components/ui/Button';
import { colors, fontSize, spacing } from '../constants/theme';

export default function StartScreen() {
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        // Используем replace, чтобы пользователь не мог вернуться назад на экран старта
        router.replace('/(tabs)'); 
      }
    };

    checkAuth();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.textWrap}>
          <Text style={styles.heading}>Get{'\n'}Started!</Text>
          <Text style={styles.sub}>Start with sign up or sign in</Text>
        </View>

        <View style={styles.buttons}>
          <Button
            title="SIGN UP"
            onPress={() => router.push('/sign-up')}
            style={styles.btn}
          />
          <Button
            title="SIGN IN"
            onPress={() => router.push('/sign-in')}
            style={styles.btn}
          />
        </View>
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
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  textWrap: {
    gap: spacing.sm,
  },
  heading: {
    color: colors.text,
    fontSize: fontSize.xxxl,
    fontWeight: '800',
    lineHeight: 46,
    letterSpacing: -1,
  },
  sub: {
    color: colors.secondary,
    fontSize: fontSize.md,
    marginTop: 4,
  },
  buttons: {
    gap: spacing.md,
  },
  btn: {
    width: '100%',
  },
});