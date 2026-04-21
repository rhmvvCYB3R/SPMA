import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView, Platform,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [details, setDetails] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleAdd = () => {
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }
    Alert.alert('Success ✓', `Task "${taskName}" added!`);
    setTaskName('');
    setDetails('');
    setDateTime('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Add New Task</Text>

          {/* Task name */}
          <Input
            placeholder="Enter task name ..."
            value={taskName}
            onChangeText={setTaskName}
            autoCapitalize="sentences"
          />

          {/* Details multiline */}
          <Input
            placeholder="Provide task details ..."
            value={details}
            onChangeText={setDetails}
            autoCapitalize="sentences"
            multiline
            numberOfLines={4}
            maxLength={36}
          />

          {/* Date & Time button */}
          <TouchableOpacity
            style={styles.dateTimeBtn}
            onPress={() => Alert.alert('Date & Time', 'Date/time picker coming soon')}
            activeOpacity={0.8}
          >
            <Text style={styles.dateTimeText}>
              {dateTime || 'Date&Time'} 🗓
            </Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          <Button
            title="Add Task"
            onPress={handleAdd}
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
    paddingBottom: 120,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  dateTimeBtn: {
    height: 50,
    borderRadius: radius.xl,
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  dateTimeText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  spacer: { flex: 1, minHeight: spacing.xl },
  addBtn: {
    width: '100%',
    marginTop: spacing.lg,
  },
});