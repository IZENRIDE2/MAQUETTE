import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  Database,
  User,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Download,
  Edit3,
  Share2,
  Trash2,
  Info,
  Check,
  ChevronRight,
  Phone,
} from 'lucide-react-native';
import { Screen, AppBar, Panel, PrimaryButton, GhostButton, Pill, Switch } from '@/components';
import { colors, fonts } from '@/theme';

const TOC = [
  { num: '1', label: 'Mes données' },
  { num: '2', label: 'Mes droits' },
  { num: '3', label: 'Cookies' },
  { num: '4', label: 'Partage tiers' },
  { num: '5', label: 'Conservation' },
  { num: '6', label: 'Contact DPO' },
];

const DATA_TYPES = [
  { Icon: User, tint: colors.neon, name: 'Profil & identité', meta: 'Nom, âge, photos, bio', size: '2,4 Mo' },
  { Icon: MapPin, tint: colors.purple, name: 'Trajets & GPS', meta: '42 trajets · anonymisés sous 30 j', size: '8,1 Mo' },
  { Icon: MessageCircle, tint: colors.warn, name: 'Messages & matchs', meta: 'Chiffrés · 12 conversations', size: '340 Ko' },
  { Icon: ShoppingBag, tint: colors.success, name: 'Marketplace', meta: '3 annonces · 2 achats', size: '1,2 Mo' },
];

const RIGHTS = [
  { Icon: Download, tint: colors.success, name: 'Accéder à mes données', desc: 'Export ZIP · 12 Mo', action: "Demander l'export" },
  { Icon: Edit3, tint: colors.neon, name: 'Rectifier mes infos', desc: 'Profil, identité, moto', action: 'Modifier le profil' },
  { Icon: Share2, tint: colors.purple, name: 'Portabilité', desc: 'Format JSON ouvert', action: 'Transférer' },
  { Icon: Trash2, tint: colors.danger, name: 'Effacement', desc: 'Suppression définitive', action: 'Supprimer le compte', danger: true },
];

const COOKIES = [
  { name: 'Cookies essentiels', desc: 'Auth · session · sécurité', on: true, required: true },
  { name: 'Analytics anonymes', desc: 'Plausible · sans tracking', on: true },
  { name: 'Marketing', desc: 'Désactivé par défaut', on: false },
];

