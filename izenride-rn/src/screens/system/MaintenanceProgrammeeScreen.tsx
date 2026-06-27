import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  HelpCircle,
  Settings,
  Clock,
  Zap,
  ChevronRight,
  MapPin,
  Star,
  Bell,
  Activity,
  Share2,
} from 'lucide-react-native';
import { colors, fonts, radius } from '@/theme';

/** Maintenance programmée — mise à jour technique en cours. */
export default function MaintenanceProgrammeeScreen() {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#15122b', colors.bg, colors.bgDeep]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Nav minimal */}
        <View style={styles.nav}>
          <View style={styles.navBrand}>
            <View style={styles.navDot} />
            <Text style={styles.navBrandTxt}>IzenRide</Text>
          </View>
          <Pressable style={styles.navHelp}>
            <HelpCircle size={14} color={colors.ink} />
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.illu}>
            <View style={styles.orbit1} />
            <View style={styles.orbit2} />
            <View style={[styles.tool, { top: 6, right: 26, backgroundColor: 'rgba(77,143,255,0.18)' }]}>
              <Settings size={14} color={colors.neon} />
            </View>
            <View style={[styles.tool, { bottom: 14, left: 12, backgroundColor: 'rgba(250,199,117,0.18)' }]}>
              <Activity size={14} color={colors.warn} />
            </View>
            <View style={styles.wrenchCircle}>
              <Settings size={42} color={colors.purple} strokeWidth={1.6} />
            </View>
          </View>

          <View style={styles.tag}>
            <Clock size={11} color={colors.purple} />
            <Text style={styles.tagTxt}>Maintenance programmée</Text>
          </View>

          <Text style={styles.title}>
            On bichonne <Text style={styles.titleEm}>les serveurs</Text>
          </Text>
          <Text style={styles.desc}>
            Mise à jour technique en cours. L'appli sera{' '}
            <Text style={styles.descStrong}>encore plus rapide</Text> dans quelques minutes.
          </Text>
        </View>

        {/* ETA card */}
        <View style={styles.etaCard}>
          <View style={styles.etaHead}>
            <View style={styles.etaLabelRow}>
              <Clock size={11} color={colors.purple} />
              <Text style={styles.etaLabel}>Retour estimé</Text>
            </View>
            <View style={styles.etaPill}>
              <View style={styles.etaPillDot} />
              <Text style={styles.etaPillTxt}>En cours</Text>
            </View>
          </View>

          <View style={styles.etaCountdown}>
            <Text style={styles.etaNum}>17</Text>
            <Text style={styles.etaUnit}>min</Text>
          </View>
          <Text style={styles.etaTarget}>
            Fin prévue à <Text style={styles.etaTargetStrong}>09:58</Text> · 28 avr
          </Text>

          <View style={styles.progress}>
            <LinearGradient
              colors={[colors.purple, colors.neon]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: '64%' }]}
            />
          </View>
          <View style={styles.progressFoot}>
            <Text style={styles.progressFootTxt}>
              <Text style={styles.progressStrong}>64 %</Text> · phase 3 / 4
            </Text>
            <Text style={styles.progressFootTxt}>Mise à jour BDD</Text>
          </View>
        </View>

        {/* Ce qui change ensuite */}
        <View style={styles.sectionRow}>
          <Zap size={14} color={colors.neon} />
          <Text style={styles.sectionTitle}>Ce qui change ensuite</Text>
        </View>
        <View style={styles.changelog}>
          <ChangeRow
            bg="rgba(93,202,165,0.12)"
            icon={<ChevronRight size={13} color={colors.successText} />}
            title="Recherche moto 3× plus rapide"
            desc="Indexation refondue · résultats instantanés sur 12 000 modèles."
          />
          <ChangeRow
            bg="rgba(77,143,255,0.12)"
            icon={<MapPin size={13} color={colors.neon} />}
            title="Nouveau moteur cartographique"
            desc="Migration vers MapLibre · cartes plus fluides + mode hors ligne renforcé."
            border
          />
          <ChangeRow
            bg="rgba(250,199,117,0.12)"
            icon={<Star size={13} color={colors.warn} />}
            title="Badges saisonniers"
            desc="Trophées exclusifs débloquables uniquement en Mai-Juin."
            border
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable>
            <LinearGradient colors={[colors.neon, colors.purple]} style={styles.notifyBtn}>
              <Bell size={16} color="#fff" />
              <Text style={styles.notifyTxt}>Me prévenir au retour</Text>
            </LinearGradient>
          </Pressable>
          <View style={styles.secondaryRow}>
            <Pressable style={styles.secondaryBtn}>
              <Activity size={14} color={colors.successText} />
              <Text style={styles.secondaryTxt}>Status page</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn}>
              <Share2 size={14} color={colors.neon} />
              <Text style={styles.secondaryTxt}>Suivi @izenride</Text>
            </Pressable>
          </View>
        </View>

        {/* Build info */}
        <View style={styles.buildInfo}>
          <Text style={styles.buildMeta}>
            <Text style={styles.buildStrong}>Maintenance</Text> · 28 avr · 09:30 → 09:58 (UTC+2)
          </Text>
          <Text style={styles.buildMeta}>Build · v4.8.0-rc3 · eu-west-3</Text>
        </View>
      </View>
    </View>
  );
}

