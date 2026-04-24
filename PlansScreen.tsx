import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

const plans = [
  { id: 1, title: 'Overcoming Anxiety', duration: '7 Days', icon: '🍃', color: '#10B981', description: 'Breathing techniques & grounding exercises' },
  { id: 2, title: 'Better Sleep', duration: '14 Days', icon: '🌙', color: '#6366F1', description: 'Wind-down routines & sleep hygiene habits' },
  { id: 3, title: 'Building Confidence', duration: '21 Days', icon: '⭐', color: '#F59E0B', description: 'Daily affirmations & mindset reframing' },
  { id: 4, title: 'Stress Management', duration: '10 Days', icon: '🧘', color: '#EC4899', description: 'Mindfulness practices & relaxation tools' },
];

type PlansScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Plans'>;

export const PlansScreen = () => {
  const navigation = useNavigation<PlansScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Self-Help Plans</Text>
        <Text style={styles.headerSubtitle}>Structured programs to build lasting mental wellness habits.</Text>

        <View style={styles.planList}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={styles.planCard}
              onPress={() => navigation.navigate('PlanDetail', {
                title: plan.title,
                duration: plan.duration,
                icon: plan.icon,
                color: plan.color,
              })}
            >
              <View style={[styles.iconContainer, { backgroundColor: plan.color + '18' }]}>
                <Text style={styles.icon}>{plan.icon}</Text>
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
                <View style={styles.durationChip}>
                  <Text style={[styles.durationText, { color: plan.color }]}>{plan.duration}</Text>
                </View>
              </View>
              <View style={[styles.arrowContainer, { backgroundColor: plan.color + '15' }]}>
                <Text style={[styles.arrow, { color: plan.color }]}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 4, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 15, color: '#64748B', marginBottom: 24, lineHeight: 22 },
  planList: { gap: 14, paddingBottom: 30 },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 20,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconContainer: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  icon: { fontSize: 26 },
  planInfo: { flex: 1 },
  planTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 3, letterSpacing: -0.2 },
  planDescription: { fontSize: 13, color: '#94A3B8', fontWeight: '500', marginBottom: 8 },
  durationChip: { alignSelf: 'flex-start', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  durationText: { fontSize: 12, fontWeight: '700' },
  arrowContainer: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  arrow: { fontSize: 22, fontWeight: '600', lineHeight: 26 },
});
