import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  icon?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  style?: ViewStyle;
  focused?: boolean;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  icon,
  autoCapitalize = 'none',
  multiline,
  numberOfLines,
  maxLength,
  style,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        multiline && styles.multiline,
        isFocused && styles.containerFocused,
        style,
      ]}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {maxLength && (
        <Text style={styles.counter}>{value.length}/{maxLength}</Text>
      )}
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
          <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    height: 50,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  containerFocused: {
    borderColor: colors.borderFocus,
  },
  multiline: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  icon: {
    fontSize: 15,
    marginRight: spacing.sm,
    color: colors.textMuted,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.sm,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  counter: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 14 },
});