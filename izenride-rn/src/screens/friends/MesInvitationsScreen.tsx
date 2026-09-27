import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Phone, AtSign, Share2, Users, X, RotateCcw, PartyPopper, MessageCircle, UserPlus } from 'lucide-react-native';
import { Screen, AppBar, PrimaryButton, Avatar } from '@/components';
import { EmptyState, LoadState, SectionTitle } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { listMyGroups } from '@/api/groups';
import { cancelFriendInvite, listMyFriendInvites, renewFriendInvite, subscribeFriends, updateFriendInviteGroups } from '@/api/friends';
import { formatRideDate } from '@/api/payloads';
import type { FriendInvite, GroupSummary } from '@/api/types';
import { friendRoutes } from './routes';
import { friendStyles, GroupChecklist, shareInvite } from './shared';

const STATUS: Record<FriendInvite['status'], { label: string; color: string }> = {
  pending: { label: 'En attente', color: colors.warn },
  claimed: { label: 'Inscrit', color: colors.success },
  expired: { label: 'Expirée', color: colors.inkMute },
  cancelled: { label: 'Annulée', color: colors.inkMute },
  unlinked: { label: 'Rattachement refusé', color: colors.inkMute },
};

/** Mes invitations : suivi, partage, groupes mémorisés, relance, annulation. */
export default function MesInvitationsScreen() {
  const router = useRouter();
  const invites = useQuery(listMyFriendInvites, [], subscribeFriends);
  const groups = useQuery(listMyGroups, []);
  const [editing, setEditing] = useState<FriendInvite | null>(null);

  if (!invites.data || !groups.data) {
    return (
      <Screen>
        <AppBar title="Mes invitations" />
        <LoadState loading={!invites.error} error={invites.error} onRetry={invites.reload} />
      </Screen>
    );
  }

  const joined = invites.data.filter((i) => i.status === 'claimed');
  const pending = invites.data.filter((i) => i.status === 'pending' || i.status === 'expired');
  const closed = invites.data.filter((i) => i.status === 'cancelled' || i.status === 'unlinked');

  return (
    <Screen>
      <AppBar title="Mes invitations" />
      <PrimaryButton label="Inviter un ami" icon={<UserPlus size={18} color="#fff" />} onPress={() => router.push(friendRoutes.invite())} />

      {invites.data.length === 0 && (
        <EmptyState icon={<Mail size={22} color={colors.neonBright} />} title="Aucune invitation" text="Invite tes potes : tu seras prévenu dès qu’ils arrivent." />
      )}
      {joined.length > 0 && <Section title={`Inscrits · ${joined.length}`} items={joined} groups={groups.data} onEdit={setEditing} />}
      {pending.length > 0 && <Section title={`En attente · ${pending.length}`} items={pending} groups={groups.data} onEdit={setEditing} />}
      {closed.length > 0 && <Section title="Terminées" items={closed} groups={groups.data} onEdit={setEditing} />}

      <EditGroups invite={editing} groups={groups.data} onClose={() => setEditing(null)} />
    </Screen>
  );
}

function Section({ title, items, groups, onEdit }: { title: string; items: FriendInvite[]; groups: GroupSummary[]; onEdit: (i: FriendInvite) => void }) {
  return (
    <>
      <SectionTitle style={{ marginTop: 22 }}>{title}</SectionTitle>
      <View style={{ gap: 10 }}>
        {items.map((i) => (
          <InviteCard key={i.id} invite={i} groups={groups} onEdit={() => onEdit(i)} />
        ))}
      </View>
    </>
  );
}

