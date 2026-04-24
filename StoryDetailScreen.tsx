import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Share } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StoryDetailRouteProp = RouteProp<RootStackParamList, 'StoryDetail'>;

export const StoryDetailScreen = () => {
  const route = useRoute<StoryDetailRouteProp>();
  const { id, title, author, readTime, content } = route.params;

  const [liked, setLiked] = useState(false);
  const storageKey = `@story_liked_${id}`;

  useEffect(() => {
    const loadLikeStatus = async () => {
      try {
        const savedStatus = await AsyncStorage.getItem(storageKey);
        if (savedStatus !== null) setLiked(JSON.parse(savedStatus));
      } catch (e) {
        console.error('Failed to load like status', e);
      }
    };
    loadLikeStatus();
  }, [storageKey]);

  const handleLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newLikedState));
    } catch (e) {
      console.error('Failed to save like status', e);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this story on Mind Matter:\n\n"${title}" by ${author}\n\n${content}`,
      });
    } catch (error: any) {
      console.error('Error sharing story:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.authorChip}>
              <Text style={styles.authorInitials}>
                {author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <View>
              <Text style={styles.authorName}>{author}</Text>
              <Text style={styles.readTime}>{readTime}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.accentBar} />
          <Text style={styles.content}>{content}</Text>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, liked && styles.likeButtonActive]}
              onPress={handleLike}
            >
              <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
              <Text style={[styles.actionText, liked && styles.likeTextActive]}>
                {liked ? 'Liked' : 'Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Text style={styles.actionIcon}>🔗</Text>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },

  header: {
    padding: 24,
    paddingTop: 28,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 18, letterSpacing: -0.5, lineHeight: 34 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  authorChip: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  authorInitials: { color: '#F8FAFC', fontSize: 13, fontWeight: '800' },
  authorName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  readTime: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },

  contentContainer: { padding: 24, paddingBottom: 50 },
  accentBar: { width: 44, height: 4, backgroundColor: '#F59E0B', borderRadius: 2, marginBottom: 20 },
  content: { fontSize: 17, color: '#334155', lineHeight: 28 },

  actionsContainer: { flexDirection: 'row', gap: 12, marginTop: 36 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
    gap: 8,
  },
  likeButtonActive: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  actionIcon: { fontSize: 18 },
  actionText: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  likeTextActive: { color: '#EF4444' },
});
