import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGymStore } from '../store/gymStore';
import { useTranslation } from '../store/languageStore';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const screenWidth = Dimensions.get('window').width;
const dayLabelsEN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayLabelsHU = ['Hé', 'Ke', 'Sze', 'Csü', 'Pé', 'Szo', 'Vas'];

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { workouts } = useGymStore();
  const { t, language } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const dayLabels = language === 'hu' ? dayLabelsHU : dayLabelsEN;

  const stats = useMemo(() => {
    const now = new Date();
    let filteredWorkouts = workouts;
    if (selectedPeriod === 'week') {
      filteredWorkouts = workouts.filter((w) => new Date(w.date) >= subDays(now, 7));
    } else if (selectedPeriod === 'month') {
      filteredWorkouts = workouts.filter((w) => new Date(w.date) >= subDays(now, 30));
    }
    const totalWorkouts = filteredWorkouts.length;
    const totalSets = filteredWorkouts.reduce(
      (acc, w) => acc + w.exercises.reduce((a, e) => a + e.sets.filter((s) => s.completed).length, 0),
      0
    );
    const totalVolume = filteredWorkouts.reduce(
      (acc, w) =>
        acc + w.exercises.reduce(
          (a, e) => a + e.sets.filter((s) => s.completed).reduce((sum, s) => sum + s.weight * s.reps, 0),
          0
        ),
      0
    );
    return { totalWorkouts, totalSets, totalVolume };
  }, [workouts, selectedPeriod]);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    return days.map((day, idx) => {
      const dayWorkouts = workouts.filter((w) => {
        const d = new Date(w.date);
        return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getFullYear() === day.getFullYear();
      });
      const sets = dayWorkouts.reduce(
        (acc, w) => acc + w.exercises.reduce((a, e) => a + e.sets.filter((s) => s.completed).length, 0),
        0
      );
      return { value: sets, label: dayLabels[idx], frontColor: sets > 0 ? '#4CAF50' : '#333' };
    });
  }, [workouts, dayLabels]);

  const volumeData = useMemo(() => {
    const sorted = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-10);
    if (sorted.length === 0) return [];
    return sorted.map((w) => {
      const vol = w.exercises.reduce(
        (a, e) => a + e.sets.filter((s) => s.completed).reduce((sum, s) => sum + s.weight * s.reps, 0),
        0
      );
      return { value: vol, label: format(new Date(w.date), 'M/d'), dataPointText: vol > 0 ? `${Math.round(vol / 1000)}k` : '' };
    });
  }, [workouts]);

  const exerciseStats = useMemo(() => {
    const counts: Record<string, { count: number; totalVolume: number; maxWeight: number }> = {};
    workouts.forEach((w) => {
      w.exercises.forEach((e) => {
        if (!counts[e.exerciseName]) counts[e.exerciseName] = { count: 0, totalVolume: 0, maxWeight: 0 };
        const completed = e.sets.filter((s) => s.completed);
        counts[e.exerciseName].count += completed.length;
        completed.forEach((s) => {
          counts[e.exerciseName].totalVolume += s.weight * s.reps;
          if (s.weight > counts[e.exerciseName].maxWeight) counts[e.exerciseName].maxWeight = s.weight;
        });
      });
    });
    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [workouts]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('progress.title')}</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'all'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              testID={`period-${period}`}
              style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[styles.periodButtonText, selectedPeriod === period && styles.periodButtonTextActive]}>
                {period === 'week' ? t('progress.week') : period === 'month' ? t('progress.month') : t('progress.allTime')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard} testID="progress-stat-workouts">
            <Ionicons name="fitness" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>{t('progress.workouts')}</Text>
          </View>
          <View style={styles.statCard} testID="progress-stat-sets">
            <Ionicons name="layers" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>{stats.totalSets}</Text>
            <Text style={styles.statLabel}>{t('progress.sets')}</Text>
          </View>
          <View style={styles.statCard} testID="progress-stat-volume">
            <Ionicons name="barbell" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>
              {stats.totalVolume >= 1000 ? `${(stats.totalVolume / 1000).toFixed(1)}k` : stats.totalVolume}
            </Text>
            <Text style={styles.statLabel}>{t('progress.volume')}</Text>
          </View>
        </View>

        {/* Weekly Activity Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>{t('progress.thisWeekActivity')}</Text>
          <View style={styles.chartContainer}>
            {weeklyData.some((d) => d.value > 0) ? (
              <BarChart
                data={weeklyData}
                barWidth={30}
                barBorderRadius={4}
                frontColor="#4CAF50"
                yAxisColor="#333"
                xAxisColor="#333"
                yAxisTextStyle={{ color: '#888' }}
                xAxisLabelTextStyle={{ color: '#888', fontSize: 12 }}
                noOfSections={4}
                maxValue={Math.max(...weeklyData.map((d) => d.value), 10)}
                width={screenWidth - 80}
                height={150}
                hideRules
                spacing={20}
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="bar-chart-outline" size={40} color="#555" />
                <Text style={styles.emptyChartText}>{t('progress.noWorkoutsThisWeek')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Volume Trend */}
        {volumeData.length > 1 && (
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>{t('progress.volumeTrend')}</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={volumeData}
                color="#4CAF50"
                thickness={2}
                dataPointsColor="#4CAF50"
                dataPointsRadius={4}
                yAxisColor="#333"
                xAxisColor="#333"
                yAxisTextStyle={{ color: '#888' }}
                xAxisLabelTextStyle={{ color: '#888', fontSize: 10 }}
                noOfSections={4}
                width={screenWidth - 80}
                height={150}
                hideRules
                spacing={40}
                adjustToWidth
                curved
              />
            </View>
          </View>
        )}

        {/* Top Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('progress.topExercises')}</Text>
          {exerciseStats.length === 0 ? (
            <View style={styles.emptyState} testID="empty-progress">
              <Ionicons name="trophy-outline" size={40} color="#555" />
              <Text style={styles.emptyStateText}>{t('progress.completeWorkouts')}</Text>
            </View>
          ) : (
            exerciseStats.map((exercise, index) => (
              <View key={exercise.name} style={styles.exerciseStatCard} testID={`top-exercise-${index}`}>
                <View style={styles.exerciseRank}>
                  <Text style={styles.exerciseRankText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseStatInfo}>
                  <Text style={styles.exerciseStatName}>{exercise.name}</Text>
                  <Text style={styles.exerciseStatDetails}>
                    {exercise.count} {t('progress.sets')} {'\u2022'} {t('progress.maxWeight')}: {exercise.maxWeight}kg {'\u2022'}{' '}
                    {exercise.totalVolume >= 1000
                      ? `${(exercise.totalVolume / 1000).toFixed(1)}k`
                      : exercise.totalVolume}
                    kg {t('progress.totalVolume')}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollView: { flex: 1 },
  header: { padding: 20, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  periodSelector: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  periodButton: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#1e1e1e', alignItems: 'center' },
  periodButtonActive: { backgroundColor: '#4CAF50' },
  periodButtonText: { color: '#888', fontWeight: '600' },
  periodButtonTextActive: { color: '#fff' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#1e1e1e', borderRadius: 12, padding: 16, marginHorizontal: 5, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  statLabel: { fontSize: 11, color: '#888', marginTop: 4, textAlign: 'center' },
  chartSection: { paddingHorizontal: 20, marginBottom: 24 },
  chartTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 16 },
  chartContainer: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 16, alignItems: 'center' },
  emptyChart: { alignItems: 'center', padding: 30 },
  emptyChartText: { color: '#888', marginTop: 12 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 12 },
  emptyState: { alignItems: 'center', padding: 30, backgroundColor: '#1e1e1e', borderRadius: 12 },
  emptyStateText: { color: '#888', marginTop: 12, textAlign: 'center' },
  exerciseStatCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e',
    borderRadius: 12, padding: 16, marginBottom: 8,
  },
  exerciseRank: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#4CAF50',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  exerciseRankText: { color: '#fff', fontWeight: 'bold' },
  exerciseStatInfo: { flex: 1 },
  exerciseStatName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  exerciseStatDetails: { fontSize: 13, color: '#888', marginTop: 4 },
});
