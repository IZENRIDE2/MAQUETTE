import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Share2,
  Trophy,
  MapPin,
  Users,
  Clock,
  Star,
  TrendingUp,
  Shield,
  Sun,
  Calendar,
  Lock,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

const GOLD = '#E8B547';

const FILTERS = [
  { label: 'Tous', count: 24, on: true },
  { label: 'Débloqués', count: 9 },
  { label: 'Distance', count: 5 },
  { label: 'Social', count: 6 },
  { label: 'Événements', count: 4 },
  { label: 'Spéciaux', count: 9 },
];

type Rarity = 'legendary' | 'epic' | 'rare' | 'common' | 'locked';

const BADGES: {
  icon: React.ReactNode;
  name: string;
  meta: string;
  rarity: Rarity;
  rarityDots: number;
  isNew?: boolean;
  progress?: number;
}[] = [
  { icon: <Star size={24} color={GOLD} fill={GOLD} />, name: 'Légende', meta: '10 000 km', rarity: 'legendary', rarityDots: 3, isNew: true },
  { icon: <TrendingUp size={24} color={colors.purple} />, name: 'Conquérant', meta: '22 cols', rarity: 'epic', rarityDots: 2 },
  { icon: <Users size={24} color={colors.purple} />, name: 'Capitaine', meta: '38 sorties', rarity: 'epic', rarityDots: 2 },
  { icon: <Shield size={24} color={colors.neon} />, name: 'Mode ZEN', meta: '96 % score', rarity: 'rare', rarityDots: 1 },
  { icon: <Sun size={24} color={colors.neon} />, name: 'Aube', meta: '10 lever de soleil', rarity: 'rare', rarityDots: 1 },
  { icon: <Clock size={24} color={colors.success} />, name: 'Vétéran', meta: '3 ans', rarity: 'common', rarityDots: 0 },
  { icon: <Shield size={24} color={colors.success} />, name: 'Vérifié', meta: 'Identité OK', rarity: 'common', rarityDots: 0 },
  { icon: <MapPin size={24} color={colors.success} />, name: 'Premier 100 km', meta: 'débloqué', rarity: 'common', rarityDots: 0 },
  { icon: <Calendar size={24} color={colors.success} />, name: 'Première sortie', meta: 'groupe', rarity: 'common', rarityDots: 0 },
  { icon: <Star size={24} color={colors.inkMute} />, name: '15 000 km', meta: '82 %', rarity: 'locked', rarityDots: 0, progress: 82 },
  { icon: <Lock size={24} color={colors.inkMute} />, name: '100K km', meta: 'verrouillé', rarity: 'locked', rarityDots: 0 },
  { icon: <TrendingUp size={24} color={colors.inkMute} />, name: '50 cols', meta: '44 %', rarity: 'locked', rarityDots: 0, progress: 44 },
];

const RARITY_BG: Record<Rarity, string> = {
  legendary: 'rgba(232,181,71,0.12)',
  epic: 'rgba(184,132,230,0.12)',
  rare: 'rgba(77,143,255,0.1)',
  common: 'rgba(74,222,128,0.1)',
  locked: colors.line,
};
const RARITY_BORDER: Record<Rarity, string> = {
  legendary: 'rgba(232,181,71,0.35)',
  epic: 'rgba(184,132,230,0.3)',
  rare: 'rgba(77,143,255,0.25)',
  common: colors.line,
  locked: colors.line,
};
const RARITY_DOT: Record<Rarity, string> = {
  legendary: GOLD,
  epic: colors.purple,
  rare: colors.neon,
  common: colors.success,
  locked: colors.inkMute,
};

