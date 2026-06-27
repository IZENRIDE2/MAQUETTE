import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  AlertTriangle,
  User,
  MapPin,
  MessageCircle,
  Calendar,
  ShoppingBag,
  ChevronRight,
  Clock,
  Download,
  Check,
  Lock,
  Trash2,
  Eye,
} from 'lucide-react-native';
import { Screen, AppBar, Panel, Divider } from '@/components';
import { colors, fonts, radius } from '@/theme';

const LOSSES = [
  { Icon: User, name: 'Profil & abonnés', detail: 'Photo, bio, badges, statut Pro', count: '142' },
  { Icon: MapPin, name: 'Trajets enregistrés', detail: 'Itinéraires, sorties, statistiques GPS', count: '87' },
  { Icon: MessageCircle, name: 'Conversations', detail: 'Messages, matchs, contacts riders', count: '23' },
  { Icon: Calendar, name: 'Événements créés', detail: 'Sorties annulées, participants notifiés', count: '5' },
  { Icon: ShoppingBag, name: 'Annonces marketplace', detail: 'Listings actifs retirés immédiatement', count: '3' },
];

const ALTS = [
  { name: 'Mettre en pause', detail: 'Profil masqué, données conservées' },
  { name: 'Exporter d\'abord', detail: 'Récupérer une copie de vos données (RGPD)' },
  { name: 'Contacter le support', detail: 'Un problème ? On peut peut-être aider' },
];

const REASONS = [
  'Je ne l\'utilise plus',
  'Confidentialité',
  'Trop de bugs',
  'J\'utilise une autre app',
  'Trop de notifications',
  'Autre raison',
];

const CONFIRMS = [
  'Je comprends que mes données seront définitivement effacées après 30 jours.',
  'Je comprends que cette action est irréversible au-delà de la période de grâce.',
  'J\'ai conscience que mes annonces et événements seront retirés immédiatement.',
];

/** Supprimer mon compte — assistant en 3 étapes (localisé Paris). */
export default function SupprimerMonCompteScreen() {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState<number | null>(null);
  const [confirms, setConfirms] = useState([false, false, false]);

  const toggleConfirm = (i: number) =>
    setConfirms((c) => c.map((v, idx) => (idx === i ? !v : v)));
  const allChecked = confirms.every(Boolean);

  return (
    <Screen scroll={step === 1 || step === 3} contentStyle={{ paddingBottom: 40 }}>
      <AppBar title="Supprimer mon compte" onBack={() => (step > 1 ? setStep(step - 1) : undefined)} />
      <View style={styles.subRow}>
        <View style={styles.dangerDot} />
        <Text style={styles.subTxt}>Action irréversible</Text>
      </View>

      {/* Step indicator */}
      <View style={styles.stepDots}>
        {[1, 2, 3].map((n) => (
          <View
            key={n}
            style={[
              styles.stepDot,
              n < step && { backgroundColor: colors.success },
              n === step && { backgroundColor: colors.danger },
            ]}
          />
        ))}
      </View>
      <Text style={styles.stepLabel}>
        Étape <Text style={{ color: colors.danger, fontFamily: fonts.bold }}>{step}</Text> sur 3 —{' '}
        {step === 1 ? "Comprendre l'impact" : step === 2 ? 'Période de grâce' : 'Confirmation finale'}
      </Text>

      {step === 1 && <Step1 onContinue={() => setStep(2)} />}
      {step === 2 && (
        <Step2 reason={reason} setReason={setReason} onBack={() => setStep(1)} onContinue={() => setStep(3)} />
      )}
      {step === 3 && (
        <Step3
          confirms={confirms}
          toggleConfirm={toggleConfirm}
          allChecked={allChecked}
          onKeep={() => setStep(1)}
        />
      )}
    </Screen>
  );
}

function WarningHero({ tint, Icon, title, subtitle, strong }: { tint: string; Icon: typeof AlertTriangle; title: string; subtitle: React.ReactNode; strong?: string }) {
  return (
    <View style={styles.hero}>
      <View style={[styles.heroIcon, { backgroundColor: tint + '20', borderColor: tint + '40' }]}>
        <Icon size={34} color={tint} />
      </View>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroSub}>{subtitle}</Text>
    </View>
  );
}

