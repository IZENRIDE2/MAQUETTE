/**
 * Mode démo : réplique en mémoire des RPC Supabase du lot 1.
 * Les règles (permissions, rangs, rôle par défaut, fondateur) sont les mêmes
 * que dans la migration SQL, pour que l'UI se comporte à l'identique.
 */
import { GroupError } from './errors';
import { PERMISSIONS, Permission } from './permissions';
import type {
  ActivityEntry,
  Group,
  GroupBundle,
  GroupKind,
  GroupMember,
  GroupPatch,
  GroupRole,
  GroupSummary,
  Profile,
  RoleInput,
} from './types';

type MemberRow = Omit<GroupMember, 'profile'>;

const PROFILES: Profile[] = [
  { id: 'u-julie', name: 'Julie', avatarUrl: null },
  { id: 'u-marc', name: 'Marc', avatarUrl: null },
  { id: 'u-sarah', name: 'Sarah', avatarUrl: null },
  { id: 'u-leo', name: 'Léo', avatarUrl: null },
  { id: 'u-camille', name: 'Camille', avatarUrl: null },
  { id: 'u-antoine', name: 'Antoine', avatarUrl: null },
];

export const DEMO_GROUP_ID = 'g-night-riders';

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(seq++).toString(36)}`;
const now = () => new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 864e5).toISOString();

const state = {
  me: 'u-julie',
  groups: [] as Group[],
  roles: [] as GroupRole[],
  members: [] as MemberRow[],
  log: [] as (ActivityEntry & { groupId: string })[],
};

// ---------------------------------------------------------------------------
// Abonnement : les écrans se rechargent quand l'état change.
// ---------------------------------------------------------------------------
const listeners = new Set<() => void>();
export const subscribeDemo = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
const emit = () => listeners.forEach((fn) => fn());

// ---------------------------------------------------------------------------
// Utilisateur courant (sélecteur « Voir en tant que » en mode démo).
// ---------------------------------------------------------------------------
export const demoProfiles = () => PROFILES;
export const demoMe = () => state.me;
export function setDemoMe(userId: string) {
  state.me = userId;
  emit();
}

// ---------------------------------------------------------------------------
// Helpers — équivalents de group_member_rank / has_group_perm / assert_group_perm
// ---------------------------------------------------------------------------
const roleOf = (groupId: string, userId: string) => {
  const m = state.members.find((x) => x.groupId === groupId && x.userId === userId);
  return m ? state.roles.find((r) => r.id === m.roleId) : undefined;
};
const effectivePerms = (role: GroupRole): Permission[] => (role.isFounder ? [...PERMISSIONS] : role.permissions);

function assertPerm(groupId: string, perm: Permission | null): number {
  const role = roleOf(groupId, state.me);
  if (!role) throw new GroupError('not_member');
  if (perm && !effectivePerms(role).includes(perm)) throw new GroupError('forbidden');
  return role.rank;
}

const log = (groupId: string, action: string, target: Record<string, unknown> = {}) => {
  state.log.unshift({ id: state.log.length + 1, groupId, actorId: state.me, action, target, createdAt: now() });
};

// ---------------------------------------------------------------------------
// Lecture
// ---------------------------------------------------------------------------
export function myGroups(): GroupSummary[] {
  return state.members
    .filter((m) => m.userId === state.me)
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
    .map((m) => {
      const g = state.groups.find((x) => x.id === m.groupId)!;
      const r = state.roles.find((x) => x.id === m.roleId)!;
      return {
        id: g.id,
        kind: g.kind,
        name: g.name,
        photoUrl: g.photoUrl,
        plan: g.plan,
        verifiedAt: g.verifiedAt,
        memberCount: state.members.filter((x) => x.groupId === g.id).length,
        myRole: { id: r.id, name: r.name, rank: r.rank, color: r.color },
        myPermissions: effectivePerms(r),
      };
    });
}

export function getBundle(groupId: string): GroupBundle {
  const role = roleOf(groupId, state.me);
  const group = state.groups.find((g) => g.id === groupId);
  if (!group || !role) throw new GroupError('not_member');
  return {
    group: { ...group },
    roles: state.roles.filter((r) => r.groupId === groupId).sort((a, b) => b.rank - a.rank).map((r) => ({ ...r })),
    members: state.members
      .filter((m) => m.groupId === groupId)
      .map((m) => ({ ...m, profile: PROFILES.find((p) => p.id === m.userId) ?? { id: m.userId, name: 'Rider', avatarUrl: null } })),
    me: { userId: state.me, role: { ...role }, permissions: effectivePerms(role) },
  };
}

export function activity(groupId: string): ActivityEntry[] {
  assertPerm(groupId, 'insights.view');
  return state.log.filter((e) => e.groupId === groupId).slice(0, 50);
}

// ---------------------------------------------------------------------------
// Groupe
// ---------------------------------------------------------------------------
function insertGroup(kind: GroupKind, name: string, description: string | null, ownerId: string, id = uid('g')) {
  state.groups.push({
    id,
    kind,
    name: name.trim(),
    photoUrl: null,
    description: description?.trim() || null,
    rules: null,
    meetingPoint: null,
    plan: 'free',
    verifiedAt: null,
    createdAt: now(),
  });
  const role = (name: string, color: string, rank: number, permissions: Permission[], extra: Partial<GroupRole> = {}) => {
    const r: GroupRole = { id: uid('r'), groupId: id, name, color, rank, permissions, isFounder: false, isDefault: false, ...extra };
    state.roles.push(r);
    return r;
  };
  const founder = role('Fondateur', '#fbbf24', 100, [], { isFounder: true });
  role('Admin', '#7eb0ff', 80, PERMISSIONS.filter((p) => p !== 'roles.manage'));
  if (kind === 'pro') {
    role('Gestionnaire', '#22d3ee', 50, PERMISSIONS.filter((p) => p !== 'roles.manage' && p !== 'member.remove'));
  } else {
    role('Road captain', '#22d3ee', 50, ['ride.create', 'poll.create', 'accept.ride', 'accept.poll']);
  }
  role('Membre', '#7a92b8', 10, [], { isDefault: true });
  state.members.push({ groupId: id, userId: ownerId, roleId: founder.id, joinedAt: now(), mutedUntil: null });
  return id;
}

export function createGroup(kind: GroupKind, name: string, description?: string | null): string {
  if (name.trim().length < 2 || name.trim().length > 60) throw new GroupError('unknown', 'Le nom doit faire entre 2 et 60 caractères.');
  const id = insertGroup(kind, name, description ?? null, state.me);
  log(id, 'group.created', { name: name.trim() });
  emit();
  return id;
}

export function updateGroup(groupId: string, patch: GroupPatch) {
  assertPerm(groupId, 'group.edit');
  const g = state.groups.find((x) => x.id === groupId)!;
  const clean = (v: string | null | undefined) => (v?.trim() ? v.trim() : null);
  if (patch.name !== undefined) g.name = patch.name.trim();
  if (patch.description !== undefined) g.description = clean(patch.description);
  if (patch.rules !== undefined) g.rules = clean(patch.rules);
  if (patch.meetingPoint !== undefined) g.meetingPoint = clean(patch.meetingPoint);
  if (patch.photoUrl !== undefined) g.photoUrl = clean(patch.photoUrl);
  log(groupId, 'group.updated', { fields: Object.keys(patch) });
  emit();
}

export function deleteGroup(groupId: string) {
  if (assertPerm(groupId, null) !== 100) throw new GroupError('founder_only');
  removeGroupData(groupId);
  emit();
}

function removeGroupData(groupId: string) {
  state.groups = state.groups.filter((g) => g.id !== groupId);
  state.roles = state.roles.filter((r) => r.groupId !== groupId);
  state.members = state.members.filter((m) => m.groupId !== groupId);
  state.log = state.log.filter((e) => e.groupId !== groupId);
}

// ---------------------------------------------------------------------------
// Rôles
// ---------------------------------------------------------------------------
export function upsertRole(groupId: string, input: RoleInput): string {
  const myRank = assertPerm(groupId, 'roles.manage');
  if (input.rank < 1 || input.rank >= myRank) throw new GroupError('rank_too_high');
  if (input.permissions.some((p) => !PERMISSIONS.includes(p))) throw new GroupError('unknown_permission');
  const name = input.name.trim();
  if (!name || name.length > 30) throw new GroupError('unknown', 'Le nom du rôle doit faire entre 1 et 30 caractères.');
  if (state.roles.some((r) => r.groupId === groupId && r.name === name && r.id !== input.id)) {
    throw new GroupError('unknown', 'Un rôle porte déjà ce nom.');
  }

  if (!input.id) {
    const r: GroupRole = { id: uid('r'), groupId, name, color: input.color, rank: input.rank, permissions: [...input.permissions], isFounder: false, isDefault: false };
    state.roles.push(r);
    log(groupId, 'role.created', { role_id: r.id, name });
    emit();
    return r.id;
  }
  const role = state.roles.find((r) => r.id === input.id && r.groupId === groupId);
  if (!role) throw new GroupError('role_not_found');
  if (role.isFounder || role.rank >= myRank) throw new GroupError('rank_too_high');
  Object.assign(role, { name, color: input.color, rank: input.rank, permissions: [...input.permissions] });
  log(groupId, 'role.updated', { role_id: role.id, name });
  emit();
  return role.id;
}

export function deleteRole(roleId: string) {
  const role = state.roles.find((r) => r.id === roleId);
  if (!role) throw new GroupError('role_not_found');
  const myRank = assertPerm(role.groupId, 'roles.manage');
  if (role.isFounder || role.rank >= myRank) throw new GroupError('rank_too_high');
  if (role.isDefault) throw new GroupError('default_role_locked');
  const def = state.roles.find((r) => r.groupId === role.groupId && r.isDefault)!;
  let moved = 0;
  state.members.forEach((m) => {
    if (m.roleId === roleId) {
      m.roleId = def.id;
      moved++;
    }
  });
  state.roles = state.roles.filter((r) => r.id !== roleId);
  log(role.groupId, 'role.deleted', { role_id: roleId, name: role.name, members_moved: moved });
  emit();
}

/** Permute les rangs actuels des rôles fournis (du plus haut au plus bas). */
export function reorderRoles(groupId: string, orderedIds: string[]) {
  const myRank = assertPerm(groupId, 'roles.manage');
  const roles = state.roles.filter((r) => r.groupId === groupId && orderedIds.includes(r.id) && !r.isFounder && r.rank < myRank);
  if (roles.length !== orderedIds.length || new Set(orderedIds).size !== orderedIds.length) throw new GroupError('rank_too_high');
  const ranks = roles.map((r) => r.rank).sort((a, b) => b - a);
  orderedIds.forEach((id, i) => {
    state.roles.find((r) => r.id === id)!.rank = ranks[i];
  });
  log(groupId, 'roles.reordered', { order: orderedIds });
  emit();
}

// ---------------------------------------------------------------------------
// Membres
// ---------------------------------------------------------------------------
function assertTarget(groupId: string, userId: string, perm: Permission) {
  const myRank = assertPerm(groupId, perm);
  const target = roleOf(groupId, userId);
  if (!target) throw new GroupError('member_not_found');
  if (userId === state.me || target.rank >= myRank) throw new GroupError('rank_too_high');
  return myRank;
}

export function assignRole(groupId: string, userId: string, roleId: string) {
  const myRank = assertTarget(groupId, userId, 'member.assign_role');
  const role = state.roles.find((r) => r.id === roleId && r.groupId === groupId);
  if (!role) throw new GroupError('role_not_found');
  if (role.rank >= myRank || role.isFounder) throw new GroupError('rank_too_high');
  state.members.find((m) => m.groupId === groupId && m.userId === userId)!.roleId = roleId;
  log(groupId, 'member.role_changed', { user_id: userId, role_id: roleId, role_name: role.name });
  emit();
}

export function removeMember(groupId: string, userId: string) {
  assertTarget(groupId, userId, 'member.remove');
  state.members = state.members.filter((m) => !(m.groupId === groupId && m.userId === userId));
  log(groupId, 'member.removed', { user_id: userId });
  emit();
}

export function muteMember(groupId: string, userId: string, until: string | null) {
  assertTarget(groupId, userId, 'member.remove');
  state.members.find((m) => m.groupId === groupId && m.userId === userId)!.mutedUntil = until;
  log(groupId, until ? 'member.muted' : 'member.unmuted', { user_id: userId, until });
  emit();
}

export function leaveGroup(groupId: string) {
  const rank = assertPerm(groupId, null);
  if (rank === 100) {
    if (state.members.filter((m) => m.groupId === groupId).length > 1) throw new GroupError('transfer_founder_first');
    removeGroupData(groupId);
  } else {
    state.members = state.members.filter((m) => !(m.groupId === groupId && m.userId === state.me));
    log(groupId, 'member.left', { user_id: state.me });
  }
  emit();
}

export function transferFounder(groupId: string, newFounderId: string) {
  if (assertPerm(groupId, null) !== 100) throw new GroupError('founder_only');
  if (newFounderId === state.me || !roleOf(groupId, newFounderId)) throw new GroupError('member_not_found');
  const founder = state.roles.find((r) => r.groupId === groupId && r.isFounder)!;
  const next = state.roles.filter((r) => r.groupId === groupId && !r.isFounder).sort((a, b) => b.rank - a.rank)[0];
  state.members.find((m) => m.groupId === groupId && m.userId === state.me)!.roleId = next.id;
  state.members.find((m) => m.groupId === groupId && m.userId === newFounderId)!.roleId = founder.id;
  log(groupId, 'founder.transferred', { user_id: newFounderId });
  emit();
}

// ---------------------------------------------------------------------------
// Données de démo (Paris)
// ---------------------------------------------------------------------------
(function seed() {
  const g = insertGroup('friends', 'Night Riders Paris', 'Sorties de nuit entre potes, départ Bastille le vendredi.', 'u-julie', DEMO_GROUP_ID);
  Object.assign(state.groups.find((x) => x.id === g)!, {
    rules: 'Casque et gants obligatoires. On attend toujours le dernier.',
    meetingPoint: 'Place de la Bastille, devant l’Opéra',
    createdAt: daysAgo(120),
  });
  const roleId = (name: string) => state.roles.find((r) => r.groupId === g && r.name === name)!.id;
  const add = (userId: string, role: string, days: number) =>
    state.members.push({ groupId: g, userId, roleId: roleId(role), joinedAt: daysAgo(days), mutedUntil: null });
  state.members[0].joinedAt = daysAgo(120);
  add('u-marc', 'Admin', 110);
  add('u-sarah', 'Road captain', 90);
  add('u-leo', 'Membre', 30);
  add('u-camille', 'Membre', 12);
  add('u-antoine', 'Membre', 3);

  const pro = insertGroup('pro', 'Moto-école Bastille', 'Sorties encadrées et stages de pilotage.', 'u-marc');
  Object.assign(state.groups.find((x) => x.id === pro)!, { verifiedAt: daysAgo(40), meetingPoint: '12 rue de la Roquette, Paris 11e' });
  state.members.push({
    groupId: pro,
    userId: 'u-julie',
    roleId: state.roles.find((r) => r.groupId === pro && r.isDefault)!.id,
    joinedAt: daysAgo(20),
    mutedUntil: null,
  });

  state.log.push(
    { id: 1, groupId: g, actorId: 'u-julie', action: 'member.role_changed', target: { user_id: 'u-sarah', role_name: 'Road captain' }, createdAt: daysAgo(90) },
    { id: 2, groupId: g, actorId: 'u-julie', action: 'group.created', target: { name: 'Night Riders Paris' }, createdAt: daysAgo(120) },
  );
})();
