import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

const stories = [
  {
    id: 1,
    title: 'Finding Light in the Dark',
    author: 'Sarah M.',
    readTime: '3 min read',
    tag: 'Resilience',
    tagColor: '#6366F1',
    excerpt: 'When everything felt overwhelming, I took one small step...',
    content: "When everything felt overwhelming, I took one small step. I started by simply acknowledging my feelings without judgment. It wasn't easy at first, but gradually, the weight began to lift. I found light in the small things: a warm cup of tea, a brief walk outside, a kind word from a friend.\n\nNow, I realize that the dark days were necessary for me to appreciate the light. Healing is not linear, but every step forward is a victory.",
  },
  {
    id: 2,
    title: 'My Journey to Self-Love',
    author: 'David K.',
    readTime: '5 min read',
    tag: 'Self-Love',
    tagColor: '#EC4899',
    excerpt: 'I used to be my own worst critic. Here is how I changed the narrative...',
    content: "I used to be my own worst critic. Here is how I changed the narrative. I began practicing daily affirmations, speaking to myself as I would to a loved one. Whenever a negative thought arose, I challenged it with a positive counter-thought.\n\nOver time, this practice transformed my mindset. I learned to forgive my mistakes and celebrate my progress. Self-love is an ongoing journey, but it's the most rewarding one I've ever taken.",
  },
  {
    id: 3,
    title: 'Embracing the Quiet',
    author: 'Elena R.',
    readTime: '4 min read',
    tag: 'Mindfulness',
    tagColor: '#10B981',
    excerpt: 'In a noisy world, finding peace in silence became my superpower...',
    content: "In a noisy world, finding peace in silence became my superpower. I started dedicating just ten minutes a day to sit in complete silence, focusing solely on my breath. Initially, my mind raced with to-do lists and worries, but eventually, it learned to settle.\n\nThis quiet time became my sanctuary, a place to recharge and reconnect with myself. It taught me that sometimes, the most productive thing you can do is absolutely nothing.",
  },
];

type StoriesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stories'>;

export const StoriesScreen = () => {
  const navigation = useNavigation<StoriesScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Positive Stories</Text>
        <Text style={styles.headerSubtitle}>Real stories of growth, healing, and resilience.</Text>

        <View style={styles.listContainer}>
          {stories.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.card}
              onPress={() => navigation.navigate('StoryDetail', {
                id: story.id,
                title: story.title,
                author: story.author,
                readTime: story.readTime,
                content: story.content,
              })}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.tag, { backgroundColor: story.tagColor + '18' }]}>
                  <Text style={[styles.tagText, { color: story.tagColor }]}>{story.tag}</Text>
                </View>
                <Text style={styles.readTime}>{story.readTime}</Text>
              </View>
              <Text style={styles.cardTitle}>{story.title}</Text>
              <Text style={styles.cardAuthor}>By {story.author}</Text>
              <Text style={styles.cardExcerpt}>"{story.excerpt}"</Text>
              <View style={styles.readMoreRow}>
                <Text style={styles.readMoreText}>Read full story</Text>
                <Text style={styles.readMoreArrow}> →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 4, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 15, color: '#64748B', marginBottom: 24 },
  listContainer: { gap: 16, paddingBottom: 30 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  readTime: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 4, letterSpacing: -0.3 },
  cardAuthor: { fontSize: 13, color: '#94A3B8', marginBottom: 12, fontWeight: '500' },
  cardExcerpt: { fontSize: 15, color: '#475569', lineHeight: 23, marginBottom: 16, fontStyle: 'italic' },
  readMoreRow: { flexDirection: 'row', alignItems: 'center' },
  readMoreText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  readMoreArrow: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
});
