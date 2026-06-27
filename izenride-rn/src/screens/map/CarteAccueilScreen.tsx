import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, Crosshair, MapPin, Clock } from 'lucide-react-native';
import { MapBackground, BottomTabBar, Avatar } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

/**
 * Carte d'accueil (onglet Map) — riders autour, événements, stations.
 * Localisé Paris : Le Marais · motards en ligne, balade Vallée de Chevreuse.
 */
export default function CarteAccueilScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(0);
  const segs = ['Riders', 'Événements', 'Stations'];

  const pins = [
    { top: '26%', left: '18%', label: 'L', tint: colors.izen },
    { top: '20%', left: '60%', label: 'M', tint: colors.success },
    { top: '42%', left: '42%', label: 'T', tint: colors.warn },
    { top: '54%', left: '16%', label: 'K', tint: colors.izen },
  ];

  return (
    <View style={styles.root}>
      <MapBackground />

      {/* En-tête */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={styles.title}>Autour de toi</Text>
          <Text style={styles.sub}>Le Marais · 7 riders en ligne</Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <Menu size={19} color={colors.ink} />
        </Pressable>
      </View>

      {/* Segmented flottant */}
      <View style={[styles.segFloat, { top: insets.top + 64 }]}>
        {segs.map((s, i) => (
          <Pressable key={s} onPress={() => setTab(i)} style={[styles.segBtn, tab === i && styles.segBtnOn]}>
            <Text style={[styles.segTxt, tab === i && styles.segTxtOn]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      {/* Pins riders */}
      {pins.map((p) => (
        <View key={p.label} style={[styles.pin, { top: p.top as any, left: p.left as any }]}>
          <Avatar size={42} ring label={p.label} style={{ backgroundColor: p.tint }} />
        </View>
      ))}

      {/* Ma position */}
      <View style={styles.mePin}>
        <View style={styles.meHalo} />
        <View style={styles.meCore} />
      </View>

      {/* Bouton recentrage */}
      <Pressable style={[styles.fab, { bottom: insets.bottom + 220 }]}>
        <Crosshair size={20} color={colors.neon} />
      </Pressable>

      {/* Bottom sheet */}
      <View style={[styles.sheet, { bottom: insets.bottom + 78 }]}>
        <View style={styles.grip} />
        <View style={styles.sheetRow}>
          <Avatar size={44} label="L" style={{ borderRadius: radius.md }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.sheetName}>Léa · Z650</Text>
            <View style={styles.metaRow}>
              <MapPin size={12} color={colors.inkDim} />
              <Text style={styles.sheetMeta}>3,8 km · Routier</Text>
            </View>
          </View>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaTxt}>Voir</Text>
          </Pressable>
        </View>
        <View style={[styles.sheetRow, styles.sheetRowTop]}>
          <Avatar size={44} label="B" style={{ borderRadius: radius.md, backgroundColor: colors.success }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.sheetName}>Balade Vallée de Chevreuse</Text>
            <View style={styles.metaRow}>
              <Clock size={12} color={colors.inkDim} />
              <Text style={styles.sheetMeta}>Sam. 09:00 · 12 inscrits</Text>
            </View>
          </View>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaTxt}>Rejoindre</Text>
          </Pressable>
        </View>
      </View>

      <BottomTabBar active="map" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, letterSpacing: -0.4 },
  sub: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, marginTop: 3, letterSpacing: 0.6 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segFloat: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 6,
    padding: 5,
    backgroundColor: 'rgba(10,14,21,0.75)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    zIndex: 9,
  },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  segBtnOn: { backgroundColor: 'rgba(77,143,255,0.16)' },
  segTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },
  segTxtOn: { color: colors.neonBright },

  pin: { position: 'absolute' },
  mePin: { position: 'absolute', left: '50%', top: '62%', width: 36, height: 36, marginLeft: -18, alignItems: 'center', justifyContent: 'center' },
  meHalo: { position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: colors.neon, opacity: 0.25 },
  meCore: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.neon, borderWidth: 3, borderColor: '#fff', ...shadow.neon },

  fab: {
    position: 'absolute',
    right: 20,
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },

  sheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: 'rgba(16,18,26,0.96)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 14,
    ...shadow.card,
  },
  grip: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong, alignSelf: 'center', marginBottom: 12 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sheetRowTop: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line },
  sheetName: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  sheetMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  cta: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(77,143,255,0.14)',
    borderWidth: 1,
    borderColor: colors.neon,
  },
  ctaTxt: { fontFamily: fonts.bold, fontSize: 12, color: colors.neonBright },
});
