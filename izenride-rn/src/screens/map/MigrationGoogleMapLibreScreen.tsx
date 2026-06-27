import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  MoreVertical,
  DollarSign,
  Check,
  RefreshCw,
  Circle,
  ArrowRight,
  ChevronDown,
  AlertTriangle,
  CheckSquare,
  Info,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, radius, shadow } from '@/theme';
import { Screen } from '@/components';

/**
 * Migration GPS Google → MapLibre (écran Ops).
 * Localisé Paris : carte avant/après centrée Paris / Boulogne.
 */
export default function MigrationGoogleMapLibreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const screens = [
    { name: 'Carte principale (vue libre)', meta: 'tiles raster → vector · migré il y a 2 j', state: 'done' },
    { name: 'Lieux favoris (pins custom)', meta: 'markers SDF · migré hier', state: 'done' },
    { name: 'Historique de trajets', meta: 'traces GPX → GeoJSON · migré hier', state: 'done' },
    { name: "Détail d'un trajet", meta: 'polylines + élévation · migré ce matin', state: 'done' },
    { name: 'Navigation turn-by-turn', meta: 'Mapbox Directions API · en cours', state: 'progress' },
    { name: "Recalcul d'itinéraire", meta: 'OSRM routing · backlog', state: 'todo' },
    { name: 'Mode hors-ligne (tiles cache)', meta: 'MBTiles export · backlog', state: 'todo' },
    { name: 'Carte sociale (groupes & spots)', meta: 'clustering markers · backlog', state: 'todo' },
  ];

  const risks = [
    "Recherche d'adresse moins fluide qu'avec Places API · prévoir Geoapify en fallback.",
    'Trafic temps réel non disponible nativement · TomTom Traffic API à intégrer.',
    'Style cartographique custom à finaliser pour cohérence ultra-dark v3 sur tous les zooms.',
  ];

  const stateColor = (s: string) => (s === 'done' ? colors.success : s === 'progress' ? colors.neon : colors.inkMute);
  const stateLabel = (s: string) => (s === 'done' ? 'Done' : s === 'progress' ? 'En cours' : 'À faire');

  return (
    <View style={styles.root}>
      <Screen pad={0} contentStyle={{ paddingBottom: 110 }} edges={['top']}>
        {/* Top nav */}
        <View style={styles.topnav}>
          <Pressable style={styles.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={18} color={colors.ink} />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.topTitle}>Migration GPS</Text>
            <Text style={styles.topSub}>v3 · Ops</Text>
          </View>
          <Pressable style={styles.iconBtn}>
            <MoreVertical size={18} color={colors.ink} />
          </Pressable>
        </View>

        {/* Trigger alert */}
        <View style={styles.trigger}>
          <View style={styles.triggerIcon}>
            <DollarSign size={18} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.triggerTag}>
              <Text style={styles.triggerTagTxt}>Seuil franchi</Text>
            </View>
            <Text style={styles.triggerTitle}>Coût Google Maps en hausse</Text>
            <Text style={styles.triggerDesc}>
              Mois en cours : <Text style={styles.triggerStrong}>248 €</Text> · seuil de bascule fixé à{' '}
              <Text style={styles.triggerStrong}>200 €</Text>/mois
            </Text>
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Migration{'\n'}Google → MapLibre</Text>
          <Text style={styles.headerSub}>
            Adaptation visuelle des écrans GPS pour la nouvelle source cartographique open-source.
          </Text>
        </View>

        {/* Comparaison avant / après */}
        <View style={styles.compareCard}>
          <View style={styles.compareGrid}>
            <View style={styles.compareCol}>
              <View style={[styles.compareLabel, { borderColor: 'rgba(255,92,122,0.3)' }]}>
                <Text style={[styles.compareLabelTxt, { color: colors.danger }]}>Avant · Google</Text>
              </View>
              <View style={[styles.mapMini, { backgroundColor: '#e8e8e8' }]}>
                <View style={styles.googlePin} />
              </View>
              <View style={[styles.compareCost, { borderColor: 'rgba(255,92,122,0.3)' }]}>
                <Text style={[styles.compareCostTxt, { color: colors.danger }]}>0,007 € / appel</Text>
              </View>
            </View>
            <View style={[styles.compareCol, styles.compareColRight]}>
              <View style={[styles.compareLabel, { borderColor: 'rgba(74,222,128,0.3)' }]}>
                <Text style={[styles.compareLabelTxt, { color: colors.success }]}>Après · MapLibre</Text>
              </View>
              <LinearGradient colors={['#10141e', '#0a0d14']} style={styles.mapMini}>
                <View style={styles.mlPin} />
              </LinearGradient>
              <View style={[styles.compareCost, { borderColor: 'rgba(74,222,128,0.3)' }]}>
                <Text style={[styles.compareCostTxt, { color: colors.success }]}>~ 0 € · open-source</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Avancement */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Avancement migration</Text>
          <Text style={styles.sectionMono}>Sprint 12</Text>
        </View>
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Écrans portés</Text>
            <Text style={styles.progressPct}>
              50<Text style={styles.progressUnit}>%</Text>
            </Text>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[colors.neon, colors.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: '50%', height: '100%', borderRadius: 3 }}
            />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressMetaTxt}>
              <Text style={styles.progressMetaStrong}>4</Text> faits sur{' '}
              <Text style={styles.progressMetaStrong}>8</Text>
            </Text>
            <Text style={styles.progressMetaTxt}>ETA · vendredi 02/05</Text>
          </View>
        </View>

        {/* Checklist écrans */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Écrans GPS · checklist</Text>
          <Text style={styles.sectionMono}>8 écrans</Text>
        </View>
        <View style={{ paddingHorizontal: 16, gap: 8, marginBottom: 22 }}>
          {screens.map((s) => (
            <View key={s.name} style={styles.screenRow}>
              <View style={[styles.screenIcon, { backgroundColor: `${stateColor(s.state)}22` }]}>
                {s.state === 'done' ? (
                  <Check size={16} color={colors.success} />
                ) : s.state === 'progress' ? (
                  <RefreshCw size={16} color={colors.neon} />
                ) : (
                  <Circle size={16} color={colors.inkMute} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.screenName} numberOfLines={1}>
                  {s.name}
                </Text>
                <Text style={styles.screenMeta} numberOfLines={1}>
                  {s.meta}
                </Text>
              </View>
              <View style={[styles.screenStatus, { borderColor: `${stateColor(s.state)}55`, backgroundColor: `${stateColor(s.state)}1f` }]}>
                <Text style={[styles.screenStatusTxt, { color: stateColor(s.state) }]}>{stateLabel(s.state)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Économie */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Économie projetée</Text>
        </View>
        <View style={styles.econCard}>
          <View style={styles.econHead}>
            <View style={styles.econIcon}>
              <DollarSign size={16} color={colors.success} />
            </View>
            <Text style={styles.econTitle}>Coût mensuel cartographie</Text>
          </View>
          <View style={styles.econAmounts}>
            <Text style={styles.econOld}>248 €</Text>
            <ArrowRight size={14} color={colors.inkDim} />
            <Text style={styles.econNew}>
              ~ 12<Text style={styles.econNewUnit}>€/mois</Text>
            </Text>
          </View>
          <View style={styles.econDelta}>
            <ChevronDown size={10} color={colors.success} strokeWidth={3} />
            <Text style={styles.econDeltaTxt}>− 95% · 2 832 €/an</Text>
          </View>
          <Text style={styles.econFoot}>
            <Text style={styles.econFootStrong}>MapLibre GL</Text> est open-source · seul l'hébergement des tuiles
            vectorielles reste à charge (~12 €/mois sur OVH).
          </Text>
        </View>

        {/* Risques */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Points d'attention</Text>
        </View>
        <View style={styles.risks}>
          <View style={styles.risksHead}>
            <View style={styles.risksIcon}>
              <AlertTriangle size={12} color={colors.warn} strokeWidth={2.5} />
            </View>
            <Text style={styles.risksTitle}>
              <Text style={{ color: colors.warn }}>3 risques</Text> à valider avant déploiement prod
            </Text>
          </View>
          {risks.map((r, i) => (
            <View key={i} style={styles.riskItem}>
              <CheckSquare size={11} color={colors.warn} strokeWidth={2.5} style={{ marginTop: 3 }} />
              <Text style={styles.riskTxt}>{r}</Text>
            </View>
          ))}
        </View>
      </Screen>

      {/* Bottom CTA bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable style={styles.secondaryBtn}>
          <Info size={14} color={colors.ink} />
          <Text style={styles.secondaryTxt}>Specs</Text>
        </Pressable>
        <Pressable style={{ flex: 1.6 }}>
          <LinearGradient
            colors={[colors.neon, colors.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryBtn}
          >
            <Check size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.primaryTxt}>Valider la migration</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topnav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink, letterSpacing: 0.4 },
  topSub: { fontFamily: fonts.mono, fontSize: 9, color: colors.purple, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 1 },

  trigger: {
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: 'rgba(255,92,122,0.3)',
    borderRadius: radius.md,
  },
  triggerIcon: { width: 38, height: 38, borderRadius: radius.sm, backgroundColor: 'rgba(255,92,122,0.18)', alignItems: 'center', justifyContent: 'center' },
  triggerTag: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, backgroundColor: colors.danger, borderRadius: 4, marginBottom: 4 },
  triggerTagTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.8 },
  triggerTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 3 },
  triggerDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 15 },
  triggerStrong: { fontFamily: fonts.monoBold, color: colors.danger },

  header: { paddingHorizontal: 16, paddingBottom: 14 },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, letterSpacing: -0.5, lineHeight: 30, marginBottom: 6 },
  headerSub: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 19 },

  compareCard: { marginHorizontal: 16, marginBottom: 20, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, overflow: 'hidden' },
  compareGrid: { flexDirection: 'row' },
  compareCol: { flex: 1, aspectRatio: 1, position: 'relative' },
  compareColRight: { borderLeftWidth: 1, borderLeftColor: colors.line },
  compareLabel: { position: 'absolute', top: 8, left: 8, zIndex: 5, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(10,14,21,0.85)', borderWidth: 1, borderRadius: 6 },
  compareLabelTxt: { fontFamily: fonts.monoBold, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.6 },
  mapMini: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  googlePin: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#ea4335' },
  mlPin: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.neon, borderWidth: 2, borderColor: '#0a0d14' },
  compareCost: { position: 'absolute', bottom: 8, left: 8, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(10,14,21,0.85)', borderWidth: 1, borderRadius: radius.pill, zIndex: 5 },
  compareCostTxt: { fontFamily: fonts.mono, fontSize: 10 },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 16, paddingBottom: 12 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, letterSpacing: -0.2 },
  sectionMono: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.6 },

  progressCard: { marginHorizontal: 16, marginBottom: 20, padding: 16, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: 'rgba(184,132,230,0.25)', borderRadius: radius.md },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  progressLabel: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.8 },
  progressPct: { fontFamily: fonts.monoBold, fontSize: 28, color: colors.ink, letterSpacing: -0.5 },
  progressUnit: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkDim },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: colors.bgDeep, overflow: 'hidden', marginBottom: 10 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  progressMetaTxt: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim },
  progressMetaStrong: { fontFamily: fonts.monoBold, color: colors.ink },

  screenRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm },
  screenIcon: { width: 38, height: 38, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  screenName: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  screenMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim },
  screenStatus: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  screenStatusTxt: { fontFamily: fonts.monoBold, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.4 },

  econCard: { marginHorizontal: 16, marginBottom: 20, padding: 16, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: 'rgba(74,222,128,0.25)', borderRadius: radius.md },
  econHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  econIcon: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: 'rgba(74,222,128,0.18)', alignItems: 'center', justifyContent: 'center' },
  econTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  econAmounts: { flexDirection: 'row', alignItems: 'baseline', gap: 14, marginBottom: 8 },
  econOld: { fontFamily: fonts.mono, fontSize: 18, color: colors.inkDim, textDecorationLine: 'line-through' },
  econNew: { fontFamily: fonts.monoBold, fontSize: 28, color: colors.success, letterSpacing: -0.5 },
  econNewUnit: { fontFamily: fonts.regular, fontSize: 13, color: colors.success },
  econDelta: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(74,222,128,0.15)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: 6 },
  econDeltaTxt: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.success },
  econFoot: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 15, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(74,222,128,0.15)' },
  econFootStrong: { fontFamily: fonts.semibold, color: colors.ink },

  risks: { marginHorizontal: 16, marginBottom: 22, padding: 14, backgroundColor: 'rgba(251,191,36,0.05)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)', borderRadius: radius.md },
  risksHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  risksIcon: { width: 24, height: 24, borderRadius: 7, backgroundColor: 'rgba(251,191,36,0.15)', alignItems: 'center', justifyContent: 'center' },
  risksTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink },
  riskItem: { flexDirection: 'row', gap: 8, paddingVertical: 6 },
  riskTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.ink, lineHeight: 17 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: 'rgba(10,14,21,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  secondaryBtn: { flex: 1, height: 50, borderRadius: radius.md, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  secondaryTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  primaryBtn: { height: 50, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.neon },
  primaryTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
