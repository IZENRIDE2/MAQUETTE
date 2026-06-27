import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft, Search, MoreVertical, Calendar, ChevronRight, Star, Plus, Send,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

/** Chat de groupe d'événement — bandeau event, messages, mentions (localisé Paris/IDF). */
export default function ChatDeGroupeEvenementScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Top nav groupe */}
      <View style={styles.topnav}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={16} color={colors.ink} />
        </Pressable>
        <View style={styles.groupAvatars}>
          <View style={[styles.ga, styles.ga1]}><Text style={styles.gaTxt}>L</Text></View>
          <View style={[styles.ga, styles.ga2]}><Text style={styles.gaTxt}>T</Text></View>
          <View style={[styles.ga, styles.ga3]}><Text style={styles.gaTxt}>M</Text></View>
        </View>
        <View style={styles.groupInfo}>
          <View style={styles.groupNameRow}>
            <Text style={styles.groupName} numberOfLines={1}>Sortie Fontainebleau</Text>
            <View style={styles.eventPill}><Text style={styles.eventPillTxt}>Event</Text></View>
          </View>
          <View style={styles.groupMeta}>
            <Text style={styles.groupMetaTxt}>12 motards</Text>
            <View style={styles.metaDot} />
            <Text style={[styles.groupMetaTxt, { color: colors.success }]}>3 en ligne</Text>
          </View>
        </View>
        <View style={styles.headActions}>
          <Pressable style={styles.iconBtn}><Search size={16} color={colors.ink} /></Pressable>
          <Pressable style={styles.iconBtn}><MoreVertical size={16} color={colors.ink} /></Pressable>
        </View>
      </View>

      {/* Bandeau événement */}
      <Pressable style={styles.eventBanner}>
        <View style={styles.eventIcon}>
          <Calendar size={16} color={colors.purple} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.eventTag}>Dimanche 4 mai · J-6</Text>
          <Text style={styles.eventTitle}>Sortie Route des Crêtes · Forêt de Fontainebleau</Text>
          <View style={styles.eventMetaRow}>
            <Text style={styles.eventMeta}>RDV 8:00 Bastille</Text>
            <View style={styles.metaDot} />
            <Text style={styles.eventMeta}>140 km</Text>
            <View style={styles.metaDot} />
            <Text style={styles.eventMeta}>12 confirmés</Text>
          </View>
        </View>
        <ChevronRight size={12} color={colors.purple} />
      </Pressable>

      {/* Messages */}
      <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
        <Text style={styles.dateSep}>Aujourd'hui · 14 h</Text>

        {/* Système admin */}
        <View style={styles.sysMsg}>
          <Star size={11} color={colors.purple} />
          <Text style={styles.sysMsgTxt}>
            <Text style={styles.sysMsgStrong}>Léa M.</Text> a créé l'événement · 12 motards invités
          </Text>
        </View>

        {/* Léa - admin */}
        <View style={[styles.msgGroup, styles.msgGroupThem]}>
          <View style={[styles.msgAvatar, { backgroundColor: colors.purple }]}>
            <Text style={styles.msgAvatarTxt}>L</Text>
            <View style={styles.crownBadge}><Text style={styles.crownTxt}>♛</Text></View>
          </View>
          <View style={styles.bubbleWrap}>
            <View style={styles.nameRow}>
              <Text style={[styles.msgName, { color: colors.purple }]}>Léa M.</Text>
              <View style={styles.adminTag}><Text style={styles.adminTagTxt}>Admin</Text></View>
            </View>
            <View style={[styles.bubble, styles.bubbleThem, styles.bubbleAdmin]}>
              <Text style={styles.bubbleTxt}>
                Salut tout le monde ! 👋 RDV dimanche 8h pile à la Place de la Bastille. Vérifiez vos pneus avant.
              </Text>
            </View>
            <Text style={styles.msgTime}>14:08</Text>
          </View>
        </View>

        {/* Thomas */}
        <View style={[styles.msgGroup, styles.msgGroupThem]}>
          <View style={[styles.msgAvatar, { backgroundColor: colors.neon }]}>
            <Text style={styles.msgAvatarTxt}>T</Text>
          </View>
          <View style={styles.bubbleWrap}>
            <View style={styles.nameRow}>
              <Text style={[styles.msgName, { color: colors.neon }]}>Thomas L.</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleThem]}>
              <Text style={styles.bubbleTxt}>Top, je serai là 👍 Quelqu'un d'autre vient depuis Boulogne-Billancourt ?</Text>
            </View>
            <Text style={styles.msgTime}>14:14</Text>
          </View>
        </View>

        {/* Marc - mention de moi */}
        <View style={[styles.msgGroup, styles.msgGroupThem]}>
          <View style={[styles.msgAvatar, { backgroundColor: colors.success }]}>
            <Text style={styles.msgAvatarTxt}>M</Text>
          </View>
          <View style={styles.bubbleWrap}>
            <View style={styles.nameRow}>
              <Text style={[styles.msgName, { color: colors.success }]}>Marc D.</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleThem, styles.bubbleMentioned]}>
              <Text style={styles.bubbleTxt}>
                <Text style={styles.mentionSelf}>@alex_rides_75</Text> tu peux nous montrer le tracé exact ? Je connais pas la fin.
              </Text>
            </View>
            <View style={styles.reactions}>
              <View style={[styles.reaction, styles.reactionMine]}>
                <Text style={styles.reactionTxt}>👍 </Text>
                <Text style={[styles.reactionCount, { color: colors.neon }]}>3</Text>
              </View>
            </View>
            <Text style={styles.msgTime}>14:18</Text>
          </View>
        </View>

        {/* Ma réponse avec reply */}
        <View style={[styles.msgGroup, styles.msgGroupMe]}>
          <View style={styles.bubbleWrap}>
            <View style={[styles.bubble, styles.bubbleMe]}>
              <View style={styles.replyQuote}>
                <Text style={styles.replyQuoteName}>Marc D.</Text>
                <Text style={styles.replyQuoteTxt}>tu peux nous montrer le tracé exact ?</Text>
              </View>
              <Text style={styles.bubbleTxt}>Yes je partage le GPX ce soir. Ça passe par Provins puis Versailles.</Text>
            </View>
            <Text style={[styles.msgTime, styles.msgTimeMe]}>14:21 · Lu</Text>
          </View>
        </View>

        {/* Sophie - mention admin */}
        <View style={[styles.msgGroup, styles.msgGroupThem]}>
          <View style={[styles.msgAvatar, { backgroundColor: colors.warn }]}>
            <Text style={[styles.msgAvatarTxt, { color: '#1a1408' }]}>S</Text>
          </View>
          <View style={styles.bubbleWrap}>
            <View style={styles.nameRow}>
              <Text style={[styles.msgName, { color: colors.warn }]}>Sophie V.</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleThem]}>
              <Text style={styles.bubbleTxt}>
                <Text style={styles.mention}>@Léa</Text> on prévoit un café à 11h ? La Villette a un super spot.
              </Text>
            </View>
            <View style={styles.reactions}>
              <View style={styles.reaction}>
                <Text style={styles.reactionTxt}>☕ </Text>
                <Text style={styles.reactionCount}>5</Text>
              </View>
              <View style={styles.reaction}>
                <Text style={styles.reactionTxt}>🌳 </Text>
                <Text style={styles.reactionCount}>2</Text>
              </View>
            </View>
            <Text style={styles.msgTime}>14:24</Text>
          </View>
        </View>

        {/* Typing */}
        <View style={[styles.msgGroup, styles.msgGroupThem]}>
          <View style={[styles.msgAvatar, { backgroundColor: colors.purple }]}>
            <Text style={styles.msgAvatarTxt}>L</Text>
          </View>
          <View style={styles.typingBubble}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </View>
        </View>
        <Text style={styles.typingName}>Léa M. écrit…</Text>
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <Pressable style={styles.inputAttach}>
          <Plus size={16} color={colors.ink} />
        </Pressable>
        <View style={styles.inputField}>
          <Text style={styles.inputFieldTxt}>@l</Text>
        </View>
        <Pressable>
          <LinearGradient colors={[colors.neon, colors.purple]} style={styles.sendBtn}>
            <Send size={14} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topnav: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 11, backgroundColor: colors.panel,
    borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center',
  },
  groupAvatars: { width: 38, height: 38 },
  ga: { position: 'absolute', width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  ga1: { top: 0, left: 0, backgroundColor: colors.purple, zIndex: 3 },
  ga2: { top: 0, right: 0, backgroundColor: colors.neon, zIndex: 2 },
  ga3: { bottom: 0, left: 6, backgroundColor: colors.success, zIndex: 4 },
  gaTxt: { fontFamily: fonts.bold, fontSize: 10, color: '#fff' },
  groupInfo: { flex: 1, minWidth: 0 },
  groupNameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 1 },
  groupName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, flexShrink: 1 },
  eventPill: { backgroundColor: 'rgba(184,132,230,0.15)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.3)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  eventPillTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.purple, textTransform: 'uppercase', letterSpacing: 0.6 },
  groupMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  groupMetaTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#2A3545' },
  headActions: { flexDirection: 'row', gap: 5 },

  eventBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: colors.panel, borderBottomWidth: 1, borderBottomColor: 'rgba(184,132,230,0.25)',
  },
  eventIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(184,132,230,0.18)', alignItems: 'center', justifyContent: 'center' },
  eventTag: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.purple, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 1 },
  eventTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink, lineHeight: 15 },
  eventMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  eventMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  messages: { padding: 10, gap: 4 },
  dateSep: { textAlign: 'center', fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginVertical: 6 },
  sysMsg: { alignSelf: 'center', maxWidth: '86%', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(184,132,230,0.08)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.25)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginVertical: 4 },
  sysMsgTxt: { fontFamily: fonts.regular, fontSize: 11, color: colors.ink, textAlign: 'center', flexShrink: 1 },
  sysMsgStrong: { fontFamily: fonts.bold, color: colors.purple },

  msgGroup: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', maxWidth: '82%' },
  msgGroupThem: { alignSelf: 'flex-start' },
  msgGroupMe: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  msgAvatarTxt: { fontFamily: fonts.bold, fontSize: 11, color: '#fff' },
  crownBadge: { position: 'absolute', top: -3, right: -3, width: 14, height: 14, borderRadius: 7, backgroundColor: '#E8B547', borderWidth: 2, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  crownTxt: { fontSize: 7, color: '#1a1408' },
  bubbleWrap: { minWidth: 0, gap: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, marginBottom: 1 },
  msgName: { fontFamily: fonts.bold, fontSize: 11 },
  adminTag: { backgroundColor: '#E8B547', borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1 },
  adminTagTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: '#1a1408', textTransform: 'uppercase', letterSpacing: 0.6 },
  bubble: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  bubbleThem: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 4 },
  bubbleAdmin: { backgroundColor: 'rgba(232,181,71,0.05)', borderColor: 'rgba(232,181,71,0.25)' },
  bubbleMe: { backgroundColor: 'rgba(74,156,232,0.18)', borderWidth: 1, borderColor: 'rgba(74,156,232,0.3)', borderBottomRightRadius: 4 },
  bubbleMentioned: { borderColor: 'rgba(74,156,232,0.5)' },
  bubbleTxt: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink, lineHeight: 18 },
  mention: { fontFamily: fonts.semibold, color: colors.neon },
  mentionSelf: { fontFamily: fonts.bold, color: colors.neon },
  reactions: { flexDirection: 'row', gap: 3, flexWrap: 'wrap', marginTop: 3, paddingHorizontal: 8 },
  reaction: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2 },
  reactionMine: { backgroundColor: 'rgba(74,156,232,0.12)', borderColor: 'rgba(74,156,232,0.35)' },
  reactionTxt: { fontSize: 10, color: colors.ink },
  reactionCount: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkDim },
  replyQuote: { marginBottom: 5, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: 'rgba(8,9,14,0.5)', borderLeftWidth: 2, borderLeftColor: colors.purple, borderRadius: 6 },
  replyQuoteName: { fontFamily: fonts.bold, fontSize: 9, color: colors.purple, marginBottom: 1 },
  replyQuoteTxt: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, lineHeight: 13 },
  msgTime: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, marginTop: 2, paddingHorizontal: 12 },
  msgTimeMe: { textAlign: 'right', color: colors.neon, opacity: 0.7 },

  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, borderBottomLeftRadius: 4 },
  typingDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.inkMute },
  typingName: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginLeft: 36, marginTop: 2 },

  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 12, borderTopWidth: 1, borderTopColor: colors.line },
  inputAttach: { width: 40, height: 40, borderRadius: 11, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  inputField: { flex: 1, minHeight: 40, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 20 },
  inputFieldTxt: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
