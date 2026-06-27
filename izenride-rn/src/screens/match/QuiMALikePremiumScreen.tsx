import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Filter, Heart, Star, ChevronUp, Check, X, MapPin, ChevronRight } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts } from '@/theme';

const gold = colors.warn;
const violet = colors.purple;

type Profile = {
  initial: string;
  name: string;
  age: string;
  dist: string;
  tags: string[];
  match: number;
  online?: boolean;
  verified?: boolean;
  grad: [string, string, ...string[]];
};

const PROFILES: Profile[] = [
  { initial: 'L', name: 'Léa M.', age: '28 ans', dist: '3 km', tags: ['MT-09', 'Chevreuse'], match: 94, online: true, verified: true, grad: [colors.neon, '#1a3a5e', '#0a1428'] },
  { initial: 'N', name: 'Nicolas R.', age: '34 ans', dist: '8 km', tags: ['Tracer 9', 'Vexin'], match: 89, grad: [violet, '#2a1f3d'] },
  { initial: 'C', name: 'Camille B.', age: '31 ans', dist: '15 km', tags: ['CB650R', 'Fontainebleau'], match: 76, online: true, verified: true, grad: [colors.success, '#0a2a1f'] },
  { initial: 'M', name: 'Marc D.', age: '42 ans', dist: '22 km', tags: ['R 1250 GS', 'Trail'], match: 72, grad: [gold, '#5a4520', '#1a1408'] },
  { initial: 'S', name: 'Sarah V.', age: '26 ans', dist: '5 km', tags: ['Z650', 'Sportive'], match: 91, online: true, verified: true, grad: [colors.danger, '#5a1a1a'] },
  { initial: 'J', name: 'Julien P.', age: '36 ans', dist: '18 km', tags: ['Speed Triple', 'Roadster'], match: 68, grad: ['#2a3040', '#0e1422'] },
];

/** Qui m'a liké — grille premium des likes reçus (localisé Paris / IDF). */
export default function QuiMALikePremiumScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top', 'bottom']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={18} color={colors.ink} />
        </Pressable>
        <View style={{ alignItems: 'center', gap: 2 }}>
          <Text style={styles.navTitle}>Qui m'a liké</Text>
          <View style={styles.proBadge}>
            <Star size={8} color="#1a1408" fill="#1a1408" />
            <Text style={styles.proBadgeTxt}>PRO</Text>
          </View>
        </View>
        <Pressable style={styles.iconBtn}>
          <Filter size={18} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header compteur */}
        <View style={styles.headerCount}>
          <View style={styles.headerIcon}>
            <Heart size={26} color={gold} fill={gold} />
          </View>
          <Text style={styles.count}>23</Text>
          <Text style={styles.countLabel}>
            <Text style={styles.countLabelStrong}>23 motards</Text> ont liké votre profil
          </Text>
          <View style={styles.trend}>
            <ChevronUp size={11} color={colors.success} strokeWidth={2.5} />
            <Text style={styles.trendTxt}>+6 cette semaine</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Tab label="Tous" count="23" active />
          <Tab label="Nouveaux" count="6" />
          <Tab label="Match auto" count="11" />
        </View>

        {/* Tri */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Trier par</Text>
          <View style={styles.sortPills}>
            <SortPill label="Récents" active />
            <SortPill label="Compatibilité" />
            <SortPill label="Distance" />
          </View>
        </View>

        {/* Grille */}
        <View style={styles.grid}>
          {PROFILES.map((p) => (
            <ProfileCard key={p.name} p={p} />
          ))}
        </View>

        {/* Premium reminder */}
        <View style={styles.premiumReminder}>
          <View style={styles.premiumIcon}>
            <Star size={18} color="#1a1408" fill="#1a1408" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>IzenRide PRO actif</Text>
            <Text style={styles.premiumDesc}>
              Vous avez accès aux <Text style={styles.premiumStrong}>likes reçus en illimité</Text> · renouvellement le 28 mai
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.exploreBtn}>
          <MapPin size={16} color={colors.ink} />
          <Text style={styles.exploreTxt}>Continuer à explorer</Text>
          <ChevronRight size={16} color={colors.ink} />
        </Pressable>
      </View>
    </Screen>
  );
}

function Tab({ label, count, active }: { label: string; count: string; active?: boolean }) {
  return (
    <View style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabTxt, active && { color: colors.ink, fontFamily: fonts.semibold }]}>{label}</Text>
      <Text style={[styles.tabCount, active && { backgroundColor: 'rgba(251,191,36,0.15)', color: gold }]}>{count}</Text>
    </View>
  );
}

function SortPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.sortPill, active && styles.sortPillActive]}>
      <Text style={[styles.sortPillTxt, active && { color: gold, fontFamily: fonts.semibold }]}>{label}</Text>
    </View>
  );
}

