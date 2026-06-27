import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Info, Zap, Check, Ticket, ChevronRight, CreditCard, Shield } from 'lucide-react-native';
import { Screen, IconButton } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

type OfferKey = 'simple' | 'premium' | 'vitrine';

const OFFERS: { key: OfferKey; name: string; desc: string; amount: string; duration: string; popular?: boolean }[] = [
  { key: 'simple', name: 'Boost simple', desc: 'Top des résultats pendant 24h', amount: '2,99', duration: '24 H' },
  { key: 'premium', name: 'Boost premium', desc: 'Top + bandeau coloré · 7 jours', amount: '9,99', duration: '7 JOURS', popular: true },
  { key: 'vitrine', name: 'Boost vitrine', desc: "Mise en avant page d'accueil · 14 j", amount: '19,99', duration: '14 JOURS' },
];

const INCLUDED = [
  'Top des résultats pendant 7 jours',
  'Bandeau coloré « Mise en avant »',
  'Statistiques détaillées de vues',
  'Notification aux acheteurs intéressés',
];

/** Boost annonce & paiement — thème ultra-dark (localisé Paris). */
export default function PropagationThemeUltraDarkScreen() {
  const [selected, setSelected] = useState<OfferKey>('premium');

  return (
    <View style={styles.root}>
      <Screen scroll pad={16} edges={['top']} contentStyle={{ paddingBottom: 240 }}>
        {/* Top nav */}
        <View style={styles.topnav}>
          <IconButton>
            <ChevronLeft size={18} color={colors.ink} />
          </IconButton>
          <Text style={styles.topnavTitle}>BOOST ANNONCE</Text>
          <IconButton>
            <Info size={18} color={colors.ink} />
          </IconButton>
        </View>

        {/* Hero */}
        <LinearGradient
          colors={['rgba(184,132,230,0.18)', '#14182a']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroIcon}>
            <LinearGradient colors={[colors.purple, colors.neon]} style={StyleSheet.absoluteFill} />
            <Zap size={24} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Boostez votre{'\n'}annonce</Text>
          <Text style={styles.heroSub}>
            Apparaissez en tête des résultats et vendez jusqu'à <Text style={styles.heroStrong}>5× plus vite</Text>.
          </Text>
        </LinearGradient>

        {/* Product mini */}
        <View style={styles.productMini}>
          <LinearGradient colors={[colors.neon, '#0a1428']} style={styles.productThumb}>
            <Text style={{ fontSize: 22 }}>🪖</Text>
          </LinearGradient>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>Shoei NXR2 noir mat taille L</Text>
            <View style={styles.productMeta}>
              <Text style={styles.productPrice}>340 €</Text>
              <View style={styles.metaDot} />
              <Text style={styles.metaTxt}>Publié hier</Text>
              <View style={styles.metaDot} />
              <Text style={styles.metaTxt}>12 vues</Text>
            </View>
          </View>
        </View>

        {/* Offres */}
        <Text style={styles.sectionTitle}>Choisissez votre offre</Text>
        <View style={styles.offers}>
          {OFFERS.map((o) => {
            const sel = selected === o.key;
            return (
              <Pressable
                key={o.key}
                onPress={() => setSelected(o.key)}
                style={[
                  styles.offer,
                  o.popular && styles.offerPopular,
                  sel && (o.popular ? styles.offerSelectedPopular : styles.offerSelected),
                ]}
              >
                {o.popular && (
                  <LinearGradient colors={[colors.purple, colors.neon]} style={styles.popularBadge}>
                    <Text style={styles.popularTxt}>★ POPULAIRE</Text>
                  </LinearGradient>
                )}
                <View style={styles.offerRow}>
                  <View style={[styles.radio, sel && { borderColor: o.popular ? colors.purple : colors.neon }]}>
                    {sel && <View style={[styles.radioDot, { backgroundColor: o.popular ? colors.purple : colors.neon }]} />}
                  </View>
                  <View style={styles.offerCol}>
                    <Text style={styles.offerName}>{o.name}</Text>
                    <Text style={styles.offerDesc}>{o.desc}</Text>
                  </View>
                  <View style={styles.offerPriceCol}>
                    <Text style={styles.offerAmount}>
                      {o.amount}<Text style={styles.currency}>€</Text>
                    </Text>
                    <Text style={styles.offerDuration}>{o.duration}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Inclus */}
        <View style={styles.features}>
          <Text style={styles.featTitle}>
            INCLUS DANS <Text style={{ color: colors.purple }}>BOOST PREMIUM</Text>
          </Text>
          {INCLUDED.map((f) => (
            <View key={f} style={styles.featItem}>
              <View style={styles.featIcon}>
                <Check size={11} color={colors.success} strokeWidth={3} />
              </View>
              <Text style={styles.featTxt}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Code promo */}
        <Pressable style={styles.promo}>
          <View style={styles.promoIcon}>
            <Ticket size={14} color={colors.warn} />
          </View>
          <Text style={styles.promoTxt}>Ajouter un code promo</Text>
          <ChevronRight size={14} color={colors.inkMute} />
        </Pressable>
      </Screen>

      {/* Pay bar (fixé en bas) */}
      <View style={styles.payBar}>
        <Pressable style={styles.payMethod}>
          <View style={styles.payMethodIcon}>
            <Text style={styles.payMethodIconTxt}>VISA</Text>
          </View>
          <Text style={styles.payText}>
            Visa <Text style={styles.payNum}>•••• 4827</Text>
          </Text>
          <Text style={styles.payChange}>Modifier</Text>
        </Pressable>

        <View style={styles.paySummary}>
          <Text style={styles.paySummaryLabel}>Boost premium · 7 jours</Text>
          <Text style={styles.paySummaryValue}>9,99 €</Text>
        </View>

        <Pressable>
          <LinearGradient colors={[colors.neon, colors.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.payBtn}>
            <CreditCard size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.payBtnTxt}>Payer 9,99 €</Text>
          </LinearGradient>
        </Pressable>

        <View style={styles.paySecure}>
          <Shield size={10} color={colors.success} />
          <Text style={styles.paySecureTxt}>Paiement sécurisé Stripe</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  topnavTitle: { fontFamily: fonts.mono, fontSize: 13, color: colors.inkMute, letterSpacing: 1, textTransform: 'uppercase' },

  hero: { marginTop: 4, marginBottom: 18, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(184,132,230,0.3)', overflow: 'hidden' },
  heroIcon: { width: 48, height: 48, borderRadius: 14, marginBottom: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...shadow.card },
  heroTitle: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, lineHeight: 27, marginBottom: 8 },
  heroSub: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 20 },
  heroStrong: { fontFamily: fonts.semibold, color: colors.ink },

  productMini: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginBottom: 24, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 14 },
  productThumb: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  productInfo: { flex: 1, minWidth: 0 },
  productName: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 3 },
  productMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productPrice: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.ink },
  metaTxt: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.lineStrong },

  sectionTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 12 },
  offers: { gap: 10 },
  offer: { padding: 16, backgroundColor: colors.panel, borderWidth: 1.5, borderColor: colors.line, borderRadius: 16 },
  offerPopular: { borderColor: 'rgba(184,132,230,0.5)', backgroundColor: 'rgba(184,132,230,0.06)' },
  offerSelected: { borderColor: colors.neon, backgroundColor: 'rgba(74,143,255,0.08)' },
  offerSelectedPopular: { borderColor: colors.purple, backgroundColor: 'rgba(184,132,230,0.1)' },
  popularBadge: { position: 'absolute', top: -10, right: 16, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, ...shadow.card },
  popularTxt: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1, color: '#fff' },
  offerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
  offerCol: { flex: 1, minWidth: 0 },
  offerName: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginBottom: 3 },
  offerDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, lineHeight: 16 },
  offerPriceCol: { alignItems: 'flex-end' },
  offerAmount: { fontFamily: fonts.monoBold, fontSize: 22, color: colors.ink },
  currency: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkMute },
  offerDuration: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginTop: 4, letterSpacing: 0.4 },

  features: { marginTop: 22, padding: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 14 },
  featTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  featItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  featIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(74,222,128,0.15)', alignItems: 'center', justifyContent: 'center' },
  featTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 18 },

  promo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18, padding: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.lineStrong, borderStyle: 'dashed', borderRadius: 12 },
  promoIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(251,191,36,0.12)', alignItems: 'center', justifyContent: 'center' },
  promoTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink },

  payBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 30, backgroundColor: 'rgba(8,9,14,0.96)', borderTopWidth: 1, borderTopColor: colors.line },
  payMethod: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 12, marginBottom: 10 },
  payMethodIcon: { width: 32, height: 22, borderRadius: 5, backgroundColor: '#1a3656', alignItems: 'center', justifyContent: 'center' },
  payMethodIconTxt: { fontFamily: fonts.bold, fontSize: 9, color: colors.neon, letterSpacing: 0.4 },
  payText: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  payNum: { fontFamily: fonts.mono, color: colors.inkMute },
  payChange: { fontFamily: fonts.semibold, fontSize: 11, color: colors.neon },
  paySummary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  paySummaryLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute },
  paySummaryValue: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink },
  payBtn: { height: 54, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.neon },
  payBtnTxt: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  paySecure: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8 },
  paySecureTxt: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute },
});
