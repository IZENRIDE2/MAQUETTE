/**
 * API Groupes — point d'entrée unique des écrans.
 * Supabase si configuré, sinon mode démo (mêmes règles, données locales).
 */
import { supabase, isDemo, PROFILES_TABLE } from './supabase';
import * as demo from './demoStore';
import { GroupError, toGroupError } from './errors';
import { PERMISSIONS, Permission } from './permissions';
import type {
  ActivityEntry,
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
