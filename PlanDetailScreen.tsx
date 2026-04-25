import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  SafeAreaView, TouchableOpacity, Animated,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C, F, SHADOW_MD, SHADOW_SM } from './theme';

type PlanDetailRouteProp = RouteProp<RootStackParamList, 'PlanDetail'>;

export const PlanDetailScreen = () => {
  const route = useRoute<PlanDetailRouteProp>();
  const { title, duration, icon, color } = route.params;

  const [exercises, setExercises] = useState([
    { id: 1, title: 'Morning Meditation (5 min)',          completed: false },
    { id: 2, title: 'Write down 3 positive thoughts',     completed: false },
    { id: 3, title: 'Deep breathing exercise',            completed: false },
  ]);

  const storageKey = `@plan_progress_${title}`;

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (saved) setExercises(JSON.parse(saved));
      } catch (e) { console.error(e); }
    };
    load();
  }, [storageKey]);

  const toggleExercise = async (id: number) => {
    const updated = exercises.map(ex => ex.id === id ? { ...ex, completed: !ex.completed } : ex);
    setExercises(updated);
    try { await AsyncStorage.setItem(storageKey, JSON.stringify(updated)); }
    catch (e) { console.error(e); }
  };

  const completedCount = exercises.filter(ex => ex.completed).length;
  const progress       = Math.round((completedCount / exercises.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Hero header */}
        <View style={[styles.hero, { backgroundColor: color }]}>
          <View style={styles.heroIconBg}>
            <Text style={styles.heroIcon}>{icon}</Text>
          </View>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroDuration}>{duration} Course</Text>
        </View>

        {/* Progress card — overlaps hero */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>TODAY'S PROGRESS</Text>
            <Text style={[styles.progressPct, { color }]}>{progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { backgroundColor: color, width: `${progress}%` as any }]} />
          </View>
          <Text style={styles.progressSub}>{completedCount} of {exercises.length} completed</Text>
        </View>

        <View style={styles.content}>

          {/* About */}
          <Text style={styles.sectionTitle}>About this plan</Text>
          <Text style={styles.description}>
            This {duration.toLowerCase()} plan is designed to help you with {title.toLowerCase()}.
            Complete daily exercises to build healthier habits and track your growth.
          </Text>

          {/* Exercises */}
          <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Day 1 Exercises</Text>
          <View style={styles.checklist}>
            {exercises.map(ex => (
              <TouchableOpacity
                key={ex.id}
                style={[styles.checkItem, ex.completed && styles.checkItemDone]}
                onPress={() => toggleExercise(ex.id)}
                activeOpacity={0.85}
              >
                <View style={[
                  styles.checkbox,
                  ex.completed && { backgroundColor: color, borderColor: color },
                ]}>
                  {ex.completed && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.checkText, ex.completed && styles.checkTextDone]}>
                  {ex.title}
                </Text>
                {ex.completed && <Text style={styles.doneTag}>Done</Text>}
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  container: { flex: 1 },

  hero: {
    paddingTop: 48, paddingBottom: 56,
    alignItems: 'center', justifyContent: 'center',
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    ...SHADOW_MD,
  },
  heroIconBg: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 18,
  },
  heroIcon: { fontSize: 48 },
  heroTitle: {
    fontFamily: F.headlineItalic, fontSize: 30,
    color: '#fff', textAlign: 'center', marginBottom: 8,
  },
  heroDuration: { fontFamily: F.semibold, fontSize: 15, color: 'rgba(255,255,255,0.85)' },

  progressCard: {
    backgroundColor: C.surface, borderRadius: 24,
    padding: 22, marginHorizontal: 20, marginTop: -24,
    borderWidth: 1, borderColor: C.outlineVariant,
    ...SHADOW_MD,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  progressLabel: { fontFamily: F.extraBold, fontSize: 10, color: C.outline, letterSpacing: 2 },
  progressPct: { fontFamily: F.headline, fontSize: 26 },
  progressTrack: {
    height: 10, backgroundColor: C.surfaceContainer,
    borderRadius: 5, overflow: 'hidden', marginBottom: 10,
  },
  progressFill: { height: '100%', borderRadius: 5 },
  progressSub: { fontFamily: F.medium, fontSize: 13, color: C.outline },

  content: { padding: 20, paddingTop: 24, paddingBottom: 50 },

  sectionTitle: { fontFamily: F.headline, fontSize: 22, color: C.primary, marginBottom: 10 },
  description: { fontFamily: F.body, fontSize: 15, color: C.onSurfaceVariant, lineHeight: 25 },

  checklist: { gap: 12 },
  checkItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface, padding: 18,
    borderRadius: 20, borderWidth: 1,
    borderColor: C.outlineVariant, ...SHADOW_SM,
  },
  checkItemDone: { backgroundColor: C.surfaceContainerLow },
  checkbox: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: C.outlineVariant,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  checkMark: { color: '#fff', fontSize: 13, fontFamily: F.extraBold },
  checkText: { fontFamily: F.semibold, fontSize: 15, color: C.primary, flex: 1 },
  checkTextDone: { color: C.outline, textDecorationLine: 'line-through' },
  doneTag: {
    fontFamily: F.bold, fontSize: 11, color: C.outline,
    backgroundColor: C.surfaceContainerHigh,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9999,
  },
});
