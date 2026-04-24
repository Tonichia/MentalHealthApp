import React from 'react';
import { View, Image, StyleSheet, ViewProps } from 'react-native';

const GRAIN_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsBUKa1Nx7WDX7jchi86lBTz5nJuVEsTIiU2KHwK0OMJA9QvHr4GzSuKSaYNt9yjEwmEEWl1-rsD9b6_WREZFkS2lPbPwnbA0ux10NJfhIj7b4GMyOaCYDgzUR4kRz98QuUuvp9vpbb8AWG-OmXGDbd6Woq9xwRFkXL2xxPpP-GOwapHvnE0y_X7rxgDxSzBh9O1Xh_KmKbm41Omqwk-VdI0AfhbFIuHBQRr3WYMqXOILJvQ1Kgi6axPpiek1Xtr_T-IYYUCfR_C4';

interface PaperGrainViewProps extends ViewProps {
  /**
   * Controls how strong the grain effect is. 
   * 0.05 to 0.15 is usually best for a subtle 'overlay' blend effect.
   */
  intensity?: number;
}

export const PaperGrainView: React.FC<PaperGrainViewProps> = ({ 
  children, 
  style, 
  intensity = 0.08,
  ...props 
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
      <Image 
        source={{ uri: GRAIN_URL }} 
        style={[styles.grainOverlay, { opacity: intensity }]} 
        resizeMode="cover"
        pointerEvents="none" // Ensures the grain doesn't block touches!
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // Keeps the grain within the border radius of the parent
  },
  grainOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  }
});