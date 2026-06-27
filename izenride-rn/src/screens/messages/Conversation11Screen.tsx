import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, MoreVertical, Check, Heart, Plus, Send } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

type Bub = { from: 'them' | 'me'; text: string; time: string };

const THREAD: Bub[] = [
  { from: 'them', text: 'Salut ! J\'ai vu que tu suis aussi la balade Forêt de Fontainebleau 🏍️', time: '14:02' },
  { from: 'me', text: 'Yes carrément, j\'y serai samedi ! T\'y vas en groupe ?', time: '14:05' },
  { from: 'them', text: 'Avec 2 potes oui. On part de la Place de la Bastille à 9h', time: '14:06' },
  { from: 'me', text: 'Parfait, je vous rejoins là-bas. Z650 ça te tente une photo avant le départ ? 📸', time: '14:08' },
  { from: 'them', text: 'Avec plaisir ! Hâte d\'y être 🔥', time: '14:09' },
];

/** Conversation 1:1 — bulles de chat + champ de saisie. */
export default function Conversation11Screen() {
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* En-tête chat */}
      <View style={styles.chatHead}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={18} color={colors.ink} />
        </Pressable>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>L</Text>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.chatMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Léa</Text>
            <Check size={13} color={colors.neon} strokeWidth={3} />
          </View>
          <Text style={styles.statusOnline}>En ligne</Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <MoreVertical size={18} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.thread} showsVerticalScrollIndicator={false}>
        {/* Bandeau système */}
        <View style={styles.sys}>
          <Heart size={13} color={colors.success} fill={colors.success} />
          <Text style={styles.sysTxt}>Vous avez matché · 12 mai</Text>
        </View>

        <View style={styles.day}>
          <Text style={styles.dayTxt}>Aujourd'hui</Text>
        </View>

        {THREAD.map((b, i) =>
          b.from === 'me' ? (
            <LinearGradient
              key={i}
              colors={['#4A9CE8', '#3A88D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.bub, styles.bubMe]}
            >
              <Text style={styles.bubMeTxt}>{b.text}</Text>
              <Text style={[styles.bubTime, styles.bubTimeMe]}>{b.time}</Text>
            </LinearGradient>
          ) : (
            <View key={i} style={[styles.bub, styles.bubThem]}>
              <Text style={styles.bubThemTxt}>{b.text}</Text>
              <Text style={styles.bubTime}>{b.time}</Text>
            </View>
          )
        )}

        {/* Indicateur de frappe (statique) */}
        <View style={styles.typing}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </ScrollView>

      {/* Composer */}
      <View style={styles.composer}>
        <Pressable style={styles.compBtn}>
          <Plus size={18} color={colors.neon} />
        </Pressable>
        <View style={styles.compField}>
          <Text style={styles.compPlaceholder}>Message...</Text>
          <Pressable>
            <LinearGradient colors={['#4A9CE8', '#2E7FCC']} style={styles.send}>
              <Send size={16} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chatHead: {
    flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 11, backgroundColor: colors.panelSoft,
    borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.izenDeep,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTxt: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: 5.5, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.bg },
  chatMeta: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  name: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  statusOnline: { fontFamily: fonts.regular, fontSize: 11, color: colors.success },

  thread: { padding: 14, gap: 9 },
  sys: {
    alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(93,202,165,0.08)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.22)',
    borderRadius: 12, paddingHorizontal: 13, paddingVertical: 8, marginVertical: 4,
  },
  sysTxt: { fontFamily: fonts.regular, fontSize: 11, color: colors.success },
  day: { alignSelf: 'center', backgroundColor: colors.panelSoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, marginVertical: 2 },
  dayTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  bub: { maxWidth: '75%', paddingHorizontal: 13, paddingVertical: 10, borderRadius: 18 },
  bubThem: { alignSelf: 'flex-start', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 6 },
  bubMe: { alignSelf: 'flex-end', borderBottomRightRadius: 6 },
  bubThemTxt: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 20 },
  bubMeTxt: { fontFamily: fonts.regular, fontSize: 14, color: '#fff', lineHeight: 20 },
  bubTime: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, marginTop: 4, opacity: 0.7 },
  bubTimeMe: { color: '#fff', textAlign: 'right' },

  typing: { alignSelf: 'flex-start', flexDirection: 'row', gap: 4, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 15, paddingVertical: 13, borderRadius: 18, borderBottomLeftRadius: 6 },
  typingDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.inkMute },

  composer: {
    flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12,
    borderTopWidth: 1, borderTopColor: colors.line,
  },
  compBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.panel,
    borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center',
  },
  compField: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 22,
    paddingLeft: 15, paddingRight: 6, height: 44,
  },
  compPlaceholder: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute },
  send: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
