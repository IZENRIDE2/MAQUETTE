import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Crown, Check, Clock } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

const GOLD = '#FAC775';
const GOLD_DEEP = '#E89E4A';

const FEATURES: { name: string; free: string | boolean; premium: string | boolean }[] = [
  { name: 'Sorties moto par mois', free: '3', premium: '∞' },
  { name: 'Matchs motards illimités', free: false, premium: true },
  { name: 'GPS turn-by-turn premium', free: false, premium: true },
  { name: 'Motards visibles sur la map', free: false, premium: true },
  { name: 'Historique de croisement', free: false, premium: true },
  { name: 'Boost annonces marketplace', free: '—', premium: '5/mois' },
  { name: 'Badge Pro vérifié', free: false, premium: true },
  { name: 'Support prioritaire', free: false, premium: true },
];

const PLANS = {
  monthly: { name: 'Premium Mensuel', recurrence: 'facturé chaque mois', price: '8,32', original: 'sans engagement', badge: 'Flexible' },
  quarterly: { name: 'Premium Trimestriel', recurrence: 'facturé tous les 3 mois', price: '7,07', original: 'soit 21,20 € / trimestre au lieu de 24,96 €', badge: 'Équilibré' },
  annual: { name: 'Premium Annuel', recurrence: 'facturé chaque année', price: '4,99', original: 'soit 59,90 € / an au lieu de 99,88 €', badge: 'Meilleure offre' },
} as const;

type Period = keyof typeof PLANS;

const PERIODS: { key: Period; label: string; savings?: string }[] = [
  { key: 'monthly', label: 'Mensuel' },
  { key: 'quarterly', label: 'Trimestriel', savings: '-15%' },
  { key: 'annual', label: 'Annuel', savings: '-40%' },
];