function ProfileCard({ p }: { p: Profile }) {
  const high = p.match >= 80;
  return (
    <View style={styles.profileCard}>
      <LinearGradient colors={p.grad} style={styles.profileImg}>
        <View style={styles.likeBadge}>
          <Heart size={13} color="#fff" fill="#fff" />
        </View>
        <View style={[styles.matchBadge, { borderColor: high ? 'rgba(74,222,128,0.4)' : 'rgba(251,191,36,0.4)' }]}>
          <Star size={9} color={high ? colors.success : gold} fill={high ? colors.success : gold} />
          <Text style={[styles.matchBadgeTxt, { color: high ? colors.success : gold }]}>{p.match}%</Text>
        </View>
        <Text style={styles.profileInitial}>{p.initial}</Text>
        {p.online ? <View style={styles.onlineDot} /> : null}
        <LinearGradient colors={['transparent', 'rgba(8,9,14,0.95)']} style={styles.profileOverlay} />

        <View style={styles.profileBody}>
          <View style={styles.profileNameRow}>
            <Text style={styles.profileName} numberOfLines={1}>{p.name}</Text>
            {p.verified ? (
              <View style={styles.verifiedMini}>
                <Check size={8} color="#fff" strokeWidth={3} />
              </View>
            ) : null}
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.profileMetaMono}>{p.age}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.profileMetaTxt}>{p.dist}</Text>
          </View>
          <View style={styles.profileTags}>
            {p.tags.map((t) => (
              <Text key={t} style={styles.profileTag}>{t}</Text>
            ))}
          </View>
          <View style={styles.profileAction}>
            <Pressable style={{ flex: 1 }}>
              <LinearGradient colors={[colors.neon, violet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.profileCta}>
                <Heart size={11} color="#fff" fill="#fff" />
                <Text style={styles.profileCtaTxt}>Liker en retour</Text>
              </LinearGradient>
            </Pressable>
            <Pressable style={styles.profileSkip}>
              <X size={12} color={colors.inkDim} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  proBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 1, backgroundColor: gold, borderRadius: 4 },
  proBadgeTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: '#1a1408', letterSpacing: 1 },

  headerCount: { alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 18 },
  headerIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(251,191,36,0.15)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.4)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  count: { fontFamily: fonts.monoBold, fontSize: 56, color: gold, lineHeight: 58 },
  countLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute, marginBottom: 12 },
  countLabelStrong: { fontFamily: fonts.semibold, color: colors.inkDim },
  trend: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(74,222,128,0.12)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: 999 },
  trendTxt: { fontFamily: fonts.mono, fontSize: 11, color: colors.success },

  tabs: { flexDirection: 'row', gap: 2, marginHorizontal: 16, marginBottom: 16, padding: 4, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12 },
  tab: { flex: 1, height: 34, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  tabActive: { backgroundColor: colors.bgDeep },
  tabTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute },
  tabCount: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim, backgroundColor: colors.line, paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden' },

  sortRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14 },
  sortLabel: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  sortPills: { flexDirection: 'row', gap: 5 },
  sortPill: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 8 },
  sortPillActive: { backgroundColor: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.3)' },
  sortPillTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },

  grid: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  profileCard: { width: '47.5%', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  profileImg: { aspectRatio: 0.8 },
  likeBadge: { position: 'absolute', top: 8, left: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  matchBadge: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(8,9,14,0.75)', borderWidth: 1, borderRadius: 999, zIndex: 3 },
  matchBadgeTxt: { fontFamily: fonts.monoBold, fontSize: 10 },
  profileInitial: { position: 'absolute', alignSelf: 'center', top: '20%', fontFamily: fonts.bold, fontSize: 64, color: 'rgba(255,255,255,0.5)' },
  onlineDot: { position: 'absolute', bottom: 130, right: 10, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.bg2, zIndex: 3 },
  profileOverlay: { position: 'absolute', left: 0, right: 0, top: '40%', bottom: 0 },
  profileBody: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12 },
  profileNameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  profileName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, flexShrink: 1 },
  verifiedMini: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  profileMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  profileMetaMono: { fontFamily: fonts.mono, fontSize: 10, color: 'rgba(232,235,242,0.7)' },
  profileMetaTxt: { fontFamily: fonts.regular, fontSize: 10, color: 'rgba(232,235,242,0.7)' },
  metaDot: { width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(232,235,242,0.4)' },
  profileTags: { flexDirection: 'row', gap: 3, flexWrap: 'wrap', marginTop: 2 },
  profileTag: { fontFamily: fonts.mono, fontSize: 9, color: 'rgba(232,235,242,0.85)', backgroundColor: 'rgba(8,9,14,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, overflow: 'hidden' },
  profileAction: { flexDirection: 'row', gap: 4, marginTop: 8 },
  profileCta: { height: 32, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  profileCtaTxt: { fontFamily: fonts.bold, fontSize: 11, color: '#fff' },
  profileSkip: { width: 36, height: 32, borderRadius: 8, backgroundColor: 'rgba(8,9,14,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

  premiumReminder: { marginHorizontal: 16, marginTop: 22, padding: 16, backgroundColor: colors.bg2, borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)', borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  premiumIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: gold, alignItems: 'center', justifyContent: 'center' },
  premiumTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  premiumDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
  premiumStrong: { fontFamily: fonts.semibold, color: gold },

  bottomBar: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, backgroundColor: 'rgba(8,9,14,0.96)', borderTopWidth: 1, borderTopColor: colors.line },
  exploreBtn: { height: 50, borderRadius: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  exploreTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
});
