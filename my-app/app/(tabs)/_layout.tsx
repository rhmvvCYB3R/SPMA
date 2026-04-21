import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { radius } from '../../constants/theme';

// SVG-style icon using text emoji replacements to match icon-style nav
const ICONS = {
  home: '⌂',
  calendar: '▦',
  tasks: '⊞',
  settings: '⚙',
};

function TabIcon({ name, focused }: { name: keyof typeof ICONS; focused: boolean }) {
  return (
    <View style={[styles.icon, focused && styles.iconActive]}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>
        {name === 'home' ? '🏠' : name === 'calendar' ? '📅' : name === 'tasks' ? '📋' : '⚙️'}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarBackground: () => <View style={styles.tabBarBg} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="tasks" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: '#222222',
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    paddingBottom: 0,
  },
  tabBarBg: {
    flex: 1,
    borderRadius: radius.full,
    backgroundColor: '#222222',
  },
  icon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  iconActive: {
    backgroundColor: '#333333',
  },
  iconText: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconTextActive: {
    opacity: 1,
  },
});