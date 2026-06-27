import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bike,
  Check,
  RefreshCw,
  FileText,
  Code,
  Calendar,
  Smartphone,
  Shield,
  Building2,
  HelpCircle,
  Package,
  Copy,
  ChevronRight,
  Globe,
  Heart,
} from 'lucide-react-native';
import { Screen, AppBar, Divider } from '@/components';
import { colors, fonts, radius } from '@/theme';

/** À propos — IzenRide & informations légales. Siège IzenRide à Paris. */
export default function AProposScreen() {
  return (
    <Screen pad={0}>
      <View style={{ paddingHorizontal: 16 }}>
        <AppBar title="À propos" />
      </View>

      {/* Hero logo + version */}
      <View style={styles.hero}>
        <LinearGradient
          colors={['#4d8fff', '#7F77DD', '#5DCAA5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logo}
        >
          <Bike size={48} color="#fff" />
        </LinearGradient>
        <Text style={styles.appName}>IzenRide</Text>
        <Text style={styles.tagline}>
          La communauté des riders qui se respectent.{'\n'}Roulez ensemble, en toute sécurité.
        </Text>
        <View style={styles.versionPill}>
          <View style={styles.versionDot}>
            <Check size={11} color={colors.successText} strokeWidth={3.5} />
          </View>
          <Text style={styles.versionText}>Version 3.0.0</Text>
          <Text style={styles.versionBuild}> · Build 421</Text>
        </View>
      </View>

      {/* Carte mise à jour */}
      <View style={styles.updateCard}>
        <View style={styles.updateIcon}>
          <Check size={18} color={colors.successText} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.updateTitle}>Vous êtes à jour</Text>
          <Text style={styles.updateStatus}>Dernière version installée</Text>
          <Text style={styles.updateTime}>Vérifié il y a 2 minutes</Text>
        </View>
        <RefreshCw size={15} color={colors.neon} />
      </View>

      {/* Informations techniques */}
      <SectionHeader title="Informations techniques" />
      <View style={styles.card}>
        <InfoRow icon={<FileText size={15} color={colors.neon} />} label="Version de l'app" value="3.0.0 (421)" />
        <InfoRow
          icon={<Code size={15} color={colors.purple} />}
          label="Numéro de build"
          value="421-stable-7f3a9d2"
          right={
            <View style={styles.copyBtn}>
              <Copy size={13} color={colors.inkMute} />
            </View>
          }
        />
        <InfoRow icon={<Calendar size={15} color={colors.successText} />} label="Date de publication" value="22 avril 2026" />
        <InfoRow icon={<Smartphone size={15} color={colors.warn} />} label="Plateforme" value="iOS 17.4 · iPhone 15 Pro" />
        <InfoRow
          icon={<FileText size={15} color={colors.neon} />}
          label="Notes de version"
          value="Voir les nouveautés v3.0"
          right={<ChevronRight size={14} color={colors.inkMute} />}
          last
        />
      </View>

      {/* Documents légaux */}
      <SectionHeader title="Documents légaux" />
      <View style={styles.card}>
        <LegalRow
          bg="rgba(77,143,255,0.12)"
          icon={<FileText size={16} color={colors.neon} />}
          title="Conditions générales d'utilisation"
          desc="Vos droits et obligations en utilisant IzenRide"
          meta="v3.2 · 12 mars 2026"
        />
        <LegalRow
          bg="rgba(93,202,165,0.12)"
          icon={<Shield size={16} color={colors.successText} />}
          title="Politique de confidentialité"
          desc="Comment vos données sont protégées (RGPD)"
          meta="v3.2 · 12 mars 2026"
        />
        <LegalRow
          bg="rgba(250,199,117,0.12)"
          icon={<Building2 size={16} color={colors.warn} />}
          title="Mentions légales"
          desc="Informations sur l'éditeur et l'hébergeur"
        />
        <LegalRow
          bg="rgba(127,119,221,0.12)"
          icon={<HelpCircle size={16} color={colors.purple} />}
          title="Charte communautaire"
          desc="Les règles de bonne conduite entre riders"
        />
        <LegalRow
          bg="rgba(77,143,255,0.12)"
          icon={<Package size={16} color={colors.neon} />}
          title="Licences open source"
          desc="Bibliothèques utilisées dans l'application"
          meta="42 packages"
          last
        />
      </View>

      {/* Éditeur */}
      <SectionHeader title="Éditeur" />
      <View style={styles.companyCard}>
        <CompanyRow label="Société" value="IzenRide SAS" />
        <Divider />
        <CompanyRow label="Siège social" value={'75012 Paris\nFrance'} />
        <Divider />
        <CompanyRow label="SIREN" value="932 481 503" mono />
        <Divider />
        <CompanyRow label="N° TVA" value="FR45 932481503" mono />
        <Divider />
        <CompanyRow label="Contact" value="contact@izenride.com" />
      </View>

      {/* Construit avec */}
      <SectionHeader title="Construit avec" />
      <View style={styles.stackGrid}>
        <StackCard colors={['#4d8fff', '#2d6db1']} name="React Native" version="0.74" />
        <StackCard colors={['#FAC775', '#E89F3E']} name="Firebase" version="12.3.0" />
        <StackCard colors={['#5DCAA5', '#3a9176']} name="Google Maps" version="SDK 18.2" />
        <StackCard colors={['#7F77DD', '#564fa7']} name="IzenLab" version="Studio · Paris" />
      </View>

      {/* Suivez-nous */}
      <SectionHeader title="Suivez-nous" />
      <View style={styles.socialRow}>
        <SocialBtn colors={['#4d8fff', '#2d6db1']} label="Web" />
        <SocialBtn colors={['#E24B4A', '#7F77DD']} label="Insta" />
        <SocialBtn colors={['#1877F2', '#1877F2']} label="Facebook" />
        <SocialBtn colors={['#E24B4A', '#E24B4A']} label="YouTube" />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLine}>Conçu avec </Text>
          <Heart size={11} color="#E24B4A" fill="#E24B4A" />
          <Text style={styles.footerLine}> à Paris</Text>
        </View>
        <Text style={styles.footerLine}>
          Développé par <Text style={styles.footerStrong}>IzenLab</Text> à Paris
        </Text>
        <Text style={styles.footerLine}>Pour les riders d'Île-de-France et d'ailleurs</Text>
        <Text style={styles.copyright}>© 2026 IzenRide SAS · Tous droits réservés</Text>
      </View>
    </Screen>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLineFlex} />
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  right,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  right?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && styles.rowBorder]}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      {right}
    </View>
  );
}

