import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  SlidersHorizontal,
  MoreVertical,
  Search,
  Mic,
  Home,
  Briefcase,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Fuel,
  Camera,
  Navigation,
  Star,
  Map as MapIcon,
  Plus,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

/**
 * Lieux favoris — accès rapides + liste de spots enregistrés.
 * Localisé Paris : adresses Rivoli/Champs-Élysées, spots Fontainebleau/Chevreuse.
 */
export default function LieuxFavorisScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState(0);

  const cats = [
    { label: 'Tous', count: '14' },
    { label: '🌄 Spots', count: '5' },
    { label: '👥 Rassemblements', count: '3' },
    { label: '⛽ Stations', count: '2' },
    { label: '🔧 Garages', count: null },
  ];

  const places = [
    { name: 'Belvédère de la Vallée de Chevreuse', addr: 'D906, Chevreuse · 32 km', icon: TrendingUp, tint: colors.success, type: 'Spot panoramique', extra: 'Visité 8×', pinned: true },
    { name: 'Café motards · Place de la Bastille', addr: 'Place de la Bastille · Paris 11e', icon: Users, tint: colors.warn, type: 'Rassemblement', extra: 'Tous les dim. 9h', pinned: false },
    { name: 'Route des Crêtes du Vexin', addr: 'D14 · Vexin français', icon: MapIcon, tint: colors.purple, type: 'Route mythique', extra: '14 km · sinueux', pinned: true },
    { name: "Total Porte d'Orléans · A6a", addr: 'Boulevard Périphérique sud', icon: Fuel, tint: colors.neon, type: 'Station 24/7', extra: 'Sur trajet boulot', pinned: false },
    { name: 'Garage Moto Paris', addr: '45 rue du Faubourg Saint-Antoine · Paris 12e', icon: SlidersHorizontal, tint: colors.danger, type: 'Garage', extra: 'Réparation · concessionnaire', pinned: false },
    { name: 'Belvédère de Fontainebleau', addr: 'Forêt domaniale · Point de vue', icon: Camera, tint: colors.success, type: 'Spot photo', extra: 'Visité 3×', pinned: false },
  ];

  return (
    <View style={styles.root}>
      <Screen pad={0} contentStyle={{ paddingBottom: 100 }} edges={['top']}>
        {/* Top nav */}
        <View style={styles.topnav}>
          <Pressable style={styles.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={18} color={colors.ink} />
          </Pressable>
          <Text style={styles.topTitle}>Mes lieux</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable style={styles.iconBtn}>
              <SlidersHorizontal size={18} color={colors.ink} />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <MoreVertical size={18} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lieux favoris</Text>
          <Text style={styles.headerSub}>14 lieux enregistrés · prêts à naviguer</Text>
        </View>

        {/* Search */}
        <View style={styles.search}>
          <Search size={16} color={colors.inkDim} />
          <Text style={styles.searchPlaceholder}>Rechercher un lieu enregistré…</Text>
          <View style={styles.mic}>
            <Mic size={13} color={colors.ink} />
          </View>
        </View>

        {/* Accès rapide */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelTxt}>Accès rapide</Text>
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.quick}>
          <View style={[styles.quickCard, { borderColor: 'rgba(74,222,128,0.2)' }]}>
            <View style={[styles.quickIcon, { backgroundColor: 'rgba(74,222,128,0.15)' }]}>
              <Home size={18} color={colors.success} />
            </View>
            <Text style={[styles.quickLabel, { color: colors.success }]}>Domicile</Text>
            <Text style={styles.quickName}>Maison</Text>
            <Text style={styles.quickAddr}>24 rue de Rivoli{'\n'}Paris 1er</Text>
            <View style={styles.quickMeta}>
              <MapPin size={11} color={colors.inkDim} />
              <Text style={styles.quickMetaStrong}>2 min</Text>
            </View>
          </View>
          <View style={[styles.quickCard, { borderColor: 'rgba(77,143,255,0.2)' }]}>
            <View style={[styles.quickIcon, { backgroundColor: 'rgba(77,143,255,0.15)' }]}>
              <Briefcase size={18} color={colors.neon} />
            </View>
            <Text style={[styles.quickLabel, { color: colors.neonBright }]}>Travail</Text>
            <Text style={styles.quickName}>Bureau</Text>
            <Text style={styles.quickAddr}>60 avenue des Champs-Élysées{'\n'}Paris 8e</Text>
            <View style={styles.quickMeta}>
              <Clock size={11} color={colors.inkDim} />
              <Text style={styles.quickMetaStrong}>38 min</Text>
            </View>
          </View>
        </View>

        {/* Map mini */}
        <Pressable style={styles.mapMini}>
          <View style={styles.mapMiniPill}>
            <Text style={styles.mapMiniPillTxt}>14 lieux</Text>
          </View>
          <View style={styles.mapMiniCta}>
            <MapIcon size={14} color={colors.ink} />
            <Text style={styles.mapMiniCtaTxt}>Voir tous mes lieux sur la carte</Text>
          </View>
        </Pressable>

        {/* Filtres */}
        <View style={styles.cats}>
          {cats.map((c, i) => (
            <Pressable key={c.label} onPress={() => setCat(i)} style={[styles.catPill, cat === i && styles.catPillOn]}>
              <Text style={[styles.catPillTxt, cat === i && styles.catPillTxtOn]}>{c.label}</Text>
              {c.count ? (
                <View style={[styles.catCount, cat === i && styles.catCountOn]}>
                  <Text style={[styles.catCountTxt, cat === i && { color: colors.bg }]}>{c.count}</Text>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>

        {/* Liste des lieux */}
        <View style={{ paddingHorizontal: 16, gap: 8 }}>
          {places.map((p) => {
            const Icon = p.icon;
            return (
              <View key={p.name} style={styles.place}>
                <View style={[styles.placeIcon, { backgroundColor: `${p.tint}1f` }]}>
                  <Icon size={20} color={p.tint} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.placeRow1}>
                    <Text style={styles.placeName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    {p.pinned ? <Star size={12} color={colors.warn} fill={colors.warn} /> : null}
                  </View>
                  <Text style={styles.placeAddr} numberOfLines={1}>
                    {p.addr}
                  </Text>
                  <View style={styles.placeMeta}>
                    <Text style={[styles.placeMetaTxt, { color: p.tint }]}>{p.type}</Text>
                    <View style={styles.metaDot} />
                    <Text style={styles.placeMetaTxt}>{p.extra}</Text>
                  </View>
                </View>
                <Pressable style={styles.placeGo}>
                  <Navigation size={14} color="#fff" />
                </Pressable>
              </View>
            );
          })}
        </View>
      </Screen>

      {/* FAB */}
      <Pressable style={[styles.fab, { bottom: insets.bottom + 24 }]}>
        <Plus size={14} color="#fff" strokeWidth={2.5} />
        <Text style={styles.fabTxt}>Ajouter un lieu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topnav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.8 },

  header: { paddingHorizontal: 16, paddingBottom: 18 },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, letterSpacing: -0.5, marginBottom: 4 },
  headerSub: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim },

  search: { marginHorizontal: 16, marginBottom: 16, height: 44, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm },
  searchPlaceholder: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute },
  mic: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },

  sectionLabel: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10 },
  sectionLabelTxt: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionLine: { flex: 1, height: 1, backgroundColor: colors.line, marginLeft: 12 },

  quick: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 22 },
  quickCard: { flex: 1, padding: 14, backgroundColor: colors.panelSoft, borderWidth: 1, borderRadius: radius.lg },
  quickIcon: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  quickLabel: { fontFamily: fonts.monoBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  quickName: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginBottom: 2 },
  quickAddr: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 15, minHeight: 30 },
  quickMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line },
  quickMetaStrong: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.ink },

  mapMini: { marginHorizontal: 16, marginBottom: 18, height: 130, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.line, backgroundColor: '#0e1422', justifyContent: 'flex-end', padding: 12 },
  mapMiniPill: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(10,14,21,0.85)', borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill },
  mapMiniPillTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim },
  mapMiniCta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mapMiniCtaTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },

  cats: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, paddingBottom: 16 },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill },
  catPillOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  catPillTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim },
  catPillTxtOn: { color: colors.bg, fontFamily: fonts.semibold },
  catCount: { paddingHorizontal: 5, borderRadius: 4, backgroundColor: 'rgba(77,143,255,0.15)' },
  catCountOn: { backgroundColor: 'rgba(10,14,21,0.15)' },
  catCountTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.neonBright },

  place: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  placeIcon: { width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  placeRow1: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  placeName: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  placeAddr: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, marginBottom: 6 },
  placeMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  placeMetaTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.inkMute },
  placeGo: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },

  fab: {
    position: 'absolute',
    right: 16,
    height: 48,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.neon,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...shadow.neon,
  },
  fabTxt: { fontFamily: fonts.semibold, fontSize: 13, color: '#fff' },
});
