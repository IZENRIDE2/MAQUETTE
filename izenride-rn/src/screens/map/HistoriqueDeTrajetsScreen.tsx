import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  MoreVertical,
  MapPin,
  Clock,
  Zap,
  ChevronUp,
  Calendar,
  User,
  Users,
  Star,
  Check,
  AlertTriangle,
  Map as MapIcon,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

/**
 * Historique de trajets — récap mensuel + liste de trajets datés.
 * Localisé Paris / Île-de-France (Chevreuse, Fontainebleau, Périphérique).
 */
export default function HistoriqueDeTrajetsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState(0);

  const filters = [
    { label: 'Tous', count: '42' },
    { label: 'Solo', count: '28' },
    { label: 'Groupe', count: '11' },
    { label: 'Événements', count: '3' },
    { label: '⭐ Favoris', count: null },
  ];

  const trips = [
    {
      section: 'Cette semaine',
      title: 'Paris → Vallée de Chevreuse',
      time: "Aujourd'hui · 14:22",
      from: 'Le Marais',
      to: 'Chevreuse',
      dist: '68',
      dur: '1h12',
      speed: '76',
      tag: 'Solo',
      tagIcon: User,
      tagTint: colors.neon,
      fav: true,
      extras: [
        { label: '2 alertes virage', tint: colors.warn, icon: AlertTriangle },
        { label: 'ZEN actif', tint: colors.success, icon: Check },
      ],
    },
    {
      section: 'Cette semaine',
      title: 'Boucle Fontainebleau',
      time: 'Dim. 21/06 · 09:30',
      from: 'Paris 12e',
      to: 'Fontainebleau',
      dist: '142',
      dur: '3h04',
      speed: '68',
      tag: 'Groupe · 5',
      tagIcon: Users,
      tagTint: colors.purple,
      fav: false,
      extras: [
        { label: '5 motards', tint: colors.purple, icon: Users },
        { label: 'ZEN actif', tint: colors.success, icon: Check },
      ],
    },
    {
      section: 'Semaine dernière',
      title: 'Vexin français · 1 jour',
      time: 'Sam. 13/06 · 07:15',
      from: 'Paris · Pontoise',
      to: 'Vétheuil',
      dist: '287',
      dur: '5h48',
      speed: '52',
      tag: 'Event · Vexin',
      tagIcon: Calendar,
      tagTint: colors.warn,
      fav: true,
      extras: [
        { label: '12 participants', tint: colors.purple, icon: Users },
        { label: '3 arrêts', tint: colors.inkDim, icon: MapPin },
        { label: 'ZEN actif', tint: colors.success, icon: Check },
      ],
    },
    {
      section: 'Semaine dernière',
      title: 'Aller au boulot · Paris',
      time: 'Ven. 12/06 · 08:05',
      from: 'Boulogne-Billancourt',
      to: 'Paris Centre',
      dist: '32',
      dur: '38 min',
      speed: '51',
      tag: 'Solo',
      tagIcon: User,
      tagTint: colors.neon,
      fav: false,
      extras: [],
    },
  ];

  const sections = ['Cette semaine', 'Semaine dernière'];

  return (
    <View style={styles.root}>
      <Screen pad={0} contentStyle={{ paddingBottom: 40 }} edges={['top', 'bottom']}>
        {/* Top nav */}
        <View style={styles.topnav}>
          <Pressable style={styles.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={18} color={colors.ink} />
          </Pressable>
          <Text style={styles.topTitle}>Historique</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable style={styles.iconBtn}>
              <Search size={18} color={colors.ink} />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <MoreVertical size={18} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mes trajets</Text>
          <Text style={styles.headerSub}>42 trajets enregistrés · 1 247 km parcourus</Text>
        </View>

        {/* Stats globales */}
        <View style={styles.statsCard}>
          <View style={styles.statsHead}>
            <Text style={styles.statsLabel}>Récap mensuel</Text>
            <View style={styles.periodPill}>
              <Calendar size={10} color={colors.neon} />
              <Text style={styles.periodPillTxt}>Juin 2026</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <Stat icon={MapPin} tint={colors.neon} value="412" unit="km" name="Distance" trend="+18%" />
            <Stat icon={Clock} tint={colors.success} value="8h" unit="42" name="Temps total" trend="+12%" />
            <Stat icon={Zap} tint={colors.purple} value="73" unit="km/h" name="Moy." trend="+3 km/h" />
          </View>
        </View>

        {/* Filtres */}
        <View style={styles.filters}>
          {filters.map((f, i) => (
            <Pressable key={f.label} onPress={() => setFilter(i)} style={[styles.filterPill, filter === i && styles.filterPillOn]}>
              <Text style={[styles.filterTxt, filter === i && styles.filterTxtOn]}>{f.label}</Text>
              {f.count ? (
                <View style={[styles.filterCount, filter === i && styles.filterCountOn]}>
                  <Text style={[styles.filterCountTxt, filter === i && { color: colors.bg }]}>{f.count}</Text>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>

        {/* Sections datées */}
        {sections.map((sec) => (
          <View key={sec} style={styles.dateSection}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateHeaderTxt}>{sec}</Text>
              <View style={styles.dateLine} />
            </View>
            {trips
              .filter((t) => t.section === sec)
              .map((t) => {
                const TagIcon = t.tagIcon;
                return (
                  <View key={t.title} style={styles.tripCard}>
                    {/* Mini map preview */}
                    <View style={styles.tripMap}>
                      <View style={[styles.tripTag, { borderColor: `${t.tagTint}55` }]}>
                        <TagIcon size={9} color={t.tagTint} />
                        <Text style={[styles.tripTagTxt, { color: t.tagTint }]}>{t.tag}</Text>
                      </View>
                      <View style={styles.tripFav}>
                        <Star size={11} color={t.fav ? colors.warn : colors.ink} fill={t.fav ? colors.warn : 'none'} />
                      </View>
                      <MapIcon size={28} color={`${t.tagTint}66`} />
                    </View>

                    {/* Body */}
                    <View style={styles.tripBody}>
                      <View style={styles.tripTitleRow}>
                        <Text style={styles.tripTitle} numberOfLines={1}>
                          {t.title}
                        </Text>
                        <Text style={styles.tripTime}>{t.time}</Text>
                      </View>

                      <View style={styles.tripRoute}>
                        <View style={[styles.routeDot, { backgroundColor: colors.success }]} />
                        <Text style={styles.routeText} numberOfLines={1}>
                          {t.from}
                        </Text>
                        <View style={styles.routeLine} />
                        <Text style={styles.routeText} numberOfLines={1}>
                          {t.to}
                        </Text>
                        <View style={[styles.routeDot, { backgroundColor: colors.danger }]} />
                      </View>

                      <View style={styles.tripStats}>
                        <TripStat label="Distance" value={t.dist} unit="km" />
                        <View style={styles.tripStatDiv} />
                        <TripStat label="Durée" value={t.dur} />
                        <View style={styles.tripStatDiv} />
                        <TripStat label="Vitesse moy." value={t.speed} unit="km/h" />
                      </View>

                      {t.extras.length ? (
                        <View style={styles.tripExtra}>
                          {t.extras.map((e) => {
                            const EIcon = e.icon;
                            return (
                              <View key={e.label} style={[styles.extraTag, { borderColor: `${e.tint}55` }]}>
                                <EIcon size={9} color={e.tint} />
                                <Text style={[styles.extraTagTxt, { color: e.tint }]}>{e.label}</Text>
                              </View>
                            );
                          })}
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })}
          </View>
        ))}
      </Screen>

      {/* FAB voir sur carte */}
      <Pressable style={[styles.fab, { bottom: insets.bottom + 24 }]}>
        <MapIcon size={14} color="#fff" />
        <Text style={styles.fabTxt}>Voir sur carte</Text>
      </Pressable>
    </View>
  );
}

function Stat({ icon: Icon, tint, value, unit, name, trend }: { icon: any; tint: string; value: string; unit: string; name: string; trend: string }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.statIcon, { backgroundColor: `${tint}26` }]}>
        <Icon size={14} color={tint} />
      </View>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statUnit}>{unit}</Text>
      </Text>
      <Text style={styles.statName}>{name}</Text>
      <View style={styles.statTrend}>
        <ChevronUp size={9} color={colors.success} strokeWidth={2.5} />
        <Text style={styles.statTrendTxt}>{trend}</Text>
      </View>
    </View>
  );
}

function TripStat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.tripStatLabel}>{label}</Text>
      <Text style={styles.tripStatValue}>
        {value}
        {unit ? <Text style={styles.tripStatUnit}>{unit}</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topnav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.8 },

  header: { paddingHorizontal: 16, paddingBottom: 18 },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, letterSpacing: -0.5, marginBottom: 4 },
  headerSub: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim },

  statsCard: { marginHorizontal: 16, marginBottom: 18, padding: 18, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg },
  statsHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statsLabel: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 1 },
  periodPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(77,143,255,0.15)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderRadius: radius.pill },
  periodPillTxt: { fontFamily: fonts.semibold, fontSize: 10, color: colors.neonBright },
  statsRow: { flexDirection: 'row', gap: 10 },
  statIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontFamily: fonts.monoBold, fontSize: 22, color: colors.ink, letterSpacing: -0.4, marginBottom: 3 },
  statUnit: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim },
  statName: { fontFamily: fonts.medium, fontSize: 10, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.6 },
  statTrend: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  statTrendTxt: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.success },

  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, paddingBottom: 14 },
  filterPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill },
  filterPillOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim },
  filterTxtOn: { color: colors.bg, fontFamily: fonts.semibold },
  filterCount: { paddingHorizontal: 5, borderRadius: 4, backgroundColor: 'rgba(77,143,255,0.15)' },
  filterCountOn: { backgroundColor: 'rgba(10,14,21,0.15)' },
  filterCountTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.neonBright },

  dateSection: { paddingHorizontal: 16 },
  dateHeader: { flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 12 },
  dateHeaderTxt: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.8 },
  dateLine: { flex: 1, height: 1, backgroundColor: colors.line, marginLeft: 12 },

  tripCard: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, overflow: 'hidden', marginBottom: 10 },
  tripMap: { height: 88, backgroundColor: '#0c1018', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.line },
  tripTag: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(10,14,21,0.85)', borderWidth: 1, borderRadius: 6 },
  tripTagTxt: { fontFamily: fonts.semibold, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.4 },
  tripFav: { position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(10,14,21,0.7)', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  tripBody: { padding: 14 },
  tripTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  tripTitle: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  tripTime: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim },
  tripRoute: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  routeDot: { width: 7, height: 7, borderRadius: 4 },
  routeText: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink, maxWidth: 120 },
  routeLine: { flex: 1, height: 1, backgroundColor: colors.lineStrong },
  tripStats: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm },
  tripStatDiv: { width: 1, height: 24, backgroundColor: colors.line },
  tripStatLabel: { fontFamily: fonts.medium, fontSize: 9, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 },
  tripStatValue: { fontFamily: fonts.monoBold, fontSize: 14, color: colors.ink },
  tripStatUnit: { fontFamily: fonts.regular, fontSize: 9, color: colors.inkDim },
  tripExtra: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  extraTag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: colors.bgDeep, borderWidth: 1, borderRadius: 6 },
  extraTagTxt: { fontFamily: fonts.mono, fontSize: 10 },

  fab: {
    position: 'absolute',
    right: 16,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.neon,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: colors.neon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  fabTxt: { fontFamily: fonts.semibold, fontSize: 13, color: '#fff' },
});
