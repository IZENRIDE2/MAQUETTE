import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Share2,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Play,
  Upload,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

type Photo = {
  glyph: string;
  grad: [string, string];
  author: { initial: string; grad: [string, string] };
  size?: 'large' | 'tall' | 'wide';
  likes?: number;
  comments?: number;
  mine?: boolean;
  isNew?: boolean;
  video?: string;
};

const STATS = [
  { value: '42', label: 'Photos' },
  { value: '3', label: 'Vidéos' },
  { value: '8', label: 'Contributeurs' },
];

const CONTRIBUTORS = [
  { initial: 'L', grad: [colors.purple, '#2a1f3d'] as [string, string] },
  { initial: 'T', grad: [colors.neon, '#1a3a5e'] as [string, string] },
  { initial: 'M', grad: [colors.success, '#0a2a1f'] as [string, string] },
  { initial: 'S', grad: [colors.warn, '#5a4520'] as [string, string] },
];

const TABS = [
  { label: 'Tout', count: '45' },
  { label: 'Photos', count: '42' },
  { label: 'Vidéos', count: '3' },
  { label: 'Aimées', count: '12' },
  { label: 'Mes ajouts', count: '5' },
];

const AV = {
  L: { initial: 'L', grad: [colors.purple, '#2a1f3d'] as [string, string] },
  T: { initial: 'T', grad: [colors.neon, '#1a3a5e'] as [string, string] },
  M: { initial: 'M', grad: [colors.success, '#0a2a1f'] as [string, string] },
  S: { initial: 'S', grad: [colors.warn, '#5a4520'] as [string, string] },
  A: { initial: 'A', grad: ['#2a3040', '#0e1422'] as [string, string] },
};

const PHOTOS: Photo[] = [
  { glyph: '🌅', grad: ['#1a2848', '#9c5a4a'], author: AV.L, size: 'large', likes: 12, comments: 5, isNew: true },
  { glyph: '🏍️', grad: ['#2a3040', '#0e1422'], author: AV.T, size: 'tall', likes: 8, comments: 2 },
  { glyph: '🌊', grad: [colors.neon, '#1a3a5e'], author: AV.M },
  { glyph: '🎬', grad: ['#0a1422', '#2a3040'], author: AV.M, size: 'wide', likes: 6, comments: 3, video: '1:24' },
  { glyph: '🏔️', grad: [colors.success, '#0a1428'], author: AV.A, likes: 9, mine: true },
  { glyph: '☕', grad: [colors.warn, '#1a1408'], author: AV.S },
  { glyph: '🛣️', grad: [colors.purple, '#2a1f3d'], author: AV.L, size: 'tall', likes: 7, comments: 1 },
  { glyph: '🌅', grad: ['#ffa57a', '#1a0a08'], author: AV.T },
];

const PHOTOS2: Photo[] = [
  { glyph: '🏔️', grad: ['#b58bf8', '#1a0a28'], author: AV.S },
  { glyph: '☀️', grad: ['#c7635a', '#1a0808'], author: AV.M },
  { glyph: '📸', grad: ['#2a3040', '#0e1422'], author: AV.L },
];

function PhotoTile({ p }: { p: Photo }) {
  const w = p.size === 'large' || p.size === 'wide' ? '66%' : '32%';
  const h = p.size === 'large' || p.size === 'tall' ? 168 : 80;
  const big = p.size === 'large';
  return (
    <LinearGradient colors={p.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.photo, { width: w as any, height: h }, p.mine && styles.photoMine]}>
      <LinearGradient colors={p.author.grad} style={styles.photoAuthor}>
        <Text style={styles.photoAuthorTxt}>{p.author.initial}</Text>
      </LinearGradient>
      {p.isNew && (
        <View style={styles.photoNew}>
          <Text style={styles.photoNewTxt}>New</Text>
        </View>
      )}
      {p.video && (
        <View style={styles.photoVideo}>
          <Play size={8} color="#fff" fill="#fff" />
          <Text style={styles.photoVideoTxt}>{p.video}</Text>
        </View>
      )}
      <Text style={[styles.photoGlyph, big && { fontSize: 42 }]}>{p.glyph}</Text>
      {(p.likes || p.comments) && (
        <LinearGradient colors={['transparent', 'rgba(8,9,14,0.85)']} style={styles.photoOverlay}>
          {p.likes != null && (
            <View style={styles.photoStat}>
              <Heart size={10} color={colors.danger} fill={colors.danger} />
              <Text style={styles.photoStatTxt}>{p.likes}</Text>
            </View>
          )}
          {p.comments != null && (
            <View style={styles.photoStat}>
              <MessageCircle size={10} color="#fff" />
              <Text style={styles.photoStatTxt}>{p.comments}</Text>
            </View>
          )}
        </LinearGradient>
      )}
    </LinearGradient>
  );
}

