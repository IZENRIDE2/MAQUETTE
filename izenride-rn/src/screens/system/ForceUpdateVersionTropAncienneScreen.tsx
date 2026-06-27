import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertTriangle,
  Shield,
  ChevronRight,
  Download,
  Zap,
  Check,
  Lock,
} from 'lucide-react-native';
import { colors, fonts, radius } from '@/theme';

/** Force update — version trop ancienne, mise à jour obligatoire. */
export default function ForceUpdateVersionTropAncienneScreen() {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0c1730', colors.bg, colors.bgDeep]}
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
          <View style={styles.navPill}>
            <AlertTriangle size={10} color={colors.danger} />
            <Text style={styles.navPillTxt}>Version obsolète</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.illu}>
            <View style={styles.orbit1} />
            <View style={styles.orbit2} />
            <View style={[styles.mini, { top: 6, right: 22, backgroundColor: 'rgba(127,119,221,0.18)' }]}>
              <Shield size={14} color={colors.purple} />
            </View>
            <View style={[styles.mini, { bottom: 14, left: 14, backgroundColor: 'rgba(93,202,165,0.18)' }]}>
              <ChevronRight size={14} color={colors.successText} />
            </View>
            <View style={styles.dlCircle}>
              <Download size={44} color={colors.neon} strokeWidth={1.6} />
            </View>
          </View>

          <Text style={styles.title}>
            Une nouvelle <Text style={styles.titleEm}>version</Text> est disponible
          </Text>
          <Text style={styles.desc}>
            Votre app IzenRide est <Text style={styles.descStrong}>trop ancienne</Text> pour communiquer avec nos
            serveurs. Mettez-la à jour pour continuer.
          </Text>
        </View>

        {/* Comparaison versions */}
        <View style={styles.compareCard}>
          <View style={styles.compareHead}>
            <Text style={styles.compareLabel}>Comparaison</Text>
            <Text style={[styles.compareLabel, { color: colors.neon }]}>Maj. nécessaire</Text>
          </View>
          <View style={styles.compareRow}>
            <View style={[styles.verBlock, styles.verCurrent]}>
              <View style={[styles.verTag, styles.verTagCurrent]}>
                <Text style={[styles.verTagTxt, { color: colors.danger }]}>Installée</Text>
              </View>
              <Text style={styles.verNum}>v3.4.1</Text>
              <Text style={styles.verMeta}>12 mars 2024</Text>
            </View>
            <View style={styles.compareArrow}>
              <ChevronRight size={14} color={colors.neon} />
            </View>
            <View style={[styles.verBlock, styles.verTarget]}>
              <View style={[styles.verTag, styles.verTagTarget]}>
                <Text style={[styles.verTagTxt, { color: colors.successText }]}>Requise</Text>
              </View>
              <Text style={styles.verNum}>v4.8.0</Text>
              <Text style={styles.verMeta}>28 avr 2026</Text>
            </View>
          </View>
          <View style={styles.compareFoot}>
            <Text style={styles.compareFootTxt}>
              <Text style={styles.compareFootStrong}>11</Text> versions de retard
            </Text>
            <Text style={styles.compareFootTxt}>
              API min. <Text style={styles.compareFootStrong}>v4.5</Text>
            </Text>
          </View>
        </View>

        {/* Pourquoi maintenant */}
        <View style={styles.whyHead}>
          <Text style={styles.whyHeadTxt}>Pourquoi maintenant ?</Text>
          <View style={styles.whyHeadLine} />
        </View>
        <View style={styles.whyList}>
          <WhyRow
            bg="rgba(93,202,165,0.12)"
            icon={<Shield size={13} color={colors.successText} />}
            title="Sécurité critique"
            desc="Correctifs de sécurité indispensables pour vos données."
          />
          <WhyRow
            bg="rgba(127,119,221,0.12)"
            icon={<Zap size={13} color={colors.purple} />}
            title="Nouvelle API serveur"
            desc="L'ancien protocole n'est plus supporté depuis hier."
            border
          />
          <WhyRow
            bg="rgba(250,199,117,0.12)"
            icon={<Zap size={13} color={colors.warn} />}
            title="Performances ×3"
            desc="Cartes plus fluides, recherche instantanée, hors-ligne renforcé."
            border
          />
        </View>

        {/* Store btn */}
        <View style={styles.actionsWrap}>
          <Pressable>
            <LinearGradient colors={[colors.neon, colors.purple]} style={styles.storeBtn}>
              <Download size={18} color="#fff" />
              <Text style={styles.storeTxt}>Mettre à jour sur l'App Store</Text>
            </LinearGradient>
          </Pressable>
          <View style={styles.storeHelperRow}>
            <Check size={11} color={colors.neon} />
            <Text style={styles.storeHelper}>
              Téléchargement <Text style={styles.storeHelperStrong}>~ 48 Mo</Text> · Wi-Fi recommandé
            </Text>
          </View>
        </View>

        {/* Lockdown note */}
        <View style={styles.lockdown}>
          <Lock size={12} color={colors.inkMute} />
          <Text style={styles.lockdownTxt}>
            <Text style={styles.lockdownStrong}>L'app reste verrouillée</Text> tant que la mise à jour n'est pas
            installée. Vos données sont préservées localement.
          </Text>
        </View>

        {/* Build foot */}
        <View style={styles.buildFoot}>
          <Text style={styles.buildMeta}>
            <Text style={styles.buildStrong}>Installé</Text> · v3.4.1 (build 1284) · iOS 18.4
          </Text>
          <Text style={styles.buildMeta}>Compatible API · v4.5 → v4.8</Text>
        </View>
      </View>
    </View>
  );
}

