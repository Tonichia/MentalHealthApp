import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView,
  Alert, TouchableOpacity, SafeAreaView, Image, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { useSubscription } from './SubscriptionContext';
import { storage } from './storage';
import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';
import { PaperGrainView } from './PaperGrainView';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  teal: '#2C4A3E',
  tealLight: '#3D6357',
  tealFaint: '#A8C5B5',
  gold: '#C8931A',
  goldLight: '#E6B84A',
  goldFaint: '#F5E6C0',
  cream: '#F7F3EC',
  creamDeep: '#EDE8DE',
  creamBorder: '#D9D0C0',
  parchment: '#FCF9F3',
  brown: '#8B4E3D',
  brownFaint: '#F3DEDD',
  sage: '#DEE5CF',
  coral: '#FFDBD1',
  text: '#2C2420',
  textMid: '#5C5248',
  textMuted: '#94A3B8',
  white: '#FFFFFF',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

const AFFIRMATIONS = [
  '"I am growing, learning, and becoming the best version of myself."',
  '"My mind is a place of peace, clarity, and strength."',
  '"I choose healing, hope, and wholeness today."',
  '"I am worthy of rest, joy, and deep connection."',
  '"Every step forward, no matter how small, is progress."',
  '"I honor my feelings and give myself grace."',
  '"I am rooted in purpose and open to growth."',
];

const getTodaysAffirmation = () => {
  const dayIndex = new Date().getDay();
  return AFFIRMATIONS[dayIndex % AFFIRMATIONS.length];
};

