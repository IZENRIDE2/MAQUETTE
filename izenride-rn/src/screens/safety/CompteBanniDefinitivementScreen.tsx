import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Lock, Check, FileText, Users, Ban, Shield, Mail, ChevronRight, Clock, Download,
} from 'lucide-react-native';
import { Screen, PrimaryButton, GhostButton, LiveDot } from '@/components';
import { colors, fonts, radius } from '@/theme';

const CONSEQUENCES: { icon: React.ReactNode; title: string; desc: string }[] = [
  {
    icon: <Users size={14} color={colors.danger} />,
    title: 'Profil retiré de la communauté',
    desc: 'Votre profil, vos publications et vos annonces marketplace ne sont plus visibles.',
  },
  {
    icon: <Ban size={14} color={colors.danger} />,
    title: 'Recréation de compte interdite',
    desc: 'Toute nouvelle inscription via les mêmes identifiants (email, téléphone, appareil) sera bloquée.',
  },
  {
    icon: <Lock size={14} color={colors.danger} />,
    title: 'Solde Boost non remboursable',
    desc: 'Conformément aux CGU, les crédits Boost restants ne peuvent pas être remboursés en cas de bannissement.',
  },
  {
    icon: <Shield size={14} color={colors.danger} />,
    title: 'Données conservées 12 mois',
    desc: 'Obligation légale (Art. L34-1 CPCE). Vous pouvez exercer vos droits RGPD à tout moment.',
  },
];

const RECOURSE_STEPS = [
  { n: '1', txt: 'Soumettre votre recours', meta: ' — en ligne ou par courrier recommandé' },
  { n: '2', txt: 'Joindre vos preuves', meta: ' — captures, témoignages, justificatifs' },
  { n: '3', txt: 'Examen par le comité', meta: ' — sous 7 jours ouvrés maximum' },
  { n: '4', txt: 'Décision finale notifiée par email', meta: ' — motivée et argumentée' },
];

