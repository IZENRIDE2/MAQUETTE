import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Heart,
  Search,
  ChevronsDown,
  ChevronRight,
  Star,
  Check,
  Clock,
  SlidersHorizontal,
} from 'lucide-react-native';
import { Screen, BottomTabBar } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

type Item = {
  name: string;
  price: string;
  oldPrice?: string;
  city: string;
  seller: string;
  verified?: boolean;
  saved: string;
  tint: string;
  glyph: string;
  badge?: { type: 'drop' | 'boost' | 'new'; label: string };
  drop?: boolean;
  sold?: boolean;
};

const ITEMS: Item[] = [
  { name: 'Casque Shoei NXR2 noir mat — Taille L', price: '360', oldPrice: '400 €', city: 'Paris 12e', seller: 'Marc D.', verified: true, saved: 'il y a 2j', tint: 'rgba(74,156,232,0.55)', glyph: '🪖', badge: { type: 'drop', label: '−40 €' }, drop: true },
  { name: 'Yamaha MT-09 SP 2024 — Comme neuve', price: '12 800', city: 'Paris 12e', seller: 'Yamaha Paris', verified: true, saved: 'il y a 4j', tint: 'rgba(93,202,165,0.5)', glyph: '🏍️', badge: { type: 'boost', label: 'Boosté' } },
  { name: 'Blouson cuir Dainese Racing 4 — T52', price: '295', oldPrice: '320 €', city: 'Montreuil', seller: 'Pierre B.', saved: 'il y a 5j', tint: 'rgba(127,119,221,0.55)', glyph: '🧥', badge: { type: 'drop', label: '−25 €' }, drop: true },
  { name: 'Gants Alpinestars SP-8 v3 — T9', price: '89,90', city: 'Boulogne-Billancourt', seller: 'Sophie L.', saved: 'hier', tint: 'rgba(250,199,117,0.5)', glyph: '🧤', badge: { type: 'new', label: 'Nouveau' } },
  { name: 'Intercom Cardo Packtalk Edge — Single', price: '299', oldPrice: '319 €', city: 'Vincennes', seller: 'Antoine P.', saved: 'il y a 1 sem.', tint: 'rgba(74,156,232,0.5)', glyph: '🎧', badge: { type: 'drop', label: '−20 €' }, drop: true },
  { name: 'Bottes Sidi Crossfire 3 SRS — 43', price: '240', city: 'Paris 12e', seller: 'Lucas T.', saved: 'il y a 1 sem.', tint: 'rgba(246,110,151,0.5)', glyph: '🥾' },
  { name: 'Casque Arai RX-7V Evo — Taille M', price: '520', city: 'Bois de Vincennes', seller: 'Karim T.', saved: 'il y a 2 sem.', tint: 'rgba(74,156,232,0.55)', glyph: '🪖', sold: true },
  { name: 'Sacoche réservoir Givi XS320 18L', price: '54', city: 'Paris 12e', seller: 'Thomas R.', saved: 'il y a 3 sem.', tint: 'rgba(250,199,117,0.5)', glyph: '🎒' },
];

const BADGE_STYLE = {
  drop: { bg: 'rgba(93,202,165,0.92)', color: colors.bg },
  boost: { bg: 'rgba(245,199,107,0.92)', color: colors.bg },
  new: { bg: 'rgba(74,156,232,0.92)', color: '#fff' },
};

