import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, fontSize, radius } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[styles.base, styles[variant], style, disabled && styles.disabled]}
    >
      <Text style={[styles.text, styles[`text_${variant}` as keyof typeof styles] as TextStyle, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  primary: {
    backgroundColor: colors.bgButton,
  },
  outline: {
    backgroundColor: colors.bgButton,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.35,
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  text_primary: {
    color: colors.buttonText,
  },
  text_outline: {
    color: colors.buttonText,
  },
  text_ghost: {
    color: colors.accent,
  },
});