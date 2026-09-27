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
  /** Suggestions en attente que l'utilisateur peut valider. */
  toValidate: number;
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

// ---------------------------------------------------------------------------
// Lot 2 : suggestions, chat, sorties, sondages, annonces, invitations
// (payloads en snake_case : identiques au JSON stocké côté SQL).
// ---------------------------------------------------------------------------
export type SuggestionType = 'ride' | 'member' | 'announcement' | 'poll';
export type SuggestionStatus = 'pending' | 'accepted' | 'accepted_edited' | 'refused' | 'withdrawn' | 'expired';
export type RideLevel = 'tous' | 'intermediaire' | 'confirme';

export type RidePayload = {
  title: string;
  starts_at: string;
  meeting_point: string;
  route?: string | null;
  level?: RideLevel;
  members_only?: boolean;
};
export type MemberPayload = { user_id: string; intro?: string | null };
export type AnnouncementPayload = { body: string; pin_days: number };
export type PollPayload = { question: string; options: string[]; ends_at?: string | null };
export type PayloadOf = {
  ride: RidePayload;
  member: MemberPayload;
  announcement: AnnouncementPayload;
  poll: PollPayload;
};
export type AnyPayload = PayloadOf[SuggestionType];

export type Suggestion = {
  id: string;
  groupId: string;
  authorId: string;
  type: SuggestionType;
  payload: AnyPayload;
  status: SuggestionStatus;
  decidedBy: string | null;
  decidedAt: string | null;
  editedPayload: AnyPayload | null;
  refusalReason: string | null;
  resultId: string | null;
  expiresAt: string;
  createdAt: string;
  votes: number;
  votedByMe: boolean;
};

export type Ride = {
  id: string;
  groupId: string;
  title: string;
  startsAt: string;
  meetingPoint: string;
  route: string | null;
  level: RideLevel;
  membersOnly: boolean;
  createdBy: string | null;
  fromSuggestionId: string | null;
  participants: string[];
};

export type Poll = {
  id: string;
  groupId: string;
  question: string;
  options: string[];
  endsAt: string | null;
  createdBy: string | null;
  /** Nombre de votes par option. */
  counts: number[];
  myVote: number | null;
};

export type Announcement = { id: string; groupId: string; body: string; pinnedUntil: string | null; authorId: string | null; createdAt: string };

export type ChatMessageKind = 'text' | 'suggestion' | 'ride' | 'poll' | 'announcement' | 'invite' | 'system';
export type ChatMessage = { id: string; groupId: string; authorId: string | null; kind: ChatMessageKind; body: string | null; refId: string | null; createdAt: string };

/** Invitation dans un groupe (vue côté groupe). */
export type GroupInviteRow = { id: string; groupId: string; inviteeId: string; invitedBy: string | null; status: 'pending' | 'accepted' | 'declined' };

/** Invitation reçue (vue côté invité). */
export type ReceivedInvite = {
  id: string;
  groupId: string;
  groupName: string;
  groupKind: GroupKind;
  verifiedAt: string | null;
  memberCount: number;
  invitedBy: string | null;
  inviterName: string;
  intro: string | null;
  createdAt: string;
};

export type GroupFeed = {
  messages: ChatMessage[];
  suggestions: Suggestion[];
  rides: Ride[];
  polls: Poll[];
  announcements: Announcement[];
  invites: GroupInviteRow[];
  /** Profils des personnes citées hors membres (invités). */
  people: Record<string, Profile>;
};

export type GroupActionResult = { mode: 'created' | 'suggested'; id: string };
export type DecisionResult = { status: SuggestionStatus; resultId?: string | null };

export type NotificationPref = { suggestions: boolean; outcome: boolean };
export type NotificationPrefs = { global: NotificationPref; groups: Record<string, NotificationPref> };
