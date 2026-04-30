import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getStoredEmail, Task, tasksApi } from '../../api/api';
import TaskCard from '../../components/ui/TaskCard';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

const FILTERS = ['All', 'To Do', 'Done'];
const AVATAR_STORAGE_KEY = '@user_avatar';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('🦊');

  const loadData = async (active: boolean) => {
    try {
      setLoading(true);
      const [data, storedEmail, storedAvatar] = await Promise.all([
        tasksApi.getAll(),
        getStoredEmail(),
        AsyncStorage.getItem(AVATAR_STORAGE_KEY),
      ]);
      if (active) {
        setTasks(data);
        setEmail(storedEmail ?? '');
        if (storedAvatar) setAvatar(storedAvatar);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to load data');
    } finally {
      if (active) setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadData(active);
      return () => { active = false; };
    }, []),
  );

  const handleToggle = async (task: Task) => {
    try {
      const updated = await tasksApi.markDone(task.id);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to update task');
    }
  };

  const filtered = tasks.filter((t) => {
    if (activeFilter === 'Done') return t.status === 'DONE';
    if (activeFilter === 'To Do') return t.status === 'PENDING';
    return true;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </View>
        </View>

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

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
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
                  id={t.id} 
                  title={t.title}
                  subtitle={t.description}
                  dueLabel={t.dueDate ?? 'No date'}
                  completed={t.status === 'DONE'}
                  onToggle={() => handleToggle(t)}
                  onDeleteSuccess={(deletedId) => {
                    setTasks(prev => prev.filter(task => task.id !== deletedId));
                  }}
                />
              ))
            )}
          </View>
        )}
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
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.tagText, fontSize: fontSize.sm, fontWeight: '500' },
  chipTextActive: { color: colors.buttonText, fontWeight: '700' },
  taskList: {},
  empty: { alignItems: 'center', paddingTop: spacing.xxl, gap: spacing.md },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md },
});