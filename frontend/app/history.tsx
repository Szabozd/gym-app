import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGymStore, Workout } from '../store/gymStore';
import { useTranslation } from '../store/languageStore';
import { format } from 'date-fns';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { workouts, deleteWorkout } = useGymStore();
  const { t } = useTranslation();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (workoutId: string) => {
    Alert.alert(
      t('history.deleteWorkout'),
      t('history.deleteConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            deleteWorkout(workoutId);
            if (selectedWorkout?.id === workoutId) {
              setSelectedWorkout(null);
            }
          },
        },
      ]
    );
  };

  const getTotalSets = (workout: Workout) =>
    workout.exercises.reduce((a, e) => a + e.sets.filter((s) => s.completed).length, 0);

  const getTotalVolume = (workout: Workout) =>
    workout.exercises.reduce(
      (a, e) =>
        a + e.sets.filter((s) => s.completed).reduce((sum, s) => sum + s.weight * s.reps, 0),
      0
    );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('nav.history')}</Text>
        <Text style={styles.subtitle}>
          {sortedWorkouts.length} {t('history.totalWorkouts')}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {sortedWorkouts.length === 0 ? (
          <View style={styles.emptyState} testID="empty-history">
            <Ionicons name="time-outline" size={64} color="#555" />
            <Text style={styles.emptyText}>{t('history.noWorkouts')}</Text>
            <Text style={styles.emptySubtext}>{t('history.noWorkoutsHint')}</Text>
          </View>
        ) : (
          sortedWorkouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              testID={`history-item-${workout.id}`}
              style={styles.workoutCard}
              onPress={() => setSelectedWorkout(workout)}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardDate}>
                  <Text style={styles.dateDay}>
                    {format(new Date(workout.date), 'd')}
                  </Text>
                  <Text style={styles.dateMonth}>
                    {format(new Date(workout.date), 'MMM')}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{workout.name}</Text>
                  <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="barbell-outline" size={14} color="#888" />
                      <Text style={styles.metaText}>
                        {workout.exercises.length} {t('home.exercises')}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="layers-outline" size={14} color="#888" />
                      <Text style={styles.metaText}>
                        {getTotalSets(workout)} {t('home.sets')}
                      </Text>
                    </View>
                    {getTotalVolume(workout) > 0 && (
                      <View style={styles.metaItem}>
                        <Ionicons name="trending-up-outline" size={14} color="#888" />
                        <Text style={styles.metaText}>
                          {getTotalVolume(workout) >= 1000
                            ? `${(getTotalVolume(workout) / 1000).toFixed(1)}k`
                            : getTotalVolume(workout)}
                          kg
                        </Text>
                      </View>
                    )}
                  </View>
                  {/* Exercise names preview */}
                  <Text style={styles.exercisePreview} numberOfLines={1}>
                    {workout.exercises.map((e) => e.exerciseName).join(', ')}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#555" />
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Workout Detail Modal */}
      <Modal
        visible={selectedWorkout !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedWorkout(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleArea}>
                <Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>
                {selectedWorkout && (
                  <Text style={styles.modalDate}>
                    {format(new Date(selectedWorkout.date), 'EEEE, MMMM d, yyyy')}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                testID="close-history-detail"
                onPress={() => setSelectedWorkout(null)}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Summary row */}
            {selectedWorkout && (
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>
                    {selectedWorkout.exercises.length}
                  </Text>
                  <Text style={styles.summaryLabel}>{t('home.exercises')}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>
                    {getTotalSets(selectedWorkout)}
                  </Text>
                  <Text style={styles.summaryLabel}>{t('home.sets')}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>
                    {getTotalVolume(selectedWorkout) >= 1000
                      ? `${(getTotalVolume(selectedWorkout) / 1000).toFixed(1)}k`
                      : getTotalVolume(selectedWorkout)}
                  </Text>
                  <Text style={styles.summaryLabel}>kg {t('progress.totalVolume')}</Text>
                </View>
              </View>
            )}

            <ScrollView style={styles.modalScroll}>
              {selectedWorkout?.exercises.map((exercise, exIdx) => (
                <View
                  key={`${exercise.exerciseId}-${exIdx}`}
                  style={styles.exerciseBlock}
                >
                  <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                  <View style={styles.setHeaderRow}>
                    <Text style={styles.setHeaderText}>{t('workout.set')}</Text>
                    <Text style={styles.setHeaderText}>{t('workout.weight')}</Text>
                    <Text style={styles.setHeaderText}>{t('workout.reps')}</Text>
                    <Text style={styles.setHeaderText}></Text>
                  </View>
                  {exercise.sets.map((set, setIdx) => (
                    <View key={set.id} style={styles.setRow}>
                      <Text style={styles.setNum}>{setIdx + 1}</Text>
                      <Text style={styles.setVal}>{set.weight} kg</Text>
                      <Text style={styles.setVal}>{set.reps}</Text>
                      <View style={styles.setStatus}>
                        <Ionicons
                          name={set.completed ? 'checkmark-circle' : 'close-circle'}
                          size={18}
                          color={set.completed ? '#4CAF50' : '#555'}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              ))}

              {/* Delete button */}
              {selectedWorkout && (
                <TouchableOpacity
                  testID="delete-workout-btn"
                  style={styles.deleteButton}
                  onPress={() => handleDelete(selectedWorkout.id)}
                >
                  <Ionicons name="trash" size={18} color="#FF5252" />
                  <Text style={styles.deleteText}>{t('history.deleteWorkout')}</Text>
                </TouchableOpacity>
              )}

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 20, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  content: { flex: 1, paddingHorizontal: 16 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 20, color: '#888', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#555', marginTop: 8, textAlign: 'center' },
  workoutCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dateDay: { fontSize: 18, fontWeight: 'bold', color: '#fff', lineHeight: 20 },
  dateMonth: { fontSize: 11, color: '#4CAF50', fontWeight: '600', textTransform: 'uppercase' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#888' },
  exercisePreview: { fontSize: 12, color: '#666', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitleArea: { flex: 1, marginRight: 16 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  modalDate: { fontSize: 13, color: '#888', marginTop: 4 },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNumber: { fontSize: 22, fontWeight: 'bold', color: '#4CAF50' },
  summaryLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: '#333' },
  modalScroll: { padding: 20 },
  exerciseBlock: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  exerciseName: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 10 },
  setHeaderRow: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  setHeaderText: { flex: 1, fontSize: 11, color: '#888', textAlign: 'center' },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  setNum: { flex: 1, fontSize: 14, color: '#888', textAlign: 'center' },
  setVal: { flex: 1, fontSize: 14, color: '#fff', textAlign: 'center' },
  setStatus: { flex: 1, alignItems: 'center' },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,82,82,0.1)',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,82,82,0.3)',
  },
  deleteText: { color: '#FF5252', fontSize: 15, fontWeight: '600' },
});
