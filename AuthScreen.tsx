import React, { useState, useRef, useEffect } from 'react';
import {
  Alert, StyleSheet, Text, TextInput, TouchableOpacity,
  View, SafeAreaView, ScrollView, Animated,
} from 'react-native';
import { supabase } from './supabase';
import { C, F, SHADOW_MD, SHADOW_LG } from './theme';

export const AuthScreen = () => {
  const [mode, setMode]         = useState<'signIn' | 'signUp'>('signIn');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const switchMode = (newMode: 'signIn' | 'signUp') => {
    setMode(newMode);
    setName(''); setEmail(''); setPassword('');
  };

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { data: { name: name.trim() } },
    });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Success', 'Check your email for the confirmation link!');
    setLoading(false);
  }

  async function resetPassword() {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address first.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Email Sent', 'Check your email for the password reset link!');
    setLoading(false);
  }

  const inputStyle = (field: string) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Brand Header */}
          <View style={styles.brandSection}>
            <View style={styles.logoMark}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>
            <Text style={styles.brandName}>Mind Matter</Text>
            <Text style={styles.brandTagline}>Your mental wellness companion</Text>
          </View>

          {/* Mode Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, mode === 'signIn' && styles.tabActive]}
              onPress={() => switchMode('signIn')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, mode === 'signIn' && styles.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'signUp' && styles.tabActive]}
              onPress={() => switchMode('signUp')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, mode === 'signUp' && styles.tabTextActive]}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {mode === 'signIn' ? 'Welcome back' : 'Begin your journey'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {mode === 'signIn'
                ? 'Sign in to continue your wellness journey.'
                : 'Start building healthier habits today.'}
            </Text>

            {mode === 'signUp' && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Your Name</Text>
                <TextInput
                  style={inputStyle('name')}
                  onChangeText={setName}
                  value={name}
                  placeholder="How should we call you?"
                  autoCapitalize="words"
                  placeholderTextColor={C.outline}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={inputStyle('email')}
                onChangeText={setEmail}
                value={email}
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={C.outline}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={inputStyle('password')}
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholder="••••••••"
                autoCapitalize="none"
                placeholderTextColor={C.outline}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {mode === 'signIn' && (
              <TouchableOpacity
                style={styles.forgotButton}
                onPress={resetPassword}
                disabled={loading}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonLoading]}
              disabled={loading}
              onPress={mode === 'signIn' ? signInWithEmail : signUpWithEmail}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Please wait...' : mode === 'signIn' ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Switch mode */}
          <TouchableOpacity
            style={styles.switchRow}
            disabled={loading}
            onPress={() => switchMode(mode === 'signIn' ? 'signUp' : 'signIn')}
          >
            <Text style={styles.switchText}>
              {mode === 'signIn' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.switchLink}>
                {mode === 'signIn' ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 48, flexGrow: 1 },

  brandSection: { alignItems: 'center', paddingTop: 44, paddingBottom: 32 },
  logoMark: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: 18, ...SHADOW_LG,
  },
  logoEmoji: { fontSize: 38 },
  brandName: { fontFamily: F.headlineItalic, fontSize: 32, color: C.primary, marginBottom: 6 },
  brandTagline: { fontFamily: F.body, fontSize: 15, color: C.onSurfaceVariant },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: C.surfaceContainer,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1, paddingVertical: 11, borderRadius: 13, alignItems: 'center',
  },
  tabActive: {
    backgroundColor: C.primary, ...SHADOW_MD,
  },
  tabText: { fontFamily: F.semibold, fontSize: 14, color: C.outline },
  tabTextActive: { color: C.background },

  // Card
  card: {
    backgroundColor: C.surface, borderRadius: 28,
    padding: 28, marginBottom: 20,
    borderWidth: 1, borderColor: C.outlineVariant, ...SHADOW_MD,
  },
  cardTitle: { fontFamily: F.headlineItalic, fontSize: 28, color: C.primary, marginBottom: 6 },
  cardSubtitle: {
    fontFamily: F.body, fontSize: 15, color: C.onSurfaceVariant,
    marginBottom: 28, lineHeight: 23,
  },

  // Inputs
  inputWrapper: { marginBottom: 18 },
  inputLabel: {
    fontFamily: F.semibold, fontSize: 12, color: C.onSurfaceVariant,
    marginBottom: 7, marginLeft: 2, letterSpacing: 0.3,
  },
  input: {
    backgroundColor: C.background, borderWidth: 1.5,
    borderColor: C.outlineVariant, paddingVertical: 14,
    paddingHorizontal: 18, borderRadius: 16,
    fontFamily: F.body, fontSize: 16, color: C.onSurface,
  },
  inputFocused: { borderColor: C.secondary, backgroundColor: C.surface },

  forgotButton: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -6 },
  forgotText: { fontFamily: F.semibold, color: C.secondary, fontSize: 13 },

  primaryButton: {
    backgroundColor: C.primary, paddingVertical: 17,
    borderRadius: 9999, alignItems: 'center', marginTop: 4,
    ...SHADOW_MD,
  },
  primaryButtonLoading: { backgroundColor: C.outline },
  primaryButtonText: {
    fontFamily: F.bold, color: C.background, fontSize: 16, letterSpacing: 0.3,
  },

  switchRow: { alignItems: 'center', paddingVertical: 14 },
  switchText: { fontFamily: F.body, color: C.outline, fontSize: 14 },
  switchLink: { fontFamily: F.extraBold, color: C.primary },
});
