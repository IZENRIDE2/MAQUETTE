import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, Pattern, Path, Rect, G, Text as SvgText, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme';

/**
 * Fond de carte stylisé — Paris / Île-de-France.
 * Grille + axes routiers + quartiers parisiens (Montmartre, Le Marais, Bercy...).
 * Remplace le rendu MapLibre (fidélité moyenne, statique).
 */
export default function MapBackground({ style }: { style?: ViewStyle }) {
  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <LinearGradient colors={['#0a1428', colors.bg]} style={StyleSheet.absoluteFill} />
      <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <Pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <Path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(77,143,255,0.06)" strokeWidth={1} />
          </Pattern>
          <SvgGrad id="roadGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="rgba(184,197,221,0.5)" />
            <Stop offset="100%" stopColor="rgba(122,146,184,0.3)" />
          </SvgGrad>
        </Defs>
        <Rect width="400" height="800" fill="url(#grid)" />

        {/* Axes principaux (boulevards parisiens) */}
        <Path d="M 0 280 Q 100 300, 200 280 T 400 310" stroke="rgba(122,146,184,0.28)" strokeWidth={20} fill="none" />
        <Path d="M 0 280 Q 100 300, 200 280 T 400 310" stroke="url(#roadGlow)" strokeWidth={1.5} fill="none" />
        <Path d="M 200 0 Q 220 200, 200 400 T 250 800" stroke="rgba(122,146,184,0.28)" strokeWidth={20} fill="none" />
        <Path d="M 200 0 Q 220 200, 200 400 T 250 800" stroke="url(#roadGlow)" strokeWidth={1.5} fill="none" />

        {/* Rues secondaires */}
        <Path d="M 0 120 L 250 130" stroke="rgba(122,146,184,0.18)" strokeWidth={10} fill="none" />
        <Path d="M 100 0 L 95 200" stroke="rgba(122,146,184,0.16)" strokeWidth={9} fill="none" />
        <Path d="M 0 580 L 400 570" stroke="rgba(122,146,184,0.22)" strokeWidth={13} fill="none" />
        <Path d="M 0 700 L 200 690" stroke="rgba(122,146,184,0.16)" strokeWidth={8} fill="none" />

        {/* Bâti (POI flous) */}
        <G opacity={0.3}>
          <Rect x="50" y="200" width="40" height="50" rx="4" fill="rgba(122,146,184,0.2)" />
          <Rect x="320" y="180" width="50" height="40" rx="4" fill="rgba(122,146,184,0.2)" />
          <Rect x="40" y="380" width="40" height="60" rx="4" fill="rgba(122,146,184,0.2)" />
          <Rect x="290" y="620" width="60" height="50" rx="4" fill="rgba(122,146,184,0.2)" />
        </G>

        {/* Quartiers parisiens */}
        <SvgText x="70" y="160" fill="rgba(168,176,192,0.32)" fontSize="11" letterSpacing="2">MONTMARTRE</SvgText>
        <SvgText x="250" y="500" fill="rgba(168,176,192,0.32)" fontSize="11" letterSpacing="2">LE MARAIS</SvgText>
        <SvgText x="50" y="740" fill="rgba(168,176,192,0.32)" fontSize="11" letterSpacing="2">BERCY</SvgText>
      </Svg>
    </View>
  );
}
