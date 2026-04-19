import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'hu';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    'app.title': 'Gym Tracker',
    'welcome': 'Welcome back!',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'add': 'Add',
    'close': 'Close',
    'search': 'Search',
    'yes': 'Yes',
    'no': 'No',
    'ok': 'OK',
    'loading': 'Loading...',
    
    // Navigation
    'nav.home': 'Home',
    'nav.workout': 'Workout',
    'nav.history': 'History',
    'nav.routines': 'Routines',
    'nav.library': 'Library',
    'nav.progress': 'Progress',
    
    // History Screen
    'history.totalWorkouts': 'workouts total',
    'history.noWorkouts': 'No workout history',
    'history.noWorkoutsHint': 'Complete a workout to see it here',
    'history.deleteWorkout': 'Delete Workout',
    'history.deleteConfirm': 'Are you sure you want to delete this workout?',
    'history.viewHistory': 'Workout History',
    
    // Home Screen
    'home.quickActions': 'Quick Actions',
    'home.startWorkout': 'Start Workout',
    'home.myRoutines': 'My Routines',
    'home.recentWorkouts': 'Recent Workouts',
    'home.noWorkouts': 'No workouts yet',
    'home.startFirst': 'Start your first workout!',
    'home.today': 'Today',
    'home.thisWeek': 'This Week',
    'home.totalSets': 'Total Sets',
    'home.exercises': 'exercises',
    'home.sets': 'sets',
    
    // Workout Screen
    'workout.title': 'Start Workout',
    'workout.emptyWorkout': 'Empty Workout',
    'workout.fromRoutine': 'From Routine',
    'workout.startFromScratch': 'Start from scratch',
    'workout.useSavedTemplate': 'Use a saved template',
    'workout.addExercise': 'Add Exercise',
    'workout.addSet': 'Add Set',
    'workout.finishWorkout': 'Finish Workout',
    'workout.cancelWorkout': 'Cancel Workout',
    'workout.workoutName': 'Workout Name',
    'workout.set': 'SET',
    'workout.weight': 'WEIGHT',
    'workout.reps': 'REPS',
    'workout.removeExercise': 'Remove Exercise',
    'workout.removeExerciseConfirm': 'Are you sure you want to remove this exercise?',
    'workout.remove': 'Remove',
    'workout.keepGoing': 'Keep Going',
    'workout.discard': 'Discard',
    'workout.cancelConfirm': 'Are you sure you want to cancel this workout?',
    'workout.emptyWorkoutError': 'Add at least one exercise to save the workout.',
    'workout.noCompletedSets': 'Complete at least one set to save the workout.',
    'workout.workoutSaved': 'Workout Saved!',
    'workout.greatJob': 'Great job! Your workout has been saved.',
    'workout.selectRoutine': 'Select Routine',
    'workout.noRoutines': 'No routines yet',
    'workout.createInRoutinesTab': 'Create one in the Routines tab',
    
    // Routines Screen
    'routines.title': 'My Routines',
    'routines.noRoutines': 'No routines yet',
    'routines.createTemplates': 'Create workout templates to quickly start workouts',
    'routines.createRoutine': 'Create Routine',
    'routines.editRoutine': 'Edit Routine',
    'routines.routineName': 'Routine Name',
    'routines.routineNamePlaceholder': 'e.g., Push Day, Leg Day',
    'routines.exercises': 'Exercises',
    'routines.deleteRoutine': 'Delete Routine',
    'routines.deleteConfirm': 'Are you sure you want to delete this routine?',
    'routines.enterName': 'Please enter a routine name',
    'routines.addExercise': 'Please add at least one exercise',
    
    // Library Screen
    'library.title': 'Exercise Library',
    'library.exercises': 'exercises',
    'library.calisthenics': 'calisthenics',
    'library.gym': 'gym',
    'library.searchExercises': 'Search exercises...',
    'library.allExercises': 'All Exercises',
    'library.calisthenicsOnly': 'Calisthenics',
    'library.gymOnly': 'Gym / Weights',
    'library.noExercises': 'No exercises found',
    'library.adjustFilters': 'Try adjusting your search or filters',
    'library.muscleGroup': 'Muscle Group',
    'library.equipment': 'Equipment',
    'library.description': 'Description',
    'library.instructions': 'Instructions',
    'library.tips': 'Tips',
    'library.all': 'All',
    
    // Progress Screen
    'progress.title': 'Progress',
    'progress.week': 'Week',
    'progress.month': 'Month',
    'progress.allTime': 'All Time',
    'progress.workouts': 'Workouts',
    'progress.sets': 'Sets',
    'progress.volume': 'Volume (kg)',
    'progress.thisWeekActivity': "This Week's Activity",
    'progress.noWorkoutsThisWeek': 'No workouts this week',
    'progress.volumeTrend': 'Volume Trend',
    'progress.topExercises': 'Top Exercises',
    'progress.completeWorkouts': 'Complete workouts to see your stats',
    'progress.maxWeight': 'Max',
    'progress.totalVolume': 'volume',
    
    // Muscle Groups
    'muscle.all': 'All',
    'muscle.chest': 'Chest',
    'muscle.back': 'Back',
    'muscle.shoulders': 'Shoulders',
    'muscle.biceps': 'Biceps',
    'muscle.triceps': 'Triceps',
    'muscle.legs': 'Legs',
    'muscle.core': 'Core',
    'muscle.fullBody': 'Full Body',
  },
  hu: {
    // General
    'app.title': 'Edzésnapló',
    'welcome': 'Üdv újra!',
    'save': 'Mentés',
    'cancel': 'Mégse',
    'delete': 'Törlés',
    'edit': 'Szerkesztés',
    'add': 'Hozzáadás',
    'close': 'Bezárás',
    'search': 'Keresés',
    'yes': 'Igen',
    'no': 'Nem',
    'ok': 'OK',
    'loading': 'Betöltés...',
    
    // Navigation
    'nav.home': 'Kezdőlap',
    'nav.workout': 'Edzés',
    'nav.history': 'Előzmény',
    'nav.routines': 'Tervek',
    'nav.library': 'Gyakorlatok',
    'nav.progress': 'Haladás',
    
    // History Screen
    'history.totalWorkouts': 'edzés összesen',
    'history.noWorkouts': 'Nincs edzéselőzmény',
    'history.noWorkoutsHint': 'Végezz egy edzést, hogy itt megjelenjen',
    'history.deleteWorkout': 'Edzés törlése',
    'history.deleteConfirm': 'Biztosan törölni akarod ezt az edzést?',
    'history.viewHistory': 'Edzéselőzmények',
    
    // Home Screen
    'home.quickActions': 'Gyors műveletek',
    'home.startWorkout': 'Edzés indítása',
    'home.myRoutines': 'Edzéstervek',
    'home.recentWorkouts': 'Legutóbbi edzések',
    'home.noWorkouts': 'Még nincs edzés',
    'home.startFirst': 'Kezdd el az első edzésed!',
    'home.today': 'Ma',
    'home.thisWeek': 'E héten',
    'home.totalSets': 'Összes szett',
    'home.exercises': 'gyakorlat',
    'home.sets': 'szett',
    
    // Workout Screen
    'workout.title': 'Edzés indítása',
    'workout.emptyWorkout': 'Üres edzés',
    'workout.fromRoutine': 'Edzéstervből',
    'workout.startFromScratch': 'Kezdés a semmiből',
    'workout.useSavedTemplate': 'Mentett sablon használata',
    'workout.addExercise': 'Gyakorlat hozzáadása',
    'workout.addSet': 'Szett hozzáadása',
    'workout.finishWorkout': 'Edzés befejezése',
    'workout.cancelWorkout': 'Edzés megszakítása',
    'workout.workoutName': 'Edzés neve',
    'workout.set': 'SZETT',
    'workout.weight': 'SÚLY',
    'workout.reps': 'ISM.',
    'workout.removeExercise': 'Gyakorlat eltávolítása',
    'workout.removeExerciseConfirm': 'Biztosan el akarod távolítani ezt a gyakorlatot?',
    'workout.remove': 'Eltávolítás',
    'workout.keepGoing': 'Folytatás',
    'workout.discard': 'Elvetés',
    'workout.cancelConfirm': 'Biztosan meg akarod szakítani az edzést?',
    'workout.emptyWorkoutError': 'Adj hozzá legalább egy gyakorlatot a mentéshez.',
    'workout.noCompletedSets': 'Teljesíts legalább egy szettet a mentéshez.',
    'workout.workoutSaved': 'Edzés mentve!',
    'workout.greatJob': 'Szép munka! Az edzésed el lett mentve.',
    'workout.selectRoutine': 'Edzésterv kiválasztása',
    'workout.noRoutines': 'Még nincs edzésterv',
    'workout.createInRoutinesTab': 'Hozz létre egyet a Tervek fülön',
    
    // Routines Screen
    'routines.title': 'Edzéstervek',
    'routines.noRoutines': 'Még nincs edzésterv',
    'routines.createTemplates': 'Hozz létre sablonokat a gyors edzésindításhoz',
    'routines.createRoutine': 'Edzésterv létrehozása',
    'routines.editRoutine': 'Edzésterv szerkesztése',
    'routines.routineName': 'Edzésterv neve',
    'routines.routineNamePlaceholder': 'pl. Tolóedzés, Lábnap',
    'routines.exercises': 'Gyakorlatok',
    'routines.deleteRoutine': 'Edzésterv törlése',
    'routines.deleteConfirm': 'Biztosan törölni akarod ezt az edzéstervet?',
    'routines.enterName': 'Kérlek add meg az edzésterv nevét',
    'routines.addExercise': 'Kérlek adj hozzá legalább egy gyakorlatot',
    
    // Library Screen
    'library.title': 'Gyakorlattár',
    'library.exercises': 'gyakorlat',
    'library.calisthenics': 'testedzés',
    'library.gym': 'kondi',
    'library.searchExercises': 'Gyakorlatok keresése...',
    'library.allExercises': 'Összes gyakorlat',
    'library.calisthenicsOnly': 'Testsúlyos',
    'library.gymOnly': 'Gépes / Súlyzós',
    'library.noExercises': 'Nincs találat',
    'library.adjustFilters': 'Próbáld módosítani a keresést vagy szűrőket',
    'library.muscleGroup': 'Izomcsoport',
    'library.equipment': 'Eszköz',
    'library.description': 'Leírás',
    'library.instructions': 'Végrehajtás',
    'library.tips': 'Tippek',
    'library.all': 'Mind',
    
    // Progress Screen
    'progress.title': 'Haladás',
    'progress.week': 'Hét',
    'progress.month': 'Hónap',
    'progress.allTime': 'Összes',
    'progress.workouts': 'Edzések',
    'progress.sets': 'Szettek',
    'progress.volume': 'Térfogat (kg)',
    'progress.thisWeekActivity': 'E heti aktivitás',
    'progress.noWorkoutsThisWeek': 'Nincs edzés ezen a héten',
    'progress.volumeTrend': 'Térfogat alakulása',
    'progress.topExercises': 'Legjobb gyakorlatok',
    'progress.completeWorkouts': 'Végezz edzéseket a statisztikákhoz',
    'progress.maxWeight': 'Max',
    'progress.totalVolume': 'térfogat',
    
    // Muscle Groups
    'muscle.all': 'Mind',
    'muscle.chest': 'Mell',
    'muscle.back': 'Hát',
    'muscle.shoulders': 'Váll',
    'muscle.biceps': 'Bicepsz',
    'muscle.triceps': 'Tricepsz',
    'muscle.legs': 'Láb',
    'muscle.core': 'Törzs',
    'muscle.fullBody': 'Teljes test',
  },
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: string) => {
        const { language } = get();
        return translations[language][key] || translations['en'][key] || key;
      },
    }),
    {
      name: 'gym-tracker-language',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper hook that ensures re-render on language change
export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };
  return { t, language, setLanguage };
}
