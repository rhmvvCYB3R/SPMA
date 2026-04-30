import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { tasksApi } from '../../api/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { colors, fontSize, spacing } from '../../constants/theme';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    details?: string;
    date?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!taskName.trim()) newErrors.name = 'Please enter a task name';
    if (!details.trim()) newErrors.details = 'Please enter details';

    if (!date || isNaN(date.getTime())) {
      newErrors.date = 'Please select a valid date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await tasksApi.create(
        taskName.trim(),
        details.trim(),
        formatDate(date),
      );

      Alert.alert('Success ✓', `Task "${taskName.trim()}" has been added!`, [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Add New Task</Text>

          <Input
            placeholder="Task name *"
            value={taskName}
            onChangeText={setTaskName}
          />
          {!!errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <Input
            placeholder="Details *"
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={4}
          />
          {!!errors.details && (
            <Text style={styles.error}>{errors.details}</Text>
          )}

          {Platform.OS === 'web' ? (
            <Input
              placeholder="YYYY-MM-DD *"
              value={formatDate(date)}
              onChangeText={(text) => {
                const parsed = new Date(text);
                if (!isNaN(parsed.getTime())) {
                  setDate(parsed);
                }
              }}
            />
          ) : (
            <>
              <Pressable
                onPress={() => setShowPicker(true)}
                style={styles.dateBox}
              >
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </Pressable>

              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
            </>
          )}

          {!!errors.date && <Text style={styles.error}>{errors.date}</Text>}

          <View style={styles.spacer} />

          <Button
            title={loading ? 'Adding…' : 'Add Task'}
            onPress={handleAdd}
            disabled={loading}
            style={styles.addBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  dateBox: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    marginTop: 10,
  },
  dateText: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
  error: {
    color: '#ff4d4d',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  spacer: { height: 20 },
  addBtn: {
    width: '100%',
    marginTop: spacing.lg,
  },
});