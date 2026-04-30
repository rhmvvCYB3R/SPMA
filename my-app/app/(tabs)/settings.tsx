import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { router, useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { clearSession, getStoredEmail, getToken } from '../../api/api';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

const AVAILABLE_AVATARS = ['🦊', '🐱', '🐶', '🦁', '🐼', '🐨', '🐯', '🐸', '🐙', '🦄', '🤖', '👾'];
const NOTIFICATION_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
];

const AVATAR_STORAGE_KEY = '@user_avatar';
const NOTIFY_STORAGE_KEY = '@notify_interval';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
            <Text style={styles.value} numberOfLines={1}>
              {value}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState('🦊');
  const [intervalLabel, setIntervalLabel] = useState('15 min');
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [isNotifyModalVisible, setIsNotifyModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        try {
          const [storedEmail, storedAvatar, storedInterval] = await Promise.all([
            getStoredEmail(),
            AsyncStorage.getItem(AVATAR_STORAGE_KEY),
            AsyncStorage.getItem(NOTIFY_STORAGE_KEY)
          ]);
          
          if (active) {
            setEmail(storedEmail ?? '');
            if (storedAvatar) setAvatar(storedAvatar);
            if (storedInterval) setIntervalLabel(storedInterval);
          }
        } catch (e) {
          if (active) setEmail('');
        }
      };
      load();
      return () => { active = false; };
    }, []),
  );

  const scheduleNotification = async (minutes: number) => {
    if (Platform.OS !== 'web') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please enable notifications in settings');
        return;
      }
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Reminder 📝",
        body: "Don't forget to check your tasks!",
      },
      trigger: {
        seconds: minutes * 60,
        repeats: true,
      } as Notifications.NotificationTriggerInput,
    });
  };

 const selectInterval = async (label: string, minutes: number) => {
    setIsNotifyModalVisible(false);
    
    try {
      setIntervalLabel(label);
      
      await Promise.all([
        AsyncStorage.setItem(NOTIFY_STORAGE_KEY, label),
        scheduleNotification(minutes)
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to save notification settings');
    }
  };

  const selectAvatar = async (item: string) => {
    try {
      await AsyncStorage.setItem(AVATAR_STORAGE_KEY, item);
      setAvatar(item);
      setIsAvatarModalVisible(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to save avatar locally');
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const downloadUrl = `http://10.55.100.196:8080/api/tasks/export`;

      if (Platform.OS === 'web') {
        const response = await fetch(downloadUrl, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to download file');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'progress.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const fileUri = FileSystem + 'progress.xlsx';
        const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (downloadRes.status === 200) {
          await Sharing.shareAsync(downloadRes.uri);
        } else {
          throw new Error(`Server returned ${downloadRes.status}`);
        }
      }
    } catch (err: any) {
      Alert.alert('Export Failed', err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await clearSession();
      router.replace('/start');
    } catch (e) {
      router.replace('/start');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editBtn} 
            onPress={() => setIsAvatarModalVisible(true)}
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Profile</Text>

        <View style={styles.card}>
          <SettingRow
            icon="✉️"
            label="E-mail:"
            value={email && email.length > 0 ? email : '—'}
            onPress={() => router.push('/change-email')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🔑"
            label="Password"
            value="••••••••••••"
            onPress={() => router.push('/change-pass')}
          />
          <View style={styles.divider} />
          <SettingRow 
            icon="🔔" 
            label="Notifications" 
            badge={`${intervalLabel} ∨`} 
            onPress={() => setIsNotifyModalVisible(true)}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📥"
            label={loading ? "Downloading..." : "Download All Progress"}
            badge=".xlsx ↓"
            onPress={handleExport}
          />
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.85}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Modal для Аватара */}
        <Modal animationType="fade" transparent visible={isAvatarModalVisible} onRequestClose={() => setIsAvatarModalVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsAvatarModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Avatar</Text>
              <View style={styles.avatarGrid}>
                {AVAILABLE_AVATARS.map((item) => (
                  <TouchableOpacity key={item} style={styles.avatarOption} onPress={() => selectAvatar(item)}>
                    <Text style={styles.optionEmoji}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal для Уведомлений */}
        <Modal animationType="slide" transparent visible={isNotifyModalVisible} onRequestClose={() => setIsNotifyModalVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsNotifyModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Notification Interval</Text>
              {NOTIFICATION_OPTIONS.map((opt) => (
                <TouchableOpacity key={opt.value} style={styles.intervalOption} onPress={() => selectInterval(opt.label, opt.value)}>
                  <Text style={styles.intervalText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 44 },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: { fontSize: 14 },
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
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  rowIcon: { fontSize: 16, width: 22 },
  rowLabel: { color: colors.text, fontSize: fontSize.sm, fontWeight: '500' },
  rowRight: { flexDirection: 'row', alignItems: 'center', maxWidth: 180 },
  chevronWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  value: { color: colors.textMuted, fontSize: fontSize.xs, maxWidth: 150, textAlign: 'right' },
  chevron: { color: colors.textMuted, fontSize: 16 },
  badge: {
    backgroundColor: colors.bgInput,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: { color: colors.secondary, fontSize: fontSize.xs, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },
  signOutBtn: {
    width: '100%',
    height: 50,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: '#c0392b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: { color: '#e74c3c', fontSize: fontSize.md, fontWeight: '700', letterSpacing: 0.5 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionEmoji: { fontSize: 32 },
  intervalOption: {
    width: '100%',
    padding: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  intervalText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  }
});