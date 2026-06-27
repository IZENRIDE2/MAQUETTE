import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  MoreVertical,
  Calendar,
  Check,
  Clock,
  X,
  Search,
  SlidersHorizontal,
  MapPin,
  Crown,
  UserPlus,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

type Status = 'online' | 'away' | 'offline';
type Pill = 'confirmed' | 'pending';

type Participant = {
  initial: string;
  grad: [string, string];
  name: string;
  age: string;
  moto: string;
  dist: string;
  status: Status;
  pill: Pill;
  verified?: boolean;
  admin?: boolean;
  me?: boolean;
};

const STATS = [
  { value: '12', label: 'Confirmés', color: colors.success, bg: 'rgba(93,202,165,0.12)', Icon: Check, active: true },
  { value: '2', label: 'En attente', color: colors.warn, bg: 'rgba(250,199,117,0.12)', Icon: Clock },
  { value: '1', label: 'Désistés', color: colors.danger, bg: 'rgba(226,75,74,0.12)', Icon: X },
];

const FILTERS = ['Niveau · Confirmé+', 'Trail / Roadster', '≤ 30 km'];

const PARTICIPANTS: Participant[] = [
  { initial: 'L', grad: [colors.purple, '#2a1f3d'], name: 'Léa', age: '28', moto: 'MT-09', dist: '3 km', status: 'online', pill: 'confirmed', verified: true, admin: true },
  { initial: 'T', grad: [colors.neon, '#1a3a5e'], name: 'Thomas', age: '34', moto: 'Tracer 9', dist: '8 km', status: 'online', pill: 'confirmed', verified: true },
  { initial: 'M', grad: [colors.success, '#0a2a1f'], name: 'Marc', age: '42', moto: 'R 1250 GS', dist: '12 km', status: 'online', pill: 'confirmed' },
  { initial: 'S', grad: [colors.warn, '#5a4520'], name: 'Sophie', age: '31', moto: 'CB650R', dist: '15 km', status: 'away', pill: 'confirmed', verified: true },
  { initial: 'A', grad: ['#2a3040', '#0e1422'], name: 'Vous', age: '32', moto: 'R 1250 GS', dist: '—', status: 'online', pill: 'confirmed', verified: true, me: true },
  { initial: 'C', grad: [colors.danger, '#5a1a1a'], name: 'Camille', age: '26', moto: 'Z650', dist: '18 km', status: 'away', pill: 'confirmed' },
  { initial: 'J', grad: ['#2a3040', '#0e1422'], name: 'Julien', age: '36', moto: 'Speed Triple', dist: '22 km', status: 'offline', pill: 'confirmed', verified: true },
  { initial: 'É', grad: [colors.purple, '#2a1f3d'], name: 'Élodie', age: '29', moto: 'MT-07', dist: '24 km', status: 'online', pill: 'confirmed' },
  { initial: 'H', grad: [colors.neon, '#1a3a5e'], name: 'Hugo', age: '33', moto: 'CBR650R', dist: '28 km', status: 'offline', pill: 'pending' },
];

const STATUS_COLOR: Record<Status, string> = {
  online: colors.success,
  away: colors.warn,
  offline: colors.inkMute,
};

