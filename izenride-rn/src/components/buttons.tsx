import React from 'react';
import { Text, Pressable, StyleSheet, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, fonts, shadow } from '@/theme';

type BtnProps = {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
};

/** Bouton principal — dégradé néon bleu. */
export function PrimaryButton({ label, onPress, icon, style, disabled }: BtnProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: pressed || disabled ? 0.85 : 1 }, style]}>
      <LinearGradient
        colors={[colors.neon, '#2563eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.primary, shadow.neon]}
      >
        {icon}
        <Text style={styles.primaryText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/** Bouton secondaire — verre sombre, bordure fine. */
export function GhostButton({ label, onPress, icon, style, disabled }: BtnProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.ghost, { opacity: pressed ? 0.7 : 1 }, style]}
    >
      {icon}
      <Text style={styles.ghostText}>{label}</Text>
    </Pressable>
  );
}

/** Bouton icône carré (actions flottantes carte, etc.). */
export function IconButton({
  children,
  onPress,
  style,
  active,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        active && { borderColor: colors.neon },
        { transform: [{ scale: pressed ? 0.96 : 1 }] },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: radius.lg,
    paddingHorizontal: 20,
  },
  primaryText: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  ghost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.panelSoft,
    paddingHorizontal: 20,
  },
  ghostText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
});
