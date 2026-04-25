// ─── PaywallScreen.tsx ────────────────────────────────────────────────────────
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  SafeAreaView, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PurchasesPackage } from 'react-native-purchases';
import { RevenueCatService } from './revenuecat';
import { useSubscription, SubscriptionTier } from './SubscriptionContext';
import { C, F, SHADOW_LG, SHADOW_MD } from './theme';
import { GradientBackground } from './GradientBackground';
import { GlassCard } from './GlassCard';

const PLUS_FEATURES = ['Unlimited journaling', 'Community connections', 'Stories library', 'Offline sync'];
const PRO_FEATURES  = ['Everything in Plus', 'All self-help plans', 'Professional support', 'Priority access'];

export const PaywallScreen = () => {
  const navigation = useNavigation();
  const { checkSubscription, setTier } = useSubscription();
  const [packages, setPackages]   = useState<PurchasesPackage[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    RevenueCatService.getOfferings().then(setPackages);
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePurchase = async (pack?: PurchasesPackage, demoTier?: SubscriptionTier) => {
    setIsPurchasing(true);
    if (demoTier) { setTier(demoTier); navigation.goBack(); return; }
    if (pack) {
      const newTier = await RevenueCatService.purchasePackage(pack);
      if (newTier !== 'free') { await checkSubscription(); navigation.goBack(); }
    }
    setIsPurchasing(false);
  };

  return (
    <GradientBackground variant="dawn">
      <SafeAreaView style={pw.safe}>
        <ScrollView contentContainerStyle={pw.container} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            <View style={pw.badge}>
              <Text style={pw.badgeText}>✦ UNLOCK YOUR POTENTIAL</Text>
            </View>
            <Text style={pw.title}>Elevate Your Mind</Text>
            <Text style={pw.subtitle}>Choose the plan that fits your journey.</Text>

            {/* Plus */}
            <GlassCard style={pw.planCard}>
              <View style={pw.planRow}>
                <View>
                  <Text style={pw.planName}>Plus</Text>
                  <Text style={pw.planTagline}>Perfect to start</Text>
                </View>
                <View style={pw.priceWrap}>
                  <Text style={pw.price}>$9.99</Text>
                  <Text style={pw.period}>/mo</Text>
                </View>
              </View>
              <View style={pw.divider} />
              {PLUS_FEATURES.map((f, i) => (
                <View key={i} style={pw.featureRow}>
                  <View style={[pw.check, { backgroundColor: C.sageFaint }]}>
                    <Text style={[pw.checkMark, { color: C.sage }]}>✓</Text>
                  </View>
                  <Text style={pw.featureText}>{f}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={pw.plusBtn} disabled={isPurchasing}
                onPress={() => handlePurchase(packages.find(p => p.identifier === 'plus'), 'plus')}
                activeOpacity={0.85}
              >
                <Text style={pw.plusBtnText}>Unlock Plus</Text>
              </TouchableOpacity>
            </GlassCard>

            {/* Pro */}
            <GlassCard variant="gold" style={pw.proCard}>
              <View style={pw.proBadge}>
                <Text style={pw.proBadgeText}>MOST POPULAR</Text>
              </View>
              <View style={pw.planRow}>
                <View>
                  <Text style={[pw.planName, { marginTop: 20 }]}>Pro</Text>
                  <Text style={pw.planTagline}>Full access</Text>
                </View>
                <View style={pw.priceWrap}>
                  <Text style={pw.price}>$19.99</Text>
                  <Text style={pw.period}>/mo</Text>
                </View>
              </View>
              <View style={pw.divider} />
              {PRO_FEATURES.map((f, i) => (
                <View key={i} style={pw.featureRow}>
                  <View style={[pw.check, { backgroundColor: C.goldFaint }]}>
                    <Text style={[pw.checkMark, { color: C.gold }]}>✓</Text>
                  </View>
                  <Text style={pw.featureText}>{f}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={pw.proBtn} disabled={isPurchasing}
                onPress={() => handlePurchase(packages.find(p => p.identifier === 'pro'), 'pro')}
                activeOpacity={0.85}
              >
                <Text style={pw.proBtnText}>Unlock Pro</Text>
              </TouchableOpacity>
            </GlassCard>

            <TouchableOpacity style={pw.dismiss} onPress={() => navigation.goBack()}>
              <Text style={pw.dismissText}>Maybe Later</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const pw = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 24, paddingBottom: 48 },
  badge: { alignSelf: 'center', marginTop: 24, marginBottom: 18, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 9999, borderWidth: 1, borderColor: C.gold + '60' },
  badgeText: { fontFamily: F.extraBold, fontSize: 9, color: C.gold, letterSpacing: 2.5 },
  title: { fontFamily: F.headlineItalic, fontSize: 38, color: C.textPrimary, textAlign: 'center', marginBottom: 12, lineHeight: 46 },
  subtitle: { fontFamily: F.body, fontSize: 16, color: C.textSecondary, textAlign: 'center', lineHeight: 25, marginBottom: 32 },
  planCard: { marginBottom: 16 },
  proCard: { marginBottom: 16, position: 'relative', overflow: 'hidden' },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  planName: { fontFamily: F.headlineItalic, fontSize: 26, color: C.textPrimary, marginBottom: 3 },
  planTagline: { fontFamily: F.medium, fontSize: 13, color: C.textSecondary },
  priceWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  price: { fontFamily: F.headline, fontSize: 34, color: C.textPrimary },
  period: { fontFamily: F.medium, fontSize: 14, color: C.textSecondary, marginBottom: 4 },
  divider: { borderTopWidth: 1, borderColor: C.glassBorder, marginBottom: 18 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  check: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  checkMark: { fontFamily: F.extraBold, fontSize: 12 },
  featureText: { fontFamily: F.medium, fontSize: 15, color: C.textSecondary, flex: 1 },
  plusBtn: { backgroundColor: C.textPrimary, paddingVertical: 16, borderRadius: 9999, alignItems: 'center', marginTop: 16, ...SHADOW_MD },
  plusBtnText: { fontFamily: F.bold, color: C.gradientDeep, fontSize: 16 },
  proBtn: { backgroundColor: C.gradientDeep, paddingVertical: 16, borderRadius: 9999, alignItems: 'center', marginTop: 16, ...SHADOW_MD },
  proBtnText: { fontFamily: F.bold, color: C.textPrimary, fontSize: 16 },
  proBadge: { position: 'absolute', top: -1, right: 20, backgroundColor: C.gradientDeep, paddingHorizontal: 14, paddingVertical: 7, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  proBadgeText: { fontFamily: F.extraBold, color: C.gold, fontSize: 9, letterSpacing: 1.5 },
  dismiss: { alignItems: 'center', paddingVertical: 16 },
  dismissText: { fontFamily: F.semibold, color: C.textTertiary, fontSize: 15 },
});
