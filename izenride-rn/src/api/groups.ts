/**
 * API Groupes — point d'entrée unique des écrans.
 * Supabase si configuré, sinon mode démo (mêmes règles, données locales).
 */
import { supabase, isDemo, PROFILES_TABLE, PROFILES_NAME_COLUMN } from './supabase';
import * as demo from './demoStore';
import * as demoFeed from './demoFeed';
import { GroupError, toGroupError } from './errors';
import { PERMISSIONS, Permission } from './permissions';
import { TYPE_META } from './payloads';
import type {
  ActivityEntry,
  AnyPayload,
  ChatMessage,
  DecisionResult,
  GroupActionResult,
  GroupFeed,
  NotificationPrefs,
  PayloadOf,
  ReceivedInvite,
  Suggestion,
  SuggestionType,
  Group,
  GroupBundle,
  GroupKind,
  GroupPatch,
  GroupRole,
  GroupSummary,
  Profile,
  RoleInput,
} from './types';

// ---------------------------------------------------------------------------
// Abonnement aux changements (rechargement des écrans après une mutation).
// ---------------------------------------------------------------------------
const listeners = new Set<() => void>();
export function subscribeGroups(fn: () => void): () => void {
  if (isDemo) return demo.subscribeDemo(fn);
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
const notify = () => listeners.forEach((fn) => fn());

/** Exécute une mutation : démo ou RPC, erreurs normalisées, puis notification. */
async function mutate<T>(demoFn: () => T, rpc: string, args: Record<string, unknown>): Promise<T> {
  try {
    if (isDemo) return demoFn();
    const { data, error } = await supabase!.rpc(rpc, args);
    if (error) throw error;
    notify();
    return data as T;
  } catch (e) {
    throw toGroupError(e);
  }
}

// ---------------------------------------------------------------------------
// Mapping lignes SQL -> types app
// ---------------------------------------------------------------------------
type Row = Record<string, any>;

const toGroup = (r: Row): Group => ({
  id: r.id,
  kind: r.kind,
  name: r.name,
  photoUrl: r.photo_url,
  description: r.description,
  rules: r.rules,
  meetingPoint: r.meeting_point,
  plan: r.plan,
  verifiedAt: r.verified_at,
  createdAt: r.created_at,
});

const toRole = (r: Row): GroupRole => ({
  id: r.id,
  groupId: r.group_id,
  name: r.name,
  color: r.color,
  rank: r.rank,
  permissions: r.permissions,
  isFounder: r.is_founder,
  isDefault: r.is_default,
});

/** Profil lu sur la table existante, quel que soit le nom de ses colonnes. */
const toProfile = (id: string, r?: Row): Profile => ({
  id,
  name: r?.display_name ?? r?.username ?? r?.first_name ?? r?.name ?? 'Rider',
  avatarUrl: r?.avatar_url ?? r?.photo_url ?? null,
});

async function profilesById(ids: string[]): Promise<Map<string, Row>> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return new Map();
  const { data, error } = await supabase!.from(PROFILES_TABLE).select('*').in('id', unique);
  return new Map(((error ? [] : data) as Row[]).map((p) => [p.id, p]));
}

async function currentUserId(): Promise<string> {
  const { data } = await supabase!.auth.getUser();
  if (!data.user) throw new GroupError('not_authenticated');
  return data.user.id;
}

// ---------------------------------------------------------------------------
// Lecture
// ---------------------------------------------------------------------------
export async function listMyGroups(): Promise<GroupSummary[]> {
  if (isDemo) return demo.myGroups();
  try {
    const { data, error } = await supabase!.rpc('my_groups');
    if (error) throw error;
    return (data as Row[]).map((r) => ({
      id: r.id,
      kind: r.kind,
      name: r.name,
      photoUrl: r.photo_url,
      plan: r.plan,
      verifiedAt: r.verified_at,
      memberCount: r.member_count,
      myRole: { id: r.role_id, name: r.role_name, rank: r.role_rank, color: r.role_color },
      myPermissions: r.permissions,
      toValidate: r.to_validate ?? 0,
    }));
  } catch (e) {
    throw toGroupError(e);
  }
}

