import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import TaskCard from '../../components/ui/TaskCard';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Start to learn React Native',
    subtitle: 'Use react native with expo, and create first app',
    dueLabel: 'TODAY',
    completed: false,
  },
  {
    id: '2',
    title: 'Complete Figma ux/ui',
    subtitle: 'Complete figma project',
    dueLabel: 'TODAY',
    completed: false,
  },
  {
    id: '3',
    title: 'Go to the store',
    subtitle: 'Buy bread, Pepsi, olive oil, and sweets',
    dueLabel: 'TODAY',
    completed: false,
  },
];

const FILTERS = ['Today', 'Done', 'To Do', 'Not Done'];

export default function HomeScreen() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState('Today');

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const remove = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const filtered = tasks.filter((t) => {
    if (activeFilter === 'Done') return t.completed;
    if (activeFilter === 'To Do' || activeFilter === 'Not Done') return !t.completed;
    return true;
  });

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

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.chip, activeFilter === f && styles.chipActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Task list */}
        <View style={styles.taskList}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No tasks here</Text>
            </View>
          ) : (
            filtered.map((t) => (
              <TaskCard
                key={t.id}
                title={t.title}
                subtitle={t.subtitle}
                dueLabel={t.dueLabel}
                completed={t.completed}
                onToggle={() => toggle(t.id)}
                onDelete={() => remove(t.id)}
              />
            ))
          )}
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
  email: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarEmoji: { fontSize: 26 },
  filtersScroll: { marginBottom: spacing.lg },
  filtersContent: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.tagBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.tagText,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.buttonText,
    fontWeight: '700',
  },
  taskList: {},
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md },
});