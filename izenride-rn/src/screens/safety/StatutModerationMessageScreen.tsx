import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, MoreVertical, Check, BadgeCheck, Loader, AlertCircle, Edit3, Send } from 'lucide-react-native';
import { colors, fonts, radius } from '@/theme';

export default function StatutModerationMessageScreen() {
  return (
    <View style={styles.root}>
      <LinearGradient colors={['#0a1428', colors.bg, colors.bgDeep]} style={StyleSheet.absoluteFill} />

      {/* Header chat */}
      <View style={styles.header}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={18} color={colors.ink} />
        </Pressable>
        <View style={styles.avatarWrap}>
          <LinearGradient colors={[colors.neon, colors.purple]} style={styles.avatar}>
            <Text style={styles.avatarTxt}>LM</Text>
          </LinearGradient>
          <View style={styles.onlineDot} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.contactName}>Lucas Marinetti</Text>
            <BadgeCheck size={13} color={colors.neon} />
          </View>
          <Text style={styles.contactStatus}>En ligne</Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <MoreVertical size={16} color={colors.inkDim} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
        <Text style={styles.dateSep}>Aujourd'hui · 14:23</Text>

        <View style={[styles.msg, styles.received]}>
          <Text style={styles.msgTxt}>Salut ! T'es chaud pour la sortie de samedi à Fontainebleau ?</Text>
        </View>
        <Text style={[styles.msgTime, styles.timeLeft]}>14:23</Text>

        <View style={[styles.msg, styles.sent]}>
          <Text style={styles.msgTxt}>Carrément ! Quel itinéraire tu prévois ?</Text>
        </View>
        <View style={[styles.timeRow, styles.timeRight]}>
          <Text style={styles.msgTime}>14:24</Text>
          <Check size={11} color={colors.successText} strokeWidth={2.5} />
        </View>

        <View style={[styles.msg, styles.received]}>
          <Text style={styles.msgTxt}>D906 jusqu'à la Vallée de Chevreuse, puis Rambouillet. ~120 km</Text>
        </View>
        <Text style={[styles.msgTime, styles.timeLeft]}>14:25</Text>

        {/* Pending validation */}
        <View style={styles.statusMsg}>
          <View style={styles.pending}>
            <View style={styles.pendingHeader}>
              <View style={styles.pendingIcon}>
                <Loader size={11} color={colors.neon} />
              </View>
              <Text style={styles.pendingLabel}>Vérification en cours</Text>
            </View>
            <Text style={styles.pendingContent}>"Top, je prends ma R1, on se retrouve où ?"</Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressBar} />
            </View>
          </View>
          <Text style={[styles.msgTime, styles.timeRight]}>14:26 · Analyse ~ 200ms</Text>
        </View>

        {/* Rejected */}
        <View style={styles.statusMsg}>
          <View style={styles.rejected}>
            <View style={styles.rejectedHeader}>
              <View style={styles.rejectedIcon}>
                <AlertCircle size={12} color="#fff" />
              </View>
              <Text style={styles.rejectedLabel}>Message bloqué</Text>
            </View>

            <Text style={styles.rejectedOriginal}>"T'es vraiment con avec ta R1, apprends à rouler avant"</Text>

            <Text style={styles.reasonLabel}>Raison du blocage</Text>
            <Text style={styles.reasonContent}>
              Ton message contient une formulation jugée agressive ou insultante envers ton interlocuteur.
            </Text>

            <View style={styles.reasonDetail}>
              <View style={styles.detailRow}>
                <AlertCircle size={14} color={colors.danger} />
                <Text style={styles.detailTxt}>
                  Détecté : <Text style={styles.detailStrong}>insulte directe</Text> (score 0,87)
                </Text>
              </View>
              <View style={[styles.detailRow, { marginTop: 5 }]}>
                <AlertCircle size={14} color={colors.danger} />
                <Text style={styles.detailTxt}>
                  Filtre : <Text style={styles.detailStrong}>Détection IA (Perspective)</Text>
                </Text>
              </View>
            </View>

            <View style={styles.rejectedActions}>
              <Pressable style={[styles.rejectedBtn, styles.btnEdit]}>
                <Edit3 size={12} color={colors.danger} />
                <Text style={[styles.rejectedBtnTxt, { color: colors.danger }]}>Reformuler</Text>
              </Pressable>
              <Pressable style={[styles.rejectedBtn, styles.btnAppeal]}>
                <AlertCircle size={12} color={colors.ink} />
                <Text style={[styles.rejectedBtnTxt, { color: colors.ink }]}>Contester</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Composer */}
      <View style={styles.composer}>
        <View style={styles.composerRow}>
          <TextInput
            style={styles.composerInput}
            placeholder="Écris un message..."
            placeholderTextColor={colors.inkMute}
          />
          <LinearGradient colors={[colors.neon, '#3D7FBD']} style={styles.sendBtn}>
            <Send size={15} color="#fff" />
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingTop: 54 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(26,30,40,0.5)' },
  iconBtn: { width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  onlineDot: { position: 'absolute', bottom: -1, right: -1, width: 11, height: 11, borderRadius: 6, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.bg },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  contactName: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  contactStatus: { fontFamily: fonts.medium, fontSize: 11, color: colors.successText },

  messages: { padding: 16, gap: 4 },
  dateSep: { textAlign: 'center', fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, paddingVertical: 6 },
  msg: { maxWidth: '78%', paddingVertical: 9, paddingHorizontal: 12, borderRadius: 16, marginTop: 6 },
  received: { alignSelf: 'flex-start', backgroundColor: '#1A1E28', borderBottomLeftRadius: 5 },
  sent: { alignSelf: 'flex-end', backgroundColor: colors.neon, borderBottomRightRadius: 5 },
  msgTxt: { fontFamily: fonts.regular, fontSize: 13.5, color: '#fff', lineHeight: 18 },
  msgTime: { fontFamily: fonts.regular, fontSize: 9.5, color: colors.inkMute, paddingHorizontal: 4, marginTop: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  timeLeft: { alignSelf: 'flex-start' },
  timeRight: { alignSelf: 'flex-end' },

  statusMsg: { alignSelf: 'flex-end', maxWidth: '85%', marginTop: 8 },
  pending: { backgroundColor: 'rgba(77,143,255,0.08)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.2)', borderRadius: 16, borderBottomRightRadius: 5, padding: 12 },
  pendingHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  pendingIcon: { width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(77,143,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  pendingLabel: { fontFamily: fonts.bold, fontSize: 11, color: colors.neon },
  pendingContent: { fontFamily: fonts.regular, fontSize: 13, fontStyle: 'italic', color: colors.inkDim, lineHeight: 18, paddingLeft: 25 },
  progressTrack: { marginTop: 8, marginLeft: 25, height: 3, borderRadius: 2, backgroundColor: 'rgba(77,143,255,0.12)', overflow: 'hidden' },
  progressBar: { height: '100%', width: '65%', borderRadius: 2, backgroundColor: colors.neon },

  rejected: { backgroundColor: 'rgba(226,75,74,0.08)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.25)', borderRadius: 16, borderBottomRightRadius: 5, padding: 12 },
  rejectedHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  rejectedIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  rejectedLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.danger },
  rejectedOriginal: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim, lineHeight: 17, padding: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 9, marginBottom: 10, textDecorationLine: 'line-through' },
  reasonLabel: { fontFamily: fonts.bold, fontSize: 9.5, color: colors.danger, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 },
  reasonContent: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink, lineHeight: 17, marginBottom: 10 },
  reasonDetail: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 9, padding: 8, marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  detailTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 15 },
  detailStrong: { fontFamily: fonts.semibold, color: colors.ink },
  rejectedActions: { flexDirection: 'row', gap: 6 },
  rejectedBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8, borderRadius: 9, borderWidth: 1 },
  btnEdit: { backgroundColor: 'rgba(226,75,74,0.12)', borderColor: 'rgba(226,75,74,0.3)' },
  btnAppeal: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' },
  rejectedBtnTxt: { fontFamily: fonts.bold, fontSize: 11.5 },

  composer: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 24, borderTopWidth: 1, borderTopColor: 'rgba(26,30,40,0.4)' },
  composerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: 22, paddingLeft: 14, paddingRight: 4, paddingVertical: 4 },
  composerInput: { flex: 1, color: colors.ink, fontFamily: fonts.regular, fontSize: 13.5, paddingVertical: 8 },
  sendBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
