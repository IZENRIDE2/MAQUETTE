import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, radius, fonts } from '@/theme';

/** Petite pastille colorée (statut, prix, distance). */
export function Pill({
  label,
  color = colors.neonBright,
  bg,
  border,
  style,
}: {
  label: string;
  color?: string;
  bg?: string;
  border?: string;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: bg ?? 'rgba(77,143,255,0.15)', borderColor: border ?? color },
        style,
      ]}
    >
      <Text style={[styles.pillTxt, { color }]}>{label}</Text>
    </View>
  );
}

/** Étiquette (catégorie, tag moto). */
export function Tag({ label, style, textStyle }: { label: string; style?: ViewStyle; textStyle?: TextStyle }) {
  return (
    <View style={[styles.tag, style]}>
      <Text style={[styles.tagTxt, textStyle]}>{label}</Text>
    </View>
  );
}

/** Séparateur horizontal fin. */
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

/** Libellé de section en capitales. */
export function SectionLabel({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.sectionLabel, style]}>{children}</Text>;
}

/** Point "live" vert clignotant (simplifié : statique). */
export function LiveDot({ color = colors.success, size = 8 }: { color?: string; size?: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
}

/** Interrupteur on/off contrôlable. */
export function Switch({
  value,
  onChange,
}: {
  value?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [on, setOn] = useState(!!value);
  const toggle = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };
  return (
    <Pressable onPress={toggle} style={[styles.switch, on && styles.switchOn]}>
      <View style={[styles.knob, on && { transform: [{ translateX: 16 }] }]} />
    </Pressable>
  );
}

/** Ligne de réglage / liste (label + valeur + chevron éventuel). */
export function ListRow({
  icon,
  title,
  subtitle,
  right,
  onPress,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      {icon ? <View style={styles.rowIcon}>{icon}</View> : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {right}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pillTxt: { fontFamily: fonts.monoBold, fontSize: 11 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.line,
    alignSelf: 'flex-start',
  },
  tagTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 12 },
  sectionLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 11,
    color: colors.inkDim,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  switch: {
    width: 36,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 2,
    justifyContent: 'center',
  },
  switchOn: { backgroundColor: colors.neon },
  knob: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(77,143,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  rowSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: 2 },
});
