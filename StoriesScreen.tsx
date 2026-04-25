import React from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { C, F, SHADOW_SM, SHADOW_MD } from './theme';

const stories = [
  {
    id: 1, title: 'Finding Light in the Dark',
    author: 'Sarah M.', readTime: '3 min read',
    tag: 'Resilience', tagColor: C.secondary,
    excerpt: 'When everything felt overwhelming, I took one small step...',
    content: "When everything felt overwhelming, I took one small step. I started by simply acknowledging my feelings without judgment. It wasn't easy at first, but gradually, the weight began to lift. I found light in the small things: a warm cup of tea, a brief walk outside, a kind word from a friend.\n\nNow, I realize that the dark days were necessary for me to appreciate the light. Healing is not linear, but every step forward is a victory.",
  },
  {
    id: 2, title: 'My Journey to Self-Love',
    author: 'David K.', readTime: '5 min read',
    tag: 'Self-Love', tagColor: C.primary,
    excerpt: 'I used to be my own worst critic. Here is how I changed the narrative...',
    content: "I used to be my own worst critic. Here is how I changed the narrative. I began practicing daily affirmations, speaking to myself as I would to a loved one. Whenever a negative thought arose, I challenged it with a positive counter-thought.\n\nOver time, this practice transformed my mindset. I learned to forgive my mistakes and celebrate my progress. Self-love is an ongoing journey, but it's the most rewarding one I've ever taken.",
  },
  {
    id: 3, title: 'Embracing the Quiet',
    author: 'Elena R.', readTime: '4 min read',
    tag: 'Mindfulness', tagColor: C.sageDark,
    excerpt: 'In a noisy world, finding peace in silence became my superpower...',
    content: "In a noisy world, finding peace in silence became my superpower. I started dedicating just ten minutes a day to sit in complete silence, focusing solely on my breath. Initially, my mind raced with to-do lists and worries, but eventually, it learned to settle.\n\nThis quiet time became my sanctuary, a place to recharge and reconnect with myself. It taught me that sometimes, the most productive thing you can do is absolutely nothing.",
  },
];

type Nav = NativeStackNavigationProp<RootStackParamList, 'Stories'>;

export const StoriesScreen = () => {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Positive Stories</Text>
          <Text style={styles.pageSubtitle}>Real stories of growth, healing, and resilience.</Text>
        </View>

        <View style={styles.list}>
          {stories.map((story, index) => (
            <TouchableOpacity
              key={story.id}
              style={styles.card}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('StoryDetail', {
                id: story.id,
                title: story.title,
                author: story.author,
                readTime: story.readTime,
                content: story.content,
              })}
            >
              {/* Top accent bar tied to tag color */}
              <View style={[styles.cardAccentTop, { backgroundColor: story.tagColor }]} />

              <View style={styles.cardBody}>
                {/* Meta row */}
                <View style={styles.metaRow}>
                  <View style={[styles.tagPill, { backgroundColor: story.tagColor + '18' }]}>
                    <Text style={[styles.tagText, { color: story.tagColor }]}>{story.tag}</Text>
                  </View>
                  <Text style={styles.readTime}>{story.readTime}</Text>
                </View>

                {/* Story number watermark */}
                <Text style={styles.storyNum}>{String(index + 1).padStart(2, '0')}</Text>

                {/* Title */}
                <Text style={styles.cardTitle}>{story.title}</Text>

                {/* Author */}
                <View style={styles.authorRow}>
                  <View style={[styles.authorDot, { backgroundColor: story.tagColor }]} />
                  <Text style={styles.authorText}>By {story.author}</Text>
                </View>

                {/* Excerpt */}
                <Text style={styles.excerpt}>"{story.excerpt}"</Text>

                {/* Read more */}
                <View style={styles.readMoreRow}>
                  <Text style={[styles.readMoreText, { color: story.tagColor }]}>Read full story</Text>
                  <Text style={[styles.readMoreArrow, { color: story.tagColor }]}> →</Text>
                </View>
              </View>
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

  list: { gap: 16, paddingBottom: 30 },

  card: {
    backgroundColor: C.surface, borderRadius: 24,
    borderWidth: 1, borderColor: C.outlineVariant,
    overflow: 'hidden', ...SHADOW_SM,
  },
  cardAccentTop: { height: 3, width: '100%' },
  cardBody: { padding: 22 },

  metaRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  tagPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 9999 },
  tagText: { fontFamily: F.bold, fontSize: 11, letterSpacing: 0.3 },
  readTime: { fontFamily: F.medium, fontSize: 12, color: C.outline },

  storyNum: {
    fontFamily: F.extraBold, fontSize: 48,
    color: C.outlineVariant, position: 'absolute',
    top: 16, right: 22, lineHeight: 52,
  },

  cardTitle: {
    fontFamily: F.headlineItalic, fontSize: 22,
    color: C.primary, lineHeight: 30, marginBottom: 12,
    paddingRight: 40,
  },

  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  authorDot: { width: 6, height: 6, borderRadius: 3 },
  authorText: { fontFamily: F.medium, fontSize: 13, color: C.outline },

  excerpt: {
    fontFamily: F.body, fontSize: 15, color: C.onSurfaceVariant,
    lineHeight: 24, fontStyle: 'italic', marginBottom: 18,
  },

  readMoreRow: { flexDirection: 'row', alignItems: 'center' },
  readMoreText: { fontFamily: F.bold, fontSize: 14 },
  readMoreArrow: { fontFamily: F.bold, fontSize: 14 },
});
