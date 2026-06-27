import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Download,
  Clock,
  Lock,
  FileText,
  User,
  MapPin,
  MessageCircle,
  Calendar,
  ShoppingBag,
  Activity,
  Check,
  Mail,
  Info,
  Send,
  ArrowUpRight,
} from 'lucide-react-native';
import { Screen, AppBar, Panel, PrimaryButton, Pill } from '@/components';
import { colors, fonts, radius } from '@/theme';

type Cat = { key: string; Icon: typeof User; tint: string; name: string; meta: string; checked: boolean };

const CATS: Cat[] = [
  { key: 'profile', Icon: User, tint: colors.neon, name: 'Profil & compte', meta: 'Identité, photo, moto, préférences · ~1 Mo', checked: true },
  { key: 'rides', Icon: MapPin, tint: colors.success, name: 'Trajets & GPS', meta: 'Historique, itinéraires, étapes · ~5 Mo', checked: true },
  { key: 'messages', Icon: MessageCircle, tint: colors.warn, name: 'Messages & matchs', meta: 'Conversations, swipes, contacts · ~2 Mo', checked: true },
  { key: 'events', Icon: Calendar, tint: colors.purple, name: 'Événements', meta: 'Sorties créées, rejointes, photos · ~3 Mo', checked: true },
  { key: 'market', Icon: ShoppingBag, tint: colors.neon, name: 'Marketplace', meta: 'Annonces, transactions, favoris · ~0,8 Mo', checked: true },
  { key: 'logs', Icon: Activity, tint: colors.danger, name: 'Logs techniques', meta: 'Connexions, appareils, IP · ~0,3 Mo', checked: false },
];

