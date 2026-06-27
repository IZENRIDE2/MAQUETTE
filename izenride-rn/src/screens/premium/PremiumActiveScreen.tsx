import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Heart, Zap, Eye, Check, ArrowRight } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, shadow } from '@/theme';

const GOLD = '#FAC775';

const PERKS = [
  { icon: <Heart size={17} color={GOLD} />, label: 'Likes illimités' },
  { icon: <Zap size={17} color={GOLD} />, label: 'Boost & Super Likes' },
  { icon: <Eye size={17} color={GOLD} />, label: "Voir qui t'a liké" },
];

const CONFETTI = [
  { left: '18%', color: GOLD },
  { left: '34%', color: colors.neon },
  { left: '52%', color: colors.success },
  { left: '68%', color: colors.purple },
  { left: '82%', color: GOLD },
];

/** Premium activé — écran de bienvenue après souscription. */
export default function PremiumActiveScreen() {
  const router = useRouter();

  return (
    <Screen scroll={false} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['rgba(250,199,117,0.13)', 'transparent']}
        style={styles.ambient}
        pointerEvents="none"
      />

      {/* Confetti (statique) */}
      <View pointerEvents="none" style={styles.confettiLayer}>
        {CONFETTI.map((c, i) => (
          <View key={i} style={[styles.confetti, { left: c.left as any, top: 40 + (i % 3) * 70, backgroundColor: c.color }]} />
        ))}
      </View>

      <View style={styles.center}>
        <LinearGradient
          colors={['rgba(250,199,117,0.2)', 'rgba(250,199,117,0.05)']}
          style={styles.heroIc}
        >
          <Crown size={46} color={GOLD} fill={GOLD} />
        </LinearGradient>
        <Text style={styles.title}>
          Bienvenue dans{'\n'}
          <Text style={{ color: GOLD }}>Premium</Text> 🎉
        </Text>
        <Text style={styles.sub}>
          Ton abonnement est actif. Profite de tous tes avantages dès maintenant.
        </Text>
      </View>

      <View style={styles.perks}>
        {PERKS.map((p) => (
          <View key={p.label} style={styles.perk}>
            <View style={styles.perkIc}>{p.icon}</View>
            <Text style={styles.perkLabel}>{p.label}</Text>
            <View style={styles.perkChk}>
              <Check size={10} color="#fff" strokeWidth={3} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.ctaZone}>
        <Pressable>
          <LinearGradient colors={[colors.neon, '#2E7FCC']} style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryTxt}>C'est parti</Text>
            <ArrowRight size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  ambient: { position: 'absolute', top: 0, left: 0, right: 0, height: 340 },
  confettiLayer: { ...StyleSheet.absoluteFillObject },
  confetti: { position: 'absolute', width: 8, height: 8, borderRadius: 2, opacity: 0.9 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, gap: 12 },
  heroIc: { width: 96, height: 96, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.4)', ...shadow.card },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, textAlign: 'center', lineHeight: 32 },
  sub: { fontFamily: fonts.regular, fontSize: 15, color: colors.inkDim, textAlign: 'center', lineHeight: 23, maxWidth: 310 },

  perks: { gap: 9, marginBottom: 6 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 13 },
  perkIc: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(250,199,117,0.13)', alignItems: 'center', justifyContent: 'center' },
  perkLabel: { flex: 1, fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  perkChk: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },

  ctaZone: { paddingTop: 14, paddingBottom: 8 },
  btnPrimary: { height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.neon },
  btnPrimaryTxt: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
});
