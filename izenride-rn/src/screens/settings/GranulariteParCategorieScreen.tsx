import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Check,
  X,
  Bell,
  Mail,
  Volume2,
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  ShoppingBag,
  Crown,
  AlertTriangle,
  Shield,
} from 'lucide-react-native';
import { Screen, AppBar, Panel, Pill, Switch } from '@/components';
import { colors, fonts } from '@/theme';

type Channel = { Icon: typeof Bell; label: string; on: boolean };
type Category = {
  key: string;
  Icon: typeof Heart;
  tint: string;
  name: string;
  count: string;
  pro?: boolean;
  desc: string;
  on: boolean;
  channels?: Channel[];
  segLabel?: string;
  segs?: string[];
  segActive?: number;
  warning?: string;
};

const SUMMARY = [
  { Icon: Bell, name: 'Push', count: '5', active: true },
  { Icon: Mail, name: 'Mail', count: '3', active: true },
  { Icon: Volume2, name: 'Son', count: '0', active: false },
];

const CATEGORIES: Category[] = [
  {
    key: 'matchs',
    Icon: Heart,
    tint: colors.danger,
    name: 'Matchs',
    count: '~ 8 / sem',
    desc: "Likes reçus, nouveaux matchs, qui m'a vu",
    on: true,
    channels: [
      { Icon: Bell, label: 'Push', on: true },
      { Icon: Mail, label: 'Mail', on: false },
      { Icon: Volume2, label: 'Son', on: true },
    ],
    segLabel: 'Fréquence',
    segs: ['Instant', 'Toutes les 1h', 'Quotidien'],
    segActive: 0,
  },
  {
    key: 'messages',
    Icon: MessageCircle,
    tint: colors.neon,
    name: 'Messages',
    count: '~ 12 / jour',
    desc: 'Nouveaux messages 1:1 et groupes événement',
    on: true,
    channels: [
      { Icon: Bell, label: 'Push', on: true },
      { Icon: Mail, label: 'Mail', on: false },
      { Icon: Volume2, label: 'Son', on: true },
    ],
    segLabel: 'Aperçu',
    segs: ['Texte', 'Expéditeur', 'Caché'],
    segActive: 0,
  },
  {
    key: 'events',
    Icon: Calendar,
    tint: colors.purple,
    name: 'Événements',
    count: '~ 3 / sem',
    desc: 'Invitations, rappels, annulations, changements',
    on: true,
    channels: [
      { Icon: Bell, label: 'Push', on: true },
      { Icon: Mail, label: 'Mail', on: true },
      { Icon: Volume2, label: 'Son', on: false },
    ],
    segLabel: 'Rappel',
    segs: ['J-1', 'J-2', 'J-7'],
    segActive: 1,
  },
  {
    key: 'croisements',
    Icon: MapPin,
    tint: colors.success,
    name: 'Croisements',
    count: '~ 5 / sem',
    pro: true,
    desc: 'Quand on croise un autre rider sur la route',
    on: true,
    channels: [
      { Icon: Bell, label: 'Push', on: true },
      { Icon: Mail, label: 'Mail', on: false },
      { Icon: Volume2, label: 'Son', on: false },
    ],
    warning: 'Notif coupée pendant un trajet · réglage prioritaire Mode ZEN',
  },
  {
    key: 'marketplace',
    Icon: ShoppingBag,
    tint: colors.warn,
    name: 'Marketplace',
    count: '~ 2 / jour',
    desc: 'Offres sur mes annonces, baisses de prix, messages',
    on: true,
    channels: [
      { Icon: Bell, label: 'Push', on: true },
      { Icon: Mail, label: 'Mail', on: true },
      { Icon: Volume2, label: 'Son', on: false },
    ],
  },
  {
    key: 'promo',
    Icon: Crown,
    tint: colors.warn,
    name: 'Promotions IzenRide',
    count: '~ 1 / sem',
    desc: 'Offres spéciales, partenaires moto, nouveautés',
    on: false,
  },
];

