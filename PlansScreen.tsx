import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp as NNP } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { C, F } from './theme';
import { GradientBackground } from './GradientBackground';
import { GlassCard } from './GlassCard';

const plans = [
  { id: 1, title: 'Overcoming Anxiety',   duration: '7 Days',  icon: '🍃', color: C.sage,     desc: 'Breathing techniques & grounding exercises', level: 'Beginner' },
  { id: 2, title: 'Better Sleep',         duration: '14 Days', icon: '🌙', color: C.mist,     desc: 'Wind-down routines & sleep hygiene habits',   level: 'Intermediate' },
  { id: 3, title: 'Building Confidence',  duration: '21 Days', icon: '⭐', color: C.gold,     desc: 'Daily affirmations & mindset reframing',      level: 'All Levels' },
  { id: 4, title: 'Stress Management',    duration: '10 Days', icon: '🧘', color: C.duskRose, desc: 'Mindfulness practices & relaxation tools',    level: 'Beginner' },
];

export const PlansScreen = () => {
  const navigation = useNavigation<NNP<RootStackParamList>>();
  return (
    <GradientBackground>
      <SafeAreaView style={pl.safe}>
        <ScrollView style={pl.scroll} showsVerticalScrollIndicator={false}>
          <View style={pl.header}>
            <Text style={pl.title}>Self-Help Plans</Text>
            <Text style={pl.subtitle}>Structured programs to build lasting mental wellness habits.</Text>
          </View>
          <View style={pl.list}>
            {plans.map(plan => (
              <TouchableOpacity key={plan.id} activeOpacity={0.88}
                onPress={() => navigation.navigate('PlanDetail', { title: plan.title, duration: plan.duration, icon: plan.icon, color: plan.color })}>
                <GlassCard style={pl.card}>
                  <View style={[pl.strip, { backgroundColor: plan.color }]} />
                  <View style={[pl.iconBg, { backgroundColor: plan.color + '25' }]}>
                    <Text style={pl.icon}>{plan.icon}</Text>
                  </View>
                  <View style={pl.info}>
                    <View style={pl.titleRow}>
                      <Text style={pl.planTitle}>{plan.title}</Text>
                      <View style={[pl.levelPill, { backgroundColor: plan.color + '25', borderColor: plan.color + '50' }]}>
                        <Text style={[pl.levelText, { color: plan.color }]}>{plan.level}</Text>
                      </View>
                    </View>
                    <Text style={pl.desc}>{plan.desc}</Text>
                    <Text style={[pl.duration, { color: plan.color }]}>⏱  {plan.duration}</Text>
                  </View>
                  <Text style={[pl.arrow, { color: plan.color }]}>›</Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const pl = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  header: { paddingTop: 8, paddingBottom: 24 },
  title: { fontFamily: F.headlineItalic, fontSize: 30, color: C.textPrimary, marginBottom: 6 },
  subtitle: { fontFamily: F.body, fontSize: 15, color: C.textSecondary, lineHeight: 22 },
  list: { gap: 14 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 0, overflow: 'hidden' },
  strip: { width: 4, alignSelf: 'stretch' },
  iconBg: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', margin: 16, marginLeft: 12 },
  icon: { fontSize: 26 },
  info: { flex: 1, paddingVertical: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' },
  planTitle: { fontFamily: F.headline, fontSize: 17, color: C.textPrimary, flex: 1 },
  levelPill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 9999, borderWidth: 1 },
  levelText: { fontFamily: F.bold, fontSize: 10 },
  desc: { fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginBottom: 8, lineHeight: 19 },
  duration: { fontFamily: F.bold, fontSize: 12 },
  arrow: { fontSize: 26, fontFamily: F.semibold, paddingRight: 16, lineHeight: 30 },
});
