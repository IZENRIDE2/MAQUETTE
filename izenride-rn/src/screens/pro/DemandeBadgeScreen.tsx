import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { BadgeCheck, Clock, FileText, Paperclip, XCircle, Info } from 'lucide-react-native';
import { Screen, AppBar, PrimaryButton } from '@/components';
import { LoadState, SectionTitle, form } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { getGroupBundle } from '@/api/groups';
import { listVerificationRequests, requestVerification, subscribePro, uploadVerificationDocument } from '@/api/pro';
import { formatSiret, isValidSiret } from '@/api/siret';
import { formatRideDate } from '@/api/payloads';

/**
 * Badge « Organisation vérifiée » : le fondateur d'un groupe pro envoie
 * raison sociale, SIRET, site et justificatif ; l'équipe IzenRide valide.
 */
export default function DemandeBadgeScreen({ groupId }: { groupId: string }) {
  const bundle = useQuery(() => getGroupBundle(groupId), [groupId], subscribePro);
  const requests = useQuery(() => listVerificationRequests(groupId), [groupId], subscribePro);
  const b = bundle.data;

  if (!b || !requests.data) {
    return (
      <Screen>
        <AppBar title="Badge vérifié" />
        <LoadState loading={!bundle.error && !requests.error} error={bundle.error ?? requests.error} onRetry={bundle.reload} />
      </Screen>
    );
  }

  const last = requests.data[0];
  const founder = b.me.role.isFounder;

  return (
    <Screen>
      <AppBar title="Badge vérifié" />
      <View style={styles.hero}>
        <View style={[styles.badge, b.group.verifiedAt && styles.badgeOn]}>
          <BadgeCheck size={30} color={b.group.verifiedAt ? colors.cyan : colors.inkMute} />
        </View>
        <Text style={styles.title}>{b.group.name}</Text>
        <Text style={styles.lead}>
          Le badge montre aux riders que {b.group.name} est une organisation réelle (concession, moto-école, association) vérifiée par IzenRide.
        </Text>
      </View>

      {b.group.kind !== 'pro' ? (
        <Status icon={<Info size={16} color={colors.inkDim} />} title="Réservé aux groupes pro" text="Les groupes d’amis n’ont pas de badge." />
      ) : b.group.verifiedAt ? (
        <Status
          tone="good"
          icon={<BadgeCheck size={16} color={colors.cyan} />}
          title="Organisation vérifiée"
          text={`Depuis le ${formatRideDate(b.group.verifiedAt).split(' · ')[0]}. Le badge apparaît sur le groupe et ses sorties promues.`}
        />
      ) : last?.status === 'pending' ? (
        <Status
          tone="wait"
          icon={<Clock size={16} color={colors.warn} />}
          title="Demande en cours d’examen"
          text={`${last.legalName} · SIRET ${formatSiret(last.siret)}. Envoyée ${formatRideDate(last.createdAt).split(' · ')[0]}. Réponse sous 5 jours ouvrés.`}
        />
      ) : !founder ? (
        <Status icon={<Info size={16} color={colors.inkDim} />} title="Réservé au fondateur" text="Seul le fondateur du groupe peut demander le badge." />
      ) : (
        <>
          {last && (last.status === 'rejected' || last.status === 'revoked') && (
            <Status
              icon={<XCircle size={16} color={colors.inkDim} />}
              title={last.status === 'rejected' ? 'Demande précédente refusée' : 'Badge retiré'}
              text={last.reviewerNote ?? 'Sans motif précisé.'}
            />
          )}
          <RequestForm groupId={groupId} />
        </>
      )}
    </Screen>
  );
}

function Status({ icon, title, text, tone }: { icon: React.ReactNode; title: string; text: string; tone?: 'good' | 'wait' }) {
  return (
    <View style={[styles.status, tone === 'good' && styles.statusGood, tone === 'wait' && styles.statusWait]}>
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={styles.statusTitle}>{title}</Text>
        <Text style={styles.statusTxt}>{text}</Text>
      </View>
    </View>
  );
}

