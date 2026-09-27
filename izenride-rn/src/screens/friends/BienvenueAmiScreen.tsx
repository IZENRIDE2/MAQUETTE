import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Send, Check, Users, Bike, MessageCircle, Hand } from 'lucide-react-native';
import { Screen, AppBar, Avatar, PrimaryButton, GhostButton } from '@/components';
import { LoadState, SectionTitle, form } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { groupAction, listMyGroups } from '@/api/groups';
import { listMyFriendInvites, markFriendWelcomed, sendDirectMessage, subscribeFriends } from '@/api/friends';
import { parseFrenchDateTime } from '@/api/payloads';
import { ago } from '@/screens/groups/feed/context';
import type { GroupSummary } from '@/api/types';
import { friendRoutes } from './routes';
import { GroupChecklist } from './shared';

const TEMPLATES = ['Bienvenue sur IzenRide ! 🤘', 'Content de te voir ici, on roule bientôt ?', 'Bienvenue ! Je t’ai ouvert mes groupes, fais comme chez toi 😉'];

/**
 * « Souhaite la bienvenue à Léo » : 4 actions en 1 tap — message, V de
 * motard, invitation dans ses groupes, sortie à deux.
 */
export default function BienvenueAmiScreen({ inviteId }: { inviteId: string }) {
  const router = useRouter();
  const invites = useQuery(listMyFriendInvites, [], subscribeFriends);
  const groups = useQuery(listMyGroups, []);
  const invite = invites.data?.find((i) => i.id === inviteId);
  const [done, setDone] = useState<Record<string, boolean>>({});

  if (!invites.data || !groups.data) {
    return (
      <Screen>
        <AppBar title="Bienvenue" />
        <LoadState loading={!invites.error} error={invites.error} onRetry={invites.reload} />
      </Screen>
    );
  }
  if (!invite || invite.status !== 'claimed' || !invite.friend) {
    return (
      <Screen>
        <AppBar title="Bienvenue" />
        <LoadState loading={false} error={{ message: 'Cet ami n’est pas (ou plus) rattaché à ton invitation.' }} />
      </Screen>
    );
  }

  const friend = invite.friend;
  const succeeded = (key: string) => {
    setDone((d) => ({ ...d, [key]: true }));
    markFriendWelcomed(invite.id).catch(() => {});
  };

  return (
    <Screen>
      <AppBar title="Bienvenue" />
      <View style={styles.hero}>
        <Avatar label={friend.name[0]} size={76} ring />
        <Text style={styles.heroTitle}>{friend.name} vient d’arriver 🎉</Text>
        <Text style={styles.heroSub}>Grâce à ton invitation · {invite.claimedAt ? ago(invite.claimedAt) : ''}</Text>
      </View>

      <MessageBlock friendId={friend.id} done={done.message} onSent={() => succeeded('message')} />
      <WaveBlock friendId={friend.id} name={friend.name} done={done.wave} onSent={() => succeeded('wave')} />
      <GroupsBlock
        friendId={friend.id}
        name={friend.name}
        groups={groups.data}
        opened={invite.presetGroupIds}
        onDone={() => succeeded('groups')}
      />
      <RideBlock friendId={friend.id} name={friend.name} done={done.ride} onSent={() => succeeded('ride')} />

      <GhostButton label={`Ouvrir la conversation avec ${friend.name}`} icon={<MessageCircle size={16} color={colors.ink} />} onPress={() => router.push(friendRoutes.dm(friend.id))} style={{ marginTop: 22 }} />
    </Screen>
  );
}

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <View style={styles.block}>
      <View style={styles.blockHead}>
        {icon}
        <SectionTitle style={{ marginBottom: 0 }}>{title}</SectionTitle>
      </View>
      {children}
    </View>
  );
}

const Sent = ({ text }: { text: string }) => (
  <View style={styles.sent}>
    <Check size={14} color={colors.success} />
    <Text style={styles.sentTxt}>{text}</Text>
  </View>
);

