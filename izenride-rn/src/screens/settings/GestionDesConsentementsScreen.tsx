import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ShieldCheck,
  MapPin,
  Lock,
  Clock,
  X,
  Check,
  BarChart3,
  AlertTriangle,
  Heart,
  Send,
  ChevronDown,
  FileText,
  User,
  Shield,
  ArrowUpRight,
} from 'lucide-react-native';
import { Screen, AppBar, Panel, Pill, Switch, Divider } from '@/components';
import { colors, fonts } from '@/theme';

type Consent = {
  key: string;
  Icon: typeof BarChart3;
  tint: string;
  title: string;
  badge: 'Requis' | 'Optionnel';
  summary: string;
  on: boolean;
  locked?: boolean;
  data: string[];
  detailLabel: string;
  detailText: string;
};

const ESSENTIAL: Consent = {
  key: 'essential',
  Icon: ShieldCheck,
  tint: colors.success,
  title: "Fonctionnement de l'app",
  badge: 'Requis',
  summary:
    'Authentification, sécurité, prévention des fraudes — indispensable pour utiliser IzenRide',
  on: true,
  locked: true,
  detailLabel: "Pourquoi c'est nécessaire",
  detailText:
    "Sans ces données, votre compte ne peut pas être sécurisé et l'app ne peut pas fonctionner. Ce traitement repose sur l'exécution du contrat (art. 6.1.b RGPD) et ne nécessite pas votre consentement.",
  data: ['Token session', 'ID compte', 'Empreinte appareil', 'IP (anonymisée)'],
};

const OPTIONAL: Consent[] = [
  {
    key: 'analytics',
    Icon: BarChart3,
    tint: colors.neon,
    title: "Mesure d'audience",
    badge: 'Optionnel',
    summary:
      "Comprendre comment vous utilisez l'app pour l'améliorer (écrans visités, parcours, durée)",
    on: true,
    detailLabel: "Comment c'est utilisé",
    detailText:
      "Nous mesurons les fonctionnalités les plus utilisées (matching, événements, marketplace) et identifions les points de friction pour prioriser nos améliorations. Aucune donnée n'est revendue.",
    data: ['Écrans visités', 'Durée de session', 'Boutons cliqués', "Modèle d'appareil", 'Version OS'],
  },
  {
    key: 'crash',
    Icon: AlertTriangle,
    tint: colors.warn,
    title: 'Rapports de crash',
    badge: 'Optionnel',
    summary:
      "Diagnostiquer les bugs automatiquement quand l'app plante (logs techniques uniquement)",
    on: true,
    detailLabel: "Quand c'est déclenché",
    detailText:
      "Uniquement lorsque l'app rencontre une erreur ou plante. Les rapports nous permettent de corriger les bugs en quelques heures plutôt qu'en plusieurs semaines.",
    data: ['Stack trace', 'État écran', 'Modèle appareil', 'Version app', 'Mémoire dispo'],
  },
  {
    key: 'personalization',
    Icon: Heart,
    tint: colors.danger,
    title: 'Personnalisation',
    badge: 'Optionnel',
    summary:
      "Améliorer les suggestions de matchs, d'événements et d'itinéraires selon vos préférences",
    on: false,
    detailLabel: 'Comment ça marche',
    detailText:
      "Sans ce consentement, vous verrez des suggestions chronologiques. Avec, l'app apprend de vos interactions (likes, événements rejoints) pour proposer des contenus pertinents.",
    data: ['Matchs likés', 'Événements rejoints', 'Trajets favoris', 'Préférences moto'],
  },
  {
    key: 'marketing',
    Icon: Send,
    tint: colors.purple,
    title: 'Marketing & promotions',
    badge: 'Optionnel',
    summary: 'Newsletter, nouveautés, offres partenaires moto et événements près de chez vous',
    on: false,
    detailLabel: 'Ce que vous recevrez',
    detailText:
      'Une newsletter mensuelle, les annonces de nouvelles fonctionnalités, et des offres ciblées (équipement moto, événements partenaires). Maximum 2 communications par semaine.',
    data: ['Email', 'Notifications push'],
  },
];

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTick} />
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function ConsentCard({ c }: { c: Consent }) {
  return (
    <Panel style={styles.card} pad={0} accent={c.on ? 'rgba(77,143,255,0.25)' : undefined}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconWrap, { backgroundColor: c.tint + '20' }]}>
          <c.Icon size={20} color={c.tint} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{c.title}</Text>
            {c.badge === 'Requis' ? (
              <Pill label="Requis" color={colors.successText} bg="rgba(74,222,128,0.15)" border="rgba(74,222,128,0.4)" />
            ) : (
              <Pill label="Optionnel" color={colors.inkMute} bg={colors.bg2} border={colors.line} />
            )}
          </View>
          <Text style={styles.summary}>{c.summary}</Text>
        </View>
        <View style={styles.headerRight}>
          {c.locked ? <Lock size={18} color={colors.success} /> : <Switch value={c.on} />}
          <ChevronDown size={18} color={colors.inkMute} />
        </View>
      </View>

      {c.on && (
        <View style={styles.details}>
          <Divider />
          <Text style={styles.detailLabel}>{c.detailLabel}</Text>
          <Text style={styles.detailText}>{c.detailText}</Text>
          <Text style={[styles.detailLabel, { marginTop: 12 }]}>Données collectées</Text>
          <View style={styles.chips}>
            {c.data.map((d) => (
              <View key={d} style={styles.dataChip}>
                <Text style={styles.dataChipTxt}>{d}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Panel>
  );
}

function FooterRow({
  Icon,
  title,
  value,
  action,
  last,
}: {
  Icon: typeof FileText;
  title: string;
  value: string;
  action: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.footerRow, !last && styles.footerRowBorder]}>
      <View style={styles.footerIcon}>
        <Icon size={14} color={colors.neon} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.footerLabel}>{title}</Text>
        <Text style={styles.footerValue}>{value}</Text>
      </View>
      <View style={styles.footerLink}>
        <Text style={styles.footerLinkTxt}>{action}</Text>
        <ArrowUpRight size={11} color={colors.neon} />
      </View>
    </View>
  );
}

