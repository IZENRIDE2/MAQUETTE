import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  AlertTriangle,
  Image as ImageIcon,
  Send,
  Ban,
  Lock,
  Shield,
  Check,
  Image,
} from 'lucide-react-native';
import { Screen, Switch } from '@/components';
import { colors, fonts, radius } from '@/theme';

type ReasonKey = 'harassment' | 'inappropriate' | 'spam' | 'fake' | 'dangerous' | 'other';

const REASONS: { key: ReasonKey; name: string; desc: string; color: string; bg: string; Icon: any }[] = [
  { key: 'harassment', name: 'Harcèlement', desc: 'Messages insistants, menaces, intimidation', color: colors.danger, bg: 'rgba(255,92,122,0.12)', Icon: AlertTriangle },
  { key: 'inappropriate', name: 'Contenu inapproprié', desc: 'Photos, propos choquants, nudité', color: colors.warn, bg: 'rgba(251,191,36,0.12)', Icon: Image },
  { key: 'spam', name: 'Spam', desc: 'Publicité, liens suspects, arnaque', color: colors.purple, bg: 'rgba(184,132,230,0.12)', Icon: Send },
  { key: 'fake', name: 'Faux profil', desc: 'Usurpation, identité fictive, bot', color: colors.neon, bg: 'rgba(77,143,255,0.12)', Icon: Ban },
  { key: 'dangerous', name: 'Conduite dangereuse', desc: 'Mise en danger, provocation, rodéo', color: colors.danger, bg: 'rgba(255,92,122,0.12)', Icon: AlertTriangle },
  { key: 'other', name: 'Autre raison', desc: 'Précisez ci-dessous', color: colors.inkMute, bg: 'rgba(255,255,255,0.04)', Icon: AlertTriangle },
];

const SUB_REASONS: Record<ReasonKey, { label: string; items: string[] }> = {
  harassment: {
    label: 'Précisez le type de harcèlement',
    items: ['Messages insistants malgré refus', 'Menaces ou intimidation', 'Propos discriminatoires', 'Sollicitations sexuelles non désirées', 'Cyber-harcèlement / shaming public'],
  },
  inappropriate: {
    label: 'Quel type de contenu ?',
    items: ['Photos / vidéos choquantes', 'Nudité ou contenu sexuel', 'Violence graphique', 'Propos haineux ou discriminatoires', 'Contenu illégal'],
  },
  spam: {
    label: 'Quel type de spam ?',
    items: ['Publicité non sollicitée', 'Liens suspects ou phishing', "Tentative d'arnaque financière", 'Vente illégale (drogue, contrefaçon)', 'Activité de bot suspecte'],
  },
  fake: {
    label: 'Quel type de faux profil ?',
    items: ["Usurpation d'identité d'une personne réelle", 'Profil avec fausses photos', 'Profil de mineur (interdit)', 'Bot ou compte automatisé', 'Multi-comptes / contournement de ban'],
  },
  dangerous: {
    label: 'Quel type de comportement ?',
    items: ['Conduite à grande vitesse / rodéo', "Mise en danger d'autrui", 'Provocation à des comportements illégaux', 'Promotion de la consommation au volant', "Refus du port d'équipement de sécurité"],
  },
  other: {
    label: 'Précisez le motif',
    items: ['Violation de la charte communautaire', 'Comportement contraire aux CGU', 'Autre — décrivez ci-dessous'],
  },
};