function Step1({ onContinue }: { onContinue: () => void }) {
  return (
    <>
      <WarningHero
        tint={colors.danger}
        Icon={AlertTriangle}
        title="Vous êtes sur le point de tout perdre"
        subtitle={
          <>
            La suppression de votre compte effacera{' '}
            <Text style={styles.heroStrong}>définitivement</Text> toutes vos données après une période de
            grâce de 30 jours.
          </>
        }
      />

      <Text style={styles.lossTitle}>Ce que vous allez perdre</Text>
      <Panel style={styles.list} pad={0}>
        {LOSSES.map((l, i) => (
          <View key={l.name} style={[styles.lossItem, i < LOSSES.length - 1 && styles.itemBorder]}>
            <View style={styles.lossIcon}>
              <l.Icon size={16} color={colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lossName}>{l.name}</Text>
              <Text style={styles.lossDetail}>{l.detail}</Text>
            </View>
            <View style={styles.lossCount}>
              <Text style={styles.lossCountTxt}>{l.count}</Text>
            </View>
          </View>
        ))}
      </Panel>

      <Text style={[styles.altTitle]}>Autres options moins radicales</Text>
      {ALTS.map((a, i) => (
        <Panel key={a.name} style={styles.altCard} pad={14} accent="rgba(77,143,255,0.18)">
          <View style={styles.altIcon}>
            {i === 0 ? <Eye size={18} color={colors.neon} /> : i === 1 ? <Download size={18} color={colors.neon} /> : <MessageCircle size={18} color={colors.neon} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.altName}>{a.name}</Text>
            <Text style={styles.altDetail}>{a.detail}</Text>
          </View>
          <ChevronRight size={14} color={colors.neon} />
        </Panel>
      ))}

      <View style={styles.actionRow}>
        <Pressable style={styles.btnCancel}>
          <Text style={styles.btnCancelTxt}>Annuler</Text>
        </Pressable>
        <Pressable style={styles.btnContinue} onPress={onContinue}>
          <Text style={styles.btnContinueTxt}>Continuer</Text>
          <ChevronRight size={14} color={colors.danger} />
        </Pressable>
      </View>
    </>
  );
}

function Step2({
  reason,
  setReason,
  onBack,
  onContinue,
}: {
  reason: number | null;
  setReason: (n: number) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <WarningHero
        tint={colors.warn}
        Icon={Clock}
        title="Période de grâce de 30 jours"
        subtitle={
          <>
            Votre compte sera <Text style={styles.heroStrong}>désactivé immédiatement</Text> mais vous gardez
            30 jours pour changer d'avis.
          </>
        }
      />

      <Panel style={styles.graceCard} accent="rgba(250,199,117,0.2)">
        <View style={styles.graceHeader}>
          <View style={styles.graceIcon}>
            <Clock size={22} color={colors.warn} />
          </View>
          <View>
            <Text style={styles.graceTitle}>Comment ça marche</Text>
            <Text style={styles.graceSub}>Aujourd'hui → 27 mai 2026</Text>
          </View>
        </View>

        <View style={styles.track}>
          <View style={[styles.marker, { left: 0, backgroundColor: colors.danger }]} />
          <View style={[styles.markerNow]} />
          <View style={[styles.marker, { right: 0, backgroundColor: colors.bgDeep, borderColor: colors.line, borderWidth: 2 }]} />
        </View>
        <View style={styles.trackLabels}>
          <Text style={[styles.trackLabel, { color: colors.danger }]}>Aujourd'hui · 27 avril</Text>
          <Text style={styles.trackLabel}>J+30 · 27 mai</Text>
        </View>

        <Divider style={{ marginVertical: 12 }} />
        <GraceBullet>
          Pendant <Text style={styles.graceStrong}>30 jours</Text>, reconnectez-vous pour{' '}
          <Text style={styles.graceStrong}>tout récupérer</Text> intégralement
        </GraceBullet>
        <GraceBullet>
          Votre profil est <Text style={styles.graceStrong}>invisible</Text> pour les autres riders dès
          maintenant
        </GraceBullet>
        <GraceBullet>
          Après <Text style={styles.graceStrong}>30 jours</Text>, suppression{' '}
          <Text style={{ color: colors.danger, fontFamily: fonts.bold }}>définitive et irréversible</Text>
        </GraceBullet>
      </Panel>

      <Text style={[styles.lossTitle, { color: colors.inkMute, marginTop: 24 }]}>
        Quelle est la raison ? (optionnel)
      </Text>
      <View style={styles.reasonGrid}>
        {REASONS.map((r, i) => (
          <Pressable key={r} style={{ width: '48%' }} onPress={() => setReason(i)}>
            <Panel style={styles.reasonCard} pad={14} accent={reason === i ? colors.danger : undefined}>
              {reason === i && (
                <View style={styles.reasonCheck}>
                  <Check size={9} color="#fff" strokeWidth={3.5} />
                </View>
              )}
              <Text style={styles.reasonTxt}>{r}</Text>
            </Panel>
          </Pressable>
        ))}
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.btnCancel} onPress={onBack}>
          <Text style={styles.btnCancelTxt}>Retour</Text>
        </Pressable>
        <Pressable style={styles.btnContinue} onPress={onContinue}>
          <Text style={styles.btnContinueTxt}>Continuer</Text>
          <ChevronRight size={14} color={colors.danger} />
        </Pressable>
      </View>
    </>
  );
}

function GraceBullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.bulletIcon}>
        <Check size={10} color={colors.warn} strokeWidth={3.5} />
      </View>
      <Text style={styles.bulletTxt}>{children}</Text>
    </View>
  );
}

function Step3({
  confirms,
  toggleConfirm,
  allChecked,
  onKeep,
}: {
  confirms: boolean[];
  toggleConfirm: (i: number) => void;
  allChecked: boolean;
  onKeep: () => void;
}) {
  return (
    <>
      <WarningHero
        tint={colors.danger}
        Icon={Lock}
        title="Confirmation finale"
        subtitle="Pour finaliser, saisissez votre mot de passe et confirmez ci-dessous."
      />

      <Panel style={styles.summaryCard} pad={14}>
        <SummaryRow label="Compte" value="christophe@izenride.com" />
        <SummaryRow label="Désactivation" value="Immédiate" valueColor={colors.warn} />
        <SummaryRow label="Suppression définitive" value="27 mai 2026" valueColor={colors.danger} last />
      </Panel>

      <View style={styles.pwExplainer}>
        <View style={styles.pwIcon}>
          <Lock size={16} color={colors.neon} />
        </View>
        <Text style={styles.pwTxt}>
          <Text style={{ color: colors.neon, fontFamily: fonts.bold }}>Sécurité.</Text> Votre mot de passe
          est requis pour vérifier que c'est bien vous qui demandez la suppression.
        </Text>
      </View>

      <Text style={styles.pwLabel}>Votre mot de passe</Text>
      <View style={styles.pwInput}>
        <Text style={styles.pwPlaceholder}>••••••••</Text>
        <Eye size={18} color={colors.inkMute} />
      </View>
      <Text style={styles.pwForgot}>Mot de passe oublié ?</Text>

      <Panel style={styles.confirmList} pad={0}>
        {CONFIRMS.map((c, i) => (
          <Pressable
            key={i}
            style={[styles.confirmItem, i < CONFIRMS.length - 1 && styles.itemBorder]}
            onPress={() => toggleConfirm(i)}
          >
            <View style={[styles.confirmBox, confirms[i] && styles.confirmBoxOn]}>
              {confirms[i] && <Check size={13} color="#fff" strokeWidth={3.5} />}
            </View>
            <Text style={styles.confirmTxt}>{c}</Text>
          </Pressable>
        ))}
      </Panel>

      <View style={styles.actionRow}>
        <Pressable style={styles.btnKeep} onPress={onKeep}>
          <Check size={14} color="#fff" />
          <Text style={styles.btnKeepTxt}>Garder mon compte</Text>
        </Pressable>
        <View style={[styles.btnDestructive, !allChecked && styles.btnDisabled]}>
          <Trash2 size={14} color={allChecked ? '#fff' : colors.inkMute} />
          <Text style={[styles.btnDestructiveTxt, !allChecked && { color: colors.inkMute }]}>
            Supprimer définitivement
          </Text>
        </View>
      </View>
    </>
  );
}

