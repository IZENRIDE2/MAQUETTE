import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Info,
  Crown,
  Calendar,
  CreditCard,
  ShoppingBag,
  FileText,
  Ban,
  ChevronRight,
  ArrowRight,
  Check,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, shadow } from '@/theme';

const GOLD = '#FAC775';

const HISTORY = [
  { title: 'Premium Annuel', date: '14 mars 2026 · Apple Pay', amount: '59,90 €' },
  { title: 'Premium Mensuel', date: '14 février 2026 · Apple Pay', amount: '8,32 €' },
  { title: 'Premium Mensuel', date: '14 janvier 2026 · Apple Pay', amount: '8,32 €' },
];

/** Abonnement actif — statut Premium, gestion et historique des paiements. */
export default function AbonnementActifScreen() {
  return (
    <Screen scroll edges={['top']} pad={16} contentStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={16} color={colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Mon abonnement</Text>
        <Pressable style={styles.iconBtn}>
          <Info size={16} color={colors.inkDim} />
        </Pressable>
      </View>

      {/* Premium status card */}
      <View style={styles.premiumCard}>
        <View style={styles.premiumTop}>
          <LinearGradient colors={[GOLD, '#E89E4A']} style={styles.crownIcon}>
            <Crown size={24} color="#fff" fill="#fff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <View style={styles.premiumTitleRow}>
              <Text style={styles.premiumTitle}>IzenRide Premium</Text>
              <View style={styles.activePill}>
                <View style={styles.activeDot} />
                <Text style={styles.activePillTxt}>Actif</Text>
              </View>
            </View>
            <Text style={styles.premiumSub}>Plan Annuel · 4,99 € / mois</Text>
          </View>
        </View>

        <View style={styles.renewalGrid}>
          <View style={styles.renewalCell}>
            <View style={styles.renewalLabelRow}>
              <Calendar size={10} color={GOLD} />
              <Text style={styles.renewalLabel}>Renouvellement</Text>
            </View>
            <Text style={styles.renewalValue}>14 mars 2027</Text>
            <Text style={styles.renewalMeta}>dans 322 jours</Text>
          </View>
          <View style={styles.renewalCell}>
            <View style={styles.renewalLabelRow}>
              <CreditCard size={10} color={GOLD} />
              <Text style={styles.renewalLabel}>Prochain prélèvement</Text>
            </View>
            <Text style={styles.renewalValue}>59,90 €</Text>
            <Text style={styles.renewalMeta}>Apple Pay · •••• 4122</Text>
          </View>
        </View>
      </View>

      {/* Gestion */}
      <SectionLabel label="Gestion" />
      <View style={styles.card}>
        <ActionRow
          icon={<ShoppingBag size={16} color={colors.neon} />}
          bg="rgba(74,156,232,0.12)"
          title="Gérer sur l'App Store"
          external
          desc="Modifier le plan, le moyen de paiement"
        />
        <ActionRow
          icon={<FileText size={16} color={colors.purple} />}
          bg="rgba(127,119,221,0.12)"
          title="Factures et reçus"
          desc="Télécharger en PDF"
        />
        <ActionRow
          icon={<Ban size={16} color={colors.danger} />}
          bg="rgba(226,75,74,0.1)"
          title="Annuler l'abonnement"
          titleDanger
          external
          desc="Reste actif jusqu'au 14 mars 2027"
          last
        />
      </View>

      {/* Historique */}
      <SectionLabel label="Historique des paiements" />
      <View style={styles.card}>
        {HISTORY.map((h, i) => (
          <View key={i} style={[styles.historyRow, i === HISTORY.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.historyIcon}>
              <Check size={14} color={colors.success} strokeWidth={3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle}>{h.title}</Text>
              <Text style={styles.historyDate}>{h.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.historyAmount}>{h.amount}</Text>
              <Text style={styles.historyStatus}>Payé</Text>
            </View>
          </View>
        ))}
        <Pressable style={styles.historyMore}>
          <Text style={styles.historyMoreTxt}>Voir tout l'historique →</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLabelDot} />
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

function ActionRow({
  icon,
  bg,
  title,
  titleDanger,
  external,
  desc,
  last,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  titleDanger?: boolean;
  external?: boolean;
  desc: string;
  last?: boolean;
}) {
  return (
    <Pressable style={[styles.actionRow, last && { borderBottomWidth: 0 }]}>
      <View style={[styles.actionIcon, { backgroundColor: bg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <View style={styles.actionTitleRow}>
          <Text style={[styles.actionTitle, titleDanger && { color: colors.danger }]}>{title}</Text>
          {external && <ArrowRight size={11} color={colors.inkMute} style={{ transform: [{ rotate: '-45deg' }] }} />}
        </View>
        <Text style={styles.actionDesc}>{desc}</Text>
      </View>
      <ChevronRight size={14} color={colors.inkMute} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 16, color: colors.ink },

  premiumCard: { backgroundColor: 'rgba(250,199,117,0.1)', borderWidth: 1, borderColor: 'rgba(250,199,117,0.3)', borderRadius: 18, padding: 16, marginBottom: 12, ...shadow.card },
  premiumTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  crownIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  premiumTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  premiumTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: 'rgba(93,202,165,0.15)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)' },
  activeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.success },
  activePillTxt: { fontFamily: fonts.bold, fontSize: 9.5, color: colors.success, textTransform: 'uppercase' },
  premiumSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },

  renewalGrid: { flexDirection: 'row', gap: 10 },
  renewalCell: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', borderWidth: 1, borderColor: 'rgba(250,199,117,0.12)', borderRadius: 12, padding: 11 },
  renewalLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  renewalLabel: { fontFamily: fonts.bold, fontSize: 9.5, color: GOLD, textTransform: 'uppercase', letterSpacing: 0.6 },
  renewalValue: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  renewalMeta: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, marginTop: 1 },

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4, marginTop: 4, marginBottom: 8 },
  sectionLabelDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.inkMute },
  sectionLabel: { fontFamily: fonts.bold, fontSize: 9.5, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },

  card: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  actionIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 1 },
  actionTitle: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink },
  actionDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim },

  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  historyIcon: { width: 30, height: 30, borderRadius: 9, backgroundColor: 'rgba(93,202,165,0.1)', alignItems: 'center', justifyContent: 'center' },
  historyTitle: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink, marginBottom: 1 },
  historyDate: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkDim },
  historyAmount: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.ink },
  historyStatus: { fontFamily: fonts.semibold, fontSize: 9.5, color: colors.success, marginTop: 1 },
  historyMore: { paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.line },
  historyMoreTxt: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.neon },
});
