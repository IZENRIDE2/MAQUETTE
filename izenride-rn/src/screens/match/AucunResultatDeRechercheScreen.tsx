import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Search, X, Filter, Edit3, Bell, ChevronRight, RefreshCw } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts } from '@/theme';

const violet = colors.purple;
const amber = colors.warn;

/** Aucun résultat de recherche — état vide marketplace (localisé Paris). */
export default function AucunResultatDeRechercheScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top', 'bottom']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={16} color={colors.ink} />
        </Pressable>
        <View style={styles.navSearch}>
          <Search size={13} color={colors.inkMute} />
          <Text style={styles.navSearchTxt} numberOfLines={1}>"yamaha tracer 900 2018"</Text>
          <View style={styles.navSearchClear}>
            <X size={8} color={colors.bgDeep} strokeWidth={3} />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Filtres actifs */}
        <View style={styles.activeFilters}>
          {['≤ 5 000 €', '≤ 30 km', 'Trail / GT'].map((f) => (
            <View key={f} style={styles.activePill}>
              <Text style={styles.activePillTxt}>{f}</Text>
              <View style={styles.activePillX}>
                <X size={7} color={colors.neon} strokeWidth={3} />
              </View>
            </View>
          ))}
        </View>

        {/* Empty hero */}
        <View style={styles.emptyWrap}>
          <View style={styles.emptyHero}>
            <View style={styles.orbit1} />
            <View style={styles.orbit2} />
            <View style={[styles.floatQ, styles.fq1]}>
              <Text style={[styles.floatQTxt, { color: violet }]}>?</Text>
            </View>
            <View style={[styles.floatQ, styles.fq2]}>
              <Text style={[styles.floatQTxt, { color: amber }]}>?</Text>
            </View>
            <View style={styles.glassCircle}>
              <Search size={44} color={colors.neon} strokeWidth={1.6} />
            </View>
          </View>

          <Text style={styles.emptyTitle}>
            Aucun <Text style={styles.emptyEm}>résultat</Text>
          </Text>
          <Text style={styles.emptyDesc}>
            On n'a rien trouvé pour <Text style={styles.code}>yamaha tracer 900 2018</Text> avec ces filtres.{'\n'}
            Essayez une recherche <Text style={styles.descStrong}>moins précise</Text>.
          </Text>
        </View>

        {/* Tips */}
        <View style={styles.tipsWrap}>
          <View style={styles.tipsHead}>
            <Text style={styles.tipsHeadTxt}>QUELQUES PISTES</Text>
            <View style={styles.tipsHeadLine} />
          </View>
          <View style={styles.tipsCard}>
            <Tip icon={<Filter size={13} color={colors.neon} />} iconBg="rgba(77,143,255,0.12)" title="Élargir les filtres" desc="Augmentez le rayon ou le budget pour voir plus de résultats." />
            <Tip icon={<Edit3 size={13} color={violet} />} iconBg="rgba(184,132,230,0.12)" title="Vérifier l'orthographe" descNode={<Text style={styles.tipDesc}>Voulez-vous dire <Text style={styles.tipStrong}>Tracer 900</Text> ?</Text>} />
            <Tip icon={<Bell size={13} color={amber} />} iconBg="rgba(251,191,36,0.12)" title="Créer une alerte" desc="On vous prévient dès qu'une annonce correspond." last />
          </View>
        </View>

        {/* Recherches similaires */}
        <View style={styles.suggestSection}>
          <View style={styles.tipsHead}>
            <Text style={styles.tipsHeadTxt}>RECHERCHES SIMILAIRES</Text>
            <View style={styles.tipsHeadLine} />
          </View>
          <View style={styles.suggestPills}>
            {['Tracer 900', 'Yamaha trail', 'MT-09', 'Tracer 700', 'Trail ≤ 7000 €'].map((s) => (
              <View key={s} style={styles.suggestPill}>
                <Search size={11} color={colors.neon} />
                <Text style={styles.suggestTxt}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable style={{ flex: 1 }}>
            <LinearGradient colors={[colors.neon, violet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionPrimary}>
              <Filter size={14} color="#fff" />
              <Text style={styles.actionPrimaryTxt}>Modifier filtres</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.actionSecondary}>
            <RefreshCw size={14} color={colors.ink} />
            <Text style={styles.actionSecondaryTxt}>Effacer tout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Tip({ icon, iconBg, title, desc, descNode, last }: { icon: React.ReactNode; iconBg: string; title: string; desc?: string; descNode?: React.ReactNode; last?: boolean }) {
  return (
    <View style={[styles.tipRow, !last && { borderBottomWidth: 1, borderBottomColor: colors.line }]}>
      <View style={[styles.tipIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.tipTitle}>{title}</Text>
        {descNode ?? <Text style={styles.tipDesc}>{desc}</Text>}
      </View>
      <ChevronRight size={12} color={colors.inkMute} />
    </View>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  iconBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  navSearch: { flex: 1, height: 36, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 11, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  navSearchTxt: { flex: 1, fontFamily: fonts.mono, fontSize: 13, color: colors.ink },
  navSearchClear: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },

  activeFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, paddingHorizontal: 14, paddingTop: 10 },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 9, paddingRight: 4, paddingVertical: 4, backgroundColor: 'rgba(77,143,255,0.08)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderRadius: 999 },
  activePillTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.neon },
  activePillX: { width: 13, height: 13, borderRadius: 6.5, backgroundColor: 'rgba(77,143,255,0.18)', alignItems: 'center', justifyContent: 'center' },

  emptyWrap: { paddingHorizontal: 24, paddingTop: 14, alignItems: 'center' },
  emptyHero: { width: 200, height: 200, marginTop: 6, marginBottom: 22, alignItems: 'center', justifyContent: 'center' },
  orbit1: { ...StyleSheet.absoluteFillObject, borderWidth: 1.5, borderColor: 'rgba(77,143,255,0.18)', borderStyle: 'dashed', borderRadius: 100 },
  orbit2: { position: 'absolute', top: 32, left: 32, right: 32, bottom: 32, borderWidth: 1, borderColor: 'rgba(184,132,230,0.14)', borderStyle: 'dashed', borderRadius: 100 },
  glassCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(77,143,255,0.1)', borderWidth: 1.5, borderColor: 'rgba(77,143,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  floatQ: { position: 'absolute', width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.bgDeep, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  fq1: { top: 8, right: 26, backgroundColor: 'rgba(184,132,230,0.2)' },
  fq2: { bottom: 18, left: 12, backgroundColor: 'rgba(251,191,36,0.18)' },
  floatQTxt: { fontFamily: fonts.monoBold, fontSize: 16 },

  emptyTitle: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, marginBottom: 10, textAlign: 'center' },
  emptyEm: { color: colors.neon },
  emptyDesc: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute, textAlign: 'center', lineHeight: 21, maxWidth: 320 },
  descStrong: { fontFamily: fonts.semibold, color: colors.inkDim },
  code: { fontFamily: fonts.mono, fontSize: 12, color: colors.ink, backgroundColor: colors.bg2 },

  tipsWrap: { marginHorizontal: 16, marginTop: 22 },
  tipsHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  tipsHeadTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 1, textTransform: 'uppercase' },
  tipsHeadLine: { flex: 1, height: 1, backgroundColor: colors.line },
  tipsCard: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 13, overflow: 'hidden' },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 11 },
  tipIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tipTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 1 },
  tipDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
  tipStrong: { fontFamily: fonts.semibold, color: colors.inkDim },

  suggestSection: { marginHorizontal: 16, marginTop: 22 },
  suggestPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  suggestPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 999 },
  suggestTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim },

  actionsRow: { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginTop: 22 },
  actionPrimary: { height: 48, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  actionPrimaryTxt: { fontFamily: fonts.semibold, fontSize: 13, color: '#fff' },
  actionSecondary: { flex: 1, height: 48, borderRadius: 13, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  actionSecondaryTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
});
