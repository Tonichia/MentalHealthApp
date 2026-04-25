import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  SafeAreaView, ScrollView, Dimensions, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { C, F, SHADOW_LG } from './theme';
import { GradientBackground } from './GradientBackground';

const { width } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList>;

const SLIDES = [
  {
    id: 1, icon: '🌿',
    eyebrow: 'WELCOME',
    title: 'Find Your\nInner Calm',
    subtitle: 'A space rooted in warmth, gentle reflection, and the quiet comfort of growth.',
    accent: C.sage,
  },
  {
    id: 2, icon: '📖',
    eyebrow: 'REFLECT',
    title: 'Your Private\nSanctuary',
    subtitle: 'Journal your thoughts in a safe, beautiful space. Your words, your healing.',
    accent: C.gold,
  },
  {
    id: 3, icon: '🤝',
    eyebrow: 'CONNECT',
    title: 'You Are\nNot Alone',
    subtitle: 'Connect with support groups and professionals whenever you need guidance.',
    accent: C.mist,
  },
];

export const WelcomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleScroll = (e: any) => {
    const size = e.nativeEvent.layoutMeasurement.width;
    if (size > 0) {
      const idx = e.nativeEvent.contentOffset.x / size;
      setActiveIndex(Math.max(0, Math.min(Math.round(idx), SLIDES.length - 1)));
    }
  };

  const slide = SLIDES[activeIndex];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* Eyebrow tag */}
          <View style={styles.tagRow}>
            <View style={[styles.tag, { borderColor: slide.accent + '70' }]}>
              <Text style={[styles.tagText, { color: slide.accent }]}>{slide.eyebrow}</Text>
            </View>
          </View>

          {/* Slides */}
          <ScrollView
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.carousel}
          >
            {SLIDES.map((s) => (
              <View key={s.id} style={[styles.slide, { width }]}>
                {/* Icon ring */}
                <View style={[styles.iconOuter, { borderColor: s.accent + '50' }]}>
                  <View style={[styles.iconInner, { backgroundColor: s.accent + '20' }]}>
                    <Text style={styles.icon}>{s.icon}</Text>
                  </View>
                </View>
                <Text style={styles.title}>{s.title}</Text>
                <View style={[styles.bar, { backgroundColor: s.accent }]} />
                <Text style={styles.subtitle}>{s.subtitle}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Bottom */}
          <View style={styles.bottom}>
            {/* Dots */}
            <View style={styles.dots}>
              {SLIDES.map((s, i) => (
                <View key={i} style={[
                  styles.dot,
                  activeIndex === i && [styles.dotActive, { backgroundColor: s.accent }],
                ]} />
              ))}
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={styles.cta}
              onPress={() => navigation.navigate('Auth')}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaText}>Begin Your Journey</Text>
            </TouchableOpacity>

            {/* Sign in */}
            <TouchableOpacity style={styles.signInRow} onPress={() => navigation.navigate('Auth')}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>MIND MATTER WELLNESS</Text>
          </View>

        </Animated.View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },

  tagRow: { alignItems: 'center', paddingTop: 28, paddingBottom: 4 },
  tag: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5 },
  tagText: { fontFamily: F.extraBold, fontSize: 10, letterSpacing: 3 },

  carousel: { flex: 1 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 },

  iconOuter: {
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    marginBottom: 40, ...SHADOW_LG,
  },
  iconInner: {
    width: 106, height: 106, borderRadius: 53,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 52 },

  title: {
    fontFamily: F.headlineItalic, fontSize: 44,
    color: C.textPrimary, textAlign: 'center',
    lineHeight: 52, marginBottom: 18, letterSpacing: -0.5,
  },
  bar: { width: 40, height: 3, borderRadius: 2, marginBottom: 20 },
  subtitle: {
    fontFamily: F.body, fontSize: 16, color: C.textSecondary,
    textAlign: 'center', lineHeight: 26,
  },

  bottom: { paddingHorizontal: 28, paddingBottom: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 28, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { width: 28, height: 8, borderRadius: 4 },

  cta: {
    backgroundColor: C.textPrimary, paddingVertical: 18,
    borderRadius: 9999, alignItems: 'center', marginBottom: 16, ...SHADOW_LG,
  },
  ctaText: { fontFamily: F.bold, color: C.gradientDeep, fontSize: 17, letterSpacing: 0.3 },

  signInRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 },
  signInText: { fontFamily: F.body, color: C.textSecondary, fontSize: 14 },
  signInLink: { fontFamily: F.bold, color: C.textPrimary, fontSize: 14 },

  footer: {
    textAlign: 'center', fontSize: 9, color: C.textTertiary,
    letterSpacing: 3, fontFamily: F.extraBold, marginTop: 16,
  },
});
