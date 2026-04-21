import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

interface TaskCardProps {
  title: string;
  subtitle: string;
  dueLabel?: string;
  completed?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
}

export default function TaskCard({
  title,
  subtitle,
  dueLabel = 'TODAY',
  completed,
  onToggle,
  onDelete,
}: TaskCardProps) {
  return (
    <View style={[styles.card, completed && styles.cardCompleted]}>
      {/* Bullet */}
      <View style={styles.bullet} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, completed && styles.titleDone]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
        <View style={styles.dueRow}>
          <Text style={styles.dueIcon}>🗓</Text>
          <Text style={styles.dueLabel}>{dueLabel}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onDelete} style={styles.actionBtn} activeOpacity={0.7}>
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggle} style={[styles.actionBtn, styles.checkBtn, completed && styles.checkBtnActive]} activeOpacity={0.7}>
          <Text style={[styles.checkIcon, completed && styles.checkIconActive]}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardCompleted: {
    opacity: 0.55,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 5,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    lineHeight: 16,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  dueIcon: { fontSize: 11 },
  dueLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'flex-start',
    marginTop: 2,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkBtn: {},
  checkBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  deleteIcon: { fontSize: 12 },
  checkIcon: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
  },
  checkIconActive: {
    color: colors.buttonText,
  },
});