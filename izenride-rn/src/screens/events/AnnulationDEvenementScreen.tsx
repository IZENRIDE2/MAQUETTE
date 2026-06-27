import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  AlertTriangle,
  Calendar,
  Users,
  Trash2,
  Clock,
  Check,
  MessageCircle,
  Bell,
  RefreshCw,
  Ban,
} from 'lucide-react-native';
import { colors, fonts, radius } from '@/theme';

const IMPACT = [
  { value: '12', label: 'Inscrits notifiés', color: colors.danger, bg: 'rgba(226,75,74,0.12)', Icon: Users },
  { value: '128', label: 'Messages chat', color: colors.warn, bg: 'rgba(250,199,117,0.12)', Icon: Trash2 },
  { value: '6 j', label: "Avant l'event", color: colors.purple, bg: 'rgba(127,119,221,0.12)', Icon: Clock },
];

const REASONS = ['Météo défavorable', 'Pas assez de motards', 'Empêchement perso', 'Route fermée', 'Reportée à plus tard', 'Autre'];

/** Annulation d'événement — feuille modale admin (localisé Paris / IDF). */
export default function AnnulationDEvenementScreen() {
  const [reason, setReason] = useState('Météo défavorable');
  const [msg, setMsg] = useState(
    'Désolée les amis, gros orage prévu dimanche matin sur Fontainebleau. Je propose de reporter au week-end du 11 mai, mêmes horaires. À vous de me dire 🌧️'
  );

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#0a1428', colors.bg, colors.bgDeep]} style={StyleSheet.absoluteFill} />
      <View style={styles.scrim} />

      <View style={styles.modal}>
        <View style={styles.grab} />

        {/* Head */}
        <View style={styles.head}>
          <Pressable style={styles.closeBtn}>
            <X size={13} color={colors.ink} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headIcon}>
            <AlertTriangle size={26} color={colors.danger} />
          </View>
          <View style={styles.headTag}>
            <AlertTriangle size={9} color={colors.danger} />
            <Text style={styles.headTagTxt}>Action admin · Irréversible</Text>
          </View>
          <Text style={styles.headTitle}>
            Annuler l'<Text style={{ color: colors.danger }}>événement</Text> ?
          </Text>
          <Text style={styles.headDesc}>Tous les inscrits seront notifiés immédiatement.</Text>
        </View>

        {/* Event summary */}
        <View style={styles.summary}>
          <View style={styles.summaryIcon}>
            <Calendar size={16} color={colors.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle} numberOfLines={1}>
              Sortie Forêt de Fontainebleau · Chevreuse
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaTxt}>Dim. 4 mai · 8:00</Text>
              <View style={styles.metaDot} />
              <Text style={styles.metaTxt}>140 km</Text>
              <View style={styles.metaDot} />
              <Text style={[styles.metaTxt, { color: colors.warn }]}>J-6</Text>
            </View>
          </View>
        </View>

        {/* Impact */}
        <View style={styles.impactStrip}>
          {IMPACT.map((it) => (
            <View key={it.label} style={styles.impactCell}>
              <View style={[styles.impactIcon, { backgroundColor: it.bg }]}>
                <it.Icon size={11} color={it.color} />
              </View>
              <Text style={styles.impactValue}>{it.value}</Text>
              <Text style={styles.impactLabel}>{it.label}</Text>
            </View>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {/* Raison */}
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelTxt}>Raison de l'annulation</Text>
            <Text style={styles.sectionLabelMeta}>Visible par les inscrits</Text>
          </View>
          <View style={styles.reasons}>
            {REASONS.map((r) => {
              const on = reason === r;
              return (
                <Pressable key={r} onPress={() => setReason(r)} style={[styles.reason, on && styles.reasonOn]}>
                  {on && (
                    <View style={styles.reasonCheck}>
                      <Check size={7} color="#fff" strokeWidth={3} />
                    </View>
                  )}
                  <Text style={[styles.reasonTxt, on && { color: colors.danger, fontFamily: fonts.semibold }]}>{r}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Message */}
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelTxt}>Message personnel</Text>
            <Text style={styles.sectionLabelMeta}>Facultatif</Text>
          </View>
          <View style={styles.msgWrap}>
            <TextInput style={styles.msgInput} multiline value={msg} onChangeText={setMsg} maxLength={280} placeholderTextColor={colors.inkMute} />
            <View style={styles.msgFoot}>
              <View style={styles.msgFootLeft}>
                <MessageCircle size={10} color={colors.purple} />
                <Text style={styles.msgFootTxt}>
                  Posté en <Text style={styles.msgFootStrong}>annonce admin</Text>
                </Text>
              </View>
              <Text style={styles.msgCounter}>{msg.length} / 280</Text>
            </View>
          </View>

          {/* Notif preview */}
          <View style={styles.notifPreview}>
            <View style={styles.notifHead}>
              <Bell size={11} color={colors.inkMute} />
              <Text style={styles.notifHeadTxt}>Aperçu de la notification push</Text>
            </View>
            <View style={styles.notif}>
              <View style={styles.notifIcon}>
                <AlertTriangle size={16} color={colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.notifAppRow}>
                  <Text style={styles.notifApp}>IzenRide</Text>
                  <Text style={styles.notifTime}>à l'instant</Text>
                </View>
                <Text style={styles.notifTitle}>Sortie Fontainebleau annulée</Text>
                <Text style={styles.notifText} numberOfLines={2}>
                  Météo défavorable · Léa propose de reporter au 11 mai. Voir le message →
                </Text>
              </View>
            </View>
          </View>

          {/* Toggles */}
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelTxt}>Options</Text>
          </View>
          <View style={styles.togglesCard}>
            <View style={styles.toggleRow}>
              <View style={[styles.toggleIcon, { backgroundColor: 'rgba(127,119,221,0.12)' }]}>
                <RefreshCw size={12} color={colors.purple} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Proposer une nouvelle date</Text>
                <Text style={styles.toggleDesc}>Sondage inclus dans la notification</Text>
              </View>
              <View style={[styles.toggle, styles.toggleOnViolet]}>
                <View style={[styles.knob, { transform: [{ translateX: 16 }] }]} />
              </View>
            </View>
            <View style={[styles.toggleRow, styles.toggleBorder]}>
              <View style={[styles.toggleIcon, { backgroundColor: 'rgba(250,199,117,0.12)' }]}>
                <MessageCircle size={12} color={colors.warn} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Garder le chat de groupe ouvert</Text>
                <Text style={styles.toggleDesc}>Pour pouvoir reprogrammer ensemble</Text>
              </View>
              <View style={[styles.toggle, styles.toggleOnAmber]}>
                <View style={[styles.knob, { transform: [{ translateX: 16 }] }]} />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable style={styles.confirmBtnWrap}>
            <LinearGradient colors={[colors.danger, '#c43d3c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.confirmBtn}>
              <Ban size={14} color="#fff" />
              <Text style={styles.confirmTxt}>Confirmer · Notifier 12 motards</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.cancelBtn}>
            <Text style={styles.cancelTxt}>Garder l'événement</Text>
          </Pressable>
          <Text style={styles.footnote}>L'annulation est tracée dans l'historique de l'événement.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, justifyContent: 'flex-end' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },

  modal: { maxHeight: '94%', backgroundColor: colors.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  grab: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.inkMute, alignSelf: 'center', marginTop: 8 },

  head: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, alignItems: 'center', backgroundColor: 'rgba(226,75,74,0.05)' },
  closeBtn: { position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  headIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(226,75,74,0.15)', borderWidth: 1.5, borderColor: 'rgba(226,75,74,0.4)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  headTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(226,75,74,0.12)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.3)', borderRadius: radius.pill, marginBottom: 8 },
  headTagTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.danger, textTransform: 'uppercase', letterSpacing: 0.8 },
  headTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, marginBottom: 4 },
  headDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, textAlign: 'center' },

  summary: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.panelSoft, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  summaryIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(127,119,221,0.15)', alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.inkMute },

  impactStrip: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'rgba(226,75,74,0.04)', borderBottomWidth: 1, borderColor: 'rgba(226,75,74,0.15)' },
  impactCell: { flex: 1, padding: 8, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, borderRadius: 10, alignItems: 'center' },
  impactIcon: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  impactValue: { fontFamily: fonts.monoBold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  impactLabel: { fontFamily: fonts.medium, fontSize: 8, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },

  body: { paddingHorizontal: 16, paddingTop: 14 },
  sectionLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  sectionLabelTxt: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionLabelMeta: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute },

  reasons: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 14 },
  reason: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: colors.panelSoft, borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.pill },
  reasonOn: { backgroundColor: 'rgba(226,75,74,0.08)', borderColor: 'rgba(226,75,74,0.4)' },
  reasonCheck: { width: 13, height: 13, borderRadius: 6.5, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  reasonTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim },

  msgWrap: { backgroundColor: colors.panelSoft, borderWidth: 1.5, borderColor: colors.line, borderRadius: 12, marginBottom: 14 },
  msgInput: { minHeight: 70, padding: 12, fontFamily: fonts.regular, fontSize: 13, color: colors.ink, lineHeight: 19, textAlignVertical: 'top' },
  msgFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 9 },
  msgFootLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  msgFootTxt: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute },
  msgFootStrong: { fontFamily: fonts.semibold, color: colors.purple },
  msgCounter: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  notifPreview: { padding: 12, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 12, marginBottom: 14 },
  notifHead: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  notifHeadTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  notif: { flexDirection: 'row', gap: 10, padding: 10, backgroundColor: 'rgba(20,22,30,0.95)', borderWidth: 1, borderColor: colors.line, borderRadius: 12 },
  notifIcon: { width: 32, height: 32, borderRadius: 7, backgroundColor: 'rgba(226,75,74,0.15)', alignItems: 'center', justifyContent: 'center' },
  notifAppRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 2 },
  notifApp: { fontFamily: fonts.bold, fontSize: 11, color: colors.ink, textTransform: 'uppercase', letterSpacing: 0.4 },
  notifTime: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, marginLeft: 'auto' },
  notifTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink, marginBottom: 1 },
  notifText: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },

  togglesCard: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 12, overflow: 'hidden', marginBottom: 14 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  toggleBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  toggleIcon: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  toggleTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink },
  toggleDesc: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, marginTop: 1 },
  toggle: { width: 38, height: 22, borderRadius: 11, backgroundColor: colors.inkMute, padding: 2, justifyContent: 'center' },
  toggleOnViolet: { backgroundColor: colors.purple },
  toggleOnAmber: { backgroundColor: colors.warn },
  knob: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff' },

  actions: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 28, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.bg },
  confirmBtnWrap: { marginBottom: 8 },
  confirmBtn: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14 },
  confirmTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  cancelBtn: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 14, marginBottom: 4 },
  cancelTxt: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  footnote: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textAlign: 'center', marginTop: 2 },
});
