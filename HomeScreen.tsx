import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Alert, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { useSubscription } from './SubscriptionContext';
import { storage } from './storage';
import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';
import { PaperGrainView } from './PaperGrainView';

interface JournalEntry {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  pendingSync?: boolean;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { tier } = useSubscription();
  const isPro = tier === 'pro';
  const isPlus = tier === 'plus' || tier === 'pro';
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const loadEntries = async () => {
      const cachedEntries = storage.getString('@offline_journal_entries');
      let localEntries: JournalEntry[] = cachedEntries ? JSON.parse(cachedEntries) : [];
      if (localEntries.length > 0) setEntries(localEntries);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to sync any pending entries created while offline
        const pendingEntries = localEntries.filter((e) => e.pendingSync);
        if (pendingEntries.length > 0) {
          for (const pending of pendingEntries) {
            const { data } = await supabase
              .from('journal_entries')
              .insert([{ text: pending.text, user_id: user.id }])
              .select()
              .single();
            
            if (data) {
              localEntries = localEntries.map(e => e.id === pending.id ? data : e);
            }
          }
          setEntries(localEntries);
          storage.set('@offline_journal_entries', JSON.stringify(localEntries));
        }
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        // Merge: Keep local pending entries that haven't synced yet, combine with remote
        const stillPending = localEntries.filter(e => e.pendingSync);
        const merged = [...stillPending, ...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setEntries(merged);
        
        // Prune the offline cache to the latest 50 entries
        storage.set('@offline_journal_entries', JSON.stringify(merged.slice(0, 50)));
      } else if (error) {
        console.error('Failed to load entries', error);
      }
    };
    loadEntries();

    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';
        setUserName(displayName);
        if (user.user_metadata?.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!entry.trim()) return;

