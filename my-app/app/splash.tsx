import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize } from '../constants/theme';

export default function SplashScreen() {
  useEffect(() => {
    const t = setTimeout(() => router.replace('/start'), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      {/* Subtle radial glow in center */}
      <View style={styles.glow} />

      <View style={styles.logoWrap}>
        <View style={styles.logoRow}>
          <Text style={styles.logo}>SPMA</Text>
          <Text style={styles.reg}>®</Text>
        </View>
        <Text style={styles.tagline}>Your Study Planner{'\n'}App</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignSelf: 'center',
    top: '30%',
  },
  logoWrap: {
    alignItems: 'center',
    gap: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logo: {
    color: colors.text,
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -1,
  },
  reg: {
    color: colors.secondary,
    fontSize: 16,
    marginTop: 8,
    marginLeft: 2,
  },
  tagline: {
    color: colors.secondary,
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
});