function LegalRow({
  icon,
  bg,
  title,
  desc,
  meta,
  last,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
  meta?: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.legalRow, !last && styles.rowBorder]}>
      <View style={[styles.legalIcon, { backgroundColor: bg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.legalTitle}>{title}</Text>
        <Text style={styles.legalDesc}>{desc}</Text>
        {meta ? (
          <View style={styles.legalMeta}>
            <Text style={styles.legalMetaTxt}>{meta}</Text>
          </View>
        ) : null}
      </View>
      <ChevronRight size={14} color={colors.inkMute} />
    </View>
  );
}

function CompanyRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.companyRow}>
      <Text style={styles.companyLabel}>{label}</Text>
      <Text style={[styles.companyValue, mono && { fontFamily: fonts.mono, fontSize: 11.5 }]}>{value}</Text>
    </View>
  );
}

function StackCard({ colors: grad, name, version }: { colors: [string, string]; name: string; version: string }) {
  return (
    <View style={styles.stackCard}>
      <LinearGradient colors={grad} style={styles.stackIcon}>
        <Code size={16} color="#fff" />
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={styles.stackName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.stackVersion}>{version}</Text>
      </View>
    </View>
  );
}

function SocialBtn({ colors: grad, label }: { colors: [string, string]; label: string }) {
  return (
    <View style={styles.socialBtn}>
      <LinearGradient colors={grad} style={styles.socialIcon}>
        <Globe size={14} color="#fff" />
      </LinearGradient>
      <Text style={styles.socialLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  logo: { width: 96, height: 96, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  appName: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, marginBottom: 4 },
  tagline: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim, textAlign: 'center', lineHeight: 18, marginBottom: 14 },
  versionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  versionDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(93,202,165,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: { fontFamily: fonts.mono, fontSize: 12, color: colors.ink },
  versionBuild: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },

  updateCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(93,202,165,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.2)',
    borderRadius: radius.md,
    padding: 14,
  },
  updateIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(93,202,165,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateTitle: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink },
  updateStatus: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.successText },
  updateTime: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute, marginTop: 2 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginTop: 24, marginBottom: 12 },
  sectionLine: { width: 12, height: 1, backgroundColor: colors.lineStrong },
  sectionLineFlex: { flex: 1, height: 1, backgroundColor: colors.line },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },

  card: {
    marginHorizontal: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13 },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink },
  infoValue: { fontFamily: fonts.mono, fontSize: 11.5, color: colors.inkMute, marginTop: 1 },
  copyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  legalRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  legalIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  legalTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  legalDesc: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute, lineHeight: 16 },
  legalMeta: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
  },
  legalMetaTxt: { fontFamily: fonts.bold, fontSize: 9.5, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.4 },

  companyCard: {
    marginHorizontal: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
  },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 7 },
  companyLabel: { width: 90, fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.7 },
  companyValue: { flex: 1, fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink },

  stackGrid: { marginHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stackCard: {
    width: '47.5%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 12,
  },
  stackIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  stackName: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  stackVersion: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.inkMute },

  socialRow: { marginHorizontal: 16, flexDirection: 'row', gap: 8 },
  socialBtn: {
    flex: 1,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  socialIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  socialLabel: { fontFamily: fonts.bold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.4 },

  footer: { alignItems: 'center', marginTop: 32, marginHorizontal: 16 },
  footerRow: { flexDirection: 'row', alignItems: 'center' },
  footerLine: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute, lineHeight: 18, textAlign: 'center' },
  footerStrong: { fontFamily: fonts.bold, color: colors.ink },
  copyright: { marginTop: 16, fontFamily: fonts.regular, fontSize: 10, color: colors.lineStrong },
});