function ChangeRow({ bg, icon, title, desc, border }: { bg: string; icon: React.ReactNode; title: string; desc: string; border?: boolean }) {
  return (
    <View style={[styles.changeRow, border && styles.changeBorder]}>
      <View style={[styles.changeIcon, { backgroundColor: bg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <View style={styles.changeTitleRow}>
          <Text style={styles.changeTitle}>{title}</Text>
          <View style={styles.changeTag}>
            <Text style={styles.changeTagTxt}>v4.8</Text>
          </View>
        </View>
        <Text style={styles.changeDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingTop: 56, paddingBottom: 24 },

  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  navBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.purple },
  navBrandTxt: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },
  navHelp: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },

  hero: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 14, alignItems: 'center' },
  illu: { width: 200, height: 200, marginBottom: 22, alignItems: 'center', justifyContent: 'center' },
  orbit1: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 100, borderWidth: 1.5, borderColor: 'rgba(127,119,221,0.22)', borderStyle: 'dashed' },
  orbit2: { position: 'absolute', top: 28, left: 28, right: 28, bottom: 28, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(127,119,221,0.16)', borderStyle: 'dashed' },
  tool: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  wrenchCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(127,119,221,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(127,119,221,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    backgroundColor: 'rgba(127,119,221,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(127,119,221,0.35)',
    borderRadius: radius.pill,
    marginBottom: 14,
  },
  tagTxt: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.purple, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, textAlign: 'center', marginBottom: 10 },
  titleEm: { color: colors.purple },
  desc: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.inkDim, textAlign: 'center', maxWidth: 320 },
  descStrong: { fontFamily: fonts.semibold, color: colors.ink },

  etaCard: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(127,119,221,0.3)',
    borderRadius: radius.md,
  },
  etaHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  etaLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  etaLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },
  etaPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: 'rgba(250,199,117,0.12)', borderWidth: 1, borderColor: 'rgba(250,199,117,0.3)', borderRadius: 4 },
  etaPillDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.warn },
  etaPillTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.warn, textTransform: 'uppercase', letterSpacing: 0.8 },
  etaCountdown: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginVertical: 4 },
  etaNum: { fontFamily: fonts.monoBold, fontSize: 56, color: colors.purpleLight, lineHeight: 60 },
  etaUnit: { fontFamily: fonts.mono, fontSize: 18, color: colors.inkMute },
  etaTarget: { textAlign: 'center', fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, marginBottom: 14 },
  etaTargetStrong: { fontFamily: fonts.monoBold, color: colors.ink },
  progress: { height: 6, backgroundColor: colors.bg, borderRadius: 3, overflow: 'hidden', marginTop: 4 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressFoot: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between' },
  progressFootTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  progressStrong: { fontFamily: fonts.monoBold, color: colors.purple },

  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 22, paddingBottom: 12 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  changelog: {
    marginHorizontal: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  changeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, padding: 12 },
  changeBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  changeIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  changeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  changeTitle: { flexShrink: 1, fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  changeTag: { paddingHorizontal: 5, paddingVertical: 1, backgroundColor: 'rgba(93,202,165,0.12)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)', borderRadius: 3 },
  changeTagTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.successText, textTransform: 'uppercase' },
  changeDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },

  actions: { marginHorizontal: 16, marginTop: 18, gap: 8 },
  notifyBtn: { height: 50, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  notifyTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  secondaryRow: { flexDirection: 'row', gap: 8 },
  secondaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
  },
  secondaryTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },

  buildInfo: {
    marginHorizontal: 16,
    marginTop: 22,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 11,
    gap: 2,
  },
  buildMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, lineHeight: 15 },
  buildStrong: { fontFamily: fonts.monoBold, color: colors.ink },
});
