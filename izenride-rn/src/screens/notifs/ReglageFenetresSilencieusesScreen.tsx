import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import {
  Moon,
  Sun,
  Edit3,
  Calendar,
  Shield,
  Navigation,
  AlertTriangle,
  HelpCircle,
  ChevronLeft,
} from 'lucide-react-native';
import { Screen, Switch } from '@/components';
import { colors, fonts, radius } from '@/theme';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

/** Réglage fenêtres silencieuses — mode ZEN nuit 22h-07h (localisé Paris). */
export default function ReglageFenetresSilencieusesScreen() {
  // anneau 24h : fenêtre 22h-07h = 9h / 24h. circonférence = 2π·86 ≈ 540.
  const r = 86;
  const circ = 2 * Math.PI * r;
  const windowLen = (9 / 24) * circ;

  return (
    <Screen scroll pad={0} edges={['top']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={18} color={colors.ink} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.navTitle}>Fenêtres silencieuses</Text>
          <Text style={styles.navSub}>Mode ZEN nuit</Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <HelpCircle size={18} color={colors.ink} />
        </Pressable>
      </View>

      {/* Hero horloge 24h */}
      <View style={styles.hero}>
        <View style={styles.clockWrap}>
          <Svg width={200} height={200} viewBox="0 0 200 200">
            <Defs>
              <SvgGradient id="silentGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor={colors.purple} />
                <Stop offset="100%" stopColor={colors.neon} />
              </SvgGradient>
            </Defs>
            <Circle cx={100} cy={100} r={r} fill="none" stroke={colors.line} strokeWidth={10} />
            <Circle
              cx={100}
              cy={100}
              r={r}
              fill="none"
              stroke="url(#silentGrad)"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={`${windowLen} ${circ}`}
              transform="rotate(240 100 100)"
            />
          </Svg>
          <View style={styles.clockInfo}>
            <View style={styles.clockIconWrap}>
              <Moon size={18} color={colors.purple} />
            </View>
            <Text style={styles.clockDuration}>9 h</Text>
            <Text style={styles.clockLabel}>Silence</Text>
          </View>
        </View>
        <Text style={styles.clockRange}>
          22:00 <Text style={{ color: colors.purple }}>→</Text> 07:00
        </Text>
      </View>

      {/* Master toggle */}
      <View style={styles.masterCard}>
        <View style={styles.masterIcon}>
          <Moon size={18} color={colors.purple} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.masterTitleRow}>
            <Text style={styles.masterTitle}>Mode silencieux</Text>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusTxt}>Actif</Text>
            </View>
          </View>
          <Text style={styles.masterDesc}>
            Aucune notif entre <Text style={styles.strong}>22h00</Text> et <Text style={styles.strong}>07h00</Text>.
          </Text>
        </View>
        <Switch value />
      </View>

      {/* Plage horaire */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Plage horaire</Text>
        <Text style={styles.sectionLink}>Modifier</Text>
      </View>
      <View style={styles.card}>
        <Pressable style={styles.timeRow}>
          <View style={[styles.timeIcon, { backgroundColor: 'rgba(184,132,230,0.12)' }]}>
            <Moon size={16} color={colors.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.timeLabel}>Début · Silence ON</Text>
            <Text style={styles.timeValue}>22:00</Text>
          </View>
          <Edit3 size={14} color={colors.inkMute} />
        </Pressable>
        <View style={styles.sep} />
        <Pressable style={styles.timeRow}>
          <View style={[styles.timeIcon, { backgroundColor: 'rgba(251,191,36,0.12)' }]}>
            <Sun size={16} color={colors.warn} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.timeLabel}>Fin · Silence OFF</Text>
            <Text style={styles.timeValue}>07:00</Text>
          </View>
          <Edit3 size={14} color={colors.inkMute} />
        </Pressable>
      </View>

      {/* Jours actifs */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Jours actifs</Text>
      </View>
      <View style={styles.daysCard}>
        <View style={styles.daysHead}>
          <View style={styles.daysHeadLabel}>
            <Calendar size={12} color={colors.inkMute} />
            <Text style={styles.daysHeadTxt}>Tous les jours</Text>
          </View>
          <Text style={styles.daysMeta}>7 / 7</Text>
        </View>
        <View style={styles.daysGrid}>
          {DAYS.map((d, i) => {
            const weekend = i >= 5;
            return (
              <View
                key={d}
                style={[
                  styles.dayPill,
                  weekend ? styles.dayPillWeekend : styles.dayPillActive,
                ]}
              >
                <Text style={[styles.dayTxt, { color: weekend ? colors.neon : colors.purple }]}>{d}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Exceptions */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Exceptions</Text>
        <Text style={styles.sectionLink}>Tout voir</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.excepRow}>
          <View style={[styles.excepIcon, { backgroundColor: 'rgba(74,222,128,0.12)' }]}>
            <Shield size={14} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.excepTitle}>Matchs prioritaires</Text>
            <Text style={styles.excepDesc}>
              Léa, Thomas et 3 autres peuvent <Text style={styles.strong}>passer outre</Text>.
            </Text>
          </View>
          <Switch value />
        </View>
        <View style={styles.sep} />
        <View style={styles.excepRow}>
          <View style={[styles.excepIcon, { backgroundColor: 'rgba(77,143,255,0.12)' }]}>
            <Navigation size={14} color={colors.neon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.excepTitle}>Pas de notif pendant un trajet</Text>
            <Text style={styles.excepDesc}>Anti-distraction quand le GPS est actif.</Text>
          </View>
          <Switch value />
        </View>
        <View style={styles.sep} />
        <View style={styles.excepRow}>
          <View style={[styles.excepIcon, { backgroundColor: 'rgba(255,92,122,0.12)' }]}>
            <AlertTriangle size={14} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.excepTitle}>Alertes sécurité</Text>
            <Text style={styles.excepDesc}>Toujours actives · annulation, accident, météo.</Text>
          </View>
          <Switch value />
        </View>
      </View>

      {/* Anti-intrusion GPS */}
      <Pressable style={styles.gpsBanner}>
        <View style={styles.gpsIcon}>
          <Navigation size={18} color={colors.neon} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.gpsTag}>
            <Text style={styles.gpsTagTxt}>Mode ZEN GPS</Text>
          </View>
          <Text style={styles.gpsTitle}>Anti-intrusion en cours de roulage</Text>
          <Text style={styles.gpsDesc}>
            Personne ne peut vous joindre pendant un trajet sauf{' '}
            <Text style={{ color: colors.neon, fontFamily: fonts.semibold }}>contacts d'urgence</Text>.
          </Text>
        </View>
      </Pressable>

      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  iconBtn: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  navSub: { fontFamily: fonts.mono, fontSize: 9, color: colors.purple, textTransform: 'uppercase', letterSpacing: 1, marginTop: 1 },

  hero: { paddingVertical: 20, alignItems: 'center' },
  clockWrap: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  clockInfo: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  clockIconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(184,132,230,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  clockDuration: { fontFamily: fonts.monoBold, fontSize: 22, color: colors.ink },
  clockLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
  clockRange: { fontFamily: fonts.monoBold, fontSize: 16, color: colors.ink },

  masterCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 22, padding: 14, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: 'rgba(184,132,230,0.3)', borderRadius: radius.md },
  masterIcon: { width: 40, height: 40, borderRadius: 11, backgroundColor: 'rgba(184,132,230,0.18)', alignItems: 'center', justifyContent: 'center' },
  masterTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  masterTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(74,222,128,0.15)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: 4 },
  statusDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.success },
  statusTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.success, textTransform: 'uppercase', letterSpacing: 0.5 },
  masterDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
  strong: { fontFamily: fonts.semibold, color: colors.inkDim },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 16, paddingBottom: 12 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  sectionLink: { fontFamily: fonts.mono, fontSize: 11, color: colors.neon },

  card: { marginHorizontal: 16, marginBottom: 22, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, overflow: 'hidden' },
  sep: { height: 1, backgroundColor: colors.line },

  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  timeIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  timeLabel: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  timeValue: { fontFamily: fonts.monoBold, fontSize: 22, color: colors.ink },

  daysCard: { marginHorizontal: 16, marginBottom: 22, padding: 12, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  daysHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  daysHeadLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  daysHeadTxt: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5 },
  daysMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.neon },
  daysGrid: { flexDirection: 'row', gap: 4 },
  dayPill: { flex: 1, height: 38, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, borderColor: colors.line },
  dayPillActive: { backgroundColor: 'rgba(184,132,230,0.12)', borderColor: colors.purple },
  dayPillWeekend: { backgroundColor: 'rgba(77,143,255,0.1)', borderColor: colors.neon },
  dayTxt: { fontFamily: fonts.monoBold, fontSize: 11, textTransform: 'uppercase' },

  excepRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 12 },
  excepIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  excepTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 1 },
  excepDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },

  gpsBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 22, padding: 14, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderRadius: radius.md },
  gpsIcon: { width: 40, height: 40, borderRadius: 11, backgroundColor: 'rgba(77,143,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  gpsTag: { alignSelf: 'flex-start', paddingHorizontal: 5, paddingVertical: 1, backgroundColor: 'rgba(77,143,255,0.12)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderRadius: 3, marginBottom: 3 },
  gpsTagTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.neon, textTransform: 'uppercase', letterSpacing: 0.5 },
  gpsTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  gpsDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
});
