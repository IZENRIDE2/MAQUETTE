import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { X, Phone, MapPin } from 'lucide-react-native';
import { colors, fonts, radius, shadow } from '@/theme';

/** Bouton SOS détaillé — compte à rebours d'urgence (localisé Paris/IDF). */
export default function BoutonSOSDetailleScreen() {
  const r = 73;
  const circ = 2 * Math.PI * r;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['rgba(40,16,16,0.6)', '#08090e', 'rgba(40,16,16,0.4)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Bandeau SOS */}
      <View style={styles.banner}>
        <View style={styles.bannerDot} />
        <Text style={styles.bannerTxt}>Mode SOS · Urgence en cours</Text>
        <View style={styles.bannerDot} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Activation automatique</Text>
        <Text style={styles.headerTitle}>SOS</Text>
        <Text style={styles.headerSub}>Une alerte va être envoyée</Text>
      </View>

      {/* Compte à rebours */}
      <View style={styles.countdownWrap}>
        <View style={styles.countdownCircle}>
          <Svg width={160} height={160} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Defs>
              <SvgGradient id="sosGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor={colors.warn} />
                <Stop offset="100%" stopColor={colors.danger} />
              </SvgGradient>
            </Defs>
            <Circle cx={80} cy={80} r={r} fill="none" stroke="rgba(255,92,122,0.12)" strokeWidth={5} />
            <Circle
              cx={80}
              cy={80}
              r={r}
              fill="none"
              stroke="url(#sosGrad)"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={`${circ * 0.75} ${circ}`}
            />
          </Svg>
          <View style={styles.countdownContent}>
            <Text style={styles.countdownNumber}>10</Text>
            <Text style={styles.countdownLabel}>Secondes</Text>
          </View>
        </View>
      </View>

      {/* Statut */}
      <View style={styles.statusInfo}>
        <Text style={styles.statusTitle}>Vous allez bien ?</Text>
        <Text style={styles.statusTxt}>
          Sans action, l'alerte sera envoyée dans <Text style={styles.statusStrong}>10s</Text>. Maintenez appuyé pour annuler.
        </Text>
      </View>

      {/* Annuler */}
      <Pressable style={styles.cancelBtn}>
        <X size={18} color={colors.ink} strokeWidth={2.5} />
        <Text style={styles.cancelTxt}>Je vais bien · Annuler</Text>
      </Pressable>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerTxt}>Ou contacter directement</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={[styles.actionCard, styles.actionEmergency]}>
          <LinearGradient colors={[colors.danger, '#b8362e']} style={styles.actionIcon}>
            <Text style={styles.actionIconTxt}>112</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionLabel, { color: colors.danger }]}>Numéro européen</Text>
            <Text style={styles.actionTitle}>Appeler les secours</Text>
            <Text style={styles.actionDesc}>Pompiers, SAMU, Police — 24/7</Text>
          </View>
          <Phone size={16} color={colors.inkMute} />
        </Pressable>

        <Pressable style={[styles.actionCard, styles.actionContact]}>
          <LinearGradient colors={[colors.neon, '#2d6db1']} style={styles.actionIcon}>
            <Text style={styles.actionIconTxt}>FB</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionLabel, { color: colors.neon }]}>Contact d'urgence</Text>
            <Text style={styles.actionTitle}>Florian Bianchi</Text>
            <Text style={styles.actionDesc}>Frère · 06 12 34 56 78</Text>
          </View>
          <Phone size={16} color={colors.inkMute} />
        </Pressable>
      </View>

      {/* Position partagée */}
      <View style={styles.locationStrip}>
        <View style={styles.locationIcon}>
          <MapPin size={14} color={colors.success} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.locationLabel}>Position partagée</Text>
          <Text style={styles.locationValue}>D906 · Vallée de Chevreuse, Île-de-France</Text>
          <Text style={styles.locationCoords}>48.7012° N · 2.0411° E</Text>
        </View>
        <Text style={styles.locationAccuracy}>±3m</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTxt}>
          Position GPS, profil moto et contact d'urgence transmis aux secours.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingTop: 52 },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,92,122,0.12)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,92,122,0.3)',
  },
  bannerDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.danger },
  bannerTxt: { fontFamily: fonts.bold, fontSize: 10.5, color: colors.danger, textTransform: 'uppercase', letterSpacing: 0.6 },

  header: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  headerLabel: { fontFamily: fonts.bold, fontSize: 9.5, color: colors.danger, textTransform: 'uppercase', letterSpacing: 1.5 },
  headerTitle: { fontFamily: fonts.bold, fontSize: 30, color: colors.ink, letterSpacing: -0.6, marginVertical: 2 },
  headerSub: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim },

  countdownWrap: { alignItems: 'center', paddingVertical: 8 },
  countdownCircle: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
  countdownContent: { position: 'absolute', alignItems: 'center' },
  countdownNumber: { fontFamily: fonts.monoBold, fontSize: 60, color: colors.ink, lineHeight: 62 },
  countdownLabel: { fontFamily: fonts.bold, fontSize: 10, color: colors.danger, textTransform: 'uppercase', letterSpacing: 1.2 },

  statusInfo: { alignItems: 'center', paddingHorizontal: 32, paddingVertical: 6 },
  statusTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  statusTxt: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkDim, textAlign: 'center', lineHeight: 16 },
  statusStrong: { fontFamily: fonts.bold, color: colors.danger },

  cancelBtn: {
    marginHorizontal: 16,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cancelTxt: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },

  actions: { paddingHorizontal: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerTxt: { fontFamily: fonts.bold, fontSize: 9.5, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.2 },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 11,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: 6,
    backgroundColor: colors.panelSoft,
  },
  actionEmergency: { borderColor: 'rgba(255,92,122,0.4)', backgroundColor: 'rgba(255,92,122,0.08)' },
  actionContact: { borderColor: 'rgba(77,143,255,0.3)', backgroundColor: 'rgba(77,143,255,0.06)' },
  actionIcon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  actionIconTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  actionLabel: { fontFamily: fonts.bold, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 1 },
  actionTitle: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.ink, marginBottom: 1 },
  actionDesc: { fontFamily: fonts.medium, fontSize: 10.5, color: colors.inkDim },

  locationStrip: {
    marginHorizontal: 16,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  locationIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(74,222,128,0.15)', alignItems: 'center', justifyContent: 'center' },
  locationLabel: { fontFamily: fonts.bold, fontSize: 9, color: colors.success, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 1 },
  locationValue: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.ink, marginBottom: 1 },
  locationCoords: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.inkMute },
  locationAccuracy: {
    fontFamily: fonts.bold,
    fontSize: 9.5,
    color: colors.success,
    backgroundColor: 'rgba(74,222,128,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.2)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },

  footer: { marginTop: 'auto', paddingHorizontal: 32, paddingVertical: 18 },
  footerTxt: { fontFamily: fonts.medium, fontSize: 10, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 14 },
});
