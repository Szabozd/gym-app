import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Set {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
}

export interface Routine {
  id: string;
  name: string;
  exercises: { exerciseId: string; exerciseName: string }[];
}

interface GymStore {
  workouts: Workout[];
  routines: Routine[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  addRoutine: (routine: Routine) => void;
  updateRoutine: (id: string, routine: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  loadData: () => Promise<void>;
}

export const useGymStore = create<GymStore>()(
  persist(
    (set, get) => ({
      workouts: [],
      routines: [],

      addWorkout: (workout) =>
        set((state) => ({
          workouts: [...state.workouts, workout],
        })),

      updateWorkout: (id, updatedWorkout) =>
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, ...updatedWorkout } : w
          ),
        })),

      deleteWorkout: (id) =>
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== id),
        })),

      addRoutine: (routine) =>
        set((state) => ({
          routines: [...state.routines, routine],
        })),

      updateRoutine: (id, updatedRoutine) =>
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === id ? { ...r, ...updatedRoutine } : r
          ),
        })),

      deleteRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        })),

      loadData: async () => {
        // Data is automatically loaded by persist middleware
        // This function can be used to trigger a manual reload if needed
      },
    }),
    {
      name: 'gym-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
