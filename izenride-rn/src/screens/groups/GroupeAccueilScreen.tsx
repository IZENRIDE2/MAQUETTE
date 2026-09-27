import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Settings2,
  MessageCircle,
  Bike,
  Users,
  Info,
  Search,
  UserPlus,
  Plus,
  MapPin,
  ScrollText,
  LogOut,
  VolumeX,
  Volume2,
  UserMinus,
  Crown,
  Shield,
  Send,
  Megaphone,
} from 'lucide-react-native';
import { Screen, AppBar, Panel, Avatar, PrimaryButton, GhostButton, SectionLabel } from '@/components';
import { GroupAvatar, RoleBadge, VerifiedBadge, ActionSheet, SheetAction, EmptyState, LoadState, DemoUserSwitcher } from '@/components/groups';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import {
  getGroupBundle,
  can,
  canActOn,
  manageableRoles,
  assignRole,
  muteMember,
  removeMember,
  transferFounder,
  updateGroup,
  leaveGroup,
} from '@/api/groups';
import { isDemo } from '@/api/supabase';
import type { GroupBundle, GroupMember } from '@/api/types';
import { groupRoutes, GroupTab } from './routes';

const TABS: { key: GroupTab; label: string; Icon: typeof Users }[] = [
  { key: 'chat', label: 'Chat', Icon: MessageCircle },
  { key: 'sorties', label: 'Sorties', Icon: Bike },
  { key: 'membres', label: 'Membres', Icon: Users },
  { key: 'infos', label: 'Infos', Icon: Info },
];

/** Permissions qui donnent accès au tableau de bord « Gérer ». */
const MANAGE_PERMS = ['group.edit', 'roles.manage', 'member.remove', 'member.assign_role', 'insights.view'] as const;
export const canManage = (b: GroupBundle) => MANAGE_PERMS.some((p) => can(b, p));

const since = (iso: string) => {
  const d = Math.floor((Date.now() - Date.parse(iso)) / 864e5);
  if (d < 1) return 'aujourd’hui';
  if (d < 30) return `il y a ${d} j`;
  const m = Math.floor(d / 30);
  return m < 12 ? `il y a ${m} mois` : `il y a ${Math.floor(m / 12)} an${m >= 24 ? 's' : ''}`;
};
const isMuted = (m: GroupMember) => !!m.mutedUntil && Date.parse(m.mutedUntil) > Date.now();
const fail = (title: string) => (e: unknown) => Alert.alert(title, (e as Error).message);

