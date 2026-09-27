import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Linking } from 'react-native';
import { BadgeCheck, BadgeX, FileText, Globe, RefreshCw, ShieldCheck, Users } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { EmptyState, LoadState, SectionTitle, form } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { decideVerification, isModerator, listFlaggedGroups, listPendingVerifications, lookupSiret, revokeVerification, subscribePro, verificationDocumentUrl } from '@/api/pro';
import { formatSiret } from '@/api/siret';
import { formatRideDate } from '@/api/payloads';
import type { FlaggedGroup, PendingVerification, RegistryLookup } from '@/api/types';
import { RegistryCard, frDate } from './RegistryCard';

/** File de modération IzenRide : demandes de badge « Organisation vérifiée ». */
export default function ModerationScreen() {
  const allowed = useQuery(isModerator, []);
  const queue = useQuery(() => (allowed.data ? listPendingVerifications() : []), [allowed.data], subscribePro);
  const flagged = useQuery(() => (allowed.data ? listFlaggedGroups() : []), [allowed.data], subscribePro);

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
      <Text style={styles.lead}>
        Le SIRET est vérifié automatiquement au registre des entreprises (Pappers). Contrôle que le justificatif correspond à la fiche, puis décide.
      </Text>
      {flagged.data && flagged.data.length > 0 ? (
        <>
          <SectionTitle>Badges à revoir</SectionTitle>
          <Text style={styles.lead}>Ces organisations vérifiées ne sont plus en activité au registre.</Text>
          <View style={{ gap: 12, marginBottom: 20 }}>
            {flagged.data.map((f) => (
              <FlaggedCard key={f.groupId} f={f} />
            ))}
          </View>
          <SectionTitle>Demandes en attente</SectionTitle>
        </>
      ) : null}
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

function FlaggedCard({ f }: { f: FlaggedGroup }) {
  const revoke = async () => {
    const reason = `Établissement fermé au registre des entreprises${f.registry.closedOn ? ` le ${frDate(f.registry.closedOn)}` : ''}.`;
    const ok = await dialog.confirm({
      title: `Retirer le badge de ${f.groupName} ?`,
      message: `Motif communiqué au fondateur : « ${reason} » Il pourra refaire une demande avec un SIRET en activité.`,
      confirmLabel: 'Retirer le badge',
    });
    if (ok) revokeVerification(f.groupId, reason).catch(dialog.error('Retrait impossible'));
  };
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{f.groupName}</Text>
      <Line icon={<FileText size={13} color={colors.inkMute} />} text={`${f.legalName} · SIRET ${formatSiret(f.siret)}`} />
      <Line icon={<BadgeCheck size={13} color={colors.inkMute} />} text={`Vérifié depuis le ${frDate(f.verifiedAt)}`} />
      <RegistryCard registry={f.registry} />
      <View style={styles.actions}>
        <Pressable onPress={revoke} style={[styles.btn, styles.ghost]}>
          <BadgeX size={15} color={colors.inkDim} />
          <Text style={styles.ghostTxt}>Retirer le badge</Text>
        </Pressable>
      </View>
    </View>
  );
}

function RequestCard({ r }: { r: PendingVerification }) {
  const [note, setNote] = useState('');
  // Nouvelle consultation du registre (ignore le cache).
  const [fresh, setFresh] = useState<RegistryLookup | null>(null);
  const [checking, setChecking] = useState(false);
  const recheck = async () => {
    setChecking(true);
    setFresh(await lookupSiret(r.siret, true));
    setChecking(false);
  };
  const registry = fresh && 'result' in fresh ? fresh.result : r.registry;
  const openDoc = async () => {
    const url = r.documentPath ? await verificationDocumentUrl(r.documentPath) : null;
    if (url) Linking.openURL(url);
    else dialog.info('Justificatif', r.documentPath ? `Fichier : ${r.documentPath}` : 'Aucun justificatif joint.');
  };
  const approve = async () => {
    const warning =
      !registry ? ' Attention : le SIRET n’a pas pu être vérifié au registre.'
      : registry.status === 'closed' ? ' Attention : l’établissement est fermé au registre.'
      : registry.status === 'not_found' ? ' Attention : le SIRET est introuvable au registre.'
      : '';
    const ok = await dialog.confirm({ title: `Vérifier ${r.groupName} ?`, message: `Le badge apparaîtra sur le groupe et ses sorties promues.${warning}`, confirmLabel: 'Vérifier' });
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
      <RegistryCard
        loading={checking}
        registry={registry}
        lookup={fresh && 'error' in fresh ? fresh : undefined}
        enteredName={r.legalName}
        footer={
          <Pressable onPress={recheck} style={styles.recheck} accessibilityLabel="Revérifier au registre">
            <RefreshCw size={12} color={colors.neonBright} />
            <Text style={styles.recheckTxt}>{registry ? 'Revérifier' : 'Vérifier au registre'}</Text>
          </Pressable>
        }
      />
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
  recheck: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8, alignSelf: 'flex-start' },
  recheckTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.neonBright },
  docTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.neonBright },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btn: { flex: 1, height: 42, borderRadius: radius.md, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  ghost: { borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.panelSoft },
  ghostTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.inkDim },
  primary: { backgroundColor: colors.neon },
  primaryTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
