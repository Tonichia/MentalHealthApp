import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView,
  ScrollView, Dimensions, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { C, F } from './theme';

const { width } = Dimensions.get('window');
type WelcomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const slides = [
  {
    id: 1, icon: '🌿',
    title: 'Mind Matter\nWellness',
    subtitle: 'A space rooted in warmth, gentle reflection, and the quiet comfort of growth.',
    accentColor: C.sage,
    tag: 'WELCOME',
  },
  {
    id: 2, icon: '📖',
    title: 'Private\nJournal',
    subtitle: 'Reflect on your day in a safe, beautiful space. Your diary, wherever you are.',
    accentColor: C.terracottaLight,
    tag: 'REFLECT',
  },
  {
    id: 3, icon: '🤝',
    title: 'Your\nCommunity',
    subtitle: 'Connect with support groups and licensed professionals whenever you need guidance.',
    accentColor: '#F3DEDD',
    tag: 'CONNECT',
  },
];

export const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeNavigationProp>();
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,    { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideUpAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    if (slideSize > 0) {
      const index = event.nativeEvent.contentOffset.x / slideSize;
      setActiveIndex(Math.max(0, Math.min(Math.round(index), slides.length - 1)));
    }
  };

  const activeSlide = slides[activeIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Subtle top-right glow */}
      <View style={styles.glowCircle} />

      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>

        {/* Tag pill */}
        <View style={styles.tagRow}>
          <View style={[styles.tagPill, { borderColor: activeSlide.accentColor + '70' }]}>
            <Text style={[styles.tagText, { color: activeSlide.accentColor }]}>{activeSlide.tag}</Text>
          </View>
        </View>

        {/* Carousel */}
        <ScrollView
          horizontal pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
        >
          {slides.map((slide) => (
            <View key={slide.id} style={[styles.slide, { width }]}>
              <View style={[styles.iconOuter, { borderColor: slide.accentColor + '50' }]}>
                <View style={[styles.iconInner, { backgroundColor: slide.accentColor + '20' }]}>
                  <Text style={styles.icon}>{slide.icon}</Text>
                </View>
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <View style={[styles.accentBar, { backgroundColor: slide.accentColor }]} />
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottom}>
          <View style={styles.pagination}>
            {slides.map((slide, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  activeIndex === i && [styles.dotActive, { backgroundColor: slide.accentColor }],
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Auth')}
            activeOpacity={0.88}
          >
            <Text style={styles.buttonText}>Begin Your Journey</Text>
            <Text style={[styles.buttonArrow, { color: activeSlide.accentColor }]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInRow} onPress={() => navigation.navigate('Auth')}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.brandFooter}>MIND MATTER WELLNESS</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.primary },
  glowCircle: {
    position: 'absolute', top: -80, right: -80,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: C.secondary, opacity: 0.12,
  },
  container: { flex: 1 },

  tagRow: { alignItems: 'center', paddingTop: 28, paddingBottom: 4 },
  tagPill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5 },
  tagText: { fontFamily: F.extraBold, fontSize: 10, letterSpacing: 3 },

  carousel: { flex: 1 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 },

  iconOuter: {
    width: 124, height: 124, borderRadius: 62,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    marginBottom: 36,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
  },
  iconInner: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 50 },

  title: {
    fontFamily: F.headlineItalic, fontSize: 44, color: C.background,
    textAlign: 'center', lineHeight: 52, marginBottom: 18, letterSpacing: -0.5,
  },
  accentBar: { width: 40, height: 3, borderRadius: 2, marginBottom: 20 },
  subtitle: {
    fontFamily: F.body, fontSize: 16, color: C.onPrimaryContainer,
    textAlign: 'center', lineHeight: 26, paddingHorizontal: 4,
  },

  bottom: { paddingHorizontal: 24, paddingBottom: 16 },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginBottom: 28, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#524343' },
  dotActive: { width: 28, height: 8, borderRadius: 4 },

  button: {
    backgroundColor: C.background,
    paddingVertical: 18, borderRadius: 9999,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, gap: 10,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  buttonText: { fontFamily: F.bold, color: C.primary, fontSize: 17, letterSpacing: 0.3 },
  buttonArrow: { fontFamily: F.extraBold, fontSize: 18 },

  signInRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 },
  signInText: { fontFamily: F.body, color: C.onPrimaryContainer, fontSize: 14 },
  signInLink: { fontFamily: F.bold, color: C.background, fontSize: 14 },

  brandFooter: {
    textAlign: 'center', fontSize: 9, color: '#524343',
    letterSpacing: 3, fontFamily: F.extraBold, marginTop: 16,
  },
});