/** Gestion des consentements RGPD (localisé Paris). */
export default function GestionDesConsentementsScreen() {
  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      <AppBar
        title="Mes consentements"
        right={
          <View style={styles.headerIcon}>
            <ShieldCheck size={18} color={colors.success} />
          </View>
        }
      />

      <View style={styles.subRow}>
        <Pill label="RGPD" color="#fff" bg={colors.izen} border={colors.izen} />
        <Text style={styles.subTxt}>Révocables à tout moment</Text>
      </View>

      {/* Hero */}
      <Panel style={styles.hero}>
        <Text style={styles.heroText}>
          Vous gardez le contrôle total. Activez uniquement ce qui vous convient — vos choix sont{' '}
          <Text style={styles.heroStrong}>enregistrés instantanément</Text> et applicables sur tous vos
          appareils.
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <MapPin size={11} color={colors.success} />
            <Text style={styles.metaTxt}>Hébergé en UE</Text>
          </View>
          <View style={styles.metaPill}>
            <Lock size={11} color={colors.success} />
            <Text style={styles.metaTxt}>Anonymisé</Text>
          </View>
          <View style={styles.metaPill}>
            <Clock size={11} color={colors.success} />
            <Text style={styles.metaTxt}>Audit 13 mois</Text>
          </View>
        </View>
      </Panel>

      {/* Quick actions */}
      <View style={styles.quickRow}>
        <View style={styles.quickBtn}>
          <X size={14} color={colors.ink} />
          <Text style={styles.quickTxt}>Tout refuser</Text>
        </View>
        <View style={[styles.quickBtn, styles.quickAccept]}>
          <Check size={14} color={colors.successText} />
          <Text style={[styles.quickTxt, { color: colors.successText }]}>Tout accepter</Text>
        </View>
      </View>

      <SectionHeader label="Strictement nécessaire" />
      <ConsentCard c={ESSENTIAL} />

      <SectionHeader label="Consentements optionnels" />
      {OPTIONAL.map((c) => (
        <ConsentCard key={c.key} c={c} />
      ))}

      <SectionHeader label="Vos droits & ressources" />
      <Panel style={styles.footerCard} pad={4}>
        <FooterRow Icon={FileText} title="Politique de confidentialité" value="Version 3.2 · 12 mars 2026" action="Voir" />
        <FooterRow Icon={User} title="Délégué à la protection (DPO)" value="dpo@izenride.com" action="Contacter" />
        <FooterRow Icon={Shield} title="Réclamation auprès de la CNIL" value="cnil.fr — Droit garanti" action="Lien" last />
      </Panel>

      <Text style={styles.lastUpdate}>
        Dernière mise à jour de vos préférences :{' '}
        <Text style={{ color: colors.ink, fontFamily: fonts.semibold }}>12 avril 2026 à 14h22</Text>
        {'\n'}
        <Text style={styles.link}>Consulter l'historique de mes consentements →</Text>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74,222,128,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14, marginTop: -4 },
  subTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute },

  hero: { marginBottom: 16 },
  heroText: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink, lineHeight: 20 },
  heroStrong: { fontFamily: fonts.bold, color: colors.successText },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  metaTxt: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.ink },

  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  quickAccept: { backgroundColor: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.25)' },
  quickTxt: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.ink },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 8 },
  sectionTick: { width: 12, height: 1, backgroundColor: colors.line },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: colors.line },

  card: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  cardTitle: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.ink },
  summary: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute, lineHeight: 17 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },

  details: { paddingHorizontal: 16, paddingBottom: 16 },
  detailLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  detailText: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim, lineHeight: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dataChip: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  dataChipTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink },

  footerCard: { marginTop: 8, paddingHorizontal: 14, paddingVertical: 6 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  footerRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  footerIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink },
  footerValue: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute, marginTop: 1 },
  footerLink: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  footerLinkTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.neon },

  lastUpdate: {
    textAlign: 'center',
    marginTop: 24,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.inkMute,
    lineHeight: 18,
  },
  link: { color: colors.neon, fontFamily: fonts.semibold },
});