/** Signaler un utilisateur — formulaire confidentiel (localisé Paris). */
export default function SignalerUnUtilisateurScreen() {
  const [reason, setReason] = useState<ReasonKey | null>(null);
  const [sub, setSub] = useState<number | null>(null);
  const [desc, setDesc] = useState('');

  const submitEnabled = !!reason;
  const subData = reason ? SUB_REASONS[reason] : null;

  return (
    <Screen scroll pad={0} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn}>
          <ChevronLeft size={18} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Signaler un utilisateur</Text>
          <View style={styles.headerSubRow}>
            <View style={styles.headerDot} />
            <Text style={styles.headerSub}>Confidentiel · Examiné sous 24h</Text>
          </View>
        </View>
      </View>

      {/* Cible */}
      <View style={styles.targetCard}>
        <LinearGradient colors={[colors.purple, '#564fa7']} style={styles.targetAvatar}>
          <Text style={styles.targetAvatarTxt}>TG</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.targetLabel}>Utilisateur signalé</Text>
          <Text style={styles.targetName}>Thomas Giraud</Text>
          <Text style={styles.targetHandle}>@tom_rider69 · Montreuil</Text>
        </View>
      </View>

      {/* Motif */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionTitle}>Motif principal</Text>
          <Text style={styles.sectionRequired}>Requis</Text>
        </View>

        <View style={styles.reasonsGrid}>
          {REASONS.map((r) => {
            const on = reason === r.key;
            return (
              <Pressable
                key={r.key}
                onPress={() => {
                  setReason(r.key);
                  setSub(null);
                }}
                style={[styles.reasonCard, on && styles.reasonCardOn]}
              >
                {on && (
                  <View style={styles.reasonCheck}>
                    <Check size={10} color="#fff" strokeWidth={3.5} />
                  </View>
                )}
                <View style={[styles.reasonIcon, { backgroundColor: r.bg }]}>
                  <r.Icon size={20} color={r.color} />
                </View>
                <Text style={styles.reasonName}>{r.name}</Text>
                <Text style={styles.reasonDesc}>{r.desc}</Text>
              </Pressable>
            );
          })}
        </View>

        {subData && (
          <View style={styles.subReasons}>
            <Text style={styles.subHeader}>{subData.label}</Text>
            {subData.items.map((item, i) => {
              const on = sub === i;
              return (
                <Pressable key={i} onPress={() => setSub(i)} style={[styles.subRow, i > 0 && styles.subRowBorder]}>
                  <View style={[styles.radio, on && styles.radioOn]}>{on && <View style={styles.radioDot} />}</View>
                  <Text style={styles.subTxt}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      {/* Description */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionTitle}>Décrivez la situation</Text>
          <Text style={[styles.sectionRequired, { color: colors.inkMute }]}>Optionnel</Text>
        </View>
        <View style={styles.descCard}>
          <TextInput
            style={styles.descInput}
            multiline
            maxLength={500}
            value={desc}
            onChangeText={setDesc}
            placeholder="Donnez-nous des détails pour nous aider à comprendre la situation. Décrivez précisément ce qui s'est passé, où et quand…"
            placeholderTextColor={colors.inkMute}
          />
          <View style={styles.descFooter}>
            <View style={styles.descHint}>
              <Lock size={11} color={colors.inkMute} />
              <Text style={styles.descHintTxt}>Vos infos restent privées</Text>
            </View>
            <Text style={styles.descCounter}>{desc.length} / 500</Text>
          </View>
        </View>
      </View>

      {/* Preuves */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionTitle}>Preuves (recommandé)</Text>
          <View style={styles.sectionLineFlex} />
        </View>

        <Pressable style={styles.evidenceCard}>
          <View style={styles.evidenceIcon}>
            <ImageIcon size={18} color={colors.neon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.evidenceTitle}>Captures d'écran</Text>
            <Text style={styles.evidenceDesc}>Ajoutez jusqu'à 3 photos pour appuyer votre signalement</Text>
          </View>
          <Text style={styles.evidenceAction}>+ Ajouter</Text>
        </Pressable>

        {/* Bloquer */}
        <View style={styles.blockCard}>
          <View style={styles.blockIcon}>
            <Ban size={18} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.blockTitle}>Bloquer cet utilisateur</Text>
            <Text style={styles.blockDesc}>Il ne pourra plus vous contacter ni voir votre profil</Text>
          </View>
          <Switch value />
        </View>

        {/* Confiance */}
        <View style={styles.trustInfo}>
          <View style={styles.trustIcon}>
            <Shield size={14} color={colors.neon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.trustTitle}>Votre signalement est confidentiel</Text>
            <Text style={styles.trustTxt}>
              L'utilisateur signalé ne sera <Text style={styles.trustStrong}>jamais informé</Text> de votre identité. Notre équipe modération examine chaque signalement sous 24h. Les signalements abusifs peuvent entraîner des sanctions.
            </Text>
          </View>
        </View>
      </View>

      {/* Soumission */}
      <View style={styles.submitInfo}>
        <Lock size={11} color={colors.inkMute} />
        <Text style={styles.submitInfoTxt}>Données chiffrées · IzenRide modération uniquement</Text>
      </View>
      <View style={styles.submitButtons}>
        <Pressable style={[styles.btn, styles.btnCancel]}>
          <Text style={styles.btnCancelTxt}>Annuler</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnSubmit, !submitEnabled && styles.btnSubmitDisabled]} disabled={!submitEnabled}>
          <Send size={14} color={submitEnabled ? '#fff' : colors.inkMute} />
          <Text style={[styles.btnSubmitTxt, !submitEnabled && { color: colors.inkMute }]}>Envoyer le signalement</Text>
        </Pressable>
      </View>

      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  headerDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.danger },
  headerSub: { fontFamily: fonts.semibold, fontSize: 12, color: colors.danger },

  targetCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 16, padding: 14, backgroundColor: colors.panel, borderWidth: 1, borderColor: 'rgba(255,92,122,0.18)', borderRadius: radius.lg },
  targetAvatar: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  targetAvatarTxt: { fontFamily: fonts.bold, fontSize: 18, color: '#fff' },
  targetLabel: { fontFamily: fonts.bold, fontSize: 10, color: colors.danger, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  targetName: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginBottom: 2 },
  targetHandle: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute },

  section: { marginHorizontal: 16, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, paddingHorizontal: 4 },
  sectionLine: { width: 12, height: 1, backgroundColor: colors.line },
  sectionLineFlex: { flex: 1, height: 1, backgroundColor: colors.line },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },
  sectionRequired: { fontFamily: fonts.bold, fontSize: 10, color: colors.danger, textTransform: 'uppercase', letterSpacing: 0.4, marginLeft: 'auto' },

  reasonsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  reasonCard: { width: '48%', padding: 14, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  reasonCardOn: { borderColor: colors.danger, backgroundColor: 'rgba(255,92,122,0.06)' },
  reasonCheck: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  reasonIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  reasonName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 3 },
  reasonDesc: { fontFamily: fonts.medium, fontSize: 10.5, color: colors.inkMute, lineHeight: 14 },

  subReasons: { marginTop: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, overflow: 'hidden' },
  subHeader: { fontFamily: fonts.bold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.7, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6 },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 14 },
  subRowBorder: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.inkMute, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.danger, backgroundColor: colors.danger },
  radioDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  subTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 12.5, color: colors.ink },

  descCard: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 14 },
  descInput: { minHeight: 100, fontFamily: fonts.regular, fontSize: 13.5, color: colors.ink, lineHeight: 20, textAlignVertical: 'top' },
  descFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  descHint: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  descHintTxt: { fontFamily: fonts.medium, fontSize: 10.5, color: colors.inkMute },
  descCounter: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.inkMute },

  evidenceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 14 },
  evidenceIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(77,143,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  evidenceTitle: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink, marginBottom: 2 },
  evidenceDesc: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute, lineHeight: 16 },
  evidenceAction: { fontFamily: fonts.bold, fontSize: 12, color: colors.neon },

  blockCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, padding: 14, backgroundColor: colors.panel, borderWidth: 1, borderColor: 'rgba(255,92,122,0.25)', borderRadius: radius.md },
  blockIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(255,92,122,0.12)', alignItems: 'center', justifyContent: 'center' },
  blockTitle: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink, marginBottom: 2 },
  blockDesc: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute, lineHeight: 16 },

  trustInfo: { flexDirection: 'row', gap: 12, marginTop: 16, padding: 14, backgroundColor: 'rgba(77,143,255,0.05)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.15)', borderRadius: radius.md },
  trustIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(77,143,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  trustTitle: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.neon, marginBottom: 4 },
  trustTxt: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkDim, lineHeight: 17 },
  trustStrong: { fontFamily: fonts.bold, color: colors.ink },

  submitInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 20, marginBottom: 8 },
  submitInfoTxt: { fontFamily: fonts.medium, fontSize: 10.5, color: colors.inkMute },
  submitButtons: { flexDirection: 'row', gap: 8, marginHorizontal: 16 },
  btn: { paddingVertical: 14, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnCancel: { flex: 1, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  btnCancelTxt: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  btnSubmit: { flex: 2, backgroundColor: colors.danger },
  btnSubmitDisabled: { backgroundColor: colors.line },
  btnSubmitTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
