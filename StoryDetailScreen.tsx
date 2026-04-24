import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Share, Animated } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { storage } from './storage';
import { PaperGrainView } from './PaperGrainView';

type StoryDetailRouteProp = RouteProp<RootStackParamList, 'StoryDetail'>;

export const StoryDetailScreen = () => {
  const route = useRoute<StoryDetailRouteProp>();
  const { id, title, author, readTime, content } = route.params;

  const [liked, setLiked] = useState(false);
  const storageKey = `@story_liked_${id}`;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const loadLikeStatus = async () => {
      try {
        const savedStatus = storage.getString(storageKey);
        if (savedStatus !== null) setLiked(JSON.parse(savedStatus));
      } catch (e) {
        console.error('Failed to load like status', e);
      }
    };
    loadLikeStatus();

    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(headerTranslateY, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 150, useNativeDriver: true }),
      Animated.spring(contentTranslateY, { toValue: 0, friction: 8, tension: 40, delay: 150, useNativeDriver: true }),
    ]).start();
  }, [storageKey]);

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    try {
      storage.set(storageKey, JSON.stringify(newLikedState));
    } catch (e) {
      console.error('Failed to save like status', e);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this story on Mind Matter Wellness:\n\n"${title}" by ${author}\n\n${content}`,
      });
    } catch (error: any) {
      console.error('Error sharing story:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }}>
        <PaperGrainView style={styles.header} intensity={0.04}>
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
        </PaperGrainView>
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.contentContainer, { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }]}>
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
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF9F3' },
  container: { flex: 1 },

  header: {
    padding: 24,
    paddingTop: 28,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#261A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#D2C3C3',
  },
  title: { fontSize: 26, fontWeight: '600', fontFamily: 'serif', color: '#261A1A', marginBottom: 18, letterSpacing: -0.5, lineHeight: 34 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  authorChip: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#261A1A', alignItems: 'center', justifyContent: 'center' },
  authorInitials: { color: '#FCF9F3', fontSize: 13, fontWeight: '800' },
  authorName: { fontSize: 14, fontWeight: '700', color: '#261A1A', marginBottom: 2 },
  readTime: { fontSize: 12, color: '#807474', fontWeight: '500' },

  contentContainer: { padding: 24, paddingBottom: 50 },
  accentBar: { width: 44, height: 4, backgroundColor: '#8B4E3D', borderRadius: 2, marginBottom: 20 },
  content: { fontSize: 17, color: '#4E4444', lineHeight: 28 },

  actionsContainer: { flexDirection: 'row', gap: 12, marginTop: 36 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D2C3C3',
    backgroundColor: '#fff',
    gap: 8,
  },
  likeButtonActive: { backgroundColor: '#FFDAD6', borderColor: '#FFB5A1' },
  actionIcon: { fontSize: 18 },
  actionText: { fontSize: 15, fontWeight: '700', color: '#807474' },
  likeTextActive: { color: '#BA1A1A' },
});
