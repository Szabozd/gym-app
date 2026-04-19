import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../store/languageStore';
import { exerciseLibrary } from '../data/exercises';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedType, setSelectedType] = useState<'all' | 'calisthenics' | 'gym'>('all');
  const [selectedExercise, setSelectedExercise] = useState<typeof exerciseLibrary[0] | null>(null);

  const muscleGroups = [
    { key: 'All', label: t('library.all') },
    { key: 'Chest', label: t('muscle.chest') },
    { key: 'Back', label: t('muscle.back') },
    { key: 'Shoulders', label: t('muscle.shoulders') },
    { key: 'Biceps', label: t('muscle.biceps') },
    { key: 'Triceps', label: t('muscle.triceps') },
    { key: 'Legs', label: t('muscle.legs') },
    { key: 'Core', label: t('muscle.core') },
    { key: 'Full Body', label: t('muscle.fullBody') },
  ];

  const exerciseTypes = [
    { key: 'all', label: t('library.allExercises'), icon: 'apps' },
    { key: 'calisthenics', label: t('library.calisthenicsOnly'), icon: 'body' },
    { key: 'gym', label: t('library.gymOnly'), icon: 'barbell' },
  ];

  const filteredExercises = exerciseLibrary.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    const matchesType = selectedType === 'all' || ex.type === selectedType;
    return matchesSearch && matchesMuscle && matchesType;
  });

  const groupedExercises = filteredExercises.reduce((acc, exercise) => {
    const group = exercise.muscleGroup;
    if (!acc[group]) acc[group] = [];
    acc[group].push(exercise);
    return acc;
  }, {} as Record<string, typeof exerciseLibrary>);

  const calisthenicsCount = exerciseLibrary.filter(ex => ex.type === 'calisthenics').length;
  const gymCount = exerciseLibrary.filter(ex => ex.type === 'gym').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('library.title')}</Text>
        <Text style={styles.subtitle}>
          {filteredExercises.length} {t('library.exercises')} ({calisthenicsCount} {t('library.calisthenics')}, {gymCount} {t('library.gym')})
        </Text>
      </View>

      {/* Type Toggle */}
      <View style={styles.typeToggleContainer}>
        {exerciseTypes.map((type) => (
          <TouchableOpacity
            key={type.key}
            testID={`library-type-${type.key}`}
            style={[styles.typeToggle, selectedType === type.key && styles.typeToggleActive]}
            onPress={() => setSelectedType(type.key as any)}
          >
            <Ionicons name={type.icon as any} size={18} color={selectedType === type.key ? '#fff' : '#888'} />
            <Text style={[styles.typeToggleText, selectedType === type.key && styles.typeToggleTextActive]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          testID="library-search-input"
          style={styles.searchInput}
          placeholder={t('library.searchExercises')}
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity testID="clear-search-btn" onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Muscle Group Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {muscleGroups.map((muscle) => (
          <TouchableOpacity
            key={muscle.key}
            testID={`muscle-filter-${muscle.key}`}
            style={[styles.filterChip, selectedMuscle === muscle.key && styles.filterChipActive]}
            onPress={() => setSelectedMuscle(muscle.key)}
          >
            <Text style={[styles.filterChipText, selectedMuscle === muscle.key && styles.filterChipTextActive]}>
              {muscle.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercise List */}
      <ScrollView style={styles.content}>
        {selectedMuscle === 'All' ? (
          Object.entries(groupedExercises).map(([group, exercises]) => (
            <View key={group} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {muscleGroups.find(m => m.key === group)?.label || group}
              </Text>
              {exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  testID={`library-exercise-${exercise.id}`}
                  style={styles.exerciseCard}
                  onPress={() => setSelectedExercise(exercise)}
                >
                  <View style={styles.exerciseInfo}>
                    <View style={styles.exerciseNameRow}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <View style={[styles.typeBadge, exercise.type === 'calisthenics' ? styles.typeBadgeCal : styles.typeBadgeGym]}>
                        <Text style={styles.typeBadgeText}>{exercise.type === 'calisthenics' ? 'BW' : 'GYM'}</Text>
                      </View>
                    </View>
                    <Text style={styles.exerciseEquipment}>{exercise.equipment}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.section}>
            {filteredExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                testID={`library-exercise-${exercise.id}`}
                style={styles.exerciseCard}
                onPress={() => setSelectedExercise(exercise)}
              >
                <View style={styles.exerciseInfo}>
                  <View style={styles.exerciseNameRow}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <View style={[styles.typeBadge, exercise.type === 'calisthenics' ? styles.typeBadgeCal : styles.typeBadgeGym]}>
                      <Text style={styles.typeBadgeText}>{exercise.type === 'calisthenics' ? 'BW' : 'GYM'}</Text>
                    </View>
                  </View>
                  <Text style={styles.exerciseEquipment}>{exercise.equipment}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#555" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#555" />
            <Text style={styles.emptyText}>{t('library.noExercises')}</Text>
            <Text style={styles.emptySubtext}>{t('library.adjustFilters')}</Text>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={selectedExercise !== null} animationType="slide" transparent onRequestClose={() => setSelectedExercise(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
                <View style={[styles.typeBadgeLarge, selectedExercise?.type === 'calisthenics' ? styles.typeBadgeCal : styles.typeBadgeGym]}>
                  <Ionicons name={selectedExercise?.type === 'calisthenics' ? 'body' : 'barbell'} size={14} color="#fff" />
                  <Text style={styles.typeBadgeLargeText}>
                    {selectedExercise?.type === 'calisthenics' ? t('library.calisthenicsOnly') : t('library.gymOnly')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity testID="close-exercise-detail" onPress={() => setSelectedExercise(null)}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.detailSection}>
                <View style={styles.detailRow}>
                  <Ionicons name="body" size={20} color="#4CAF50" />
                  <Text style={styles.detailLabel}>{t('library.muscleGroup')}</Text>
                  <Text style={styles.detailValue}>{selectedExercise?.muscleGroup}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="barbell" size={20} color="#2196F3" />
                  <Text style={styles.detailLabel}>{t('library.equipment')}</Text>
                  <Text style={styles.detailValue}>{selectedExercise?.equipment}</Text>
                </View>
              </View>
              <View style={styles.descriptionSection}>
                <Text style={styles.descriptionTitle}>{t('library.description')}</Text>
                <Text style={styles.descriptionText}>{selectedExercise?.description}</Text>
              </View>
              <View style={styles.instructionsSection}>
                <Text style={styles.instructionsTitle}>{t('library.instructions')}</Text>
                {selectedExercise?.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.tipsSection}>
                <Text style={styles.tipsTitle}>{t('library.tips')}</Text>
                {selectedExercise?.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <Ionicons name="bulb" size={16} color="#FF9800" />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
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
  typeToggleContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  typeToggle: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1e1e1e', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 8, gap: 6,
  },
  typeToggleActive: { backgroundColor: '#4CAF50' },
  typeToggleText: { color: '#888', fontSize: 12, fontWeight: '600' },
  typeToggleTextActive: { color: '#fff' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e',
    borderRadius: 12, marginHorizontal: 20, paddingHorizontal: 12, marginBottom: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#fff' },
  filterContainer: { maxHeight: 50, marginBottom: 8 },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  filterChip: { backgroundColor: '#1e1e1e', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, marginRight: 8 },
  filterChipActive: { backgroundColor: '#4CAF50' },
  filterChipText: { color: '#888', fontSize: 14, fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },
  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#4CAF50', marginBottom: 12, marginTop: 8 },
  exerciseCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1e1e1e', borderRadius: 12, padding: 16, marginBottom: 8,
  },
  exerciseInfo: { flex: 1 },
  exerciseNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  exerciseName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeBadgeCal: { backgroundColor: '#9C27B0' },
  typeBadgeGym: { backgroundColor: '#FF5722' },
  typeBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  typeBadgeLarge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 8, gap: 4, marginTop: 4,
  },
  typeBadgeLargeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  exerciseEquipment: { fontSize: 13, color: '#888' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 18, color: '#888', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#555', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: 20, borderBottomWidth: 1, borderBottomColor: '#333',
  },
  modalTitleContainer: { flex: 1, marginRight: 16 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  modalScroll: { padding: 20 },
  detailSection: { backgroundColor: '#2a2a2a', borderRadius: 12, padding: 16, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  detailLabel: { flex: 1, fontSize: 14, color: '#888', marginLeft: 12 },
  detailValue: { fontSize: 14, color: '#fff', fontWeight: '500' },
  descriptionSection: { marginBottom: 20 },
  descriptionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 8 },
  descriptionText: { fontSize: 15, color: '#ccc', lineHeight: 22 },
  instructionsSection: { marginBottom: 20 },
  instructionsTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
  instructionItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  instructionNumber: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#4CAF50',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  instructionNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  instructionText: { flex: 1, fontSize: 14, color: '#ccc', lineHeight: 20 },
  tipsSection: { backgroundColor: '#2a2a2a', borderRadius: 12, padding: 16 },
  tipsTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  tipText: { flex: 1, fontSize: 14, color: '#ccc', marginLeft: 10, lineHeight: 20 },
});