function InviteCard({ invite: i, groups, onEdit }: { invite: FriendInvite; groups: GroupSummary[]; onEdit: () => void }) {
  const router = useRouter();
  const st = STATUS[i.status];
  const names = groups.filter((g) => i.presetGroupIds.includes(g.id)).map((g) => g.name);

  const cancel = async () => {
    const ok = await dialog.confirm({ title: 'Annuler cette invitation ?', message: 'Le lien ne fonctionnera plus.', confirmLabel: 'Annuler l’invitation', destructive: true });
    if (ok) cancelFriendInvite(i.id).catch(dialog.error('Annulation impossible'));
  };
  const renew = () =>
    renewFriendInvite(i.id)
      .then(() => shareInvite(i.code))
      .catch(dialog.error('Relance impossible'));

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        {i.friend ? (
          <View style={styles.friend}>
            <Avatar label={i.friend.name[0]} size={34} />
            <Text style={styles.friendName}>{i.friend.name}</Text>
          </View>
        ) : (
          <Text style={styles.code}>{i.code}</Text>
        )}
        <View style={[friendStyles.pill, { borderColor: st.color + '66' }]}>
          <Text style={[friendStyles.pillTxt, { color: st.color }]}>{st.label}</Text>
        </View>
      </View>

      <View style={styles.meta}>
        {i.hasPhone ? <Phone size={12} color={colors.inkMute} /> : null}
        {i.hasEmail ? <AtSign size={12} color={colors.inkMute} /> : null}
        <Text style={styles.metaTxt}>
          {i.status === 'claimed' && i.claimedAt ? `Arrivé ${formatRideDate(i.claimedAt)}` : `Créée ${formatRideDate(i.createdAt)}`}
          {i.status === 'pending' ? ` · expire ${formatRideDate(i.expiresAt)}` : ''}
        </Text>
      </View>
      {names.length > 0 && (
        <View style={styles.meta}>
          <Users size={12} color={colors.inkMute} />
          <Text style={styles.metaTxt}>{names.join(', ')}</Text>
        </View>
      )}

      <View style={styles.actions}>
        {i.status === 'pending' && (
          <>
            <Action icon={<X size={14} color={colors.inkDim} />} label="Annuler" onPress={cancel} />
            <Action icon={<Users size={14} color={colors.inkDim} />} label="Groupes" onPress={onEdit} />
            <Action icon={<Share2 size={14} color="#fff" />} label="Partager" primary onPress={() => shareInvite(i.code)} />
          </>
        )}
        {i.status === 'expired' && (
          <>
            <Action icon={<X size={14} color={colors.inkDim} />} label="Supprimer" onPress={cancel} />
            <Action icon={<RotateCcw size={14} color="#fff" />} label="Relancer" primary onPress={renew} />
          </>
        )}
        {i.status === 'claimed' && i.acceptedBy && (
          i.welcomedAt ? (
            <Action icon={<MessageCircle size={14} color="#fff" />} label="Écrire" primary onPress={() => router.push(friendRoutes.dm(i.acceptedBy!))} />
          ) : (
            <Action icon={<PartyPopper size={14} color="#fff" />} label="Souhaiter la bienvenue" primary onPress={() => router.push(friendRoutes.welcome(i.id))} />
          )
        )}
      </View>
    </View>
  );
}

function Action({ icon, label, onPress, primary }: { icon: React.ReactNode; label: string; onPress: () => void; primary?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.action, primary && styles.actionPrimary]}>
      {icon}
      <Text style={[styles.actionTxt, primary && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

/** Groupes mémorisés, modifiables jusqu'à l'inscription de l'ami. */
function EditGroups({ invite, groups, onClose }: { invite: FriendInvite | null; groups: GroupSummary[]; onClose: () => void }) {
  const [selected, setSelected] = useState<string[] | null>(null);
  const current = selected ?? invite?.presetGroupIds ?? [];
  const close = () => {
    setSelected(null);
    onClose();
  };
  const save = () => {
    if (!invite) return;
    updateFriendInviteGroups(invite.id, current)
      .then(close)
      .catch(dialog.error('Modification impossible'));
  };
  return (
    <Modal visible={!!invite} transparent animationType="slide" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} />
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Groupes mémorisés</Text>
        <Text style={styles.sheetSub}>Ton ami les retrouvera à son arrivée.</Text>
        <GroupChecklist groups={groups} selected={current} onToggle={(id) => setSelected(current.includes(id) ? current.filter((x) => x !== id) : [...current, id])} />
        <PrimaryButton label="Enregistrer" onPress={save} style={{ marginTop: 14 }} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 14, gap: 6 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  code: { fontFamily: fonts.monoBold, fontSize: 16, letterSpacing: 2, color: colors.ink },
  friend: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  friendName: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 6 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 12, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.lineStrong },
  actionPrimary: { backgroundColor: colors.neon, borderColor: colors.neon },
  actionTxt: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.inkDim },
  backdrop: { flex: 1, backgroundColor: 'rgba(7,9,15,0.6)' },
  sheet: { backgroundColor: colors.bg2, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, borderWidth: 1, borderColor: colors.line, padding: 18, paddingBottom: 32 },
  sheetTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  sheetSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: 2, marginBottom: 12 },
});
