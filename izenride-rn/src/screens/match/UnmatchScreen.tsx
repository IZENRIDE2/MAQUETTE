import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, AlertTriangle, Trash2, Ban, Check } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, shadow } from '@/theme';

/** Unmatch — modale de confirmation (localisé Paris). */
export default function UnmatchScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top', 'bottom']}>
      {/* Scrim sombre */}
      <View style={styles.scrim} />

      <View style={styles.center}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Head */}
            <View style={styles.head}>
              <Pressable style={styles.closeBtn}>
                <X size={13} color={colors.ink} strokeWidth={2.5} />
              </Pressable>

              <View style={styles.avatarWrap}>
                <LinearGradient colors={[colors.neon, colors.purple]} style={styles.avatar}>
                  <Text style={styles.avatarTxt}>L</Text>
                </LinearGradient>
                <View style={styles.avatarBadgeX}>
                  <X size={11} color="#fff" strokeWidth={3} />
                </View>
              </View>

              <View style={styles.tag}>
                <AlertTriangle size={9} color={colors.danger} />
                <Text style={styles.tagTxt}>ACTION IRRÉVERSIBLE</Text>
              </View>

              <Text style={styles.title}>
                Unmatcher avec <Text style={styles.titleEm}>Léa</Text> ?
              </Text>
              <Text style={styles.sub}>
                Vous ne pourrez plus communiquer ni voir son profil.{'\n'}
                Cette action <Text style={styles.subStrong}>ne peut pas être annulée</Text>.
              </Text>
            </View>

            {/* Conséquences */}
            <View style={styles.consequences}>
              <View style={styles.conseqRow}>
                <View style={styles.conseqIcon}>
                  <Trash2 size={11} color={colors.danger} />
                </View>
                <Text style={styles.conseqTxt}>
                  Votre conversation et vos <Text style={styles.conseqStrong}>12 messages</Text> seront supprimés.
                </Text>
              </View>
              <View style={styles.conseqRow}>
                <View style={styles.conseqIcon}>
                  <Ban size={11} color={colors.danger} />
                </View>
                <Text style={styles.conseqTxt}>
                  Vous ne <Text style={styles.conseqStrong}>réapparaîtrez plus</Text> dans son fil.
                </Text>
              </View>
            </View>

            {/* Raison */}
            <View style={styles.reasonSection}>
              <View style={styles.reasonLabel}>
                <Text style={styles.reasonLabelTxt}>
                  Une raison ? <Text style={{ color: colors.inkMute, fontFamily: fonts.regular }}>(facultatif)</Text>
                </Text>
                <Text style={styles.reasonMeta}>Anonyme</Text>
              </View>
              <View style={styles.reasons}>
                <Reason label="Pas le bon feeling" />
                <Reason label="Trop loin" selected />
                <Reason label="Profil pas authentique" />
                <Reason label="Comportement inapproprié" />
                <Reason label="Plus intéressé(e)" />
                <Reason label="Autre" />
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable>
                <LinearGradient colors={[colors.danger, '#c43d3c']} style={styles.btnConfirm}>
                  <X size={14} color="#fff" strokeWidth={2.5} />
                  <Text style={styles.btnConfirmTxt}>Confirmer le unmatch</Text>
                </LinearGradient>
              </Pressable>
              <Pressable style={styles.btnCancel}>
                <Text style={styles.btnCancelTxt}>Annuler</Text>
              </Pressable>
              <Text style={styles.footnote}>Si ce profil enfreint nos règles, signalez-le plutôt.</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Screen>
  );
}

function Reason({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <View style={[styles.reason, selected && styles.reasonSel]}>
      {selected ? <Check size={9} color={colors.danger} strokeWidth={3} /> : null}
      <Text style={[styles.reasonTxt, selected && { color: colors.danger, fontFamily: fonts.semibold }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)' },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  modal: { backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, borderRadius: 24, overflow: 'hidden', maxHeight: '92%', ...shadow.card },

  head: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 16, alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { width: 78, height: 78, marginBottom: 14 },
  avatar: { width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.bgDeep },
  avatarTxt: { fontFamily: fonts.bold, fontSize: 30, color: '#fff' },
  avatarBadgeX: { position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.danger, borderWidth: 3, borderColor: colors.bgDeep, alignItems: 'center', justifyContent: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(255,92,122,0.12)', borderWidth: 1, borderColor: 'rgba(255,92,122,0.3)', borderRadius: 999, marginBottom: 8 },
  tagTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.danger, letterSpacing: 0.8 },
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, marginBottom: 6, textAlign: 'center' },
  titleEm: { color: colors.danger },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, textAlign: 'center', lineHeight: 17 },
  subStrong: { fontFamily: fonts.semibold, color: colors.inkDim },

  consequences: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.bg2, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, gap: 8 },
  conseqRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  conseqIcon: { width: 22, height: 22, borderRadius: 6, backgroundColor: 'rgba(255,92,122,0.1)', alignItems: 'center', justifyContent: 'center' },
  conseqTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 16 },
  conseqStrong: { fontFamily: fonts.semibold, color: colors.ink },

  reasonSection: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  reasonLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  reasonLabelTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkDim },
  reasonMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  reasons: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  reason: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 999 },
  reasonSel: { backgroundColor: 'rgba(255,92,122,0.1)', borderColor: 'rgba(255,92,122,0.4)' },
  reasonTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim },

  actions: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 18, gap: 8 },
  btnConfirm: { height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.card },
  btnConfirmTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  btnCancel: { height: 50, borderRadius: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  btnCancelTxt: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  footnote: { marginTop: 4, fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textAlign: 'center', lineHeight: 14 },
});
