import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Search,
  X,
  Check,
  Heart,
  Users,
  MapPin,
  Clock,
  Link2,
  ChevronRight,
  MessageCircle,
  Send,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

type Rider = {
  initial: string;
  grad: [string, string];
  name: string;
  moto: string;
  dist: string;
  match?: string;
  tag?: string;
  online?: boolean;
  verified?: boolean;
  selected?: boolean;
  busy?: string;
};

const SOURCES = [
  { label: 'Mes matchs', count: '23' },
  { label: 'Groupes', count: '4' },
  { label: 'Près de moi', count: '142' },
  { label: 'Récents', count: '8' },
];

const SELECTED = [
  { initial: 'L', name: 'Léa', grad: [colors.purple, '#2a1f3d'] as [string, string] },
  { initial: 'T', name: 'Thomas', grad: [colors.neon, '#1a3a5e'] as [string, string] },
  { initial: 'M', name: 'Marc', grad: [colors.success, '#0a2a1f'] as [string, string] },
];

const SUGGESTED: Rider[] = [
  { initial: 'L', grad: [colors.purple, '#2a1f3d'], name: 'Léa M.', moto: 'MT-09', dist: '3 km', match: 'Match 94%', tag: 'Forêts & cols', online: true, verified: true, selected: true },
  { initial: 'T', grad: [colors.neon, '#1a3a5e'], name: 'Thomas L.', moto: 'Tracer 9', dist: '8 km', match: 'Match 89%', tag: 'Chevreuse', online: true, verified: true, selected: true },
  { initial: 'M', grad: [colors.success, '#0a2a1f'], name: 'Marc D.', moto: 'R 1250 GS', dist: '12 km', match: 'Match 72%', tag: 'Trail', selected: true },
  { initial: 'S', grad: [colors.warn, '#5a4520'], name: 'Sophie V.', moto: 'CB650R', dist: '15 km', match: 'Match 76%', tag: 'Fontainebleau', online: true, verified: true },
  { initial: 'C', grad: [colors.danger, '#5a1a1a'], name: 'Camille B.', moto: 'Z650', dist: '18 km', busy: 'Indispo · autre sortie' },
];

const ALL: Rider[] = [
  { initial: 'J', grad: ['#2a3040', '#0e1422'], name: 'Julien P.', moto: 'Speed Triple', dist: '22 km', verified: true },
  { initial: 'É', grad: [colors.purple, '#2a1f3d'], name: 'Élodie F.', moto: 'MT-07', dist: '24 km' },
];