export async function getGroupBundle(groupId: string): Promise<GroupBundle> {
  if (isDemo) return demo.getBundle(groupId);
  try {
    const me = await currentUserId();
    const [g, roles, members] = await Promise.all([
      supabase!.from('groups').select('*').eq('id', groupId).maybeSingle(),
      supabase!.from('group_roles').select('*').eq('group_id', groupId).order('rank', { ascending: false }),
      supabase!.from('group_members').select('*').eq('group_id', groupId),
    ]);
    for (const res of [g, roles, members]) if (res.error) throw res.error;
    if (!g.data) throw new GroupError('not_member');

    const memberRows = members.data as Row[];
    const ids = memberRows.map((m) => m.user_id);
    const profiles = ids.length
      ? await supabase!.from(PROFILES_TABLE).select('*').in('id', ids)
      : { data: [] as Row[], error: null };
    const byId = new Map(((profiles.error ? [] : profiles.data) as Row[]).map((p) => [p.id, p]));

    const roleList = (roles.data as Row[]).map(toRole);
    const mine = memberRows.find((m) => m.user_id === me);
    const myRole = roleList.find((r) => r.id === mine?.role_id);
    if (!myRole) throw new GroupError('not_member');

    return {
      group: toGroup(g.data),
      roles: roleList,
      members: memberRows.map((m) => ({
        groupId: m.group_id,
        userId: m.user_id,
        roleId: m.role_id,
        joinedAt: m.joined_at,
        mutedUntil: m.muted_until,
        profile: toProfile(m.user_id, byId.get(m.user_id)),
      })),
      me: { userId: me, role: myRole, permissions: myRole.isFounder ? [...PERMISSIONS] : myRole.permissions },
    };
  } catch (e) {
    throw toGroupError(e);
  }
}

