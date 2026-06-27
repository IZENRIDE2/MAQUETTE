import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Edit3,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Bell,
  MessageCircle,
  Mail,
  Trash2,
  ChevronRight,
  Star,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

/** Édition d'événement (admin) — formulaire avec diff + aperçu notif (localisé Paris / IDF). */
export default function EditionDEvenementAdminScreen() {
  const [title, setTitle] = useState('Sortie Forêt de Fontainebleau · Chevreuse');
  const [desc, setDesc] = useState(
    'Sortie groupe niveau confirmé. RDV station Total Porte d’Orléans à 8h pile. Pause café à Versailles vers 11h. Pneus + niveaux à vérifier la veille.'
  );
  const [date, setDate] = useState('Dim. 11 mai');
  const [time, setTime] = useState('08:00');
  const [place, setPlace] = useState("Station BP · Boulevard Périphérique");

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable>
          <Text style={styles.topnavCancel}>Annuler</Text>
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.topnavTitle}>Modifier l'événement</Text>
          <View style={styles.adminRow}>
            <Star size={8} color="#E8B547" fill="#E8B547" />
            <Text style={styles.adminTxt}>Mode admin</Text>
          </View>
        </View>
        <Pressable style={styles.saveBtn}>
          <Text style={styles.saveTxt}>Enregistrer</Text>
        </Pressable>
      </View>

      {/* Changes banner */}
      <View style={styles.changesBar}>
        <View style={styles.changesIcon}>
          <Edit3 size={13} color={colors.warn} />
        </View>
        <Text style={styles.changesText}>
          <Text style={styles.changesStrong}>2 modifications</Text> · les 12 inscrits seront notifiés à l'enregistrement
        </Text>
        <View style={styles.changesCount}>
          <Text style={styles.changesCountTxt}>2</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Informations */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={[styles.sectionIcon, { backgroundColor: 'rgba(127,119,221,0.12)' }]}>
              <Edit3 size={11} color={colors.purple} />
            </View>
            <Text style={styles.sectionTitle}>Informations</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Titre</Text>
            <View style={styles.inputWrap}>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Description</Text>
            <View style={styles.inputWrap}>
              <TextInput style={[styles.input, styles.textarea]} multiline value={desc} onChangeText={setDesc} />
            </View>
          </View>
        </View>

        {/* Date & heure */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={[styles.sectionIcon, { backgroundColor: 'rgba(74,156,232,0.12)' }]}>
              <Calendar size={11} color={colors.neon} />
            </View>
            <Text style={styles.sectionTitle}>Date & heure</Text>
            <Text style={styles.sectionHelp}>2 modifs ↓</Text>
          </View>

          <View style={styles.row2}>
            <View style={[styles.field, { flex: 1.4 }]}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>Date</Text>
                <View style={styles.changedBadge}>
                  <Text style={styles.changedBadgeTxt}>Modifié</Text>
                </View>
              </View>
              <View style={[styles.inputWrap, styles.inputChanged]}>
                <Calendar size={14} color={colors.warn} style={styles.inputIcon} />
                <TextInput style={styles.input} value={date} onChangeText={setDate} />
              </View>
              <View style={styles.diffRow}>
                <Text style={styles.diffOld}>Dim. 4 mai</Text>
                <ArrowRight size={9} color={colors.inkMute} />
                <Text style={styles.diffNew}>Dim. 11 mai</Text>
              </View>
            </View>

            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Heure</Text>
              <View style={styles.inputWrap}>
                <Clock size={14} color={colors.inkMute} style={styles.inputIcon} />
                <TextInput style={styles.input} value={time} onChangeText={setTime} />
              </View>
            </View>
          </View>
        </View>

        {/* Lieu */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={[styles.sectionIcon, { backgroundColor: 'rgba(250,199,117,0.12)' }]}>
              <MapPin size={11} color={colors.warn} />
            </View>
            <Text style={styles.sectionTitle}>Lieu de rendez-vous</Text>
          </View>

          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Adresse</Text>
              <View style={styles.changedBadge}>
                <Text style={styles.changedBadgeTxt}>Modifié</Text>
              </View>
            </View>
            <View style={[styles.inputWrap, styles.inputChanged]}>
              <MapPin size={14} color={colors.warn} style={styles.inputIcon} />
              <TextInput style={styles.input} value={place} onChangeText={setPlace} />
            </View>
            <View style={styles.diffRow}>
              <Text style={styles.diffOld}>Station Total Porte d'Orléans</Text>
              <ArrowRight size={9} color={colors.inkMute} />
              <Text style={styles.diffNew}>Station BP Périphérique</Text>
            </View>

            {/* Map preview (simplifié) */}
            <View style={styles.mapPreview}>
              <View style={styles.mapPin}>
                <MapPin size={12} color="#fff" fill="#fff" />
              </View>
              <Text style={[styles.mapLabel, { left: 14 }]}>PARIS</Text>
              <Text style={[styles.mapLabel, { right: 14 }]}>VERSAILLES</Text>
            </View>
          </View>
        </View>

        {/* Participants */}
        <View style={styles.participantsCard}>
          <View style={styles.partStack}>
            {[
              { i: 'L', g: [colors.purple, '#2a1f3d'] as [string, string] },
              { i: 'T', g: [colors.neon, '#1a3a5e'] as [string, string] },
              { i: 'M', g: [colors.success, '#0a2a1f'] as [string, string] },
              { i: 'S', g: [colors.warn, '#5a4520'] as [string, string] },
            ].map((p, idx) => (
              <LinearGradient key={p.i} colors={p.g} style={[styles.partAv, idx > 0 && { marginLeft: -10 }]}>
                <Text style={styles.partAvTxt}>{p.i}</Text>
              </LinearGradient>
            ))}
            <View style={[styles.partAv, styles.partMore, { marginLeft: -10 }]}>
              <Text style={styles.partMoreTxt}>+8</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.partCount}>
              <Text style={{ color: colors.purple }}>12 motards</Text> inscrits
            </Text>
            <Text style={styles.partMeta}>tous seront prévenus des changements</Text>
          </View>
        </View>

        {/* Notif preview */}
        <View style={styles.notifSection}>
          <View style={styles.notifCard}>
            <View style={styles.notifCardHead}>
              <View style={styles.notifIconWrap}>
                <Bell size={13} color={colors.neon} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifHeadTitle}>Notification automatique</Text>
                <Text style={styles.notifHeadSub}>aperçu envoyé aux 12 inscrits</Text>
              </View>
            </View>

            <LinearGradient colors={['#14171f', colors.bg]} style={styles.notifBody}>
              <View style={styles.iosNotif}>
                <View style={styles.iosHead}>
                  <LinearGradient colors={[colors.neon, colors.purple]} style={styles.iosAppIcon}>
                    <Bell size={9} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.iosAppName}>IzenRide · Fontainebleau</Text>
                  <Text style={styles.iosTime}>À l'instant</Text>
                </View>
                <Text style={styles.iosTitle}>Léa a modifié l'événement</Text>
                <Text style={styles.iosBody}>
                  📅 Reporté au <Text style={styles.iosStrong}>dim. 11 mai</Text> · 📍 Nouveau RDV : <Text style={styles.iosStrong}>Station BP Périphérique</Text>
                </Text>
              </View>
            </LinearGradient>

            <View>
              {[
                { Icon: MessageCircle, title: 'Message dans le chat groupe', desc: 'Récap automatique posté par @Léa M.', on: true },
                { Icon: Bell, title: 'Push notification', desc: 'Notif système sur les téléphones inscrits', on: true },
                { Icon: Mail, title: 'Email de récap', desc: 'Optionnel · uniquement aux opt-in', on: false },
              ].map((n, i) => (
                <View key={n.title} style={[styles.notifRow, i === 0 ? styles.notifRowTop : styles.notifRowBorder]}>
                  <View style={styles.notifRowIcon}>
                    <n.Icon size={11} color={colors.ink} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifRowTitle}>{n.title}</Text>
                    <Text style={styles.notifRowDesc}>{n.desc}</Text>
                  </View>
                  <View style={[styles.toggle, n.on && styles.toggleOn]}>
                    <View style={[styles.knob, n.on && { transform: [{ translateX: 16 }] }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Danger zone */}
        <Pressable style={styles.dangerZone}>
          <View style={styles.dangerIcon}>
            <Trash2 size={13} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.dangerTitle}>Annuler l'événement</Text>
            <Text style={styles.dangerDesc}>Tous les inscrits seront notifiés · le chat sera archivé</Text>
          </View>
          <ChevronRight size={13} color={colors.danger} />
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  topnavCancel: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },
  topnavTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  adminRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  adminTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: '#E8B547', textTransform: 'uppercase', letterSpacing: 0.6 },
  saveBtn: { backgroundColor: colors.neon, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9 },
  saveTxt: { fontFamily: fonts.bold, fontSize: 12, color: '#fff' },

  changesBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: 'rgba(250,199,117,0.06)', borderBottomWidth: 1, borderColor: 'rgba(250,199,117,0.25)' },
  changesIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(250,199,117,0.15)', alignItems: 'center', justifyContent: 'center' },
  changesText: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 15 },
  changesStrong: { fontFamily: fonts.bold, color: colors.warn },
  changesCount: { paddingHorizontal: 7, paddingVertical: 2, backgroundColor: colors.warn, borderRadius: 5 },
  changesCountTxt: { fontFamily: fonts.monoBold, fontSize: 10, color: '#1a1408' },

  section: { paddingHorizontal: 14, paddingTop: 14 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionIcon: { width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  sectionHelp: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginLeft: 'auto' },

  field: { marginBottom: 8 },
  fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  fieldLabel: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 },
  changedBadge: { paddingHorizontal: 5, paddingVertical: 1, backgroundColor: 'rgba(250,199,117,0.15)', borderWidth: 1, borderColor: 'rgba(250,199,117,0.35)', borderRadius: 3 },
  changedBadgeTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.warn, textTransform: 'uppercase', letterSpacing: 0.6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.panelSoft, borderWidth: 1.5, borderColor: colors.line, borderRadius: 11, overflow: 'hidden' },
  inputChanged: { borderColor: 'rgba(250,199,117,0.4)' },
  inputIcon: { marginLeft: 12 },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 11, fontFamily: fonts.regular, fontSize: 13, color: colors.ink },
  textarea: { minHeight: 64, textAlignVertical: 'top', lineHeight: 18 },
  row2: { flexDirection: 'row', gap: 8 },
  diffRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, borderRadius: 7 },
  diffOld: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textDecorationLine: 'line-through' },
  diffNew: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.success },

  mapPreview: { height: 100, borderRadius: 11, overflow: 'hidden', backgroundColor: '#0a0d14', borderWidth: 1, borderColor: colors.line, marginTop: 4, justifyContent: 'center' },
  mapPin: { position: 'absolute', top: '40%', left: '38%', width: 22, height: 22, borderRadius: 11, backgroundColor: colors.success, borderWidth: 2.5, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  mapLabel: { position: 'absolute', top: 12, fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, letterSpacing: 0.5 },

  participantsCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 14, marginTop: 6, padding: 12, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 12 },
  partStack: { flexDirection: 'row' },
  partAv: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: colors.panelSoft, alignItems: 'center', justifyContent: 'center' },
  partAvTxt: { fontFamily: fonts.bold, fontSize: 11, color: '#fff' },
  partMore: { backgroundColor: colors.bg },
  partMoreTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim },
  partCount: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  partMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginTop: 1 },

  notifSection: { paddingHorizontal: 14, paddingTop: 16 },
  notifCard: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 14, overflow: 'hidden' },
  notifCardHead: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  notifIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(74,156,232,0.15)', alignItems: 'center', justifyContent: 'center' },
  notifHeadTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  notifHeadSub: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, marginTop: 1 },
  notifBody: { padding: 14 },
  iosNotif: { backgroundColor: 'rgba(28,28,30,0.85)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 12 },
  iosHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  iosAppIcon: { width: 18, height: 18, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  iosAppName: { flex: 1, fontFamily: fonts.semibold, fontSize: 10, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.4 },
  iosTime: { fontFamily: fonts.mono, fontSize: 10, color: 'rgba(255,255,255,0.5)' },
  iosTitle: { fontFamily: fonts.bold, fontSize: 13, color: '#fff', marginBottom: 2 },
  iosBody: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 16 },
  iosStrong: { fontFamily: fonts.bold, color: '#fff' },

  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 9 },
  notifRowTop: { borderTopWidth: 1, borderTopColor: colors.line },
  notifRowBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  notifRowIcon: { width: 24, height: 24, borderRadius: 7, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  notifRowTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink },
  notifRowDesc: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, marginTop: 1 },
  toggle: { width: 40, height: 24, borderRadius: 12, backgroundColor: colors.inkMute, padding: 2, justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.neon },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },

  dangerZone: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 14, marginTop: 16, padding: 14, backgroundColor: 'rgba(226,75,74,0.05)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.3)', borderRadius: 12, borderStyle: 'dashed' },
  dangerIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(226,75,74,0.1)', alignItems: 'center', justifyContent: 'center' },
  dangerTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.danger },
  dangerDesc: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, marginTop: 1 },
});
