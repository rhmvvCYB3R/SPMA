import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView, ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

interface RowProps {
  icon: string;
  label: string;
  value?: string;
  isSwitch?: boolean;
  badge?: string;
  onPress?: () => void;
}

function SettingRow({ icon, label, value, isSwitch, badge, onPress }: RowProps) {
  const [enabled, setEnabled] = useState(true);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.rowIcon}>{icon}</Text>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {isSwitch ? (
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: colors.border, true: '#555' }}
            thumbColor={enabled ? colors.primary : colors.textMuted}
            style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
          />
        ) : badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : (
          <View style={styles.chevronWrap}>
            <Text style={styles.value} numberOfLines={1}>{value}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Settings</Text>

        {/* Avatar with edit icon */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🦊</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile section */}
        <Text style={styles.sectionLabel}>Profile</Text>
        <View style={styles.card}>
          <SettingRow
            icon="✉️"
            label="E-mail:"
            value="yuskaragimov79@gmail.com"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🔑"
            label="Password"
            value="••••••••••••••"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🎨"
            label="Theme"
            badge="Dark ∨"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🔔"
            label="Notifications"
            badge="15 min ∨"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📥"
            label="Download All Progress"
            badge=".xlsx ↓"
            onPress={() => Alert.alert('Download', 'Exporting progress as .xlsx...')}
          />
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => router.replace('/start')}
          activeOpacity={0.85}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 120,
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: spacing.lg,
    alignSelf: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 38 },
  editBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: { fontSize: 13 },

  sectionLabel: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  card: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  rowIcon: { fontSize: 16, width: 22 },
  rowLabel: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 180,
  },
  chevronWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    maxWidth: 150,
    textAlign: 'right',
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 16,
  },
  badge: {
    backgroundColor: colors.bgInput,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    color: colors.secondary,
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  signOutBtn: {
    width: '100%',
    height: 50,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: '#c0392b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    color: '#e74c3c',
    fontSize: fontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});