import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  MoreVertical,
  MessageCircle,
  Plus,
  Ban,
  X,
  RefreshCw,
  Check,
} from 'lucide-react-native';
import { colors, fonts, radius, shadow } from '@/theme';

const CONSEQUENCES = [
  ['Son profil ', "n'apparaîtra plus", ' dans vos suggestions ni sur la carte live'],
  ['Il ', 'ne pourra plus vous envoyer de message', ' ni vous appeler'],
  ['Vos ', 'conversations existantes', ' seront archivées et masquées'],
  ['Il ne pourra plus voir votre profil ni rejoindre vos événements', '', ''],
];

/** Bloquer un utilisateur — feuille de confirmation sur profil (localisé Paris). */
export default function BloquerUnUtilisateurScreen() {
  const [alsoReport, setAlsoReport] = useState(false);

  return (
    <View style={styles.root}>
      {/* Fond : profil utilisateur */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.purple, '#2a1f66']} style={styles.cover} />
        <View style={styles.floatingHeader}>
          <Pressable style={styles.floatBtn}>
            <ChevronLeft size={16} color="#fff" />
          </Pressable>
          <Pressable style={styles.floatBtn}>
            <MoreVertical size={16} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.profileInfo}>
          <LinearGradient colors={[colors.neon, '#2d6db1']} style={styles.profileAvatar}>
            <Text style={styles.profileAvatarTxt}>JD</Text>
          </LinearGradient>
          <View style={styles.nameRow}>
            <Text style={styles.profileName}>Jérémy Dupuis</Text>
            <View style={styles.verifiedBadge}>
              <Check size={9} color={colors.success} strokeWidth={3.5} />
              <Text style={styles.verifiedTxt}>Vérifié</Text>
            </View>
          </View>
          <Text style={styles.profileHandle}>@jeremy_rider · Paris 12e</Text>

          <View style={styles.statsRow}>
            {[
              ['312', 'Trajets'],
              ['87', 'Riders'],
              ['4,8', 'Note'],
            ].map(([v, l]) => (
              <View key={l}>
                <Text style={styles.statValue}>{v}</Text>
                <Text style={styles.statLabel}>{l}</Text>
              </View>
            ))}
          </View>

          <View style={styles.bio}>
            <Text style={styles.bioTxt}>
              🏍️ Yamaha MT-09 — passionné de virages d'Île-de-France depuis 8 ans. Toujours partant pour une sortie le weekend !
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <Pressable style={[styles.actionBtn, styles.actionMsg]}>
              <MessageCircle size={14} color="#fff" />
              <Text style={styles.actionMsgTxt}>Message</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.actionSecondary]}>
              <Plus size={14} color={colors.ink} />
              <Text style={styles.actionSecondaryTxt}>Suivre</Text>
            </Pressable>
          </View>
        </View>
        <View style={{ height: 480 }} />
      </ScrollView>

      {/* Backdrop */}
      <View style={styles.backdrop} pointerEvents="none" />

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.sheetHeader}>
          <View style={styles.sheetIcon}>
            <Ban size={32} color={colors.danger} />
          </View>
          <Text style={styles.sheetTitle}>Bloquer cet utilisateur ?</Text>
          <Text style={styles.sheetSub}>
            <Text style={styles.strong}>Jérémy Dupuis</Text> ne pourra plus interagir avec vous d'aucune manière.
          </Text>
        </View>

        <View style={styles.sheetUser}>
          <LinearGradient colors={[colors.neon, '#2d6db1']} style={styles.sheetUserAvatar}>
            <Text style={styles.sheetUserAvatarTxt}>JD</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.sheetUserName}>Jérémy Dupuis</Text>
            <Text style={styles.sheetUserHandle}>@jeremy_rider · Paris 12e</Text>
          </View>
        </View>

        <View style={styles.consequences}>
          <Text style={styles.consequencesLabel}>Voici ce qui va changer</Text>
          {CONSEQUENCES.map(([pre, bold, suf], i) => (
            <View key={i} style={styles.consequenceItem}>
              <View style={styles.consequenceIcon}>
                <X size={9} color={colors.danger} strokeWidth={3.5} />
              </View>
              <Text style={styles.consequenceTxt}>
                {pre}
                {bold ? <Text style={styles.consequenceBold}>{bold}</Text> : null}
                {suf}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.reversible}>
          <View style={styles.reversibleIcon}>
            <RefreshCw size={14} color={colors.neon} />
          </View>
          <Text style={styles.reversibleTxt}>
            <Text style={{ color: colors.neon, fontFamily: fonts.bold }}>Réversible à tout moment</Text> — débloquez-le depuis Réglages → Utilisateurs bloqués. Il ne sera{' '}
            <Text style={{ color: colors.neon, fontFamily: fonts.bold }}>pas notifié</Text> du blocage.
          </Text>
        </View>

        <Pressable
          onPress={() => setAlsoReport((v) => !v)}
          style={[styles.alsoReport, alsoReport && styles.alsoReportOn]}
        >
          <View style={[styles.checkbox, alsoReport && styles.checkboxOn]}>
            {alsoReport && <Check size={11} color={colors.bg} strokeWidth={3.5} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alsoTitle}>Signaler également cet utilisateur</Text>
            <Text style={styles.alsoDesc}>Notre équipe modération examinera son comportement</Text>
          </View>
        </Pressable>

        <View style={styles.sheetButtons}>
          <Pressable style={[styles.sheetBtn, styles.btnCancel]}>
            <Text style={styles.btnCancelTxt}>Annuler</Text>
          </Pressable>
          <Pressable style={[styles.sheetBtn, styles.btnConfirm]}>
            <Ban size={14} color="#fff" />
            <Text style={styles.btnConfirmTxt}>Bloquer</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  cover: { height: 180, marginTop: 0 },
  floatingHeader: { position: 'absolute', top: 56, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  floatBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(8,9,14,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

  profileInfo: { paddingHorizontal: 16, marginTop: -42 },
  profileAvatar: { width: 84, height: 84, borderRadius: 24, borderWidth: 4, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileAvatarTxt: { fontFamily: fonts.bold, fontSize: 28, color: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  profileName: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, letterSpacing: -0.5 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(74,222,128,0.12)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.25)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  verifiedTxt: { fontFamily: fonts.bold, fontSize: 9.5, color: colors.success, textTransform: 'uppercase', letterSpacing: 0.5 },
  profileHandle: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute, marginBottom: 14 },

  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 16 },
  statValue: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  statLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 1 },

  bio: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 14, marginBottom: 16 },
  bioTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink, lineHeight: 19 },

  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: radius.md, borderWidth: 1 },
  actionMsg: { backgroundColor: colors.neon, borderColor: colors.neon },
  actionMsgTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  actionSecondary: { backgroundColor: colors.panel, borderColor: colors.line },
  actionSecondaryTxt: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '92%',
    backgroundColor: colors.bg2,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,92,122,0.15)',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    ...shadow.card,
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 18 },

  sheetHeader: { alignItems: 'center', marginBottom: 20 },
  sheetIcon: { width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(255,92,122,0.15)', borderWidth: 1, borderColor: 'rgba(255,92,122,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  sheetTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, marginBottom: 6 },
  sheetSub: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim, textAlign: 'center', lineHeight: 19, paddingHorizontal: 10 },
  strong: { fontFamily: fonts.bold, color: colors.ink },

  sheetUser: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 12, marginBottom: 18 },
  sheetUserAvatar: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sheetUserAvatarTxt: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  sheetUserName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 1 },
  sheetUserHandle: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute },

  consequences: { backgroundColor: 'rgba(255,92,122,0.04)', borderWidth: 1, borderColor: 'rgba(255,92,122,0.15)', borderRadius: radius.md, padding: 14, marginBottom: 16 },
  consequencesLabel: { fontFamily: fonts.bold, fontSize: 10, color: colors.danger, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  consequenceItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 9 },
  consequenceIcon: { width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,92,122,0.12)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  consequenceTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 12.5, color: colors.ink, lineHeight: 18 },
  consequenceBold: { fontFamily: fonts.bold, color: colors.danger },

  reversible: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(77,143,255,0.05)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.15)', borderRadius: radius.sm, padding: 11, marginBottom: 18 },
  reversibleIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(77,143,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  reversibleTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 11.5, color: colors.ink, lineHeight: 17 },

  alsoReport: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, padding: 12, marginBottom: 18 },
  alsoReportOn: { borderColor: 'rgba(251,191,36,0.25)', backgroundColor: 'rgba(251,191,36,0.04)' },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: colors.inkMute, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.warn, borderColor: colors.warn },
  alsoTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 1 },
  alsoDesc: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute, lineHeight: 15 },

  sheetButtons: { flexDirection: 'row', gap: 8 },
  sheetBtn: { paddingVertical: 14, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnCancel: { flex: 1, backgroundColor: colors.line },
  btnCancelTxt: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.ink },
  btnConfirm: { flex: 1.4, backgroundColor: colors.danger, ...shadow.card },
  btnConfirmTxt: { fontFamily: fonts.bold, fontSize: 14.5, color: '#fff' },
});
