import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ShieldCheck, FileText, Download, Check, Info } from 'lucide-react-native';
import { Screen, AppBar, Panel, PrimaryButton, GhostButton, Pill } from '@/components';
import { colors, fonts } from '@/theme';

const TOC = [
  { num: '1', label: 'Préambule' },
  { num: '2', label: 'Inscription' },
  { num: '3', label: 'Données' },
  { num: '4', label: 'Marketplace' },
  { num: '5', label: 'Sanctions' },
  { num: '6', label: 'Litiges' },
];

const HISTORY = [
  { v: 'v3.2', state: 'Active', date: '28 avr 2026', active: true },
  { v: 'v3.1', state: 'Acceptée', date: '12 nov 2025' },
  { v: 'v3.0', state: 'Acceptée', date: '04 fév 2025' },
  { v: 'v2.4', state: 'Inscription', date: '17 sept 2024' },
];

/** CGU — Conditions générales d'utilisation (localisé Paris). */
export default function CGUScreen() {
  return (
    <Screen scroll={false} pad={0}>
      <View style={{ paddingHorizontal: 18 }}>
        <AppBar title="Conditions générales" />
      </View>

      {/* Doc strip */}
      <View style={styles.docStrip}>
        <View style={styles.docIcon}>
          <FileText size={16} color={colors.neon} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.docVersionRow}>
            <Text style={styles.docVersion}>v3.2</Text>
            <Pill label="En vigueur" color={colors.successText} bg="rgba(74,222,128,0.12)" border="rgba(74,222,128,0.3)" />
          </View>
          <Text style={styles.docMeta}>14 mars 2026 · FR · UE · ~ 12 min</Text>
        </View>
        <View style={styles.docAction}>
          <Download size={13} color={colors.ink} />
        </View>
      </View>

      {/* TOC */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tocWrap} contentContainerStyle={styles.toc}>
        {TOC.map((t, i) => (
          <View key={t.num} style={[styles.tocPill, i === 0 && styles.tocPillOn]}>
            <Text style={[styles.tocNum, i === 0 && { color: colors.neon }]}>{t.num}</Text>
            <Text style={[styles.tocLabel, i === 0 && { color: colors.neon }]}>{t.label}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Acceptation card */}
        <Panel style={styles.acceptCard} accent="rgba(74,222,128,0.3)">
          <View style={styles.acceptHead}>
            <View style={styles.acceptIcon}>
              <ShieldCheck size={16} color={colors.success} />
            </View>
            <View>
              <Pill label="CGU acceptées" color={colors.successText} bg="rgba(74,222,128,0.15)" border="rgba(74,222,128,0.3)" />
              <Text style={styles.acceptTitle}>Vous êtes à jour</Text>
            </View>
          </View>
          <View style={styles.acceptGrid}>
            <View style={styles.acceptCell}>
              <Text style={styles.acceptCellLabel}>Version active</Text>
              <Text style={styles.acceptCellValue}>v3.2 · 14 mars 26</Text>
            </View>
            <View style={styles.acceptCell}>
              <Text style={styles.acceptCellLabel}>Acceptée le</Text>
              <Text style={styles.acceptCellValue}>28 avr · 09:41</Text>
            </View>
          </View>
        </Panel>

        {/* Article 1 */}
        <Section num="Article 1" title="Préambule">
          <P>
            Bienvenue sur <B>IzenRide</B>, l'application sociale dédiée aux motards. Les présentes{' '}
            <B>Conditions Générales d'Utilisation</B> (« CGU ») régissent l'accès et l'utilisation de
            l'application mobile et des services associés.
          </P>
          <P>
            IzenRide est édité par <B>IzenRide SAS</B>, société immatriculée au RCS de Paris sous le n° 912
            458 376, dont le siège est situé à Paris (France).
          </P>
          <P>
            En créant un compte, vous reconnaissez avoir lu, compris et accepté ces CGU. Si vous n'êtes pas
            d'accord, <Link>n'utilisez pas l'application</Link>.
          </P>
        </Section>

        {/* Article 2 */}
        <Section num="Article 2" title="Inscription & accès">
          <P>
            L'inscription est <B>gratuite</B> et ouverte à toute personne physique majeure (18 ans révolus)
            titulaire d'un permis moto valide.
          </P>
          <SubTitle>2.1 Conditions d'éligibilité</SubTitle>
          <Bullet>
            Être <B>majeur</B> au sens du droit français
          </Bullet>
          <Bullet>
            Détenir un <B>permis A, A1 ou A2</B> en cours de validité
          </Bullet>
          <Bullet>
            Fournir des <B>informations exactes</B> lors de la création du profil
          </Bullet>
          <Bullet>
            Accepter la <B>vérification d'identité</B> par selfie biométrique
          </Bullet>

          <View style={styles.callout}>
            <View style={styles.calloutIcon}>
              <Info size={12} color={colors.warn} />
            </View>
            <Text style={styles.calloutTxt}>
              <Text style={{ color: colors.warn, fontFamily: fonts.bold }}>Bon à savoir : </Text>
              un compte par personne. Les comptes multiples ou les fausses identités entraînent une
              suspension immédiate.
            </Text>
          </View>

          <SubTitle>2.2 Profil & contenu</SubTitle>
          <P>
            Vous êtes seul responsable du contenu publié sur votre profil (photos, bio, motos enregistrées).
            Vous garantissez disposer des droits nécessaires sur ces contenus et vous engagez à respecter{' '}
            <Link>notre charte communautaire</Link>.
          </P>
        </Section>

        {/* Article 3 */}
        <Section num="Article 3" title="Données personnelles">
          <P>
            Le traitement de vos données est encadré par notre <Link>Politique de confidentialité</Link>{' '}
            conforme au <B>RGPD</B>. Vous disposez à tout moment des droits d'accès, de rectification, de
            suppression et de portabilité.
          </P>
          <P>
            Les données de géolocalisation collectées en mode trajet sont{' '}
            <B>anonymisées sous 30 jours</B> et ne sont jamais revendues à des tiers.
          </P>
        </Section>

        {/* History */}
        <Text style={styles.historyHead}>Historique des versions</Text>
        <Panel style={styles.historyList} pad={0}>
          {HISTORY.map((h, i) => (
            <View key={h.v} style={[styles.historyRow, i < HISTORY.length - 1 && styles.itemBorder]}>
              <View style={[styles.historyMarker, { backgroundColor: h.active ? colors.success : colors.inkMute }]} />
              <Text style={[styles.historyVersion, !h.active && { color: colors.inkMute, fontFamily: fonts.medium }]}>{h.v}</Text>
              <Pill
                label={h.state}
                color={h.active ? colors.successText : colors.inkMute}
                bg={h.active ? 'rgba(74,222,128,0.12)' : colors.bgDeep}
                border={h.active ? 'rgba(74,222,128,0.3)' : colors.line}
              />
              <Text style={styles.historyDate}>{h.date}</Text>
            </View>
          ))}
        </Panel>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <GhostButton label="Télécharger PDF" icon={<Download size={13} color={colors.ink} />} style={{ flex: 1 }} />
        <PrimaryButton label="Voir l'attestation" icon={<Check size={14} color="#fff" />} style={{ flex: 1.4 }} />
      </View>
    </Screen>
  );
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionAnchor}>
        <Text style={styles.sectionNum}>{num}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <Text style={styles.p}>{children}</Text>;
}
function B({ children }: { children: React.ReactNode }) {
  return <Text style={styles.strong}>{children}</Text>;
}
function Link({ children }: { children: React.ReactNode }) {
  return <Text style={styles.linkTxt}>{children}</Text>;
}
function SubTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subTitle}>{children}</Text>;
}
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletTxt}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  docStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.bg2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  docIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(77,143,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  docVersionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  docVersion: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.ink },
  docMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  docAction: { width: 32, height: 32, borderRadius: 9, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },

  tocWrap: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.line },
  toc: { gap: 5, paddingHorizontal: 14, paddingVertical: 10 },
  tocPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 100 },
  tocPillOn: { backgroundColor: 'rgba(77,143,255,0.1)', borderColor: colors.neon },
  tocNum: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  tocLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim },

  content: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 24 },

  acceptCard: { backgroundColor: 'rgba(15,26,46,0.92)', marginBottom: 16 },
  acceptHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  acceptIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(74,222,128,0.15)', alignItems: 'center', justifyContent: 'center' },
  acceptTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginTop: 3 },
  acceptGrid: { flexDirection: 'row', gap: 8 },
  acceptCell: { flex: 1, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, borderRadius: 9 },
  acceptCellLabel: { fontFamily: fonts.mono, fontSize: 8, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3 },
  acceptCellValue: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.ink },

  section: { marginBottom: 24 },
  sectionAnchor: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 10 },
  sectionNum: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.neon, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  p: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 21, marginBottom: 10 },
  strong: { fontFamily: fonts.bold, color: colors.ink },
  linkTxt: { color: colors.neon, fontFamily: fonts.medium, textDecorationLine: 'underline' },
  subTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginTop: 14, marginBottom: 6 },
  bullet: { flexDirection: 'row', gap: 10, marginBottom: 5, paddingLeft: 4 },
  bulletDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.neon, marginTop: 8 },
  bulletTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 20 },

  callout: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 14,
    padding: 12,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: 'rgba(250,199,117,0.3)',
    borderLeftWidth: 3,
    borderLeftColor: colors.warn,
    borderRadius: 12,
  },
  calloutIcon: { width: 22, height: 22, borderRadius: 6, backgroundColor: 'rgba(250,199,117,0.15)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  calloutTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 18 },

  historyHead: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  historyList: {},
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 14, paddingVertical: 10 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  historyMarker: { width: 10, height: 10, borderRadius: 5 },
  historyVersion: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.ink },
  historyDate: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginLeft: 'auto' },

  bottomBar: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.bgDeep },
});
