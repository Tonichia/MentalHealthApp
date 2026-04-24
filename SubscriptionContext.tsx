import React, { createContext, useContext, useState, useEffect } from 'react';
import { RevenueCatService } from './revenuecat';

export type SubscriptionTier = 'free' | 'plus' | 'pro';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  setTier: (val: SubscriptionTier) => void;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<SubscriptionTier>('free');

  const checkSubscription = async () => {
    const userTier = await RevenueCatService.checkSubscription();
    setTier(userTier);
  };

  return (
    <SubscriptionContext.Provider value={{ tier, setTier, checkSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};