import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PurchasesPackage } from 'react-native-purchases';
import { RevenueCatService } from './revenuecat';
import { useSubscription, SubscriptionTier } from './SubscriptionContext';

export const PaywallScreen = () => {
  const navigation = useNavigation();
  const { checkSubscription, setTier } = useSubscription();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const loadOfferings = async () => {
      const offerings = await RevenueCatService.getOfferings();
      setPackages(offerings);
    };
    loadOfferings();
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
        <Text style={styles.title}>Elevate Your Mind</Text>
        <Text style={styles.description}>
          Choose the plan that fits your journey and unlock your full potential.
        </Text>
        
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#F8FAFC', marginBottom: 12, textAlign: 'center', marginTop: 20 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 40, color: '#94A3B8', lineHeight: 24 },
  
  planCard: { backgroundColor: '#1E293B', borderRadius: 24, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  planName: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 8 },
  planPrice: { fontSize: 36, fontWeight: '900', color: '#F8FAFC', marginBottom: 20 },
  planPeriod: { fontSize: 16, fontWeight: '500', color: '#94A3B8' },
  planFeature: { fontSize: 15, color: '#CBD5E1', marginBottom: 12, fontWeight: '500' },
  planButton: { backgroundColor: '#334155', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  planButtonText: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },

  proCard: { backgroundColor: '#F59E0B', borderColor: '#F59E0B', shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  proText: { color: '#451A03' },
  planPeriodPro: { fontSize: 16, fontWeight: '500', color: '#78350F' },
  proButton: { backgroundColor: '#451A03', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  proButtonText: { color: '#F59E0B', fontSize: 16, fontWeight: 'bold' },
  
  bestValueBadge: { position: 'absolute', top: -14, right: 24, backgroundColor: '#451A03', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, overflow: 'hidden' },
  bestValueText: { color: '#F59E0B', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  closeButton: { marginTop: 10, paddingVertical: 15, alignItems: 'center' },
  closeButtonText: { color: '#64748B', fontSize: 16, fontWeight: '600' }
});