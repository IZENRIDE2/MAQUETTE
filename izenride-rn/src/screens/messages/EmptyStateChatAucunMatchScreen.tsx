import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search, MessageCircle, Heart, Map, MapPin, ChevronRight,
  HelpCircle, Navigation, Users,
} from 'lucide-react-native';
import { Screen, BottomTabBar } from '@/components';
import { colors, fonts, radius } from '@/theme';

const ORBIT = [
  { letter: 'M', c: [colors.neon, '#1a3a5e'] as const, style: { top: 0, alignSelf: 'center' as const } },
  { letter: 'T', c: [colors.purple, '#2a1f3d'] as const, style: { top: '38%' as const, right: 0 } },
  { letter: 'L', c: [colors.success, '#0a2a1f'] as const, style: { bottom: 0, alignSelf: 'center' as const } },
  { letter: 'N', c: [colors.warn, '#5a4520'] as const, style: { top: '38%' as const, left: 0 } },
];

const TIPS = [
  { icon: HelpCircle, c: colors.neon, bg: 'rgba(74,156,232,0.12)', title: 'Complétez votre profil', desc: 'Photos, moto, préférences · 3× plus de matchs' },
  { icon: Navigation, c: colors.purple, bg: 'rgba(127,119,221,0.12)', title: 'Affinez vos filtres', desc: 'Distance, type de moto, niveau, fréquence' },
  { icon: Users, c: colors.warn, bg: 'rgba(250,199,117,0.12)', title: 'Rejoignez un événement', desc: 'Sortie groupe ce dimanche · 12 inscrits' },
];