// ─── Component ────────────────────────────────────────────────────────────────
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
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    const loadEntries = async () => {
      const cachedEntries = storage.getString('@offline_journal_entries');
      let localEntries: JournalEntry[] = cachedEntries ? JSON.parse(cachedEntries) : [];
      if (localEntries.length > 0) setEntries(localEntries);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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
        const stillPending = localEntries.filter(e => e.pendingSync);
        const merged = [...stillPending, ...data].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setEntries(merged);
        storage.set('@offline_journal_entries', JSON.stringify(merged.slice(0, 50)));
      } else if (error) {
        console.error('Failed to load entries', error);
      }
    };

    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] || '';
        setUserName(displayName);
        if (user.user_metadata?.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
      }
    };

    loadEntries();
    loadProfile();
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!entry.trim()) return;

    if (tier === 'free' && entries.length > 0) {
      const lastEntryDate = new Date(entries[0].created_at).toDateString();
      const today = new Date().toDateString();
      if (lastEntryDate === today) {
        Alert.alert(
          'Daily Limit Reached',
          'Free users can write 1 entry per day. Upgrade to Plus or Pro for unlimited journaling!',
          [
            { text: 'Maybe Later', style: 'cancel' },
            { text: 'Upgrade Now', onPress: () => navigation.navigate('Paywall') },
          ]
        );
        return;
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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

    const { data, error } = await supabase
      .from('journal_entries')
      .insert([{ text: tempEntry.text, user_id: user.id }])
      .select()
      .single();

    if (data) {
      const updatedEntries = newEntries.map(e => e.id === tempEntry.id ? data : e);
      setEntries(updatedEntries);
      storage.set('@offline_journal_entries', JSON.stringify(updatedEntries.slice(0, 50)));
    } else if (error) {
      Alert.alert('Saved Offline', 'Entry saved locally. It will sync when you reconnect.');
    }
  };

  const handleDelete = (idToDelete: string) => {
    Alert.alert('Delete Entry', 'Permanently delete this journal entry?', [
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
            Alert.alert('Network Error', 'Unable to delete while offline. Please try again.');
          }
        },
      },
    ]);
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) Alert.alert('Error signing out', error.message);
        },
      },
    ]);
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

  const handlePremiumFeature = (
    featureName: string,
    requiredTier: 'plus' | 'pro',
    routeName?: keyof RootStackParamList
  ) => {
    const hasAccess = requiredTier === 'pro' ? isPro : isPlus;
    if (hasAccess) {
      if (routeName) navigation.navigate(routeName as any);
      else Alert.alert(featureName, `${featureName} is coming soon!`);
    } else {
      navigation.navigate('Paywall');
    }
  };

  const filteredEntries = entries.filter((e) =>
    (e.text || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Tier badge config ───────────────────────────────────────────────────────
  const tierConfig = {
    pro: { label: '🌟 Pro', bg: COLORS.gold, text: COLORS.teal },
    plus: { label: '✨ Plus', bg: COLORS.teal, text: COLORS.cream },
    free: { label: 'Upgrade ↑', bg: COLORS.creamDeep, text: COLORS.teal },
  }[tier] ?? { label: 'Upgrade ↑', bg: COLORS.creamDeep, text: COLORS.teal };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerInner}>
            {/* Avatar */}
            <TouchableOpacity onPress={handleAvatarUpload} activeOpacity={0.8}>
              <View style={styles.avatarRing}>
                <View style={styles.avatar}>
                  {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarEmoji}>👤</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>

            {/* Greeting + name */}
            <View style={styles.headerText}>
              <Text style={styles.headerEyebrow}>{getGreeting()}{userName ? ',' : ''}</Text>

              {isEditingName ? (
                <TextInput
                  style={styles.nameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  onSubmitEditing={saveName}
                  onBlur={saveName}
                  autoFocus
                  returnKeyType="done"
                  placeholderTextColor={COLORS.tealFaint}
                />
              ) : (
                <TouchableOpacity onPress={() => { setTempName(userName); setIsEditingName(true); }}>
                  <Text style={styles.headerName}>
                    {userName || '(tap to add name)'}
                  </Text>
                </TouchableOpacity>
              )}

              <Text style={styles.headerAppName}>Mind Matter Wellness</Text>
            </View>

            {/* Tier badge + sign out */}
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={[styles.tierBadge, { backgroundColor: tierConfig.bg }]}
                onPress={() => tier !== 'pro' && navigation.navigate('Paywall')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tierBadgeText, { color: tierConfig.text }]}>{tierConfig.label}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── AFFIRMATION CARD ── */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <PaperGrainView style={styles.affirmationCard} intensity={0.05}>
            <View style={styles.affirmationAccentBar} />
            <View style={styles.affirmationContent}>
              <Text style={styles.affirmationLabel}>DAILY AFFIRMATION</Text>
              <Text style={styles.affirmationText}>{getTodaysAffirmation()}</Text>
            </View>
          </PaperGrainView>
        </Animated.View>

        {/* ── YOUR TOOLS ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>YOUR TOOLS</Text>
          <View style={styles.sectionRule} />
        </View>

        <View style={styles.toolGrid}>
          {/* Stories */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('Stories')}
            activeOpacity={0.85}
          >
            <View style={[styles.toolAccentBar, { backgroundColor: COLORS.gold }]} />
            <View style={[styles.toolIconBg, { backgroundColor: COLORS.brownFaint }]}>
              <Text style={styles.toolIcon}>📚</Text>
            </View>
            <Text style={styles.toolLabel}>Stories</Text>
          </TouchableOpacity>

          {/* Connect */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => handlePremiumFeature('Healthy Connections', 'plus', 'Connections')}
            activeOpacity={0.85}
          >
            <View style={[styles.toolAccentBar, { backgroundColor: COLORS.teal }]} />
            <View style={[styles.toolIconBg, { backgroundColor: COLORS.sage }]}>
              <Text style={styles.toolIcon}>🤝</Text>
            </View>
            <Text style={styles.toolLabel}>Connect</Text>
            {!isPlus && (
              <View style={[styles.lockPill, { backgroundColor: COLORS.teal }]}>
                <Text style={styles.lockPillText}>PLUS</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Plans */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => handlePremiumFeature('Self-Help Plans', 'pro', 'Plans')}
            activeOpacity={0.85}
          >
            <View style={[styles.toolAccentBar, { backgroundColor: COLORS.brown }]} />
            <View style={[styles.toolIconBg, { backgroundColor: COLORS.coral }]}>
              <Text style={styles.toolIcon}>🗺️</Text>
            </View>
            <Text style={styles.toolLabel}>Plans</Text>
            {!isPro && (
              <View style={[styles.lockPill, { backgroundColor: COLORS.gold }]}>
                <Text style={[styles.lockPillText, { color: COLORS.teal }]}>PRO</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── JOURNAL ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>QUICK JOURNAL</Text>
          <View style={styles.sectionRule} />
        </View>

        <View style={styles.journalCard}>
          <TextInput
            style={styles.journalInput}
            placeholder="How are you feeling today?"
            placeholderTextColor={COLORS.textMuted}
            multiline
            value={entry}
            onChangeText={setEntry}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.saveBtn, !entry.trim() && styles.saveBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={!entry.trim()}
          >
            <Text style={styles.saveBtnText}>Save Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        {entries.length > 0 && (
          <View style={styles.searchRow}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search your journal..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        )}

        {/* Entry list */}
        <View style={styles.entriesList}>
          {filteredEntries.map((e, idx) => (
            <Animated.View key={e.id} style={styles.entryCard}>
              <View style={styles.entryAccent} />
              <View style={styles.entryBody}>
                <View style={styles.entryMeta}>
                  <View style={styles.datePill}>
                    <Text style={styles.datePillText}>
                      {formatDate(e.created_at)}{e.pendingSync ? '  ⏳' : ''}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(e.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.entryText}>{e.text}</Text>
              </View>
            </Animated.View>
          ))}

          {entries.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>No entries yet</Text>
              <Text style={styles.emptySubtext}>Start by writing how you feel today.</Text>
            </View>
          )}

          {entries.length > 0 && filteredEntries.length === 0 && (
            <Text style={styles.emptySearch}>No entries match your search.</Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.parchment,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // ── Header ──
  header: {
    backgroundColor: COLORS.teal,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  headerEyebrow: {
    fontSize: 11,
    color: COLORS.tealFaint,
    letterSpacing: 1.5,
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
  },
  headerName: {
    fontSize: 20,
    color: COLORS.cream,
    fontFamily: 'Georgia',
    fontWeight: '700',
    marginTop: 2,
  },
  nameInput: {
    fontSize: 20,
    color: COLORS.cream,
    fontFamily: 'Georgia',
    fontWeight: '700',
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.gold,
    paddingVertical: 2,
    marginTop: 2,
    minWidth: 120,
  },
  headerAppName: {
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginTop: 4,
    fontFamily: 'Georgia',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signOutBtn: {
    paddingVertical: 4,
  },
  signOutText: {
    fontSize: 11,
    color: COLORS.tealFaint,
    letterSpacing: 0.5,
  },

  // ── Affirmation ──
  affirmationCard: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 4,
    borderRadius: 16,
    backgroundColor: COLORS.teal,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 96,
  },
  affirmationAccentBar: {
    width: 4,
    backgroundColor: COLORS.gold,
  },
  affirmationContent: {
    flex: 1,
    padding: 18,
  },
  affirmationLabel: {
    fontSize: 9,
    color: COLORS.gold,
    letterSpacing: 3,
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  affirmationText: {
    fontSize: 14,
    color: COLORS.cream,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // ── Section headers ──
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 10,
    color: COLORS.teal,
    letterSpacing: 3,
    fontFamily: 'Georgia',
    fontWeight: '700',
  },
  sectionRule: {
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.5,
  },

  // ── Tool grid ──
  toolGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  toolCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    overflow: 'hidden',
    shadowColor: COLORS.teal,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  toolAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  toolIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  toolIcon: {
    fontSize: 24,
  },
  toolLabel: {
    fontSize: 12,
    color: COLORS.teal,
    fontFamily: 'Georgia',
    fontWeight: '600',
  },
  lockPill: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  lockPillText: {
    fontSize: 8,
    color: COLORS.cream,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  // ── Journal ──
  journalCard: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.teal,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
  },
  journalInput: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    lineHeight: 22,
    minHeight: 90,
    paddingBottom: 12,
  },
  saveBtn: {
    backgroundColor: COLORS.teal,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnDisabled: {
    backgroundColor: COLORS.creamDeep,
  },
  saveBtnText: {
    fontSize: 14,
    color: COLORS.cream,
    fontFamily: 'Georgia',
    letterSpacing: 1,
    fontWeight: '600',
  },

  // ── Search ──
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: COLORS.creamDeep,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    gap: 8,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
  },

  // ── Entries ──
  entriesList: {
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  entryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.creamDeep,
    shadowColor: COLORS.teal,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  entryAccent: {
    width: 3,
    backgroundColor: COLORS.gold,
  },
  entryBody: {
    flex: 1,
    padding: 14,
  },
  entryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePill: {
    backgroundColor: COLORS.brownFaint,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  datePillText: {
    fontSize: 10,
    color: COLORS.brown,
    fontFamily: 'Georgia',
    fontWeight: '600',
  },
  deleteText: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  entryText: {
    fontSize: 13,
    color: COLORS.textMid,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // ── Empty states ──
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    color: COLORS.teal,
    fontFamily: 'Georgia',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
  },
  emptySearch: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    paddingVertical: 24,
  },
});
