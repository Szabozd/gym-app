import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLanguageStore } from '../store/languageStore';

export default function Layout() {
  const { t } = useLanguageStore();

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: '#888',
            tabBarLabelStyle: styles.tabLabel,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: t('nav.home'),
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="workout"
            options={{
              title: t('nav.workout'),
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="barbell" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="routines"
            options={{
              title: t('nav.routines'),
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="library"
            options={{
              title: t('nav.library'),
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="book" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="progress"
            options={{
              title: t('nav.progress'),
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="stats-chart" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  tabBar: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#333',
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 16,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
