import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { storage } from './storage';
import { PaperGrainView } from './PaperGrainView';

type PlanDetailRouteProp = RouteProp<RootStackParamList, 'PlanDetail'>;

const AnimatedChecklistItem = ({ ex, color, onToggle }: { ex: any, color: string, onToggle: (id: number) => void }) => {
  const anim = useRef(new Animated.Value(ex.completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: ex.completed ? 1 : 0,
      duration: 250,
      useNativeDriver: false, // Needed for color interpolations
    }).start();
  }, [ex.completed]);

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#F6F3ED']
  });

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D2C3C3', '#EBE8E2']
  });

  const checkboxBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', color]
  });

  const checkboxBorder = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D2C3C3', color]
  });

  const textColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1C1C18', '#807474']
  });

  return (
    <TouchableOpacity onPress={() => onToggle(ex.id)} activeOpacity={0.8}>
      <Animated.View style={[styles.checklistItem, { backgroundColor, borderColor }]}>
        <Animated.View style={[styles.checkbox, { backgroundColor: checkboxBg, borderColor: checkboxBorder }]}>
          <Animated.Text style={[styles.checkmark, { transform: [{ scale: anim }], opacity: anim }]}>✓</Animated.Text>
        </Animated.View>
        <Animated.Text style={[styles.checklistText, { color: textColor }, ex.completed && { textDecorationLine: 'line-through' }]}>
          {ex.title}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const PlanDetailScreen = () => {
  const route = useRoute<PlanDetailRouteProp>();
  const { title, duration, icon, color } = route.params;

  const [exercises, setExercises] = useState([
    { id: 1, title: 'Morning Meditation (5 min)', completed: false },
    { id: 2, title: 'Write down 3 positive thoughts', completed: false },
    { id: 3, title: 'Deep breathing exercise', completed: false },
  ]);

  const storageKey = `@plan_progress_${title}`;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = storage.getString(storageKey);
        if (savedProgress) setExercises(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Failed to load plan progress', e);
      }
    };
    loadProgress();

    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(headerTranslateY, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 150, useNativeDriver: true }),
      Animated.spring(contentTranslateY, { toValue: 0, friction: 8, tension: 40, delay: 150, useNativeDriver: true }),
    ]).start();
  }, [storageKey]);

  const toggleExercise = (id: number) => {
    const updatedExercises = exercises.map((ex) =>
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    );
    setExercises(updatedExercises);
    try {
      storage.set(storageKey, JSON.stringify(updatedExercises));
    } catch (e) {
      console.error('Failed to save plan progress', e);
    }
  };

  const completedCount = exercises.filter((ex) => ex.completed).length;
  const progressPercentage = Math.round((completedCount / exercises.length) * 100);

  const progressAnim = useRef(new Animated.Value(progressPercentage)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 400,
      useNativeDriver: false, // width animations do not support native driver
    }).start();

    if (progressPercentage === 100) {
      Animated.spring(celebrationAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      celebrationAnim.setValue(0);
    }
  }, [progressPercentage]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero header */}
        <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }}>
          <PaperGrainView style={[styles.header, { backgroundColor: color }]} intensity={0.06}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.duration}>{duration} Course</Text>
          </PaperGrainView>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }]}>
          {/* Progress card */}
          <PaperGrainView style={styles.progressCard} intensity={0.04}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>TODAY'S PROGRESS</Text>
              <Text style={[styles.progressPercent, { color }]}>{progressPercentage}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <Animated.View style={[styles.progressBarFill, { backgroundColor: color, width: progressWidth }]} />
            </View>
            <Text style={styles.progressSub}>{completedCount} of {exercises.length} exercises completed</Text>

            {progressPercentage === 100 && (
              <Animated.View style={[styles.celebrationContainer, {
                opacity: celebrationAnim,
                transform: [
                  { scale: celebrationAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }
                ]
              }]}>
                <Text style={styles.celebrationIcon}>🎉</Text>
                <Text style={styles.celebrationText}>Great job! You're all done for today.</Text>
              </Animated.View>
            )}
          </PaperGrainView>

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
              <AnimatedChecklistItem key={ex.id} ex={ex} color={color} onToggle={toggleExercise} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF9F3' },
  container: { flex: 1 },

  header: {
    paddingTop: 40,
    paddingBottom: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#261A1A',
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
  title: { fontSize: 28, fontWeight: '600', fontFamily: 'serif', color: '#FCF9F3', textAlign: 'center', marginBottom: 6, letterSpacing: -0.5 },
  duration: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },

  content: { padding: 20, paddingBottom: 50 },

  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    marginTop: -20,
    shadowColor: '#261A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#D2C3C3',
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressLabel: { fontSize: 11, fontWeight: '800', color: '#807474', letterSpacing: 1.5 },
  progressPercent: { fontSize: 22, fontWeight: '900' },
  progressBarTrack: { height: 10, backgroundColor: '#F0EEE8', borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
  progressBarFill: { height: '100%', borderRadius: 5 },
  progressSub: { fontSize: 13, color: '#807474', fontWeight: '500' },

  sectionTitle: { fontSize: 20, fontWeight: '600', fontFamily: 'serif', color: '#261A1A', marginBottom: 10, marginTop: 22, letterSpacing: -0.3 },
  description: { fontSize: 15, color: '#4E4444', lineHeight: 24 },

  checklistContainer: { gap: 12, marginTop: 4 },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    shadowColor: '#261A1A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#D2C3C3',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D2C3C3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '900' },
  checklistText: { fontSize: 15, fontWeight: '600', color: '#1C1C18', flex: 1 },
  celebrationContainer: {
    marginTop: 14,
    backgroundColor: '#DEE5CF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationIcon: { fontSize: 16, marginRight: 8 },
  celebrationText: { fontSize: 13, fontWeight: '800', color: '#171D10' },
});
