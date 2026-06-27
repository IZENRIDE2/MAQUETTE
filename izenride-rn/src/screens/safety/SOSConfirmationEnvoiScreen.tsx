import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Check,
  Users,
  Clock,
  BadgeCheck,
  Send,
  MapPin,
  Phone,
  Share2,
  X,
} from 'lucide-react-native';
import { MapBackground } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

type Contact = { initials: string; name: string; relation: string; bg: [string, string]; pending?: boolean };

const CONTACTS: Contact[] = [
  { initials: 'ML', name: 'Marie Leroy', relation: 'Conjoint · +33 6 12 ** ** 45', bg: [colors.neon, colors.purple] },
  { initials: 'PD', name: 'Pierre Dubois', relation: 'Frère · +33 6 78 ** ** 32', bg: [colors.warn, '#e89e4a'] },
  { initials: 'ST', name: 'Sophie Tassi', relation: 'Ami(e) · +33 6 23 ** ** 18', bg: [colors.purple, '#5d52c2'] },
  { initials: 'JR', name: 'Jean Rossi', relation: 'Ami(e) · +33 6 45 ** ** 91', bg: [colors.success, '#3fa888'], pending: true },
];

/** SOS confirmation envoi — alerte envoyée + contacts + position live (localisé Paris). */
export default function SOSConfirmationEnvoiScreen() {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#08090e', 'rgba(255,92,122,0.08)', '#08090e']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn}>
          <ChevronLeft size={16} color={colors.ink} />
          <Text style={styles.backTxt}>Retour</Text>
        </Pressable>
        <View style={styles.timestamp}>
          <View style={styles.liveDot} />
          <Text style={styles.elapsed}>00:08</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.shieldRing} />
          <LinearGradient colors={[colors.danger, '#b83836']} style={styles.shield}>
            <Check size={44} color="#fff" strokeWidth={4} />
          </LinearGradient>
        </View>
        <Text style={styles.heroTitle}>Alerte SOS envoyée</Text>
        <Text style={styles.heroSub}>
          Tes contacts d'urgence ont été prévenus.{'\n'}
          <Text style={styles.heroStrong}>Reste calme</Text>, l'aide est en route.
        </Text>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={styles.statLabelRow}>
              <Users size={11} color={colors.success} />
              <Text style={styles.statLabel}>Contacts alertés</Text>
            </View>
            <Text style={styles.statValue}>
              3 <Text style={styles.statUnit}>/ 4</Text>
            </Text>
          </View>
          <View style={styles.statSep} />
          <View style={styles.statItem}>
            <View style={styles.statLabelRow}>
              <Clock size={11} color={colors.success} />
              <Text style={styles.statLabel}>Délai d'envoi</Text>
            </View>
            <Text style={styles.statValue}>
              2 <Text style={styles.statUnit}>sec</Text>
            </Text>
          </View>
        </View>

        {/* Contacts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={[styles.cardTitleIcon, { backgroundColor: 'rgba(74,222,128,0.12)' }]}>
                <BadgeCheck size={11} color={colors.success} />
              </View>
              <Text style={styles.cardTitle}>Contacts d'urgence</Text>
            </View>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeTxt}>3 reçus</Text>
            </View>
          </View>

          {CONTACTS.map((c, i) => (
            <View key={c.initials} style={[styles.contactRow, i === CONTACTS.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <LinearGradient colors={c.bg} style={styles.avatar}>
                <Text style={styles.avatarTxt}>{c.initials}</Text>
                <View style={[styles.avatarStatus, c.pending && { backgroundColor: colors.warn }]} />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName} numberOfLines={1}>{c.name}</Text>
                <Text style={styles.contactRelation}>{c.relation}</Text>
              </View>
              <View style={styles.contactStatus}>
                {c.pending ? (
                  <>
                    <Send size={12} color={colors.warn} />
                    <Text style={[styles.contactStatusTxt, { color: colors.warn }]}>Envoyé</Text>
                  </>
                ) : (
                  <>
                    <Check size={12} color={colors.success} strokeWidth={3} />
                    <Text style={styles.contactStatusTxt}>Lu</Text>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Position live */}
        <View style={styles.card}>
          <View style={[styles.cardHeader, { marginBottom: 12 }]}>
            <View style={styles.cardTitleRow}>
              <View style={[styles.cardTitleIcon, { backgroundColor: 'rgba(77,143,255,0.12)' }]}>
                <MapPin size={11} color={colors.neon} />
              </View>
              <Text style={styles.cardTitle}>Position en direct</Text>
            </View>
            <View style={[styles.cardBadge, { backgroundColor: 'rgba(77,143,255,0.12)' }]}>
              <Text style={[styles.cardBadgeTxt, { color: colors.neon }]}>LIVE</Text>
            </View>
          </View>

          <View style={styles.map}>
            <MapBackground />
            <View style={styles.pin}>
              <View style={styles.pinHalo} />
              <View style={styles.pinDot} />
            </View>
          </View>

          <View style={styles.positionInfo}>
            <View style={styles.coordsRow}>
              <Text style={styles.coords}>48.7012° N, 2.0411° E</Text>
              <Text style={styles.accuracy}>± 4m</Text>
            </View>
            <Text style={styles.address}>D906, Vallée de Chevreuse — Île-de-France</Text>
            <View style={styles.shareUpdate}>
              <View style={styles.shareDot} />
              <Text style={styles.shareTxt}>Mise à jour il y a 3 secondes</Text>
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <Pressable style={styles.actionPill}>
            <View style={[styles.actionPillIcon, { backgroundColor: 'rgba(255,92,122,0.15)' }]}>
              <Phone size={18} color={colors.danger} />
            </View>
            <Text style={styles.actionPillTxt}>Appeler 112</Text>
          </Pressable>
          <Pressable style={styles.actionPill}>
            <View style={[styles.actionPillIcon, { backgroundColor: 'rgba(77,143,255,0.15)' }]}>
              <Share2 size={18} color={colors.neon} />
            </View>
            <Text style={styles.actionPillTxt}>Partager</Text>
          </Pressable>
          <Pressable style={styles.actionPill}>
            <View style={[styles.actionPillIcon, { backgroundColor: 'rgba(74,222,128,0.15)' }]}>
              <Users size={18} color={colors.success} />
            </View>
            <Text style={styles.actionPillTxt}>Ajouter</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom fixed */}
      <View style={styles.bottomArea}>
        <Pressable style={styles.cancelAlertBtn}>
          <X size={16} color={colors.danger} />
          <Text style={styles.cancelAlertTxt}>Annuler l'alerte</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingTop: 52 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  backTxt: { fontFamily: fonts.medium, fontSize: 14, color: colors.ink },
  timestamp: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.danger },
  elapsed: { fontFamily: fonts.mono, fontSize: 13, color: colors.inkMute },

  scroll: { paddingHorizontal: 16, paddingBottom: 120 },

  hero: { width: 140, height: 140, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 12 },
  shieldRing: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: 'rgba(255,92,122,0.25)' },
  shield: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', ...shadow.neon },
  heroTitle: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, textAlign: 'center', letterSpacing: -0.8, marginBottom: 6 },
  heroSub: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkDim, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  heroStrong: { fontFamily: fonts.semibold, color: colors.ink },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    marginBottom: 12,
  },
  statItem: { flex: 1, padding: 16 },
  statSep: { width: 1, backgroundColor: colors.line, marginVertical: 14 },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  statLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.6 },
  statValue: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink },
  statUnit: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim },

  card: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitleIcon: { width: 18, height: 18, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  cardBadge: { backgroundColor: 'rgba(74,222,128,0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  cardBadgeTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.success },

  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  avatarStatus: { position: 'absolute', bottom: -1, right: -1, width: 13, height: 13, borderRadius: 6.5, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.panel },
  contactName: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  contactRelation: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },
  contactStatus: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  contactStatusTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.success },

  map: { height: 130, borderRadius: radius.sm, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  pin: { alignItems: 'center', justifyContent: 'center' },
  pinHalo: { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,92,122,0.2)' },
  pinDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.danger, borderWidth: 3, borderColor: '#fff' },

  positionInfo: { paddingTop: 14 },
  coordsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  coords: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  accuracy: { fontFamily: fonts.semibold, fontSize: 10, color: colors.success, backgroundColor: 'rgba(74,222,128,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  address: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink, lineHeight: 17 },
  shareUpdate: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  shareDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.neon },
  shareTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.neon },

  quickActions: { flexDirection: 'row', gap: 8 },
  actionPill: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  actionPillIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  actionPillTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink },

  bottomArea: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 34, backgroundColor: colors.bg },
  cancelAlertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,92,122,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,92,122,0.25)',
  },
  cancelAlertTxt: { fontFamily: fonts.bold, fontSize: 15, color: colors.danger },
});