/** Badges & achievements — collection de badges motards (localisé Paris). */
export default function BadgesAchievementsScreen() {
  const [filter, setFilter] = useState('Tous');

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={18} color={colors.ink} />
        </Pressable>
        <Text style={styles.navTitle}>Mes badges</Text>
        <Pressable style={styles.iconBtn}>
          <Share2 size={18} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.trophy}>
            <Trophy size={44} color={GOLD} fill={GOLD} />
          </View>
          <Text style={styles.heroCount}>
            9<Text style={styles.heroTotal}> / 24</Text>
          </Text>
          <Text style={styles.heroLabel}>
            <Text style={{ color: colors.ink, fontFamily: fonts.semibold }}>9 badges débloqués</Text> · top 18% des riders
          </Text>

          <View style={styles.miniStats}>
            <MiniStat icon={<MapPin size={11} color={colors.neon} />} bg="rgba(77,143,255,0.12)" value="12 480" unit="km" label="Cette année" />
            <MiniStat icon={<Users size={11} color={colors.purple} />} bg="rgba(184,132,230,0.12)" value="42" label="Sorties" />
            <MiniStat icon={<Clock size={11} color={colors.success} />} bg="rgba(74,222,128,0.12)" value="3" unit="ans" label="Sur IzenRide" />
          </View>
        </View>

        {/* Latest unlocked */}
        <View style={styles.latestCard}>
          <View style={styles.latestIcon}>
            <Star size={24} color={GOLD} fill={GOLD} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.latestTag}>
              <Text style={styles.latestTagTxt}>Débloqué hier</Text>
            </View>
            <Text style={styles.latestTitle}>Légende des 10 000 km</Text>
            <Text style={styles.latestDesc}>22 avr · 14:08 · partagé</Text>
          </View>
          <Pressable style={styles.latestShare}>
            <Share2 size={14} color={colors.ink} />
          </Pressable>
        </View>

        {/* Next to unlock */}
        <View style={styles.nextWrap}>
          <View style={styles.nextHead}>
            <Text style={styles.nextLabel}>Prochain à débloquer</Text>
            <Text style={styles.nextCounter}>
              <Text style={{ color: colors.neon }}>820 km</Text> restants
            </Text>
          </View>
          <View style={styles.nextCard}>
            <View style={styles.nextIcon}>
              <Star size={16} color={colors.neon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextName}>Vétéran · 15 000 km</Text>
              <View style={styles.nextBar}>
                <LinearGradient colors={[colors.neon, colors.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.nextFill, { width: '82%' }]} />
              </View>
              <View style={styles.nextMeta}>
                <Text style={styles.nextMetaTxt}>
                  <Text style={{ color: colors.ink }}>14 180</Text> / 15 000 km
                </Text>
                <Text style={styles.nextMetaTxt}>82 %</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((f) => {
            const on = filter === f.label;
            return (
              <Pressable key={f.label} onPress={() => setFilter(f.label)} style={[styles.filterPill, on && styles.filterPillOn]}>
                <Text style={[styles.filterTxt, on && { color: colors.neon }]}>{f.label}</Text>
                <View style={[styles.filterCount, on && { backgroundColor: 'rgba(77,143,255,0.2)' }]}>
                  <Text style={[styles.filterCountTxt, on && { color: colors.neon }]}>{f.count}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Collection */}
        <View style={styles.collHead}>
          <Text style={styles.collTitle}>Collection</Text>
          <Text style={styles.collMeta}>
            <Text style={{ color: colors.ink }}>9</Text> / 24
          </Text>
        </View>

        <View style={styles.badgesGrid}>
          {BADGES.map((b) => {
            const locked = b.rarity === 'locked';
            return (
              <View
                key={b.name}
                style={[
                  styles.badge,
                  { backgroundColor: RARITY_BG[b.rarity], borderColor: RARITY_BORDER[b.rarity] },
                  locked && { opacity: 0.55 },
                ]}
              >
                {b.isNew && (
                  <View style={styles.newPin}>
                    <Text style={styles.newPinTxt}>NEW</Text>
                  </View>
                )}
                {b.rarityDots > 0 && (
                  <View style={styles.rarityDots}>
                    {Array.from({ length: b.rarityDots }).map((_, i) => (
                      <View key={i} style={[styles.rarityDot, { backgroundColor: RARITY_DOT[b.rarity] }]} />
                    ))}
                  </View>
                )}
                <View style={[styles.badgeIcon, { backgroundColor: locked ? colors.line : RARITY_BG[b.rarity] }]}>{b.icon}</View>
                <Text style={[styles.badgeName, locked && { color: colors.inkMute }]}>{b.name}</Text>
                <Text style={styles.badgeMeta}>{b.meta}</Text>
                {b.progress != null && (
                  <View style={styles.badgeProgress}>
                    <View style={[styles.badgeProgressFill, { width: `${b.progress}%` }]} />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

function MiniStat({
  icon,
  bg,
  value,
  unit,
  label,
}: {
  icon: React.ReactNode;
  bg: string;
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <View style={styles.miniStat}>
      <View style={[styles.miniStatIc, { backgroundColor: bg }]}>{icon}</View>
      <Text style={styles.miniStatVal}>
        {value}
        {unit ? <Text style={styles.miniStatUnit}> {unit}</Text> : null}
      </Text>
      <Text style={styles.miniStatLbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },

  content: { paddingBottom: 40 },

  hero: { paddingHorizontal: 16, paddingBottom: 18, alignItems: 'center' },
  trophy: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 14, backgroundColor: 'rgba(232,181,71,0.12)', ...shadow.card },
  heroCount: { fontFamily: fonts.monoBold, fontSize: 44, color: colors.ink, marginBottom: 4 },
  heroTotal: { fontSize: 24, color: colors.inkMute, fontFamily: fonts.mono },
  heroLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkMute, marginBottom: 12, textAlign: 'center' },

  miniStats: { flexDirection: 'row', gap: 6, alignSelf: 'stretch' },
  miniStat: { flex: 1, paddingVertical: 9, alignItems: 'center', backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
  miniStatIc: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  miniStatVal: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.ink },
  miniStatUnit: { fontFamily: fonts.regular, fontSize: 9, color: colors.inkMute },
  miniStatLbl: { fontFamily: fonts.medium, fontSize: 8, color: colors.inkMute, textTransform: 'uppercase', marginTop: 3 },

  latestCard: { marginHorizontal: 16, marginBottom: 18, padding: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(232,181,71,0.08)', borderWidth: 1, borderColor: 'rgba(232,181,71,0.3)' },
  latestIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(232,181,71,0.2)', borderWidth: 1.5, borderColor: 'rgba(232,181,71,0.5)' },
  latestTag: { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4, backgroundColor: 'rgba(232,181,71,0.15)', borderWidth: 1, borderColor: 'rgba(232,181,71,0.3)', marginBottom: 4 },
  latestTagTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: GOLD, textTransform: 'uppercase' },
  latestTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  latestDesc: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  latestShare: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },

  nextWrap: { marginHorizontal: 16, marginBottom: 22 },
  nextHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  nextLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  nextCounter: { fontFamily: fonts.mono, fontSize: 10, color: colors.ink },
  nextCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12 },
  nextIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(77,143,255,0.1)', borderWidth: 1.5, borderColor: 'rgba(77,143,255,0.4)', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  nextName: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink, marginBottom: 4 },
  nextBar: { height: 5, borderRadius: 3, backgroundColor: colors.bg, overflow: 'hidden' },
  nextFill: { height: 5, borderRadius: 3 },
  nextMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  nextMetaTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  filters: { paddingHorizontal: 16, gap: 6, paddingBottom: 16 },
  filterPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line },
  filterPillOn: { backgroundColor: 'rgba(77,143,255,0.1)', borderColor: colors.neon },
  filterTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.ink },
  filterCount: { paddingHorizontal: 5, borderRadius: 4, backgroundColor: colors.line },
  filterCountTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  collHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 16, marginBottom: 12 },
  collTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  collMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  badge: { width: '31.5%', paddingVertical: 14, paddingHorizontal: 6, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  newPin: { position: 'absolute', top: 6, left: 6, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, backgroundColor: colors.success },
  newPinTxt: { fontFamily: fonts.monoBold, fontSize: 7, color: colors.bg, textTransform: 'uppercase', letterSpacing: 1 },
  rarityDots: { position: 'absolute', top: 6, right: 6, flexDirection: 'row', gap: 1 },
  rarityDot: { width: 5, height: 5, borderRadius: 2.5 },
  badgeIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  badgeName: { fontFamily: fonts.bold, fontSize: 11, color: colors.ink, textAlign: 'center', marginBottom: 3 },
  badgeMeta: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textAlign: 'center' },
  badgeProgress: { height: 3, borderRadius: 2, backgroundColor: colors.bg, marginTop: 6, alignSelf: 'stretch', marginHorizontal: 4, overflow: 'hidden' },
  badgeProgressFill: { height: 3, borderRadius: 2, backgroundColor: colors.neon },
});