export default function CompteBanniDefinitivementScreen() {
  return (
    <Screen pad={16}>
      {/* Status pill */}
      <View style={styles.pill}>
        <LiveDot color={colors.danger} size={6} />
        <Text style={styles.pillTxt}>COMPTE BANNI DÉFINITIVEMENT</Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Lock size={42} color={colors.danger} />
        </View>
        <Text style={styles.heroTitle}>Accès à IzenRide bloqué</Text>
        <Text style={styles.heroSub}>
          Suite à une infraction grave à nos conditions, votre compte a été désactivé de façon permanente. Vous pouvez
          contester cette décision.
        </Text>
      </View>

      {/* Decision card */}
      <View style={styles.decisionCard}>
        <View style={styles.decisionHeader}>
          <View style={styles.stamp}>
            <Check size={10} color={colors.danger} strokeWidth={3} />
            <Text style={styles.stampTxt}>Décision finale</Text>
          </View>
          <Text style={styles.decisionDate}>25 avr. 2026 · 16:42</Text>
        </View>
        <View style={styles.decisionBody}>
          <Text style={styles.decLabel}>Motif officiel</Text>
          <Text style={styles.decValueStrong}>Mise en danger d'autres utilisateurs</Text>
          <View style={styles.decDivider} />
          <Text style={styles.decLabel}>Faits constatés</Text>
          <Text style={styles.decFacts}>
            Organisation et participation à <Text style={styles.strong}>plusieurs courses non encadrées sur voie publique</Text>,
            documentées par 7 signalements vérifiés, captures d'écran et données GPS de l'application (vitesses moyennes
            incompatibles avec une utilisation conforme au Code de la route).
          </Text>
          <View style={styles.decDivider} />
          <View style={styles.article}>
            <View style={styles.articleIcon}>
              <FileText size={16} color={colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.articleRef}>CGU · Article 6.1.a</Text>
              <Text style={styles.articleTxt}>
                Tout comportement mettant en danger la sécurité physique d'autres utilisateurs ou de tiers entraîne la
                résiliation immédiate et définitive du compte. <Text style={styles.link}>Lire l'article complet</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Consequences */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Conséquences immédiates</Text>
          <Text style={styles.sectionMeta}>Effectif maintenant</Text>
        </View>
        {CONSEQUENCES.map((c) => (
          <View key={c.title} style={styles.consequenceItem}>
            <View style={styles.consequenceIcon}>{c.icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={styles.consequenceTitle}>{c.title}</Text>
              <Text style={styles.consequenceDesc}>{c.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recourse */}
      <View style={styles.recourse}>
        <View style={styles.recourseHeader}>
          <View style={styles.recourseIcon}>
            <Shield size={18} color={colors.neon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.recourseTitle}>Procédure de recours formelle</Text>
            <Text style={styles.recourseMeta}>Examen par notre comité indépendant</Text>
          </View>
        </View>
        <Text style={styles.recourseTxt}>
          Si vous estimez cette décision <Text style={styles.strong}>injustifiée</Text>, vous pouvez saisir notre comité de
          recours. Votre dossier sera réexaminé par <Text style={styles.strong}>3 modérateurs seniors</Text> n'ayant pas
          participé à la décision initiale.
        </Text>
        <View style={styles.deadlineBadge}>
          <Clock size={12} color={colors.neon} />
          <Text style={styles.deadlineTxt}>Délai : 30 jours · Réponse sous 7 jours ouvrés</Text>
        </View>
        <View style={styles.steps}>
          {RECOURSE_STEPS.map((s) => (
            <View key={s.n} style={styles.stepItem}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumTxt}>{s.n}</Text>
              </View>
              <Text style={styles.stepTxt}>
                {s.txt}
                <Text style={styles.stepMeta}>{s.meta}</Text>
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact options */}
      <View style={styles.contactCard}>
        <Text style={styles.contactCardTitle}>Autres voies de recours</Text>
        <Pressable style={styles.contactOption}>
          <View style={[styles.contactIcon, { backgroundColor: 'rgba(77,143,255,0.12)' }]}>
            <Mail size={18} color={colors.neon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contactTitle}>Contact direct modération</Text>
            <Text style={styles.contactMeta}>moderation@izenride.com</Text>
          </View>
          <ChevronRight size={18} color={colors.inkMute} />
        </Pressable>
        <Pressable style={styles.contactOption}>
          <View style={[styles.contactIcon, { backgroundColor: 'rgba(184,132,230,0.12)' }]}>
            <Shield size={18} color={colors.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contactTitle}>Médiateur de la consommation</Text>
            <Text style={styles.contactMeta}>CMAP · cmap.fr</Text>
          </View>
          <ChevronRight size={18} color={colors.inkMute} />
        </Pressable>
      </View>

      {/* Reference */}
      <View style={styles.ref}>
        <Text style={styles.refLabel}>Numéro de dossier</Text>
        <Text style={styles.refValue}>MOD-2026-04-D7E9B3-BAN</Text>
        <Text style={styles.refMeta}>À fournir lors de tout contact ou recours. Conservez précieusement cette référence.</Text>
      </View>

      {/* Actions */}
      <PrimaryButton label="Lancer la procédure de recours" style={{ marginTop: 8 }} />
      <GhostButton label="Télécharger la décision (PDF)" icon={<Download size={16} color={colors.ink} />} style={{ marginTop: 10 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: 'rgba(226,75,74,0.12)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.3)', marginBottom: 16 },
  pillTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.danger, letterSpacing: 1, textTransform: 'uppercase' },

  hero: { alignItems: 'center', gap: 14, marginBottom: 18 },
  heroIcon: { width: 80, height: 80, borderRadius: 22, backgroundColor: '#1a1214', borderWidth: 1, borderColor: 'rgba(226,75,74,0.4)', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, textAlign: 'center', letterSpacing: -0.5 },
  heroSub: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute, textAlign: 'center', lineHeight: 21, paddingHorizontal: 8, marginTop: -6 },

  decisionCard: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: radius.md, overflow: 'hidden', marginBottom: 18 },
  decisionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(226,75,74,0.06)', paddingVertical: 14, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#1A1E28' },
  stamp: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(226,75,74,0.15)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.3)', borderRadius: 6 },
  stampTxt: { fontFamily: fonts.bold, fontSize: 10, color: colors.danger, letterSpacing: 1, textTransform: 'uppercase' },
  decisionDate: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },
  decisionBody: { padding: 18 },
  decLabel: { fontFamily: fonts.bold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 },
  decValueStrong: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  decFacts: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkMute, lineHeight: 21 },
  strong: { fontFamily: fonts.semibold, color: colors.ink },
  decDivider: { height: 1, backgroundColor: '#1A1E28', marginVertical: 16 },
  article: { flexDirection: 'row', gap: 12, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: '#1A1E28', borderRadius: 12, padding: 14 },
  articleIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(226,75,74,0.1)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.2)', alignItems: 'center', justifyContent: 'center' },
  articleRef: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.danger, letterSpacing: 0.5, marginBottom: 4 },
  articleTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, lineHeight: 18, fontStyle: 'italic' },
  link: { fontFamily: fonts.medium, color: colors.neon, fontStyle: 'normal' },

  section: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: radius.md, padding: 18, marginBottom: 18 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, flex: 1 },
  sectionMeta: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },
  consequenceItem: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  consequenceIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(226,75,74,0.08)', alignItems: 'center', justifyContent: 'center' },
  consequenceTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  consequenceDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 16 },

  recourse: { backgroundColor: 'rgba(77,143,255,0.06)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.25)', borderRadius: radius.md, padding: 18, marginBottom: 18 },
  recourseHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  recourseIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(77,143,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  recourseTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  recourseMeta: { fontFamily: fonts.semibold, fontSize: 11, color: colors.neon },
  recourseTxt: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkMute, lineHeight: 21, marginBottom: 14 },
  deadlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(77,143,255,0.15)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderRadius: 8, marginBottom: 14 },
  deadlineTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.neon },
  steps: { paddingTop: 4, borderTopWidth: 1, borderTopColor: 'rgba(77,143,255,0.15)' },
  stepItem: { flexDirection: 'row', gap: 10, paddingTop: 10 },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(77,143,255,0.15)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  stepNumTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.neon },
  stepTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.ink, lineHeight: 18 },
  stepMeta: { fontFamily: fonts.regular, color: colors.inkMute },

  contactCard: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: radius.md, padding: 18, marginBottom: 18, gap: 12 },
  contactCardTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  contactOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: '#1A1E28', borderRadius: 12 },
  contactIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  contactTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  contactMeta: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },

  ref: { alignItems: 'center', marginBottom: 16, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: '#2A3545', borderStyle: 'dashed', borderRadius: 12, padding: 14 },
  refLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  refValue: { fontFamily: fonts.mono, fontSize: 13, color: colors.ink, letterSpacing: 1.5, marginBottom: 6 },
  refMeta: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, lineHeight: 14, textAlign: 'center' },
});
