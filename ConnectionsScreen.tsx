import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const groups = [
  { id: 1, name: 'Anxiety Support Group', members: 128, active: true, icon: '🍃' },
  { id: 2, name: 'Mindful Meditation', members: 340, active: false, icon: '🧘' },
  { id: 3, name: 'Sleep Hygiene Basics', members: 85, active: true, icon: '🌙' },
];

const professionals = [
  { id: 1, name: 'Dr. Sarah Jenkins', role: 'Clinical Psychologist', availability: 'Available Today', availableNow: true },
  { id: 2, name: 'Mark Thompson', role: 'Therapist, LCSW', availability: 'Next Available: Tomorrow', availableNow: false },
];

export const ConnectionsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect with others on similar journeys.</Text>

        <Text style={styles.sectionLabel}>SUPPORT GROUPS</Text>
        <View style={styles.listContainer}>
          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.card}
              onPress={() => navigation.navigate('GroupChat', { groupName: group.name })}
            >
              <View style={styles.cardLeft}>
                <View style={styles.groupIcon}>
                  <Text style={styles.groupIconEmoji}>{group.icon}</Text>
                </View>
                <View style={styles.groupInfo}>
                  <View style={styles.nameLine}>
                    <Text style={styles.cardTitle}>{group.name}</Text>
                    {group.active && (
                      <View style={styles.liveChip}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>Live</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.memberCount}>{group.members.toLocaleString()} members</Text>
                </View>
              </View>
              <View style={styles.joinButton}>
                <Text style={styles.joinText}>Join</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 12 }]}>PROFESSIONALS</Text>
        <View style={styles.listContainer}>
          {professionals.map((prof) => (
            <TouchableOpacity key={prof.id} style={styles.card}>
              <View style={styles.profAvatarCircle}>
                <Text style={styles.profAvatarInitials}>
                  {prof.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Text>
              </View>
              <View style={styles.profInfo}>
                <Text style={styles.cardTitle}>{prof.name}</Text>
                <Text style={styles.profRole}>{prof.role}</Text>
                <View style={[styles.availabilityChip, prof.availableNow ? styles.availableNowChip : styles.availableLaterChip]}>
                  <Text style={[styles.availabilityText, prof.availableNow ? styles.availableNowText : styles.availableLaterText]}>
                    {prof.availability}
                  </Text>
                </View>
              </View>
              <View style={styles.messageButton}>
                <Text style={styles.messageButtonText}>Message</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF9F3' },
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: '600', fontFamily: 'serif', color: '#261A1A', marginBottom: 4, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 15, color: '#4E4444', marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#807474', letterSpacing: 1.5, marginBottom: 14 },
  listContainer: { gap: 14, marginBottom: 8 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#261A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#D2C3C3',
  },

  // Group cards
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  groupIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F0EEE8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  groupIconEmoji: { fontSize: 22 },
  groupInfo: { flex: 1 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1C1C18', flex: 1 },
  liveChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DEE5CF', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#424939' },
  liveText: { fontSize: 10, fontWeight: '800', color: '#171D10' },
  memberCount: { fontSize: 13, color: '#807474', fontWeight: '500' },
  joinButton: { backgroundColor: '#F3DEDD', paddingVertical: 9, paddingHorizontal: 16, borderRadius: 12 },
  joinText: { fontSize: 13, fontWeight: '800', color: '#241919' },

  // Professional cards
  profAvatarCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#261A1A', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  profAvatarInitials: { fontSize: 16, fontWeight: '800', color: '#FCF9F3' },
  profInfo: { flex: 1 },
  profRole: { fontSize: 13, color: '#807474', marginBottom: 8, fontWeight: '500' },
  availabilityChip: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  availableNowChip: { backgroundColor: '#DEE5CF' },
  availableLaterChip: { backgroundColor: '#F0EEE8' },
  availabilityText: { fontSize: 11, fontWeight: '700' },
  availableNowText: { color: '#171D10' },
  availableLaterText: { color: '#807474' },
  messageButton: { backgroundColor: '#F0EEE8', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 12 },
  messageButtonText: { color: '#1C1C18', fontWeight: '800', fontSize: 13 },
});
