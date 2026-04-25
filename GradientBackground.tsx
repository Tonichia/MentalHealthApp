import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { C } from './theme';

/**
 * GradientBackground
 * Simulates Calm's signature deep azure-to-midnight gradient using
 * layered Views (no expo-linear-gradient dependency required).
 * Drop this around any screen content.
 */
interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'deep' | 'dawn';
}

export const GradientBackground: React.FC<Props> = ({ children, style, variant = 'deep' }) => {
  const isDawn = variant === 'dawn';
  return (
    <View style={[styles.root, style]}>
      {/* Bottom layer — deep midnight */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: C.gradientDeep }]} />
      {/* Middle layer — soft teal fade */}
      <View style={[StyleSheet.absoluteFillObject, styles.midLayer, {
        backgroundColor: isDawn ? C.gradientDawn : C.gradientMid,
      }]} />
      {/* Top ambient glow */}
      <View style={[styles.glowTop, {
        backgroundColor: isDawn ? 'rgba(61,122,138,0.55)' : 'rgba(43,95,114,0.45)',
      }]} />
      {/* Bottom vignette */}
      <View style={styles.vignetteBottom} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.gradientDeep },
  midLayer: {
    opacity: 0.7,
    top: '30%',
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    borderTopLeftRadius: 200,
    borderTopRightRadius: 300,
  },
  glowTop: {
    position: 'absolute',
    top: -80, right: -80,
    width: 340, height: 340,
    borderRadius: 170,
    opacity: 0.35,
  },
  vignetteBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 180,
    backgroundColor: 'rgba(11,30,45,0.5)',
  },
});
