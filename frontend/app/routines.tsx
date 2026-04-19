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
import { useGymStore, Routine } from '../store/gymStore';
import { useLanguageStore } from '../store/languageStore';
import { exerciseLibrary } from '../data/exercises';

export default function RoutinesScreen() {
  const insets = useSafeAreaInsets();
  const { routines, addRoutine, updateRoutine, deleteRoutine } = useGymStore();
  const { t } = useLanguageStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [routineName, setRoutineName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<{ exerciseId: string; exerciseName: string }[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openCreateModal = () => {
    setRoutineName('');
    setSelectedExercises([]);
    setEditingRoutine(null);
    setShowCreateModal(true);
  };

  const openEditModal = (routine: Routine) => {
    setRoutineName(routine.name);
    setSelectedExercises(routine.exercises);
    setEditingRoutine(routine);
    setShowCreateModal(true);
  };

  const addExerciseToRoutine = (exercise: typeof exerciseLibrary[0]) => {
    if (!selectedExercises.find((e) => e.exerciseId === exercise.id)) {
      setSelectedExercises([
        ...selectedExercises,
        { exerciseId: exercise.id, exerciseName: exercise.name },
      ]);
    }
    setShowExerciseModal(false);
    setSearchQuery('');
  };

  const removeExerciseFromRoutine = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter((e) => e.exerciseId !== exerciseId));
  };

  const saveRoutine = () => {
    if (!routineName.trim()) {
      Alert.alert('', t('routines.enterName'));
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert('', t('routines.addExercise'));
      return;
    }
    if (editingRoutine) {
      updateRoutine(editingRoutine.id, { name: routineName, exercises: selectedExercises });
    } else {
      addRoutine({ id: Date.now().toString(), name: routineName, exercises: selectedExercises });
    }
    setShowCreateModal(false);
    setRoutineName('');
    setSelectedExercises([]);
    setEditingRoutine(null);
  };

  const handleDeleteRoutine = (routineId: string) => {
    Alert.alert(t('routines.deleteRoutine'), t('routines.deleteConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => deleteRoutine(routineId) },
    ]);
  };

  const filteredExercises = exerciseLibrary.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('routines.title')}</Text>
        <TouchableOpacity testID="create-routine-btn" style={styles.addButton} onPress={openCreateModal}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {routines.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="layers-outline" size={64} color="#555" />
            <Text style={styles.emptyText}>{t('routines.noRoutines')}</Text>
            <Text style={styles.emptySubtext}>{t('routines.createTemplates')}</Text>
            <TouchableOpacity testID="create-routine-empty-btn" style={styles.createButton} onPress={openCreateModal}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.createButtonText}>{t('routines.createRoutine')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          routines.map((routine) => (
            <View key={routine.id} style={styles.routineCard} testID={`routine-card-${routine.id}`}>
              <View style={styles.routineHeader}>
                <Text style={styles.routineName}>{routine.name}</Text>
                <View style={styles.routineActions}>
                  <TouchableOpacity testID={`edit-routine-${routine.id}`} style={styles.iconButton} onPress={() => openEditModal(routine)}>
                    <Ionicons name="pencil" size={18} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity testID={`delete-routine-${routine.id}`} style={styles.iconButton} onPress={() => handleDeleteRoutine(routine.id)}>
                    <Ionicons name="trash" size={18} color="#FF5252" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.exerciseList}>
                {routine.exercises.map((exercise, index) => (
                  <View key={`${exercise.exerciseId}-${index}`} style={styles.exerciseTag}>
                    <Text style={styles.exerciseTagText}>{exercise.exerciseName}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.routineInfo}>
                {routine.exercises.length} {t('home.exercises')}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity testID="close-create-modal" onPress={() => setShowCreateModal(false)}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {editingRoutine ? t('routines.editRoutine') : t('routines.createRoutine')}
                </Text>
                <TouchableOpacity testID="save-routine-btn" onPress={saveRoutine}>
                  <Text style={styles.saveText}>{t('save')}</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                <Text style={styles.inputLabel}>{t('routines.routineName')}</Text>
                <TextInput
                  testID="routine-name-input"
                  style={styles.textInput}
                  value={routineName}
                  onChangeText={setRoutineName}
                  placeholder={t('routines.routineNamePlaceholder')}
                  placeholderTextColor="#666"
                />
                <Text style={styles.inputLabel}>{t('routines.exercises')}</Text>
                {selectedExercises.map((exercise, index) => (
                  <View key={`${exercise.exerciseId}-${index}`} style={styles.selectedExercise}>
                    <Text style={styles.selectedExerciseName}>{exercise.exerciseName}</Text>
                    <TouchableOpacity onPress={() => removeExerciseFromRoutine(exercise.exerciseId)}>
                      <Ionicons name="close-circle" size={22} color="#FF5252" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  testID="add-exercise-to-routine"
                  style={styles.addExerciseButton}
                  onPress={() => setShowExerciseModal(true)}
                >
                  <Ionicons name="add-circle" size={24} color="#4CAF50" />
                  <Text style={styles.addExerciseText}>{t('workout.addExercise')}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Exercise Selection Modal */}
      <Modal visible={showExerciseModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('workout.addExercise')}</Text>
              <TouchableOpacity testID="close-exercise-picker" onPress={() => { setShowExerciseModal(false); setSearchQuery(''); }}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <TextInput
              testID="routine-exercise-search"
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
                  testID={`pick-exercise-${exercise.id}`}
                  style={styles.exerciseItem}
                  onPress={() => addExerciseToRoutine(exercise)}
                >
                  <Text style={styles.exerciseItemName}>{exercise.name}</Text>
                  <Text style={styles.exerciseItemMuscle}>{exercise.muscleGroup} · {exercise.equipment}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  addButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center',
  },
  content: { flex: 1, padding: 20 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 20, color: '#888', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#555', marginTop: 8, textAlign: 'center' },
  createButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CAF50',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, marginTop: 24, gap: 8,
  },
  createButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  routineCard: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 16, marginBottom: 12 },
  routineHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  routineName: { fontSize: 18, fontWeight: '600', color: '#fff' },
  routineActions: { flexDirection: 'row', gap: 8 },
  iconButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center',
  },
  exerciseList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  exerciseTag: { backgroundColor: '#2a2a2a', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  exerciseTagText: { color: '#ccc', fontSize: 13 },
  routineInfo: { fontSize: 13, color: '#888' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#333',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  saveText: { color: '#4CAF50', fontSize: 16, fontWeight: '600' },
  modalScroll: { padding: 16 },
  inputLabel: { fontSize: 14, color: '#888', marginBottom: 8, marginTop: 16 },
  textInput: { backgroundColor: '#2a2a2a', borderRadius: 12, padding: 14, fontSize: 16, color: '#fff' },
  selectedExercise: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#2a2a2a', borderRadius: 12, padding: 14, marginTop: 8,
  },
  selectedExerciseName: { color: '#fff', fontSize: 16 },
  addExerciseButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2a2a2a', borderRadius: 12, padding: 16, marginTop: 16, marginBottom: 40, gap: 8,
  },
  addExerciseText: { color: '#4CAF50', fontSize: 16, fontWeight: '600' },
  searchInput: {
    backgroundColor: '#2a2a2a', borderRadius: 12, padding: 14,
    margin: 16, marginTop: 8, fontSize: 16, color: '#fff',
  },
  exerciseItem: { backgroundColor: '#2a2a2a', borderRadius: 12, padding: 16, marginBottom: 10 },
  exerciseItemName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  exerciseItemMuscle: { fontSize: 14, color: '#888', marginTop: 4 },
});
