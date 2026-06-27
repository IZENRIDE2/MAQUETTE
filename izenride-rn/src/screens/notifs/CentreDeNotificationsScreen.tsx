import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  Heart,
  MessageCircle,
  Calendar,
  Eye,
  Crown,
  Check,
  Settings,
} from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts, radius } from '@/theme';

type NotifType = 'match' | 'msg' | 'event' | 'like' | 'badge';

const ICON_STYLE: Record<NotifType, { bg: string; color: string; Icon: any }> = {
  match: { bg: 'rgba(77,143,255,0.12)', color: colors.neon, Icon: Heart },
  msg: { bg: 'rgba(74,222,128,0.12)', color: colors.success, Icon: MessageCircle },
  event: { bg: 'rgba(184,132,230,0.12)', color: colors.purple, Icon: Calendar },
  like: { bg: 'rgba(255,92,122,0.12)', color: colors.danger, Icon: Eye },
  badge: { bg: 'rgba(251,191,36,0.12)', color: colors.warn, Icon: Crown },
};

type Seg = { plain?: string; bold?: string; suffix?: string };
type Notif = { type: NotifType; text: Seg[]; when: string; unread?: boolean; action?: string };

const TABS = [
  { key: 'Tout', count: 3 },
  { key: 'Sociales' },
  { key: 'Système' },
];

const TODAY: Notif[] = [
  {
    type: 'match',
    text: [{ bold: 'Nouveau match !', plain: ' Toi et ' }, { bold: 'Léa', plain: ' vous êtes likés. Lance la conversation.' }],
    when: 'il y a 5 min',
    unread: true,
    action: 'Voir',
  },
  {
    type: 'msg',
    text: [{ bold: 'Marc D.', plain: " t'a envoyé un message à propos du casque AGV." }],
    when: 'il y a 22 min',
    unread: true,
  },
  {
    type: 'event',
    text: [{ plain: 'Rappel : ', bold: 'Balade Forêt de Fontainebleau', suffix: ' commence demain à 09:00.' }],
    when: 'il y a 1 h',
    unread: true,
  },
];

const YESTERDAY: Notif[] = [
  {
    type: 'like',
    text: [{ bold: '5 personnes', plain: ' ont consulté ton profil cette semaine.' }],
    when: 'hier · 18:30',
    action: 'Premium',
  },
  {
    type: 'badge',
    text: [{ plain: 'Badge débloqué : ', bold: '1 000 km parcourus', suffix: ' 🎉' }],
    when: 'hier · 12:05',
  },
  {
    type: 'msg',
    text: [{ plain: 'Ta vente ', bold: '« Casque Shoei »', suffix: " a été confirmée par l'acheteur." }],
    when: 'hier · 09:41',
  },
];

function NotifRow({ n }: { n: Notif }) {
  const { bg, color, Icon } = ICON_STYLE[n.type];
  return (
    <Pressable style={[styles.notif, n.unread && styles.notifUnread]}>
      {n.unread && <View style={styles.unreadDot} />}
      <View style={[styles.notifIcon, { backgroundColor: bg }]}>
        <Icon size={19} color={color} />
      </View>
      <View style={styles.notifTxt}>
        <Text style={styles.notifLine}>
          {n.text.map((seg, i) => (
            <Text key={i}>
              {seg.plain}
              {seg.bold ? <Text style={styles.notifBold}>{seg.bold}</Text> : null}
              {seg.suffix}
            </Text>
          ))}
        </Text>
        <Text style={styles.when}>{n.when}</Text>
      </View>
      {n.action && (
        <View style={styles.actBtn}>
          <Text style={styles.actTxt}>{n.action}</Text>
        </View>
      )}
    </Pressable>
  );
}

/** Centre de notifications — liste sociales + système (localisé Paris). */
export default function CentreDeNotificationsScreen() {
  const [active, setActive] = useState('Tout');
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      <View style={styles.headerWrap}>
        <AppBar
          title="Notifications"
          right={
            <Pressable style={styles.headerIcon}>
              <Settings size={18} color={colors.ink} />
            </Pressable>
          }
        />
        <Text style={styles.headerSub}>3 non lues</Text>
      </View>

      <View style={styles.seg}>
        {TABS.map((t) => {
          const on = active === t.key;
          return (
            <Pressable key={t.key} onPress={() => setActive(t.key)} style={[styles.segBtn, on && styles.segBtnOn]}>
              <Text style={[styles.segTxt, on && { color: colors.neon }]}>{t.key}</Text>
              {t.count != null && (
                <View style={styles.segCount}>
                  <Text style={styles.segCountTxt}>{t.count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.day}>Aujourd'hui</Text>
        {TODAY.map((n, i) => (
          <NotifRow key={`t${i}`} n={n} />
        ))}

        <Text style={styles.day}>Hier</Text>
        {YESTERDAY.map((n, i) => (
          <NotifRow key={`y${i}`} n={n} />
        ))}

        <Pressable style={styles.markAll}>
          <Check size={13} color={colors.inkDim} />
          <Text style={styles.markAllTxt}>Tout marquer comme lu</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: 12, paddingTop: 4 },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  headerSub: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, textAlign: 'center', marginTop: -10, marginBottom: 8 },

  seg: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingBottom: 8 },
  segBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: radius.sm,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  segBtnOn: { backgroundColor: 'rgba(77,143,255,0.12)', borderColor: 'rgba(77,143,255,0.4)' },
  segTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },
  segCount: { backgroundColor: colors.danger, borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1 },
  segCountTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: '#fff' },

  list: { paddingBottom: 40 },
  day: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 6,
  },

  notif: { flexDirection: 'row', gap: 12, paddingVertical: 12, paddingHorizontal: 16, position: 'relative' },
  notifUnread: { backgroundColor: 'rgba(77,143,255,0.05)' },
  unreadDot: { position: 'absolute', left: 6, top: 26, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.neon },
  notifIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  notifTxt: { flex: 1 },
  notifLine: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 18 },
  notifBold: { fontFamily: fonts.bold, color: colors.ink },
  when: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, marginTop: 3 },
  actBtn: {
    alignSelf: 'center',
    backgroundColor: 'rgba(77,143,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.3)',
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  actTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.neon },

  markAll: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 18 },
  markAllTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
});