/** Paywall Premium — comparatif gratuit/premium + sélection de plan. */
export default function PaywallPremiumScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('annual');
  const plan = PLANS[period];

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      <LinearGradient
        colors={['rgba(250,199,117,0.18)', 'transparent']}
        style={styles.heroBg}
        pointerEvents="none"
      />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <X size={14} color={colors.inkDim} />
        </Pressable>
        <Pressable>
          <Text style={styles.restore}>Restaurer mes achats</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.crownWrap}>
            <Crown size={28} color="#fff" fill="#fff" />
          </LinearGradient>
          <Text style={styles.heroTitle}>
            Passe à <Text style={{ color: GOLD }}>IzenRide Premium</Text>
          </Text>
          <Text style={styles.heroSub}>
            Débloque toutes les fonctionnalités et roule sans limite avec les motards.
          </Text>
        </View>

        {/* Comparison */}
        <View style={styles.comparison}>
          <View style={styles.compHeader}>
            <Text style={[styles.compHeadCell, { flex: 1, textAlign: 'left', color: colors.inkMute }]}>Fonctionnalité</Text>
            <Text style={[styles.compHeadCell, { width: 60, color: colors.inkDim }]}>Gratuit</Text>
            <View style={[styles.compHeadCell, { width: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }]}>
              <Crown size={10} color={GOLD} fill={GOLD} />
              <Text style={{ fontFamily: fonts.bold, fontSize: 9.5, color: GOLD }}>Premium</Text>
            </View>
          </View>
          {FEATURES.map((f, i) => (
            <View key={f.name} style={[styles.compRow, i === FEATURES.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.featName}>{f.name}</Text>
              <View style={styles.featCell}>
                {typeof f.free === 'string' ? (
                  <Text style={[styles.featText, { color: colors.inkDim }]}>{f.free}</Text>
                ) : (
                  <View style={[styles.checkIcon, styles.checkNo]}>
                    <X size={10} color={colors.izenDeep} strokeWidth={3} />
                  </View>
                )}
              </View>
              <View style={[styles.featCell, { width: 70 }]}>
                {typeof f.premium === 'string' ? (
                  <Text style={[styles.featText, { color: GOLD }]}>{f.premium}</Text>
                ) : (
                  <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.checkIcon}>
                    <Check size={10} color="#fff" strokeWidth={3.5} />
                  </LinearGradient>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Period toggle */}
        <View style={styles.periodToggle}>
          {PERIODS.map((p) => {
            const on = period === p.key;
            return (
              <Pressable key={p.key} onPress={() => setPeriod(p.key)} style={[styles.periodOption, on && styles.periodOptionOn]}>
                <Text style={[styles.periodLabel, on && { color: colors.ink }]}>{p.label}</Text>
                {p.savings && (
                  <View style={styles.savings}>
                    <Text style={styles.savingsTxt}>{p.savings}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Plan card */}
        <View style={styles.planCard}>
          <View style={styles.planRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.planLabel}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planRecurrence}>{plan.recurrence}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceCurrency}>€</Text>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.pricePeriod}>/ mois</Text>
              </View>
              <Text style={styles.planOriginal}>{plan.original}</Text>
            </View>
            <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.planBadge}>
              <Text style={styles.planBadgeTxt}>{plan.badge}</Text>
            </LinearGradient>
          </View>
          <View style={styles.planTrial}>
            <Clock size={12} color={GOLD} />
            <Text style={styles.planTrialTxt}>
              <Text style={{ fontFamily: fonts.bold }}>30 jours d'essai gratuit</Text> · annulable à tout moment
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaArea}>
        <Pressable>
          <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.ctaBtn}>
            <Crown size={16} color={colors.izenDeep} fill={colors.izenDeep} />
            <Text style={styles.ctaTxt}>Démarrer l'essai gratuit</Text>
          </LinearGradient>
        </Pressable>
        <Text style={styles.legal}>
          Renouvellement auto · Annulation depuis l'App Store{'\n'}
          <Text style={styles.legalLink}>Conditions</Text> · <Text style={styles.legalLink}>Confidentialité</Text>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 280 },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 4, paddingBottom: 4 },
  closeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  restore: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },

  content: { paddingHorizontal: 16, paddingBottom: 20 },

  hero: { alignItems: 'center', paddingVertical: 8 },
  crownWrap: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8, ...shadow.card },
  heroTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, textAlign: 'center', marginBottom: 4 },
  heroSub: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim, textAlign: 'center', lineHeight: 18, maxWidth: 280 },

  comparison: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  compHeader: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: 'rgba(0,0,0,0.2)' },
  compHeadCell: { fontFamily: fonts.bold, fontSize: 9.5, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.6 },
  compRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.line },
  featName: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.ink },
  featCell: { width: 60, alignItems: 'center', justifyContent: 'center' },
  featText: { fontFamily: fonts.bold, fontSize: 11 },
  checkIcon: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  checkNo: { backgroundColor: 'rgba(42,53,69,0.5)' },

  periodToggle: { flexDirection: 'row', backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 3, marginBottom: 10 },
  periodOption: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 },
  periodOptionOn: { backgroundColor: colors.izenDeep, borderWidth: 1, borderColor: 'rgba(250,199,117,0.2)' },
  periodLabel: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.inkDim },
  savings: { backgroundColor: colors.success, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  savingsTxt: { fontFamily: fonts.bold, fontSize: 8, color: '#fff' },

  planCard: { backgroundColor: 'rgba(250,199,117,0.06)', borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.3)', borderRadius: 16, padding: 14, marginBottom: 10, ...shadow.card },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  planName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  planRecurrence: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkDim },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3, marginBottom: 3 },
  priceCurrency: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  price: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink },
  pricePeriod: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  planOriginal: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  planBadge: { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4 },
  planBadgeTxt: { fontFamily: fonts.bold, fontSize: 9, color: colors.izenDeep, textTransform: 'uppercase' },
  planTrial: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(250,199,117,0.2)', borderStyle: 'dashed' },
  planTrialTxt: { flex: 1, fontFamily: fonts.semibold, fontSize: 11, color: GOLD },

  ctaArea: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 22 },
  ctaBtn: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.card },
  ctaTxt: { fontFamily: fonts.bold, fontSize: 15, color: colors.izenDeep },
  legal: { fontFamily: fonts.regular, fontSize: 9.5, color: colors.inkMute, textAlign: 'center', marginTop: 8, lineHeight: 14 },
  legalLink: { color: colors.inkDim, textDecorationLine: 'underline' },
});
