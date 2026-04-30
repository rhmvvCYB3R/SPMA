import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tasksApi } from '../../api/api';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

interface TaskCardProps {
  id: number; 
  title: string;
  subtitle: string;
  dueLabel?: string;
  completed?: boolean;
  onToggle?: () => void;
  onDeleteSuccess?: (id: number) => void; 
}

export default function TaskCard({
  id,
  title,
  subtitle,
  dueLabel = 'TODAY',
  completed,
  onToggle,
  onDeleteSuccess,
}: TaskCardProps) {

  const handleDirectDelete = async () => {
    try {
      await tasksApi.delete(id);
      
      onDeleteSuccess?.(id);
    } catch (err: any) {
      console.error(`[Card] Ошибка удаления ID ${id}:`, err);
      Alert.alert('Ошибка', err.message || 'Не удалось удалить задачу');
    }
  };

  return (
    <View style={[styles.card, completed && styles.cardCompleted]}>
      <View style={styles.leftSection}>
        <View style={styles.bullet} />
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
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={handleDirectDelete} // Теперь вызываем внутреннюю функцию
          style={styles.actionBtn}
          activeOpacity={0.2}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 10 }}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onToggle} 
          style={[styles.actionBtn, styles.checkBtn, completed && styles.checkBtnActive]}
          activeOpacity={0.2}
          hitSlop={{ top: 20, bottom: 20, left: 10, right: 20 }}
        >
          <Text style={[styles.checkIcon, completed && styles.checkIconActive]}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
  },
  cardCompleted: { opacity: 0.6 },
  leftSection: { flexDirection: 'row', flex: 1, alignItems: 'flex-start', gap: spacing.sm },
  bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
  content: { flex: 1 },
  title: { color: colors.text, fontSize: fontSize.sm, fontWeight: '700' },
  titleDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  subtitle: { color: colors.textMuted, fontSize: fontSize.xs },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  dueIcon: { fontSize: 12 },
  dueLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: spacing.xs, marginLeft: spacing.sm, alignItems: 'center' },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkBtn: {},
  checkBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  deleteIcon: { fontSize: 16, color: '#FF4444' },
  checkIcon: { fontSize: 16, color: colors.textMuted },
  checkIconActive: { color: colors.buttonText },
});