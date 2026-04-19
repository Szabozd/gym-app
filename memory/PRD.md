# Gym Tracker App - PRD

## Overview
A mobile gym tracking application built with Expo (React Native) for tracking workouts, sets, routines, and progress.

## Features
1. **Home Dashboard** - Stats overview, quick actions, recent workouts, language toggle (EN/HU)
2. **Workout Tracking** - Start empty or from routine, add exercises, track sets with weight/reps, complete/save workouts
3. **Routines** - Create/edit/delete workout templates with exercises
4. **Exercise Library** - 93+ exercises, filter by type (Calisthenics/Gym), muscle group, search
5. **Progress Charts** - Weekly activity bar chart, volume trend, top exercises, period selector
6. **Hungarian Language Support** - Full EN/HU translation with persistent toggle
7. **Persistent Storage** - All data saved locally using Zustand + AsyncStorage

## Tech Stack
- Frontend: Expo (React Native) with TypeScript
- State: Zustand with AsyncStorage persistence
- Charts: react-native-gifted-charts
- Navigation: expo-router with bottom tabs
- Storage: Local only (no authentication)

## Data Models
- **Workout**: id, name, date, exercises[]
- **WorkoutExercise**: exerciseId, exerciseName, sets[]
- **Set**: id, weight, reps, completed
- **Routine**: id, name, exercises[]
- **Exercise**: id, name, muscleGroup, equipment, description, instructions[], tips[], type (calisthenics/gym)
