import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  HelpCircle,
  Server,
  Code,
  AlertTriangle,
  RefreshCw,
  Activity,
  ArrowRight,
  MessageCircle,
  Copy,
  Info,
} from 'lucide-react-native';
import { colors, fonts, radius } from '@/theme';

/** Erreur serveur 500 — panne passagère côté serveur. */
export default function ErreurServeur500Screen() {
  const meta = [
    { label: 'Heure', value: '28 avr · 09:41' },
    { label: 'Endpoint', value: '/api/v3/feed' },
    { label: 'Version', value: 'IzenRide 4.7.2' },
    { label: 'Région serveur', value: 'eu-west-3' },
  ];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#1a0e12', colors.bg, colors.bgDeep]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Top nav */}
        <View style={styles.topnav}>
          <Pressable style={styles.iconBtn}>
            <ChevronLeft size={18} color={colors.ink} />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.topTitle}>Oups, ça plante</Text>
            <Text style={styles.topSub}>Erreur 500 · serveur</Text>
          </View>
          <Pressable style={styles.iconBtn}>
            <HelpCircle size={18} color={colors.ink} />
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.illu}>
            <View style={styles.orbit1} />
            <View style={styles.orbit2} />
            <Text style={styles.big500}>500</Text>
            <View style={[styles.glitch, { top: 4, right: 18, backgroundColor: 'rgba(226,75,74,0.18)' }]}>
              <Code size={14} color={colors.danger} />
            </View>
            <View style={[styles.glitch, { bottom: 12, left: 8, backgroundColor: 'rgba(250,199,117,0.18)' }]}>
              <AlertTriangle size={14} color={colors.warn} />
            </View>
            <View style={styles.serverCircle}>
              <Server size={44} color={colors.danger} strokeWidth={1.6} />
            </View>
          </View>

          <Text style={styles.title}>
            Quelque chose <Text style={styles.titleEm}>cloche</Text>
          </Text>
          <Text style={styles.desc}>
            Nos serveurs ont un souci passager. Notre équipe est{' '}
            <Text style={styles.descStrong}>déjà prévenue</Text> et travaille dessus.
          </Text>
        </View>

        {/* ID incident */}
        <View style={styles.errId}>
          <View style={styles.errIdIcon}>
            <Info size={13} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.errIdLabel}>ID de l'incident</Text>
            <Text style={styles.errIdValue} numberOfLines={1}>
              err_a3f2_29c814bd_t1746
            </Text>
          </View>
          <Pressable style={styles.errIdCopy}>
            <Copy size={13} color={colors.ink} />
          </Pressable>
        </View>

        {/* Meta grid */}
        <View style={styles.metaGrid}>
          {meta.map((m) => (
            <View key={m.label} style={styles.metaCell}>
              <Text style={styles.metaLabel}>{m.label}</Text>
              <Text style={styles.metaValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* Retry */}
        <View style={styles.retryWrap}>
          <Pressable>
            <LinearGradient colors={[colors.neon, colors.purple]} style={styles.retryBtn}>
              <RefreshCw size={16} color="#fff" />
              <Text style={styles.retryTxt}>Réessayer</Text>
            </LinearGradient>
          </Pressable>
          <Text style={styles.retryHelper}>
            Tentative auto · dans <Text style={styles.helperStrong}>30 s</Text> · puis 1 min · puis 2 min
          </Text>
        </View>

        {/* Status page */}
        <Pressable style={styles.statusPage}>
          <View style={styles.statusPageIcon}>
            <Activity size={16} color={colors.successText} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.statusPageTag}>
              <Text style={styles.statusPageTagTxt}>Status page</Text>
            </View>
            <Text style={styles.statusPageTitle}>Voir l'état des services</Text>
            <Text style={styles.statusPageDesc}>
              <Text style={styles.statusPageStrong}>3 services en panne</Text> · 12 OK · maj. il y a 2 min
            </Text>
          </View>
          <ArrowRight size={13} color={colors.successText} />
        </Pressable>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.secondaryBtn}>
            <MessageCircle size={14} color={colors.purple} />
            <Text style={styles.secondaryTxt}>Contacter le support</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn}>
            <ChevronLeft size={14} color={colors.inkMute} />
            <Text style={styles.secondaryTxt}>Accueil</Text>
          </Pressable>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHead}>
            <Info size={11} color={colors.inkMute} />
            <Text style={styles.tipsHeadTxt}>En attendant</Text>
          </View>
          <TipRow num="1" text="Vos messages en attente partiront dès le retour du serveur." />
          <TipRow num="2" text="Vos cartes & trajets téléchargés restent accessibles hors-ligne." border />
          <TipRow num="3" text="Aucune donnée n'est perdue · tout est sauvegardé localement." border />
        </View>
      </View>
    </View>
  );
}

