import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Clock, ChevronRight, RefreshCw, ArrowRight } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts, radius } from '@/theme';

/**
 * Vérification email — état "en attente" (lien envoyé).
 * Étape 3/5 du parcours d'inscription.
 */
export default function VerificationEmailScreen() {
  const infoSteps = [
    { title: "Ouvre l'email", desc: 'Reçu sous ~1 minute dans ta boîte de réception.' },
    { title: 'Clique sur le lien', desc: "Tu reviens automatiquement dans l'app, pas besoin de code." },
    { title: 'Profite', desc: 'Ton compte est activé, tu peux rejoindre la tribu.' },
  ];

  return (
    <Screen pad={0}>
      <View style={styles.headerWrap}>
        <AppBar
          title="Vérification email"
          right={<View style={styles.stepBadge}><Text style={styles.stepTxt}>3 / 5</Text></View>}
        />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Mail size={44} color={colors.neon} />
        </View>
        <Text style={styles.title}>Confirme ton email</Text>
        <Text style={styles.subtitle}>
          On t'a envoyé un lien de vérification. Clique dessus pour activer ton compte rider.
        </Text>
      </View>

      {/* Chip email */}
      <View style={styles.chip}>
        <View style={styles.chipIcon}>
          <Mail size={18} color={colors.neon} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.chipLabel}>Envoyé à</Text>
          <Text style={styles.chipValue} numberOfLines={1}>christophe@izenride.com</Text>
        </View>
        <Pressable style={styles.chipEdit}>
          <Text style={styles.chipEditTxt}>Modifier</Text>
        </Pressable>
      </View>

      {/* Panneau info */}
      <View style={styles.infoPanel}>
        <View style={styles.infoHeader}>
          <Clock size={16} color={colors.neon} />
          <Text style={styles.infoHeaderTxt}>Comment ça marche</Text>
        </View>
        {infoSteps.map((s, i) => (
          <View key={s.title} style={styles.infoStep}>
            <View style={styles.infoStepNum}>
              <Text style={styles.infoStepNumTxt}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoStepTitle}>{s.title}</Text>
              <Text style={styles.infoStepDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Action card */}
      <View style={styles.actionCards}>
        <Pressable style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Mail size={20} color={colors.neon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Ouvrir l'app Mail</Text>
            <Text style={styles.actionDesc}>Accéder à ta boîte de réception</Text>
          </View>
          <ChevronRight size={18} color={colors.inkMute} />
        </Pressable>
      </View>

      {/* CTA */}
      <View style={styles.ctaZone}>
        <Pressable>
          <LinearGradient colors={[colors.neon, '#2E7FCC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaPrimary}>
            <Text style={styles.ctaPrimaryTxt}>J'ai vérifié, continuer</Text>
            <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
        <View style={styles.resend}>
          <Text style={styles.resendQuestion}>Pas reçu ?</Text>
          <Pressable style={styles.resendBtn} disabled>
            <RefreshCw size={14} color={colors.inkMute} />
            <Text style={styles.resendBtnTxt}>Renvoyer dans</Text>
            <Text style={styles.countdown}>0:60</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: 18 },
  stepBadge: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  stepTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim, letterSpacing: 0.4 },

  hero: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24, alignItems: 'center' },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(77,143,255,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(77,143,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, textAlign: 'center', marginBottom: 12, letterSpacing: -0.6 },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, color: colors.inkDim, textAlign: 'center', lineHeight: 22, maxWidth: 320 },

  chip: {
    marginHorizontal: 24,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(77,143,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  chipValue: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  chipEdit: {
    backgroundColor: 'rgba(77,143,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.25)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipEditTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.neonBright },

  infoPanel: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: 'rgba(77,143,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.14)',
    borderRadius: 16,
    padding: 16,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(77,143,255,0.1)' },
  infoHeaderTxt: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  infoStep: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  infoStepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(77,143,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoStepNumTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.neonBright },
  infoStepTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  infoStepDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 17 },

  actionCards: { marginHorizontal: 24, marginTop: 18 },
  actionCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(77,143,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  actionDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },

  ctaZone: { marginTop: 'auto', paddingHorizontal: 24, paddingTop: 18, paddingBottom: 12 },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 17,
    marginBottom: 8,
  },
  ctaPrimaryTxt: { fontFamily: fonts.semibold, fontSize: 16, color: '#fff' },
  resend: { alignItems: 'center' },
  resendQuestion: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkMute, marginBottom: 4 },
  resendBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6 },
  resendBtnTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkMute },
  countdown: { fontFamily: fonts.mono, fontSize: 13, color: colors.inkMute },
});
