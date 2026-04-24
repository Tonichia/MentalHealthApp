import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PlanDetailRouteProp = RouteProp<RootStackParamList, 'PlanDetail'>;

export const PlanDetailScreen = () => {
  const route = useRoute<PlanDetailRouteProp>();
  const { title, duration, icon, color } = route.params;

  const [exercises, setExercises] = useState([
    { id: 1, title: 'Morning Meditation (5 min)', completed: false },
    { id: 2, title: 'Write down 3 positive thoughts', completed: false },
    { id: 3, title: 'Deep breathing exercise', completed: false },
  ]);

  const storageKey = `@plan_progress_${title}`;

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem(storageKey);
        if (savedProgress) setExercises(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Failed to load plan progress', e);
      }
    };
    loadProgress();
  }, [storageKey]);

  const toggleExercise = async (id: number) => {
    const updatedExercises = exercises.map((ex) =>
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    );
    setExercises(updatedExercises);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedExercises));
    } catch (e) {
      console.error('Failed to save plan progress', e);
    }
  };

  const completedCount = exercises.filter((ex) => ex.completed).length;
  const progressPercentage = Math.round((completedCount / exercises.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero header */}
        <View style={[styles.header, { backgroundColor: color }]}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{duration} Course</Text>
        </View>

        <View style={styles.content}>
          {/* Progress card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>TODAY'S PROGRESS</Text>
              <Text style={[styles.progressPercent, { color }]}>{progressPercentage}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { backgroundColor: color, width: `${progressPercentage}%` as any }]} />
            </View>
            <Text style={styles.progressSub}>{completedCount} of {exercises.length} exercises completed</Text>
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About this plan</Text>
          <Text style={styles.description}>
            This {duration.toLowerCase()} plan is designed to help you with {title.toLowerCase()}.
            Complete the daily exercises to build healthier habits and track your progress.
          </Text>

          {/* Day 1 exercises */}
          <Text style={styles.sectionTitle}>Day 1 Exercises</Text>
          <View style={styles.checklistContainer}>
            {exercises.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={[styles.checklistItem, ex.completed && styles.checklistItemDone]}
                onPress={() => toggleExercise(ex.id)}
              >
                <View style={[styles.checkbox, ex.completed && { backgroundColor: color, borderColor: color }]}>
                  {ex.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.checklistText, ex.completed && styles.checklistTextDone]}>
                  {ex.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },

  header: {
    paddingTop: 40,
    paddingBottom: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 8,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: { fontSize: 44 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 6, letterSpacing: -0.5 },
  duration: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },

  content: { padding: 20, paddingBottom: 50 },

  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.5 },
  progressPercent: { fontSize: 22, fontWeight: '900' },
  progressBarTrack: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
  progressBarFill: { height: '100%', borderRadius: 5 },
  progressSub: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },

  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 10, marginTop: 22, letterSpacing: -0.3 },
  description: { fontSize: 15, color: '#64748B', lineHeight: 24 },

  checklistContainer: { gap: 12, marginTop: 4 },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  checklistItemDone: { backgroundColor: '#FAFAFA', borderColor: '#F1F5F9' },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '900' },
  checklistText: { fontSize: 15, fontWeight: '600', color: '#0F172A', flex: 1 },
  checklistTextDone: { color: '#94A3B8', textDecorationLine: 'line-through' },
});
