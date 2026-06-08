import AsyncStorage from '@react-native-async-storage/async-storage';
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
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { File, Paths } from 'expo-file-system';
import { clearSession, getStoredEmail, getToken } from '../../api/api';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

const AVAILABLE_AVATARS = [
  '🦊',
  '🐱',
  '🐶',
  '🦁',
  '🐼',
  '🐨',
  '🐯',
  '🐸',
  '🐙',
  '🦄',
  '🤖',
  '👾',
];

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
  badge?: string;
  onPress?: () => void;
}

function SettingRow({
  icon,
  label,
  value,
  badge,
  onPress,
}: RowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.rowIcon}>{icon}</Text>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>

      <View style={styles.rowRight}>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : (
          <View style={styles.chevronWrap}>
            <Text style={styles.value}>{value}</Text>
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

  const [isAvatarModalVisible, setIsAvatarModalVisible] =
    useState(false);

  const [isNotifyModalVisible, setIsNotifyModalVisible] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        try {
          const [
            storedEmail,
            storedAvatar,
            storedInterval,
          ] = await Promise.all([
            getStoredEmail(),
            AsyncStorage.getItem(AVATAR_STORAGE_KEY),
            AsyncStorage.getItem(NOTIFY_STORAGE_KEY),
          ]);

          if (active) {
            setEmail(storedEmail ?? '');

            if (storedAvatar) {
              setAvatar(storedAvatar);
            }

            if (storedInterval) {
              setIntervalLabel(storedInterval);
            }
          }
        } catch {
          setEmail('');
        }
      };

      load();

      return () => {
        active = false;
      };
    }, []),
  );

  const scheduleNotification = async (minutes: number) => {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(
          'default',
          {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
          },
        );
      }

      const { status } =
        await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Enable notifications in settings',
        );
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder 📝',
          body: "Don't forget to check your tasks!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: minutes * 60,
          repeats: true,
        },
      });

      Alert.alert('Success', 'Notifications enabled');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Notification failed');
    }
  };

  const selectInterval = async (
    label: string,
    minutes: number,
  ) => {
    setIsNotifyModalVisible(false);

    try {
      setIntervalLabel(label);

      await AsyncStorage.setItem(
        NOTIFY_STORAGE_KEY,
        label,
      );

      await scheduleNotification(minutes);
    } catch {
      Alert.alert(
        'Error',
        'Failed to save notification settings',
      );
    }
  };

  const selectAvatar = async (item: string) => {
    try {
      await AsyncStorage.setItem(
        AVATAR_STORAGE_KEY,
        item,
      );

      setAvatar(item);

      setIsAvatarModalVisible(false);
    } catch {
      Alert.alert(
        'Error',
        'Failed to save avatar locally',
      );
    }
  };

  const handleExport = async () => {
  try {
    setLoading(true);

    const token = await getToken();

    const downloadUrl =
      'https://sp-ma.duckdns.org/api/tasks/export';

    const file = new File(
      Paths.document,
      'progress.xlsx'
    );

    try {
      await file.delete();
    } catch {}

    await File.downloadFileAsync(
      downloadUrl,
      file,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const canShare = await Sharing.isAvailableAsync();

    if (!canShare) {
      Alert.alert('Error', 'Sharing not available');
      return;
    }

    await Sharing.shareAsync(file.uri);

    Alert.alert('Success', 'File downloaded');
  } catch (err: any) {
    console.log(err);

    Alert.alert(
      'Export Failed',
      err?.message || 'Something went wrong'
    );
  } finally {
    setLoading(false);
  }
};

  const handleSignOut = async () => {
    try {
      await clearSession();
      router.replace('/start');
    } catch {
      router.replace('/start');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>
              {avatar}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              setIsAvatarModalVisible(true)
            }
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Profile</Text>

        <View style={styles.card}>
          <SettingRow
            icon="✉️"
            label="E-mail"
            value={email || '—'}
            onPress={() =>
              router.push('/change-email')
            }
          />

          <View style={styles.divider} />

          <SettingRow
            icon="🔑"
            label="Password"
            value="••••••••"
            onPress={() =>
              router.push('/change-pass')
            }
          />

          <View style={styles.divider} />

          <SettingRow
            icon="🔔"
            label="Notifications"
            badge={intervalLabel}
            onPress={() =>
              setIsNotifyModalVisible(true)
            }
          />

          <View style={styles.divider} />

          <SettingRow
            icon="📥"
            label={
              loading
                ? 'Downloading...'
                : 'Download Progress'
            }
            badge=".xlsx"
            onPress={handleExport}
          />
        </View>

        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>
            Sign Out
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent
          visible={isAvatarModalVisible}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() =>
              setIsAvatarModalVisible(false)
            }
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Choose Avatar
              </Text>

              <View style={styles.avatarGrid}>
                {AVAILABLE_AVATARS.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.avatarOption}
                    onPress={() =>
                      selectAvatar(item)
                    }
                  >
                    <Text style={styles.optionEmoji}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          animationType="slide"
          transparent
          visible={isNotifyModalVisible}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() =>
              setIsNotifyModalVisible(false)
            }
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Notification Interval
              </Text>

              {NOTIFICATION_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={styles.intervalOption}
                  onPress={() =>
                    selectInterval(
                      opt.label,
                      opt.value,
                    )
                  }
                >
                  <Text style={styles.intervalText}>
                    {opt.label}
                  </Text>
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
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

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
    marginBottom: spacing.lg,
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

  avatarEmoji: {
    fontSize: 44,
  },

  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  editIcon: {
    fontSize: 18,
  },

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },

  rowLabel: {
    color: colors.text,
    fontSize: fontSize.sm,
  },

  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  chevronWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  value: {
    color: colors.textMuted,
    marginRight: 5,
  },

  chevron: {
    color: colors.textMuted,
    fontSize: 18,
  },

  badge: {
    backgroundColor: colors.bgInput,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  badgeText: {
    color: colors.secondary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
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
    fontWeight: '700',
  },

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
  },

  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.text,
  },

  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  avatarOption: {
    margin: 8,
  },

  optionEmoji: {
    fontSize: 36,
  },

  intervalOption: {
    width: '100%',
    padding: spacing.md,
    alignItems: 'center',
  },

  intervalText: {
    color: colors.text,
    fontSize: fontSize.md,
  },
});