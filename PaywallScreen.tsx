import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, SafeAreaView, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PurchasesPackage } from 'react-native-purchases';
import { RevenueCatService } from './revenuecat';
import { useSubscription, SubscriptionTier } from './SubscriptionContext';
import { C, F, SHADOW_LG, SHADOW_MD } from './theme';

const PLUS_FEATURES = [
  'Unlimited journaling',
  'Community connections',
  'Positive stories library',
  'Offline journal sync',
];

const PRO_FEATURES = [
  'Everything in Plus',
  'All self-help plans',
  'Professional support',
  'Priority response',
];

export const PaywallScreen = () => {
  const navigation = useNavigation();
  const { checkSubscription, setTier } = useSubscription();
  const [packages, setPackages]         = useState<PurchasesPackage[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(32)).current;
  const cardsAnim   = useRef(new Animated.Value(0)).current;
  const cardsSlide  = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    const loadOfferings = async () => {
      const offerings = await RevenueCatService.getOfferings();
      setPackages(offerings);
    };
    loadOfferings();

    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeAnim,   { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim,  { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardsAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(cardsSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handlePurchase = async (pack?: PurchasesPackage, demoTier?: SubscriptionTier) => {
    setIsPurchasing(true);
    if (demoTier) {
      setTier(demoTier);
      navigation.goBack();
      return;
    }
    if (pack) {
      const newTier = await RevenueCatService.purchasePackage(pack);
      if (newTier !== 'free') {
        await checkSubscription();
        navigation.goBack();
      }
    }
    setIsPurchasing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>✦ UNLOCK YOUR POTENTIAL</Text>
          </View>
          <Text style={styles.title}>Elevate Your Mind</Text>
          <Text style={styles.subtitle}>
            Choose the plan that fits your journey and unlock your full potential.
          </Text>
        </Animated.View>

        {/* Plan cards */}
        <Animated.View style={[styles.cards, { opacity: cardsAnim, transform: [{ translateY: cardsSlide }] }]}>

          {/* Plus plan */}
          <View style={styles.plusCard}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.plusLabel}>Plus</Text>
                <Text style={styles.planTagline}>Perfect to start</Text>
              </View>
              <View style={styles.priceBlock}>
                <Text style={styles.price}>$9.99</Text>
                <Text style={styles.period}>/mo</Text>
              </View>
            </View>
            <View style={styles.divider} />
            {PLUS_FEATURES.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={[styles.checkCircle, { backgroundColor: C.secondary + '22' }]}>
                  <Text style={[styles.checkMark, { color: C.secondary }]}>✓</Text>
                </View>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.plusButton}
              disabled={isPurchasing}
              onPress={() => handlePurchase(packages.find(p => p.identifier === 'plus'), 'plus')}
              activeOpacity={0.85}
            >
              <Text style={styles.plusButtonText}>Unlock Plus</Text>
            </TouchableOpacity>
          </View>

          {/* Pro plan */}
          <View style={styles.proCard}>
            <View style={styles.proPopularBadge}>
              <Text style={styles.proPopularText}>MOST POPULAR</Text>
            </View>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.proLabel}>Pro</Text>
                <Text style={styles.proTagline}>Full access</Text>
              </View>
              <View style={styles.priceBlock}>
                <Text style={styles.proPrice}>$19.99</Text>
                <Text style={styles.proPeriod}>/mo</Text>
              </View>
            </View>
            <View style={[styles.divider, { borderColor: 'rgba(255,255,255,0.15)' }]} />
            {PRO_FEATURES.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={[styles.checkCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                  <Text style={[styles.checkMark, { color: C.background }]}>✓</Text>
                </View>
                <Text style={[styles.featureText, { color: 'rgba(255,255,255,0.9)' }]}>{f}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.proButton}
              disabled={isPurchasing}
              onPress={() => handlePurchase(packages.find(p => p.identifier === 'pro'), 'pro')}
              activeOpacity={0.85}
            >
              <Text style={styles.proButtonText}>Unlock Pro</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>

        {/* Dismiss */}
        <TouchableOpacity style={styles.dismissBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.dismissText}>Maybe Later</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.primary },
  container: { padding: 24, paddingBottom: 48 },

  headerBadge: {
    alignSelf: 'center', marginTop: 24, marginBottom: 18,
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 9999, borderWidth: 1, borderColor: C.secondary + '60',
  },
  headerBadgeText: { fontFamily: F.extraBold, fontSize: 9, color: C.secondary, letterSpacing: 2.5 },

  title: {
    fontFamily: F.headlineItalic, fontSize: 38,
    color: C.background, textAlign: 'center', marginBottom: 12,
    lineHeight: 46,
  },
  subtitle: {
    fontFamily: F.body, fontSize: 16, textAlign: 'center',
    color: C.onPrimaryContainer, lineHeight: 25, marginBottom: 36,
  },

  cards: { gap: 16, marginBottom: 24 },

  // Plus card
  plusCard: {
    backgroundColor: C.primaryContainer, borderRadius: 28,
    padding: 26, borderWidth: 1, borderColor: '#524343',
  },
  planHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  plusLabel: { fontFamily: F.headlineItalic, fontSize: 26, color: C.background, marginBottom: 3 },
  planTagline: { fontFamily: F.medium, fontSize: 13, color: C.onPrimaryContainer },
  priceBlock: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  price: { fontFamily: F.headline, fontSize: 34, color: C.background },
  period: { fontFamily: F.medium, fontSize: 14, color: C.onPrimaryContainer, marginBottom: 4 },

  divider: { borderTopWidth: 1, borderColor: '#524343', marginBottom: 20 },

  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  checkMark: { fontFamily: F.extraBold, fontSize: 12 },
  featureText: { fontFamily: F.medium, fontSize: 15, color: C.onPrimaryContainer, flex: 1 },

  plusButton: {
    backgroundColor: C.secondary, paddingVertical: 16,
    borderRadius: 9999, alignItems: 'center', marginTop: 20, ...SHADOW_MD,
  },
  plusButtonText: { fontFamily: F.bold, color: C.background, fontSize: 16 },

  // Pro card
  proCard: {
    backgroundColor: C.secondary, borderRadius: 28,
    padding: 26, borderColor: C.secondary, ...SHADOW_LG,
    position: 'relative', overflow: 'hidden',
  },
  proPopularBadge: {
    position: 'absolute', top: -1, right: 24,
    backgroundColor: C.primary, paddingHorizontal: 14,
    paddingVertical: 7, borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
  },
  proPopularText: { fontFamily: F.extraBold, color: C.background, fontSize: 9, letterSpacing: 1.5 },
  proLabel: { fontFamily: F.headlineItalic, fontSize: 26, color: C.background, marginBottom: 3, marginTop: 18 },
  proTagline: { fontFamily: F.medium, fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  proPrice: { fontFamily: F.headline, fontSize: 34, color: C.background },
  proPeriod: { fontFamily: F.medium, fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },

  proButton: {
    backgroundColor: C.primary, paddingVertical: 16,
    borderRadius: 9999, alignItems: 'center', marginTop: 20, ...SHADOW_MD,
  },
  proButtonText: { fontFamily: F.bold, color: C.background, fontSize: 16 },

  dismissBtn: { alignItems: 'center', paddingVertical: 16 },
  dismissText: { fontFamily: F.semibold, color: '#806868', fontSize: 15 },
});
