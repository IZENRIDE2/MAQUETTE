import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { X, Edit3, Check, Lock, Activity, Settings, ShieldCheck, Download } from 'lucide-react-native';
import { Screen, AppBar, Panel, PrimaryButton, GhostButton, Switch } from '@/components';
import { colors, fonts } from '@/theme';

type Sdk = {
  abbr: string;
  logoColor: string;
  name: string;
  vendor: string;
  purpose: string;
  badges: { label: string; tone?: 'eu' | 'us' | 'enc' }[];
  data: string;
  retention: string;
  required?: boolean;
  tint: string;
};

type Category = {
  Icon: typeof Lock;
  tint: string;
  title: string;
  required?: boolean;
  meta: string;
  on: boolean;
  sdks: Sdk[];
};

const CATEGORIES: Category[] = [
  {
    Icon: Lock,
    tint: colors.success,
    title: 'Essentiels',
    required: true,
    meta: '3 SDK · sécurité & fonctionnement',
    on: true,
    sdks: [
      { abbr: 'St', logoColor: '#635BFF', name: 'Stripe', vendor: '· stripe.com', purpose: 'Paiements marketplace & abonnement Pro', badges: [{ label: 'UE / US · DPA', tone: 'eu' }, { label: 'PCI-DSS', tone: 'enc' }, { label: 'PII anonymisé' }], data: 'token de paiement', retention: 'légale 10 ans', required: true, tint: colors.success },
      { abbr: 'Fb', logoColor: '#FFA000', name: 'Firebase Auth', vendor: '· Google', purpose: 'Authentification & gestion des sessions', badges: [{ label: 'US · DPA', tone: 'us' }, { label: 'Chiffré E2E', tone: 'enc' }], data: 'e-mail, hash mot de passe', retention: 'compte actif', required: true, tint: colors.success },
      { abbr: 'Rc', logoColor: '#FF60D5', name: 'RevenueCat', vendor: '· revenuecat.com', purpose: 'Gestion des abonnements Pro & restaurations', badges: [{ label: 'US · DPA', tone: 'us' }, { label: 'ID anonyme' }], data: 'ID anonyme + statut abonnement', retention: '24 mois', required: true, tint: colors.success },
    ],
  },
  {
    Icon: Activity,
    tint: colors.warn,
    title: 'Analytics',
    meta: '2 SDK · stats anonymisées',
    on: true,
    sdks: [
      { abbr: 'Pl', logoColor: '#4338CA', name: 'Plausible', vendor: '· plausible.io', purpose: "Statistiques d'usage sans cookies ni tracking", badges: [{ label: 'UE · Allemagne', tone: 'eu' }, { label: 'No PII', tone: 'enc' }, { label: 'No cookie' }], data: 'aucune donnée perso', retention: '30 j', tint: colors.success },
      { abbr: 'Se', logoColor: '#6C5FBC', name: 'Sentry', vendor: '· sentry.io', purpose: "Détection d'erreurs & crashs anonymes", badges: [{ label: 'US · DPA', tone: 'us' }, { label: 'PII scrubbé' }], data: 'stack trace, version app', retention: '90 j', tint: colors.success },
    ],
  },
  {
    Icon: Settings,
    tint: colors.purple,
    title: 'Fonctionnalités',
    meta: '4 SDK · cartes, recherche, médias',
    on: true,
    sdks: [
      { abbr: 'Ml', logoColor: '#4A9CE8', name: 'MapLibre', vendor: '· open-source', purpose: 'Affichage des cartes & navigation GPS', badges: [{ label: 'UE · Stadia', tone: 'eu' }, { label: 'Géoloc anonyme' }], data: 'position GPS · viewport', retention: 'session', tint: colors.purple },
      { abbr: 'Al', logoColor: '#5468FF', name: 'Algolia', vendor: '· algolia.com', purpose: 'Recherche moto, marketplace & événements', badges: [{ label: 'UE · France', tone: 'eu' }, { label: 'Query anonyme' }], data: 'termes recherche, filtres', retention: '7 j', tint: colors.purple },
      { abbr: 'Mx', logoColor: '#FB2491', name: 'Mux', vendor: '· mux.com', purpose: 'Streaming vidéo des albums événement', badges: [{ label: 'US · DPA', tone: 'us' }, { label: 'ID stream' }], data: 'session vidéo, qualité', retention: '60 j', tint: colors.purple },
      { abbr: 'Cr', logoColor: '#FF6F00', name: 'Crashlytics', vendor: '· Google Firebase', purpose: 'Rapports de crash native iOS / Android', badges: [{ label: 'US · DPA', tone: 'us' }, { label: 'PII scrubbé' }], data: 'stack, OS, modèle', retention: '90 j', tint: colors.purple },
    ],
  },
];