/** Annonces favorites — grille 2 colonnes + alerte baisses de prix (localisé Paris / IDF). */
export default function AnnoncesFavoritesScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Nav top */}
      <View style={styles.navTop}>
        <Pressable style={styles.navBack}>
          <ChevronLeft size={16} color={colors.inkDim} />
        </Pressable>
        <View style={styles.navTitleRow}>
          <Heart size={14} color="#F66E97" fill="#F66E97" />
          <Text style={styles.navTitle}>Mes favoris</Text>
        </View>
        <Pressable style={styles.navIconBtn}>
          <Search size={16} color={colors.inkDim} />
        </Pressable>
      </View>

      {/* Filters bar */}
      <View style={styles.filters}>
        <View style={styles.countPill}>
          <View style={styles.countNum}>
            <Text style={styles.countNumTxt}>12</Text>
          </View>
          <Text style={styles.countLabel}>annonces</Text>
        </View>
        <Pressable style={styles.sortBtn}>
          <SlidersHorizontal size={12} color={colors.inkDim} />
          <Text style={styles.sortMute}>Trier : </Text>
          <Text style={styles.sortTxt}>Plus récents</Text>
        </Pressable>
      </View>

      {/* Price drop banner */}
      <View style={styles.pdb}>
        <View style={styles.pdbIcon}>
          <ChevronsDown size={14} color={colors.success} strokeWidth={2.4} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.pdbTitle}>
            <Text style={styles.pdbNum}>3</Text> baisses de prix
          </Text>
          <Text style={styles.pdbSub}>
            Économise jusqu'à <Text style={styles.pdbStrong}>−85 €</Text> sur tes favoris
          </Text>
        </View>
        <ChevronRight size={14} color={colors.success} strokeWidth={2.4} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {ITEMS.map((it) => (
            <View key={it.name} style={[styles.card, it.sold && styles.cardSold]}>
              <LinearGradient colors={['#1a1f2c', '#0f131c']} style={styles.image}>
                <Text style={[styles.glyph, { color: it.tint }]}>{it.glyph}</Text>
                {it.badge && (
                  <View style={[styles.badge, { backgroundColor: BADGE_STYLE[it.badge.type].bg }]}>
                    {it.badge.type === 'drop' && <ChevronsDown size={8} color={colors.bg} strokeWidth={3} />}
                    {it.badge.type === 'boost' && <Star size={8} color={colors.bg} fill={colors.bg} />}
                    <Text style={[styles.badgeTxt, { color: BADGE_STYLE[it.badge.type].color }]}>{it.badge.label}</Text>
                  </View>
                )}
                {it.sold && (
                  <View style={styles.soldOverlay}>
                    <Text style={styles.soldTxt}>VENDUE</Text>
                  </View>
                )}
                <View style={styles.heart}>
                  <Heart size={14} color="#F66E97" fill="#F66E97" />
                </View>
              </LinearGradient>
              <View style={styles.info}>
                <Text style={[styles.name, it.sold && styles.nameSold]} numberOfLines={2}>
                  {it.name}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.price, it.drop && { color: colors.success }]}>
                    <Text style={styles.currency}>€</Text>
                    {it.price}
                  </Text>
                  {it.oldPrice && <Text style={styles.priceOld}>{it.oldPrice}</Text>}
                </View>
                <View style={styles.meta}>
                  <Text style={styles.metaTxt}>{it.city}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.metaTxt}>{it.seller}</Text>
                  {it.verified && (
                    <View style={styles.sellerVerified}>
                      <Check size={5} color="#fff" strokeWidth={3.5} />
                    </View>
                  )}
                </View>
                <View style={styles.saved}>
                  <Clock size={9} color={colors.inkMute} />
                  <Text style={styles.savedTxt}>{it.saved}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomTabBar active="shop" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  navTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  navBack: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  navTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  navTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  navIconBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },

  filters: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  countPill: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  countNum: { paddingHorizontal: 9, paddingVertical: 4, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill },
  countNumTxt: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.ink },
  countLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginLeft: 'auto', paddingHorizontal: 11, paddingVertical: 6, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 9 },
  sortMute: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute },
  sortTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },

  pdb: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 4, padding: 11, backgroundColor: 'rgba(93,202,165,0.08)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.4)', borderRadius: 14 },
  pdbIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(93,202,165,0.15)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.4)', alignItems: 'center', justifyContent: 'center' },
  pdbTitle: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.ink, marginBottom: 1 },
  pdbNum: { fontFamily: fonts.monoBold, color: colors.success },
  pdbSub: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkDim },
  pdbStrong: { fontFamily: fonts.monoBold, color: colors.success },

  scroll: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 100 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  card: { width: '47.5%', backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 16, overflow: 'hidden', ...shadow.card },
  cardSold: { opacity: 0.55 },
  image: { width: '100%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  glyph: { fontSize: 44, opacity: 0.9 },
  badge: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5 },
  badgeTxt: { fontFamily: fonts.bold, fontSize: 8.5, textTransform: 'uppercase', letterSpacing: 0.4 },
  heart: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  soldOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,9,14,0.55)', alignItems: 'center', justifyContent: 'center' },
  soldTxt: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, letterSpacing: 3 },

  info: { padding: 12, paddingTop: 10 },
  name: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink, lineHeight: 16, marginBottom: 6, minHeight: 32 },
  nameSold: { textDecorationLine: 'line-through', color: colors.inkDim },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 4 },
  price: { fontFamily: fonts.monoBold, fontSize: 14.5, color: colors.ink },
  currency: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkDim },
  priceOld: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.inkMute, textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaTxt: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute },
  metaDot: { width: 2, height: 2, borderRadius: 1, backgroundColor: colors.inkMute },
  sellerVerified: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  saved: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.line, borderStyle: 'dashed' },
  savedTxt: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.inkMute },
});