/** Exporter mes données — demande RGPD (localisé Paris). */
export default function ExporterMesDonneesScreen() {
  const [tab, setTab] = useState<'request' | 'status'>('request');
  const [format, setFormat] = useState<'json' | 'csv'>('json');

  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      <AppBar
        title="Exporter mes données"
        right={
          <View style={styles.headerIcon}>
            <Download size={18} color={colors.purple} />
          </View>
        }
      />
      <Text style={styles.sub}>Demande RGPD · Article 20</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => setTab('request')}>
          <Text style={[styles.tabTxt, tab === 'request' && styles.tabTxtOn]}>Nouvelle demande</Text>
          {tab === 'request' && <View style={styles.tabBar} />}
        </Pressable>
        <Pressable style={styles.tab} onPress={() => setTab('status')}>
          <Text style={[styles.tabTxt, tab === 'status' && styles.tabTxtOn]}>État</Text>
          <Pill label="1" color="#fff" bg={colors.danger} border={colors.danger} />
          {tab === 'status' && <View style={styles.tabBar} />}
        </Pressable>
      </View>

      {tab === 'request' ? (
        <>
          {/* Hero */}
          <Panel style={styles.hero}>
            <LinearGradient colors={[colors.purple, colors.neon]} style={styles.heroIcon}>
              <FileText size={26} color="#fff" />
            </LinearGradient>
            <Text style={styles.heroTitle}>Une copie de toutes vos données</Text>
            <Text style={styles.heroDesc}>
              Récupérez l'ensemble de vos informations IzenRide dans une archive ZIP envoyée par email sous
              48h maximum.
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Clock size={11} color={colors.neon} />
                <Text style={styles.metaTxt}>48h max</Text>
              </View>
              <View style={styles.metaChip}>
                <Lock size={11} color={colors.neon} />
                <Text style={styles.metaTxt}>Chiffré AES-256</Text>
              </View>
              <View style={styles.metaChip}>
                <FileText size={11} color={colors.neon} />
                <Text style={styles.metaTxt}>ZIP · ~12 Mo</Text>
              </View>
            </View>
          </Panel>

          {/* Categories */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.dot} />
              <Text style={styles.sectionTitle}>Données à inclure</Text>
            </View>
            <Text style={styles.selectAll}>Tout sélectionner</Text>
          </View>
          {CATS.map((c) => (
            <Panel
              key={c.key}
              style={[styles.dataCat, c.checked && styles.dataCatOn]}
              pad={14}
              accent={c.checked ? 'rgba(77,143,255,0.3)' : undefined}
            >
              <View style={[styles.dataIcon, { backgroundColor: c.tint + '20' }]}>
                <c.Icon size={18} color={c.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dataName}>{c.name}</Text>
                <Text style={styles.dataMeta}>{c.meta}</Text>
              </View>
              <View style={[styles.checkbox, c.checked && styles.checkboxOn]}>
                {c.checked && <Check size={14} color="#fff" strokeWidth={3.5} />}
              </View>
            </Panel>
          ))}

          {/* Format */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.dot} />
              <Text style={styles.sectionTitle}>Format</Text>
            </View>
          </View>
          <View style={styles.formatGrid}>
            <Pressable style={{ flex: 1 }} onPress={() => setFormat('json')}>
              <Panel style={styles.formatCard} pad={14} accent={format === 'json' ? colors.neon : undefined}>
                {format === 'json' && (
                  <View style={styles.formatCheck}>
                    <Check size={11} color="#fff" strokeWidth={3.5} />
                  </View>
                )}
                <Text style={styles.formatName}>JSON</Text>
                <Text style={styles.formatDesc}>Structuré, lisible par machine — recommandé pour migration</Text>
              </Panel>
            </Pressable>
            <Pressable style={{ flex: 1 }} onPress={() => setFormat('csv')}>
              <Panel style={styles.formatCard} pad={14} accent={format === 'csv' ? colors.neon : undefined}>
                {format === 'csv' && (
                  <View style={styles.formatCheck}>
                    <Check size={11} color="#fff" strokeWidth={3.5} />
                  </View>
                )}
                <Text style={styles.formatName}>CSV</Text>
                <Text style={styles.formatDesc}>Tableau Excel / Numbers — idéal pour analyse personnelle</Text>
              </Panel>
            </Pressable>
          </View>

          {/* Email */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.dot} />
              <Text style={styles.sectionTitle}>Email de réception</Text>
            </View>
          </View>
          <Panel style={styles.emailCard} pad={14}>
            <View style={styles.emailIcon}>
              <Mail size={18} color={colors.neon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emailLabel}>Adresse vérifiée</Text>
              <Text style={styles.emailValue}>christophe@izenride.com</Text>
            </View>
            <Text style={styles.emailEdit}>Modifier</Text>
          </Panel>

          {/* Notice */}
          <View style={styles.notice}>
            <View style={styles.noticeIcon}>
              <Info size={14} color={colors.neon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>Comment ça marche</Text>
              <Text style={styles.noticeTxt}>
                Vous recevrez un email de confirmation immédiatement, puis un second email avec un lien de
                téléchargement sécurisé sous 48h. Le lien expire après 7 jours.
              </Text>
            </View>
          </View>

          <PrimaryButton label="Soumettre la demande" icon={<Send size={16} color="#fff" />} style={{ marginTop: 16 }} />
          <Text style={styles.disclaimer}>
            En soumettant, vous acceptez la politique RGPD d'IzenRide. Limité à 1 demande par mois.
          </Text>
        </>
      ) : (
        <>
          {/* Status card */}
          <Panel style={styles.statusCard}>
            <View style={styles.statusTop}>
              <Text style={styles.statusId}>REQ-2026-0427-A8F3</Text>
              <Pill label="En cours" color={colors.warn} bg="rgba(250,199,117,0.12)" border="rgba(250,199,117,0.25)" />
            </View>
            <Text style={styles.statusTitle}>Préparation de votre archive</Text>
            <Text style={styles.statusSub}>
              Votre demande a été reçue et est en cours de traitement par nos systèmes.
            </Text>

            <View style={styles.ringWrap}>
              <View style={styles.bigRing}>
                <Text style={styles.ringPct}>60%</Text>
                <Text style={styles.ringLabel}>Étape 3 / 5</Text>
              </View>
            </View>

            <View style={styles.etaCard}>
              <View style={styles.etaIcon}>
                <Clock size={16} color={colors.warn} />
              </View>
              <View>
                <Text style={styles.etaLabel}>Disponible avant</Text>
                <Text style={styles.etaValue}>Mercredi 29 avril, 14h00</Text>
              </View>
            </View>

            <View style={styles.timeline}>
              <TimelineStep title="Demande reçue" time="27 avril · 14h02" state="done" />
              <TimelineStep title="Email de confirmation envoyé" time="27 avril · 14h03" state="done" />
              <TimelineStep title="Extraction & compression en cours" time="En cours · ~36h restantes" state="current" />
              <TimelineStep title="Chiffrement AES-256" time="À venir" state="todo" />
              <TimelineStep title="Email avec lien de téléchargement" time="Avant le 29 avril, 14h00" state="todo" last />
            </View>
          </Panel>

          {/* History */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.dot, { backgroundColor: colors.inkMute }]} />
              <Text style={styles.sectionTitle}>Demandes précédentes</Text>
            </View>
          </View>
          <HistoryItem date="15 janvier 2026" meta="izenride_export.zip · 11,4 Mo" />
          <HistoryItem date="3 octobre 2025" meta="izenride_export.zip · 8,2 Mo" />

          {/* RGPD info */}
          <Panel style={styles.rgpdInfo}>
            <View style={styles.rgpdHeader}>
              <Pill label="RGPD" color="#fff" bg={colors.izen} border={colors.izen} />
              <Text style={styles.rgpdTitle}>Vos droits</Text>
            </View>
            <Text style={styles.rgpdTxt}>
              Conformément au Règlement Général sur la Protection des Données, vous disposez d'un droit
              d'accès, de rectification, d'effacement et de portabilité de vos données personnelles.
            </Text>
            <View style={styles.rgpdLink}>
              <Text style={styles.rgpdLinkTxt}>Politique de confidentialité complète</Text>
              <ArrowUpRight size={11} color={colors.neon} />
            </View>
          </Panel>
        </>
      )}
    </Screen>
  );
}