const SUMMARY = [
  { num: '3', label: 'Essentiels', tint: colors.success },
  { num: '2', label: 'Analytics', tint: colors.warn },
  { num: '4', label: 'Fonctions', tint: colors.purple },
  { num: '0', label: 'Marketing', tint: colors.danger },
];

/** Politique cookies & traceurs (SDK) — conforme RGPD (localisé Paris). */
export default function PolitiqueCookiesTraceursScreen() {
  return (
    <Screen scroll={false} pad={0}>
      <View style={{ paddingHorizontal: 18 }}>
        <AppBar title="Cookies & SDK" />
      </View>
      <Text style={styles.sub}>9 services tiers</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <Panel style={styles.summaryCard}>
          <View style={styles.summaryHead}>
            <Text style={styles.summaryLabel}>Vue d'ensemble</Text>
            <Text style={styles.summaryLink}>Tout voir →</Text>
          </View>
          <View style={styles.summaryGrid}>
            {SUMMARY.map((s) => (
              <View key={s.label} style={styles.summaryCell}>
                <Text style={[styles.summaryNum, { color: s.tint }]}>{s.num}</Text>
                <Text style={styles.summaryCellLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </Panel>

        {/* Master controls */}
        <View style={styles.masterRow}>
          <View style={[styles.masterPill, styles.masterDeny]}>
            <X size={11} color={colors.danger} />
            <Text style={[styles.masterTxt, { color: colors.danger }]}>Tout refuser</Text>
          </View>
          <View style={styles.masterPill}>
            <Edit3 size={11} color={colors.ink} />
            <Text style={styles.masterTxt}>Personnaliser</Text>
          </View>
          <View style={[styles.masterPill, styles.masterAccept]}>
            <Check size={11} color="#fff" />
            <Text style={[styles.masterTxt, { color: '#fff' }]}>Tout accepter</Text>
          </View>
        </View>

        {CATEGORIES.map((cat) => (
          <View key={cat.title} style={styles.catSection}>
            <View style={styles.catHead}>
              <View style={[styles.catIcon, { backgroundColor: cat.tint + '20' }]}>
                <cat.Icon size={14} color={cat.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.catTitleRow}>
                  <Text style={styles.catTitle}>{cat.title}</Text>
                  {cat.required && (
                    <View style={styles.reqPill}>
                      <Text style={styles.reqPillTxt}>Requis</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.catMeta}>{cat.meta}</Text>
              </View>
              {cat.required ? <Lock size={16} color={colors.success} /> : <Switch value={cat.on} />}
            </View>

            {cat.sdks.map((s) => (
              <Panel key={s.name} style={styles.sdkCard} pad={0}>
                <View style={styles.sdkRow}>
                  <View style={[styles.sdkLogo, { backgroundColor: s.logoColor }]}>
                    <Text style={styles.sdkLogoTxt}>{s.abbr}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.sdkNameRow}>
                      <Text style={styles.sdkName}>{s.name}</Text>
                      <Text style={styles.sdkVendor}>{s.vendor}</Text>
                    </View>
                    <Text style={styles.sdkPurpose}>{s.purpose}</Text>
                    <View style={styles.sdkBadges}>
                      {s.badges.map((b) => (
                        <View
                          key={b.label}
                          style={[
                            styles.sdkBadge,
                            b.tone === 'eu' && { borderColor: 'rgba(74,222,128,0.25)' },
                            b.tone === 'us' && { borderColor: 'rgba(250,199,117,0.25)' },
                            b.tone === 'enc' && { borderColor: 'rgba(74,222,128,0.25)' },
                          ]}
                        >
                          {b.tone === 'enc' && <Check size={7} color={colors.success} strokeWidth={3} />}
                          <Text
                            style={[
                              styles.sdkBadgeTxt,
                              b.tone === 'eu' && { color: colors.successText },
                              b.tone === 'us' && { color: colors.warn },
                              b.tone === 'enc' && { color: colors.successText },
                            ]}
                          >
                            {b.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  {s.required ? <Lock size={14} color={colors.success} /> : <Switch value />}
                </View>
                <View style={styles.sdkDetails}>
                  <Text style={styles.sdkDetail}>
                    <Text style={styles.sdkDetailStrong}>Données </Text>
                    {s.data}
                  </Text>
                  <View style={styles.sdkDetailDot} />
                  <Text style={styles.sdkDetail}>
                    <Text style={styles.sdkDetailStrong}>Conservation </Text>
                    {s.retention}
                  </Text>
                </View>
              </Panel>
            ))}
          </View>
        ))}

        {/* No marketing callout */}
        <View style={styles.callout}>
          <View style={styles.calloutIcon}>
            <ShieldCheck size={12} color={colors.neon} />
          </View>
          <Text style={styles.calloutTxt}>
            <Text style={{ color: colors.neon, fontFamily: fonts.bold }}>Aucun SDK marketing. </Text>
            Pas de Meta Pixel, pas de TikTok, pas de Google Ads. Vos données ne sont jamais transmises à des
            publicitaires ni revendues.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <GhostButton label="Télécharger PDF" icon={<Download size={13} color={colors.ink} />} style={{ flex: 1 }} />
        <PrimaryButton label="Enregistrer mes choix" icon={<Check size={14} color="#fff" />} style={{ flex: 1.4 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.warn,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 18,
    marginTop: -10,
    marginBottom: 8,
  },
  content: { paddingHorizontal: 14, paddingBottom: 24 },

  summaryCard: { marginBottom: 12 },
  summaryHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  summaryLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.6 },
  summaryLink: { fontFamily: fonts.mono, fontSize: 10, color: colors.neon },
  summaryGrid: { flexDirection: 'row', gap: 6 },
  summaryCell: { flex: 1, paddingVertical: 8, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, borderRadius: 9, alignItems: 'center' },
  summaryNum: { fontFamily: fonts.monoBold, fontSize: 18, marginBottom: 3 },
  summaryCellLabel: { fontFamily: fonts.semibold, fontSize: 8, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5 },

  masterRow: { flexDirection: 'row', gap: 6, alignItems: 'center', padding: 11, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12, marginBottom: 4 },
  masterPill: { flex: 1, height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 9, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line },
  masterDeny: { borderColor: 'rgba(255,92,122,0.3)' },
  masterAccept: { backgroundColor: colors.success, borderColor: 'transparent' },
  masterTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink },

  catSection: { paddingTop: 18 },
  catHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  catIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  catTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 1 },
  catTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  reqPill: { paddingHorizontal: 5, paddingVertical: 1, backgroundColor: 'rgba(74,222,128,0.12)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: 3 },
  reqPillTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.successText, textTransform: 'uppercase', letterSpacing: 0.6 },
  catMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  sdkCard: { marginBottom: 8 },
  sdkRow: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13 },
  sdkLogo: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  sdkLogoTxt: { fontFamily: fonts.monoBold, fontSize: 13, color: '#fff' },
  sdkNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  sdkName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  sdkVendor: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  sdkPurpose: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 15 },
  sdkBadges: { flexDirection: 'row', gap: 4, marginTop: 4, flexWrap: 'wrap' },
  sdkBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 5, paddingVertical: 1, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, borderRadius: 3 },
  sdkBadgeTxt: { fontFamily: fonts.mono, fontSize: 8, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.4 },
  sdkDetails: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: colors.bgDeep, borderTopWidth: 1, borderTopColor: colors.line, flexWrap: 'wrap' },
  sdkDetail: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  sdkDetailStrong: { color: colors.inkDim, fontFamily: fonts.mono },
  sdkDetailDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.inkMute },

  callout: { flexDirection: 'row', gap: 10, marginTop: 18, padding: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderLeftWidth: 3, borderLeftColor: colors.neon, borderRadius: 12 },
  calloutIcon: { width: 22, height: 22, borderRadius: 6, backgroundColor: 'rgba(77,143,255,0.15)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  calloutTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkDim, lineHeight: 17 },

  bottomBar: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.bgDeep },
});
