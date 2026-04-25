import React, { useState, useRef, useEffect } from 'react';
import {
  Alert, StyleSheet, Text, TextInput, TouchableOpacity,
  View, SafeAreaView, ScrollView, Animated,
} from 'react-native';
import { supabase } from './supabase';
import { C, F, SHADOW_LG, SHADOW_MD } from './theme';
import { GradientBackground } from './GradientBackground';
import { GlassCard } from './GlassCard';

export const AuthScreen = () => {
  const [mode, setMode]         = useState<'signIn' | 'signUp'>('signIn');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState<string | null>(null);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const switchMode = (m: 'signIn' | 'signUp') => {
    setMode(m); setName(''); setEmail(''); setPassword('');
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
    else Alert.alert('Check your email', 'We sent you a confirmation link to activate your account.');
    setLoading(false);
  }

  async function resetPassword() {
    if (!email) { Alert.alert('Email Required', 'Enter your email address first.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Email Sent', 'Check your inbox for the password reset link.');
    setLoading(false);
  }

  const inputStyle = (field: string) => [
    styles.input,
    focused === field && styles.inputFocused,
  ];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* Logo mark */}
            <View style={styles.logoSection}>
              <View style={styles.logoRing}>
                <Text style={styles.logoEmoji}>🌿</Text>
              </View>
              <Text style={styles.appName}>Mind Matter</Text>
              <Text style={styles.tagline}>Your mental wellness companion</Text>
            </View>

            {/* Tab switcher */}
            <View style={styles.tabs}>
              {(['signIn', 'signUp'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.tab, mode === m && styles.tabActive]}
                  onPress={() => switchMode(m)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                    {m === 'signIn' ? 'Sign In' : 'Create Account'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Form glass card */}
            <GlassCard style={styles.card}>
              <Text style={styles.cardTitle}>
                {mode === 'signIn' ? 'Welcome back' : 'Begin your journey'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {mode === 'signIn'
                  ? 'Sign in to continue your wellness journey.'
                  : 'Start building healthier habits today.'}
              </Text>

              {mode === 'signUp' && (
                <View style={styles.fieldWrap}>
                  <Text style={styles.label}>Your Name</Text>
                  <TextInput
                    style={inputStyle('name')}
                    value={name} onChangeText={setName}
                    placeholder="How should we call you?"
                    placeholderTextColor={C.textTertiary}
                    autoCapitalize="words"
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              )}

              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={inputStyle('email')}
                  value={email} onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={C.textTertiary}
                  autoCapitalize="none" keyboardType="email-address"
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={inputStyle('password')}
                  value={password} onChangeText={setPassword}
                  secureTextEntry placeholder="••••••••"
                  placeholderTextColor={C.textTertiary}
                  autoCapitalize="none"
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
              </View>

              {mode === 'signIn' && (
                <TouchableOpacity style={styles.forgot} onPress={resetPassword} disabled={loading}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.btn, loading && styles.btnLoading]}
                disabled={loading}
                onPress={mode === 'signIn' ? signInWithEmail : signUpWithEmail}
                activeOpacity={0.85}
              >
                <Text style={styles.btnText}>
                  {loading ? 'Please wait...' : mode === 'signIn' ? 'Sign In' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </GlassCard>

            {/* Switch mode */}
            <TouchableOpacity
              style={styles.switchRow} disabled={loading}
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
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 48, flexGrow: 1 },

  logoSection: { alignItems: 'center', paddingTop: 44, paddingBottom: 32 },
  logoRing: {
    width: 84, height: 84, borderRadius: 42,
    borderWidth: 1.5, borderColor: C.glassBorder,
    backgroundColor: C.glass,
    alignItems: 'center', justifyContent: 'center', marginBottom: 18, ...SHADOW_LG,
  },
  logoEmoji: { fontSize: 38 },
  appName: { fontFamily: F.headlineItalic, fontSize: 32, color: C.textPrimary, marginBottom: 6 },
  tagline: { fontFamily: F.body, fontSize: 15, color: C.textSecondary },

  tabs: {
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 16, padding: 4, marginBottom: 20,
    borderWidth: 1, borderColor: C.glassBorder,
  },
  tab: { flex: 1, paddingVertical: 11, borderRadius: 13, alignItems: 'center' },
  tabActive: { backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder },
  tabText: { fontFamily: F.semibold, fontSize: 14, color: C.textSecondary },
  tabTextActive: { color: C.textPrimary },

  card: { marginBottom: 20 },
  cardTitle: { fontFamily: F.headlineItalic, fontSize: 26, color: C.textPrimary, marginBottom: 6 },
  cardSubtitle: {
    fontFamily: F.body, fontSize: 14, color: C.textSecondary,
    marginBottom: 26, lineHeight: 22,
  },

  fieldWrap: { marginBottom: 16 },
  label: {
    fontFamily: F.semibold, fontSize: 12, color: C.textSecondary,
    marginBottom: 7, letterSpacing: 0.3,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.25)', borderWidth: 1.5,
    borderColor: C.glassBorder, paddingVertical: 14,
    paddingHorizontal: 18, borderRadius: 16,
    fontFamily: F.body, fontSize: 16, color: C.textPrimary,
  },
  inputFocused: { borderColor: C.gold, backgroundColor: 'rgba(212,168,83,0.10)' },

  forgot: { alignSelf: 'flex-end', marginBottom: 18, marginTop: -6 },
  forgotText: { fontFamily: F.semibold, color: C.gold, fontSize: 13 },

  btn: {
    backgroundColor: C.textPrimary, paddingVertical: 17,
    borderRadius: 9999, alignItems: 'center', marginTop: 4, ...SHADOW_MD,
  },
  btnLoading: { backgroundColor: 'rgba(240,237,230,0.35)' },
  btnText: { fontFamily: F.bold, color: C.gradientDeep, fontSize: 16, letterSpacing: 0.3 },

  switchRow: { alignItems: 'center', paddingVertical: 14 },
  switchText: { fontFamily: F.body, color: C.textSecondary, fontSize: 14 },
  switchLink: { fontFamily: F.extraBold, color: C.textPrimary },
});
