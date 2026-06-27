import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Share2,
  Check,
  Hash,
  Copy,
  Shield,
  BadgeCheck,
  MessageCircle,
  FileText,
  ArrowRight,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts } from '@/theme';

type StepState = 'done' | 'active' | 'future';

const STEPS: { state: StepState; title: string; time: string; detail?: string }[] = [
  { state: 'done', title: 'Paiement autorisé et sécurisé', time: 'à l’instant · 14:23', detail: 'Tes 284,50 € sont mis en séquestre par Stripe. Le vendeur ne reçoit l’argent qu’à la livraison confirmée.' },
  { state: 'active', title: 'Préparation par Marc D.', time: 'en cours · expédition sous 24h', detail: 'Marc a été notifié. Il prépare ton casque et te transmettra le numéro de suivi Colissimo.' },
  { state: 'future', title: 'Expédition Colissimo', time: 'prévu · 11 mai' },
  { state: 'future', title: 'Livraison à ton adresse', time: 'prévu · 14 mai' },
  { state: 'future', title: 'Confirmation et paiement libéré au vendeur', time: 'à confirmer après réception' },
];

/** Confirmation de commande post-paiement (escrow Stripe) — localisé Paris. */
export default function OrderConfirmationScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Nav top */}
      <View style={styles.navTop}>
        <View style={styles.navBtn}>
          <X size={16} color={colors.inkDim} />
        </View>
        <View style={styles.navBtn}>
          <Share2 size={16} color={colors.inkDim} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero success */}
        <View style={styles.hero}>
          <View style={styles.ring}>
            <Check size={42} color={colors.success} strokeWidth={3.5} />
          </View>
          <Text style={styles.heroTitle}>Commande confirmée !</Text>
          <Text style={styles.heroSub}>
            Le vendeur a été notifié. Tu recevras un mail de confirmation à <Text style={styles.heroStrong}>antoine.m@example.com</Text>.
          </Text>
        </View>

        {/* Order ID */}
        <LinearGradient colors={['rgba(93,202,165,0.06)', 'rgba(74,156,232,0.04)']} style={styles.orderIdCard}>
          <View style={styles.orderIdIcon}>
            <Hash size={17} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderIdLabel}>Numéro de commande</Text>
            <Text style={styles.orderIdValue}>IZR-2026-A4F8C2</Text>
          </View>
          <View style={styles.orderIdCopy}>
            <Copy size={14} color={colors.inkDim} />
          </View>
        </LinearGradient>

        {/* Tracking timeline */}
        <View style={styles.tracking}>
          <View style={styles.trackingHead}>
            <Text style={styles.trackingTitle}>Suivi de ta commande</Text>
            <View style={styles.trackingEta}>
              <Text style={styles.trackingEtaTxt}>Livraison · 14 mai</Text>
            </View>
          </View>

          <View style={styles.timeline}>
            {STEPS.map((s, i) => (
              <View key={s.title} style={[styles.step, i === STEPS.length - 1 && { paddingBottom: 0 }]}>
                <View style={styles.stepDotWrap}>
                  <View
                    style={[
                      styles.stepDot,
                      s.state === 'done' && styles.stepDotDone,
                      s.state === 'active' && styles.stepDotActive,
                    ]}
                  >
                    {s.state === 'done' && <Check size={10} color={colors.bg} strokeWidth={3} />}
                    {s.state === 'active' && <View style={styles.stepDotActiveInner} />}
                  </View>
                  {i < STEPS.length - 1 && (
                    <View
                      style={[
                        styles.connector,
                        s.state === 'done' && { backgroundColor: colors.success },
                        s.state === 'active' && { backgroundColor: colors.neon },
                      ]}
                    />
                  )}
                </View>
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <Text style={[styles.stepTitle, s.state === 'future' && styles.stepTitleFuture]}>{s.title}</Text>
                  <Text style={[styles.stepTime, s.state === 'active' && { color: colors.neon, fontFamily: fonts.semibold }]}>{s.time}</Text>
                  {s.detail && <Text style={styles.stepDetail}>{s.detail}</Text>}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Escrow notice */}
        <View style={styles.escrow}>
          <View style={styles.escrowIcon}>
            <Shield size={14} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.escrowTitle}>Tu es protégé pendant 14 jours</Text>
            <Text style={styles.escrowText}>
              Confirme la réception une fois le casque entre tes mains. <Text style={styles.eStrong}>Litige ou colis non reçu ?</Text>{' '}
              Remboursement intégral garanti.
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryProduct}>
            <View style={styles.summaryImg}>
              <Text style={styles.summaryGlyph}>🪖</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.summaryName}>Casque AGV K6 noir mat — Taille L</Text>
              <View style={styles.summarySeller}>
                <Text style={styles.summarySellerName}>Marc D.</Text>
                <View style={styles.verified}>
                  <BadgeCheck size={6} color="#fff" />
                </View>
                <Text style={styles.summarySellerName}>· Paris</Text>
              </View>
            </View>
            <Text style={styles.summaryPrice}>280 €</Text>
          </View>

          <SummaryLine l="Livraison Colissimo" v="8,90 €" />
          <SummaryLine l="Frais de service" v="5,60 €" />
          <SummaryLine l="Code MOTARD10" v="−10,00 €" green />
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalL}>Total payé</Text>
            <Text style={styles.summaryTotalV}>284,50 €</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsGrid}>
          <Pressable style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(74,156,232,0.12)', borderColor: 'rgba(74,156,232,0.25)' }]}>
              <MessageCircle size={14} color={colors.neon} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.actionTitle}>Contacter Marc</Text>
              <Text style={styles.actionSub}>Question, RDV, suivi</Text>
            </View>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(127,119,221,0.12)', borderColor: 'rgba(127,119,221,0.25)' }]}>
              <FileText size={14} color="#7F77DD" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.actionTitle}>Télécharger la facture</Text>
              <Text style={styles.actionSub}>PDF · 84 Ko</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryTxt}>Voir mes commandes</Text>
          <ArrowRight size={15} color="#fff" />
        </Pressable>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryTxt}>Continuer mes achats</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function SummaryLine({ l, v, green }: { l: string; v: string; green?: boolean }) {
  return (
    <View style={styles.summaryLine}>
      <Text style={styles.summaryLineL}>{l}</Text>
      <Text style={[styles.summaryLineV, green && { color: colors.success }]}>{v}</Text>
    </View>
  );
}