function TipRow({ num, text, border }: { num: string; text: string; border?: boolean }) {
  return (
    <View style={[styles.tipRow, border && styles.tipBorder]}>
      <View style={styles.tipNum}>
        <Text style={styles.tipNumTxt}>{num}</Text>
      </View>
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingTop: 56, paddingBottom: 24 },

  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  topSub: { fontFamily: fonts.mono, fontSize: 9, color: colors.danger, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 1 },

  hero: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 14, alignItems: 'center' },
  illu: { width: 200, height: 200, marginBottom: 22, alignItems: 'center', justifyContent: 'center' },
  orbit1: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 100, borderWidth: 1.5, borderColor: 'rgba(226,75,74,0.18)', borderStyle: 'dashed' },
  orbit2: { position: 'absolute', top: 28, left: 28, right: 28, bottom: 28, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(226,75,74,0.14)', borderStyle: 'dashed' },
  big500: { position: 'absolute', bottom: -8, fontFamily: fonts.monoBold, fontSize: 100, color: colors.inkMute, opacity: 0.25 },
  glitch: {
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
  serverCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(226,75,74,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(226,75,74,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, textAlign: 'center', marginBottom: 10 },
  titleEm: { color: colors.danger },
  desc: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.inkDim, textAlign: 'center', maxWidth: 320 },
  descStrong: { fontFamily: fonts.semibold, color: colors.ink },

  errId: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
  },
  errIdIcon: { width: 28, height: 28, borderRadius: 7, backgroundColor: 'rgba(226,75,74,0.1)', alignItems: 'center', justifyContent: 'center' },
  errIdLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  errIdValue: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.ink },
  errIdCopy: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  metaGrid: { marginHorizontal: 16, marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaCell: { width: '48.5%', flexGrow: 1, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
  metaLabel: { fontFamily: fonts.mono, fontSize: 8, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  metaValue: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.ink },

  retryWrap: { paddingHorizontal: 16, paddingTop: 18 },
  retryBtn: { height: 50, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  retryTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  retryHelper: { marginTop: 8, fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, textAlign: 'center' },
  helperStrong: { fontFamily: fonts.monoBold, color: colors.ink },

  statusPage: {
    marginHorizontal: 16,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.25)',
    borderRadius: radius.md,
  },
  statusPageIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(93,202,165,0.12)', alignItems: 'center', justifyContent: 'center' },
  statusPageTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 1,
    backgroundColor: 'rgba(93,202,165,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.3)',
    borderRadius: 3,
    marginBottom: 3,
  },
  statusPageTagTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.successText, textTransform: 'uppercase', letterSpacing: 0.8 },
  statusPageTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  statusPageDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
  statusPageStrong: { fontFamily: fonts.semibold, color: colors.successText },

  actionsRow: { marginHorizontal: 16, marginTop: 18, flexDirection: 'row', gap: 8 },
  secondaryBtn: {
    flex: 1,
    height: 50,
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

  tipsCard: {
    marginHorizontal: 16,
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
  },
  tipsHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  tipsHeadTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6 },
  tipBorder: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 9, marginTop: 2 },
  tipNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipNumTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.inkMute },
  tipText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.ink },
});
