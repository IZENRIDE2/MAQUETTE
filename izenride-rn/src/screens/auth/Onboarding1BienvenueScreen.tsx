import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart, MapPin, Calendar, ArrowRight } from 'lucide-react-native';
import { Screen, Logo, PrimaryButton } from '@/components';
import { colors, fonts } from '@/theme';

/** Onboarding 1/4 — Bienvenue (hero centré + features + CTA). */
export default function Onboarding1BienvenueScreen() {
  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <Logo size={108} />
        <Text style={styles.brand}>IzenRide</Text>
        <Text style={styles.title}>
          La communauté{'\n'}des motards <Text style={styles.titleAccent}>zen</Text>
        </Text>
        <Text style={styles.sub}>
          Rencontre des riders près de toi, roule en sécurité et partage la route. Tout commence ici.
        </Text>

        <View style={styles.feats}>
          <Feat color={colors.neon} label="Matcher">
            <Heart size={19} color={colors.neon} />
          </Feat>
          <Feat color={colors.success} label="Rouler">
            <MapPin size={19} color={colors.success} />
          </Feat>
          <Feat color={colors.warn} label="Événements">
            <Calendar size={19} color={colors.warn} />
          </Feat>
        </View>
      </View>

      <View style={styles.cta}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotOn]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <PrimaryButton label="Commencer" icon={<ArrowRight size={18} color="#fff" strokeWidth={2.5} />} />
        <Text style={styles.link}>
          Déjà membre ? <Text style={styles.linkAccent}>Se connecter</Text>
        </Text>
      </View>
    </Screen>
  );
}

function Feat({ children, label, color }: { children: React.ReactNode; label: string; color: string }) {
  return (
    <View style={styles.feat}>
      <View style={[styles.featIcon, { borderColor: color + '40' }]}>{children}</View>
      <Text style={styles.featLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  brand: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.neon,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 30,
    marginBottom: 14,
  },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, textAlign: 'center', lineHeight: 32, marginBottom: 12, letterSpacing: -0.5 },
  titleAccent: { color: colors.neon },
  sub: { fontFamily: fonts.regular, fontSize: 15, color: colors.inkDim, textAlign: 'center', lineHeight: 23, maxWidth: 310 },
  feats: { flexDirection: 'row', gap: 18, marginTop: 28 },
  feat: { alignItems: 'center', gap: 7 },
  featIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkDim },

  cta: { gap: 10, paddingBottom: 8 },
  dots: { flexDirection: 'row', gap: 7, justifyContent: 'center', marginBottom: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.lineStrong },
  dotOn: { width: 22, borderRadius: 4, backgroundColor: colors.neon },
  link: { textAlign: 'center', fontFamily: fonts.regular, fontSize: 14, color: colors.inkDim, paddingVertical: 6 },
  linkAccent: { color: colors.neon, fontFamily: fonts.semibold },
});
