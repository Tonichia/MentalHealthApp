import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { C, F, SHADOW_SM } from './theme';
import { GradientBackground } from './GradientBackground';
import { GlassCard } from './GlassCard';

const stories = [
  { id: 1, title: 'Finding Light in the Dark',   author: 'Sarah M.', readTime: '3 min', tag: 'Resilience', accent: C.sage,     excerpt: 'When everything felt overwhelming, I took one small step...', content: "When everything felt overwhelming, I took one small step. I started by simply acknowledging my feelings without judgment. It wasn't easy at first, but gradually, the weight began to lift.\n\nNow, I realize that the dark days were necessary for me to appreciate the light. Healing is not linear, but every step forward is a victory." },
  { id: 2, title: 'My Journey to Self-Love',     author: 'David K.', readTime: '5 min', tag: 'Self-Love',  accent: C.gold,     excerpt: 'I used to be my own worst critic. Here is how I changed...', content: "I used to be my own worst critic. I began practicing daily affirmations, speaking to myself as I would to a loved one.\n\nOver time, this practice transformed my mindset. Self-love is an ongoing journey, but it's the most rewarding one I've ever taken." },
  { id: 3, title: 'Embracing the Quiet',        author: 'Elena R.', readTime: '4 min', tag: 'Mindfulness',accent: C.mist,     excerpt: 'In a noisy world, finding peace in silence became my superpower...', content: "In a noisy world, finding peace in silence became my superpower. I started dedicating ten minutes a day to sit in complete silence.\n\nThis quiet time became my sanctuary, a place to recharge and reconnect with myself." },
];

type Nav = NativeStackNavigationProp<RootStackParamList, 'Stories'>;

export const StoriesScreen = () => {
  const navigation = useNavigation<Nav>();
  return (
    <GradientBackground>
      <SafeAreaView style={s.safe}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={s.header}>
            <Text style={s.title}>Positive Stories</Text>
            <Text style={s.subtitle}>Real stories of growth, healing, and resilience.</Text>
          </View>
          <View style={s.list}>
            {stories.map((story, i) => (
              <TouchableOpacity key={story.id} activeOpacity={0.88}
                onPress={() => navigation.navigate('StoryDetail', { id: story.id, title: story.title, author: story.author, readTime: story.readTime, content: story.content })}>
                <GlassCard style={s.card}>
                  <View style={[s.cardTop, { backgroundColor: story.accent }]} />
                  <Text style={s.storyNum}>{String(i + 1).padStart(2, '0')}</Text>
                  <View style={s.tagRow}>
                    <View style={[s.tag, { backgroundColor: story.accent + '25', borderColor: story.accent + '50' }]}>
                      <Text style={[s.tagText, { color: story.accent }]}>{story.tag}</Text>
                    </View>
                    <Text style={s.readTime}>{story.readTime} read</Text>
                  </View>
                  <Text style={s.cardTitle}>{story.title}</Text>
                  <View style={s.authorRow}>
                    <View style={[s.authorDot, { backgroundColor: story.accent }]} />
                    <Text style={s.author}>By {story.author}</Text>
                  </View>
                  <Text style={s.excerpt}>"{story.excerpt}"</Text>
                  <View style={s.readMore}>
                    <Text style={[s.readMoreText, { color: story.accent }]}>Read full story →</Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  header: { paddingTop: 8, paddingBottom: 24 },
  title: { fontFamily: F.headlineItalic, fontSize: 30, color: C.textPrimary, marginBottom: 6 },
  subtitle: { fontFamily: F.body, fontSize: 15, color: C.textSecondary, lineHeight: 22 },
  list: { gap: 16 },
  card: { overflow: 'hidden', position: 'relative', paddingTop: 22 },
  cardTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  storyNum: { fontFamily: F.extraBold, fontSize: 44, color: C.glassBorder, position: 'absolute', top: 14, right: 18, lineHeight: 48 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  tag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 9999, borderWidth: 1 },
  tagText: { fontFamily: F.bold, fontSize: 11, letterSpacing: 0.3 },
  readTime: { fontFamily: F.medium, fontSize: 12, color: C.textTertiary },
  cardTitle: { fontFamily: F.headlineItalic, fontSize: 22, color: C.textPrimary, lineHeight: 30, marginBottom: 10, paddingRight: 44 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  authorDot: { width: 6, height: 6, borderRadius: 3 },
  author: { fontFamily: F.medium, fontSize: 13, color: C.textSecondary },
  excerpt: { fontFamily: F.body, fontSize: 14, color: C.textSecondary, lineHeight: 22, fontStyle: 'italic', marginBottom: 16 },
  readMore: {},
  readMoreText: { fontFamily: F.bold, fontSize: 14 },
});
