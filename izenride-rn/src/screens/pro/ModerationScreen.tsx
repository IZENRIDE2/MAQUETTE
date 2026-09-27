import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Linking } from 'react-native';
import { BadgeCheck, FileText, Globe, ShieldCheck, Users } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { EmptyState, LoadState, form } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { decideVerification, isModerator, listPendingVerifications, subscribePro, verificationDocumentUrl } from '@/api/pro';
import { formatSiret } from '@/api/siret';
import { formatRideDate } from '@/api/payloads';
import type { PendingVerification } from '@/api/types';

/** File de modération IzenRide : demandes de badge « Organisation vérifiée ». */
export default function ModerationScreen() {
  const allowed = useQuery(isModerator, []);
  const queue = useQuery(() => (allowed.data ? listPendingVerifications() : []), [allowed.data], subscribePro);

  if (allowed.data === undefined || !queue.data) {
    return (
      <Screen>
        <AppBar title="Modération" />
        <LoadState loading={!allowed.error && !queue.error} error={allowed.error ?? queue.error} onRetry={queue.reload} />
      </Screen>
    );
  }
  if (!allowed.data) {
    return (
      <Screen>
        <AppBar title="Modération" />
        <EmptyState icon={<ShieldCheck size={22} color={colors.inkMute} />} title="Réservé à l’équipe IzenRide" />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppBar title="Badges à vérifier" />
      <Text style={styles.lead}>Vérifie la raison sociale et le SIRET sur l’annuaire des entreprises, puis le justificatif.</Text>
      {queue.data.length === 0 ? (
        <EmptyState icon={<BadgeCheck size={22} color={colors.neonBright} />} title="File vide" text="Aucune demande en attente." />
      ) : (
        <View style={{ gap: 12 }}>
          {queue.data.map((r) => (
            <RequestCard key={r.id} r={r} />
          ))}
        </View>
      )}
    </Screen>
  );
}

function RequestCard({ r }: { r: PendingVerification }) {
  const [note, setNote] = useState('');
  const openDoc = async () => {
    const url = r.documentPath ? await verificationDocumentUrl(r.documentPath) : null;
    if (url) Linking.openURL(url);
    else dialog.info('Justificatif', r.documentPath ? `Fichier : ${r.documentPath}` : 'Aucun justificatif joint.');
  };
  const approve = async () => {
    const ok = await dialog.confirm({ title: `Vérifier ${r.groupName} ?`, message: 'Le badge apparaîtra sur le groupe et ses sorties promues.', confirmLabel: 'Vérifier' });
    if (ok) decideVerification(r.id, true, note || null).catch(dialog.error('Validation impossible'));
  };
  const reject = () => {
    if (!note.trim()) return dialog.info('Motif requis', 'Indique pourquoi la demande est refusée : le fondateur le verra.');
    decideVerification(r.id, false, note).catch(dialog.error('Refus impossible'));
  };
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{r.groupName}</Text>
      <Line icon={<FileText size={13} color={colors.inkMute} />} text={`${r.legalName} · SIRET ${formatSiret(r.siret)}`} />
      {r.website ? <Line icon={<Globe size={13} color={colors.inkMute} />} text={r.website} /> : null}
      <Line icon={<Users size={13} color={colors.inkMute} />} text={`${r.memberCount} membre${r.memberCount > 1 ? 's' : ''} · demandé ${formatRideDate(r.createdAt)}`} />
      <Pressable onPress={openDoc} style={styles.doc}>
        <FileText size={14} color={colors.neonBright} />
        <Text style={styles.docTxt}>{r.documentPath ? 'Ouvrir le justificatif' : 'Pas de justificatif'}</Text>
      </Pressable>
      <TextInput value={note} onChangeText={setNote} placeholder="Note ou motif de refus" placeholderTextColor={colors.inkMute} maxLength={500} style={[form.input, { marginTop: 10 }]} />
      <View style={styles.actions}>
        <Pressable onPress={reject} style={[styles.btn, styles.ghost]}>
          <Text style={styles.ghostTxt}>Refuser</Text>
        </Pressable>
        <Pressable onPress={approve} style={[styles.btn, styles.primary]}>
          <BadgeCheck size={15} color="#fff" />
          <Text style={styles.primaryTxt}>Vérifier</Text>
        </Pressable>
      </View>
    </View>
  );
}

const Line = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <View style={styles.line}>
    {icon}
    <Text style={styles.lineTxt}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  lead: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, marginBottom: 14, lineHeight: 19 },
  card: { padding: 14, borderRadius: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, gap: 5 },
  name: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, marginBottom: 2 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lineTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim },
  doc: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  docTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.neonBright },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btn: { flex: 1, height: 42, borderRadius: radius.md, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  ghost: { borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.panelSoft },
  ghostTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.inkDim },
  primary: { backgroundColor: colors.neon },
  primaryTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
