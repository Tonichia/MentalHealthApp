import React from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { C, F, SHADOW_SM, SHADOW_MD } from './theme';

const groups = [
  { id: 1, name: 'Anxiety Support Group',  members: 128, active: true,  icon: '🍃', color: C.sageDark },
  { id: 2, name: 'Mindful Meditation',      members: 340, active: false, icon: '🧘', color: C.primary },
  { id: 3, name: 'Sleep Hygiene Basics',    members: 85,  active: true,  icon: '🌙', color: '#5A4A6A' },
];

const professionals = [
  { id: 1, name: 'Dr. Sarah Jenkins', role: 'Clinical Psychologist',  availability: 'Available Today',     availableNow: true },
  { id: 2, name: 'Mark Thompson',     role: 'Therapist, LCSW',        availability: 'Next: Tomorrow',      availableNow: false },
];

type Nav = NativeStackNavigationProp<RootStackParamList, 'Connections'>;

export const ConnectionsScreen = () => {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Community</Text>
          <Text style={styles.pageSubtitle}>Connect with others on similar journeys.</Text>
        </View>

        {/* Support Groups */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>SUPPORT GROUPS</Text>
          <View style={styles.sectionRule} />
        </View>

        <View style={styles.list}>
          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupCard}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('GroupChat', { groupName: group.name })}
            >
              {/* Left color strip */}
              <View style={[styles.cardStrip, { backgroundColor: group.color }]} />

              <View style={[styles.groupIconBg, { backgroundColor: group.color + '18' }]}>
                <Text style={styles.groupIconEmoji}>{group.icon}</Text>
              </View>

              <View style={styles.groupInfo}>
                <View style={styles.groupTitleRow}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  {group.active && (
                    <View style={styles.liveChip}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>Live</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.memberCount}>{group.members.toLocaleString()} members</Text>
              </View>

              <View style={[styles.joinBtn, { backgroundColor: group.color }]}>
                <Text style={styles.joinBtnText}>Join</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Professionals */}
        <View style={[styles.sectionRow, { marginTop: 28 }]}>
          <Text style={styles.sectionLabel}>PROFESSIONALS</Text>
          <View style={styles.sectionRule} />
        </View>

        <View style={styles.list}>
          {professionals.map((prof) => (
            <TouchableOpacity key={prof.id} style={styles.profCard} activeOpacity={0.88}>
              <View style={styles.profAvatar}>
                <Text style={styles.profInitials}>
                  {prof.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </Text>
              </View>

              <View style={styles.profInfo}>
                <Text style={styles.profName}>{prof.name}</Text>
                <Text style={styles.profRole}>{prof.role}</Text>
                <View style={[
                  styles.availChip,
                  prof.availableNow ? styles.availNowChip : styles.availLaterChip,
                ]}>
                  <Text style={[
                    styles.availText,
                    prof.availableNow ? styles.availNowText : styles.availLaterText,
                  ]}>
                    {prof.availableNow ? '● ' : '○ '}{prof.availability}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.msgBtn} activeOpacity={0.8}>
                <Text style={styles.msgBtnText}>Message</Text>
              </TouchableOpacity>
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

  sectionRow: { marginBottom: 14, gap: 8 },
  sectionLabel: { fontFamily: F.extraBold, fontSize: 10, color: C.outline, letterSpacing: 2.5 },
  sectionRule: { height: 1, backgroundColor: C.outlineVariant },

  list: { gap: 12 },

  // Group card
  groupCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface, borderRadius: 24,
    borderWidth: 1, borderColor: C.outlineVariant,
    overflow: 'hidden', ...SHADOW_SM,
  },
  cardStrip: { width: 4, alignSelf: 'stretch' },
  groupIconBg: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    margin: 14, marginLeft: 12,
  },
  groupIconEmoji: { fontSize: 24 },
  groupInfo: { flex: 1 },
  groupTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  groupName: { fontFamily: F.semibold, fontSize: 15, color: C.primary, flex: 1 },
  liveChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 9999, gap: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  liveText: { fontFamily: F.extraBold, fontSize: 10, color: '#16A34A' },
  memberCount: { fontFamily: F.medium, fontSize: 13, color: C.outline },
  joinBtn: {
    margin: 14, paddingVertical: 9, paddingHorizontal: 16,
    borderRadius: 9999,
  },
  joinBtnText: { fontFamily: F.bold, color: C.background, fontSize: 13 },

  // Prof card
  profCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface, padding: 18, borderRadius: 24,
    borderWidth: 1, borderColor: C.outlineVariant, ...SHADOW_SM,
  },
  profAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  profInitials: { fontFamily: F.extraBold, fontSize: 17, color: C.background },
  profInfo: { flex: 1 },
  profName: { fontFamily: F.semibold, fontSize: 15, color: C.primary, marginBottom: 3 },
  profRole: { fontFamily: F.body, fontSize: 13, color: C.onSurfaceVariant, marginBottom: 8 },
  availChip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  availNowChip: { backgroundColor: '#DCFCE7' },
  availLaterChip: { backgroundColor: C.surfaceContainer },
  availText: { fontFamily: F.bold, fontSize: 11 },
  availNowText: { color: '#16A34A' },
  availLaterText: { color: C.onSurfaceVariant },
  msgBtn: {
    backgroundColor: C.surfaceContainerHigh,
    paddingVertical: 9, paddingHorizontal: 14, borderRadius: 9999,
  },
  msgBtnText: { fontFamily: F.bold, color: C.primary, fontSize: 13 },
});