function ChannelCell({ ch }: { ch: Channel }) {
  return (
    <View style={[styles.chCell, ch.on && styles.chCellOn]}>
      <ch.Icon size={11} color={ch.on ? colors.success : colors.inkMute} />
      <Text style={[styles.chLabel, ch.on && { color: colors.ink }]}>{ch.label}</Text>
      <View style={[styles.chMini, ch.on && styles.chMiniOn]} />
    </View>
  );
}

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Panel style={[styles.cat, !cat.on && styles.catDisabled]} pad={0}>
      <View style={styles.catHead}>
        <View style={[styles.catIcon, { backgroundColor: cat.tint + '20' }]}>
          <cat.Icon size={16} color={cat.tint} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.catNameRow}>
            <Text style={styles.catName}>{cat.name}</Text>
            <View style={styles.catCount}>
              <Text style={styles.catCountTxt}>{cat.count}</Text>
            </View>
            {cat.pro && <Pill label="Pro" color="#1a1408" bg={colors.warn} border={colors.warn} />}
          </View>
          <Text style={styles.catDesc}>{cat.desc}</Text>
        </View>
        <Switch value={cat.on} />
      </View>

      {cat.channels && (
        <View style={styles.catChannels}>
          {cat.channels.map((ch) => (
            <ChannelCell key={ch.label} ch={ch} />
          ))}
        </View>
      )}

      {cat.segs && (
        <View style={styles.catFreq}>
          <Text style={styles.freqLabel}>{cat.segLabel}</Text>
          <View style={styles.segments}>
            {cat.segs.map((s, i) => (
              <View key={s} style={[styles.seg, i === cat.segActive && styles.segActive]}>
                <Text style={[styles.segTxt, i === cat.segActive && { color: colors.ink }]}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {cat.warning && (
        <View style={styles.catWarning}>
          <AlertTriangle size={11} color={colors.warn} />
          <Text style={styles.warningTxt}>{cat.warning}</Text>
        </View>
      )}
    </Panel>
  );
}

/** Notifications — granularité par catégorie (localisé Paris). */
export default function GranulariteParCategorieScreen() {
  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      <AppBar title="Notifications" />
      <Text style={styles.sub}>Granularité par catégorie</Text>

      {/* Summary */}
      <Panel style={styles.summary}>
        <View style={styles.sumRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sumEyebrow}>Aperçu de vos préférences</Text>
            <Text style={styles.sumTitle}>5 / 6 catégories actives</Text>
          </View>
          <View style={styles.ring}>
            <Text style={styles.ringTxt}>83%</Text>
          </View>
        </View>
        <View style={styles.sumChannels}>
          {SUMMARY.map((c) => (
            <View key={c.name} style={[styles.channel, c.active && styles.channelActive]}>
              <View style={[styles.channelDot, c.active && styles.channelDotOn]} />
              <View style={[styles.channelIcon, c.active && styles.channelIconOn]}>
                <c.Icon size={11} color={c.active ? colors.success : colors.inkMute} />
              </View>
              <Text style={styles.channelName}>{c.name}</Text>
              <Text style={[styles.channelCount, c.active && { color: colors.success }]}>{c.count}</Text>
            </View>
          ))}
        </View>
      </Panel>

      {/* Actions bar */}
      <View style={styles.actionsBar}>
        <View style={styles.actionPills}>
          <View style={styles.actionPill}>
            <Check size={11} color={colors.ink} />
            <Text style={styles.actionTxt}>Tout activer</Text>
          </View>
          <View style={[styles.actionPill, styles.actionDanger]}>
            <X size={11} color={colors.danger} />
            <Text style={[styles.actionTxt, { color: colors.danger }]}>Tout couper</Text>
          </View>
        </View>
        <Text style={styles.resetLink}>Par défaut</Text>
      </View>

      {CATEGORIES.map((cat) => (
        <CategoryCard key={cat.key} cat={cat} />
      ))}

      {/* Privacy note */}
      <Panel style={styles.privacyNote}>
        <View style={styles.privacyIcon}>
          <Shield size={13} color={colors.purple} />
        </View>
        <Text style={styles.privacyTxt}>
          Les <Text style={{ color: colors.purple, fontFamily: fonts.semibold }}>alertes sécurité</Text>{' '}
          (annulation event, accident, météo) restent toujours actives, indépendamment de ces réglages.
        </Text>
      </Panel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 14,
  },

  summary: { marginBottom: 12 },
  sumRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sumEyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.neon,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  sumTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  ring: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTxt: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.ink },

  sumChannels: { flexDirection: 'row', gap: 6 },
  channel: {
    flex: 1,
    paddingVertical: 9,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    alignItems: 'center',
  },
  channelActive: { borderColor: 'rgba(74,222,128,0.4)' },
  channelDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.inkMute,
  },
  channelDotOn: { backgroundColor: colors.success },
  channelIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  channelIconOn: { backgroundColor: 'rgba(74,222,128,0.12)', borderColor: 'rgba(74,222,128,0.3)' },
  channelName: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  channelCount: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.ink },

  actionsBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  actionPills: { flexDirection: 'row', gap: 6 },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  actionDanger: { borderColor: 'rgba(255,92,122,0.25)' },
  actionTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.ink },
  resetLink: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },

  cat: { marginBottom: 12 },
  catDisabled: { opacity: 0.55 },
  catHead: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  catIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  catNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' },
  catName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  catCount: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
  },
  catCountTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  catDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },

  catChannels: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  chCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
  },
  chCellOn: { backgroundColor: 'rgba(74,222,128,0.05)', borderColor: 'rgba(74,222,128,0.25)' },
  chLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute },
  chMini: { marginLeft: 'auto', width: 10, height: 10, borderRadius: 5, backgroundColor: colors.inkMute },
  chMiniOn: { backgroundColor: colors.success },

  catFreq: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: 'rgba(7,9,15,0.4)',
  },
  freqLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  segments: {
    flex: 1,
    flexDirection: 'row',
    gap: 3,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 7,
    padding: 2,
  },
  seg: { flex: 1, height: 24, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  segActive: { backgroundColor: colors.bg2 },
  segTxt: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute },

  catWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(251,191,36,0.15)',
    backgroundColor: 'rgba(251,191,36,0.06)',
  },
  warningTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 10, color: colors.warn, lineHeight: 14 },

  privacyNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4 },
  privacyIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(184,132,230,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 16 },
});
