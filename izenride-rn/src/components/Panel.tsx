import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '@/theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Couleur de bordure d'accent (ex. colors.neon) */
  accent?: string;
  /** Padding interne (défaut 16) */
  pad?: number;
};

/**
 * Carte "verre" sombre : fond translucide, bordure fine, ombre douce.
 * Remplace l'effet backdrop-filter de la maquette (fidélité moyenne).
 */
export default function Panel({ children, style, accent, pad = 16 }: Props) {
  return (
    <View
      style={[
        styles.panel,
        { padding: pad },
        accent ? { borderColor: accent } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    ...shadow.card,
  },
});
