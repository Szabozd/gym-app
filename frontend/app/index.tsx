import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGymStore } from '../store/gymStore';
import { useLanguageStore } from '../store/languageStore';
import LanguageToggle from '../components/LanguageToggle';
import { format, isToday, isThisWeek } from 'date-fns';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { workouts, loadData } = useGymStore();
  const { t } = useLanguageStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const todayWorkouts = workouts.filter((w) => isToday(new Date(w.date)));
  const weekWorkouts = workouts.filter((w) => isThisWeek(new Date(w.date)));
  const totalSets = workouts.reduce(
    (acc, w) => acc + w.exercises.reduce((a, e) => a + e.sets.length, 0),
    0
  );

  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        testID="home-scroll"
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{t('welcome')}</Text>
              <Text style={styles.title}>{t('app.title')}</Text>
            </View>
            <LanguageToggle />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard} testID="stat-today">
            <Ionicons name="today" size={28} color="#4CAF50" />
            <Text style={styles.statNumber}>{todayWorkouts.length}</Text>
            <Text style={styles.statLabel}>{t('home.today')}</Text>
          </View>
          <View style={styles.statCard} testID="stat-week">
            <Ionicons name="calendar" size={28} color="#2196F3" />
            <Text style={styles.statNumber}>{weekWorkouts.length}</Text>
            <Text style={styles.statLabel}>{t('home.thisWeek')}</Text>
          </View>
          <View style={styles.statCard} testID="stat-sets">
            <Ionicons name="fitness" size={28} color="#FF9800" />
            <Text style={styles.statNumber}>{totalSets}</Text>
            <Text style={styles.statLabel}>{t('home.totalSets')}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              testID="start-workout-btn"
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => router.push('/workout')}
            >
              <Ionicons name="add-circle" size={32} color="#fff" />
              <Text style={styles.actionText}>{t('home.startWorkout')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="my-routines-btn"
              style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
              onPress={() => router.push('/routines')}
            >
              <Ionicons name="list" size={32} color="#fff" />
              <Text style={styles.actionText}>{t('home.myRoutines')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.recentWorkouts')}</Text>
          {recentWorkouts.length === 0 ? (
            <View style={styles.emptyState} testID="empty-workouts">
              <Ionicons name="barbell-outline" size={48} color="#555" />
              <Text style={styles.emptyText}>{t('home.noWorkouts')}</Text>
              <Text style={styles.emptySubtext}>{t('home.startFirst')}</Text>
            </View>
          ) : (
            recentWorkouts.map((workout) => (
              <View key={workout.id} style={styles.workoutCard} testID={`workout-card-${workout.id}`}>
                <View style={styles.workoutHeader}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutDate}>
                    {format(new Date(workout.date), 'MMM d, yyyy')}
                  </Text>
                </View>
                <View style={styles.workoutDetails}>
                  <Text style={styles.workoutInfo}>
                    {workout.exercises.length} {t('home.exercises')} {'\u2022'}{' '}
                    {workout.exercises.reduce((a, e) => a + e.sets.length, 0)} {t('home.sets')}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: '#888',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
    fontSize: 14,
  },
  workoutCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  workoutDate: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  workoutDetails: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 8,
  },
  workoutInfo: {
    fontSize: 14,
    color: '#aaa',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
