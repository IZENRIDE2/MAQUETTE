import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Eye,
  X,
  ChevronLeft,
  Share2,
  MoreVertical,
  MapPin,
  Bike,
  Check,
  Zap,
  Clock,
  Star,
  TrendingUp,
  Shield,
  Users,
  Lock,
  Edit3,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts } from '@/theme';

const SPECS = [
  { label: 'Cylindrée', value: '1254', unit: 'cc' },
  { label: 'Puissance', value: '136', unit: 'ch' },
  { label: 'Poids', value: '249', unit: 'kg' },
  { label: 'Permis', value: 'A', unit: '' },
];

const PREFS = ['Cols & sinueuses', 'Trail technique', 'Petits groupes', 'Routes sinueuses', 'Sorties journée', 'Évite l’autoroute'];

const BADGES = [
  { Icon: Star, name: '10K km', meta: 'Légende', color: '#E8B547', bg: 'rgba(232,181,71,0.2)' },
  { Icon: TrendingUp, name: 'Cols', meta: '22 sommets', color: '#7F77DD', bg: 'rgba(127,119,221,0.18)' },
  { Icon: Shield, name: 'ZEN', meta: '96 % score', color: colors.success, bg: 'rgba(93,202,165,0.18)' },
  { Icon: Users, name: 'Groupe', meta: '38 sorties', color: colors.neon, bg: 'rgba(74,156,232,0.18)' },
  { Icon: Lock, name: '100K', meta: 'verrouillé', color: colors.inkMute, bg: '#1A1E28', locked: true },
];

