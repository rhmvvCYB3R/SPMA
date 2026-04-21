import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarScreen() {
  const today = new Date();
  const [monthIdx, setMonthIdx] = useState(today.getMonth()); // 0-based
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [view, setView] = useState<'today' | 'calendar'>('today');

  const year = today.getFullYear();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = MONTHS[(monthIdx - 1 + 12) % 12];
  const nextMonth = MONTHS[(monthIdx + 1) % 12];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.email}>yuskaragimov79@gmail.com</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🦊</Text>
          </View>
        </View>

        {/* Today / Calendar toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setView('today')}
            style={[styles.toggleBtn, view === 'today' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, view === 'today' && styles.toggleTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setView('calendar')}
            style={[styles.toggleBtn, view === 'calendar' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, view === 'calendar' && styles.toggleTextActive]}>
              Calendar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Month navigator */}
        <View style={styles.monthNav}>
          <Text style={styles.sideMonth}>{prevMonth}</Text>
          <TouchableOpacity onPress={() => setMonthIdx((m) => (m - 1 + 12) % 12)} style={styles.arrow}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.currentMonth}>{MONTHS[monthIdx]}</Text>
          <TouchableOpacity onPress={() => setMonthIdx((m) => (m + 1) % 12)} style={styles.arrow}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
          <Text style={styles.sideMonth}>{nextMonth}</Text>
        </View>

        {/* Days horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daysScroll}
          contentContainerStyle={styles.daysContent}
        >
          {days.map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => setSelectedDay(d)}
              style={[styles.dayBtn, selectedDay === d && styles.dayBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayNum, selectedDay === d && styles.dayNumActive]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected day info */}
        <View style={styles.dayInfoCard}>
          <Text style={styles.dayInfoTitle}>
            {MONTHS[monthIdx]} {selectedDay}
          </Text>
          <Text style={styles.dayInfoSub}>No tasks scheduled</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  email: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 26 },

  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  toggleBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.tagBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: { color: colors.tagText, fontSize: fontSize.sm, fontWeight: '500' },
  toggleTextActive: { color: colors.buttonText, fontWeight: '700' },

  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sideMonth: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '500',
    width: 36,
    textAlign: 'center',
  },
  arrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  arrowText: { color: colors.text, fontSize: 20, fontWeight: '300', lineHeight: 24 },
  currentMonth: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    width: 48,
    textAlign: 'center',
  },

  daysScroll: { marginBottom: spacing.xl },
  daysContent: { gap: spacing.sm, paddingRight: spacing.xl },
  dayBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayNum: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600' },
  dayNumActive: { color: colors.buttonText, fontWeight: '800' },

  dayInfoCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.sm,
  },
  dayInfoTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  dayInfoSub: { color: colors.textMuted, fontSize: fontSize.sm },
});