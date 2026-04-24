import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

// TODO: Replace with your actual RevenueCat API keys from your dashboard
const API_KEYS = {
  apple: 'appl_your_apple_api_key',
  google: 'goog_your_google_api_key',
};

export const RevenueCatService = {
  init: () => {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    
    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: API_KEYS.apple });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: API_KEYS.google });
    }
  },

  getOfferings: async (): Promise<PurchasesPackage[]> => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        return offerings.current.availablePackages;
      }
      return [];
    } catch (e) {
      console.error('Error fetching offerings:', e);
      return [];
    }
  },

  purchasePackage: async (pack: PurchasesPackage): Promise<'free' | 'plus' | 'pro'> => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pack);
      if (typeof customerInfo.entitlements.active['pro'] !== 'undefined') return 'pro';
      if (typeof customerInfo.entitlements.active['plus'] !== 'undefined') return 'plus';
      return 'free';
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error('Error purchasing package:', e);
      }
      return 'free';
    }
  },

  checkSubscription: async (): Promise<'free' | 'plus' | 'pro'> => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      if (typeof customerInfo.entitlements.active['pro'] !== 'undefined') return 'pro';
      if (typeof customerInfo.entitlements.active['plus'] !== 'undefined') return 'plus';
      return 'free';
    } catch (e) {
      console.error('Error checking subscription:', e);
      return 'free';
    }
  },
};