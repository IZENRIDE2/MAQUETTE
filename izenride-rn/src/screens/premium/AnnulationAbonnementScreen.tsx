import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Heart, AlertTriangle, RefreshCw, Check, ArrowRight } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, shadow } from '@/theme';

const GREEN = '#5DCAA5';

const LOSS = [
  { value: '47', label: 'Sorties effectuées' },
  { value: '128', label: 'Motards croisés' },
  { value: '2 340', unit: ' km', label: 'Parcourus' },
];

/** Annulation abonnement — écran de rétention (étape 2/3). */
export default function AnnulationAbonnementScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn}>
          <ChevronLeft size={14} color={colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Annulation</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeTxt}>Étape 2/3</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={[styles.segment, styles.segmentActive]} />
        <View style={[styles.segment, styles.segmentActive]} />
        <View style={styles.segment} />
      </View>

      <View style={styles.content}>
        {/* Retention hero */}
        <View style={styles.hero}>
          <View style={styles.heroIc}>
            <Heart size={28} color={GREEN} fill={GREEN} />
          </View>
          <Text style={styles.heroTitle}>Avant de partir, Christophe…</Text>
          <Text style={styles.heroSub}>
            On a une dernière offre rien que pour toi pour continuer l'aventure ensemble.
          </Text>
        </View>

        {/* What you'll lose */}
        <View style={styles.lossCard}>
          <View style={styles.lossHeader}>
            <View style={styles.lossIcon}>
              <AlertTriangle size={9} color={colors.warn} />
            </View>
            <Text style={styles.lossTitle}>Ce que tu vas perdre</Text>
          </View>
          <View style={styles.lossGrid}>
            {LOSS.map((s) => (
              <View key={s.label} style={styles.lossStat}>
                <Text style={styles.lossValue}>
                  {s.value}
                  {s.unit ? <Text style={styles.lossUnit}>{s.unit}</Text> : null}
                </Text>
                <Text style={styles.lossLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Retention offer */}
        <View style={styles.offerCard}>
          <View style={styles.offerRibbon}>
            <Text style={styles.offerRibbonTxt}>Offre exclusive</Text>
          </View>
          <View style={styles.offerRow}>
            <LinearGradient colors={[GREEN, '#3FA888']} style={styles.offerIcon}>
              <RefreshCw size={20} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.offerTitle}>3 mois à -50%</Text>
              <Text style={styles.offerDesc}>
                Garde ton accès Premium et toutes ses fonctionnalités à moitié prix pendant 3 mois.
              </Text>
            </View>
          </View>
          <View style={styles.offerPricing}>
            <Text style={styles.offerOriginal}>8,32 €</Text>
            <Text style={styles.offerNew}>4,16 €</Text>
            <Text style={styles.offerPeriod}>/ mois</Text>
            <View style={styles.offerMeta}>
              <Text style={styles.offerMetaTxt}>3 mois</Text>
            </View>
          </View>
          <Pressable>
            <LinearGradient colors={[GREEN, '#3FA888']} style={styles.offerCta}>
              <Check size={14} color="#fff" strokeWidth={2.5} />
              <Text style={styles.offerCtaTxt}>Accepter l'offre et rester</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      {/* Cancel link */}
      <View style={styles.cancelArea}>
        <Pressable style={styles.cancelLink}>
          <Text style={styles.cancelLinkTxt}>Non merci, continuer l'annulation</Text>
          <ArrowRight size={13} color={colors.inkDim} style={{ transform: [{ rotate: '-45deg' }] }} />
        </Pressable>
        <Text style={styles.cancelMeta}>
          Tu seras redirigé vers l'<Text style={{ color: colors.ink, fontFamily: fonts.semibold }}>App Store</Text> pour finaliser l'annulation
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },
  backBtn: { width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  stepBadge: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4 },
  stepBadgeTxt: { fontFamily: fonts.bold, fontSize: 10, color: colors.inkDim },

  progressRow: { flexDirection: 'row', gap: 5, paddingHorizontal: 16, paddingBottom: 10 },
  segment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(42,53,69,0.5)' },
  segmentActive: { backgroundColor: GREEN },

  content: { flex: 1, paddingHorizontal: 16 },

  hero: { alignItems: 'center', paddingBottom: 14 },
  heroIc: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(93,202,165,0.18)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 10, ...shadow.card },
  heroTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, textAlign: 'center', marginBottom: 5 },
  heroSub: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim, textAlign: 'center', lineHeight: 18, maxWidth: 290 },

  lossCard: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 14, marginBottom: 12 },
  lossHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  lossIcon: { width: 16, height: 16, borderRadius: 5, backgroundColor: 'rgba(251,191,36,0.15)', alignItems: 'center', justifyContent: 'center' },
  lossTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.warn, textTransform: 'uppercase', letterSpacing: 0.6 },
  lossGrid: { flexDirection: 'row', gap: 8 },
  lossStat: { flex: 1, alignItems: 'center', paddingVertical: 8, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 9, borderWidth: 1, borderColor: colors.line },
  lossValue: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink, marginBottom: 3 },
  lossUnit: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkDim },
  lossLabel: { fontFamily: fonts.medium, fontSize: 9.5, color: colors.inkDim, textAlign: 'center', lineHeight: 12 },

  offerCard: { backgroundColor: 'rgba(93,202,165,0.1)', borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.35)', borderRadius: 16, padding: 14, marginBottom: 12, ...shadow.card },
  offerRibbon: { position: 'absolute', top: 0, right: 14, backgroundColor: GREEN, borderBottomLeftRadius: 7, borderBottomRightRadius: 7, paddingHorizontal: 9, paddingVertical: 4 },
  offerRibbonTxt: { fontFamily: fonts.bold, fontSize: 9, color: colors.izenDeep, textTransform: 'uppercase', letterSpacing: 0.5 },
  offerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10, marginTop: 8 },
  offerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  offerTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 3 },
  offerDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 17 },
  offerPricing: { flexDirection: 'row', alignItems: 'baseline', gap: 8, padding: 12, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, marginBottom: 12 },
  offerOriginal: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkMute, textDecorationLine: 'line-through' },
  offerNew: { fontFamily: fonts.bold, fontSize: 19, color: GREEN },
  offerPeriod: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim },
  offerMeta: { marginLeft: 'auto', backgroundColor: 'rgba(93,202,165,0.12)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 },
  offerMetaTxt: { fontFamily: fonts.bold, fontSize: 9.5, color: GREEN, textTransform: 'uppercase' },
  offerCta: { height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, ...shadow.card },
  offerCtaTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },

  cancelArea: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 22 },
  cancelLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11 },
  cancelLinkTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkDim },
  cancelMeta: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkMute, textAlign: 'center', marginTop: 4, lineHeight: 14, paddingHorizontal: 8 },
});
