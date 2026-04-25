import React from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { C, F, SHADOW_SM } from './theme';

const plans = [
  {
    id: 1, title: 'Overcoming Anxiety', duration: '7 Days',
    icon: '🍃', color: C.sageDark,
    description: 'Breathing techniques & grounding exercises',
    tag: 'Beginner',
  },
  {
    id: 2, title: 'Better Sleep', duration: '14 Days',
    icon: '🌙', color: '#6A5B5B',
    description: 'Wind-down routines & sleep hygiene habits',
    tag: 'Intermediate',
  },
  {
    id: 3, title: 'Building Confidence', duration: '21 Days',
    icon: '⭐', color: C.secondary,
    description: 'Daily affirmations & mindset reframing',
    tag: 'All Levels',
  },
  {
    id: 4, title: 'Stress Management', duration: '10 Days',
    icon: '🧘', color: C.primary,
    description: 'Mindfulness practices & relaxation tools',
    tag: 'Beginner',
  },
];

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const PlansScreen = () => {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Self-Help Plans</Text>
          <Text style={styles.pageSubtitle}>Structured programs to build lasting mental wellness habits.</Text>
        </View>

        <View style={styles.list}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={styles.card}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('PlanDetail', {
                title: plan.title,
                duration: plan.duration,
                icon: plan.icon,
                color: plan.color,
              })}
            >
              {/* Color left strip */}
              <View style={[styles.colorStrip, { backgroundColor: plan.color }]} />

              {/* Icon */}
              <View style={[styles.iconWrap, { backgroundColor: plan.color + '18' }]}>
                <Text style={styles.icon}>{plan.icon}</Text>
              </View>

              {/* Info */}
              <View style={styles.info}>
                <View style={styles.titleRow}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <View style={[styles.tagPill, { backgroundColor: plan.color + '15' }]}>
                    <Text style={[styles.tagText, { color: plan.color }]}>{plan.tag}</Text>
                  </View>
                </View>
                <Text style={styles.description}>{plan.description}</Text>
                <View style={styles.durationRow}>
                  <Text style={styles.durationIcon}>⏱</Text>
                  <Text style={[styles.durationText, { color: plan.color }]}>{plan.duration}</Text>
                </View>
              </View>

              {/* Arrow */}
              <View style={[styles.arrowWrap, { backgroundColor: plan.color + '15' }]}>
                <Text style={[styles.arrow, { color: plan.color }]}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  container: { flex: 1, paddingHorizontal: 20 },

  pageHeader: { paddingTop: 8, paddingBottom: 24 },
  pageTitle: { fontFamily: F.headlineItalic, fontSize: 30, color: C.primary, marginBottom: 6 },
  pageSubtitle: { fontFamily: F.body, fontSize: 15, color: C.onSurfaceVariant, lineHeight: 22 },

  list: { gap: 14, paddingBottom: 30 },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface, borderRadius: 24,
    borderWidth: 1, borderColor: C.outlineVariant,
    overflow: 'hidden', ...SHADOW_SM,
  },
  colorStrip: { width: 4, alignSelf: 'stretch' },
  iconWrap: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    margin: 16, marginLeft: 12,
  },
  icon: { fontSize: 26 },

  info: { flex: 1, paddingVertical: 16, paddingRight: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' },
  planTitle: { fontFamily: F.headline, fontSize: 17, color: C.primary, flex: 1 },
  tagPill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 9999 },
  tagText: { fontFamily: F.bold, fontSize: 10, letterSpacing: 0.3 },
  description: { fontFamily: F.body, fontSize: 13, color: C.outline, marginBottom: 10, lineHeight: 19 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  durationIcon: { fontSize: 11 },
  durationText: { fontFamily: F.bold, fontSize: 12 },

  arrowWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  arrow: { fontSize: 22, fontFamily: F.semibold, lineHeight: 26 },
});
