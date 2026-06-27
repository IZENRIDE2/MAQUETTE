import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Lock,
  BadgeCheck,
  Truck,
  MapPin,
  Home,
  Plus,
  Shield,
  ArrowRight,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts } from '@/theme';

/** Checkout Stripe Connect (récap + livraison + paiement) — localisé Paris. */
export default function CheckoutPaiementStripeConnectScreen() {
  const [delivery, setDelivery] = useState(0);
  const [payment, setPayment] = useState(0);

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Nav top */}
      <View style={styles.navTop}>
        <View style={styles.navBtn}>
          <ChevronLeft size={16} color={colors.inkDim} />
        </View>
        <Text style={styles.navTitle}>Commande</Text>
        <View style={styles.navSecure}>
          <Lock size={11} color={colors.success} />
          <Text style={styles.navSecureTxt}>Sécurisé</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 1. Récap */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionNum}>
              <Text style={styles.sectionNumTxt}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Ta commande</Text>
          </View>
          <View style={styles.orderItem}>
            <View style={styles.orderImg}>
              <Text style={styles.orderGlyph}>🪖</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.orderName}>Casque AGV K6 noir mat — Taille L</Text>
              <Text style={styles.orderMeta}>État neuf · Vendu 1 fois</Text>
              <View style={styles.sellerRow}>
                <View style={styles.sellerAvatar} />
                <Text style={styles.sellerLbl}>Vendu par</Text>
                <Text style={styles.sellerName}>Marc D.</Text>
                <View style={styles.verified}>
                  <BadgeCheck size={9} color="#fff" />
                </View>
              </View>
            </View>
            <Text style={styles.orderPrice}>
              <Text style={styles.cur}>€</Text>280
            </Text>
          </View>
        </View>

        {/* 2. Livraison */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionNum}>
              <Text style={styles.sectionNumTxt}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Livraison</Text>
          </View>
          <View style={styles.sectionBody}>
            <Pressable onPress={() => setDelivery(0)} style={[styles.deliveryOpt, delivery === 0 && styles.deliveryOptSel]}>
              <View style={[styles.radio, delivery === 0 && styles.radioSel]}>{delivery === 0 && <View style={styles.radioDot} />}</View>
              <View style={{ flex: 1 }}>
                <View style={styles.deliveryTitleRow}>
                  <Truck size={13} color={colors.inkDim} />
                  <Text style={styles.deliveryTitle}>Livraison à domicile</Text>
                </View>
                <Text style={styles.deliveryMeta}>Colissimo · 2-3 jours ouvrés</Text>
              </View>
              <Text style={styles.deliveryPrice}>8,90 €</Text>
            </Pressable>

            <Pressable onPress={() => setDelivery(1)} style={[styles.deliveryOpt, delivery === 1 && styles.deliveryOptSel, { marginTop: 8 }]}>
              <View style={[styles.radio, delivery === 1 && styles.radioSel]}>{delivery === 1 && <View style={styles.radioDot} />}</View>
              <View style={{ flex: 1 }}>
                <View style={styles.deliveryTitleRow}>
                  <MapPin size={13} color={colors.inkDim} />
                  <Text style={styles.deliveryTitle}>Retrait en main propre</Text>
                </View>
                <Text style={styles.deliveryMeta}>Paris · à convenir avec le vendeur</Text>
              </View>
              <Text style={[styles.deliveryPrice, { color: colors.success }]}>Gratuit</Text>
            </Pressable>

            {/* Adresse */}
            <View style={styles.addressCard}>
              <View style={styles.addressIcon}>
                <Home size={13} color={colors.neon} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.addressName}>Antoine Martin</Text>
                <Text style={styles.addressText}>
                  24 rue de Rivoli, Apt 4B{'\n'}
                  75001 Paris, France{'\n'}
                  +33 6 23 45 67 89
                </Text>
              </View>
              <Text style={styles.addressEdit}>Modifier</Text>
            </View>
          </View>
        </View>

        {/* 3. Paiement */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionNum}>
              <Text style={styles.sectionNumTxt}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Mode de paiement</Text>
          </View>
          <View style={styles.sectionBody}>
            <Pressable onPress={() => setPayment(0)} style={[styles.pm, payment === 0 && styles.pmSel]}>
              <View style={[styles.pmLogo, { backgroundColor: '#fff' }]}>
                <Text style={styles.pmLogoApple}> Pay</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pmTitle}>Apple Pay</Text>
                <Text style={styles.pmSub}>Touch ID · Face ID</Text>
              </View>
              <View style={styles.pmDefault}>
                <Text style={styles.pmDefaultTxt}>Par défaut</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => setPayment(1)} style={[styles.pm, payment === 1 && styles.pmSel]}>
              <LinearGradient colors={['#2a3550', '#1a2436']} style={styles.pmLogo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.pmTitle}>Visa •••• 4218</Text>
                <Text style={styles.pmSub}>Expire 03/27</Text>
              </View>
            </Pressable>

            <Pressable style={[styles.pm, styles.pmDashed]}>
              <View style={[styles.pmLogo, { backgroundColor: '#181C26' }]}>
                <Plus size={14} color={colors.inkMute} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.pmTitle, { color: colors.inkDim }]}>Ajouter une carte</Text>
                <Text style={styles.pmSub}>Visa, Mastercard, Amex</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Totaux */}
        <View style={styles.totals}>
          <TotalLine label="Sous-total" value="280,00 €" />
          <TotalLine label="Livraison" value="8,90 €" />
          <TotalLine label="Frais de service" value="5,60 €" info />
          <TotalLine label="Code promo · MOTARD10" value="−10,00 €" discount />
          <View style={styles.grandTotal}>
            <Text style={styles.grandLabel}>Total à payer</Text>
            <Text style={styles.grandValue}>
              <Text style={styles.grandCur}>€</Text>284,50
            </Text>
          </View>
        </View>

        {/* Protection acheteur */}
        <View style={styles.protection}>
          <View style={styles.protectionIcon}>
            <Shield size={16} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.protectionTitle}>Protection acheteur IzenRide</Text>
            <Text style={styles.protectionText}>
              Tu n’es prélevé qu’à la <Text style={styles.bpStrong}>livraison confirmée</Text>. Litige ou colis non reçu ?{' '}
              <Text style={styles.bpStrong}>Remboursement intégral</Text> sous 14 jours.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.payBtn}>
          <Lock size={16} color="#fff" />
          <Text style={styles.payTxt}>Payer</Text>
          <Text style={styles.payAmount}>284,50 €</Text>
          <ArrowRight size={16} color="#fff" />
        </Pressable>
        <View style={styles.stripeBadge}>
          <Lock size={10} color={colors.inkMute} />
          <Text style={styles.stripeTxt}>
            Paiement chiffré · Propulsé par <Text style={styles.stripeLogo}>stripe</Text>
          </Text>
        </View>
      </View>
    </Screen>
  );
}

