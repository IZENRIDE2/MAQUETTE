import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Check, ArrowRight, Info } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts } from '@/theme';

/** Vérification email — succès. Compte activé, prochaine étape : profil moto. */
export default function VerificationEmailSuccesScreen() {
  return (
    <Screen scroll={false} pad={0}>
      <View style={styles.center}>
        <View style={styles.heroIc}>
          <View style={styles.glow} />
          <Mail size={46} color={colors.success} strokeWidth={2} />
          <View style={styles.badge}>
            <Check size={15} color="#08090E" strokeWidth={3} />
          </View>
        </View>
        <Text style={styles.title}>
          Email vérifié <Text style={{ color: colors.success }}>✓</Text>
        </Text>
        <Text style={styles.subtitle}>
          Ton adresse <Text style={styles.strong}>christophe@izenride.com</Text> est confirmée.
          Ton compte IzenRide est maintenant pleinement actif.
        </Text>
      </View>

      {/* Info strip */}
      <View style={styles.infoStrip}>
        <Info size={18} color={colors.success} />
        <Text style={styles.infoTxt}>
          Prochaine étape : <Text style={styles.infoStrong}>complète ton profil moto</Text> pour commencer à matcher.
        </Text>
      </View>

      {/* CTA */}
      <View style={styles.ctaZone}>
        <Pressable>
          <LinearGradient colors={[colors.neon, '#2E7FCC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaPrimary}>
            <Text style={styles.ctaPrimaryTxt}>Continuer vers l'app</Text>
            <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  heroIc: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: 'rgba(74,202,165,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(74,222,128,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  glow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(74,222,128,0.18)',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, color: colors.inkDim, textAlign: 'center', lineHeight: 23, maxWidth: 310 },
  strong: { fontFamily: fonts.semibold, color: colors.ink },

  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginHorizontal: 24,
    marginBottom: 4,
  },
  infoTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.ink, lineHeight: 17 },
  infoStrong: { fontFamily: fonts.semibold, color: colors.successText },

  ctaZone: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 22 },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 16,
  },
  ctaPrimaryTxt: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
});
