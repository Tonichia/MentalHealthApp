import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  SafeAreaView, TouchableOpacity, Share,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C, F, SHADOW_SM, SHADOW_MD } from './theme';

type StoryDetailRouteProp = RouteProp<RootStackParamList, 'StoryDetail'>;

export const StoryDetailScreen = () => {
  const route = useRoute<StoryDetailRouteProp>();
  const { id, title, author, readTime, content } = route.params;

  const [liked, setLiked] = useState(false);
  const storageKey = `@story_liked_${id}`;

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (saved !== null) setLiked(JSON.parse(saved));
      } catch (e) { console.error(e); }
    };
    load();
  }, [storageKey]);

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    try { await AsyncStorage.setItem(storageKey, JSON.stringify(next)); }
    catch (e) { console.error(e); }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this story on Mind Matter:\n\n"${title}" by ${author}\n\n${content}`,
      });
    } catch (e: any) { console.error(e.message); }
  };

  const initials = author.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Story header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitials}>{initials}</Text>
            </View>
            <View style={styles.metaText}>
              <Text style={styles.authorName}>{author}</Text>
              <Text style={styles.readTime}>{readTime}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.accentBar} />
          <Text style={styles.bodyText}>{content}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, liked && styles.likedBtn]}
              onPress={handleLike}
              activeOpacity={0.85}
            >
              <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
              <Text style={[styles.actionLabel, liked && styles.likedLabel]}>
                {liked ? 'Liked' : 'Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleShare}
              activeOpacity={0.85}
            >
              <Text style={styles.actionIcon}>🔗</Text>
              <Text style={styles.actionLabel}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  container: { flex: 1 },

  header: {
    padding: 24, paddingTop: 28,
    backgroundColor: C.surface,
    borderBottomWidth: 1, borderColor: C.outlineVariant,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
    ...SHADOW_MD,
  },
  title: {
    fontFamily: F.headlineItalic, fontSize: 30,
    color: C.primary, lineHeight: 38, marginBottom: 22,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  authorAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
  },
  authorInitials: { fontFamily: F.extraBold, color: C.background, fontSize: 14 },
  metaText: {},
  authorName: { fontFamily: F.bold, fontSize: 14, color: C.primary, marginBottom: 2 },
  readTime: { fontFamily: F.body, fontSize: 12, color: C.outline },

  content: { padding: 24, paddingBottom: 60 },
  accentBar: {
    width: 44, height: 4, borderRadius: 2,
    backgroundColor: C.secondary, marginBottom: 24,
  },
  bodyText: {
    fontFamily: F.body, fontSize: 17,
    color: C.onSurfaceVariant, lineHeight: 30,
  },

  actions: { flexDirection: 'row', gap: 12, marginTop: 40 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 14,
    borderRadius: 9999, borderWidth: 1.5,
    borderColor: C.outlineVariant, backgroundColor: C.surface,
    gap: 8, ...SHADOW_SM,
  },
  likedBtn: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  actionIcon: { fontSize: 18 },
  actionLabel: { fontFamily: F.bold, fontSize: 15, color: C.onSurfaceVariant },
  likedLabel: { color: '#EF4444' },
});