function TotalLine({ label, value, info, discount }: { label: string; value: string; info?: boolean; discount?: boolean }) {
  return (
    <View style={styles.totalLine}>
      <View style={styles.totalLabelRow}>
        <Text style={styles.totalLabel}>{label}</Text>
        {info && (
          <View style={styles.totalInfo}>
            <Text style={styles.totalInfoTxt}>?</Text>
          </View>
        )}
      </View>
      <Text style={[styles.totalValue, discount && { color: colors.success }]}>{value}</Text>
    </View>
  );
}

const PANEL = '#10121A';
const PANEL2 = '#14171F';
const BORDER = '#1A1E28';
const BORDER2 = '#2A3545';

const styles = StyleSheet.create({
  navTop: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: BORDER },
  navBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  navSecure: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(93,202,165,0.1)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.25)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 100 },
  navSecureTxt: { fontFamily: fonts.semibold, fontSize: 10, color: colors.success },

  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },

  section: { backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  sectionHead: { paddingHorizontal: 14, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: BORDER },
  sectionNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(74,156,232,0.12)', borderWidth: 1, borderColor: 'rgba(74,156,232,0.3)', alignItems: 'center', justifyContent: 'center' },
  sectionNumTxt: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.neon },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, flex: 1 },
  sectionBody: { paddingHorizontal: 14, paddingVertical: 12 },

  orderItem: { flexDirection: 'row', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  orderImg: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#12161f', borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  orderGlyph: { fontSize: 32 },
  orderName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 3, lineHeight: 16 },
  orderMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginBottom: 6 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sellerAvatar: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#2a3550' },
  sellerLbl: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim },
  sellerName: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink },
  verified: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  orderPrice: { fontFamily: fonts.monoBold, fontSize: 16, color: colors.ink },
  cur: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkDim },

  deliveryOpt: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: PANEL2, borderWidth: 1.5, borderColor: BORDER, borderRadius: 12 },
  deliveryOptSel: { borderColor: colors.neon, backgroundColor: 'rgba(74,156,232,0.06)' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: BORDER2, alignItems: 'center', justifyContent: 'center' },
  radioSel: { borderColor: colors.neon },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.neon },
  deliveryTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 1 },
  deliveryTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  deliveryMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  deliveryPrice: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.ink },

  addressCard: { marginTop: 12, backgroundColor: PANEL2, borderWidth: 1, borderColor: BORDER, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  addressIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(74,156,232,0.1)', borderWidth: 1, borderColor: 'rgba(74,156,232,0.25)', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  addressName: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.ink, marginBottom: 2 },
  addressText: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkDim, lineHeight: 16 },
  addressEdit: { fontFamily: fonts.semibold, fontSize: 11, color: colors.neon, marginTop: 2 },

  pm: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: PANEL2, borderWidth: 1.5, borderColor: BORDER, borderRadius: 12, marginBottom: 8 },
  pmSel: { borderColor: colors.neon, backgroundColor: 'rgba(74,156,232,0.06)' },
  pmDashed: { borderStyle: 'dashed', backgroundColor: 'transparent', marginBottom: 0 },
  pmLogo: { width: 38, height: 26, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  pmLogoApple: { fontFamily: fonts.bold, fontSize: 11, color: '#000' },
  pmTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 1 },
  pmSub: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.inkMute },
  pmDefault: { backgroundColor: 'rgba(74,156,232,0.12)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  pmDefaultTxt: { fontFamily: fonts.bold, fontSize: 9, color: colors.neon, letterSpacing: 0.6, textTransform: 'uppercase' },

  totals: { backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 14, marginBottom: 12 },
  totalLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  totalLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  totalLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  totalInfo: { width: 12, height: 12, borderRadius: 6, backgroundColor: BORDER2, alignItems: 'center', justifyContent: 'center' },
  totalInfoTxt: { fontFamily: fonts.bold, fontSize: 8, color: colors.inkMute },
  totalValue: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkDim },
  grandTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 12, marginTop: 4 },
  grandLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  grandValue: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  grandCur: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkDim },

  protection: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: PANEL, borderWidth: 1, borderColor: 'rgba(93,202,165,0.25)', borderRadius: 14, padding: 12, paddingHorizontal: 14, marginBottom: 12 },
  protectionIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(93,202,165,0.1)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)', alignItems: 'center', justifyContent: 'center' },
  protectionTitle: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.success, marginBottom: 3 },
  protectionText: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 16 },
  bpStrong: { fontFamily: fonts.semibold, color: colors.ink },

  bottomBar: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 28, backgroundColor: 'rgba(8,9,14,0.97)', borderTopWidth: 1, borderTopColor: BORDER },
  payBtn: { height: 54, backgroundColor: colors.neon, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 },
  payTxt: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  payAmount: { fontFamily: fonts.monoBold, fontSize: 15, color: '#fff' },
  stripeBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  stripeTxt: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute },
  stripeLogo: { fontFamily: fonts.bold, color: '#635BFF' },
});
