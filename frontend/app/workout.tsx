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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGymStore, WorkoutExercise, Set } from '../store/gymStore';
import { exerciseLibrary } from '../data/exercises';

export default function WorkoutScreen() {
  const { addWorkout, routines } = useGymStore();
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    Alert.alert('Remove Exercise', 'Are you sure you want to remove this exercise?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
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
      Alert.alert('Empty Workout', 'Add at least one exercise to save the workout.');
      return;
    }

    const completedSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0
    );

    if (completedSets === 0) {
      Alert.alert('No Completed Sets', 'Complete at least one set to save the workout.');
      return;
    }

    addWorkout({
      id: Date.now().toString(),
      name: workoutName,
      date: new Date().toISOString(),
      exercises: exercises.filter((ex) => ex.sets.some((s) => s.completed)),
    });

    Alert.alert('Workout Saved!', 'Great job! Your workout has been saved.');
    setIsWorkoutActive(false);
    setExercises([]);
    setWorkoutName('');
  };

  const cancelWorkout = () => {
    Alert.alert('Cancel Workout', 'Are you sure you want to cancel this workout?', [
      { text: 'Keep Going', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          setIsWorkoutActive(false);
          setExercises([]);
          setWorkoutName('');
        },
      },
    ]);
  };

  const filteredExercises = exerciseLibrary.filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isWorkoutActive) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Start Workout</Text>
        </View>
        <View style={styles.startContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startEmptyWorkout}>
            <Ionicons name="add-circle" size={48} color="#fff" />
            <Text style={styles.startButtonText}>Empty Workout</Text>
            <Text style={styles.startButtonSubtext}>Start from scratch</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: '#2196F3' }]}
            onPress={() => setShowRoutineModal(true)}
          >
            <Ionicons name="list" size={48} color="#fff" />
            <Text style={styles.startButtonText}>From Routine</Text>
            <Text style={styles.startButtonSubtext}>Use a saved template</Text>
          </TouchableOpacity>
        </View>

        {/* Routine Selection Modal */}
        <Modal visible={showRoutineModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Routine</Text>
                <TouchableOpacity onPress={() => setShowRoutineModal(false)}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {routines.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="folder-open-outline" size={48} color="#555" />
                    <Text style={styles.emptyText}>No routines yet</Text>
                    <Text style={styles.emptySubtext}>Create one in the Routines tab</Text>
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
                        {routine.exercises.length} exercises
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.activeHeader}>
          <TouchableOpacity onPress={cancelWorkout}>
            <Ionicons name="close" size={28} color="#FF5252" />
          </TouchableOpacity>
          <TextInput
            style={styles.workoutNameInput}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="Workout Name"
            placeholderTextColor="#666"
          />
          <TouchableOpacity onPress={finishWorkout}>
            <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.exerciseList}>
          {exercises.map((exercise, exerciseIndex) => (
            <View key={`${exercise.exerciseId}-${exerciseIndex}`} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                <TouchableOpacity onPress={() => removeExercise(exerciseIndex)}>
                  <Ionicons name="trash-outline" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>

              <View style={styles.setHeader}>
                <Text style={styles.setHeaderText}>SET</Text>
                <Text style={styles.setHeaderText}>WEIGHT</Text>
                <Text style={styles.setHeaderText}>REPS</Text>
                <Text style={styles.setHeaderText}></Text>
              </View>

              {exercise.sets.map((set, setIndex) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setNumber}>{setIndex + 1}</Text>
                  <TextInput
                    style={styles.setInput}
                    value={set.weight.toString()}
                    onChangeText={(v) => updateSet(exerciseIndex, setIndex, 'weight', v)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#555"
                  />
                  <TextInput
                    style={styles.setInput}
                    value={set.reps.toString()}
                    onChangeText={(v) => updateSet(exerciseIndex, setIndex, 'reps', v)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#555"
                  />
                  <View style={styles.setActions}>
                    <TouchableOpacity
                      style={[
                        styles.checkButton,
                        set.completed && styles.checkButtonCompleted,
                      ]}
                      onPress={() => toggleSetComplete(exerciseIndex, setIndex)}
                    >
                      <Ionicons
                        name={set.completed ? 'checkmark' : 'checkmark'}
                        size={18}
                        color={set.completed ? '#fff' : '#555'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeSet(exerciseIndex, setIndex)}>
                      <Ionicons name="close" size={20} color="#888" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addSetButton}
                onPress={() => addSet(exerciseIndex)}
              >
                <Ionicons name="add" size={20} color="#4CAF50" />
                <Text style={styles.addSetText}>Add Set</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={() => setShowExerciseModal(true)}
          >
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Exercise Selection Modal */}
        <Modal visible={showExerciseModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Exercise</Text>
                <TouchableOpacity onPress={() => {
                  setShowExerciseModal(false);
                  setSearchQuery('');
                }}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search exercises..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <ScrollView style={styles.modalScroll}>
                {filteredExercises.map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseItem}
                    onPress={() => addExercise(exercise)}
                  >
                    <Text style={styles.exerciseItemName}>{exercise.name}</Text>
                    <Text style={styles.exerciseItemMuscle}>{exercise.muscleGroup}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  startContainer: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  startButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  workoutNameInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 12,
  },
  exerciseList: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  setHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  setHeaderText: {
    flex: 1,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  setNumber: {
    flex: 1,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
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
  setActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: '#4CAF50',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    gap: 8,
  },
  addSetText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
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
  addExerciseText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalScroll: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 14,
    margin: 16,
    marginTop: 8,
    fontSize: 16,
    color: '#fff',
  },
  exerciseItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  exerciseItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  exerciseItemMuscle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  routineItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  routineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  routineInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
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
