# Gym Tracker App - PRD

## Overview
A mobile gym tracking application built with Expo (React Native) for tracking workouts, sets, routines, and progress.

## Features
1. **Home Dashboard** - Stats overview, quick actions, recent workouts, language toggle (EN/HU)
2. **Workout Tracking** - Start empty or from routine, add exercises, track sets with weight/reps, complete/save workouts
3. **Workout History** - View all past workouts, tap for full detail (exercises, sets, reps, weights), delete workouts
4. **Routines** - Create/edit/delete workout templates with exercises
5. **Exercise Library** - 93+ exercises, filter by type (Calisthenics/Gym), muscle group, search
6. **Progress Charts** - Weekly activity bar chart, volume trend, top exercises, period selector
7. **Hungarian Language Support** - Full EN/HU translation with persistent toggle
8. **Persistent Storage** - All data saved locally using Zustand + AsyncStorage

## Navigation (6 tabs)
Home | Workout | History | Routines | Library | Progress

## Tech Stack
- Frontend: Expo (React Native) with TypeScript
- State: Zustand with AsyncStorage persistence
- Charts: react-native-gifted-charts
- Navigation: expo-router with bottom tabs (SafeArea-aware)
- Storage: Local only (no authentication)

## Safe Area
- Tab bar uses `useSafeAreaInsets().bottom` for dynamic padding
- All screens use `useSafeAreaInsets().top` for status bar clearance
