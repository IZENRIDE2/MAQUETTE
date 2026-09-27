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

// ---------------------------------------------------------------------------
// Lot 3 : invitation d'un ami, onboarding, bienvenue, messages 1-1
// ---------------------------------------------------------------------------
export type FriendInviteStatus = 'pending' | 'claimed' | 'cancelled' | 'expired' | 'unlinked';

/** Invitation vue par l'inviteur (jamais le téléphone ni l'email : seulement s'ils sont renseignés). */
export type FriendInvite = {
  id: string;
  code: string;
  status: FriendInviteStatus;
  hasPhone: boolean;
  hasEmail: boolean;
  presetGroupIds: string[];
  acceptedBy: string | null;
  friend: Profile | null;
  claimedAt: string | null;
  welcomedAt: string | null;
  expiresAt: string;
  createdAt: string;
};

export type OpenedGroup = { groupId: string; mode: 'invite' | 'suggestion' | 'skipped'; id?: string };
export type ClaimResult =
  | { status: 'none' }
  | { status: 'already_claimed'; inviteId: string; inviterId: string }
  | { status: 'claimed'; inviteId: string; inviterId: string; via: 'code' | 'contact'; groups: OpenedGroup[] };

export type InvitationGroupStatus = 'member' | 'invited' | 'pending_approval' | 'none';
/** Ce que voit l'ami invité pendant son onboarding. */
export type MyInvitation = {
  inviteId: string;
  inviter: Profile;
  claimedAt: string;
  groups: {
    groupId: string;
    name: string;
    kind: GroupKind;
    verifiedAt: string | null;
    memberCount: number;
    inviteId: string | null;
    status: InvitationGroupStatus;
  }[];
};

export type DirectMessageKind = 'text' | 'wave' | 'ride';
export type DirectMessage = {
  id: string;
  senderId: string;
  recipientId: string;
  kind: DirectMessageKind;
  body: string | null;
  payload: { title: string; starts_at: string; meeting_point: string } | null;
  createdAt: string;
};
export type DirectThread = { other: Profile; last: DirectMessage; unread: number };

// ---------------------------------------------------------------------------
// Lot 4 : groupes pro (badge vérifié, sorties promues, stats)
// ---------------------------------------------------------------------------
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'revoked';
export type VerificationRequest = {
  id: string;
  groupId: string;
  legalName: string;
  siret: string;
  website: string | null;
  documentPath: string | null;
  status: VerificationStatus;
  reviewerNote: string | null;
  createdAt: string;
  decidedAt: string | null;
};
export type PendingVerification = VerificationRequest & { groupName: string; memberCount: number; registry: RegistryCheck | null };

/** Fiche du registre des entreprises (Pappers) pour un SIRET. */
export type RegistryCheck = {
  status: 'active' | 'closed' | 'not_found';
  siren: string | null;
  legalName: string | null;
  tradeName: string | null;
  legalForm: string | null;
  nafLabel: string | null;
  address: string | null;
  createdOn: string | null;
  closedOn: string | null;
  checkedAt: string;
};
/** Consultation du registre : fiche, ou registre injoignable / plafond atteint. */
export type RegistryLookup = { result: RegistryCheck; stale?: boolean } | { error: 'invalid_siret' | 'rate_limited' | 'registry_unavailable' | 'forbidden' };

/** Groupe vérifié dont l'établissement n'est plus actif au registre. */
export type FlaggedGroup = { groupId: string; groupName: string; verifiedAt: string; legalName: string; siret: string; registry: RegistryCheck };

/** Sortie d'un groupe pro promue dans l'onglet Événements. */
export type PublicRide = {
  id: string;
  groupId: string;
  groupName: string;
  verifiedAt: string | null;
  title: string;
  startsAt: string;
  meetingPoint: string;
  route: string | null;
  level: RideLevel;
  participants: number;
  going: boolean;
  isMember: boolean;
};

export type GroupStats = {
  members: { total: number; joined_30d: number; left_30d: number };
  engagement: { active_7d: number; active_30d: number; messages_per_week: { week: string; count: number }[] };
  rides: { upcoming: number; past_90d: number; avg_participants: number | null; outside_participants: number };
  suggestions: { received_30d: number; accepted_30d: number; pending: number; median_decision_hours: number | null };
  invites: { sent_30d: number; accepted_30d: number };
};