function RiderRow({ r }: { r: Rider }) {
  return (
    <View style={[styles.userRow, r.selected && styles.userRowOn, !!r.busy && styles.userRowBusy]}>
      <View style={styles.avatarWrap}>
        <LinearGradient colors={r.grad} style={styles.userAvatar}>
          <Text style={[styles.avatarTxt, r.grad[0] === colors.warn && { color: '#1a1408' }]}>{r.initial}</Text>
        </LinearGradient>
        {r.online && <View style={styles.onlineDot} />}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <Text style={styles.userName}>{r.name}</Text>
          {r.verified && (
            <View style={styles.verifiedBadge}>
              <Check size={7} color="#fff" strokeWidth={3} />
            </View>
          )}
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaTxt}>{r.moto}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaTxt}>{r.dist}</Text>
        </View>
        {(r.match || r.tag || r.busy) && (
          <View style={styles.tagsRow}>
            {r.match && (
              <View style={[styles.tag, styles.tagMatch]}>
                <Text style={styles.tagMatchTxt}>{r.match}</Text>
              </View>
            )}
            {r.tag && (
              <View style={styles.tag}>
                <Text style={styles.tagTxt}>{r.tag}</Text>
              </View>
            )}
            {r.busy && (
              <View style={[styles.tag, styles.tagBusy]}>
                <Text style={styles.tagBusyTxt}>{r.busy}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      <View style={[styles.checkbox, r.selected && styles.checkboxOn, !!r.busy && styles.checkboxBusy]}>
        {r.selected && <Check size={12} color="#fff" strokeWidth={3} />}
        {r.busy && <View style={styles.checkboxDash} />}
      </View>
    </View>
  );
}

/** Inviter à un événement — sélection de motards (localisé Paris / IDF). */
export default function InviterAUnEvenementScreen() {
  const [src, setSrc] = useState('Mes matchs');

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable>
          <Text style={styles.topnavCancel}>Annuler</Text>
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.topnavTitle}>Inviter à l'événement</Text>
          <Text style={styles.topnavSub}>Sélection de motards</Text>
        </View>
        <Pressable>
          <Text style={styles.topnavStep}>Tout</Text>
        </Pressable>
      </View>

      {/* Event banner */}
      <View style={styles.eventBanner}>
        <View style={styles.eventIcon}>
          <Calendar size={15} color={colors.purple} />
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
            <Text style={styles.metaTxt}>15 / 20 places</Text>
          </View>
        </View>
      </View>

      {/* Selected strip */}
      <View style={styles.selectedStrip}>
        <Text style={styles.selectedLabel}>3 sélectionnés</Text>
        {SELECTED.map((s) => (
          <View key={s.name} style={styles.selectedPill}>
            <LinearGradient colors={s.grad} style={styles.pillAvatar}>
              <Text style={styles.pillAvatarTxt}>{s.initial}</Text>
            </LinearGradient>
            <Text style={styles.pillName}>{s.name}</Text>
            <X size={10} color={colors.inkMute} strokeWidth={2.5} />
          </View>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchField}>
          <Search size={14} color={colors.inkMute} />
          <TextInput
            style={styles.searchInput}
            placeholder="Chercher par nom, moto, ville…"
            placeholderTextColor={colors.inkMute}
          />
        </View>
      </View>

      {/* Source tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sourceTabs} style={{ flexGrow: 0 }}>
        {SOURCES.map((s, i) => {
          const on = src === s.label;
          const Icon = [Heart, Users, MapPin, Clock][i];
          return (
            <Pressable key={s.label} onPress={() => setSrc(s.label)} style={[styles.srcTab, on && styles.srcTabOn]}>
              <Icon size={11} color={on ? colors.neon : colors.inkDim} />
              <Text style={[styles.srcTabTxt, on && { color: colors.neon }]}>{s.label}</Text>
              <View style={[styles.srcCount, on && styles.srcCountOn]}>
                <Text style={[styles.srcCountTxt, on && { color: colors.neon }]}>{s.count}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recommandés */}
        <View style={styles.sectHead}>
          <View style={styles.sectTitleRow}>
            <Text style={styles.sectTitle}>★ Recommandés pour cet event</Text>
            <View style={styles.sectCount}>
              <Text style={styles.sectCountTxt}>5</Text>
            </View>
          </View>
        </View>
        {SUGGESTED.map((r) => (
          <RiderRow key={r.name} r={r} />
        ))}

        {/* Tous mes matchs */}
        <View style={styles.sectHead}>
          <View style={styles.sectTitleRow}>
            <Text style={styles.sectTitle}>Tous mes matchs</Text>
            <View style={styles.sectCount}>
              <Text style={styles.sectCountTxt}>23</Text>
            </View>
          </View>
          <Text style={styles.sectAction}>Tout sélectionner</Text>
        </View>
        {ALL.map((r) => (
          <RiderRow key={r.name} r={r} />
        ))}

        {/* Invite link */}
        <View style={styles.linkCard}>
          <View style={styles.linkIcon}>
            <Link2 size={16} color={colors.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.linkTitle}>Inviter via un lien</Text>
            <Text style={styles.linkDesc}>
              Partagez en dehors d'IzenRide · valable <Text style={styles.linkStrong}>6 jours</Text>
            </Text>
          </View>
          <ChevronRight size={13} color={colors.purple} strokeWidth={2.5} />
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.msgBtn}>
          <MessageCircle size={18} color={colors.ink} />
        </Pressable>
        <Pressable style={styles.sendBtnWrap}>
          <LinearGradient colors={[colors.neon, colors.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sendBtn}>
            <Send size={14} color="#fff" />
            <Text style={styles.sendTxt}>Envoyer les invitations</Text>
            <View style={styles.sendPill}>
              <Text style={styles.sendPillTxt}>3</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  topnavCancel: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },
  topnavTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  topnavSub: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginTop: 1 },
  topnavStep: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkMute },

  eventBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: 'rgba(127,119,221,0.06)', borderBottomWidth: 1, borderBottomColor: colors.line },
  eventIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(127,119,221,0.15)', alignItems: 'center', justifyContent: 'center' },
  eventTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 1 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.inkMute },

  selectedStrip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  selectedLabel: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.neon, textTransform: 'uppercase', letterSpacing: 0.8 },
  selectedPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingRight: 10, paddingLeft: 4, backgroundColor: 'rgba(77,143,255,0.1)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderRadius: radius.pill },
  pillAvatar: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  pillAvatarTxt: { fontFamily: fonts.bold, fontSize: 9, color: '#fff' },
  pillName: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink },

  searchWrap: { paddingHorizontal: 14, paddingVertical: 10 },
  searchField: { height: 40, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 11, paddingHorizontal: 14 },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.ink },

  sourceTabs: { paddingHorizontal: 14, paddingBottom: 8, gap: 5 },
  srcTab: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill },
  srcTabOn: { backgroundColor: 'rgba(77,143,255,0.1)', borderColor: colors.neon },
  srcTabTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim },
  srcCount: { paddingHorizontal: 5, borderRadius: 4, backgroundColor: colors.line },
  srcCountOn: { backgroundColor: 'rgba(77,143,255,0.2)' },
  srcCountTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  content: { paddingHorizontal: 14, paddingBottom: 120 },
  sectHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  sectTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectTitle: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  sectCount: { paddingHorizontal: 5, paddingVertical: 1, backgroundColor: colors.line, borderRadius: 3 },
  sectCountTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkDim },
  sectAction: { fontFamily: fonts.semibold, fontSize: 11, color: colors.neon },

  userRow: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 12, marginBottom: 6 },
  userRowOn: { backgroundColor: 'rgba(77,143,255,0.06)', borderColor: 'rgba(77,143,255,0.4)' },
  userRowBusy: { opacity: 0.5 },
  avatarWrap: { position: 'relative' },
  userAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  onlineDot: { position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.bg },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  userName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  verifiedBadge: { width: 13, height: 13, borderRadius: 6.5, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  tagsRow: { flexDirection: 'row', gap: 4, marginTop: 3 },
  tag: { paddingHorizontal: 6, paddingVertical: 1, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, borderRadius: 4 },
  tagTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkDim },
  tagMatch: { backgroundColor: 'rgba(93,202,165,0.08)', borderColor: 'rgba(93,202,165,0.3)' },
  tagMatchTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.success },
  tagBusy: { backgroundColor: 'rgba(250,199,117,0.08)', borderColor: 'rgba(250,199,117,0.3)' },
  tagBusyTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.warn },

  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 1.5, borderColor: colors.inkMute, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.neon, borderColor: colors.neon },
  checkboxBusy: { borderColor: colors.inkMute, backgroundColor: 'transparent' },
  checkboxDash: { width: 10, height: 1.5, borderRadius: 1, backgroundColor: colors.inkMute },

  linkCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, padding: 14, backgroundColor: 'rgba(127,119,221,0.06)', borderWidth: 1, borderColor: 'rgba(127,119,221,0.25)', borderRadius: 14 },
  linkIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(127,119,221,0.15)', alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  linkDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
  linkStrong: { fontFamily: fonts.semibold, color: colors.purple },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 28, backgroundColor: colors.panelDeep, borderTopWidth: 1, borderTopColor: colors.line },
  msgBtn: { width: 50, height: 50, borderRadius: 14, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  sendBtnWrap: { flex: 1 },
  sendBtn: { flex: 1, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14 },
  sendTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  sendPill: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill },
  sendPillTxt: { fontFamily: fonts.mono, fontSize: 11, color: '#fff' },
});