/** Politique de confidentialité — conforme RGPD (localisé Paris). */
export default function PolitiqueDeConfidentialiteScreen() {
  return (
    <Screen scroll={false} pad={0}>
      <View style={{ paddingHorizontal: 18 }}>
        <AppBar title="Confidentialité" />
      </View>

      <View style={styles.docStrip}>
        <View style={styles.docIcon}>
          <Database size={16} color={colors.success} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.docVersionRow}>
            <Text style={styles.docVersion}>v3.2</Text>
            <Pill label="RGPD · UE" color={colors.successText} bg="rgba(74,222,128,0.12)" border="rgba(74,222,128,0.3)" />
          </View>
          <Text style={styles.docMeta}>14 mars 2026 · FR · EN · ~ 9 min</Text>
        </View>
        <View style={styles.docAction}>
          <Download size={13} color={colors.ink} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tocWrap} contentContainerStyle={styles.toc}>
        {TOC.map((t, i) => (
          <View key={t.num} style={[styles.tocPill, i === 0 && styles.tocPillOn]}>
            <Text style={[styles.tocNum, i === 0 && { color: colors.success }]}>{t.num}</Text>
            <Text style={[styles.tocLabel, i === 0 && { color: colors.success }]}>{t.label}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Data dashboard */}
        <Panel style={styles.dataDash} accent="rgba(74,222,128,0.3)">
          <View style={styles.dashHead}>
            <View style={styles.dashIcon}>
              <Database size={16} color={colors.success} />
            </View>
            <View>
              <Pill label="Mes données · live" color={colors.successText} bg="rgba(74,222,128,0.15)" border="rgba(74,222,128,0.3)" />
              <Text style={styles.dashTitle}>Ce que nous savons sur vous</Text>
            </View>
          </View>
          {DATA_TYPES.map((d) => (
            <View key={d.name} style={styles.dataTypeRow}>
              <View style={[styles.dataTypeIcon, { backgroundColor: d.tint + '20' }]}>
                <d.Icon size={11} color={d.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dataTypeName}>{d.name}</Text>
                <Text style={styles.dataTypeMeta}>{d.meta}</Text>
              </View>
              <Text style={styles.dataTypeSize}>{d.size}</Text>
            </View>
          ))}
        </Panel>

        {/* Article 2 — Droits RGPD */}
        <View style={styles.section}>
          <View style={styles.sectionAnchor}>
            <Text style={styles.sectionNum}>Article 2</Text>
            <Text style={styles.sectionTitle}>Vos droits RGPD</Text>
          </View>
          <Text style={styles.p}>
            Conformément au <Text style={styles.strong}>Règlement Général sur la Protection des Données</Text>,
            vous disposez à tout moment des droits suivants. Chaque action est{' '}
            <Text style={styles.strong}>réversible</Text> et confirmée par e-mail.
          </Text>

          <View style={styles.rgpdGrid}>
            {RIGHTS.map((r) => (
              <View key={r.name} style={styles.rgpdCard}>
                <View style={[styles.rgpdCardIcon, { backgroundColor: r.tint + '20' }]}>
                  <r.Icon size={13} color={r.tint} />
                </View>
                <Text style={styles.rgpdCardName}>{r.name}</Text>
                <Text style={styles.rgpdCardDesc}>{r.desc}</Text>
                <View style={styles.rgpdCardAction}>
                  <Text style={[styles.rgpdActionTxt, r.danger && { color: colors.danger }]}>{r.action}</Text>
                  <ChevronRight size={10} color={r.danger ? colors.danger : colors.neon} />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.callout}>
            <View style={styles.calloutIcon}>
              <Info size={12} color={colors.neon} />
            </View>
            <Text style={styles.calloutTxt}>
              <Text style={{ color: colors.neon, fontFamily: fonts.bold }}>Délai de réponse : </Text>
              les exports sont prêts sous <Text style={{ color: colors.neon, fontFamily: fonts.bold }}>72 h</Text>.
              La suppression de compte est immédiate, mais une copie chiffrée reste 30 j pour la prévention de
              fraude (RGPD art. 17).
            </Text>
          </View>

          <Text style={styles.subTitle}>2.1 Cookies & traceurs</Text>
          <Text style={styles.p}>
            Nous utilisons un nombre minimal de cookies. Vous pouvez modifier vos préférences à tout moment.
          </Text>

          <Panel style={styles.cookiesTable} pad={0}>
            {COOKIES.map((c, i) => (
              <View key={c.name} style={[styles.cookieRow, i < COOKIES.length - 1 && styles.itemBorder]}>
                <View style={[styles.cookieStatus, c.required && styles.cookieStatusReq]}>
                  {c.required && <Check size={9} color={colors.success} strokeWidth={3} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cookieName}>{c.name}</Text>
                  <Text style={styles.cookieDesc}>{c.desc}</Text>
                </View>
                <Switch value={c.on} />
              </View>
            ))}
          </Panel>
        </View>

        {/* DPO card */}
        <Panel style={styles.dpoCard} accent="rgba(184,132,230,0.25)">
          <View style={styles.dpoIcon}>
            <Phone size={16} color={colors.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Pill label="Délégué Protection" color={colors.purpleLight} bg="rgba(184,132,230,0.12)" border="rgba(184,132,230,0.3)" />
            <Text style={styles.dpoTitle}>Contacter notre DPO</Text>
            <Text style={styles.dpoDesc}>dpo@izenride.com · réponse {'<'} 30 j</Text>
          </View>
          <ChevronRight size={13} color={colors.purple} />
        </Panel>
      </ScrollView>

      <View style={styles.bottomBar}>
        <GhostButton label="Télécharger PDF" icon={<Download size={13} color={colors.ink} />} style={{ flex: 1 }} />
        <PrimaryButton label="Exporter mes données" icon={<Download size={14} color="#fff" />} style={{ flex: 1.4 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  docStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.bg2, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  docIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(74,222,128,0.15)', alignItems: 'center', justifyContent: 'center' },
  docVersionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  docVersion: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.ink },
  docMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  docAction: { width: 32, height: 32, borderRadius: 9, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },

  tocWrap: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.line },
  toc: { gap: 5, paddingHorizontal: 14, paddingVertical: 10 },
  tocPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 100 },
  tocPillOn: { backgroundColor: 'rgba(74,222,128,0.1)', borderColor: colors.success },
  tocNum: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  tocLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim },

  content: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 24 },

  dataDash: { marginBottom: 4 },
  dashHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  dashIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(74,222,128,0.15)', alignItems: 'center', justifyContent: 'center' },
  dashTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginTop: 3 },
  dataTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, borderRadius: 9, marginBottom: 7 },
  dataTypeIcon: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  dataTypeName: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink },
  dataTypeMeta: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  dataTypeSize: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkDim },

  section: { marginTop: 22, marginBottom: 22 },
  sectionAnchor: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 10 },
  sectionNum: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.success, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  p: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 21, marginBottom: 10 },
  strong: { fontFamily: fonts.bold, color: colors.ink },
  subTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginTop: 14, marginBottom: 6 },

  rgpdGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginBottom: 14 },
  rgpdCard: { width: '48%', padding: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12, gap: 8, marginBottom: 8 },
  rgpdCardIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rgpdCardName: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  rgpdCardDesc: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, lineHeight: 14 },
  rgpdCardAction: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 'auto', paddingTop: 6 },
  rgpdActionTxt: { fontFamily: fonts.semibold, fontSize: 10, color: colors.neon },

  callout: { flexDirection: 'row', gap: 10, marginVertical: 14, padding: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderLeftWidth: 3, borderLeftColor: colors.neon, borderRadius: 12 },
  calloutIcon: { width: 22, height: 22, borderRadius: 6, backgroundColor: 'rgba(77,143,255,0.15)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  calloutTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 18 },

  cookiesTable: { marginTop: 8 },
  cookieRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  cookieStatus: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  cookieStatusReq: { backgroundColor: 'rgba(74,222,128,0.18)', borderColor: 'rgba(74,222,128,0.4)' },
  cookieName: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  cookieDesc: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginTop: 1 },

  dpoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  dpoIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(184,132,230,0.15)', alignItems: 'center', justifyContent: 'center' },
  dpoTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginTop: 3, marginBottom: 2 },
  dpoDesc: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  bottomBar: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.bgDeep },
});
