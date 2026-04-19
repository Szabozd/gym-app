import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGymStore, WorkoutExercise, Set } from '../store/gymStore';
import { useTranslation } from '../store/languageStore';
import { exerciseLibrary } from '../data/exercises';

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { addWorkout, routines } = useGymStore();
  const { t } = useTranslation();
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'calisthenics' | 'gym'>('all');

  const startEmptyWorkout = () => {
    setWorkoutName('Workout ' + new Date().toLocaleDateString());
    setExercises([]);
    setIsWorkoutActive(true);
  };

  const startFromRoutine = (routine: typeof routines[0]) => {
    setWorkoutName(routine.name);
    const routineExercises: WorkoutExercise[] = routine.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      sets: [],
    }));
    setExercises(routineExercises);
    setIsWorkoutActive(true);
    setShowRoutineModal(false);
  };

  const addExercise = (exercise: typeof exerciseLibrary[0]) => {
    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [],
    };
    setExercises([...exercises, newExercise]);
    setShowExerciseModal(false);
    setSearchQuery('');
    setTypeFilter('all');
  };

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    const lastSet = updatedExercises[exerciseIndex].sets.slice(-1)[0];
    const newSet: Set = {
      id: Date.now().toString(),
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 10,
      completed: false,
    };
    updatedExercises[exerciseIndex].sets.push(newSet);
    setExercises(updatedExercises);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const updatedExercises = [...exercises];
    const numValue = parseFloat(value) || 0;
    updatedExercises[exerciseIndex].sets[setIndex][field] = numValue;
    setExercises(updatedExercises);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex].completed =
      !updatedExercises[exerciseIndex].sets[setIndex].completed;
    setExercises(updatedExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(updatedExercises);
  };

  const removeExercise = (exerciseIndex: number) => {
    Alert.alert(t('workout.removeExercise'), t('workout.removeExerciseConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('workout.remove'),
        style: 'destructive',
        onPress: () => {
          const updatedExercises = [...exercises];
          updatedExercises.splice(exerciseIndex, 1);
          setExercises(updatedExercises);
        },
      },
    ]);
  };

  const finishWorkout = () => {
    if (exercises.length === 0) {
      Alert.alert(t('workout.emptyWorkout'), t('workout.emptyWorkoutError'));
      return;
    }
    const completedSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0
    );
    if (completedSets === 0) {
      Alert.alert(t('workout.noCompletedSets'), t('workout.noCompletedSets'));
      return;
    }
    addWorkout({
      id: Date.now().toString(),
      name: workoutName,
      date: new Date().toISOString(),
      exercises: exercises.filter((ex) => ex.sets.some((s) => s.completed)),
    });
    Alert.alert(t('workout.workoutSaved'), t('workout.greatJob'));
    setIsWorkoutActive(false);
    setExercises([]);
    setWorkoutName('');
  };

  const cancelWorkout = () => {
    Alert.alert(t('workout.cancelWorkout'), t('workout.cancelConfirm'), [
      { text: t('workout.keepGoing'), style: 'cancel' },
      {
        text: t('workout.discard'),
        style: 'destructive',
        onPress: () => {
          setIsWorkoutActive(false);
          setExercises([]);
          setWorkoutName('');
        },
      },
    ]);
  };

  const filteredExercises = exerciseLibrary.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || ex.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (!isWorkoutActive) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('workout.title')}</Text>
        </View>
        <View style={styles.startContainer}>
          <TouchableOpacity testID="empty-workout-btn" style={styles.startButton} onPress={startEmptyWorkout}>
            <Ionicons name="add-circle" size={48} color="#fff" />
            <Text style={styles.startButtonText}>{t('workout.emptyWorkout')}</Text>
            <Text style={styles.startButtonSubtext}>{t('workout.startFromScratch')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="from-routine-btn"
            style={[styles.startButton, { backgroundColor: '#2196F3' }]}
            onPress={() => setShowRoutineModal(true)}
          >
            <Ionicons name="list" size={48} color="#fff" />
            <Text style={styles.startButtonText}>{t('workout.fromRoutine')}</Text>
            <Text style={styles.startButtonSubtext}>{t('workout.useSavedTemplate')}</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showRoutineModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('workout.selectRoutine')}</Text>
                <TouchableOpacity testID="close-routine-modal" onPress={() => setShowRoutineModal(false)}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {routines.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="folder-open-outline" size={48} color="#555" />
                    <Text style={styles.emptyText}>{t('workout.noRoutines')}</Text>
                    <Text style={styles.emptySubtext}>{t('workout.createInRoutinesTab')}</Text>
                  </View>
                ) : (
                  routines.map((routine) => (
                    <TouchableOpacity
                      key={routine.id}
                      style={styles.routineItem}
                      onPress={() => startFromRoutine(routine)}
                    >
                      <Text style={styles.routineName}>{routine.name}</Text>
                      <Text style={styles.routineInfo}>
                        {routine.exercises.length} {t('home.exercises')}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.activeHeader}>
          <TouchableOpacity testID="cancel-workout-btn" onPress={cancelWorkout}>
            <Ionicons name="close" size={28} color="#FF5252" />
          </TouchableOpacity>
          <TextInput
            testID="workout-name-input"
            style={styles.workoutNameInput}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder={t('workout.workoutName')}
            placeholderTextColor="#666"
          />
          <TouchableOpacity testID="finish-workout-btn" onPress={finishWorkout}>
            <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.exerciseList}>
          {exercises.map((exercise, exerciseIndex) => (
            <View key={`${exercise.exerciseId}-${exerciseIndex}`} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                <TouchableOpacity testID={`remove-exercise-${exerciseIndex}`} onPress={() => removeExercise(exerciseIndex)}>
                  <Ionicons name="trash-outline" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
              <View style={styles.setHeader}>
                <Text style={styles.setHeaderText}>{t('workout.set')}</Text>
                <Text style={styles.setHeaderText}>{t('workout.weight')}</Text>
                <Text style={styles.setHeaderText}>{t('workout.reps')}</Text>
                <Text style={styles.setHeaderText}></Text>
              </View>
              {exercise.sets.map((set, setIndex) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setNumber}>{setIndex + 1}</Text>
                  <TextInput
                    testID={`weight-input-${exerciseIndex}-${setIndex}`}
                    style={styles.setInput}
                    value={set.weight.toString()}
                    onChangeText={(v) => updateSet(exerciseIndex, setIndex, 'weight', v)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#555"
                  />
                  <TextInput
                    testID={`reps-input-${exerciseIndex}-${setIndex}`}
                    style={styles.setInput}
                    value={set.reps.toString()}
                    onChangeText={(v) => updateSet(exerciseIndex, setIndex, 'reps', v)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#555"
                  />
                  <View style={styles.setActions}>
                    <TouchableOpacity
                      testID={`complete-set-${exerciseIndex}-${setIndex}`}
                      style={[styles.checkButton, set.completed && styles.checkButtonCompleted]}
                      onPress={() => toggleSetComplete(exerciseIndex, setIndex)}
                    >
                      <Ionicons name="checkmark" size={18} color={set.completed ? '#fff' : '#555'} />
                    </TouchableOpacity>
                    <TouchableOpacity testID={`remove-set-${exerciseIndex}-${setIndex}`} onPress={() => removeSet(exerciseIndex, setIndex)}>
                      <Ionicons name="close" size={20} color="#888" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity
                testID={`add-set-${exerciseIndex}`}
                style={styles.addSetButton}
                onPress={() => addSet(exerciseIndex)}
              >
                <Ionicons name="add" size={20} color="#4CAF50" />
                <Text style={styles.addSetText}>{t('workout.addSet')}</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            testID="add-exercise-btn"
            style={styles.addExerciseButton}
            onPress={() => setShowExerciseModal(true)}
          >
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
            <Text style={styles.addExerciseText}>{t('workout.addExercise')}</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Exercise Selection Modal */}
        <Modal visible={showExerciseModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('workout.addExercise')}</Text>
                <TouchableOpacity testID="close-exercise-modal" onPress={() => {
                  setShowExerciseModal(false);
                  setSearchQuery('');
                  setTypeFilter('all');
                }}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              {/* Type filter row */}
              <View style={styles.typeFilterRow}>
                {[
                  { key: 'all', label: t('library.allExercises'), icon: 'apps' },
                  { key: 'calisthenics', label: t('library.calisthenicsOnly'), icon: 'body' },
                  { key: 'gym', label: t('library.gymOnly'), icon: 'barbell' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    testID={`type-filter-${item.key}`}
                    style={[styles.typeFilterBtn, typeFilter === item.key && styles.typeFilterBtnActive]}
                    onPress={() => setTypeFilter(item.key as any)}
                  >
                    <Ionicons name={item.icon as any} size={14} color={typeFilter === item.key ? '#fff' : '#888'} />
                    <Text style={[styles.typeFilterText, typeFilter === item.key && styles.typeFilterTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                testID="search-exercise-input"
                style={styles.searchInput}
                placeholder={t('library.searchExercises')}
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <ScrollView style={styles.modalScroll}>
                {filteredExercises.map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    testID={`select-exercise-${exercise.id}`}
                    style={styles.exerciseItem}
                    onPress={() => addExercise(exercise)}
                  >
                    <View style={styles.exerciseItemRow}>
                      <Text style={styles.exerciseItemName}>{exercise.name}</Text>
                      <View style={[
                        styles.typeBadge,
                        exercise.type === 'calisthenics' ? styles.typeBadgeCal : styles.typeBadgeGym
                      ]}>
                        <Text style={styles.typeBadgeText}>
                          {exercise.type === 'calisthenics' ? 'BW' : 'GYM'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.exerciseItemMuscle}>{exercise.muscleGroup} · {exercise.equipment}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 20, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  startContainer: { flex: 1, padding: 20, gap: 16 },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  startButtonText: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  startButtonSubtext: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  workoutNameInput: { flex: 1, fontSize: 18, fontWeight: '600', color: '#fff', marginHorizontal: 12 },
  exerciseList: { flex: 1, padding: 16 },
  exerciseCard: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 16, marginBottom: 16 },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: { fontSize: 18, fontWeight: '600', color: '#fff' },
  setHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  setHeaderText: { flex: 1, fontSize: 12, color: '#888', textAlign: 'center' },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  setNumber: { flex: 1, fontSize: 16, color: '#888', textAlign: 'center' },
  setInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4,
  },
  setActions: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonCompleted: { backgroundColor: '#4CAF50' },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    gap: 8,
  },
  addSetText: { color: '#4CAF50', fontWeight: '600' },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    gap: 8,
  },
  addExerciseText: { color: '#4CAF50', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  modalScroll: { padding: 16 },
  typeFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 6,
  },
  typeFilterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 4,
  },
  typeFilterBtnActive: { backgroundColor: '#4CAF50' },
  typeFilterText: { color: '#888', fontSize: 11, fontWeight: '600' },
  typeFilterTextActive: { color: '#fff' },
  searchInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 14,
    margin: 12,
    fontSize: 16,
    color: '#fff',
  },
  exerciseItem: { backgroundColor: '#2a2a2a', borderRadius: 12, padding: 16, marginBottom: 10 },
  exerciseItemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exerciseItemName: { fontSize: 16, fontWeight: '600', color: '#fff', flex: 1 },
  exerciseItemMuscle: { fontSize: 13, color: '#888', marginTop: 4 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeBadgeCal: { backgroundColor: '#9C27B0' },
  typeBadgeGym: { backgroundColor: '#FF5722' },
  typeBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  routineItem: { backgroundColor: '#2a2a2a', borderRadius: 12, padding: 16, marginBottom: 10 },
  routineName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  routineInfo: { fontSize: 14, color: '#888', marginTop: 4 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#888', marginTop: 12 },
  emptySubtext: { fontSize: 14, color: '#555', marginTop: 4 },
});
