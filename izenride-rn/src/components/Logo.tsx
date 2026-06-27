import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Path } from 'react-native-svg';
import { colors } from '@/theme';

/** Marque IzenRide — casque stylisé (repris du SVG de la maquette). */
export default function Logo({ size = 44, glow = true }: { size?: number; glow?: boolean }) {
  return (
    <LinearGradient
      colors={[colors.izenBright, colors.izenDeep]}
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size / 2 },
        glow && {
          shadowColor: colors.izenBright,
          shadowOpacity: 0.5,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 0 },
          elevation: 8,
        },
      ]}
    >
      <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 32 32" fill="none">
        <G stroke="#ffffff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M 11 5 L 11 16" />
          <Path d="M 16 4 L 16 16" />
          <Path d="M 8 13 Q 8 10, 11 10" />
          <Path d="M 19 13 Q 19 10, 16 10" />
          <Path d="M 8 16 Q 6 17, 7 19" />
          <Path d="M 7 16 Q 7 23, 12 24 L 18 24 Q 23 23, 23 16 Q 23 14, 21 14 L 18 14" />
        </G>
      </Svg>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
