import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  Bell,
  Heart,
  MessageCircle,
  Calendar,
  Star,
  Check,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

const TABS = ['Tout', 'Sociales', 'Système'];

const TYPES = [
  { name: 'Likes & matchs', desc: 'Quand on vous like', bg: 'rgba(255,92,122,0.12)', color: colors.danger, Icon: Heart },
  { name: 'Messages', desc: 'Nouveaux échanges', bg: 'rgba(77,143,255,0.12)', color: colors.neon, Icon: MessageCircle },
  { name: 'Événements', desc: 'Sorties & invitations', bg: 'rgba(184,132,230,0.12)', color: colors.purple, Icon: Calendar },
  { name: 'Badges', desc: 'Trophées débloqués', bg: 'rgba(251,191,36,0.12)', color: colors.warn, Icon: Star },
];

/** Empty state notifications — boîte ZEN, tout est à jour (localisé Paris). */
export default function EmptyStateNotifications2Screen() {
  const [active, setActive] = useState('Tout');
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      <View style={styles.topnav}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={18} color={colors.ink} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.sub}>Tout est à jour</Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <Settings size={18} color={colors.ink} />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => {
          const on = active === t;
          return (
            <Pressable key={t} onPress={() => setActive(t)} style={[styles.tab, on && styles.tabOn]}>
              <Text style={[styles.tabTxt, on && { color: colors.ink }]}>{t}</Text>
              <View style={styles.tabCount}>
                <Text style={[styles.tabCountTxt, on && { color: colors.success }]}>0</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Hero vide */}
        <View style={styles.hero}>
          <View style={styles.heroRing} />
          <View style={styles.bellCircle}>
            <Bell size={44} color={colors.success} strokeWidth={1.5} />
          </View>
        </View>

        <Text style={styles.emptyTitle}>
          Tout est <Text style={{ color: colors.success }}>à jour</Text>
        </Text>
        <Text style={styles.emptyDesc}>
          Vous n'avez aucune nouvelle notification. On vous préviendra dès qu'il{' '}
          <Text style={styles.emptyDescStrong}>se passe quelque chose</Text>.
        </Text>

        <View style={styles.zenBadge}>
          <Check size={11} color={colors.success} strokeWidth={3} />
          <Text style={styles.zenTxt}>Boîte ZEN</Text>
        </View>

        {/* Types activés */}
        <View style={styles.typesLabelRow}>
          <Text style={styles.typesLabel}>Vous serez prévenu pour</Text>
          <View style={styles.typesLine} />
        </View>

        <View style={styles.typesGrid}>
          {TYPES.map((t) => (
            <View key={t.name} style={styles.typeCard}>
              <View style={[styles.typeIcon, { backgroundColor: t.bg }]}>
                <t.Icon size={14} color={t.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.typeName}>{t.name}</Text>
                <Text style={styles.typeDesc}>{t.desc}</Text>
              </View>
              <View style={styles.typeToggle}>
                <Check size={9} color="#fff" strokeWidth={3} />
              </View>
            </View>
          ))}
        </View>

        {/* Lien réglages */}
        <Pressable style={styles.settingsLink}>
          <View style={styles.settingsIcon}>
            <Settings size={14} color={colors.ink} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingsTitle}>Personnaliser les notifications</Text>
            <Text style={styles.settingsDesc}>Sons, fréquence, ne pas déranger</Text>
          </View>
          <ChevronRight size={14} color={colors.inkMute} />
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  sub: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginTop: 1 },

  tabs: {
    flexDirection: 'row',
    gap: 2,
    marginHorizontal: 16,
    padding: 4,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
  },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, height: 36, borderRadius: radius.sm },
  tabOn: { backgroundColor: colors.bg },
  tabTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim },
  tabCount: { paddingHorizontal: 5, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)' },
  tabCountTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  body: { paddingBottom: 40 },
  hero: { width: 200, height: 200, alignSelf: 'center', marginTop: 24, marginBottom: 16, alignItems: 'center', justifyContent: 'center' },
  heroRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(74,222,128,0.2)',
    borderStyle: 'dashed',
  },
  bellCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74,222,128,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(74,222,128,0.3)',
  },

  emptyTitle: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, textAlign: 'center', marginBottom: 10, paddingHorizontal: 24 },
  emptyDesc: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute, textAlign: 'center', lineHeight: 21, paddingHorizontal: 28, marginBottom: 18 },
  emptyDescStrong: { fontFamily: fonts.semibold, color: colors.inkDim },

  zenBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'rgba(74,222,128,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.3)',
    borderRadius: radius.pill,
    marginBottom: 28,
  },
  zenTxt: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.success, textTransform: 'uppercase', letterSpacing: 0.5 },

  typesLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginBottom: 12 },
  typesLabel: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },
  typesLine: { flex: 1, height: 1, backgroundColor: colors.line },

  typesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginHorizontal: 16 },
  typeCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
  },
  typeIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  typeName: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  typeDesc: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, marginTop: 1 },
  typeToggle: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },

  settingsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  settingsDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 1 },
});