export async function listActivity(groupId: string): Promise<ActivityEntry[]> {
  if (isDemo) return demo.activity(groupId);
  const { data, error } = await supabase!
    .from('group_activity_log')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw toGroupError(error);
  return (data as Row[]).map((r) => ({ id: r.id, actorId: r.actor_id, action: r.action, target: r.target, createdAt: r.created_at }));
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------
export const createGroup = (kind: GroupKind, name: string, description?: string) =>
  mutate(() => demo.createGroup(kind, name, description), 'create_group', {
    p_kind: kind,
    p_name: name,
    p_description: description ?? null,
  }) as Promise<string>;

export const updateGroup = (groupId: string, patch: GroupPatch) => {
  // Clés SQL ; seules les clés présentes sont appliquées côté serveur.
  const sql: Record<string, string | null> = {};
  if (patch.name !== undefined) sql.name = patch.name;
  if (patch.description !== undefined) sql.description = patch.description;
  if (patch.rules !== undefined) sql.rules = patch.rules;
  if (patch.meetingPoint !== undefined) sql.meeting_point = patch.meetingPoint;
  if (patch.photoUrl !== undefined) sql.photo_url = patch.photoUrl;
  return mutate(() => demo.updateGroup(groupId, patch), 'update_group', { p_group: groupId, p_patch: sql });
};

export const deleteGroup = (groupId: string) => mutate(() => demo.deleteGroup(groupId), 'delete_group', { p_group: groupId });

export const upsertRole = (groupId: string, role: RoleInput) =>
  mutate(() => demo.upsertRole(groupId, role), 'upsert_role', {
    p_group: groupId,
    p_role: role.id ?? null,
    p_name: role.name,
    p_color: role.color,
    p_rank: role.rank,
    p_permissions: role.permissions,
  }) as Promise<string>;

export const deleteRole = (roleId: string) => mutate(() => demo.deleteRole(roleId), 'delete_role', { p_role: roleId });

export const reorderRoles = (groupId: string, orderedIds: string[]) =>
  mutate(() => demo.reorderRoles(groupId, orderedIds), 'reorder_roles', { p_group: groupId, p_ordered: orderedIds });

export const assignRole = (groupId: string, userId: string, roleId: string) =>
  mutate(() => demo.assignRole(groupId, userId, roleId), 'assign_role', { p_group: groupId, p_user: userId, p_role: roleId });

export const removeMember = (groupId: string, userId: string) =>
  mutate(() => demo.removeMember(groupId, userId), 'remove_member', { p_group: groupId, p_user: userId });

export const muteMember = (groupId: string, userId: string, until: string | null) =>
  mutate(() => demo.muteMember(groupId, userId, until), 'mute_member', { p_group: groupId, p_user: userId, p_until: until });

export const leaveGroup = (groupId: string) => mutate(() => demo.leaveGroup(groupId), 'leave_group', { p_group: groupId });

export const transferFounder = (groupId: string, userId: string) =>
  mutate(() => demo.transferFounder(groupId, userId), 'transfer_founder', { p_group: groupId, p_new_founder: userId });

// ---------------------------------------------------------------------------
// Règles d'affichage (miroir des contrôles serveur, pour ne proposer que
// les actions réalisables).
// ---------------------------------------------------------------------------
export const can = (b: GroupBundle, perm: Permission) => b.me.permissions.includes(perm);

/** Peut-on agir sur ce membre (rang strictement inférieur, pas soi-même) ? */
export function canActOn(b: GroupBundle, userId: string, perm: Permission) {
  if (userId === b.me.userId || !can(b, perm)) return false;
  const role = b.roles.find((r) => r.id === b.members.find((m) => m.userId === userId)?.roleId);
  return !!role && role.rank < b.me.role.rank;
}

/** Rôles que l'utilisateur peut attribuer ou modifier. */
export const manageableRoles = (b: GroupBundle) => b.roles.filter((r) => !r.isFounder && r.rank < b.me.role.rank);

// ===========================================================================
// Lot 2 — fil du groupe, suggestions 1 clic, sorties, sondages, invitations
// ===========================================================================

const toSuggestion = (r: Row, votes: Row[], me: string): Suggestion => ({
  id: r.id,
  groupId: r.group_id,
  authorId: r.author_id,
  type: r.type,
  payload: r.payload,
  status: r.status,
  decidedBy: r.decided_by,
  decidedAt: r.decided_at,
  editedPayload: r.edited_payload,
  refusalReason: r.refusal_reason,
  resultId: r.result_id,
  expiresAt: r.expires_at,
  createdAt: r.created_at,
  votes: votes.filter((v) => v.suggestion_id === r.id).length,
  votedByMe: votes.some((v) => v.suggestion_id === r.id && v.user_id === me),
});

/** Tout le contenu vivant d'un groupe : chat, suggestions, sorties, sondages, annonces. */
export async function getGroupFeed(groupId: string): Promise<GroupFeed> {
  if (isDemo) return demoFeed.getFeed(groupId);
  try {
    const me = await currentUserId();
    const [msgs, sugg, rides, polls, anns, invites] = await Promise.all([
      supabase!.from('group_messages').select('*').eq('group_id', groupId).order('created_at', { ascending: false }).limit(150),
      supabase!.from('group_suggestions').select('*').eq('group_id', groupId).order('created_at', { ascending: false }).limit(200),
      supabase!.from('group_rides').select('*, group_ride_participants(user_id)').eq('group_id', groupId).order('starts_at'),
      supabase!.from('group_polls').select('*, group_poll_votes(user_id, option_index)').eq('group_id', groupId),
      supabase!.from('group_announcements').select('*').eq('group_id', groupId).order('created_at', { ascending: false }).limit(50),
      supabase!.from('group_invites').select('*').eq('group_id', groupId).order('created_at', { ascending: false }).limit(100),
    ]);
    for (const res of [msgs, sugg, rides, polls, anns, invites]) if (res.error) throw res.error;

    const suggRows = sugg.data as Row[];
    const votes = suggRows.length
      ? await supabase!.from('group_suggestion_votes').select('suggestion_id, user_id').in('suggestion_id', suggRows.map((x) => x.id))
      : { data: [] as Row[], error: null };
    if (votes.error) throw votes.error;

    const inviteRows = invites.data as Row[];
    const peopleIds = [
      ...inviteRows.map((i) => i.invitee_id),
      ...suggRows.filter((x) => x.type === 'member').map((x) => (x.edited_payload ?? x.payload)?.user_id),
    ];
    const profiles = await profilesById(peopleIds);

    return {
      messages: (msgs.data as Row[]).reverse().map((m) => ({
        id: m.id,
        groupId: m.group_id,
        authorId: m.author_id,
        kind: m.kind,
        body: m.body,
        refId: m.ref_id,
        createdAt: m.created_at,
      })),
      suggestions: suggRows.map((r) => toSuggestion(r, votes.data as Row[], me)),
      rides: (rides.data as Row[]).map((r) => ({
        id: r.id,
        groupId: r.group_id,
        title: r.title,
        startsAt: r.starts_at,
        meetingPoint: r.meeting_point,
        route: r.route,
        level: r.level,
        membersOnly: r.members_only,
        createdBy: r.created_by,
        fromSuggestionId: r.from_suggestion_id,
        participants: (r.group_ride_participants as Row[]).map((x) => x.user_id),
      })),
      polls: (polls.data as Row[]).map((p) => {
        const pv = p.group_poll_votes as Row[];
        return {
          id: p.id,
          groupId: p.group_id,
          question: p.question,
          options: p.options,
          endsAt: p.ends_at,
          createdBy: p.created_by,
          counts: (p.options as string[]).map((_, i) => pv.filter((v) => v.option_index === i).length),
          myVote: pv.find((v) => v.user_id === me)?.option_index ?? null,
        };
      }),
      announcements: (anns.data as Row[]).map((a) => ({
        id: a.id,
        groupId: a.group_id,
        body: a.body,
        pinnedUntil: a.pinned_until,
        authorId: a.author_id,
        createdAt: a.created_at,
      })),
      invites: inviteRows.map((i) => ({ id: i.id, groupId: i.group_id, inviteeId: i.invitee_id, invitedBy: i.invited_by, status: i.status })),
      people: Object.fromEntries([...profiles].map(([id, row]) => [id, toProfile(id, row)])),
    };
  } catch (e) {
    throw toGroupError(e);
  }
}

/**
 * Temps réel : recharge le fil quand le chat, les suggestions ou les votes
 * changent (Supabase Realtime), ou après une mutation locale / démo.
 */
export function subscribeGroupFeed(groupId: string, onChange: () => void): () => void {
  const unsubscribeLocal = subscribeGroups(onChange);
  if (isDemo) return unsubscribeLocal;
  const channel = supabase!
    .channel(`group-feed:${groupId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'group_messages', filter: `group_id=eq.${groupId}` }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'group_suggestions', filter: `group_id=eq.${groupId}` }, onChange)
    // Tables sans group_id : filtrées par la RLS aux groupes de l'utilisateur.
    .on('postgres_changes', { event: '*', schema: 'public', table: 'group_suggestion_votes' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'group_poll_votes' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'group_ride_participants' }, onChange)
    .subscribe();
  return () => {
    unsubscribeLocal();
    supabase!.removeChannel(channel);
  };
}

/**
 * Créer ou proposer : le serveur applique directement si le rôle le permet,
 * sinon crée une suggestion. L'app n'a pas à choisir.
 */
export const groupAction = <T extends SuggestionType>(groupId: string, type: T, payload: PayloadOf[T]) =>
  mutate(() => demoFeed.groupAction(groupId, type, payload), 'group_action', {
    p_group: groupId,
    p_type: type,
    p_payload: payload,
  }) as Promise<GroupActionResult>;

export const decideSuggestion = async (id: string, accept: boolean, edited?: AnyPayload | null, reason?: string | null): Promise<DecisionResult> => {
  const r = (await mutate(() => demoFeed.decideSuggestion(id, accept, edited, reason), 'decide_suggestion', {
    p_suggestion: id,
    p_accept: accept,
    p_edited: edited ?? null,
    p_reason: reason ?? null,
  })) as DecisionResult & { result_id?: string | null };
  return { status: r.status, resultId: r.resultId ?? r.result_id ?? null };
};

export const withdrawSuggestion = (id: string) => mutate(() => demoFeed.withdrawSuggestion(id), 'withdraw_suggestion', { p_suggestion: id });

export const toggleSuggestionVote = (id: string) =>
  mutate(() => demoFeed.toggleSuggestionVote(id), 'toggle_suggestion_vote', { p_suggestion: id }) as Promise<number>;

export const postMessage = (groupId: string, body: string) =>
  mutate(() => demoFeed.postMessage(groupId, body), 'post_message', { p_group: groupId, p_body: body });

export const setRideParticipation = (rideId: string, join: boolean) =>
  mutate(() => demoFeed.setRideParticipation(rideId, join), 'set_ride_participation', { p_ride: rideId, p_join: join });

export const votePoll = (pollId: string, option: number) =>
  mutate(() => demoFeed.votePoll(pollId, option), 'vote_poll', { p_poll: pollId, p_option: option });

export const respondGroupInvite = (inviteId: string, accept: boolean) =>
  mutate(() => demoFeed.respondGroupInvite(inviteId, accept), 'respond_group_invite', { p_invite: inviteId, p_accept: accept });

export async function listMyGroupInvites(): Promise<ReceivedInvite[]> {
  if (isDemo) return demoFeed.myGroupInvites();
  try {
    const { data, error } = await supabase!.rpc('my_group_invites');
    if (error) throw error;
    const rows = data as Row[];
    const inviters = await profilesById(rows.map((r) => r.invited_by));
    return rows.map((r) => ({
      id: r.id,
      groupId: r.group_id,
      groupName: r.group_name,
      groupKind: r.group_kind,
      verifiedAt: r.verified_at,
      memberCount: r.member_count,
      invitedBy: r.invited_by,
      inviterName: toProfile(r.invited_by, inviters.get(r.invited_by)).name,
      intro: r.intro,
      createdAt: r.created_at,
    }));
  } catch (e) {
    throw toGroupError(e);
  }
}

/** Riders à proposer comme membres (hors membres actuels et soi-même). */
export async function searchProfiles(query: string, groupId: string, memberIds: string[]): Promise<Profile[]> {
  if (isDemo) return demoFeed.searchProfiles(query, groupId);
  const q = query.trim();
  if (q.length < 2) return [];
  const me = await currentUserId();
  const { data, error } = await supabase!.from(PROFILES_TABLE).select('*').ilike(PROFILES_NAME_COLUMN, `%${q}%`).limit(20);
  if (error) throw toGroupError(error);
  return (data as Row[]).filter((r) => r.id !== me && !memberIds.includes(r.id)).map((r) => toProfile(r.id, r));
}

export async function getNotificationPrefs(): Promise<NotificationPrefs> {
  if (isDemo) return demoFeed.getPrefs();
  const { data, error } = await supabase!.from('notification_prefs').select('*');
  if (error) throw toGroupError(error);
  const rows = data as Row[];
  const g = rows.find((r) => r.group_id === null);
  const groups: NotificationPrefs['groups'] = {};
  rows.filter((r) => r.group_id).forEach((r) => (groups[r.group_id] = { suggestions: r.suggestions_push, outcome: r.outcome_push }));
  return { global: { suggestions: g?.suggestions_push ?? true, outcome: g?.outcome_push ?? true }, groups };
}

export const setNotificationPrefs = (groupId: string | null, suggestions: boolean, outcome: boolean) =>
  mutate(() => demoFeed.setPrefs(groupId, suggestions, outcome), 'set_notification_prefs', {
    p_group: groupId,
    p_suggestions_push: suggestions,
    p_outcome_push: outcome,
  });

export async function registerPushToken(token: string, platform: 'ios' | 'android') {
  if (isDemo) return;
  const { error } = await supabase!.rpc('register_push_token', { p_token: token, p_platform: platform });
  if (error) throw toGroupError(error);
}

/** Peut-on valider ce type de suggestion ? */
export const canAccept = (b: GroupBundle, type: SuggestionType) => can(b, TYPE_META[type].accept);
/** Peut-on créer directement (sinon, on propose) ? */
export const canCreate = (b: GroupBundle, type: SuggestionType) => can(b, TYPE_META[type].direct);
/** Types de suggestion que l'utilisateur peut valider. */
export const acceptableTypes = (b: GroupBundle) => (Object.keys(TYPE_META) as SuggestionType[]).filter((t) => canAccept(b, t));

export type { ChatMessage };