/** Mon profil — vue lecture (aperçu public), localisé Paris. */
export default function MonProfilVueLectureScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Preview banner */}
      <View style={styles.previewStrip}>
        <View style={styles.previewIcon}>
          <Eye size={14} color="#7F77DD" />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.previewTitle}>Aperçu de votre profil</Text>
          <Text style={styles.previewSub}>Vue lecture · comme les autres vous voient</Text>
        </View>
        <Pressable style={styles.previewExit}>
          <X size={11} color="#E8EBF2" />
          <Text style={styles.previewExitTxt}>Quitter</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {/* Hero photo */}
        <View style={styles.hero}>
          <LinearGradient colors={[colors.success, '#1a3a3e', '#0a1428']} style={StyleSheet.absoluteFill} />
          <Text style={styles.heroGlyph}>A</Text>
          <LinearGradient colors={['rgba(8,9,14,0.4)', 'transparent', 'rgba(8,9,14,0.95)']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />

          {/* Top nav (disabled aspect) */}
          <View style={styles.topnav}>
            <View style={[styles.heroIconBtn, { opacity: 0.5 }]}>
              <ChevronLeft size={18} color="#fff" />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={[styles.heroIconBtn, { opacity: 0.5 }]}>
                <Share2 size={18} color="#fff" />
              </View>
              <View style={[styles.heroIconBtn, { opacity: 0.5 }]}>
                <MoreVertical size={18} color="#fff" />
              </View>
            </View>
          </View>

          {/* Pagination */}
          <View style={styles.pagDots}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.pagDot, i === 0 && styles.pagDotActive]} />
            ))}
          </View>

          {/* Identity overlay */}
          <View style={styles.identity}>
            <View style={styles.identityTags}>
              <View style={[styles.tagMini, styles.tagOnline]}>
                <View style={styles.onlineDot} />
                <Text style={[styles.tagMiniTxt, { color: colors.success }]}>Vous</Text>
              </View>
              <View style={styles.tagMini}>
                <MapPin size={10} color="#E8EBF2" />
                <Text style={styles.tagMiniTxt}>Paris</Text>
              </View>
              <View style={styles.tagMini}>
                <Bike size={10} color="#E8EBF2" />
                <Text style={styles.tagMiniTxt}>Confirmé</Text>
              </View>
            </View>
            <View style={styles.nameRow}>
              <Text style={styles.identityName}>Alexandre</Text>
              <Text style={styles.identityAge}>32</Text>
              <View style={styles.verifiedBadge}>
                <Check size={12} color="#fff" strokeWidth={2.5} />
              </View>
            </View>
            <Text style={styles.identityHandle}>@alex_rides_75</Text>
          </View>
        </View>

        {/* Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scorePct}>76%</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scoreTitle}>
              Votre profil est <Text style={{ color: colors.ink }}>presque complet</Text>
            </Text>
            <Text style={styles.scoreDesc}>
              Ajoutez <Text style={styles.scoreStrong}>2 photos</Text> pour atteindre 100% et augmenter vos matchs.
            </Text>
          </View>
        </View>

        {/* Bio */}
        <SectionTitle title="À propos" />
        <View style={styles.bioCard}>
          <Text style={styles.bioText}>
            Ingénieur le jour, motard le week-end. Toujours partant pour <Text style={styles.bioStrong}>découvrir de nouvelles routes</Text>,
            en solo ou petit groupe. Préférence pour les forêts d’Île-de-France, les trails techniques et les sorties d’une journée.
          </Text>
        </View>

        {/* Moto */}
        <SectionTitle title="Ma moto" link="3 photos →" />
        <View style={styles.motoCard}>
          <LinearGradient colors={['#14182a', '#0a0d14']} style={styles.motoHero}>
            <View style={styles.motoPill}>
              <Text style={styles.motoPillTxt}>Trail · Routier</Text>
            </View>
            <Text style={styles.motoEmoji}>🏍️</Text>
          </LinearGradient>
          <View style={styles.motoInfo}>
            <Text style={styles.motoName}>BMW R 1250 GS</Text>
            <Text style={styles.motoModel}>Adventure · 2024 · Triple Black</Text>
            <View style={styles.motoSpecs}>
              {SPECS.map((s, i) => (
                <View key={s.label} style={[styles.spec, i < SPECS.length - 1 && styles.specBorder]}>
                  <Text style={styles.specLabel}>{s.label}</Text>
                  <Text style={styles.specValue}>
                    {s.value}
                    {s.unit ? <Text style={styles.specUnit}>{s.unit}</Text> : null}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Stats riding */}
        <SectionTitle title="Stats de roulage" link="2025 →" />
        <View style={styles.statsGrid}>
          <StatCard Icon={MapPin} tint={colors.neon} bg="rgba(74,156,232,0.12)" value="12 480" unit="km" label="Cette année" />
          <StatCard Icon={Zap} tint="#7F77DD" bg="rgba(127,119,221,0.12)" value="Confirmé" label="Niveau" />
          <StatCard Icon={Clock} tint={colors.success} bg="rgba(93,202,165,0.12)" value="8" unit="ans" label="D’expérience" />
        </View>

        {/* Préférences */}
        <SectionTitle title="Préférences de roulage" />
        <View style={styles.prefsCard}>
          {PREFS.map((p) => (
            <View key={p} style={styles.prefChip}>
              <Text style={styles.prefChipTxt}>{p}</Text>
            </View>
          ))}
        </View>

        {/* Badges */}
        <SectionTitle title="Badges · 9 / 24" link="Voir tout →" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesRow}>
          {BADGES.map(({ Icon, name, meta, color, bg, locked }) => (
            <View key={name} style={[styles.badge, locked && { opacity: 0.55 }]}>
              <View style={[styles.badgeIcon, { backgroundColor: bg }]}>
                <Icon size={18} color={color} fill={name === '10K km' ? color : 'transparent'} />
              </View>
              <Text style={styles.badgeName}>{name}</Text>
              <Text style={styles.badgeMeta}>{meta}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.switchBtn}>
          <LinearGradient colors={['#7F77DD', '#5e57b8']} style={StyleSheet.absoluteFill} />
          <Eye size={14} color="#fff" />
          <Text style={styles.switchTxt}>Voir comme un autre</Text>
        </Pressable>
        <Pressable style={styles.editBtn}>
          <Edit3 size={14} color={colors.ink} />
          <Text style={styles.editTxt}>Modifier</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function SectionTitle({ title, link }: { title: string; link?: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {link && <Text style={styles.sectionLink}>{link}</Text>}
    </View>
  );
}

function StatCard({ Icon, tint, bg, value, unit, label }: { Icon: React.ComponentType<any>; tint: string; bg: string; value: string; unit?: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Icon size={14} color={tint} />
      </View>
      <Text style={styles.statValue}>
        {value}
        {unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const PANEL = '#10121A';
const BORDER = '#1A1E28';
const BORDER_SOFT = '#14171F';

const styles = StyleSheet.create({
  previewStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(20,22,38,0.92)', borderBottomWidth: 1, borderBottomColor: 'rgba(127,119,221,0.25)' },
  previewIcon: { width: 28, height: 28, borderRadius: 9, backgroundColor: 'rgba(127,119,221,0.18)', alignItems: 'center', justifyContent: 'center' },
  previewTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink, marginBottom: 1 },
  previewSub: { fontFamily: fonts.mono, fontSize: 10, color: '#7F77DD', letterSpacing: 0.4, textTransform: 'uppercase' },
  previewExit: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 28, paddingHorizontal: 10, backgroundColor: '#08090E', borderWidth: 1, borderColor: BORDER, borderRadius: 8 },
  previewExitTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink },

  hero: { height: 460, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  heroGlyph: { fontSize: 200, fontFamily: fonts.bold, color: 'rgba(255,255,255,0.25)' },
  topnav: { position: 'absolute', top: 12, left: 0, right: 0, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroIconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(8,9,14,0.65)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  pagDots: { position: 'absolute', top: 62, left: 16, right: 16, flexDirection: 'row', gap: 4 },
  pagDot: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2 },
  pagDotActive: { backgroundColor: '#fff' },

  identity: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 56 },
  identityTags: { flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  tagMini: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(8,9,14,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 6 },
  tagOnline: { backgroundColor: 'rgba(93,202,165,0.18)', borderColor: 'rgba(93,202,165,0.4)' },
  onlineDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.success },
  tagMiniTxt: { fontFamily: fonts.mono, fontSize: 10, color: '#E8EBF2', textTransform: 'uppercase', letterSpacing: 0.4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  identityName: { fontFamily: fonts.bold, fontSize: 30, color: '#fff' },
  identityAge: { fontFamily: fonts.mono, fontSize: 24, color: 'rgba(255,255,255,0.7)' },
  verifiedBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  identityHandle: { fontFamily: fonts.mono, fontSize: 13, color: 'rgba(255,255,255,0.7)' },

  scoreCard: { marginTop: -40, marginHorizontal: 16, marginBottom: 18, padding: 14, paddingHorizontal: 16, backgroundColor: PANEL, borderWidth: 1, borderColor: 'rgba(127,119,221,0.3)', borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  scoreCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 5, borderColor: '#7F77DD', alignItems: 'center', justifyContent: 'center' },
  scorePct: { fontFamily: fonts.monoBold, fontSize: 14, color: colors.ink },
  scoreTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.inkDim, marginBottom: 2 },
  scoreDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
  scoreStrong: { fontFamily: fonts.semibold, color: '#7F77DD' },

  sectionTitleRow: { paddingHorizontal: 16, paddingBottom: 12, marginTop: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  sectionLink: { fontFamily: fonts.mono, fontSize: 12, color: colors.neon },

  bioCard: { marginHorizontal: 16, padding: 14, paddingHorizontal: 16, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 14 },
  bioText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: '#E8EBF2' },
  bioStrong: { fontFamily: fonts.semibold, color: colors.ink },

  motoCard: { marginHorizontal: 16, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 18, overflow: 'hidden' },
  motoHero: { height: 130, alignItems: 'center', justifyContent: 'center' },
  motoEmoji: { fontSize: 70 },
  motoPill: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(8,9,14,0.85)', borderWidth: 1, borderColor: BORDER, borderRadius: 999 },
  motoPillTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.success, letterSpacing: 0.6, textTransform: 'uppercase' },
  motoInfo: { padding: 14, paddingHorizontal: 16 },
  motoName: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink, marginBottom: 2 },
  motoModel: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkMute, marginBottom: 12 },
  motoSpecs: { flexDirection: 'row', paddingTop: 12, borderTopWidth: 1, borderTopColor: BORDER },
  spec: { flex: 1, alignItems: 'center' },
  specBorder: { borderRightWidth: 1, borderRightColor: BORDER },
  specLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  specValue: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.ink },
  specUnit: { fontFamily: fonts.regular, fontSize: 9, color: colors.inkMute },

  statsGrid: { flexDirection: 'row', marginHorizontal: 16, gap: 8 },
  statCard: { flex: 1, paddingVertical: 14, paddingHorizontal: 10, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 14, alignItems: 'center' },
  statIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontFamily: fonts.monoBold, fontSize: 18, color: colors.ink, marginBottom: 3 },
  statUnit: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute },
  statLabel: { fontFamily: fonts.regular, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5 },

  prefsCard: { marginHorizontal: 16, padding: 14, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  prefChip: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#08090E', borderWidth: 1, borderColor: BORDER_SOFT, borderRadius: 8 },
  prefChipTxt: { fontFamily: fonts.medium, fontSize: 11, color: '#E8EBF2' },

  badgesRow: { paddingHorizontal: 16, gap: 8 },
  badge: { width: 96, paddingTop: 12, paddingBottom: 10, paddingHorizontal: 8, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 14, alignItems: 'center' },
  badgeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  badgeName: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink, marginBottom: 2 },
  badgeMeta: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 30, backgroundColor: 'rgba(8,9,14,0.96)', borderTopWidth: 1, borderTopColor: BORDER, flexDirection: 'row', gap: 10 },
  switchBtn: { flex: 1, height: 50, borderRadius: 14, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  switchTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  editBtn: { flex: 1, height: 50, borderRadius: 14, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  editTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
});
