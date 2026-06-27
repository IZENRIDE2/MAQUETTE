import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Building2, Server, ShieldCheck, Phone, MessageCircle, Scale, AlertTriangle, Download, Copy, Info } from 'lucide-react-native';
import { Screen, AppBar, Panel, PrimaryButton, GhostButton, Pill } from '@/components';
import { colors, fonts } from '@/theme';

const TOC = [
  { num: '1', label: 'Éditeur' },
  { num: '2', label: 'Hébergeur' },
  { num: '3', label: 'DPO' },
  { num: '4', label: 'Contacts' },
  { num: '5', label: 'PI' },
];

const EDITEUR = [
  { label: 'Raison sociale', value: 'IzenRide SAS', strong: true },
  { label: 'Forme juridique', value: 'Société par actions simplifiée' },
  { label: 'Capital', value: '120 000 €', mono: true },
  { label: 'RCS', value: 'Paris B 912 458 376', mono: true },
  { label: 'SIRET', value: '912 458 376 00018', mono: true },
  { label: 'TVA intra.', value: 'FR 47 912458376', mono: true },
  { label: 'Siège social', value: '24 rue de Rivoli\n75004 Paris\nFrance' },
  { label: 'Directeur publication', value: 'Mathieu Lefèvre', sub: 'Président & co-fondateur' },
];

const HEBERGEUR = [
  { label: 'Hébergeur', value: 'Scaleway SAS', strong: true, pill: 'UE' },
  { label: 'Adresse', value: '8 rue de la Ville l\'Évêque\n75008 Paris\nFrance' },
  { label: 'Datacenter', value: 'Paris (PAR-2) · ISO 27001', mono: true },
  { label: 'Téléphone', value: '+33 1 84 13 00 00', mono: true, link: true },
  { label: 'Site web', value: 'scaleway.com', link: true },
];

const DPO = [
  { label: 'DPO externe', value: 'Cabinet Privacéo', strong: true, sub: 'Représenté par Me Sarah Aubry' },
  { label: 'E-mail', value: 'dpo@izenride.com', mono: true, link: true },
  { label: 'Délai réponse', value: '< 30 jours', mono: true, pill: 'RGPD' },
  { label: 'Autorité contrôle', value: 'CNIL', strong: true, sub: 'cnil.fr · réclamation' },
];

const CONTACTS = [
  { Icon: MessageCircle, tint: colors.neon, name: 'Support général', value: 'support@izenride.com' },
  { Icon: ShieldCheck, tint: colors.success, name: 'Données & RGPD', value: 'dpo@izenride.com' },
  { Icon: Scale, tint: colors.purple, name: 'Presse & légal', value: 'legal@izenride.com' },
  { Icon: AlertTriangle, tint: colors.warn, name: 'Signalement abus', value: 'abuse@izenride.com' },
];

/** Mentions légales — Loi LCEN (localisé Paris). */
export default function MentionsLegalesScreen() {
  return (
    <Screen scroll={false} pad={0}>
      <View style={{ paddingHorizontal: 18 }}>
        <AppBar title="Mentions légales" />
      </View>

      <View style={styles.docStrip}>
        <View style={styles.docIcon}>
          <Scale size={16} color={colors.purple} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.docVersionRow}>
            <Text style={styles.docVersion}>v3.2</Text>
            <Pill label="Loi 2004-575" color={colors.purpleLight} bg="rgba(184,132,230,0.12)" border="rgba(184,132,230,0.3)" />
          </View>
          <Text style={styles.docMeta}>14 mars 2026 · FR · Obligatoire</Text>
        </View>
        <View style={styles.docAction}>
          <Download size={13} color={colors.ink} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tocWrap} contentContainerStyle={styles.toc}>
        {TOC.map((t, i) => (
          <View key={t.num} style={[styles.tocPill, i === 0 && styles.tocPillOn]}>
            <Text style={[styles.tocNum, i === 0 && { color: colors.purple }]}>{t.num}</Text>
            <Text style={[styles.tocLabel, i === 0 && { color: colors.purple }]}>{t.label}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHead Icon={Building2} tint={colors.purple} num="Article 1" title="Éditeur du service" />
        <InfoCard rows={EDITEUR} />

        <SectionHead Icon={Server} tint={colors.neon} num="Article 2" title="Hébergeur" />
        <InfoCard rows={HEBERGEUR} />

        <SectionHead Icon={ShieldCheck} tint={colors.success} num="Article 3" title="Délégué à la Protection des Données" />
        <InfoCard rows={DPO} />

        <SectionHead Icon={Phone} tint={colors.warn} num="Article 4" title="Contacts par sujet" />
        <View style={styles.contactGrid}>
          {CONTACTS.map((c) => (
            <View key={c.name} style={styles.contactCard}>
              <View style={[styles.contactIcon, { backgroundColor: c.tint + '20' }]}>
                <c.Icon size={12} color={c.tint} />
              </View>
              <Text style={styles.contactName}>{c.name}</Text>
              <Text style={[styles.contactValue, { color: c.tint }]} numberOfLines={1}>{c.value}</Text>
            </View>
          ))}
        </View>

        {/* Legal callout · PI */}
        <View style={styles.callout}>
          <View style={styles.calloutIcon}>
            <Info size={12} color={colors.purple} />
          </View>
          <Text style={styles.calloutTxt}>
            <Text style={{ color: colors.purple, fontFamily: fonts.bold }}>Propriété intellectuelle : </Text>
            la marque, le logo, l'interface et les contenus IzenRide sont protégés. Toute reproduction sans
            autorisation écrite préalable est interdite (CPI art. L.122-4).
          </Text>
        </View>

        {/* Footer meta */}
        <View style={styles.footerMeta}>
          <FooterMetaRow label="Médiateur" value="CMAP · cmap.fr" />
          <FooterMetaRow label="Litiges UE" value="ec.europa.eu/odr" />
          <FooterMetaRow label="Dernière maj." value="14 mars 2026 · v3.2" />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <GhostButton label="Télécharger PDF" icon={<Download size={13} color={colors.ink} />} style={{ flex: 1 }} />
        <PrimaryButton label="Copier les infos" icon={<Copy size={14} color="#fff" />} style={{ flex: 1.4 }} />
      </View>
    </Screen>
  );
}

function SectionHead({ Icon, tint, num, title }: { Icon: typeof Building2; tint: string; num: string; title: string }) {
  return (
    <View style={styles.sectionHead}>
      <View style={[styles.sectionIcon, { backgroundColor: tint + '20' }]}>
        <Icon size={14} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionNum}>{num}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
  );
}

