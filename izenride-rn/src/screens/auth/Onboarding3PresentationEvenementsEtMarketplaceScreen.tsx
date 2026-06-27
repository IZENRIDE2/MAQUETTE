import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, ShoppingBag, ArrowRight, Star } from 'lucide-react-native';
import { Screen, PrimaryButton } from '@/components';
import { colors, fonts, radius } from '@/theme';

const EVENTS = [
  { day: '12', month: 'MAI', title: 'Balade Forêt de Fontainebleau', meta: 'Provins', pax: '14 / 20', unit: 'motards', badge: '8h', live: false },
  { day: '10', month: 'MAI', title: 'Café motards · Place de la Bastille', meta: 'Paris 12e', pax: '23', unit: 'présents', badge: 'LIVE', live: true },
  { day: '17', month: 'MAI', title: 'Run nocturne — Vallée de Chevreuse', meta: 'Départ 21h', pax: '7 / 12', unit: 'places', badge: 'Nuit', live: false },
];

const PRODUCTS = [
  { name: 'Casque AGV K6 noir mat', price: '280 €', meta: 'État neuf · Paris 12e', tint: 'rgba(74,143,255,0.5)', boost: true },
  { name: 'Gants Alpinestars SP-8', price: '85 €', meta: 'Très bon · Boulogne', tint: 'rgba(251,191,36,0.5)', boost: false },
  { name: 'Blouson cuir Dainese T52', price: '320 €', meta: 'Bon état · Montreuil', tint: 'rgba(184,132,230,0.5)', boost: false },
  { name: 'MT-07 2021 · 8 200 km', price: '5 800 €', meta: 'Pro · Vincennes', tint: 'rgba(74,222,128,0.5)', boost: false },
];

