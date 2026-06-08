import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
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
import { colors, fontSize, radius, spacing } from '../../constants/theme';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const AVATAR_STORAGE_KEY = '@user_avatar';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function CalendarScreen() {
  const today = new Date();
  const scrollRef = useRef<ScrollView>(null);
  
  const [monthIdx, setMonthIdx] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('🦊');

  const year = today.getFullYear();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          setLoading(true);
          const [data, storedEmail, storedAvatar] = await Promise.all([
            tasksApi.getAll(),
            getStoredEmail(),
            AsyncStorage.getItem(AVATAR_STORAGE_KEY)
          ]);
          if (active) {
            setTasks(data);
            setEmail(storedEmail ?? '');
            if (storedAvatar) setAvatar(storedAvatar);
          }
        } catch (err: any) {
          Alert.alert('Error', err.message ?? 'Failed to load tasks');
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, []),
  );

  const handleTodayPress = () => {
    const d = today.getDate();
    const m = today.getMonth();
    setMonthIdx(m);
    setSelectedDay(d);
    
    scrollRef.current?.scrollTo({ x: (d - 1) * 50, animated: true });
  };

  const selectedDateStr = `${year}-${pad(monthIdx + 1)}-${pad(selectedDay)}`;
  const tasksForDay = tasks.filter((t) => t.dueDate === selectedDateStr);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Calendar</Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={handleTodayPress} style={styles.todayBtn}>
            <Text style={styles.todayBtnText}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* Month Navigator */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => setMonthIdx((m) => (m - 1 + 12) % 12)} style={styles.arrow}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.currentMonth}>{MONTHS[monthIdx]} {year}</Text>
          <TouchableOpacity onPress={() => setMonthIdx((m) => (m + 1) % 12)} style={styles.arrow}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Days Horizontal */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daysScroll}
          contentContainerStyle={styles.daysContent}
        >
          {days.map((d) => {
            const dateStr = `${year}-${pad(monthIdx + 1)}-${pad(d)}`;
            const hasTasks = tasks.some((t) => t.dueDate === dateStr);
            const isToday = d === today.getDate() && monthIdx === today.getMonth();

            return (
              <TouchableOpacity
                key={d}
                onPress={() => setSelectedDay(d)}
                style={[
                  styles.dayBtn, 
                  selectedDay === d && styles.dayBtnActive,
                  isToday && !selectedDay && styles.dayBtnToday
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayNum, selectedDay === d && styles.dayNumActive]}>
                  {d}
                </Text>
                {hasTasks && (
                  <View style={[styles.dot, selectedDay === d && styles.dotActive]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tasks Section */}
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
        ) : (
          <View style={styles.dayInfoCard}>
            <Text style={styles.dayInfoTitle}>
              {MONTHS[monthIdx]} {selectedDay}
            </Text>
            {tasksForDay.length === 0 ? (
              <Text style={styles.dayInfoSub}>No tasks scheduled</Text>
            ) : (
              tasksForDay.map((t) => (
                <View key={t.id} style={styles.taskRow}>
                  <View style={[styles.taskDot, t.status === 'DONE' ? styles.taskDotDone : styles.taskDotPending]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.taskTitle, t.status === 'DONE' && styles.taskTitleDone]}>
                      {t.title}
                    </Text>
                    {!!t.description && (
                      <Text style={styles.taskSub} numberOfLines={1}>{t.description}</Text>
                    )}
                  </View>
                  <Text style={styles.taskStatus}>{t.status === 'DONE' ? '✓' : '○'}</Text>
                </View>
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
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '800' },
  emailText: { color: colors.textMuted, fontSize: fontSize.xs },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 26 },
  
  actionRow: { marginBottom: spacing.md },
  todayBtn: { 
    paddingHorizontal: spacing.md, 
    paddingVertical: 6, 
    borderRadius: radius.md, 
    backgroundColor: colors.primary,
    alignSelf: 'flex-start'
  },
  todayBtnText: { color: colors.buttonText, fontWeight: '700', fontSize: fontSize.sm },

  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  arrow: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgCard, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  arrowText: { color: colors.text, fontSize: 22 },
  currentMonth: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },

  daysScroll: { marginBottom: spacing.xl },
  daysContent: { gap: spacing.sm, paddingRight: spacing.xl },
  dayBtn: { width: 42, height: 50, borderRadius: radius.md, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 4 },
  dayBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayBtnToday: { borderColor: colors.primary },
  dayNum: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600' },
  dayNumActive: { color: colors.buttonText, fontWeight: '800' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.primary },
  dotActive: { backgroundColor: colors.buttonText },

  dayInfoCard: { backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  dayInfoTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  dayInfoSub: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center', paddingVertical: 10 },
  
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  taskDot: { width: 8, height: 8, borderRadius: 4 },
  taskDotPending: { backgroundColor: colors.primary },
  taskDotDone: { backgroundColor: colors.textMuted },
  taskTitle: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  taskTitleDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  taskSub: { color: colors.textMuted, fontSize: fontSize.xs },
  taskStatus: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600', marginLeft: 'auto' },
});