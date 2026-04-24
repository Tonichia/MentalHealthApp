import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    icon: '🧠',
    title: 'Mind Matter Wellness',
    subtitle: 'Your premium mental health companion. Track your thoughts and build healthier habits.',
    accentColor: '#DEE5CF',
    iconBg: 'rgba(222,229,207,0.15)',
  },
  {
    id: 2,
    icon: '📖',
    title: 'Private Journal',
    subtitle: 'Reflect on your day securely. Your personal diary travels with you everywhere.',
    accentColor: '#FFDBD1',
    iconBg: 'rgba(255,219,209,0.15)',
  },
  {
    id: 3,
    icon: '🤝',
    title: 'Community',
    subtitle: 'Connect with support groups and licensed professionals whenever you need guidance.',
    accentColor: '#F3DEDD',
    iconBg: 'rgba(243,222,221,0.15)',
  },
];

export const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);

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
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {slides.map((slide) => (
            <View key={slide.id} style={[styles.slide, { width: width - 48 }]}>
              <View style={[styles.iconContainer, { backgroundColor: slide.iconBg, borderColor: slide.accentColor + '40' }]}>
                <Text style={styles.icon}>{slide.icon}</Text>
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <View style={[styles.accentBar, { backgroundColor: slide.accentColor }]} />
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomSection}>
          <View style={styles.pagination}>
            {slides.map((slide, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index && [styles.activeDot, { backgroundColor: slide.accentColor }],
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, { shadowColor: activeSlide.accentColor }]}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInRow} onPress={() => navigation.navigate('Auth')}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#261A1A' },
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  slide: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconContainer: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#1C1C18',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  icon: { fontSize: 50 },
  title: { fontSize: 40, fontWeight: '600', fontFamily: 'serif', color: '#FCF9F3', marginBottom: 14, textAlign: 'center' },
  accentBar: { width: 44, height: 4, borderRadius: 2, marginBottom: 18 },
  subtitle: { fontSize: 17, color: '#D6C2C1', textAlign: 'center', lineHeight: 26, paddingHorizontal: 8 },

  bottomSection: { paddingBottom: 8 },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginBottom: 28 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#524343', marginHorizontal: 4 },
  activeDot: { width: 28, height: 8, borderRadius: 4 },

  button: {
    backgroundColor: '#FCF9F3',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 7,
  },
  buttonText: { color: '#261A1A', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },

  signInRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 },
  signInText: { color: '#D6C2C1', fontSize: 14 },
  signInLink: { color: '#FCF9F3', fontSize: 14, fontWeight: '700' },
});