/** Onboarding 3/4 — présentation Événements & Marketplace (localisé Paris). */
export default function Onboarding3PresentationEvenementsEtMarketplaceScreen() {
  return (
    <Screen scroll pad={24} contentStyle={{ paddingBottom: 40 }}>
      {/* Top bar : indicateurs de pages + Passer */}
      <View style={styles.topBar}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
        <Pressable hitSlop={8}>
          <Text style={styles.skip}>Passer</Text>
        </Pressable>
      </View>

      {/* Canvas démo : aperçu de l'app */}
      <View style={styles.canvas}>
        <View style={styles.canvasTabs}>
          <View style={[styles.canvasTab, styles.canvasTabActive]}>
            <Text style={[styles.canvasTabTxt, { color: colors.purple }]}>ÉVÉNEMENTS</Text>
          </View>
          <View style={styles.canvasTab}>
            <Text style={styles.canvasTabTxt}>MARKETPLACE</Text>
          </View>
        </View>

        {EVENTS.map((e) => (
          <View key={e.title} style={styles.eventCard}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>{e.day}</Text>
              <Text style={styles.eventMonth}>{e.month}</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle} numberOfLines={1}>{e.title}</Text>
              <View style={styles.eventMeta}>
                <Text style={styles.eventMetaTxt}>{e.meta}</Text>
                <View style={styles.metaDot} />
                <Text style={styles.eventPax}>{e.pax}</Text>
                <Text style={styles.eventMetaTxt}>{e.unit}</Text>
              </View>
            </View>
            <View style={[styles.eventBadge, e.live && styles.eventBadgeLive]}>
              {e.live && <View style={styles.liveDot} />}
              <Text style={[styles.eventBadgeTxt, e.live && { color: colors.danger }]}>{e.badge}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Feature cards */}
      <View style={styles.features}>
        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: 'rgba(184,132,230,0.12)', borderColor: 'rgba(184,132,230,0.25)' }]}>
            <Calendar size={18} color={colors.purple} />
          </View>
          <View style={styles.featureBody}>
            <Text style={styles.featureTitle}>Événements motards</Text>
            <Text style={styles.featureDesc}>
              Balades, rassemblements, runs de nuit. <Text style={styles.featureStrong}>Crée ou rejoins</Text> ce qui se passe près de toi.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.25)' }]}>
            <ShoppingBag size={18} color={colors.warn} />
          </View>
          <View style={styles.featureBody}>
            <Text style={styles.featureTitle}>Marketplace motarde</Text>
            <Text style={styles.featureDesc}>
              Équipement, pièces, motos d'occasion. <Text style={styles.featureStrong}>Achète et vends</Text> entre passionnés vérifiés.
            </Text>
          </View>
        </View>

        {/* Aperçu grille marketplace */}
        <View style={styles.marketGrid}>
          {PRODUCTS.map((p) => (
            <View key={p.name} style={styles.productCard}>
              <LinearGradient colors={['#1a1f2c', '#0f131c']} style={styles.productImage}>
                <Star size={26} color={p.tint} />
                {p.boost && (
                  <View style={styles.boostTag}>
                    <Text style={styles.boostTxt}>★ Boosté</Text>
                  </View>
                )}
              </LinearGradient>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.productPrice}>{p.price}</Text>
                <Text style={styles.productMeta} numberOfLines={1}>{p.meta}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <PrimaryButton
        label="Continuer"
        icon={<ArrowRight size={18} color="#fff" strokeWidth={2.5} />}
        style={{ marginTop: 24 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lineStrong },
  dotDone: { backgroundColor: colors.inkMute },
  dotActive: { width: 22, borderRadius: 3, backgroundColor: colors.purple },
  skip: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },

  canvas: { borderRadius: 26, backgroundColor: '#0d1018', borderWidth: 1, borderColor: colors.line, padding: 14 },
  canvasTabs: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  canvasTab: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(255,255,255,0.02)' },
  canvasTabActive: { borderColor: 'rgba(184,132,230,0.4)', backgroundColor: 'rgba(184,132,230,0.1)' },
  canvasTabTxt: { fontFamily: fonts.monoBold, fontSize: 9, letterSpacing: 1, color: colors.inkMute },

  eventCard: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  eventDate: { width: 42, height: 42, borderRadius: 9, backgroundColor: 'rgba(184,132,230,0.1)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.3)', alignItems: 'center', justifyContent: 'center' },
  eventDay: { fontFamily: fonts.monoBold, fontSize: 16, color: colors.purple, lineHeight: 18 },
  eventMonth: { fontFamily: fonts.monoBold, fontSize: 8, letterSpacing: 0.8, color: colors.purple },
  eventInfo: { flex: 1, minWidth: 0 },
  eventTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink, marginBottom: 2 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eventMetaTxt: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute },
  eventPax: { fontFamily: fonts.mono, fontSize: 10, color: colors.success },
  metaDot: { width: 2, height: 2, borderRadius: 1, backgroundColor: colors.inkMute },
  eventBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, backgroundColor: 'rgba(184,132,230,0.12)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.25)' },
  eventBadgeLive: { backgroundColor: 'rgba(255,92,122,0.12)', borderColor: 'rgba(255,92,122,0.3)' },
  eventBadgeTxt: { fontFamily: fonts.bold, fontSize: 9, color: colors.purple },
  liveDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.danger },

  features: { marginTop: 16, gap: 10 },
  featureCard: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  featureIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  featureBody: { flex: 1, minWidth: 0 },
  featureTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  featureDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 17 },
  featureStrong: { fontFamily: fonts.semibold, color: colors.ink },

  marketGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  productCard: { width: '48%', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 12, overflow: 'hidden' },
  productImage: { height: 70, alignItems: 'center', justifyContent: 'center' },
  boostTag: { position: 'absolute', top: 6, right: 6, backgroundColor: colors.warn, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  boostTxt: { fontFamily: fonts.bold, fontSize: 8, color: colors.bg },
  productInfo: { padding: 8 },
  productName: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink, marginBottom: 2 },
  productPrice: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.warn },
  productMeta: { fontFamily: fonts.regular, fontSize: 9, color: colors.inkMute, marginTop: 3 },
});
