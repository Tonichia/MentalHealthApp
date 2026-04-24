import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RevenueCatService } from './revenuecat';
import { SubscriptionProvider } from './SubscriptionContext';
import { HomeScreen } from './HomeScreen';
import { PaywallScreen } from './PaywallScreen';
import { PlansScreen } from './PlansScreen';
import { ConnectionsScreen } from './ConnectionsScreen';
import { StoriesScreen } from './StoriesScreen';
import { PlanDetailScreen } from './PlanDetailScreen';
import { GroupChatScreen } from './GroupChatScreen';
import { StoryDetailScreen } from './StoryDetailScreen';
import { AuthScreen } from './AuthScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding until our session is loaded
SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Home: undefined;
  Paywall: undefined;
  Plans: undefined;
  Connections: undefined;
  Stories: undefined;
  PlanDetail: { title: string; duration: string; icon: string; color: string };
  GroupChat: { groupName: string };
  StoryDetail: { id: number; title: string; author: string; readTime: string; content: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize RevenueCat when the app boots up
    RevenueCatService.init();

    // Load the initial session securely
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    // Listen for login/logout events
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Wait to render until the secure session is loaded
  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <SubscriptionProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {!session ? (
              <Stack.Group>
                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Auth" component={AuthScreen} options={{ title: '', headerTransparent: true, headerBackVisible: false, headerTintColor: '#261A1A' }} />
              </Stack.Group>
            ) : (
              <Stack.Group>
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Paywall" component={PaywallScreen} options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="Plans" component={PlansScreen} options={{ title: 'Self-Help Plans' }} />
                <Stack.Screen name="Connections" component={ConnectionsScreen} options={{ title: 'Healthy Connections' }} />
                <Stack.Screen name="Stories" component={StoriesScreen} options={{ title: 'Positive Stories' }} />
                <Stack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ title: 'Plan Overview', headerBackTitle: 'Back' }} />
                <Stack.Screen
                  name="GroupChat"
                  component={GroupChatScreen}
                  options={({ route }) => ({ title: route.params.groupName, headerBackTitle: 'Back' })}
                />
                <Stack.Screen name="StoryDetail" component={StoryDetailScreen} options={{ title: 'Story', headerBackTitle: 'Back' }} />
              </Stack.Group>
            )}
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </SubscriptionProvider>
    </SafeAreaProvider>
  );
}