function TimelineStep({
  title,
  time,
  state,
  last,
}: {
  title: string;
  time: string;
  state: 'done' | 'current' | 'todo';
  last?: boolean;
}) {
  const markerColor = state === 'done' ? colors.success : state === 'current' ? colors.warn : colors.line;
  return (
    <View style={styles.tlStep}>
      <View style={styles.tlCol}>
        <View style={[styles.tlMarker, { backgroundColor: markerColor }]}>
          {state === 'done' && <Check size={11} color={colors.bgDeep} strokeWidth={3.5} />}
        </View>
        {!last && <View style={[styles.tlLine, state === 'done' && { backgroundColor: colors.success }]} />}
      </View>
      <View style={{ flex: 1, paddingBottom: 16 }}>
        <Text style={[styles.tlTitle, state === 'todo' && { color: colors.inkMute }]}>{title}</Text>
        <Text style={[styles.tlTime, state === 'current' && { color: colors.warn }]}>{time}</Text>
      </View>
    </View>
  );
}

function HistoryItem({ date, meta }: { date: string; meta: string }) {
  return (
    <Panel style={styles.historyItem} pad={14}>
      <View style={styles.historyIcon}>
        <FileText size={16} color={colors.inkMute} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.historyDate}>{date}</Text>
        <Text style={styles.historyMeta}>{meta}</Text>
      </View>
      <View style={styles.historyStatus}>
        <Text style={styles.historyStatusTxt}>Expiré</Text>
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(184,132,230,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(184,132,230,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sub: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute, marginTop: -10, marginBottom: 12 },

  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.line, marginBottom: 16 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14 },
  tabTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkMute },
  tabTxtOn: { color: colors.ink },
  tabBar: { position: 'absolute', bottom: -1, width: '60%', height: 2, backgroundColor: colors.neon, borderRadius: 2 },

  hero: { marginBottom: 20 },
  heroIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, marginBottom: 6 },
  heroDesc: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute, lineHeight: 20 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 8 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.neon },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectAll: { fontFamily: fonts.semibold, fontSize: 12, color: colors.neon },

  dataCat: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8, borderRadius: radius.md },
  dataCatOn: {},
  dataIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dataName: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  dataMeta: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.inkMute,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.neon, borderColor: colors.neon },

  formatGrid: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  formatCard: { borderRadius: radius.md },
  formatCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.neon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 4 },
  formatDesc: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute, lineHeight: 15 },

  emailCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: radius.md },
  emailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(77,143,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  emailValue: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  emailEdit: { fontFamily: fonts.semibold, fontSize: 12, color: colors.neon },

  notice: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(77,143,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.15)',
    borderRadius: radius.md,
    padding: 14,
    marginTop: 16,
  },
  noticeIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(77,143,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTitle: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.neon, marginBottom: 4 },
  noticeTxt: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkDim, lineHeight: 17 },

  disclaimer: { fontFamily: fonts.medium, fontSize: 10.5, color: colors.inkMute, textAlign: 'center', marginTop: 10, lineHeight: 15 },

  statusCard: { marginBottom: 16 },
  statusTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  statusId: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, letterSpacing: 0.5 },
  statusTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink, marginBottom: 4 },
  statusSub: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.inkMute, lineHeight: 18 },
  ringWrap: { alignItems: 'center', marginVertical: 16 },
  bigRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: colors.warn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPct: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink },
  ringLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  etaIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(250,199,117,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaLabel: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5 },
  etaValue: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },

  timeline: { marginTop: 14 },
  tlStep: { flexDirection: 'row', gap: 14 },
  tlCol: { alignItems: 'center' },
  tlMarker: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tlLine: { flex: 1, width: 2, backgroundColor: colors.line, marginVertical: 2 },
  tlTitle: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink, marginBottom: 2 },
  tlTime: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute },

  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8, borderRadius: radius.md },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDate: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  historyMeta: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },
  historyStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(94,100,120,0.3)' },
  historyStatusTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute },

  rgpdInfo: { marginTop: 8 },
  rgpdHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  rgpdTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  rgpdTxt: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute, lineHeight: 17 },
  rgpdLink: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  rgpdLinkTxt: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.neon },
});