function SummaryRow({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
  return (
    <View style={[styles.summaryRow, !last && styles.itemBorder]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: -10, marginBottom: 16 },
  dangerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.danger },
  subTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.danger },

  stepDots: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  stepLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 },

  hero: { alignItems: 'center', paddingBottom: 20, paddingTop: 4 },
  heroIcon: { width: 72, height: 72, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, textAlign: 'center', marginBottom: 8 },
  heroSub: { fontFamily: fonts.medium, fontSize: 13.5, color: colors.inkMute, textAlign: 'center', lineHeight: 20 },
  heroStrong: { color: colors.ink, fontFamily: fonts.semibold },

  lossTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.danger, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  list: { marginBottom: 8 },
  lossItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  lossIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,92,122,0.08)', alignItems: 'center', justifyContent: 'center' },
  lossName: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  lossDetail: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute, lineHeight: 16 },
  lossCount: { paddingHorizontal: 9, paddingVertical: 4, backgroundColor: 'rgba(255,92,122,0.08)', borderWidth: 1, borderColor: 'rgba(255,92,122,0.15)', borderRadius: 8 },
  lossCountTxt: { fontFamily: fonts.bold, fontSize: 12, color: colors.danger },

  altTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.neon, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 24, marginBottom: 10 },
  altCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8, borderRadius: radius.md },
  altIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(77,143,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  altName: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink, marginBottom: 2 },
  altDetail: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute, lineHeight: 16 },

  actionRow: { flexDirection: 'row', gap: 8, marginTop: 24 },
  btnCancel: { flex: 1, paddingVertical: 14, borderRadius: radius.md, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  btnCancelTxt: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  btnContinue: { flex: 1.5, flexDirection: 'row', paddingVertical: 14, borderRadius: radius.md, backgroundColor: 'rgba(255,92,122,0.1)', borderWidth: 1, borderColor: 'rgba(255,92,122,0.3)', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnContinueTxt: { fontFamily: fonts.bold, fontSize: 14, color: colors.danger },

  graceCard: { backgroundColor: 'rgba(250,199,117,0.06)' },
  graceHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  graceIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(250,199,117,0.15)', alignItems: 'center', justifyContent: 'center' },
  graceTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginBottom: 2 },
  graceSub: { fontFamily: fonts.semibold, fontSize: 12, color: colors.warn },
  track: { height: 8, backgroundColor: colors.bgDeep, borderRadius: 4, borderWidth: 1, borderColor: colors.line, marginTop: 4, justifyContent: 'center' },
  marker: { position: 'absolute', width: 16, height: 16, borderRadius: 8, top: -5 },
  markerNow: { position: 'absolute', left: 0, width: 16, height: 16, borderRadius: 8, top: -5, backgroundColor: colors.warn },
  trackLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  trackLabel: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.4 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  bulletIcon: { width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(250,199,117,0.15)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  bulletTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 12.5, color: colors.ink, lineHeight: 19 },
  graceStrong: { color: colors.warn, fontFamily: fonts.bold },

  reasonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  reasonCard: { marginBottom: 8, alignItems: 'center', borderRadius: radius.md },
  reasonCheck: { position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  reasonTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink, textAlign: 'center', lineHeight: 16 },

  summaryCard: {},
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  summaryLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute },
  summaryValue: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },

  pwExplainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 14, marginTop: 20, marginBottom: 16 },
  pwIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(77,143,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  pwTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 12.5, color: colors.ink, lineHeight: 18 },
  pwLabel: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  pwInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 16 },
  pwPlaceholder: { fontFamily: fonts.regular, fontSize: 15, color: colors.inkMute, letterSpacing: 2 },
  pwForgot: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.neon, textAlign: 'center', marginTop: 8 },

  confirmList: { marginTop: 20 },
  confirmItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  confirmBox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.inkMute, backgroundColor: colors.bgDeep, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  confirmBoxOn: { backgroundColor: colors.danger, borderColor: colors.danger },
  confirmTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 12.5, color: colors.ink, lineHeight: 18 },

  btnKeep: { flex: 1, flexDirection: 'row', paddingVertical: 14, borderRadius: radius.md, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnKeepTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  btnDestructive: { flex: 1.5, flexDirection: 'row', paddingVertical: 14, borderRadius: radius.md, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnDisabled: { backgroundColor: colors.bg2 },
  btnDestructiveTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
});
