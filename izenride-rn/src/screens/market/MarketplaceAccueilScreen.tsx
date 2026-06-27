import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SlidersHorizontal, BadgeCheck, Plus, MapPin } from 'lucide-react-native';
import { Screen, BottomTabBar, Pill } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

const CATS = ['Tout', 'Motos', 'Équipement', 'Pièces', 'Accessoires'];

const ITEMS = [
  { price: '6 200 €', title: 'Kawasaki Z650 2021 · 8 400 km', city: 'Paris 12e', verified: true, c: '#2c3a52' },
  { price: '289 €', title: 'Casque Shoei NXR2 intégral, taille M', city: 'Boulogne-Billancourt', c: '#1a2436' },
  { price: '149 €', title: 'Blouson cuir Dainese homme L', city: 'Montreuil', c: '#241a2e' },
  { price: '45 €', title: 'Paire de gants racing taille L', city: 'Vincennes', c: '#1a2e28' },
];

/** Marketplace — accueil (localisé Paris / Île-de-France). */
export default function MarketplaceAccueilScreen() {
  const [active, setActive] = useState('Tout');
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Marketplace</Text>
          <Text style={styles.sub}>Entre motards · Paris</Text>
        </View>
        <Pressable style={styles.filterBtn}>
          <SlidersHorizontal size={18} color={colors.ink} />
          <Text style={styles.filterTxt}>Filtrer</Text>
        </Pressable>
      </View>

      {/* Filtres catégories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={{ flexGrow: 0 }}
      >
        {CATS.map((c) => (
          <Pressable key={c} onPress={() => setActive(c)} style={[styles.chip, active === c && styles.chipOn]}>
            <Text style={[styles.chipTxt, active === c && { color: '#fff' }]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Récemment ajoutés</Text>
        <View style={styles.cards}>
          {ITEMS.map((it) => (
            <View key={it.title} style={styles.card}>
              <LinearGradient colors={[it.c, '#0a0e15']} style={styles.thumb}>
                {it.verified && (
                  <Pill
                    label="Vérifié"
                    color={colors.successText}
                    bg="rgba(74,222,128,0.15)"
                    border="rgba(74,222,128,0.4)"
                    style={{ position: 'absolute', top: 8, left: 8 }}
                  />
                )}
              </LinearGradient>
              <View style={styles.cardBody}>
                <Text style={styles.price}>{it.price}</Text>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {it.title}
                </Text>
                <View style={styles.cityRow}>
                  <MapPin size={12} color={colors.inkMute} />
                  <Text style={styles.city}>{it.city}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FAB Vendre */}
      <Pressable style={styles.fab}>
        <LinearGradient colors={[colors.neon, '#2563eb']} style={styles.fabGrad}>
          <Plus size={20} color="#fff" strokeWidth={3} />
          <Text style={styles.fabTxt}>Vendre</Text>
        </LinearGradient>
      </Pressable>

      <BottomTabBar active="shop" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 12 },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink },
  sub: { fontFamily: fonts.mono, fontSize: 11, color: colors.neonBright, marginTop: 2 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  filterTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },

  chips: { paddingHorizontal: 18, gap: 8, paddingBottom: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: colors.neon, borderColor: colors.neon },
  chipTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkDim },

  grid: { paddingHorizontal: 18, paddingBottom: 120 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, marginBottom: 12 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14 },
  card: { width: '47%', borderRadius: radius.lg, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, overflow: 'hidden', ...shadow.card },
  thumb: { height: 120, justifyContent: 'flex-start' },
  cardBody: { padding: 12 },
  price: { fontFamily: fonts.monoBold, fontSize: 17, color: colors.neonBright, marginBottom: 4 },
  itemTitle: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink, lineHeight: 18, marginBottom: 8 },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  city: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute },

  fab: { position: 'absolute', right: 18, bottom: 92 },
  fabGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, height: 50, borderRadius: radius.pill, ...shadow.neon },
  fabTxt: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
});