type Row = { label: string; value: string; strong?: boolean; mono?: boolean; sub?: string; pill?: string; link?: boolean };
function InfoCard({ rows }: { rows: Row[] }) {
  return (
    <Panel style={styles.infoCard} pad={0}>
      {rows.map((r, i) => (
        <View key={r.label} style={[styles.infoRow, i < rows.length - 1 && styles.itemBorder]}>
          <Text style={styles.infoLabel}>{r.label}</Text>
          <View style={{ flex: 1 }}>
            <View style={styles.infoValueRow}>
              <Text
                style={[
                  styles.infoValue,
                  r.mono && styles.infoMono,
                  r.strong && { fontFamily: fonts.bold, color: colors.ink },
                  r.link && { color: colors.neon, textDecorationLine: 'underline' },
                ]}
              >
                {r.value}
              </Text>
              {r.pill && <Pill label={r.pill} color={r.pill === 'UE' ? colors.successText : colors.neonBright} bg={r.pill === 'UE' ? 'rgba(74,222,128,0.12)' : 'rgba(77,143,255,0.12)'} border={r.pill === 'UE' ? 'rgba(74,222,128,0.3)' : 'rgba(77,143,255,0.3)'} />}
            </View>
            {r.sub && <Text style={styles.infoSub}>{r.sub}</Text>}
          </View>
        </View>
      ))}
    </Panel>
  );
}

function FooterMetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.footerMetaRow}>
      <Text style={styles.footerMetaLabel}>{label}</Text>
      <View style={styles.footerMetaDot} />
      <Text style={styles.footerMetaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  docStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.bg2, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  docIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(184,132,230,0.15)', alignItems: 'center', justifyContent: 'center' },
  docVersionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  docVersion: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.ink },
  docMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  docAction: { width: 32, height: 32, borderRadius: 9, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },

  tocWrap: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.line },
  toc: { gap: 5, paddingHorizontal: 14, paddingVertical: 10 },
  tocPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 100 },
  tocPillOn: { backgroundColor: 'rgba(184,132,230,0.1)', borderColor: colors.purple },
  tocNum: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  tocLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim },

  content: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 24 },

  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10, marginTop: 8 },
  sectionIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  sectionNum: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.6 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },

  infoCard: { marginBottom: 18 },
  infoRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 14, paddingVertical: 9 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  infoLabel: { width: 100, fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.6, lineHeight: 14 },
  infoValueRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  infoValue: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 17 },
  infoMono: { fontFamily: fonts.mono, fontSize: 11 },
  infoSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 1 },

  contactGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginBottom: 4 },
  contactCard: { width: '48%', padding: 11, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 11, gap: 6, marginBottom: 8 },
  contactIcon: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  contactName: { fontFamily: fonts.bold, fontSize: 11, color: colors.ink },
  contactValue: { fontFamily: fonts.mono, fontSize: 10 },

  callout: { flexDirection: 'row', gap: 10, marginTop: 18, padding: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: 'rgba(184,132,230,0.3)', borderLeftWidth: 3, borderLeftColor: colors.purple, borderRadius: 12 },
  calloutIcon: { width: 22, height: 22, borderRadius: 6, backgroundColor: 'rgba(184,132,230,0.15)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  calloutTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkDim, lineHeight: 17 },

  footerMeta: { marginTop: 18, padding: 11, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 11, gap: 5 },
  footerMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerMetaLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim },
  footerMetaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.inkMute },
  footerMetaValue: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  bottomBar: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.bgDeep },
});
