import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, ScrollView } from 'react-native';
import { supabase } from './supabase';

export const AuthScreen = () => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim() } },
    });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email for the confirmation link, or log in directly if auto-confirm is enabled!');
    }
    setLoading(false);
  }

  async function resetPassword() {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address to receive a password reset link.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email for the password reset link!');
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <View style={styles.logoMark}>
            <Text style={styles.logoEmoji}>🧠</Text>
          </View>
          <Text style={styles.brandName}>Mind Matter</Text>
          <Text style={styles.brandTagline}>Your premium mental health companion</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {mode === 'signIn' ? 'Welcome back' : 'Create account'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {mode === 'signIn'
              ? 'Sign in to continue your journey.'
              : 'Start your mental health journey today.'}
          </Text>

          {mode === 'signUp' && (
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="Display Name"
              autoCapitalize="words"
              placeholderTextColor="#94A3B8"
            />
          )}
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email address"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#94A3B8"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            placeholderTextColor="#94A3B8"
          />

          {mode === 'signIn' && (
            <TouchableOpacity style={styles.forgotButton} onPress={resetPassword} disabled={loading}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonLoading]}
            disabled={loading}
            onPress={mode === 'signIn' ? signInWithEmail : signUpWithEmail}
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
          onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
        >
          <Text style={styles.switchText}>
            {mode === 'signIn' ? "Don't have an account? " : 'Already have an account? '}
            <Text style={styles.switchLink}>
              {mode === 'signIn' ? 'Sign Up' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, flexGrow: 1 },

  // Brand header
  brandSection: { alignItems: 'center', paddingTop: 36, paddingBottom: 28 },
  logoMark: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  logoEmoji: { fontSize: 34 },
  brandName: { fontSize: 26, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5, marginBottom: 4 },
  brandTagline: { fontSize: 14, color: '#94A3B8', fontWeight: '500' },

  // Form card
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 6, letterSpacing: -0.3 },
  cardSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 24, lineHeight: 21 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 14,
  },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 16, marginTop: -6 },
  forgotText: { color: '#2563EB', fontSize: 13, fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonLoading: { backgroundColor: '#64748B' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Switch row
  switchRow: { alignItems: 'center', paddingVertical: 14 },
  switchText: { color: '#64748B', fontSize: 14 },
  switchLink: { color: '#0F172A', fontWeight: '800' },
});
