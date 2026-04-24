import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PurchasesPackage } from 'react-native-purchases';
import { RevenueCatService } from './revenuecat';
import { useSubscription, SubscriptionTier } from './SubscriptionContext';

export const PaywallScreen = () => {
  const navigation = useNavigation();
  const { checkSubscription, setTier } = useSubscription();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(20)).current;
  const cardsOpacity = useRef(new Animated.Value(0)).current;
  const cardsTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const loadOfferings = async () => {
      const offerings = await RevenueCatService.getOfferings();
      setPackages(offerings);
    };
    loadOfferings();

    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(headerTranslateY, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.timing(cardsOpacity, { toValue: 1, duration: 600, delay: 150, useNativeDriver: true }),
      Animated.spring(cardsTranslateY, { toValue: 0, friction: 8, tension: 40, delay: 150, useNativeDriver: true }),
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
      await checkSubscription(); // Update global Pro status
      navigation.goBack(); // Dismiss the paywall
    }
    }
    setIsPurchasing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }}>
          <Text style={styles.title}>Elevate Your Mind</Text>
          <Text style={styles.description}>
            Choose the plan that fits your journey and unlock your full potential.
          </Text>
        </Animated.View>
        
        <Animated.View style={{ opacity: cardsOpacity, transform: [{ translateY: cardsTranslateY }] }}>
        {/* Tier 2: Plus */}
        <View style={styles.planCard}>
          <Text style={styles.planName}>Plus</Text>
          <Text style={styles.planPrice}>$9.99<Text style={styles.planPeriod}>/mo</Text></Text>
          <Text style={styles.planFeature}>✓ Unlimited Journaling</Text>
          <Text style={styles.planFeature}>✓ Community Connections</Text>
          <Text style={styles.planFeature}>✓ Positive Stories Access</Text>
          <TouchableOpacity 
            style={styles.planButton} 
            disabled={isPurchasing} 
            onPress={() => handlePurchase(packages.find(p => p.identifier === 'plus'), 'plus')}
          >
            <Text style={styles.planButtonText}>Unlock Plus</Text>
          </TouchableOpacity>
        </View>

        {/* Tier 3: Pro */}
        <View style={[styles.planCard, styles.proCard]}>
          <View style={styles.bestValueBadge}><Text style={styles.bestValueText}>MOST POPULAR</Text></View>
          <Text style={[styles.planName, styles.proText]}>Pro</Text>
          <Text style={[styles.planPrice, styles.proText]}>$19.99<Text style={styles.planPeriodPro}>/mo</Text></Text>
          <Text style={[styles.planFeature, styles.proText]}>✓ Everything in Plus</Text>
          <Text style={[styles.planFeature, styles.proText]}>✓ Professional Support</Text>
          <Text style={[styles.planFeature, styles.proText]}>✓ All Self-Help Plans</Text>
          <TouchableOpacity 
            style={styles.proButton} 
            disabled={isPurchasing} 
            onPress={() => handlePurchase(packages.find(p => p.identifier === 'pro'), 'pro')}
          >
            <Text style={styles.proButtonText}>Unlock Pro</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>Maybe Later</Text>
        </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#261A1A' },
  container: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: '600', fontFamily: 'serif', color: '#FCF9F3', marginBottom: 12, textAlign: 'center', marginTop: 20 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 40, color: '#D6C2C1', lineHeight: 24 },
  
  planCard: { backgroundColor: '#3C2F2F', borderRadius: 24, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#524343' },
  planName: { fontSize: 22, fontWeight: '600', fontFamily: 'serif', color: '#FCF9F3', marginBottom: 8 },
  planPrice: { fontSize: 36, fontWeight: '900', color: '#FCF9F3', marginBottom: 20 },
  planPeriod: { fontSize: 16, fontWeight: '500', color: '#D6C2C1' },
  planFeature: { fontSize: 15, color: '#D6C2C1', marginBottom: 12, fontWeight: '500' },
  planButton: { backgroundColor: '#524343', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  planButtonText: { color: '#FCF9F3', fontSize: 16, fontWeight: 'bold' },

  proCard: { backgroundColor: '#8B4E3D', borderColor: '#8B4E3D', shadowColor: '#261A1A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  proText: { color: '#FCF9F3' },
  planPeriodPro: { fontSize: 16, fontWeight: '500', color: '#FDFBF7' },
  proButton: { backgroundColor: '#261A1A', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  proButtonText: { color: '#FCF9F3', fontSize: 16, fontWeight: 'bold' },
  
  bestValueBadge: { position: 'absolute', top: -14, right: 24, backgroundColor: '#261A1A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, overflow: 'hidden' },
  bestValueText: { color: '#FCF9F3', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  closeButton: { marginTop: 10, paddingVertical: 15, alignItems: 'center' },
  closeButtonText: { color: '#A99696', fontSize: 16, fontWeight: '600' }
});