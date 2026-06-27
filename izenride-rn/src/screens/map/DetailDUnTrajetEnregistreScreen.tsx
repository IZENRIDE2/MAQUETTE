import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Line } from 'react-native-svg';
import {
  ChevronLeft,
  MoreVertical,
  MapPin,
  Plus,
  Minus,
  Crosshair,
  Star,
  Check,
  User,
  Clock,
  Zap,
  TrendingUp,
  ChevronRight,
  AlertTriangle,
  Navigation,
  Download,
  Edit3,
  Trash2,
  Share2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, radius, shadow } from '@/theme';
import { Screen } from '@/components';

/**
 * Détail d'un trajet enregistré — carte + stats + profil vitesse.
 * Localisé Paris : Le Marais → Vallée de Chevreuse (D906), 28 juin 2026.
 */
export default function DetailDUnTrajetEnregistreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Screen pad={0} contentStyle={{ paddingBottom: 100 }} edges={[]}>
        {/* HERO MAP */}
        <View style={styles.hero}>
          <LinearGradient colors={['#0e1422', '#070910']} style={StyleSheet.absoluteFill} />
          {/* Tracé du trajet (statique) */}
          <Svg style={StyleSheet.absoluteFill} viewBox="0 0 390 380" preserveAspectRatio="xMidYMid slice">
            <Path
              d="M 50 320 C 90 290, 130 270, 160 240 S 200 200, 220 170 Q 250 130, 290 110 T 340 80"
              stroke={colors.neon}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
          </Svg>

          {/* Top nav superposée */}
          <View style={[styles.topnav, { top: insets.top + 8 }]}>
            <Pressable style={styles.iconBtn} onPress={() => router.back()}>
              <ChevronLeft size={18} color={colors.ink} />
            </Pressable>
            <View style={styles.topTitle}>
              <Text style={styles.topTitleTxt}>Détail trajet</Text>
            </View>
            <Pressable style={styles.iconBtn}>
              <MoreVertical size={18} color={colors.ink} />
            </Pressable>
          </View>

          {/* Pills */}
          <View style={[styles.mapPills, { top: insets.top + 62 }]}>
            <View style={[styles.mapPill, { borderColor: 'rgba(74,222,128,0.3)' }]}>
              <MapPin size={11} color={colors.success} />
              <Text style={[styles.mapPillTxt, { color: colors.success }]}>14:22 · Le Marais</Text>
            </View>
            <View style={[styles.mapPill, { borderColor: 'rgba(255,92,122,0.3)' }]}>
              <MapPin size={11} color={colors.danger} />
              <Text style={[styles.mapPillTxt, { color: colors.danger }]}>15:34 · Chevreuse</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={[styles.mapControls, { top: insets.top + 62 }]}>
            <Pressable style={styles.mapCtrl}>
              <Plus size={14} color={colors.ink} />
            </Pressable>
            <Pressable style={styles.mapCtrl}>
              <Minus size={14} color={colors.ink} />
            </Pressable>
            <Pressable style={styles.mapCtrl}>
              <Crosshair size={14} color={colors.ink} />
            </Pressable>
          </View>

          {/* Date overlay */}
          <View style={styles.dateCard}>
            <Text style={styles.dateLabel}>28 Juin 2026</Text>
            <Text style={styles.dateValue}>Dimanche · après-midi</Text>
          </View>
        </View>

        {/* BODY */}
        <View style={styles.body}>
          <View style={styles.grab} />

          {/* Title row */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.catRow}>
                <View style={styles.tripTag}>
                  <User size={9} color={colors.neon} strokeWidth={2.5} />
                  <Text style={styles.tripTagTxt}>Solo</Text>
                </View>
                <View style={styles.zenTag}>
                  <Check size={9} color={colors.success} strokeWidth={2.5} />
                  <Text style={styles.zenTagTxt}>ZEN</Text>
                </View>
              </View>
              <Text style={styles.tripTitle}>Paris → Vallée de Chevreuse</Text>
            </View>
            <Pressable style={styles.favBtn}>
              <Star size={16} color={colors.warn} fill={colors.warn} />
            </Pressable>
          </View>

          {/* Itinéraire */}
          <View style={styles.route}>
            <View style={styles.routeStep}>
              <View style={[styles.routePin, { backgroundColor: 'rgba(74,222,128,0.15)' }]}>
                <View style={[styles.routePinDot, { backgroundColor: colors.success }]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.routeName}>Le Marais · Paris 4e</Text>
                <Text style={styles.routeTime}>14:22 · Départ</Text>
              </View>
            </View>
            <View style={styles.routeDivider} />
            <View style={styles.routeStep}>
              <View style={[styles.routePin, { backgroundColor: 'rgba(255,92,122,0.15)' }]}>
                <View style={[styles.routePinDot, { backgroundColor: colors.danger }]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.routeName}>Chevreuse · Vallée de Chevreuse</Text>
                <Text style={styles.routeTime}>15:34 · Arrivée</Text>
              </View>
            </View>
          </View>

          {/* Statistiques */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Statistiques</Text>
          </View>
          <View style={styles.statsGrid}>
            <StatCard icon={MapPin} tint={colors.neon} label="Distance" value="68" unit="km" extra="Aller-retour" extraStrong="Sinueux" />
            <StatCard icon={Clock} tint={colors.success} label="Durée" value="1h" unit="12" extra="Roulage" extraStrong="+ 6min pause" />
            <StatCard icon={Zap} tint={colors.purple} label="Vit. moy." value="76" unit="km/h" extra="Hors arrêts" />
            <StatCard icon={Zap} tint={colors.warn} label="Vit. max." value="112" unit="km/h" extra="À 14:48 · D906" />
          </View>

          {/* Chart */}
          <View style={styles.chartCard}>
            <View style={styles.chartHead}>
              <Text style={styles.chartTitle}>Profil du trajet</Text>
              <View style={styles.chartTabs}>
                <View style={[styles.chartTab, styles.chartTabOn]}>
                  <Text style={styles.chartTabTxtOn}>Vitesse</Text>
                </View>
                <View style={styles.chartTab}>
                  <Text style={styles.chartTabTxt}>Altitude</Text>
                </View>
              </View>
            </View>
            <View style={styles.chartArea}>
              <Svg width="100%" height="100%" viewBox="0 0 320 110" preserveAspectRatio="none">
                <Path
                  d="M 25 70 L 50 50 L 75 35 L 100 60 L 125 40 L 150 55 L 175 25 L 200 70 L 225 50 L 250 30 L 275 45 L 300 65 L 320 75"
                  stroke={colors.neon}
                  strokeWidth={2}
                  fill="none"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <Line x1="0" y1="32" x2="320" y2="32" stroke={colors.success} strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />
              </Svg>
            </View>
            <View style={styles.chartLegend}>
              <Text style={styles.chartLegendTxt}>14:22</Text>
              <Text style={styles.chartLegendTxt}>14:48 · pic</Text>
              <Text style={styles.chartLegendTxt}>15:34</Text>
            </View>
          </View>

          {/* Moments clés */}
          <Text style={[styles.sectionTitle, { marginBottom: 12, paddingHorizontal: 16 }]}>Moments clés</Text>
          <View style={styles.moments}>
            <Moment icon={Zap} tint={colors.warn} value="112" unit="km/h" label="Pic vitesse" />
            <Moment icon={TrendingUp} tint={colors.purple} value="487" unit="m" label="Dénivelé +" />
            <Moment icon={Check} tint={colors.success} value="98" unit="%" label="Score ZEN" />
          </View>

          {/* Alertes */}
          <View style={styles.alertsCard}>
            <View style={styles.alertsHead}>
              <View style={styles.alertsIcon}>
                <AlertTriangle size={14} color={colors.warn} />
              </View>
              <Text style={styles.alertsTitle}>
                <Text style={{ color: colors.warn }}>2 alertes</Text> reçues sur ce trajet
              </Text>
            </View>
            <View style={styles.alertsList}>
              <View style={styles.alertItem}>
                <Text style={styles.alertTime}>14:35</Text>
                <Text style={styles.alertText}>Virage serré · gravillons</Text>
                <ChevronRight size={12} color={colors.inkDim} />
              </View>
              <View style={styles.alertItem}>
                <Text style={styles.alertTime}>15:08</Text>
                <Text style={styles.alertText}>Pente descendante · 8%</Text>
                <ChevronRight size={12} color={colors.inkDim} />
              </View>
            </View>
          </View>

          {/* Souvenirs */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Souvenirs</Text>
            <Text style={styles.sectionLink}>+ Ajouter</Text>
          </View>
          <View style={styles.photos}>
            <LinearGradient colors={[colors.neon, '#0a1428']} style={styles.photo}>
              <Text style={styles.photoEmoji}>🏞️</Text>
            </LinearGradient>
            <LinearGradient colors={[colors.warn, '#1a1408']} style={styles.photo}>
              <Text style={styles.photoEmoji}>☀️</Text>
            </LinearGradient>
            <LinearGradient colors={['#2a1f3d', colors.purple]} style={styles.photo}>
              <Text style={styles.photoEmoji}>🏍️</Text>
              <View style={styles.photoMore}>
                <Text style={styles.photoMoreTxt}>+4</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Actions */}
          <Text style={[styles.sectionTitle, { marginBottom: 12, paddingHorizontal: 16 }]}>Actions</Text>
          <View style={styles.actions}>
            <Action icon={Navigation} label="Refaire" />
            <Action icon={Download} label="GPX" />
            <Action icon={Edit3} label="Renommer" />
            <Action icon={Trash2} label="Supprimer" danger />
          </View>
        </View>
      </Screen>

      {/* Bottom share bar */}
      <View style={[styles.shareBar, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable style={styles.secondaryBtn}>
          <Download size={14} color={colors.ink} />
          <Text style={styles.secondaryTxt}>Exporter</Text>
        </Pressable>
        <Pressable style={{ flex: 2 }}>
          <LinearGradient colors={[colors.neon, colors.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shareBtn}>
            <Share2 size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.shareTxt}>Partager le trajet</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function StatCard({ icon: Icon, tint, label, value, unit, extra, extraStrong }: { icon: any; tint: string; label: string; value: string; unit: string; extra: string; extraStrong?: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardHead}>
        <View style={[styles.statIconMini, { backgroundColor: `${tint}26` }]}>
          <Icon size={12} color={tint} />
        </View>
        <Text style={styles.statCardLabel}>{label}</Text>
      </View>
      <Text style={styles.statCardValue}>
        {value}
        <Text style={styles.statCardUnit}>{unit}</Text>
      </Text>
      <View style={styles.statCardExtra}>
        <Text style={styles.statCardExtraTxt}>{extra}</Text>
        {extraStrong ? (
          <>
            <View style={styles.statDot} />
            <Text style={styles.statCardExtraStrong}>{extraStrong}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
}

function Moment({ icon: Icon, tint, value, unit, label }: { icon: any; tint: string; value: string; unit: string; label: string }) {
  return (
    <View style={styles.moment}>
      <View style={[styles.momentIcon, { backgroundColor: `${tint}26` }]}>
        <Icon size={14} color={tint} />
      </View>
      <Text style={styles.momentValue}>
        {value}
        <Text style={styles.momentUnit}>{unit}</Text>
      </Text>
      <Text style={styles.momentLabel}>{label}</Text>
    </View>
  );
}

function Action({ icon: Icon, label, danger }: { icon: any; label: string; danger?: boolean }) {
  return (
    <Pressable style={styles.action}>
      <Icon size={18} color={danger ? colors.danger : colors.ink} />
      <Text style={[styles.actionTxt, danger && { color: colors.danger }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { height: 380, backgroundColor: '#0a0d14', overflow: 'hidden' },
  topnav: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 },
  iconBtn: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: 'rgba(10,14,21,0.7)', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  topTitle: { backgroundColor: 'rgba(10,14,21,0.7)', borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
  topTitleTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink, textTransform: 'uppercase', letterSpacing: 0.8 },

  mapPills: { position: 'absolute', left: 16, gap: 8, zIndex: 4 },
  mapPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(10,14,21,0.85)', borderWidth: 1, borderRadius: radius.sm },
  mapPillTxt: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.4 },
  mapControls: { position: 'absolute', right: 16, gap: 8, zIndex: 4 },
  mapCtrl: { width: 36, height: 36, backgroundColor: 'rgba(10,14,21,0.85)', borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  dateCard: { position: 'absolute', bottom: 40, left: 16, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: 'rgba(10,14,21,0.88)', borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, zIndex: 4 },
  dateLabel: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  dateValue: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },

  body: { backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, marginTop: -24, paddingHorizontal: 16, paddingTop: 18 },
  grab: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong, alignSelf: 'center', marginTop: -8, marginBottom: 14 },

  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  tripTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(77,143,255,0.12)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderRadius: 6 },
  tripTagTxt: { fontFamily: fonts.bold, fontSize: 9, color: colors.neonBright, textTransform: 'uppercase', letterSpacing: 0.6 },
  zenTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(74,222,128,0.12)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: 6 },
  zenTagTxt: { fontFamily: fonts.bold, fontSize: 9, color: colors.success, textTransform: 'uppercase', letterSpacing: 0.6 },
  tripTitle: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, letterSpacing: -0.5, lineHeight: 30 },
  favBtn: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },

  route: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 12, marginBottom: 18 },
  routeStep: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  routePin: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  routePinDot: { width: 8, height: 8, borderRadius: 4 },
  routeName: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  routeTime: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim, marginTop: 1 },
  routeDivider: { marginLeft: 8, height: 16, width: 2, backgroundColor: colors.lineStrong },

  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, paddingHorizontal: 0 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, letterSpacing: -0.2 },
  sectionLink: { fontFamily: fonts.medium, fontSize: 11, color: colors.neonBright },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  statCard: { width: '48%', flexGrow: 1, padding: 14, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  statCardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  statIconMini: { width: 24, height: 24, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  statCardLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.4 },
  statCardValue: { fontFamily: fonts.monoBold, fontSize: 24, color: colors.ink, letterSpacing: -0.5 },
  statCardUnit: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  statCardExtra: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  statCardExtraTxt: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkDim },
  statCardExtraStrong: { fontFamily: fonts.semibold, fontSize: 10, color: colors.ink },
  statDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.inkMute },

  chartCard: { padding: 16, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, marginBottom: 22 },
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  chartTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  chartTabs: { flexDirection: 'row', gap: 4, padding: 3, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm },
  chartTab: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 },
  chartTabOn: { backgroundColor: colors.neon },
  chartTabTxt: { fontFamily: fonts.medium, fontSize: 10, color: colors.inkDim },
  chartTabTxtOn: { fontFamily: fonts.semibold, fontSize: 10, color: '#fff' },
  chartArea: { height: 110, marginBottom: 8 },
  chartLegend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  chartLegendTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkDim },

  moments: { flexDirection: 'row', gap: 8, marginBottom: 22, paddingHorizontal: 0 },
  moment: { flex: 1, padding: 12, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, alignItems: 'center' },
  momentIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  momentValue: { fontFamily: fonts.monoBold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  momentUnit: { fontFamily: fonts.regular, fontSize: 9, color: colors.inkDim },
  momentLabel: { fontFamily: fonts.medium, fontSize: 9, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'center' },

  alertsCard: { padding: 14, backgroundColor: 'rgba(251,191,36,0.06)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)', borderRadius: radius.md, marginBottom: 22 },
  alertsHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  alertsIcon: { width: 28, height: 28, borderRadius: radius.sm, backgroundColor: 'rgba(251,191,36,0.18)', alignItems: 'center', justifyContent: 'center' },
  alertsTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  alertsList: { paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(251,191,36,0.15)' },
  alertItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  alertTime: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim, minWidth: 44 },
  alertText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.ink },

  photos: { flexDirection: 'row', gap: 6, marginBottom: 22 },
  photo: { flex: 1, aspectRatio: 1, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photoEmoji: { fontSize: 32 },
  photoMore: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,14,21,0.7)', alignItems: 'center', justifyContent: 'center' },
  photoMoreTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },

  actions: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  action: { flex: 1, paddingVertical: 12, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, alignItems: 'center', gap: 6 },
  actionTxt: { fontFamily: fonts.medium, fontSize: 10, color: colors.ink },

  shareBar: {
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
  shareBtn: { height: 50, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.neon },
  shareTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