/** Album photos post-événement — galerie mosaïque (localisé Paris / IDF). */
export default function AlbumPhotosPostEvenementScreen() {
  const [tab, setTab] = useState('Tout');

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={16} color={colors.ink} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.topnavTitle}>Album souvenirs</Text>
          <Text style={styles.topnavSub}>42 photos · 3 vidéos</Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <Share2 size={16} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {/* Event hero */}
        <View style={styles.hero}>
          <View style={styles.heroRow}>
            <View style={styles.eventIcon}>
              <ImageIcon size={18} color={colors.purple} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.eventPill}>
                <Text style={styles.eventPillTxt}>Événement passé · 2 j</Text>
              </View>
              <Text style={styles.eventTitle} numberOfLines={1}>
                Sortie Forêt de Fontainebleau · Vallée de Chevreuse
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaTxt}>27 avril</Text>
                <View style={styles.metaDot} />
                <Text style={styles.metaTxt}>140 km</Text>
                <View style={styles.metaDot} />
                <Text style={styles.metaTxt}>12 motards</Text>
              </View>
            </View>
          </View>
          <View style={styles.albumStats}>
            {STATS.map((s) => (
              <View key={s.label} style={styles.albumStat}>
                <Text style={styles.albumStatValue}>{s.value}</Text>
                <Text style={styles.albumStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contributors */}
        <View style={styles.contribStrip}>
          <View style={styles.contribAvatars}>
            {CONTRIBUTORS.map((c, i) => (
              <LinearGradient key={c.initial} colors={c.grad} style={[styles.contribAvatar, i > 0 && { marginLeft: -8 }]}>
                <Text style={styles.contribAvatarTxt}>{c.initial}</Text>
              </LinearGradient>
            ))}
            <View style={[styles.contribAvatar, styles.contribMore, { marginLeft: -8 }]}>
              <Text style={styles.contribMoreTxt}>+4</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contribLine}>
              <Text style={styles.contribStrong}>Léa</Text>, Thomas et 6 autres
            </Text>
            <Text style={styles.contribMeta}>Dernier ajout · il y a 2 h</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs} style={{ flexGrow: 0 }}>
          {TABS.map((t) => {
            const on = tab === t.label;
            return (
              <Pressable key={t.label} onPress={() => setTab(t.label)} style={[styles.tabPill, on && styles.tabPillOn]}>
                <Text style={[styles.tabTxt, on && { color: colors.purple }]}>{t.label}</Text>
                <View style={[styles.tabCount, on && styles.tabCountOn]}>
                  <Text style={[styles.tabCountTxt, on && { color: colors.purple }]}>{t.count}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Gallery */}
        <View style={styles.gallery}>
          {PHOTOS.map((p, i) => (
            <PhotoTile key={i} p={p} />
          ))}
        </View>

        {/* Upload CTA */}
        <View style={styles.uploadCta}>
          <View style={styles.uploadIcon}>
            <Upload size={18} color={colors.neon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.uploadTitle}>Partagez vos photos !</Text>
            <Text style={styles.uploadDesc}>
              L'album reste ouvert <Text style={styles.uploadStrong}>30 jours</Text> · 8 motards y ont déjà contribué.
            </Text>
          </View>
        </View>

        {/* Gallery 2 */}
        <View style={[styles.gallery, { marginTop: 8 }]}>
          {PHOTOS2.map((p, i) => (
            <PhotoTile key={i} p={p} />
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab}>
        <LinearGradient colors={[colors.neon, colors.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fabGrad}>
          <ImageIcon size={16} color="#fff" strokeWidth={2.5} />
          <Text style={styles.fabTxt}>Ajouter</Text>
        </LinearGradient>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  iconBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  topnavTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  topnavSub: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginTop: 1 },

  hero: { paddingHorizontal: 14, paddingVertical: 12, backgroundColor: 'rgba(127,119,221,0.06)', borderBottomWidth: 1, borderBottomColor: colors.line },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  eventIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(127,119,221,0.18)', alignItems: 'center', justifyContent: 'center' },
  eventPill: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(93,202,165,0.12)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)', borderRadius: 4, marginBottom: 3 },
  eventPillTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.success, textTransform: 'uppercase', letterSpacing: 0.8 },
  eventTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  metaTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.inkMute },
  albumStats: { flexDirection: 'row', gap: 6 },
  albumStat: { flex: 1, paddingVertical: 7, paddingHorizontal: 8, backgroundColor: 'rgba(8,9,14,0.45)', borderWidth: 1, borderColor: colors.line, borderRadius: 9, alignItems: 'center' },
  albumStatValue: { fontFamily: fonts.monoBold, fontSize: 14, color: colors.ink },
  albumStatLabel: { fontFamily: fonts.semibold, fontSize: 8, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 3 },

  contribStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  contribAvatars: { flexDirection: 'row' },
  contribAvatar: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  contribAvatarTxt: { fontFamily: fonts.bold, fontSize: 10, color: '#fff' },
  contribMore: { backgroundColor: colors.panelSoft },
  contribMoreTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  contribLine: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  contribStrong: { fontFamily: fonts.bold, color: colors.ink },
  contribMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginTop: 1 },

  tabs: { paddingHorizontal: 14, paddingVertical: 10, gap: 5 },
  tabPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill },
  tabPillOn: { backgroundColor: 'rgba(127,119,221,0.1)', borderColor: colors.purple },
  tabTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim },
  tabCount: { paddingHorizontal: 5, borderRadius: 4, backgroundColor: colors.line },
  tabCountOn: { backgroundColor: 'rgba(127,119,221,0.2)' },
  tabCountTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14 },
  photo: { borderRadius: 10, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  photoMine: { borderWidth: 2, borderColor: colors.neon },
  photoGlyph: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, textAlign: 'center', textAlignVertical: 'center', fontSize: 28, opacity: 0.7, lineHeight: 80 },
  photoAuthor: { position: 'absolute', top: 5, left: 5, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  photoAuthorTxt: { fontFamily: fonts.bold, fontSize: 8, color: '#fff' },
  photoNew: { position: 'absolute', top: 5, right: 5, paddingHorizontal: 4, paddingVertical: 1, backgroundColor: colors.success, borderRadius: 3, zIndex: 3 },
  photoNewTxt: { fontFamily: fonts.monoBold, fontSize: 7, color: colors.bg, textTransform: 'uppercase', letterSpacing: 0.6 },
  photoVideo: { position: 'absolute', top: 5, right: 5, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 5, paddingVertical: 2, backgroundColor: 'rgba(8,9,14,0.8)', borderRadius: 4, zIndex: 3 },
  photoVideoTxt: { fontFamily: fonts.mono, fontSize: 8, color: '#fff' },
  photoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, paddingTop: 12, paddingBottom: 5 },
  photoStat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  photoStatTxt: { fontFamily: fonts.mono, fontSize: 9, color: '#fff' },

  uploadCta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 14, marginTop: 14, padding: 12, backgroundColor: 'rgba(74,156,232,0.04)', borderWidth: 1.5, borderColor: 'rgba(77,143,255,0.4)', borderRadius: 14, borderStyle: 'dashed' },
  uploadIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(77,143,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  uploadTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  uploadDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
  uploadStrong: { fontFamily: fonts.semibold, color: colors.inkDim },

  fab: { position: 'absolute', bottom: 28, right: 16 },
  fabGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 52, paddingHorizontal: 20, borderRadius: radius.pill },
  fabTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
