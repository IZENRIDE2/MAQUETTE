import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  MoreVertical,
  AlertTriangle,
  X,
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import { MapBackground } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

/**
 * Recalcul d'itinéraire — état transitoire (déviation détectée).
 * Localisé Paris : Le Marais → Versailles (D906 / N118).
 */
export default function RecalculDItineraireScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <MapBackground />

      {/* Tracé recalculé (statique) */}
      <View pointerEvents="none" style={styles.routeNew} />

      {/* Nav bar haut */}
      <View style={[styles.navBar, { top: insets.top + 4 }]}>
        <View style={styles.navPill}>
          <Search size={14} color={colors.inkDim} />
          <Text style={styles.navPillTxt}>Le Marais</Text>
          <Text style={styles.navArrow}>→</Text>
          <Text style={styles.navPillStrong}>Versailles</Text>
        </View>
        <Pressable style={styles.navIconBtn}>
          <MoreVertical size={18} color={colors.ink} />
        </Pressable>
      </View>

      {/* Bannière déviation */}
      <View style={[styles.alert, { top: insets.top + 56 }]}>
        <View style={styles.alertIcon}>
          <AlertTriangle size={18} color={colors.warn} strokeWidth={2.5} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.alertTitle}>Déviation détectée</Text>
          <Text style={styles.alertDesc}>
            Vous avez quitté l'itinéraire prévu il y a <Text style={styles.alertStrong}>320 m</Text>.
          </Text>
        </View>
      </View>

      {/* Pill ancien / nouveau */}
      <View style={[styles.routeInfo, { top: insets.top + 150 }]}>
        <View style={[styles.routeChip, styles.routeChipOld]}>
          <X size={10} color={colors.danger} />
          <Text style={[styles.routeChipTxt, { color: colors.danger }]}>Ancien · 28 km</Text>
        </View>
        <View style={[styles.routeChip, styles.routeChipNew]}>
          <ArrowRight size={10} color={colors.neon} />
          <Text style={[styles.routeChipTxt, { color: colors.neonBright }]}>Nouveau · 31 km</Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.grip} />

        <View style={styles.sheetTag}>
          <View style={styles.sheetTagDot} />
          <Text style={styles.sheetTagTxt}>État transitoire</Text>
        </View>
        <Text style={styles.sheetTitle}>Itinéraire recalculé</Text>
        <Text style={styles.sheetSub}>
          Un nouvel itinéraire a été trouvé pour rejoindre Versailles depuis votre position actuelle.
        </Text>

        {/* Comparaison */}
        <View style={styles.compare}>
          <View style={styles.compareCell}>
            <View style={styles.compareLabel}>
              <View style={[styles.dotMini, { backgroundColor: colors.inkMute }]} />
              <Text style={styles.compareLabelTxt}>Itinéraire prévu</Text>
            </View>
            <Text style={styles.compareEtaOld}>14:58</Text>
            <Text style={styles.compareDist}>28 km · N118</Text>
          </View>
          <View style={[styles.compareCell, styles.compareCellNew]}>
            <View style={styles.deltaPill}>
              <ChevronDown size={8} color={colors.warn} strokeWidth={3} />
              <Text style={styles.deltaTxt}>+4 min</Text>
            </View>
            <View style={styles.compareLabel}>
              <View style={[styles.dotMini, { backgroundColor: colors.neon }]} />
              <Text style={[styles.compareLabelTxt, { color: colors.neonBright }]}>Nouveau trajet</Text>
            </View>
            <View style={styles.etaRow}>
              <Text style={styles.compareEta}>15:02</Text>
              <Text style={styles.compareEtaUnit}>arrivée</Text>
            </View>
            <Text style={styles.compareDist}>31 km · D906 + N118</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={{ gap: 8 }}>
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => router.back()}>
            <View style={[styles.btnIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <RefreshCw size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.btnTitlePrimary}>Suivre le nouvel itinéraire</Text>
              <Text style={styles.btnMetaPrimary}>31 km · arrivée 15:02</Text>
            </View>
            <ChevronRight size={14} color="#fff" strokeWidth={2.5} />
          </Pressable>

          <Pressable style={[styles.btn, styles.btnSecondary]}>
            <View style={[styles.btnIcon, { backgroundColor: 'rgba(184,132,230,0.15)' }]}>
              <ChevronLeft size={16} color={colors.purple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.btnTitle}>Reprendre le trajet initial</Text>
              <Text style={styles.btnMeta}>Demi-tour · 320 m derrière</Text>
            </View>
            <ChevronRight size={14} color={colors.inkDim} strokeWidth={2.5} />
          </Pressable>

          <Pressable style={[styles.btn, styles.btnDanger]} onPress={() => router.back()}>
            <View style={[styles.btnIcon, { backgroundColor: 'rgba(255,92,122,0.1)' }]}>
              <X size={16} color={colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.btnTitle, { color: colors.inkDim }]}>Quitter la navigation</Text>
              <Text style={styles.btnMeta}>Trajet abandonné</Text>
            </View>
          </Pressable>
        </View>

        {/* Countdown */}
        <View style={styles.countdown}>
          <View style={styles.countdownIcon}>
            <Check size={11} color={colors.success} strokeWidth={2.5} />
          </View>
          <Text style={styles.countdownTxt}>
            Le nouvel itinéraire sera lancé automatiquement dans{' '}
            <Text style={styles.countdownStrong}>8 s</Text> sans action de votre part.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  routeNew: {
    position: 'absolute',
    left: '30%',
    top: '24%',
    width: 5,
    height: '30%',
    borderRadius: 4,
    backgroundColor: colors.neon,
    opacity: 0.55,
    ...shadow.neon,
  },

  navBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 5,
  },
  navPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: 'rgba(10,14,21,0.85)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
  },
  navPillTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  navPillStrong: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  navArrow: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim },
  navIconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: 'rgba(10,14,21,0.7)',
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  alert: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(31,24,12,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.4)',
    borderRadius: radius.lg,
    zIndex: 10,
    ...shadow.card,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: 'rgba(251,191,36,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  alertDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 15 },
  alertStrong: { fontFamily: fonts.semibold, color: colors.warn },

  routeInfo: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    padding: 6,
    backgroundColor: 'rgba(10,14,21,0.85)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    zIndex: 8,
  },
  routeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  routeChipOld: { backgroundColor: 'rgba(255,92,122,0.12)' },
  routeChipNew: { backgroundColor: 'rgba(77,143,255,0.15)' },
  routeChipTxt: { fontFamily: fonts.mono, fontSize: 11 },

  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: 20,
    paddingTop: 8,
    ...shadow.card,
  },
  grip: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong, alignSelf: 'center', marginVertical: 8 },
  sheetTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(251,191,36,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
    borderRadius: radius.pill,
    marginBottom: 12,
  },
  sheetTagDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warn },
  sheetTagTxt: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.warn, textTransform: 'uppercase', letterSpacing: 0.6 },
  sheetTitle: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, letterSpacing: -0.4, marginBottom: 6 },
  sheetSub: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 19, marginBottom: 18 },

  compare: {
    flexDirection: 'row',
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 18,
  },
  compareCell: { flex: 1, padding: 14 },
  compareCellNew: { borderLeftWidth: 1, borderLeftColor: colors.line, backgroundColor: 'rgba(77,143,255,0.06)' },
  compareLabel: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  dotMini: { width: 6, height: 6, borderRadius: 3 },
  compareLabelTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.6 },
  compareEtaOld: { fontFamily: fonts.monoBold, fontSize: 22, color: colors.inkMute, textDecorationLine: 'line-through', marginBottom: 4 },
  etaRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 4 },
  compareEta: { fontFamily: fonts.monoBold, fontSize: 22, color: colors.ink },
  compareEtaUnit: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim },
  compareDist: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkDim },
  deltaPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(251,191,36,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
    borderRadius: 5,
  },
  deltaTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.warn },

  btn: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 56, borderRadius: radius.md, paddingHorizontal: 14 },
  btnPrimary: { backgroundColor: colors.neon, ...shadow.neon },
  btnSecondary: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line },
  btnDanger: { borderWidth: 1, borderColor: colors.line },
  btnIcon: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  btnTitlePrimary: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  btnMetaPrimary: { fontFamily: fonts.mono, fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  btnTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  btnMeta: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim, marginTop: 2 },

  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    padding: 10,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
  },
  countdownIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(74,222,128,0.15)', alignItems: 'center', justifyContent: 'center' },
  countdownTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 15 },
  countdownStrong: { fontFamily: fonts.monoBold, color: colors.success },
});