function MessageBlock({ friendId, done, onSent }: { friendId: string; done?: boolean; onSent: () => void }) {
  const [text, setText] = useState(TEMPLATES[0]!);
  const send = () =>
    sendDirectMessage(friendId, 'text', text)
      .then(onSent)
      .catch(dialog.error('Message non envoyé'));
  return (
    <Block icon={<MessageCircle size={14} color={colors.neonBright} />} title="Un mot de bienvenue">
      <View style={styles.chips}>
        {TEMPLATES.map((t) => (
          <Pressable key={t} onPress={() => setText(t)} style={[styles.chip, text === t && styles.chipOn]}>
            <Text style={[styles.chipTxt, text === t && { color: colors.bg }]} numberOfLines={1}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.composer}>
        <TextInput value={text} onChangeText={setText} multiline maxLength={2000} style={[form.input, { flex: 1 }]} placeholderTextColor={colors.inkMute} />
        <Pressable onPress={send} disabled={!text.trim()} style={[styles.send, !text.trim() && { opacity: 0.5 }]} accessibilityLabel="Envoyer le message">
          <Send size={16} color="#fff" />
        </Pressable>
      </View>
      {done && <Sent text="Message envoyé" />}
    </Block>
  );
}

function WaveBlock({ friendId, name, done, onSent }: { friendId: string; name: string; done?: boolean; onSent: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const wave = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.35, useNativeDriver: true, speed: 40 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
    sendDirectMessage(friendId, 'wave').then(onSent).catch(dialog.error('Envoi impossible'));
  };
  return (
    <Block icon={<Hand size={14} color={colors.neonBright} />} title="Réaction rapide">
      <Pressable onPress={wave} style={styles.wave}>
        <Animated.Text style={[styles.waveEmoji, { transform: [{ scale }] }]}>🤘</Animated.Text>
        <Text style={styles.waveTxt}>Envoyer un V de motard à {name}</Text>
      </Pressable>
      {done && <Sent text="V envoyé !" />}
    </Block>
  );
}

function GroupsBlock({
  friendId,
  name,
  groups,
  opened,
  onDone,
}: {
  friendId: string;
  name: string;
  groups: GroupSummary[];
  opened: string[];
  onDone: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string[]>([]);
  const locked = [...opened, ...sentTo];

  const invite = async () => {
    setBusy(true);
    const direct: string[] = [];
    const proposed: string[] = [];
    const failed: string[] = [];
    const ok: string[] = [];
    for (const id of selected) {
      const g = groups.find((x) => x.id === id)!;
      try {
        const r = await groupAction(id, 'member', { user_id: friendId, intro: `${name} vient d’arriver sur IzenRide` });
        (r.mode === 'created' ? direct : proposed).push(g.name);
        ok.push(id);
      } catch (e) {
        failed.push(`${g.name} (${(e as Error).message})`);
      }
    }
    setBusy(false);
    setSentTo((s) => [...s, ...ok]);
    setSelected([]);
    if (direct.length || proposed.length) onDone();
    dialog.info(
      'Invitations envoyées',
      [direct.length ? `Invité dans : ${direct.join(', ')}.` : '', proposed.length ? `Proposé (validation d’un habilité) : ${proposed.join(', ')}.` : '', failed.length ? `Non envoyé : ${failed.join(' ; ')}` : '']
        .filter(Boolean)
        .join('\n'),
    );
  };

  return (
    <Block icon={<Users size={14} color={colors.neonBright} />} title="L’inviter dans tes groupes">
      {groups.length ? (
        <GroupChecklist groups={groups} selected={selected} locked={locked} lockedLabel={`Déjà ouvert à ${name}`} onToggle={(id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))} />
      ) : (
        <Text style={styles.muted}>Tu n’as pas encore de groupe.</Text>
      )}
      {selected.length > 0 && (
        <PrimaryButton label={busy ? 'Envoi…' : `Inviter dans ${selected.length} groupe${selected.length > 1 ? 's' : ''}`} onPress={invite} disabled={busy} style={{ marginTop: 12 }} />
      )}
    </Block>
  );
}

function RideBlock({ friendId, name, done, onSent }: { friendId: string; name: string; done?: boolean; onSent: () => void }) {
  const [title, setTitle] = useState(`Première sortie avec ${name}`);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [error, setError] = useState<string | null>(null);
  const send = () => {
    const startsAt = parseFrenchDateTime(date, time);
    if (!startsAt || Date.parse(startsAt) <= Date.now()) return setError('Choisis une date et une heure à venir (JJ/MM et HH:MM).');
    if (place.trim().length < 2) return setError('Indique le point de rendez-vous.');
    setError(null);
    sendDirectMessage(friendId, 'ride', null, { title: title.trim(), starts_at: startsAt, meeting_point: place.trim() })
      .then(onSent)
      .catch(dialog.error('Proposition impossible'));
  };
  return (
    <Block icon={<Bike size={14} color={colors.neonBright} />} title="Proposer une sortie à deux">
      <TextInput value={title} onChangeText={setTitle} maxLength={80} style={form.input} placeholderTextColor={colors.inkMute} />
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <TextInput value={date} onChangeText={setDate} placeholder="JJ/MM" placeholderTextColor={colors.inkMute} style={[form.input, { flex: 1.3 }]} />
        <TextInput value={time} onChangeText={setTime} placeholder="HH:MM" placeholderTextColor={colors.inkMute} style={[form.input, { flex: 1 }]} />
      </View>
      <TextInput value={place} onChangeText={setPlace} placeholder="Point de RDV · ex. Bastille" placeholderTextColor={colors.inkMute} style={[form.input, { marginTop: 10 }]} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton label="Proposer la sortie" onPress={send} style={{ marginTop: 12 }} />
      {done && <Sent text="Sortie proposée" />}
    </Block>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 8, marginBottom: 8 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, marginTop: 6 },
  heroSub: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim },
  block: { marginTop: 22 },
  blockHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  chips: { gap: 8, marginBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  wave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.35)',
  },
  waveEmoji: { fontSize: 30 },
  waveTxt: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  sent: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingLeft: 4 },
  sentTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.success },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkMute },
  error: { fontFamily: fonts.medium, fontSize: 12, color: colors.warn, marginTop: 6, paddingLeft: 4 },
});