/** Accueil d'un groupe : en-tête + onglets Chat, Sorties, Membres, Infos. */
export default function GroupeAccueilScreen({ groupId, initialTab = 'chat' }: { groupId: string; initialTab?: GroupTab }) {
  const router = useRouter();
  const [tab, setTab] = useState<GroupTab>(initialTab);
  const { data: b, error, loading, reload } = useQuery(() => getGroupBundle(groupId), [groupId]);

  if (!b) {
    return (
      <Screen>
        <AppBar title="Groupe" />
        <LoadState loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  }

  const { group } = b;
  const roleName = (userId: string) => b.roles.find((r) => r.id === b.members.find((m) => m.userId === userId)?.roleId)?.name ?? '—';

  return (
    <Screen scroll={tab !== 'chat'} edges={['top', 'bottom']}>
      <AppBar
        title={group.name}
        right={
          canManage(b) ? (
            <Pressable onPress={() => router.push(groupRoutes.manage(groupId))} style={styles.manageBtn}>
              <Settings2 size={18} color={colors.ink} />
            </Pressable>
          ) : undefined
        }
      />
      <DemoUserSwitcher memberIds={b.members.map((m) => m.userId)} roleNameOf={roleName} />

      {/* En-tête */}
      <View style={styles.hero}>
        <GroupAvatar name={group.name} kind={group.kind} size={60} verified={!!group.verifiedAt} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={styles.heroMeta}>
            <Text style={styles.heroKind}>{group.kind === 'pro' ? 'Organisation pro' : 'Groupe d’amis'}</Text>
            {group.verifiedAt ? <VerifiedBadge /> : null}
          </View>
          <Text style={styles.heroCount}>
            {b.members.length} membre{b.members.length > 1 ? 's' : ''} · privé
          </Text>
          <RoleBadge name={`Toi : ${b.me.role.name}`} color={b.me.role.color} small />
        </View>
      </View>

      {/* Onglets */}
      <View style={styles.tabs}>
        {TABS.map(({ key, label, Icon }) => {
          const on = key === tab;
          return (
            <Pressable key={key} onPress={() => setTab(key)} style={[styles.tab, on && styles.tabOn]}>
              <Icon size={14} color={on ? colors.bg : colors.inkDim} />
              <Text style={[styles.tabTxt, on && { color: colors.bg }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      {tab === 'chat' && <ChatTab b={b} />}
      {tab === 'sorties' && <SortiesTab b={b} />}
      {tab === 'membres' && <MembresTab b={b} />}
      {tab === 'infos' && <InfosTab b={b} onManage={() => router.push(groupRoutes.manage(groupId))} onLeft={() => router.back()} />}
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// Chat — le fil et ses cartes de suggestion arrivent au lot 2.
// ---------------------------------------------------------------------------
const DEMO_CHAT = [
  { who: 'Marc', text: 'Vendredi on part à 21h30 de Bastille, ok pour tout le monde ?', mine: false },
  { who: 'Sarah', text: 'Go ! Je propose de passer par les quais puis Montmartre 🏍️', mine: false },
  { who: 'Julie', text: 'Parfait, je ramène Léo, il vient d’arriver sur l’app 🤘', mine: true },
];

function ChatTab({ b }: { b: GroupBundle }) {
  const muted = isMuted(b.members.find((m) => m.userId === b.me.userId)!);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
        {isDemo ? (
          DEMO_CHAT.map((m, i) => (
            <View key={i} style={[styles.bubbleRow, m.mine && { justifyContent: 'flex-end' }]}>
              {!m.mine && <Avatar label={m.who[0]} size={28} />}
              <View style={[styles.bubble, m.mine ? styles.bubbleMine : styles.bubbleOther]}>
                {!m.mine && <Text style={styles.bubbleWho}>{m.who}</Text>}
                <Text style={styles.bubbleTxt}>{m.text}</Text>
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon={<MessageCircle size={22} color={colors.neonBright} />}
            title="Le chat du groupe arrive bientôt"
            text="Messages, sondages et cartes de suggestion seront ajoutés dans la prochaine version."
          />
        )}
      </ScrollView>
      <View style={styles.composer}>
        <Text style={styles.composerTxt}>{muted ? 'Tu es en sourdine dans ce groupe.' : 'Écrire au groupe…'}</Text>
        <View style={styles.sendBtn}>
          <Send size={16} color={colors.inkMute} />
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Sorties — le libellé suit la permission : « Créer » ou « Proposer ».
// ---------------------------------------------------------------------------
const DEMO_RIDES = [
  { title: 'Night ride Montmartre', when: 'Ven. 21h30', where: 'Bastille', going: 6 },
  { title: 'Vallée de Chevreuse', when: 'Dim. 9h00', where: 'Porte de Saint-Cloud', going: 4 },
];

function SortiesTab({ b }: { b: GroupBundle }) {
  const direct = can(b, 'ride.create');
  const cta = direct ? 'Créer une sortie' : 'Proposer une sortie';
  const soon = () =>
    Alert.alert(
      cta,
      direct
        ? 'La création de sorties arrive avec la prochaine version.'
        : 'Ta proposition sera envoyée aux membres habilités, qui pourront l’accepter en 1 clic. Arrive avec la prochaine version.',
    );
  return (
    <View>
      <PrimaryButton label={cta} icon={<Plus size={18} color="#fff" />} onPress={soon} />
      {!direct && <Text style={styles.hint}>Ton rôle ne publie pas directement : ta sortie sera validée par un habilité.</Text>}
      {b.group.kind === 'pro' && (
        <View style={styles.proNote}>
          <Megaphone size={14} color={colors.cyan} />
          <Text style={styles.proNoteTxt}>Les sorties de l’organisation sont aussi promues dans Événements, sauf si « Réservée aux membres ».</Text>
        </View>
      )}
      <SectionLabel style={{ marginTop: 20 }}>À venir</SectionLabel>
      {isDemo ? (
        DEMO_RIDES.map((r) => (
          <Panel key={r.title} pad={14} style={{ marginBottom: 10 }}>
            <Text style={styles.rideTitle}>{r.title}</Text>
            <Text style={styles.rideMeta}>
              {r.when} · RDV {r.where} · {r.going} inscrits
            </Text>
          </Panel>
        ))
      ) : (
        <EmptyState icon={<Bike size={22} color={colors.neonBright} />} title="Aucune sortie prévue" text="Les sorties du groupe restent visibles des seuls membres." />
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Membres — groupés par rôle, actions par appui long selon le rang.
// ---------------------------------------------------------------------------
function MembresTab({ b }: { b: GroupBundle }) {
  const [q, setQ] = useState('');
  const [target, setTarget] = useState<GroupMember | null>(null);
  const [rolePicker, setRolePicker] = useState<GroupMember | null>(null);
  const gid = b.group.id;

  const sections = useMemo(() => {
    const query = q.trim().toLowerCase();
    return b.roles
      .map((role) => ({
        role,
        members: b.members
          .filter((m) => m.roleId === role.id && (!query || m.profile.name.toLowerCase().includes(query)))
          .sort((x, y) => x.profile.name.localeCompare(y.profile.name)),
      }))
      .filter((s) => s.members.length > 0);
  }, [b, q]);

  const actionsFor = (m: GroupMember): SheetAction[] => {
    const acts: SheetAction[] = [];
    if (canActOn(b, m.userId, 'member.assign_role') && manageableRoles(b).length > 1) {
      acts.push({ label: 'Changer de rôle', icon: <Shield size={18} color={colors.ink} />, onPress: () => setRolePicker(m) });
    }
    if (canActOn(b, m.userId, 'member.remove')) {
      if (isMuted(m)) {
        acts.push({ label: 'Réactiver', icon: <Volume2 size={18} color={colors.ink} />, onPress: () => muteMember(gid, m.userId, null).catch(fail('Action impossible')) });
      } else {
        acts.push({
          label: 'Sourdine 24 h',
          hint: 'Ne peut plus écrire dans le chat',
          icon: <VolumeX size={18} color={colors.ink} />,
          onPress: () => muteMember(gid, m.userId, new Date(Date.now() + 864e5).toISOString()).catch(fail('Action impossible')),
        });
        acts.push({
          label: 'Sourdine 7 jours',
          icon: <VolumeX size={18} color={colors.ink} />,
          onPress: () => muteMember(gid, m.userId, new Date(Date.now() + 7 * 864e5).toISOString()).catch(fail('Action impossible')),
        });
      }
      acts.push({
        label: 'Retirer du groupe',
        destructive: true,
        icon: <UserMinus size={18} color={colors.danger} />,
        onPress: () =>
          Alert.alert(`Retirer ${m.profile.name} ?`, 'Il ne verra plus le groupe. Tu pourras le réinviter.', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Retirer', style: 'destructive', onPress: () => removeMember(gid, m.userId).catch(fail('Retrait impossible')) },
          ]),
      });
    }
    if (b.me.role.isFounder && m.userId !== b.me.userId) {
      acts.push({
        label: 'Transférer le rôle de fondateur',
        hint: 'Tu deviendras le rôle juste en dessous',
        icon: <Crown size={18} color={colors.warn} />,
        onPress: () =>
          Alert.alert(`Faire de ${m.profile.name} le fondateur ?`, 'Il aura tous les droits, et toi ceux du rôle juste en dessous.', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Transférer', onPress: () => transferFounder(gid, m.userId).catch(fail('Transfert impossible')) },
          ]),
      });
    }
    return acts;
  };

  const inviteDirect = can(b, 'member.invite');
  const invite = () =>
    Alert.alert(
      inviteDirect ? 'Inviter' : 'Proposer un membre',
      inviteDirect
        ? 'Les invitations (ami IzenRide, lien, QR code) arrivent avec la prochaine version.'
        : 'Ta proposition sera validée en 1 clic par un membre habilité. Arrive avec la prochaine version.',
    );

  const targetActions = target ? actionsFor(target) : [];

  return (
    <View>
      <View style={styles.memberTools}>
        <View style={styles.search}>
          <Search size={14} color={colors.inkMute} />
          <TextInput value={q} onChangeText={setQ} placeholder="Rechercher un membre" placeholderTextColor={colors.inkMute} style={styles.searchInput} />
        </View>
        <Pressable onPress={invite} style={styles.inviteBtn}>
          <UserPlus size={16} color="#fff" />
          <Text style={styles.inviteTxt}>{inviteDirect ? 'Inviter' : 'Proposer'}</Text>
        </Pressable>
      </View>

      {sections.map(({ role, members }) => (
        <View key={role.id} style={{ marginTop: 16 }}>
          <View style={styles.roleHead}>
            <RoleBadge name={role.name} color={role.color} />
            <Text style={styles.roleCount}>{members.length}</Text>
          </View>
          <Panel pad={4}>
            {members.map((m, i) => {
              const acts = actionsFor(m);
              return (
                <Pressable
                  key={m.userId}
                  onPress={() => acts.length && setTarget(m)}
                  onLongPress={() => acts.length && setTarget(m)}
                  style={({ pressed }) => [styles.memberRow, i > 0 && styles.memberSep, pressed && acts.length > 0 && { opacity: 0.7 }]}
                >
                  <Avatar label={m.profile.name[0]} size={38} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberName}>
                      {m.profile.name}
                      {m.userId === b.me.userId ? <Text style={styles.me}>  · toi</Text> : null}
                    </Text>
                    <Text style={styles.memberSub}>A rejoint {since(m.joinedAt)}</Text>
                  </View>
                  {isMuted(m) ? <VolumeX size={16} color={colors.inkMute} /> : null}
                  {acts.length > 0 ? <Text style={styles.more}>•••</Text> : null}
                </Pressable>
              );
            })}
          </Panel>
        </View>
      ))}
      {sections.length === 0 && <EmptyState icon={<Search size={22} color={colors.neonBright} />} title="Aucun membre trouvé" />}

      <ActionSheet
        visible={!!target}
        title={target?.profile.name}
        subtitle={target ? `Rôle actuel : ${b.roles.find((r) => r.id === target.roleId)?.name}` : undefined}
        actions={targetActions}
        onClose={() => setTarget(null)}
      />
      <ActionSheet
        visible={!!rolePicker}
        title={rolePicker ? `Rôle de ${rolePicker.profile.name}` : undefined}
        subtitle="Seuls les rôles de rang inférieur au tien sont proposés"
        actions={manageableRoles(b)
          .filter((r) => r.id !== rolePicker?.roleId)
          .map((r) => ({
            label: r.name,
            icon: <View style={[styles.swatch, { backgroundColor: r.color }]} />,
            onPress: () => rolePicker && assignRole(gid, rolePicker.userId, r.id).catch(fail('Changement impossible')),
          }))}
        onClose={() => setRolePicker(null)}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Infos — édition en place si `group.edit`.
// ---------------------------------------------------------------------------
function InfosTab({ b, onManage, onLeft }: { b: GroupBundle; onManage: () => void; onLeft: () => void }) {
  const editable = can(b, 'group.edit');
  const [editing, setEditing] = useState(false);
  const fromGroup = () => ({ name: b.group.name, description: b.group.description ?? '', rules: b.group.rules ?? '', meetingPoint: b.group.meetingPoint ?? '' });
  const [draft, setDraft] = useState(fromGroup);
  const startEditing = () => {
    setDraft(fromGroup());
    setEditing(true);
  };

  const save = async () => {
    try {
      await updateGroup(b.group.id, draft);
      setEditing(false);
    } catch (e) {
      fail('Enregistrement impossible')(e);
    }
  };

  const leave = () =>
    Alert.alert('Quitter le groupe ?', b.me.role.isFounder && b.members.length === 1 ? 'Tu es seul : le groupe sera supprimé.' : undefined, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Quitter',
        style: 'destructive',
        onPress: () =>
          leaveGroup(b.group.id)
            .then(onLeft)
            .catch(fail('Impossible de quitter')),
      },
    ]);

  const field = (key: keyof typeof draft, label: string, Icon: typeof Info, placeholder: string, multiline = false) => (
    <View style={{ marginBottom: 14 }}>
      <View style={styles.fieldHead}>
        <Icon size={14} color={colors.inkDim} />
        <Text style={styles.fieldLbl}>{label}</Text>
      </View>
      {editing ? (
        <TextInput
          value={draft[key]}
          onChangeText={(v) => setDraft((d) => ({ ...d, [key]: v }))}
          placeholder={placeholder}
          placeholderTextColor={colors.inkMute}
          multiline={multiline}
          style={[styles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
        />
      ) : (
        <Text style={[styles.fieldVal, !b.group[key] && { color: colors.inkMute }]}>{(b.group[key] as string | null) || placeholder}</Text>
      )}
    </View>
  );

  return (
    <View>
      <Panel pad={16}>
        {editing && field('name', 'Nom', Users, 'Nom du groupe')}
        {field('description', 'Description', Info, 'Pas encore de description', true)}
        {field('rules', 'Règles', ScrollText, 'Pas de règles pour l’instant', true)}
        {field('meetingPoint', 'Lieu de RDV habituel', MapPin, 'Non renseigné')}
        {editable &&
          (editing ? (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <GhostButton label="Annuler" onPress={() => setEditing(false)} style={{ flex: 1, height: 46 }} />
              <PrimaryButton label="Enregistrer" onPress={save} style={{ flex: 1 }} />
            </View>
          ) : (
            <GhostButton label="Modifier les infos" onPress={startEditing} style={{ height: 46 }} />
          ))}
      </Panel>

      {canManage(b) && <GhostButton label="Gérer le groupe" icon={<Settings2 size={16} color={colors.ink} />} onPress={onManage} style={{ marginTop: 14 }} />}
      <Pressable onPress={leave} style={styles.leave}>
        <LogOut size={16} color={colors.danger} />
        <Text style={styles.leaveTxt}>Quitter le groupe</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  manageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroKind: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 1 },
  heroCount: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: radius.pill },
  tabOn: { backgroundColor: colors.ink },
  tabTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 10 },
  bubble: { maxWidth: '78%', paddingVertical: 9, paddingHorizontal: 12, borderRadius: radius.lg },
  bubbleOther: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 6 },
  bubbleMine: { backgroundColor: colors.neon, borderBottomRightRadius: 6 },
  bubbleWho: { fontFamily: fonts.semibold, fontSize: 11, color: colors.neonBright, marginBottom: 2 },
  bubbleTxt: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 19 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 8,
  },
  composerTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute },
  sendBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: 8, textAlign: 'center' },
  proNote: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: 'rgba(34,211,238,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.25)',
  },
  proNoteTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.cyanLight, lineHeight: 17 },
  rideTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  rideMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: 4 },
  memberTools: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontFamily: fonts.regular, fontSize: 14, color: colors.ink },
  inviteBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 42, borderRadius: radius.md, backgroundColor: colors.neon },
  inviteTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  roleHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  roleCount: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.inkMute },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 10 },
  memberSep: { borderTopWidth: 1, borderTopColor: colors.line },
  memberName: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  me: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute },
  memberSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 2 },
  more: { fontFamily: fonts.bold, fontSize: 14, color: colors.inkMute, letterSpacing: 1, paddingHorizontal: 4 },
  swatch: { width: 14, height: 14, borderRadius: 7 },
  fieldHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  fieldLbl: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 1 },
  fieldVal: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 20 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
  },
  leave: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, marginTop: 8 },
  leaveTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.danger },
});