const PANEL = '#10121A';
const PANEL3 = '#181C26';
const BORDER = '#1A1E28';
const BORDER2 = '#2A3545';

const styles = StyleSheet.create({
  navTop: { paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(20,23,31,0.6)', borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },

  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 },

  hero: { alignItems: 'center', marginTop: 12, marginBottom: 24 },
  ring: { width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 18, backgroundColor: 'rgba(93,202,165,0.06)' },
  heroTitle: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, marginBottom: 8, textAlign: 'center' },
  heroSub: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.inkDim, lineHeight: 20, textAlign: 'center', maxWidth: 290 },
  heroStrong: { fontFamily: fonts.semibold, color: colors.ink },

  orderIdCard: { borderWidth: 1, borderColor: 'rgba(93,202,165,0.2)', borderRadius: 16, padding: 14, paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  orderIdIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(93,202,165,0.12)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.25)', alignItems: 'center', justifyContent: 'center' },
  orderIdLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 },
  orderIdValue: { fontFamily: fonts.monoBold, fontSize: 15, color: colors.ink },
  orderIdCopy: { width: 32, height: 32, borderRadius: 9, backgroundColor: PANEL3, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },

  tracking: { backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 16, paddingBottom: 14, marginBottom: 12 },
  trackingHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  trackingTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  trackingEta: { backgroundColor: 'rgba(74,156,232,0.1)', borderWidth: 1, borderColor: 'rgba(74,156,232,0.25)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100 },
  trackingEtaTxt: { fontFamily: fonts.mono, fontSize: 11, color: colors.neon },

  timeline: {},
  step: { flexDirection: 'row', paddingBottom: 16 },
  stepDotWrap: { width: 20, alignItems: 'center' },
  stepDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: PANEL3, borderWidth: 2, borderColor: BORDER2, alignItems: 'center', justifyContent: 'center' },
  stepDotDone: { backgroundColor: colors.success, borderColor: colors.success },
  stepDotActive: { backgroundColor: colors.bg, borderColor: colors.neon },
  stepDotActiveInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.neon },
  connector: { width: 2, flex: 1, marginTop: 2, backgroundColor: BORDER },
  stepTitle: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink, marginBottom: 2, lineHeight: 16 },
  stepTitleFuture: { color: colors.inkMute, fontFamily: fonts.medium },
  stepTime: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.inkMute },
  stepDetail: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 16, marginTop: 4 },

  escrow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: PANEL, borderWidth: 1, borderColor: 'rgba(93,202,165,0.2)', borderRadius: 14, padding: 12, paddingHorizontal: 14, marginBottom: 12 },
  escrowIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(93,202,165,0.1)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)', alignItems: 'center', justifyContent: 'center' },
  escrowTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.success, marginBottom: 2 },
  escrowText: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 16 },
  eStrong: { fontFamily: fonts.semibold, color: colors.ink },

  summary: { backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 14, marginBottom: 12 },
  summaryProduct: { flexDirection: 'row', gap: 10, paddingBottom: 12, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: BORDER },
  summaryImg: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#12161f', borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  summaryGlyph: { fontSize: 24 },
  summaryName: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink, lineHeight: 16, marginBottom: 2 },
  summarySeller: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  summarySellerName: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkMute },
  verified: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  summaryPrice: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.ink },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  summaryLineL: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkMute },
  summaryLineV: { fontFamily: fonts.mono, fontSize: 11.5, color: colors.inkDim },
  summaryTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: BORDER },
  summaryTotalL: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.ink },
  summaryTotalV: { fontFamily: fonts.monoBold, fontSize: 14, color: colors.ink },

  actionsGrid: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  actionBtn: { flex: 1, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 13, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionIcon: { width: 32, height: 32, borderRadius: 9, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink, marginBottom: 1 },
  actionSub: { fontFamily: fonts.regular, fontSize: 9.5, color: colors.inkMute },

  bottomBar: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 28, backgroundColor: 'rgba(8,9,14,0.97)', borderTopWidth: 1, borderTopColor: BORDER },
  primaryBtn: { height: 50, backgroundColor: colors.neon, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  primaryTxt: { fontFamily: fonts.bold, fontSize: 14.5, color: '#fff' },
  secondaryBtn: { height: 36, alignItems: 'center', justifyContent: 'center' },
  secondaryTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute },
});