function WhyRow({ bg, icon, title, desc, border }: { bg: string; icon: React.ReactNode; title: string; desc: string; border?: boolean }) {
  return (
    <View style={[styles.whyRow, border && styles.whyBorder]}>
      <View style={[styles.whyIcon, { backgroundColor: bg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.whyTitle}>{title}</Text>
        <Text style={styles.whyDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingTop: 56, paddingBottom: 24 },

  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  navBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.neon },
  navBrandTxt: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },
  navPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, backgroundColor: 'rgba(226,75,74,0.08)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.3)', borderRadius: radius.pill },
  navPillTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.danger, textTransform: 'uppercase', letterSpacing: 0.6 },

  hero: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 8, alignItems: 'center' },
  illu: { width: 200, height: 200, marginBottom: 18, alignItems: 'center', justifyContent: 'center' },
  orbit1: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 100, borderWidth: 1.5, borderColor: 'rgba(77,143,255,0.22)', borderStyle: 'dashed' },
  orbit2: { position: 'absolute', top: 28, left: 28, right: 28, bottom: 28, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(77,143,255,0.16)', borderStyle: 'dashed' },
  mini: {
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
  dlCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(77,143,255,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(77,143,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, textAlign: 'center', marginBottom: 10 },
  titleEm: { color: colors.neon },
  desc: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.inkDim, textAlign: 'center', maxWidth: 320 },
  descStrong: { fontFamily: fonts.semibold, color: colors.ink },

  compareCard: {
    marginHorizontal: 16,
    marginTop: 22,
    padding: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
  },
  compareHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  compareLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },
  compareRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  verBlock: { flex: 1, padding: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, borderRadius: 11, alignItems: 'center' },
  verCurrent: { borderColor: 'rgba(226,75,74,0.35)' },
  verTarget: { borderColor: 'rgba(93,202,165,0.35)' },
  verTag: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3, borderWidth: 1, marginBottom: 6 },
  verTagCurrent: { backgroundColor: 'rgba(226,75,74,0.12)', borderColor: 'rgba(226,75,74,0.3)' },
  verTagTarget: { backgroundColor: 'rgba(93,202,165,0.12)', borderColor: 'rgba(93,202,165,0.3)' },
  verTagTxt: { fontFamily: fonts.monoBold, fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  verNum: { fontFamily: fonts.monoBold, fontSize: 18, color: colors.ink, marginBottom: 4 },
  verMeta: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  compareArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  compareFoot: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', justifyContent: 'space-between' },
  compareFootTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  compareFootStrong: { fontFamily: fonts.monoBold, color: colors.ink },

  whyHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 22, marginBottom: 10 },
  whyHeadTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },
  whyHeadLine: { flex: 1, height: 1, backgroundColor: colors.line },
  whyList: { marginHorizontal: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, overflow: 'hidden' },
  whyRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, paddingHorizontal: 14 },
  whyBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  whyIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  whyTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 1 },
  whyDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },

  actionsWrap: { paddingHorizontal: 16, paddingTop: 22 },
  storeBtn: { height: 56, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  storeTxt: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  storeHelperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8 },
  storeHelper: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  storeHelperStrong: { fontFamily: fonts.semibold, color: colors.ink },

  lockdown: {
    marginHorizontal: 16,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
  },
  lockdownTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
  lockdownStrong: { fontFamily: fonts.semibold, color: colors.ink },

  buildFoot: {
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
  buildMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, lineHeight: 16 },
  buildStrong: { fontFamily: fonts.monoBold, color: colors.ink },
});
