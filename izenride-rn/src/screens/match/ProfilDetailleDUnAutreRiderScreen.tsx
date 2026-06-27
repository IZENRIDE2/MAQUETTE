import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft, Share2, MoreVertical, Check, MapPin, Bike, Zap, Clock,
  Star, TrendingUp, Users, Shield, Lock, MessageCircle, Heart, AlertTriangle, Ban, ChevronRight,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, shadow } from '@/theme';

const violet = colors.purple;
const gold = colors.warn;

/** Profil détaillé d'un autre rider (localisé Paris / IDF). */
export default function ProfilDetailleDUnAutreRiderScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient colors={[colors.neon, '#1a3a5e', '#0a1428']} style={StyleSheet.absoluteFill} />
          <Text style={styles.heroGlyph}>L</Text>
          <LinearGradient colors={['rgba(8,9,14,0.6)', 'transparent', 'transparent', 'rgba(8,9,14,0.95)']} style={StyleSheet.absoluteFill} />

          {/* Top nav */}
          <View style={styles.topnav}>
            <Pressable style={styles.iconBtn}>
              <ChevronLeft size={18} color={colors.ink} />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable style={styles.iconBtn}>
                <Share2 size={18} color={colors.ink} />
              </Pressable>
              <Pressable style={styles.iconBtn}>
                <MoreVertical size={18} color={colors.ink} />
              </Pressable>
            </View>
          </View>

          {/* Pagination */}
          <View style={styles.pagDots}>
            <View style={[styles.pagDot, styles.pagDotActive]} />
            <View style={styles.pagDot} />
            <View style={styles.pagDot} />
            <View style={styles.pagDot} />
          </View>

          {/* Bannière match */}
          <View style={styles.matchBanner}>
            <View style={styles.blinkDot} />
            <Check size={11} color={colors.success} strokeWidth={2.5} />
            <Text style={styles.matchBannerTxt}>Vous vous êtes croisés · 3 fois</Text>
          </View>

          {/* Identité */}
          <View style={styles.identity}>
            <View style={styles.identityTags}>
              <View style={[styles.tagMini, styles.tagOnline]}>
                <View style={styles.onlineDot} />
                <Text style={[styles.tagMiniTxt, { color: colors.success }]}>En ligne</Text>
              </View>
              <View style={styles.tagMini}>
                <MapPin size={10} color={colors.ink} />
                <Text style={styles.tagMiniTxt}>3 km</Text>
              </View>
              <View style={styles.tagMini}>
                <MapPin size={10} color={colors.ink} />
                <Text style={styles.tagMiniTxt}>Paris</Text>
              </View>
            </View>
            <View style={styles.identityNameRow}>
              <Text style={styles.identityName}>Léa</Text>
              <Text style={styles.identityAge}>28</Text>
              <View style={styles.verifiedBadge}>
                <Check size={12} color="#fff" strokeWidth={2.5} />
              </View>
            </View>
            <Text style={styles.identityHandle}>@lea_rides</Text>
          </View>
        </View>

        {/* Compatibilité */}
        <View style={styles.compatCard}>
          <View style={styles.compatCircle}>
            <Text style={styles.compatPct}>94%</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.compatTitle}>Excellente compatibilité</Text>
            <Text style={styles.compatDesc}>
              Vous partagez <Text style={styles.compatStrong}>5 spots favoris</Text>, le même style de roulage et un niveau confirmé.
            </Text>
          </View>
        </View>

        {/* Bio */}
        <SectionTitle title="À propos" />
        <View style={styles.bioCard}>
          <Text style={styles.bioTxt}>
            Photographe le jour, motarde le week-end. <Text style={styles.bioStrong}>Toujours partante pour découvrir de nouvelles forêts</Text> en petit groupe ou en solo. Préférence pour les routes sinueuses, les pauses café et les arrêts photo. Évite l'autoroute autant que possible.
          </Text>
        </View>

        {/* Moto */}
        <SectionTitle title="Sa moto" link="3 photos →" />
        <View style={styles.motoCard}>
          <View style={styles.motoHero}>
            <Text style={styles.motoPill}>ROADSTER · SPORT</Text>
            <Text style={styles.motoEmoji}>🏍️</Text>
          </View>
          <View style={styles.motoInfo}>
            <Text style={styles.motoName}>Yamaha MT-09</Text>
            <Text style={styles.motoModel}>SP · 2023 · Bleu Icon</Text>
            <View style={styles.motoSpecs}>
              <Spec label="Cylindrée" value="890" unit="cc" />
              <Spec label="Puissance" value="119" unit="ch" />
              <Spec label="Poids" value="189" unit="kg" />
              <Spec label="Permis" value="A2+" last />
            </View>
          </View>
        </View>

        {/* Stats */}
        <SectionTitle title="Stats de roulage" link="2025 →" />
        <View style={styles.statsGrid}>
          <StatCard icon={<MapPin size={14} color={colors.neon} />} iconBg="rgba(77,143,255,0.12)" value="8 240" unit="km" label="Cette année" />
          <StatCard icon={<Zap size={14} color={violet} />} iconBg="rgba(184,132,230,0.12)" value="Confirmée" label="Niveau" />
          <StatCard icon={<Clock size={14} color={colors.success} />} iconBg="rgba(74,222,128,0.12)" value="5" unit="ans" label="D'expérience" />
        </View>

        {/* Préférences */}
        <SectionTitle title="Préférences de roulage" />
        <View style={styles.prefsCard}>
          <PrefChip label="Forêts & boucles" match />
          <PrefChip label="Petits groupes (2-5)" match />
          <PrefChip label="Routes sinueuses" match />
          <PrefChip label="Pauses photo" />
          <PrefChip label="Sorties dimanche" />
          <PrefChip label="Café au sommet" />
          <PrefChip label="Évite l'autoroute" />
        </View>

        {/* Badges */}
        <SectionTitle title="Badges · 7 / 24" link="Voir tout →" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesRow}>
          <Badge icon={<Star size={18} color={gold} fill={gold} />} iconBg="rgba(232,181,71,0.18)" name="10K km" meta="Légende" />
          <Badge icon={<TrendingUp size={18} color={violet} />} iconBg="rgba(184,132,230,0.18)" name="Forêts" meta="15 spots" />
          <Badge icon={<Shield size={18} color={colors.success} />} iconBg="rgba(74,222,128,0.18)" name="ZEN" meta="98 % score" />
          <Badge icon={<Users size={18} color={colors.neon} />} iconBg="rgba(77,143,255,0.18)" name="Groupe" meta="42 sorties" />
          <Badge icon={<Lock size={18} color={colors.inkMute} />} iconBg={colors.line} name="100K" meta="verrouillé" locked />
        </ScrollView>

        {/* Spots */}
        <SectionTitle title="Lieux en commun · 5" link="Tout voir →" />
        <View style={styles.spotsList}>
          <SpotRow name="Forêt de Fontainebleau" place="Fontainebleau" dist="32 km" />
          <SpotRow name="Vallée de Chevreuse" place="D906" dist="14 km" />
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: 16, marginTop: 22 }}>
          <View style={styles.actionsList}>
            <View style={styles.actionRow}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(251,191,36,0.12)' }]}>
                <AlertTriangle size={13} color={gold} />
              </View>
              <Text style={styles.actionText}>Signaler ce profil</Text>
              <ChevronRight size={14} color={colors.inkMute} />
            </View>
            <View style={[styles.actionRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,92,122,0.1)' }]}>
                <Ban size={13} color={colors.danger} />
              </View>
              <Text style={[styles.actionText, { color: colors.danger }]}>Bloquer Léa</Text>
              <ChevronRight size={14} color={colors.inkMute} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.rideBtn}>
          <Bike size={18} color={colors.ink} />
        </Pressable>
        <Pressable style={styles.msgBtn}>
          <MessageCircle size={14} color={colors.ink} />
          <Text style={styles.msgTxt}>Message</Text>
        </Pressable>
        <Pressable>
          <LinearGradient colors={[colors.danger, '#c43d3c']} style={styles.likeBtn}>
            <Heart size={16} color="#fff" fill="#fff" />
            <Text style={styles.likeTxt}>Liker Léa</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

