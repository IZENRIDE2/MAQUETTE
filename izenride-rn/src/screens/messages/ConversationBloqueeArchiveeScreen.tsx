import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  ChevronLeft, MoreVertical, Ban, Calendar, MessageCircle, Shield,
  Check, Archive, Download, Trash2, ChevronRight, Lock, Send,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

/** Conversation indisponible — compte supprimé / bloqué / archivé. */
export default function ConversationBloqueeArchiveeScreen() {
  return (
    <Screen scroll edges={['top']} pad={0} contentStyle={{ paddingBottom: 0 }}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={16} color={colors.ink} />
        </Pressable>
        <View style={styles.chatHead}>
          <View style={styles.headAvatar}>
            <Text style={styles.headAvatarTxt}>N</Text>
          </View>
          <View style={styles.headInfo}>
            <Text style={styles.headName}>Nicolas R.</Text>
            <View style={styles.headStatusRow}>
              <Ban size={9} color={colors.inkMute} />
              <Text style={styles.headStatus}>Compte indisponible</Text>
            </View>
          </View>
        </View>
        <Pressable style={styles.iconBtn}>
          <MoreVertical size={16} color={colors.ink} />
        </Pressable>
      </View>

      {/* Messages estompés (historique) */}
      <View style={styles.messages}>
        <Text style={styles.dateSep}>14 avril · 19:42</Text>
        <View style={[styles.msg, styles.msgThem]}>
          <Text style={styles.msgThemTxt}>Salut ! J'ai vu que tu as la même MT-09. Tu rides souvent dans le coin ?</Text>
        </View>
        <View style={[styles.msg, styles.msgMe]}>
          <Text style={styles.msgMeTxt}>Hello ! Oui presque tous les week-ends.</Text>
        </View>
        <View style={[styles.msg, styles.msgThem]}>
          <Text style={styles.msgThemTxt}>Toutes les 2 semaines. La D906 vers la Vallée de Chevreuse est mythique.</Text>
        </View>
        <View style={[styles.msg, styles.msgMe]}>
          <Text style={styles.msgMeTxt}>Ça te dirait d'organiser une sortie dimanche ?</Text>
        </View>
      </View>

      {/* Bandeau d'état */}
      <View style={styles.banner}>
        <View style={styles.bannerHead}>
          <View style={styles.bannerIcon}>
            <Ban size={16} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.stateTag}>
              <Text style={styles.stateTagTxt}>Compte supprimé</Text>
            </View>
            <Text style={styles.stateTitle}>Cette personne n'est plus sur IzenRide</Text>
          </View>
        </View>
        <Text style={styles.stateDesc}>
          <Text style={styles.stateDescStrong}>Nicolas R.</Text> a supprimé son compte le 22 avril.
          L'historique reste consultable mais l'envoi est désactivé.
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Calendar size={8} color={colors.inkMute} />
            <Text style={styles.metaPillTxt}>22 avr · 14:08</Text>
          </View>
          <View style={styles.metaPill}>
            <MessageCircle size={8} color={colors.inkMute} />
            <Text style={styles.metaPillTxt}>12 messages</Text>
          </View>
          <View style={styles.metaPill}>
            <Shield size={8} color={colors.inkMute} />
            <Text style={styles.metaPillTxt}>Match 14 avr</Text>
          </View>
        </View>
      </View>

      {/* Explainer */}
      <View style={styles.section}>
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Que cela signifie</Text>
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.card}>
          <View style={styles.explRow}>
            <View style={[styles.explIcon, { backgroundColor: 'rgba(74,156,232,0.12)' }]}>
              <Check size={11} color={colors.neon} />
            </View>
            <Text style={styles.explText}>
              Vous pouvez <Text style={styles.explStrong}>relire</Text> les messages échangés.
            </Text>
          </View>
          <View style={[styles.explRow, styles.explRowBorder]}>
            <View style={[styles.explIcon, { backgroundColor: 'rgba(250,199,117,0.12)' }]}>
              <Ban size={11} color={colors.warn} />
            </View>
            <Text style={styles.explText}>
              <Text style={styles.explStrong}>Aucun message</Text> ne peut être envoyé.
            </Text>
          </View>
          <View style={[styles.explRow, styles.explRowBorder]}>
            <View style={[styles.explIcon, { backgroundColor: 'rgba(184,132,230,0.12)' }]}>
              <Shield size={11} color={colors.purple} />
            </View>
            <Text style={styles.explText}>
              Le profil <Text style={styles.explStrong}>n'est plus accessible</Text>.
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <View style={styles.actionsList}>
          <Pressable style={styles.actionRow}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(184,132,230,0.12)' }]}>
              <Archive size={13} color={colors.purple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Archiver</Text>
              <Text style={styles.actionDesc}>Garder l'historique sans l'afficher</Text>
            </View>
            <ChevronRight size={13} color={colors.inkMute} />
          </Pressable>
          <Pressable style={[styles.actionRow, styles.actionRowBorder]}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(250,199,117,0.12)' }]}>
              <Download size={13} color={colors.warn} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Exporter l'historique</Text>
              <Text style={styles.actionDesc}>Sauvegarder en .txt</Text>
            </View>
            <ChevronRight size={13} color={colors.inkMute} />
          </Pressable>
          <Pressable style={[styles.actionRow, styles.actionRowBorder]}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(226,75,74,0.12)' }]}>
              <Trash2 size={13} color={colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionTitle, { color: colors.danger }]}>Supprimer la conversation</Text>
              <Text style={styles.actionDesc}>Effacer définitivement · irréversible</Text>
            </View>
            <ChevronRight size={13} color={colors.inkMute} />
          </Pressable>
        </View>
      </View>

      {/* Input verrouillé */}
      <View style={styles.inputBar}>
        <View style={styles.inputDisabled}>
          <Lock size={13} color={colors.inkMute} />
          <Text style={styles.inputDisabledTxt}>Conversation verrouillée</Text>
        </View>
        <View style={styles.sendDisabled}>
          <Send size={14} color={colors.inkMute} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topnav: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 11, backgroundColor: colors.panel,
    borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center',
  },
  chatHead: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
  headAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#2A3545',
    alignItems: 'center', justifyContent: 'center',
  },
  headAvatarTxt: { fontFamily: fonts.bold, fontSize: 13, color: colors.inkMute },
  headInfo: { flex: 1, minWidth: 0 },
  headName: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkMute, textDecorationLine: 'line-through', marginBottom: 2 },
  headStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headStatus: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  messages: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, gap: 5, opacity: 0.55 },
  dateSep: { textAlign: 'center', fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  msg: { maxWidth: '76%', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 14 },
  msgThem: { alignSelf: 'flex-start', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 4 },
  msgMe: { alignSelf: 'flex-end', backgroundColor: 'rgba(74,156,232,0.15)', borderWidth: 1, borderColor: 'rgba(74,156,232,0.2)', borderBottomRightRadius: 4 },
  msgThemTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, lineHeight: 16 },
  msgMeTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 16 },

  banner: {
    marginHorizontal: 14, padding: 14, backgroundColor: colors.panel,
    borderWidth: 1, borderColor: 'rgba(226,75,74,0.25)', borderRadius: radius.md,
  },
  bannerHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  bannerIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(226,75,74,0.15)', alignItems: 'center', justifyContent: 'center' },
  stateTag: { alignSelf: 'flex-start', backgroundColor: colors.danger, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 3 },
  stateTagTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: '#fff', letterSpacing: 0.8, textTransform: 'uppercase' },
  stateTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, lineHeight: 18 },
  stateDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink, lineHeight: 18, marginBottom: 10 },
  stateDescStrong: { fontFamily: fonts.semibold, color: colors.danger },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(226,75,74,0.12)' },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 },
  metaPillTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  section: { paddingHorizontal: 14, paddingTop: 12 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionLine: { flex: 1, height: 1, backgroundColor: colors.line },
  card: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 4 },
  explRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 },
  explRowBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  explIcon: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  explText: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.ink, lineHeight: 15 },
  explStrong: { fontFamily: fonts.semibold },

  actionsList: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, overflow: 'hidden' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 9 },
  actionRowBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  actionIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink },
  actionDesc: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, marginTop: 1 },

  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, marginTop: 12, borderTopWidth: 1, borderTopColor: colors.line },
  inputDisabled: { flex: 1, height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.panel, borderWidth: 1, borderColor: '#2A3545', borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', gap: 7 },
  inputDisabledTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, fontStyle: 'italic' },
  sendDisabled: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', opacity: 0.4 },
});