/** Liste des participants — grille (localisé Paris / IDF). */
export default function ListeDesParticipantsScreen() {
  const [filter, setFilter] = useState(0);

  return (
    <Screen scroll pad={0} edges={['top']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={16} color={colors.ink} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.topnavTitle}>Participants</Text>
          <Text style={styles.topnavSub}>15 inscrits · 12 confirmés</Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <MoreVertical size={16} color={colors.ink} />
        </Pressable>
      </View>

      {/* Event banner */}
      <View style={styles.eventBanner}>
        <View style={styles.eventIcon}>
          <Calendar size={16} color={colors.purple} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.eventTitle} numberOfLines={1}>
            Sortie Forêt de Fontainebleau · Vallée de Chevreuse
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaTxt}>Dim. 4 mai · 8:00</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaTxt}>140 km</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaTxt}>J-6</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsHeader}>
        {STATS.map((s) => (
          <View key={s.label} style={[styles.statCell, s.active && styles.statCellOn]}>
            <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
              <s.Icon size={11} color={s.color} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Search + filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <Search size={14} color={colors.inkMute} />
          <TextInput style={styles.searchInput} placeholder="Chercher un motard…" placeholderTextColor={colors.inkMute} />
        </View>
        <Pressable style={styles.filterBtn}>
          <SlidersHorizontal size={14} color={colors.ink} />
          <View style={styles.filterDot} />
        </Pressable>
      </View>

      {/* Active filters */}
      <View style={styles.activeFilters}>
        {FILTERS.map((f, i) => (
          <Pressable key={f} onPress={() => setFilter(i)} style={styles.activePill}>
            <Text style={styles.activePillTxt}>{f}</Text>
            <X size={9} color={colors.neon} strokeWidth={2.5} />
          </Pressable>
        ))}
      </View>

      {/* Section title */}
      <View style={styles.sectionRow}>
        <View style={styles.sectTitleRow}>
          <Text style={styles.sectTitle}>Confirmés</Text>
          <View style={styles.sectCount}>
            <Text style={styles.sectCountTxt}>12</Text>
          </View>
        </View>
        <Text style={styles.sectSort}>Trier · proximité ↑</Text>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {PARTICIPANTS.map((p) => (
          <View key={p.name} style={[styles.card, p.me && styles.cardMe]}>
            <LinearGradient colors={p.grad} style={styles.cardAvatar}>
              {p.admin && (
                <View style={styles.adminBadge}>
                  <Crown size={9} color="#1a1408" fill="#1a1408" />
                </View>
              )}
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[p.status] }]} />
              <Text style={[styles.cardInitial, p.me && { color: colors.neon }]}>{p.initial}</Text>
              <View style={[styles.statusPill, p.pill === 'pending' && styles.statusPillPending]}>
                {p.pill === 'confirmed' ? (
                  <Check size={7} color={colors.success} strokeWidth={3} />
                ) : (
                  <Clock size={7} color={colors.warn} strokeWidth={3} />
                )}
                <Text style={[styles.statusPillTxt, { color: p.pill === 'confirmed' ? colors.success : colors.warn }]}>
                  {p.pill === 'confirmed' ? 'OK' : '?'}
                </Text>
              </View>
              {p.verified && (
                <View style={styles.cardVerified}>
                  <Check size={8} color="#fff" strokeWidth={3} />
                </View>
              )}
            </LinearGradient>
            <View style={styles.cardBody}>
              <View style={styles.cardNameRow}>
                <Text style={[styles.cardName, p.me && { color: colors.neon }]} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={styles.cardAge}>{p.age}</Text>
              </View>
              <Text style={styles.cardMoto} numberOfLines={1}>
                {p.moto}
              </Text>
              <View style={styles.cardDist}>
                <MapPin size={8} color={colors.inkMute} />
                <Text style={styles.cardDistTxt}>{p.dist}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Invite FAB */}
      <Pressable style={styles.fab}>
        <LinearGradient colors={[colors.neon, colors.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fabGrad}>
          <UserPlus size={14} color="#fff" strokeWidth={2.5} />
          <Text style={styles.fabTxt}>Inviter</Text>
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

  eventBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11, backgroundColor: 'rgba(127,119,221,0.06)', borderBottomWidth: 1, borderBottomColor: colors.line },
  eventIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(127,119,221,0.15)', alignItems: 'center', justifyContent: 'center' },
  eventTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.inkMute },

  statsHeader: { flexDirection: 'row', gap: 6, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 },
  statCell: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 11, alignItems: 'center' },
  statCellOn: { borderColor: colors.neon, backgroundColor: 'rgba(77,143,255,0.06)' },
  statIcon: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  statValue: { fontFamily: fonts.monoBold, fontSize: 18, color: colors.ink, marginBottom: 2 },
  statLabel: { fontFamily: fonts.medium, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.6 },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10 },
  searchWrap: { flex: 1, height: 38, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 11, paddingHorizontal: 14 },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.ink },
  filterBtn: { width: 38, height: 38, borderRadius: 11, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  filterDot: { position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.neon, borderWidth: 1.5, borderColor: colors.bg },

  activeFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, paddingHorizontal: 14, paddingBottom: 8 },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 9, backgroundColor: 'rgba(77,143,255,0.08)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderRadius: radius.pill },
  activePillTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.neon },

  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 10 },
  sectTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectTitle: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  sectCount: { paddingHorizontal: 5, paddingVertical: 1, backgroundColor: colors.line, borderRadius: 3 },
  sectCountTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkDim },
  sectSort: { fontFamily: fonts.medium, fontSize: 11, color: colors.neon },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 14, paddingBottom: 100 },
  card: { width: '31.5%', marginBottom: 8, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 14, overflow: 'hidden' },
  cardMe: { borderColor: colors.neon },
  cardAvatar: { aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  cardInitial: { fontFamily: fonts.bold, fontSize: 34, color: 'rgba(255,255,255,0.6)' },
  adminBadge: { position: 'absolute', top: 5, left: 5, width: 18, height: 18, borderRadius: 9, backgroundColor: '#E8B547', alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  statusBadge: { position: 'absolute', top: 5, right: 5, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.panelSoft, zIndex: 3 },
  statusPill: { position: 'absolute', bottom: 4, left: 4, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 5, paddingVertical: 1, backgroundColor: 'rgba(8,9,14,0.85)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.4)', borderRadius: 4, zIndex: 3 },
  statusPillPending: { borderColor: 'rgba(250,199,117,0.4)' },
  statusPillTxt: { fontFamily: fonts.monoBold, fontSize: 8 },
  cardVerified: { position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.neon, borderWidth: 1.5, borderColor: colors.panelSoft, alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  cardBody: { padding: 8, paddingBottom: 10 },
  cardNameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 2 },
  cardName: { flex: 1, fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  cardAge: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  cardMoto: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, marginBottom: 2 },
  cardDist: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardDistTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  fab: { position: 'absolute', bottom: 30, right: 16 },
  fabGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 48, paddingHorizontal: 18, borderRadius: radius.pill },
  fabTxt: { fontFamily: fonts.semibold, fontSize: 13, color: '#fff' },
});
