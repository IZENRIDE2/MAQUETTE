import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, Clock, Ban, X, FileText } from 'lucide-react-native';
import { Screen, PrimaryButton, GhostButton, LiveDot } from '@/components';
import { colors, fonts, radius } from '@/theme';

const RESTRICTIONS = [
  'Vous ne pouvez pas rejoindre de balades',
  'La messagerie est désactivée',
  'Vos annonces marketplace sont masquées',
  "Création d'événements bloquée",
];

const META: { label: string; value: string; color?: string }[] = [
  { label: 'Date', value: '22 avr. 2026, 18:34' },
  { label: 'Durée', value: '7 jours', color: colors.warn },
  { label: 'Signalements', value: '3 confirmés' },
  { label: 'Avertissement', value: '1er sur 3' },
];

export default function CompteSuspenduScreen() {
  return (
    <Screen pad={16}>
      {/* Status pill */}
      <View style={[styles.pill, { alignSelf: 'center' }]}>
        <LiveDot color={colors.warn} size={6} />
        <Text style={styles.pillTxt}>COMPTE SUSPENDU TEMPORAIREMENT</Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <AlertTriangle size={40} color={colors.warn} />
        </View>
        <Text style={styles.heroTitle}>Votre compte est suspendu</Text>
        <Text style={styles.heroSub}>
          Suite à un signalement vérifié, l'accès à IzenRide est temporairement restreint le temps que la situation soit résolue.
        </Text>
      </View>

      {/* Countdown */}
      <View style={styles.countdown}>
        <View style={styles.countdownIcon}>
          <Clock size={22} color={colors.warn} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.countdownLabel}>Levée automatique dans</Text>
          <Text style={styles.countdownValue}>
            <Text style={styles.countdownNum}>6</Text> j <Text style={styles.countdownNum}>14</Text> h{' '}
            <Text style={styles.countdownNum}>22</Text> min
          </Text>
        </View>
      </View>

      {/* Reason */}
      <View style={[styles.card, styles.amberAccent]}>
        <Text style={styles.reasonLabel}>Motif de la décision</Text>
        <Text style={styles.reasonTitle}>Comportement inapproprié signalé en messagerie</Text>
        <Text style={styles.reasonDesc}>
          Plusieurs riders ont signalé des messages contenant <Text style={styles.strong}>un langage offensant</Text> envoyés
          via la messagerie privée IzenRide. Notre équipe modération a vérifié ces signalements et conclu à une infraction à{' '}
          <Text style={styles.strong}>l'article 4.2 de la Charte Communauté</Text>.
        </Text>
        <View style={styles.quote}>
          <Text style={styles.quoteLabel}>Extrait identifié</Text>
          <Text style={styles.quoteTxt}>« contenu masqué pour respecter la confidentialité des échanges »</Text>
        </View>
        <View style={styles.metaGrid}>
          {META.map((m) => (
            <View key={m.label} style={styles.metaItem}>
              <Text style={styles.metaLabel}>{m.label}</Text>
              <Text style={[styles.metaValue, m.color && { color: m.color }]}>{m.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Restrictions */}
      <View style={styles.restrictions}>
        <View style={styles.restrictHeader}>
          <Ban size={18} color={colors.danger} />
          <Text style={styles.restrictTitle}>Pendant la suspension</Text>
        </View>
        {RESTRICTIONS.map((r) => (
          <View key={r} style={styles.restrictItem}>
            <X size={14} color={colors.danger} strokeWidth={2.5} />
            <Text style={styles.restrictTxt}>{r}</Text>
          </View>
        ))}
      </View>

      {/* Rules link */}
      <View style={styles.rules}>
        <View style={styles.rulesIcon}>
          <FileText size={16} color={colors.neon} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rulesTitle}>Charte Communauté IzenRide</Text>
          <Text style={styles.rulesTxt}>
            Familiarisez-vous avec les <Text style={styles.link}>règles de bonne conduite</Text> pour éviter de futures
            sanctions.
          </Text>
        </View>
      </View>

      {/* Reference */}
      <View style={styles.ref}>
        <Text style={styles.refLabel}>N° de dossier</Text>
        <Text style={styles.refValue}>MOD-2026-04-A8C2F1</Text>
      </View>

      {/* Actions */}
      <PrimaryButton label="Contester la décision" style={{ marginTop: 8 }} />
      <GhostButton label="Contacter le support" style={{ marginTop: 10 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: 'rgba(251,191,36,0.12)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)', marginBottom: 16 },
  pillTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.warn, letterSpacing: 0.3 },

  hero: { alignItems: 'center', gap: 16, marginBottom: 20 },
  heroIcon: { width: 80, height: 80, borderRadius: 22, backgroundColor: '#1a1612', borderWidth: 1, borderColor: 'rgba(251,191,36,0.4)', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, textAlign: 'center', letterSpacing: -0.5 },
  heroSub: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute, textAlign: 'center', lineHeight: 21, paddingHorizontal: 16, marginTop: -8 },

  countdown: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(251,191,36,0.06)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)', borderRadius: radius.md, padding: 16, marginBottom: 20 },
  countdownIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(251,191,36,0.15)', alignItems: 'center', justifyContent: 'center' },
  countdownLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  countdownValue: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  countdownNum: { fontFamily: fonts.monoBold, color: colors.warn },

  card: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: radius.md, padding: 18, marginBottom: 20 },
  amberAccent: { borderLeftWidth: 3, borderLeftColor: colors.warn },
  reasonLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  reasonTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink, lineHeight: 21, marginBottom: 12 },
  reasonDesc: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkMute, lineHeight: 21 },
  strong: { fontFamily: fonts.semibold, color: colors.ink },
  quote: { backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: '#1A1E28', borderLeftWidth: 3, borderLeftColor: colors.warn, borderRadius: 12, padding: 14, marginTop: 14 },
  quoteLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  quoteTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink, fontStyle: 'italic', lineHeight: 19 },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#1A1E28' },
  metaItem: { width: '50%', marginBottom: 12 },
  metaLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  metaValue: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },

  restrictions: { backgroundColor: 'rgba(226,75,74,0.06)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.18)', borderRadius: radius.md, padding: 16, marginBottom: 20 },
  restrictHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  restrictTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  restrictItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  restrictTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, flex: 1 },

  rules: { flexDirection: 'row', gap: 12, backgroundColor: 'rgba(77,143,255,0.06)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.2)', borderRadius: radius.md, padding: 16, marginBottom: 20 },
  rulesIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(77,143,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  rulesTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 4 },
  rulesTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, lineHeight: 18 },
  link: { fontFamily: fonts.medium, color: colors.neon },

  ref: { alignItems: 'center', marginBottom: 16 },
  refLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  refValue: { fontFamily: fonts.mono, fontSize: 12, color: colors.ink, letterSpacing: 1 },
});
