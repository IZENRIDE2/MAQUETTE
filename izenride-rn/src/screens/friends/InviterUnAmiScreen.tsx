import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { Info, Share2, ShieldCheck } from 'lucide-react-native';
import { Screen, AppBar, PrimaryButton, GhostButton } from '@/components';
import { LoadState, SectionTitle, form } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { listMyGroups } from '@/api/groups';
import { createFriendInvite } from '@/api/friends';
import { inviteUrl, normalizeEmail, normalizePhone } from '@/api/contacts';
import { friendRoutes } from './routes';
import { friendStyles, GroupChecklist, shareInvite } from './shared';

/**
 * Inviter un ami : téléphone / email optionnels (rattachement même sans le
 * lien), groupes mémorisés dès la création, puis lien personnel + QR code.
 */
export default function InviterUnAmiScreen({ presetGroupId }: { presetGroupId?: string }) {
  const router = useRouter();
  const groups = useQuery(listMyGroups, []);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState<string[]>(presetGroupId ? [presetGroupId] : []);
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{ id: string; code: string } | null>(null);

  if (!groups.data) {
    return (
      <Screen>
        <AppBar title="Inviter un ami" />
        <LoadState loading={!groups.error} error={groups.error} onRetry={groups.reload} />
      </Screen>
    );
  }

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const create = async () => {
    const e: typeof errors = {};
    if (phone.trim() && !normalizePhone(phone)) e.phone = 'Numéro invalide (ex. 06 12 34 56 78).';
    if (email.trim() && !normalizeEmail(email)) e.email = 'Adresse email invalide.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      setCreated(await createFriendInvite(phone.trim() || null, email.trim() || null, selected));
    } catch (err) {
      dialog.error('Invitation impossible')(err);
    } finally {
      setBusy(false);
    }
  };

  if (created) {
    const names = groups.data.filter((g) => selected.includes(g.id)).map((g) => g.name);
    return (
      <Screen>
        <AppBar title="Ton invitation" />
        <Text style={styles.lead}>Fais scanner ce QR code au point de RDV, ou partage le lien.</Text>
        <View style={styles.qrWrap}>
          <View style={styles.qr}>
            <QRCode value={inviteUrl(created.code)} size={200} color="#0a0e15" backgroundColor="#ffffff" />
          </View>
          <Text style={styles.code} selectable>
            {created.code}
          </Text>
          <Text style={styles.url} selectable>
            {inviteUrl(created.code)}
          </Text>
        </View>
        {names.length > 0 && (
          <View style={friendStyles.note}>
            <Info size={14} color={colors.neonBright} />
            <Text style={friendStyles.noteTxt}>Groupes mémorisés : {names.join(', ')}. Ton ami pourra les rejoindre en 1 tap dès son inscription.</Text>
          </View>
        )}
        <PrimaryButton label="Partager le lien" icon={<Share2 size={18} color="#fff" />} onPress={() => shareInvite(created.code)} style={{ marginTop: 18 }} />
        <GhostButton label="Voir mes invitations" onPress={() => router.replace(friendRoutes.invites())} style={{ marginTop: 10 }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppBar title="Inviter un ami" />
      <Text style={styles.lead}>Ton ami reçoit un lien personnel. Dès son inscription, tu es prévenu et il retrouve les groupes que tu choisis ici.</Text>

      <SectionTitle style={{ marginTop: 18 }}>Pour le reconnaître (optionnel)</SectionTitle>
      <TextInput value={phone} onChangeText={setPhone} placeholder="Téléphone · 06 12 34 56 78" placeholderTextColor={colors.inkMute} keyboardType="phone-pad" style={form.input} />
      {errors.phone ? <Text style={friendStyles.error}>{errors.phone}</Text> : null}
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email · prenom@mail.fr"
        placeholderTextColor={colors.inkMute}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[form.input, { marginTop: 10 }]}
      />
      {errors.email ? <Text style={friendStyles.error}>{errors.email}</Text> : null}
      <View style={styles.privacy}>
        <ShieldCheck size={14} color={colors.success} />
        <Text style={styles.privacyTxt}>
          Jamais stockés en clair : seule une empreinte chiffrée sert à le reconnaître s’il s’inscrit sans le lien. Effacée à son arrivée ou
          au bout de 30 jours.
        </Text>
      </View>

      <SectionTitle style={{ marginTop: 22 }}>Dans quels groupes l’inviter ?</SectionTitle>
      {groups.data.length ? (
        <GroupChecklist groups={groups.data} selected={selected} onToggle={toggle} />
      ) : (
        <Text style={styles.lead}>Tu n’as pas encore de groupe.</Text>
      )}

      <PrimaryButton label={busy ? 'Création…' : 'Créer mon lien d’invitation'} onPress={create} disabled={busy} style={{ marginTop: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 19 },
  privacy: { flexDirection: 'row', gap: 8, marginTop: 10, paddingHorizontal: 4 },
  privacyTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkMute, lineHeight: 16 },
  qrWrap: { alignItems: 'center', marginVertical: 22, gap: 10 },
  qr: { padding: 14, borderRadius: 20, backgroundColor: '#ffffff' },
  code: { fontFamily: fonts.monoBold, fontSize: 24, letterSpacing: 4, color: colors.neonBright },
  url: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkMute },
});
