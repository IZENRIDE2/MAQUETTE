/**
 * Types du domaine Groupes — miroir des tables Supabase
 * (supabase/migrations/20260927000001_groups_core.sql).
 */
import type { Permission } from './permissions';

export type GroupKind = 'friends' | 'pro';
export type GroupPlan = 'free' | 'pro';

/** Un groupe tel que le voit l'utilisateur courant (RPC `my_groups`). */
export type GroupSummary = {
  id: string;
  kind: GroupKind;
  name: string;
  photoUrl: string | null;
  plan: GroupPlan;
  verifiedAt: string | null;
  memberCount: number;
  /** Rôle et permissions effectives de l'utilisateur courant. */
  myRole: { id: string; name: string; rank: number; color: string };
  myPermissions: Permission[];
};

export type Group = {
  id: string;
  kind: GroupKind;
  name: string;
  photoUrl: string | null;
  description: string | null;
  rules: string | null;
  meetingPoint: string | null;
  plan: GroupPlan;
  verifiedAt: string | null;
  createdAt: string;
};

export type GroupRole = {
  id: string;
  groupId: string;
  name: string;
  color: string;
  rank: number;
  permissions: Permission[];
  isFounder: boolean;
  isDefault: boolean;
};

export type GroupMember = {
  groupId: string;
  userId: string;
  roleId: string;
  joinedAt: string;
  mutedUntil: string | null;
  profile: Profile;
};

export type Profile = { id: string; name: string; avatarUrl: string | null };

export type ActivityEntry = {
  id: number;
  actorId: string | null;
  action: string;
  target: Record<string, unknown>;
  createdAt: string;
};

/** Tout ce qu'un écran de groupe doit savoir, chargé en une fois. */
export type GroupBundle = {
  group: Group;
  roles: GroupRole[];
  members: GroupMember[];
  me: { userId: string; role: GroupRole; permissions: Permission[] };
};

export type GroupPatch = Partial<Pick<Group, 'name' | 'description' | 'rules' | 'meetingPoint' | 'photoUrl'>>;

export type RoleInput = {
  id?: string;
  name: string;
  color: string;
  rank: number;
  permissions: Permission[];
};
