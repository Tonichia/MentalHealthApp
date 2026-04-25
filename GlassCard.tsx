import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { C, SHADOW_MD } from './theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'light' | 'dark' | 'gold';
}

/**
 * GlassCard — frosted glass panel over the gradient background.
 * Mimics Calm's translucent content cards.
 */
export const GlassCard: React.FC<Props> = ({ children, style, variant = 'light' }) => {
  const bg = variant === 'dark'
    ? C.glassDark
    : variant === 'gold'
    ? C.goldFaint
    : C.glass;

  const border = variant === 'dark' ? C.glassDarkBorder : C.glassBorder;

  return (
    <View style={[styles.card, { backgroundColor: bg, borderColor: border }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    ...SHADOW_MD,
  },
});
