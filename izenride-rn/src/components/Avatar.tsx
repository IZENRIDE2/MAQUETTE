import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '@/theme';

type Props = {
  /** Initiales ou enfant custom (icône) */
  label?: string;
  children?: React.ReactNode;
  size?: number;
  /** Bordure blanche (style "rider" sur carte) */
  ring?: boolean;
  style?: ViewStyle;
};

/** Pastille avatar circulaire — dégradé bleu IZEN. */
export default function Avatar({ label, children, size = 44, ring, style }: Props) {
  return (
    <LinearGradient
      colors={[colors.izenLight, colors.izen]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.av,
        { width: size, height: size, borderRadius: size / 2 },
        ring && { borderWidth: 3, borderColor: '#fff' },
        style,
      ]}
    >
      {children ?? (
        <Text style={[styles.txt, { fontSize: size * 0.4 }]}>{label}</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  av: { alignItems: 'center', justifyContent: 'center' },
  txt: { fontFamily: fonts.bold, color: '#fff' },
});