/** Empty state — aucune conversation / aucun match (onglet Messages). */
export default function EmptyStateChatAucunMatchScreen() {
  const [tab, setTab] = useState<'conv' | 'req'>('conv');
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Text style={styles.topnavTitle}>Messages</Text>
        <Pressable style={styles.iconBtn}>
          <Search size={18} color={colors.ink} />
        </Pressable>
      </View>

      {/* Segmented tabs */}
      <View style={styles.tabs}>
        <Pressable onPress={() => setTab('conv')} style={[styles.tab, tab === 'conv' && styles.tabOn]}>
          <Text style={[styles.tabTxt, tab === 'conv' && styles.tabTxtOn]}>Conversations</Text>
          <View style={[styles.tabCount, tab === 'conv' && styles.tabCountOn]}>
            <Text style={[styles.tabCountTxt, tab === 'conv' && { color: colors.neon }]}>0</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => setTab('req')} style={[styles.tab, tab === 'req' && styles.tabOn]}>
          <Text style={[styles.tabTxt, tab === 'req' && styles.tabTxtOn]}>Demandes</Text>
          <View style={[styles.tabCount, tab === 'req' && styles.tabCountOn]}>
            <Text style={[styles.tabCountTxt, tab === 'req' && { color: colors.neon }]}>0</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Empty hero */}
        <View style={styles.emptyWrap}>
          <View style={styles.hero}>
            <View style={styles.orbit} />
            <View style={styles.orbit2} />
            {ORBIT.map((o) => (
              <LinearGradient key={o.letter} colors={o.c} style={[styles.miniAvatar, o.style]}>
                <Text style={[styles.miniAvatarTxt, o.letter === 'N' && { color: '#1a1408' }]}>{o.letter}</Text>
              </LinearGradient>
            ))}
            <LinearGradient
              colors={['rgba(74,156,232,0.35)', 'rgba(127,119,221,0.2)']}
              style={styles.heroCenter}
            >
              <MessageCircle size={38} color={colors.ink} strokeWidth={1.6} />
              <View style={styles.heroTyping} />
            </LinearGradient>
          </View>

          <Text style={styles.emptyTitle}>
            Vos conversations{'\n'}
            <Text style={styles.emptyTitleEm}>commencent ici</Text>
          </Text>
          <Text style={styles.emptyDesc}>
            Matchez avec d'autres riders pour <Text style={styles.emptyDescStrong}>discuter</Text>,
            planifier des sorties et partager la route.
          </Text>

          <Pressable style={{ width: '100%' }}>
            <LinearGradient colors={[colors.neon, colors.purple]} style={styles.cta}>
              <Heart size={16} color="#fff" />
              <Text style={styles.ctaTxt}>Découvrir des riders</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.ctaSecondary}>
            <Map size={14} color={colors.ink} />
            <Text style={styles.ctaSecondaryTxt}>Explorer la carte</Text>
          </Pressable>
        </View>

        {/* Compteur riders près */}
        <View style={styles.nearCounter}>
          <View style={styles.nearIcon}>
            <MapPin size={16} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nearCount}>
              142<Text style={styles.nearUnit}> riders près de vous</Text>
            </Text>
            <Text style={styles.nearLabel}>dans un rayon de 40 km · prêts à rouler en Île-de-France</Text>
          </View>
          <ChevronRight size={14} color={colors.success} />
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsLabelRow}>
            <Text style={styles.tipsLabel}>Comment matcher</Text>
            <View style={styles.tipsLine} />
          </View>
          <View style={{ gap: 8 }}>
            {TIPS.map((t) => {
              const Icon = t.icon;
              return (
                <Pressable key={t.title} style={styles.tipCard}>
                  <View style={[styles.tipIcon, { backgroundColor: t.bg }]}>
                    <Icon size={16} color={t.c} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tipTitle}>{t.title}</Text>
                    <Text style={styles.tipDesc}>{t.desc}</Text>
                  </View>
                  <ChevronRight size={14} color={colors.inkMute} />
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <BottomTabBar active="messages" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  topnavTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },

  tabs: { flexDirection: 'row', gap: 2, marginHorizontal: 16, marginBottom: 16, padding: 4, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 12 },
  tab: { flex: 1, height: 36, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  tabOn: { backgroundColor: colors.bg },
  tabTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },
  tabTxtOn: { fontFamily: fonts.semibold, color: colors.ink },
  tabCount: { paddingHorizontal: 6, borderRadius: 4, backgroundColor: colors.line },
  tabCountOn: { backgroundColor: 'rgba(74,156,232,0.15)' },
  tabCountTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim },

  scroll: { paddingBottom: 110 },
  emptyWrap: { paddingHorizontal: 24, alignItems: 'center' },
  hero: { width: 220, height: 220, marginVertical: 16, marginBottom: 28, alignItems: 'center', justifyContent: 'center' },
  orbit: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 110, borderWidth: 1.5, borderColor: 'rgba(74,156,232,0.18)', borderStyle: 'dashed' },
  orbit2: { position: 'absolute', top: 22, left: 22, right: 22, bottom: 22, borderRadius: 88, borderWidth: 1, borderColor: 'rgba(127,119,221,0.15)', borderStyle: 'dashed' },
  miniAvatar: { position: 'absolute', width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  miniAvatarTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  heroCenter: { width: 88, height: 88, borderRadius: 44, borderWidth: 1, borderColor: 'rgba(74,156,232,0.35)', alignItems: 'center', justifyContent: 'center' },
  heroTyping: { position: 'absolute', bottom: 16, right: 14, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.success, borderWidth: 3, borderColor: colors.bg },

  emptyTitle: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, textAlign: 'center', lineHeight: 28, marginBottom: 10 },
  emptyTitleEm: { color: colors.neonBright },
  emptyDesc: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute, textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  emptyDescStrong: { fontFamily: fonts.semibold, color: colors.inkDim },
  cta: { width: '100%', height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 },
  ctaTxt: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  ctaSecondary: { width: '100%', height: 46, borderRadius: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  ctaSecondaryTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },

  nearCounter: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 22, padding: 14, backgroundColor: colors.panel, borderWidth: 1, borderColor: 'rgba(93,202,165,0.25)', borderRadius: radius.md },
  nearIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(93,202,165,0.15)', alignItems: 'center', justifyContent: 'center' },
  nearCount: { fontFamily: fonts.monoBold, fontSize: 18, color: colors.ink },
  nearUnit: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },
  nearLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 2 },

  tipsSection: { marginHorizontal: 16, marginTop: 36 },
  tipsLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  tipsLabel: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },
  tipsLine: { flex: 1, height: 1, backgroundColor: colors.line },
  tipCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingHorizontal: 14, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  tipIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  tipTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  tipDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
});