function RequestForm({ groupId }: { groupId: string }) {
  const [legalName, setLegalName] = useState('');
  const [siret, setSiret] = useState('');
  const [website, setWebsite] = useState('');
  const [doc, setDoc] = useState<{ uri: string; name: string; mimeType?: string | null } | null>(null);
  const [errors, setErrors] = useState<{ legalName?: string; siret?: string }>({});
  const [busy, setBusy] = useState(false);

  const pick = async () => {
    const r = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], copyToCacheDirectory: true });
    if (!r.canceled && r.assets[0]) setDoc({ uri: r.assets[0].uri, name: r.assets[0].name, mimeType: r.assets[0].mimeType });
  };

  const submit = async () => {
    const e: typeof errors = {};
    if (legalName.trim().length < 2) e.legalName = 'Indique la raison sociale.';
    if (!isValidSiret(siret)) e.siret = 'SIRET invalide : 14 chiffres avec clé de contrôle.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const path = doc ? await uploadVerificationDocument(groupId, doc) : null;
      await requestVerification(groupId, legalName.trim(), siret.replace(/\s/g, ''), website.trim() || null, path);
      await dialog.info('Demande envoyée', 'L’équipe IzenRide vérifie ton organisation. Tu seras prévenu de sa décision.');
    } catch (err) {
      dialog.error('Envoi impossible')(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SectionTitle style={{ marginTop: 22 }}>Ton organisation</SectionTitle>
      <TextInput value={legalName} onChangeText={setLegalName} placeholder="Raison sociale · ex. Bercy Motos SAS" placeholderTextColor={colors.inkMute} style={form.input} />
      {errors.legalName ? <Text style={styles.error}>{errors.legalName}</Text> : null}
      <TextInput
        value={siret}
        onChangeText={setSiret}
        placeholder="SIRET · 14 chiffres"
        placeholderTextColor={colors.inkMute}
        keyboardType="number-pad"
        maxLength={17}
        style={[form.input, { marginTop: 10 }]}
      />
      {errors.siret ? <Text style={styles.error}>{errors.siret}</Text> : null}
      <TextInput
        value={website}
        onChangeText={setWebsite}
        placeholder="Site web (optionnel)"
        placeholderTextColor={colors.inkMute}
        autoCapitalize="none"
        keyboardType="url"
        style={[form.input, { marginTop: 10 }]}
      />

      <SectionTitle style={{ marginTop: 22 }}>Justificatif</SectionTitle>
      <Pressable onPress={pick} style={styles.doc}>
        {doc ? <FileText size={18} color={colors.neonBright} /> : <Paperclip size={18} color={colors.inkDim} />}
        <Text style={[styles.docTxt, doc && { color: colors.ink }]} numberOfLines={1}>
          {doc ? doc.name : 'Kbis, statuts ou avis de situation INSEE (PDF ou photo)'}
        </Text>
      </Pressable>
      <Text style={styles.hint}>Visible uniquement par l’équipe IzenRide et le fondateur du groupe.</Text>

      <PrimaryButton label={busy ? 'Envoi…' : 'Demander le badge'} onPress={submit} disabled={busy} style={{ marginTop: 22 }} />
    </>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 8, marginBottom: 18 },
  badge: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  badgeOn: { backgroundColor: 'rgba(34,211,238,0.12)', borderColor: 'rgba(34,211,238,0.45)' },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink },
  lead: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, textAlign: 'center', lineHeight: 19 },
  status: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, marginTop: 8 },
  statusGood: { borderColor: 'rgba(34,211,238,0.4)' },
  statusWait: { borderColor: 'rgba(251,191,36,0.4)' },
  statusTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  statusTxt: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim, marginTop: 3, lineHeight: 18 },
  error: { fontFamily: fonts.medium, fontSize: 12, color: colors.warn, marginTop: 6, paddingLeft: 4 },
  doc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
    backgroundColor: colors.panelSoft,
  },
  docTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim },
  hint: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkMute, marginTop: 8, paddingHorizontal: 4 },
});