function SectionTitle({ title, link }: { title: string; link?: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {link ? <Text style={styles.sectionLink}>{link}</Text> : null}
    </View>
  );
}

function Spec({ label, value, unit, last }: { label: string; value: string; unit?: string; last?: boolean }) {
  return (
    <View style={[styles.spec, !last && styles.specBorder]}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>
        {value}{unit ? <Text style={styles.specUnit}>{unit}</Text> : null}
      </Text>
    </View>
  );
}

function StatCard({ icon, iconBg, value, unit, label }: { icon: React.ReactNode; iconBg: string; value: string; unit?: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.statValue}>
        {value}{unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function PrefChip({ label, match }: { label: string; match?: boolean }) {
  return (
    <View style={[styles.prefChip, match && styles.prefChipMatch]}>
      {match ? <Check size={10} color={colors.success} strokeWidth={2.5} /> : null}
      <Text style={[styles.prefTxt, match && { color: colors.success }]}>{label}</Text>
    </View>
  );
}

function Badge({ icon, iconBg, name, meta, locked }: { icon: React.ReactNode; iconBg: string; name: string; meta: string; locked?: boolean }) {
  return (
    <View style={[styles.badge, locked && { opacity: 0.55 }]}>
      <View style={[styles.badgeIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.badgeName}>{name}</Text>
      <Text style={styles.badgeMeta}>{meta}</Text>
    </View>
  );
}

function SpotRow({ name, place, dist }: { name: string; place: string; dist: string }) {
  return (
    <View style={styles.spotRow}>
      <View style={styles.spotIcon}>
        <TrendingUp size={16} color={violet} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.spotName}>{name}</Text>
        <View style={styles.spotMeta}>
          <Text style={styles.spotMetaTxt}>{place}</Text>
          <View style={styles.spotMetaDot} />
          <Text style={styles.spotMetaTxt}>{dist}</Text>
        </View>
      </View>
      <View style={styles.spotShared}>
        <Check size={9} color={colors.success} strokeWidth={2.5} />
        <Text style={styles.spotSharedTxt}>Match</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 460, position: 'relative', overflow: 'hidden' },
  heroGlyph: { position: 'absolute', alignSelf: 'center', top: 100, fontFamily: fonts.bold, fontSize: 200, color: 'rgba(255,255,255,0.25)' },
  topnav: { position: 'absolute', top: 12, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(8,9,14,0.65)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  pagDots: { position: 'absolute', top: 62, left: 16, right: 16, flexDirection: 'row', gap: 4 },
  pagDot: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2 },
  pagDotActive: { backgroundColor: colors.ink },
  matchBanner: { position: 'absolute', top: 82, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(8,9,14,0.85)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.4)', borderRadius: 999 },
  blinkDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  matchBannerTxt: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.success },
  identity: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingBottom: 70 },
  identityTags: { flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  tagMini: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(8,9,14,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 6 },
  tagOnline: { backgroundColor: 'rgba(74,222,128,0.18)', borderColor: 'rgba(74,222,128,0.4)' },
  onlineDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.success },
  tagMiniTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.5 },
  identityNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  identityName: { fontFamily: fonts.bold, fontSize: 30, color: colors.ink },
  identityAge: { fontFamily: fonts.mono, fontSize: 24, color: 'rgba(255,255,255,0.7)' },
  verifiedBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  identityHandle: { fontFamily: fonts.mono, fontSize: 13, color: 'rgba(255,255,255,0.7)' },

  compatCard: { marginHorizontal: 16, marginTop: -50, padding: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 14, ...shadow.card },
  compatCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 5, borderColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  compatPct: { fontFamily: fonts.monoBold, fontSize: 16, color: colors.ink },
  compatTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  compatDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
  compatStrong: { fontFamily: fonts.semibold, color: colors.success },

  sectionTitleRow: { paddingHorizontal: 16, paddingBottom: 12, marginTop: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  sectionLink: { fontFamily: fonts.mono, fontSize: 12, color: colors.neon },

  bioCard: { marginHorizontal: 16, padding: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 14 },
  bioTxt: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 20 },
  bioStrong: { fontFamily: fonts.semibold, color: colors.ink },

  motoCard: { marginHorizontal: 16, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 18, overflow: 'hidden' },
  motoHero: { height: 130, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0d14' },
  motoPill: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(8,9,14,0.85)', borderWidth: 1, borderColor: colors.line, borderRadius: 999, fontFamily: fonts.mono, fontSize: 10, color: colors.neon, letterSpacing: 0.6 },
  motoEmoji: { fontSize: 70 },
  motoInfo: { padding: 14 },
  motoName: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink, marginBottom: 2 },
  motoModel: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkMute, marginBottom: 12 },
  motoSpecs: { flexDirection: 'row', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line },
  spec: { flex: 1, alignItems: 'center' },
  specBorder: { borderRightWidth: 1, borderRightColor: colors.line },
  specLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  specValue: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.ink },
  specUnit: { fontFamily: fonts.regular, fontSize: 9, color: colors.inkMute },

  statsGrid: { marginHorizontal: 16, flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, paddingVertical: 14, paddingHorizontal: 10, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 14, alignItems: 'center' },
  statIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontFamily: fonts.monoBold, fontSize: 16, color: colors.ink, marginBottom: 3 },
  statUnit: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute },
  statLabel: { fontFamily: fonts.regular, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5 },

  prefsCard: { marginHorizontal: 16, padding: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  prefChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, borderRadius: 8 },
  prefChipMatch: { backgroundColor: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.25)' },
  prefTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim },

  badgesRow: { paddingHorizontal: 16, gap: 8 },
  badge: { width: 96, paddingTop: 12, paddingBottom: 10, paddingHorizontal: 8, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 14, alignItems: 'center' },
  badgeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  badgeName: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink, marginBottom: 2 },
  badgeMeta: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  spotsList: { marginHorizontal: 16, gap: 8 },
  spotRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12 },
  spotIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(184,132,230,0.12)', alignItems: 'center', justifyContent: 'center' },
  spotName: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  spotMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  spotMetaTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  spotMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.lineStrong },
  spotShared: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(74,222,128,0.12)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: 6 },
  spotSharedTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.success, textTransform: 'uppercase', letterSpacing: 0.5 },

  actionsList: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 14, overflow: 'hidden' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderBottomWidth: 1, borderBottomColor: colors.line },
  actionIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actionText: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim },

  bottomBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, backgroundColor: 'rgba(8,9,14,0.96)', borderTopWidth: 1, borderTopColor: colors.line },
  rideBtn: { width: 50, height: 50, borderRadius: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  msgBtn: { flex: 1, height: 50, borderRadius: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  msgTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  likeBtn: { flex: 1, minWidth: 150, height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.card },
  likeTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
