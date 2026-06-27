import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Layers,
  Volume2,
  AlertTriangle,
  Clock,
  Square,
  Navigation,
} from 'lucide-react-native';
import { MapBackground, Avatar } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

/**
 * GPS Live — navigation turn-by-turn + communauté motards.
 * Localisé Paris : Vallée de Chevreuse (D906), zone de contrôle A6a.
 */
export default function GpsScreen() {
  const router = useRouter();

  const riders = [
    { top: '24%', left: '16%' },
    { top: '60%', left: '74%' },
    { top: '40%', left: '30%' },
  ];

  return (
    <View style={styles.root}>
      <MapBackground />

      {/* Route néon (simplifiée : trait statique) */}
      <View pointerEvents="none" style={styles.routeGlow} />

      {/* Riders autour */}
      {riders.map((r, i) => (
        <View key={i} style={[styles.rider, { top: r.top as any, left: r.left as any }]}>
          <Avatar size={30} ring>
            <Navigation size={13} color="#fff" />
          </Avatar>
        </View>
      ))}

      {/* Ma position (pulse GPS) */}
      <View style={styles.mePin}>
        <View style={styles.meHalo} />
        <View style={styles.meCore} />
      </View>

      {/* ── Panneau navigation (haut) ── */}
      <View style={styles.navPanel}>
        <View style={styles.navTop}>
          <LinearGradient colors={[colors.neon, '#2563eb']} style={styles.arrowSquare}>
            <ArrowRight size={28} color="#fff" strokeWidth={3} />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.navLabel}>Tournez à droite dans</Text>
            <Text style={styles.navDist}>320 m</Text>
            <Text style={styles.navRoad}>D906 — Vallée de Chevreuse</Text>
          </View>
          <View style={styles.speedPill}>
            <Text style={styles.speedNum}>98</Text>
            <Text style={styles.speedLbl}>km/h</Text>
          </View>
        </View>
        <View style={styles.community}>
          <View style={styles.row}>
            <View style={styles.liveDot} />
            <Text style={styles.communityTxt}>5 motards autour de vous</Text>
          </View>
          <Text style={styles.communityCount}>+ 12 sur la route</Text>
        </View>
      </View>

      {/* ── Alerte zone de contrôle ── */}
      <View style={styles.alert}>
        <AlertTriangle size={26} color={colors.dangerSoft} />
        <View style={{ flex: 1 }}>
          <Text style={styles.alertTtl}>Zone de contrôle</Text>
          <Text style={styles.alertDesc}>Sur votre route — A6a sud · 110 km/h</Text>
        </View>
        <Text style={styles.alertDist}>2,4 km</Text>
      </View>

      {/* ── Actions latérales ── */}
      <View style={styles.sideActions}>
        <SideBtn>
          <Layers size={20} color={colors.ink} />
        </SideBtn>
        <SideBtn>
          <Volume2 size={20} color={colors.ink} />
        </SideBtn>
      </View>

      {/* ── Panneau croisements récents ── */}
      <View style={styles.crossings}>
        <View style={styles.cpHeader}>
          <Clock size={12} color={colors.purple} />
          <Text style={styles.cpTitle}>Croisements récents</Text>
          <View style={styles.cpCount}>
            <Text style={styles.cpCountTxt}>12</Text>
          </View>
        </View>
        {[
          { name: 'Léa, 28', meta: 'D906 · il y a 5h' },
          { name: 'Marc K.', meta: 'A6a · il y a 2 j' },
          { name: 'Sarah B.', meta: 'N118 · il y a 3 j' },
        ].map((c) => (
          <View key={c.name} style={styles.cpItem}>
            <Avatar size={22} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cpName} numberOfLines={1}>
                {c.name}
              </Text>
              <Text style={styles.cpMeta}>{c.meta}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.cpLink}>Voir tout l'historique →</Text>
      </View>

      {/* ── Panneau trajet (bas) ── */}
      <View style={styles.trip}>
        <View style={styles.statsRow}>
          <Stat value="19:23" label="Arrivée" eta />
          <View style={styles.tripDivider} />
          <Stat value="42 min" label="Durée" />
          <View style={styles.tripDivider} />
          <Stat value="68 km" label="Restant" />
          <Pressable onPress={() => router.back()} style={styles.stopBtn}>
            <Square size={16} color="#fff" fill="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function SideBtn({ children }: { children: React.ReactNode }) {
  return <Pressable style={styles.sideBtn}>{children}</Pressable>;
}

function Stat({ value, label, eta }: { value: string; label: string; eta?: boolean }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={[styles.statNum, eta && { color: colors.successText }]}>{value}</Text>
      <Text style={styles.statLbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  routeGlow: {
    position: 'absolute',
    left: '48%',
    top: '30%',
    width: 6,
    height: '32%',
    borderRadius: 4,
    backgroundColor: colors.neon,
    opacity: 0.5,
    ...shadow.neon,
  },
  rider: { position: 'absolute' },
  mePin: { position: 'absolute', left: '50%', top: '58%', width: 36, height: 36, marginLeft: -18, alignItems: 'center', justifyContent: 'center' },
  meHalo: { position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: colors.neon, opacity: 0.25 },
  meCore: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.neon, borderWidth: 3, borderColor: '#fff', ...shadow.neon },

  navPanel: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(15,26,46,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.28)',
    borderRadius: radius.xl,
    padding: 18,
    ...shadow.card,
  },
  navTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  arrowSquare: { width: 56, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', ...shadow.neon },
  navLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 2 },
  navDist: { fontFamily: fonts.monoBold, fontSize: 30, color: colors.ink, marginBottom: 2 },
  navRoad: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink },
  speedPill: { backgroundColor: 'rgba(77,143,255,0.15)', borderWidth: 1, borderColor: colors.neon, borderRadius: radius.sm, paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center' },
  speedNum: { fontFamily: fonts.monoBold, fontSize: 16, color: colors.neonBright },
  speedLbl: { fontFamily: fonts.regular, fontSize: 9, color: colors.neonBright, textTransform: 'uppercase' },
  community: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  communityTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  communityCount: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.neonBright },

  alert: {
    position: 'absolute',
    top: 215,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(40,16,16,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,100,100,0.4)',
    borderRadius: radius.lg,
    padding: 12,
  },
  alertTtl: { fontFamily: fonts.bold, fontSize: 12, color: colors.dangerSoft, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  alertDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink },
  alertDist: { fontFamily: fonts.monoBold, fontSize: 16, color: colors.dangerSoft },

  sideActions: { position: 'absolute', right: 14, top: '44%', gap: 10 },
  sideBtn: { width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: 'rgba(77,143,255,0.2)', alignItems: 'center', justifyContent: 'center', ...shadow.card },

  crossings: {
    position: 'absolute',
    left: 14,
    bottom: 150,
    width: 184,
    backgroundColor: colors.panelDeep,
    borderWidth: 1,
    borderColor: 'rgba(184,132,230,0.25)',
    borderRadius: radius.lg,
    padding: 12,
    ...shadow.card,
  },
  cpHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.line },
  cpTitle: { flex: 1, fontFamily: fonts.monoBold, fontSize: 9, color: colors.purple, textTransform: 'uppercase', letterSpacing: 1 },
  cpCount: { backgroundColor: 'rgba(184,132,230,0.2)', borderRadius: radius.pill, paddingHorizontal: 5, paddingVertical: 1 },
  cpCountTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.purpleLight },
  cpItem: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  cpName: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink },
  cpMeta: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkDim },
  cpLink: { marginTop: 4, textAlign: 'center', fontFamily: fonts.semibold, fontSize: 10, color: colors.purple, paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.line },

  trip: {
    position: 'absolute',
    bottom: 26,
    left: 16,
    right: 16,
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.22)',
    borderRadius: radius.xxl,
    padding: 16,
    backgroundColor: 'rgba(10,14,21,0.6)',
  },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statNum: { fontFamily: fonts.monoBold, fontSize: 22, color: '#fff', marginBottom: 4 },
  statLbl: { fontFamily: fonts.semibold, fontSize: 11, color: '#d8dde6', textTransform: 'uppercase', letterSpacing: 1 },
  tripDivider: { width: 1, height: 30, backgroundColor: colors.line },
  stopBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', ...shadow.neon },
});
