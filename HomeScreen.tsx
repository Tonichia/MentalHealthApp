import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, Alert,
  TouchableOpacity, SafeAreaView, Image, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { useSubscription } from './SubscriptionContext';
import { storage } from './storage';
import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';
import { PaperGrainView } from './PaperGrainView';
import { C, F, SHADOW_MD, SHADOW_LG } from './theme';
import { GradientBackground } from './GradientBackground';
import { GlassCard } from './GlassCard';

interface JournalEntry {
  id: string; text: string; created_at: string; user_id: string; pendingSync?: boolean;
}

const AFFIRMATIONS = [
  '"I am growing, learning, and becoming the best version of myself."',
  '"My mind is a place of peace, clarity, and strength."',
  '"I choose healing, hope, and wholeness today."',
  '"I am worthy of rest, joy, and deep connection."',
  '"Every step forward, no matter how small, is progress."',
  '"I honor my feelings and give myself grace."',
  '"I am rooted in purpose and open to growth."',
];

const MOODS = [
  { label: 'Calm',     emoji: '😌' },
  { label: 'Happy',    emoji: '😊' },
  { label: 'Anxious',  emoji: '😰' },
  { label: 'Sad',      emoji: '😢' },
  { label: 'Grateful', emoji: '🙏' },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const getTodaysAffirmation = () => AFFIRMATIONS[new Date().getDay() % AFFIRMATIONS.length];

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { tier }   = useSubscription();
  const isPro  = tier === 'pro';
  const isPlus = tier === 'plus' || tier === 'pro';

  const [entry,         setEntry]         = useState('');
  const [entries,       setEntries]       = useState<JournalEntry[]>([]);
  const [searchQuery,   setSearch]        = useState('');
  const [avatarUrl,     setAvatarUrl]     = useState<string | null>(null);
  const [userName,      setUserName]      = useState('');
  const [isEditingName, setIsEditing]     = useState(false);
  const [tempName,      setTempName]      = useState('');
  const [selectedMood,  setSelectedMood]  = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    const loadEntries = async () => {
      const cached = storage.getString('@offline_journal_entries');
      let local: JournalEntry[] = cached ? JSON.parse(cached) : [];
      if (local.length) setEntries(local);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const pending = local.filter(e => e.pendingSync);
        for (const p of pending) {
          const { data } = await supabase.from('journal_entries')
            .insert([{ text: p.text, user_id: user.id }]).select().single();
          if (data) local = local.map(e => e.id === p.id ? data : e);
        }
        if (pending.length) { setEntries(local); storage.set('@offline_journal_entries', JSON.stringify(local)); }
      }
      const { data } = await supabase.from('journal_entries').select('*').order('created_at', { ascending: false });
      if (data) {
        const stillPending = local.filter(e => e.pendingSync);
        const merged = [...stillPending, ...data].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setEntries(merged);
        storage.set('@offline_journal_entries', JSON.stringify(merged.slice(0, 50)));
      }
    };

    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';
        setUserName(name);
        if (user.user_metadata?.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
      }
    };

    loadEntries();
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!entry.trim()) return;
    if (tier === 'free' && entries.length > 0) {
      const last = new Date(entries[0].created_at).toDateString();
      if (last === new Date().toDateString()) {
        Alert.alert('Daily Limit', 'Upgrade to write unlimited entries.', [
          { text: 'Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Paywall') },
        ]);
        return;
      }
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const temp: JournalEntry = { id: `temp_${Date.now()}`, text: entry, created_at: new Date().toISOString(), user_id: user.id, pendingSync: true };
    const next = [temp, ...entries];
    setEntries(next); setEntry('');
    storage.set('@offline_journal_entries', JSON.stringify(next.slice(0, 50)));
    const { data, error } = await supabase.from('journal_entries').insert([{ text: temp.text, user_id: user.id }]).select().single();
    if (data) {
      const updated = next.map(e => e.id === temp.id ? data : e);
      setEntries(updated);
      storage.set('@offline_journal_entries', JSON.stringify(updated.slice(0, 50)));
    } else if (error) {
      Alert.alert('Saved Offline', 'Entry saved locally and will sync when you reconnect.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Entry', 'Permanently delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const { error } = await supabase.from('journal_entries').delete().eq('id', id);
        if (!error) {
          const next = entries.filter(e => e.id !== id);
          setEntries(next);
          storage.set('@offline_journal_entries', JSON.stringify(next.slice(0, 50)));
        }
      }},
    ]);
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) Alert.alert('Error', error.message);
      }},
    ]);
  };

  const handleAvatarUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.5 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUrl(uri);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const response = await fetch(uri); const blob = await response.blob();
      const ext = uri.split('.').pop() || 'jpeg';
      const { error: uploadError } = await supabase.storage.from('avatars').upload(`${user.id}/${Date.now()}.${ext}`, blob, { contentType: `image/${ext}` });
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(`${user.id}/${Date.now()}.${ext}`);
        await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
        setAvatarUrl(publicUrl);
      }
    }
  };

  const saveName = async () => {
    setIsEditing(false);
    const n = tempName.trim();
    setUserName(n);
    await supabase.auth.updateUser({ data: { name: n } });
  };

  const handleTool = (label: string, tier: 'plus' | 'pro', route?: keyof RootStackParamList) => {
    const has = tier === 'pro' ? isPro : isPlus;
    if (has) { if (route) navigation.navigate(route as any); }
    else navigation.navigate('Paywall');
  };

  const filtered = entries.filter(e => e.text.toLowerCase().includes(searchQuery.toLowerCase()));

  const tierConfig = tier === 'pro'
    ? { label: '🌟 Pro',     bg: C.gold,               color: C.gradientDeep }
    : tier === 'plus'
    ? { label: '✨ Plus',    bg: C.glass,              color: C.textPrimary  }
    : { label: 'Upgrade ↑', bg: 'rgba(0,0,0,0.30)',   color: C.textSecondary };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* ── HEADER ── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleAvatarUpload} activeOpacity={0.8}>
              <View style={styles.avatarRing}>
                <View style={styles.avatar}>
                  {avatarUrl
                    ? <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
                    : <Text style={styles.avatarEmoji}>👤</Text>}
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.greeting}>{getGreeting()}{userName ? ',' : ''}</Text>
              {isEditingName
                ? <TextInput style={styles.nameInput} value={tempName} onChangeText={setTempName}
                    onSubmitEditing={saveName} onBlur={saveName} autoFocus returnKeyType="done"
                    placeholderTextColor={C.textSecondary} />
                : <TouchableOpacity onPress={() => { setTempName(userName); setIsEditing(true); }}>
                    <Text style={styles.userName}>{userName || '(tap to add name)'}</Text>
                  </TouchableOpacity>}
              <Text style={styles.appName}>Mind Matter Wellness</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                style={[styles.tierBadge, { backgroundColor: tierConfig.bg }]}
                onPress={() => tier !== 'pro' && navigation.navigate('Paywall')}
              >
                <Text style={[styles.tierBadgeText, { color: tierConfig.color }]}>{tierConfig.label}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── MOOD CHECK-IN ── */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <GlassCard style={styles.moodCard}>
              <Text style={styles.moodLabel}>HOW ARE YOU FEELING?</Text>
              <View style={styles.moodRow}>
                {MOODS.map(m => (
                  <TouchableOpacity
                    key={m.label}
                    style={[styles.moodBtn, selectedMood === m.label && styles.moodBtnActive]}
                    onPress={() => setSelectedMood(selectedMood === m.label ? null : m.label)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text style={[styles.moodText, selectedMood === m.label && styles.moodTextActive]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>
          </Animated.View>

          {/* ── AFFIRMATION ── */}
          <GlassCard variant="gold" style={styles.affirmCard}>
            <Text style={styles.affirmEyebrow}>DAILY AFFIRMATION</Text>
            <Text style={styles.affirmText}>{getTodaysAffirmation()}</Text>
          </GlassCard>

          {/* ── YOUR TOOLS ── */}
          <Text style={styles.sectionLabel}>YOUR TOOLS</Text>
          <View style={styles.toolGrid}>
            {[
              { icon: '📚', label: 'Stories',  accent: C.sage,     route: 'Stories' as keyof RootStackParamList, req: 'plus' as const,  locked: false },
              { icon: '🤝', label: 'Connect',  accent: C.mist,     route: 'Connections' as keyof RootStackParamList, req: 'plus' as const, locked: !isPlus },
              { icon: '🗺️', label: 'Plans',    accent: C.gold,     route: 'Plans' as keyof RootStackParamList,       req: 'pro' as const,  locked: !isPro  },
            ].map(tool => (
              <TouchableOpacity
                key={tool.label}
                style={styles.toolCard}
                onPress={() => handleTool(tool.label, tool.req, tool.route)}
                activeOpacity={0.85}
              >
                <View style={[styles.toolAccent, { backgroundColor: tool.accent }]} />
                <View style={[styles.toolIconBg, { backgroundColor: tool.accent + '25' }]}>
                  <Text style={styles.toolIcon}>{tool.icon}</Text>
                </View>
                <Text style={styles.toolLabel}>{tool.label}</Text>
                {tool.locked && (
                  <View style={[styles.lockPill, { backgroundColor: tool.accent + '30', borderColor: tool.accent + '50' }]}>
                    <Text style={[styles.lockText, { color: tool.accent }]}>{tool.req.toUpperCase()}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* ── JOURNAL ── */}
          <Text style={styles.sectionLabel}>QUICK JOURNAL</Text>
          <GlassCard style={styles.journalCard}>
            <TextInput
              style={styles.journalInput}
              placeholder="How are you feeling today?"
              placeholderTextColor={C.textTertiary}
              multiline value={entry} onChangeText={setEntry}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.saveBtn, !entry.trim() && styles.saveBtnOff]}
              onPress={handleSave} disabled={!entry.trim()}
            >
              <Text style={[styles.saveBtnText, !entry.trim() && styles.saveBtnTextOff]}>
                Save Entry
              </Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Search */}
          {entries.length > 0 && (
            <View style={styles.searchRow}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search your journal..."
                value={searchQuery} onChangeText={setSearch}
                placeholderTextColor={C.textTertiary}
              />
            </View>
          )}

          {/* Entries */}
          <View style={styles.entriesList}>
            {filtered.map(e => (
              <GlassCard key={e.id} style={styles.entryCard}>
                <View style={styles.entryMeta}>
                  <View style={styles.datePill}>
                    <Text style={styles.datePillText}>{formatDate(e.created_at)}{e.pendingSync ? '  ⏳' : ''}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(e.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.entryText}>{e.text}</Text>
              </GlassCard>
            ))}

            {entries.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyTitle}>No entries yet</Text>
                <Text style={styles.emptySub}>Start by writing how you feel today.</Text>
              </View>
            )}
            {entries.length > 0 && filtered.length === 0 && (
              <Text style={styles.emptySearch}>No entries match your search.</Text>
            )}
          </View>

          <View style={{ height: 48 }} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, gap: 14 },
  avatarRing: { width: 60, height: 60, borderRadius: 30, borderWidth: 1.5, borderColor: C.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.glass, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImg: { width: 52, height: 52, borderRadius: 26 },
  avatarEmoji: { fontSize: 22 },
  headerText: { flex: 1 },
  greeting: { fontSize: 11, color: C.textSecondary, letterSpacing: 1.5, fontFamily: F.medium, textTransform: 'uppercase' },
  userName: { fontSize: 20, color: C.textPrimary, fontFamily: F.headlineItalic, marginTop: 2, marginBottom: 4 },
  nameInput: { fontSize: 20, color: C.textPrimary, fontFamily: F.headlineItalic, borderBottomWidth: 1.5, borderColor: C.gold, paddingVertical: 2, marginTop: 2 },
  appName: { fontSize: 10, color: C.gold, letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: F.extraBold },
  headerRight: { alignItems: 'flex-end', gap: 8 },
  tierBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder },
  tierBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, fontFamily: F.bold },
  signOutText: { fontSize: 11, color: C.textTertiary, fontFamily: F.medium },

  // Mood
  moodCard: { marginHorizontal: 16, marginBottom: 14 },
  moodLabel: { fontFamily: F.extraBold, fontSize: 10, color: C.textSecondary, letterSpacing: 2.5, marginBottom: 16 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 6, borderRadius: 14, flex: 1 },
  moodBtnActive: { backgroundColor: C.glassBorder },
  moodEmoji: { fontSize: 22, marginBottom: 5 },
  moodText: { fontFamily: F.medium, fontSize: 10, color: C.textSecondary, textAlign: 'center' },
  moodTextActive: { color: C.textPrimary },

  // Affirmation
  affirmCard: { marginHorizontal: 16, marginBottom: 14 },
  affirmEyebrow: { fontFamily: F.extraBold, fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 10 },
  affirmText: { fontFamily: F.headlineItalic, fontSize: 16, color: C.textPrimary, lineHeight: 24, fontStyle: 'italic' },

  // Section labels
  sectionLabel: { fontFamily: F.extraBold, fontSize: 10, color: C.textSecondary, letterSpacing: 2.5, marginHorizontal: 20, marginTop: 24, marginBottom: 12 },

  // Tools
  toolGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 4 },
  toolCard: { flex: 1, backgroundColor: C.glass, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, alignItems: 'center', paddingVertical: 18, overflow: 'hidden', ...SHADOW_MD },
  toolAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  toolIconBg: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 4 },
  toolIcon: { fontSize: 24 },
  toolLabel: { fontFamily: F.semibold, fontSize: 12, color: C.textPrimary },
  lockPill: { marginTop: 7, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1 },
  lockText: { fontFamily: F.extraBold, fontSize: 8, letterSpacing: 1.5 },

  // Journal
  journalCard: { marginHorizontal: 16 },
  journalInput: { fontFamily: F.body, fontSize: 15, color: C.textPrimary, minHeight: 90, lineHeight: 24, marginBottom: 12 },
  saveBtn: { backgroundColor: C.textPrimary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  saveBtnOff: { backgroundColor: 'rgba(255,255,255,0.12)' },
  saveBtnText: { fontFamily: F.bold, fontSize: 14, color: C.gradientDeep, letterSpacing: 0.5 },
  saveBtnTextOff: { color: C.textTertiary },

  // Search
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginTop: 14, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: C.glassBorder },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontFamily: F.body, fontSize: 13, color: C.textPrimary },

  // Entries
  entriesList: { paddingHorizontal: 16, marginTop: 14, gap: 12 },
  entryCard: { padding: 16 },
  entryMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  datePill: { backgroundColor: C.goldFaint, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  datePillText: { fontFamily: F.semibold, fontSize: 11, color: C.gold },
  deleteText: { fontFamily: F.medium, fontSize: 11, color: C.textTertiary },
  entryText: { fontFamily: F.body, fontSize: 14, color: C.textSecondary, lineHeight: 22, fontStyle: 'italic' },

  // Empty
  empty: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontFamily: F.headline, fontSize: 16, color: C.textPrimary },
  emptySub: { fontFamily: F.body, fontSize: 13, color: C.textSecondary, fontStyle: 'italic' },
  emptySearch: { textAlign: 'center', fontFamily: F.body, fontSize: 13, color: C.textTertiary, fontStyle: 'italic', paddingVertical: 24 },
});