    if (tier === 'free' && entries.length > 0) {
      const lastEntryDate = new Date(entries[0].created_at).toDateString();
      const today = new Date().toDateString();
      if (lastEntryDate === today) {
        Alert.alert(
          'Daily Limit Reached',
          'Free users can only write 1 entry per day. Upgrade to Pro for unlimited journaling!',
          [
            { text: 'Maybe Later', style: 'cancel' },
            { text: 'Upgrade', onPress: () => navigation.navigate('Paywall') },
          ]
        );
        return;
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Optimistic local update
    const tempEntry: JournalEntry = {
      id: `temp_${Date.now()}`,
      text: entry,
      created_at: new Date().toISOString(),
      user_id: user.id,
      pendingSync: true,
    };

    const newEntries = [tempEntry, ...entries];
    setEntries(newEntries);
    setEntry('');
    storage.set('@offline_journal_entries', JSON.stringify(newEntries.slice(0, 50)));

    // 2. Attempt remote sync
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([{ text: tempEntry.text, user_id: user.id }])
      .select()
      .single();

    if (data) {
      // Success: replace temp entry with real server entry
      const updatedEntries = newEntries.map(e => e.id === tempEntry.id ? data : e);
      setEntries(updatedEntries);
      storage.set('@offline_journal_entries', JSON.stringify(updatedEntries.slice(0, 50)));
    } else if (error) {
      Alert.alert('Saved Offline', 'Your entry was saved locally and will sync automatically when you reconnect.');
    }
  };

  const handleDelete = (idToDelete: string) => {
    Alert.alert('Delete Entry', 'Are you sure you want to permanently delete this journal entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('journal_entries').delete().eq('id', idToDelete);
          if (!error) {
            const newEntries = entries.filter((e) => e.id !== idToDelete);
            setEntries(newEntries);
            storage.set('@offline_journal_entries', JSON.stringify(newEntries.slice(0, 50)));
          } else {
            Alert.alert('Network Error', 'Unable to delete your entry while offline. Please check your connection.');
          }
        },
      },
    ]);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Error signing out', error.message);
  };

  const handleAvatarUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setAvatarUrl(imageUri);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const response = await fetch(imageUri);
        const blob = await response.blob();
        const fileExt = imageUri.split('.').pop() || 'jpeg';
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, blob, { contentType: `image/${fileExt}` });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
        await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
        setAvatarUrl(publicUrl);
      }
    } catch (error: any) {
      Alert.alert('Upload Error', error.message);
    }
  };

  const saveName = async () => {
    setIsEditingName(false);
    const newName = tempName.trim();
    setUserName(newName);
    await supabase.auth.updateUser({ data: { name: newName } });
  };

  const handlePremiumFeature = (featureName: string, requiredTier: 'plus' | 'pro', routeName?: keyof RootStackParamList) => {
    const hasAccess = requiredTier === 'pro' ? isPro : isPlus;
    if (hasAccess) {
      if (routeName) navigation.navigate(routeName as any);
      else Alert.alert(featureName, `Welcome to ${featureName}! This module is currently under development.`);
    } else {
      navigation.navigate('Paywall');
    }
  };

  const filteredEntries = entries.filter((e) => (e.text || '').toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerProfile}>
            <TouchableOpacity onPress={handleAvatarUpload}>
              <View style={styles.avatarRing}>
                <View style={styles.avatar}>
                  {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarPlaceholder}>👤</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.headerText}>
              <View style={styles.greetingRow}>
                <Text style={styles.greeting}>{getGreeting()}{userName && !isEditingName ? ',' : ''}</Text>
                {isEditingName ? (
                  <TextInput
                    style={styles.nameInput}
                    value={tempName}
                    onChangeText={setTempName}
                    onSubmitEditing={saveName}
                    onBlur={saveName}
                    autoFocus
                    returnKeyType="done"
                  />
                ) : (
                  <TouchableOpacity onPress={() => { setTempName(userName); setIsEditingName(true); }}>
                    <Text style={styles.editableName}>{userName ? ` ${userName}` : ' (add name)'}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.title}>Mind Matter Wellness</Text>
              <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.badge, tier === 'pro' ? styles.badgePro : tier === 'plus' ? styles.badgePlus : styles.badgeFree]}
            onPress={() => tier !== 'pro' && navigation.navigate('Paywall')}
          >
            <Text style={[styles.badgeText, tier === 'pro' ? styles.badgeTextPro : tier === 'plus' ? styles.badgeTextPlus : styles.badgeTextFree]}>
              {tier === 'pro' ? '🌟 Pro' : tier === 'plus' ? '✨ Plus' : 'Upgrade'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Daily Affirmation Card */}
        <PaperGrainView style={styles.affirmationCard} intensity={0.06}>
          <View style={styles.affirmationAccent} />
          <Text style={styles.affirmationLabel}>DAILY AFFIRMATION</Text>
          <Text style={styles.affirmationText}>"I am growing, learning, and becoming the best version of myself."</Text>
        </PaperGrainView>

        {/* Feature Grid */}
        <Text style={styles.sectionTitle}>Your Tools</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('Stories')}>
            <View style={[styles.cardIconBg, { backgroundColor: '#F3DEDD' }]}>
              <Text style={styles.cardIcon}>📚</Text>
            </View>
            <Text style={styles.cardTitle}>Stories</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={() => handlePremiumFeature('Healthy Connections', 'plus', 'Connections')}>
            <View style={[styles.cardIconBg, { backgroundColor: '#DEE5CF' }]}>
              <Text style={styles.cardIcon}>🤝</Text>
            </View>
            <Text style={styles.cardTitle}>Connect</Text>
            {!isPlus && <View style={[styles.lockedBadge, styles.badgePlusBg]}><Text style={styles.lockedText}>PLUS</Text></View>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={() => handlePremiumFeature('Self-Help Plans', 'pro', 'Plans')}>
            <View style={[styles.cardIconBg, { backgroundColor: '#FFDBD1' }]}>
              <Text style={styles.cardIcon}>🗺️</Text>
            </View>
            <Text style={styles.cardTitle}>Plans</Text>
            {!isPro && <View style={[styles.lockedBadge, styles.badgeProBg]}><Text style={styles.lockedText}>PRO</Text></View>}
          </TouchableOpacity>
        </View>

        {/* Journal Section */}
        <Text style={styles.sectionTitle}>Quick Journal</Text>
        <View style={styles.journalContainer}>
          <TextInput
            style={styles.journalInput}
            placeholder="How are you feeling today?"
            placeholderTextColor="#94A3B8"
            multiline
            value={entry}
            onChangeText={setEntry}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>

        {entries.length > 0 && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search your journal..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>
        )}

        <View style={styles.entriesList}>
          {filteredEntries.map((e) => (
            <View key={e.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryDateChip}>
                  <Text style={styles.entryDate}>{formatDate(e.created_at)}{e.pendingSync ? ' ⏳' : ''}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(e.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.entryText}>{e.text}</Text>
            </View>
          ))}
          {entries.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>No entries yet</Text>
              <Text style={styles.emptySubtext}>Start by writing how you feel today.</Text>
            </View>
          )}
          {entries.length > 0 && filteredEntries.length === 0 && (
            <Text style={styles.emptySearchText}>No entries match your search.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF9F3' },
  container: { flex: 1, paddingHorizontal: 20 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 24 },
  headerProfile: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  headerText: { flex: 1 },
  avatarRing: { width: 58, height: 58, borderRadius: 29, borderWidth: 2.5, borderColor: '#8B4E3D', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EBE8E2', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholder: { fontSize: 22 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, flexWrap: 'wrap' },
  greeting: { fontSize: 12, color: '#807474', textTransform: 'uppercase', letterSpacing: 1.2 },
  editableName: { fontSize: 12, color: '#8B4E3D', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '800' },
  nameInput: { fontSize: 12, color: '#1C1C18', textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 1.5, borderBottomColor: '#8B4E3D', marginLeft: 4, padding: 0, minWidth: 80 },
  title: { fontSize: 24, fontWeight: '600', fontFamily: 'serif', color: '#261A1A', letterSpacing: -0.3 },
  signOutButton: { marginTop: 4 },
  signOutText: { fontSize: 11, color: '#807474', fontWeight: '600' },

  // Badge
  badge: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1.5 },
  badgeFree: { backgroundColor: '#F6F3ED', borderColor: '#D2C3C3' },
  badgePlus: { backgroundColor: '#FFDBD1', borderColor: '#FFB5A1' },
  badgePro: { backgroundColor: '#DEE5CF', borderColor: '#C2C9B4' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  badgeTextFree: { color: '#4E4444' },
  badgeTextPlus: { color: '#6F3728' },
  badgeTextPro: { color: '#424939' },

  // Affirmation Card
  affirmationCard: { backgroundColor: '#261A1A', padding: 24, borderRadius: 24, marginBottom: 28, shadowColor: '#261A1A', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 10 },
  affirmationAccent: { width: 44, height: 4, backgroundColor: '#8B4E3D', borderRadius: 2, marginBottom: 14 },
  affirmationLabel: { color: '#A99696', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },
  affirmationText: { color: '#FCF9F3', fontSize: 19, fontFamily: 'serif', fontStyle: 'italic', lineHeight: 29, fontWeight: '500' },

  // Section Title
  sectionTitle: { fontSize: 18, fontWeight: '600', fontFamily: 'serif', color: '#261A1A', marginBottom: 14, letterSpacing: -0.3 },

  // Grid
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  gridCard: { backgroundColor: '#fff', width: '31%', paddingVertical: 20, paddingHorizontal: 8, borderRadius: 20, alignItems: 'center', shadowColor: '#261A1A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#D2C3C3' },
  cardIconBg: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardIcon: { fontSize: 22 },
  cardTitle: { fontSize: 12, fontWeight: '700', color: '#4E4444' },
  lockedBadge: { position: 'absolute', top: -8, right: -8, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10 },
  badgePlusBg: { backgroundColor: '#8B4E3D' },
  badgeProBg: { backgroundColor: '#261A1A' },
  lockedText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  // Journal
  journalContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 20, marginBottom: 20, shadowColor: '#261A1A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#D2C3C3' },
  journalInput: { minHeight: 90, borderColor: '#D2C3C3', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 12, textAlignVertical: 'top', fontSize: 15, backgroundColor: '#FDFBF7', color: '#1C1C18', lineHeight: 22 },
  saveButton: { backgroundColor: '#261A1A', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  saveButtonText: { color: '#FCF9F3', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  // Search
  searchContainer: { marginBottom: 16 },
  searchInput: { height: 46, borderColor: '#D2C3C3', borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, fontSize: 15, backgroundColor: '#FCF9F3', color: '#1C1C18' },

  // Entries
  entriesList: { paddingBottom: 50 },
  entryCard: { backgroundColor: '#fff', padding: 18, borderRadius: 18, marginBottom: 12, shadowColor: '#261A1A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#D2C3C3' },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  entryDateChip: { backgroundColor: '#F6F3ED', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  entryDate: { fontSize: 11, color: '#4E4444', fontWeight: '700' },
  deleteButton: { backgroundColor: '#FFDAD6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  deleteText: { fontSize: 11, color: '#BA1A1A', fontWeight: '700' },
  entryText: { fontSize: 15, color: '#4E4444', lineHeight: 23 },

  // Empty states
  emptyState: { alignItems: 'center', paddingTop: 32, paddingBottom: 24 },
  emptyIcon: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 16, color: '#4E4444', fontWeight: '700', marginBottom: 4 },
  emptySubtext: { fontSize: 14, color: '#807474', textAlign: 'center' },
  emptySearchText: { textAlign: 'center', color: '#807474', marginTop: 20, fontSize: 15 },
});
