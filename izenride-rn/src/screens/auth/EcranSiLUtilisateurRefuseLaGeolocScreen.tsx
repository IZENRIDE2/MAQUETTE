import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Lock, ArrowRight } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts } from '@/theme';

type Step = { text: React.ReactNode; hint?: string };

const IOS_STEPS: Step[] = [
  { text: <>Ouvre <Chip>Réglages</Chip></>, hint: "Depuis l'écran d'accueil de ton iPhone" },
  { text: <>Descends jusqu'à <Chip>Confidentialité et sécurité</Chip></> },
  { text: <>Touche <Chip>Service de localisation</Chip> et active-le</> },
  {
    text: <>Trouve <Chip>IzenRide</Chip> dans la liste, choisis <Chip variant="green">Lorsque l'app est active</Chip></>,
    hint: '"Toujours" recommandé pour le suivi de tribu en roulage',
  },
  { text: <>Active <Chip variant="blue">Position précise</Chip></>, hint: 'Indispensable pour la navigation et les zones de sécurité' },
];

const ANDROID_STEPS: Step[] = [
  { text: <>Ouvre les <Chip>Paramètres</Chip></>, hint: 'Tire le panneau de notifications et appuie sur l\'icône engrenage' },
  { text: <>Va dans <Chip>Localisation</Chip></>, hint: 'Ou tape "localisation" dans la barre de recherche' },
  { text: <>Active <Chip variant="green">Utiliser la localisation</Chip> en haut de l'écran</> },
  { text: <>Touche <Chip>Autorisations des applis</Chip> puis <Chip>IzenRide</Chip></> },
  {
    text: <>Choisis <Chip variant="blue">Toujours autoriser</Chip> et active <Chip>Position précise</Chip></>,
    hint: '"Toujours" est requis pour le suivi en roulage et les zones de sécurité',
  },
];

/**
 * Écran affiché si l'utilisateur refuse la géolocalisation.
 * Guide d'activation iOS / Android + mode dégradé. Localisé Paris / Île-de-France.
 */
export default function EcranSiLUtilisateurRefuseLaGeolocScreen() {
  const [os, setOs] = useState<'ios' | 'android'>('ios');
  const steps = os === 'ios' ? IOS_STEPS : ANDROID_STEPS;

  return (
    <Screen pad={0}>
      <View style={styles.headerWrap}>
        <AppBar title="Localisation" />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <MapPin size={36} color={colors.warn} />
          </View>
          <View style={styles.slash} />
        </View>
        <Text style={styles.title}>Active la localisation</Text>
        <Text style={styles.subtitle}>
          Sans GPS, impossible de te connecter aux riders proches ni de proposer la navigation.
          Voici comment l'activer en 10 secondes.
        </Text>
      </View>

      {/* Sélecteur OS */}
      <View style={styles.osSwitcher}>
        {(['ios', 'android'] as const).map((o) => (
          <Pressable key={o} onPress={() => setOs(o)} style={[styles.osBtn, os === o && styles.osBtnOn]}>
            <Text style={[styles.osTxt, os === o && { color: colors.ink }]}>
              {o === 'ios' ? 'iOS' : 'Android'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Étapes */}
      <View style={styles.stepsSection}>
        <Text style={styles.sectionLabel}>Marche à suivre — {os === 'ios' ? 'iOS' : 'Android'}</Text>
        <View style={styles.steps}>
          {steps.map((s, i) => (
            <View key={i} style={[styles.step, i > 0 && styles.stepBorder]}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumTxt}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepText}>{s.text}</Text>
                {s.hint ? <Text style={styles.stepHint}>{s.hint}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Info confidentialité */}
      <View style={styles.info}>
        <View style={styles.infoIcon}>
          <Lock size={16} color={colors.neon} />
        </View>
        <Text style={styles.infoTxt}>
          <Text style={styles.infoStrong}>Ta position reste privée. </Text>
          <Text style={styles.infoDim}>
            Visible uniquement par toi et les riders que tu autorises explicitement. Tu peux la couper à tout moment.
          </Text>
        </Text>
      </View>

      {/* CTAs */}
      <View style={styles.ctaZone}>
        <Pressable>
          <LinearGradient colors={[colors.neon, '#2E7FCC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaPrimary}>
            <Text style={styles.ctaPrimaryTxt}>Ouvrir les Réglages</Text>
            <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.ctaSecondary}>
          <Text style={styles.ctaSecondaryTxt}>J'ai activé, vérifier à nouveau</Text>
        </Pressable>
        <Pressable style={styles.degradedLink}>
          <Text style={styles.degradedTxt}>
            Continuer sans GPS — <Text style={{ color: colors.warn, fontFamily: fonts.semibold }}>mode dégradé</Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function Chip({ children, variant }: { children: React.ReactNode; variant?: 'green' | 'blue' }) {
  const tint =
    variant === 'green'
      ? { color: colors.successText, bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)' }
      : variant === 'blue'
      ? { color: colors.neonBright, bg: 'rgba(77,143,255,0.1)', border: 'rgba(77,143,255,0.25)' }
      : { color: colors.ink, bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.08)' };
  return (
    <Text style={[styles.chip, { color: tint.color, backgroundColor: tint.bg, borderColor: tint.border }]}>
      {' '}{children}{' '}
    </Text>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: 16 },

  hero: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, alignItems: 'center' },
  iconWrap: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(251,191,36,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(251,191,36,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slash: {
    position: 'absolute',
    width: 56,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.danger,
    transform: [{ rotate: '-45deg' }],
  },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, textAlign: 'center', marginBottom: 10, letterSpacing: -0.5 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkDim, textAlign: 'center', lineHeight: 21, maxWidth: 300 },

  osSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  osBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8 },
  osBtnOn: { backgroundColor: '#1f2330', borderWidth: 1, borderColor: '#2a2f3d' },
  osTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkMute },

  stepsSection: { paddingHorizontal: 16, marginBottom: 16 },
  sectionLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingLeft: 4 },
  steps: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 16, overflow: 'hidden' },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 14 },
  stepBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(77,143,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumTxt: { fontFamily: fonts.bold, fontSize: 13, color: colors.neonBright },
  stepText: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 22 },
  stepHint: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 4, lineHeight: 17 },
  chip: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },

  info: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(77,143,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.15)',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(77,143,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTxt: { flex: 1, fontSize: 13, lineHeight: 20 },
  infoStrong: { fontFamily: fonts.semibold, color: colors.ink },
  infoDim: { fontFamily: fonts.regular, color: colors.inkDim },

  ctaZone: { marginTop: 'auto', paddingHorizontal: 16, paddingBottom: 12 },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  ctaPrimaryTxt: { fontFamily: fonts.semibold, fontSize: 16, color: '#fff' },
  ctaSecondary: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  ctaSecondaryTxt: { fontFamily: fonts.medium, fontSize: 15, color: colors.ink },
  degradedLink: { alignItems: 'center', paddingVertical: 8, marginTop: 4 },
  degradedTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },
});
