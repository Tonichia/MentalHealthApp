import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { C, F } from './theme';
import { GradientBackground } from './GradientBackground';
import { GlassCard } from './GlassCard';

const groups = [
  { id: 1, name: 'Anxiety Support Group', members: 128, active: true,  icon: '🍃', color: C.sage },
  { id: 2, name: 'Mindful Meditation',     members: 340, active: false, icon: '🧘', color: C.mist },
  { id: 3, name: 'Sleep Hygiene Basics',   members: 85,  active: true,  icon: '🌙', color: C.duskRose },
];
const professionals = [
  { id: 1, name: 'Dr. Sarah Jenkins', role: 'Clinical Psychologist', availability: 'Available Today',   now: true  },
  { id: 2, name: 'Mark Thompson',     role: 'Therapist, LCSW',       availability: 'Next: Tomorrow',    now: false },
];

type ConnNav = NativeStackNavigationProp<RootStackParamList, 'Connections'>;

export const ConnectionsScreen = () => {
  const navigation = useNavigation<ConnNav>();
  return (
    <GradientBackground>
      <SafeAreaView style={cn.safe}>
        <ScrollView style={cn.scroll} showsVerticalScrollIndicator={false}>
          <View style={cn.header}>
            <Text style={cn.title}>Community</Text>
            <Text style={cn.subtitle}>Connect with others on similar journeys.</Text>
          </View>

          <Text style={cn.sectionLabel}>SUPPORT GROUPS</Text>
          <View style={cn.list}>
            {groups.map(g => (
              <TouchableOpacity key={g.id} activeOpacity={0.88}
                onPress={() => navigation.navigate('GroupChat', { groupName: g.name })}>
                <GlassCard style={cn.groupCard}>
                  <View style={[cn.groupStrip, { backgroundColor: g.color }]} />
                  <View style={[cn.groupIconBg, { backgroundColor: g.color + '25' }]}>
                    <Text style={cn.groupEmoji}>{g.icon}</Text>
                  </View>
                  <View style={cn.groupInfo}>
                    <View style={cn.groupTitleRow}>
                      <Text style={cn.groupName}>{g.name}</Text>
                      {g.active && <View style={cn.liveChip}><View style={cn.liveDot}/><Text style={cn.liveText}>Live</Text></View>}
                    </View>
                    <Text style={cn.members}>{g.members.toLocaleString()} members</Text>
                  </View>
                  <View style={[cn.joinBtn, { backgroundColor: g.color }]}>
                    <Text style={cn.joinText}>Join</Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[cn.sectionLabel, { marginTop: 24 }]}>PROFESSIONALS</Text>
          <View style={cn.list}>
            {professionals.map(p => (
              <GlassCard key={p.id} style={cn.profCard}>
                <View style={cn.profAvatar}>
                  <Text style={cn.profInitials}>{p.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</Text>
                </View>
                <View style={cn.profInfo}>
                  <Text style={cn.profName}>{p.name}</Text>
                  <Text style={cn.profRole}>{p.role}</Text>
                  <View style={[cn.availChip, p.now ? cn.availNow : cn.availLater]}>
                    <Text style={[cn.availText, p.now ? cn.availNowText : cn.availLaterText]}>{p.now ? '● ' : '○ '}{p.availability}</Text>
                  </View>
                </View>
                <View style={cn.msgBtn}><Text style={cn.msgText}>Message</Text></View>
              </GlassCard>
            ))}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const cn = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  header: { paddingTop: 8, paddingBottom: 20 },
  title: { fontFamily: F.headlineItalic, fontSize: 30, color: C.textPrimary, marginBottom: 6 },
  subtitle: { fontFamily: F.body, fontSize: 15, color: C.textSecondary, lineHeight: 22 },
  sectionLabel: { fontFamily: F.extraBold, fontSize: 10, color: C.textSecondary, letterSpacing: 2.5, marginBottom: 12 },
  list: { gap: 12 },
  groupCard: { flexDirection: 'row', alignItems: 'center', padding: 0, overflow: 'hidden' },
  groupStrip: { width: 4, alignSelf: 'stretch' },
  groupIconBg: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', margin: 14, marginLeft: 12 },
  groupEmoji: { fontSize: 22 },
  groupInfo: { flex: 1 },
  groupTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  groupName: { fontFamily: F.semibold, fontSize: 15, color: C.textPrimary, flex: 1 },
  liveChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A3A2A', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9999, gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.sage },
  liveText: { fontFamily: F.extraBold, fontSize: 10, color: C.sage },
  members: { fontFamily: F.medium, fontSize: 13, color: C.textSecondary },
  joinBtn: { margin: 14, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 9999 },
  joinText: { fontFamily: F.bold, color: C.gradientDeep, fontSize: 13 },
  profCard: { flexDirection: 'row', alignItems: 'center' },
  profAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: C.glass, borderWidth: 1.5, borderColor: C.glassBorder, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  profInitials: { fontFamily: F.extraBold, fontSize: 16, color: C.textPrimary },
  profInfo: { flex: 1 },
  profName: { fontFamily: F.semibold, fontSize: 15, color: C.textPrimary, marginBottom: 3 },
  profRole: { fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginBottom: 8 },
  availChip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  availNow: { backgroundColor: C.sageFaint },
  availLater: { backgroundColor: 'rgba(255,255,255,0.08)' },
  availText: { fontFamily: F.bold, fontSize: 11 },
  availNowText: { color: C.sage },
  availLaterText: { color: C.textSecondary },
  msgBtn: { backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 9999 },
  msgText: { fontFamily: F.bold, color: C.textPrimary, fontSize: 13 },
});
