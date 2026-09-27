/**
 * Mode démo du lot 3 : invitations d'amis, rattachement, onboarding,
 * bienvenue et messages 1-1. Mêmes règles que la migration
 * 20260929000001_friend_invites.sql (empreintes remplacées par la valeur
 * normalisée, qui ne quitte jamais ce module).
 */
import { _demo } from './demoStore';
import { GroupError } from './errors';
import { normalizeEmail, normalizePhone } from './contacts';
import { TYPE_META } from './payloads';
import type { ClaimResult, DirectMessage, DirectMessageKind, DirectThread, FriendInvite, MyInvitation, OpenedGroup, Profile } from './types';

const { state, effectivePerms, roleOf, emit, uid, now } = _demo;

type Row = {
  id: string;
  inviterId: string;
  code: string;
  phone: string | null;
  email: string | null;
  presetGroupIds: string[];
  status: FriendInvite['status'];
  via: 'code' | 'contact' | null;
  acceptedBy: string | null;
  claimedAt: string | null;
  welcomedAt: string | null;
  expiresAt: string;
  createdAt: string;
};

const invites: Row[] = [];
const messages: DirectMessage[] = [];
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const DAY = 864e5;

const profile = (id: string | null): Profile =>
  _demo.profiles.find((p) => p.id === id) ?? { id: id ?? '', name: 'Un rider', avatarUrl: null };

function newCode(): string {
  let code = '';
  do {
    code = Array.from({ length: 8 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
  } while (invites.some((i) => i.code === code));
  return code;
}

function assertGroups(groupIds: string[]): string[] {
  const unique = [...new Set(groupIds.filter(Boolean))];
  if (unique.length > 10) throw new GroupError('too_many_groups');
  if (unique.some((g) => !roleOf(g, state.me))) throw new GroupError('not_member');
  return unique;
}

const liveStatus = (r: Row): FriendInvite['status'] => (r.status === 'pending' && Date.parse(r.expiresAt) <= Date.now() ? 'expired' : r.status);

// ---------------------------------------------------------------------------
// Côté inviteur
// ---------------------------------------------------------------------------
export function createInvite(phone?: string | null, email?: string | null, groupIds: string[] = []) {
  const p = normalizePhone(phone);
  const e = normalizeEmail(email);
  if (phone?.trim() && !p) throw new GroupError('invalid_phone');
  if (email?.trim() && !e) throw new GroupError('invalid_email');
  if (invites.filter((i) => i.inviterId === state.me && liveStatus(i) === 'pending').length >= 50) throw new GroupError('too_many_invites');
  const row: Row = {
    id: uid('f'),
    inviterId: state.me,
    code: newCode(),
    phone: p,
    email: e,
    presetGroupIds: assertGroups(groupIds),
    status: 'pending',
    via: null,
    acceptedBy: null,
    claimedAt: null,
    welcomedAt: null,
    expiresAt: new Date(Date.now() + 30 * DAY).toISOString(),
    createdAt: now(),
  };
  invites.unshift(row);
  emit();
  return { id: row.id, code: row.code };
}

const mine = (id: string, statuses: FriendInvite['status'][]) => {
  const r = invites.find((i) => i.id === id && i.inviterId === state.me && statuses.includes(liveStatus(i)));
  if (!r) throw new GroupError('friend_invite_not_found');
  return r;
};

export function updateGroups(id: string, groupIds: string[]) {
  mine(id, ['pending']).presetGroupIds = assertGroups(groupIds);
  emit();
}

export function cancel(id: string) {
  Object.assign(mine(id, ['pending', 'expired']), { status: 'cancelled', phone: null, email: null });
  emit();
}

export function renew(id: string) {
  Object.assign(mine(id, ['pending', 'expired']), { status: 'pending', expiresAt: new Date(Date.now() + 30 * DAY).toISOString() });
  emit();
}

export function listMine(): FriendInvite[] {
  return invites
    .filter((i) => i.inviterId === state.me)
    .map((i) => ({
      id: i.id,
      code: i.code,
      status: liveStatus(i),
      hasPhone: !!i.phone,
      hasEmail: !!i.email,
      presetGroupIds: i.presetGroupIds,
      acceptedBy: i.acceptedBy,
      friend: i.acceptedBy ? profile(i.acceptedBy) : null,
      claimedAt: i.claimedAt,
      welcomedAt: i.welcomedAt,
      expiresAt: i.expiresAt,
      createdAt: i.createdAt,
    }));
}

export function markWelcomed(id: string) {
  const r = invites.find((i) => i.id === id && i.inviterId === state.me && i.status === 'claimed');
  if (r && !r.welcomedAt) {
    r.welcomedAt = now();
    emit();
  }
}

// ---------------------------------------------------------------------------
// Côté ami invité
// ---------------------------------------------------------------------------
function openPresetGroups(r: Row): OpenedGroup[] {
  return r.presetGroupIds.map((groupId) => {
    const inviterRole = roleOf(groupId, r.inviterId);
    const friend = r.acceptedBy!;
    if (
      !inviterRole ||
      state.members.some((m) => m.groupId === groupId && m.userId === friend) ||
      state.invites.some((i) => i.groupId === groupId && i.inviteeId === friend && i.status === 'pending')
    ) {
      return { groupId, mode: 'skipped' };
    }
    const payload = { user_id: friend, intro: 'Invité sur IzenRide' };
    if (effectivePerms(inviterRole).includes(TYPE_META.member.direct)) {
      const id = uid('member');
      state.invites.push({ id, groupId, inviteeId: friend, invitedBy: r.inviterId, intro: payload.intro, status: 'pending', viaSuggestionId: null, createdAt: now() });
      state.messages.push({ id: uid('m'), groupId, authorId: r.inviterId, kind: 'invite', body: null, refId: id, createdAt: now() });
      return { groupId, mode: 'invite', id };
    }
    const id = uid('s');
    state.suggestions.push({
      id,
      groupId,
      authorId: r.inviterId,
      type: 'member',
      payload,
      status: 'pending',
      decidedBy: null,
      decidedAt: null,
      editedPayload: null,
      refusalReason: null,
      resultId: null,
      expiresAt: new Date(Date.now() + 14 * DAY).toISOString(),
      createdAt: now(),
    });
    state.messages.push({ id: uid('m'), groupId, authorId: r.inviterId, kind: 'suggestion', body: null, refId: id, createdAt: now() });
    return { groupId, mode: 'suggestion', id };
  });
}

/**
 * Rattachement : par code, sinon par téléphone / email (la démo n'a pas de
 * contact vérifié : `verified` simule ceux de l'inscription).
 */
export function claim(code?: string | null, verified: { phone?: string; email?: string } = {}): ClaimResult {
  const existing = invites.find((i) => i.acceptedBy === state.me && i.status === 'claimed');
  if (existing) return { status: 'already_claimed', inviteId: existing.id, inviterId: existing.inviterId };

  const open = (i: Row) => liveStatus(i) === 'pending' && i.inviterId !== state.me;
  let row = code?.trim() ? invites.find((i) => i.code === code.trim().toUpperCase() && open(i)) : undefined;
  let via: 'code' | 'contact' = 'code';
  if (!row) {
    const p = normalizePhone(verified.phone);
    const e = normalizeEmail(verified.email);
    row = invites
      .filter((i) => open(i) && ((p && i.phone === p) || (e && i.email === e)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    via = 'contact';
  }
  if (!row) return { status: 'none' };

  Object.assign(row, { status: 'claimed', acceptedBy: state.me, claimedAt: now(), via, phone: null, email: null });
  const groups = openPresetGroups(row);
  emit();
  return { status: 'claimed', inviteId: row.id, inviterId: row.inviterId, via, groups };
}

export function myInvitation(): MyInvitation | null {
  const r = invites.find((i) => i.acceptedBy === state.me && i.status === 'claimed');
  if (!r) return null;
  return {
    inviteId: r.id,
    inviter: profile(r.inviterId),
    claimedAt: r.claimedAt!,
    groups: r.presetGroupIds
      .map((groupId) => state.groups.find((g) => g.id === groupId))
      .filter((g): g is NonNullable<typeof g> => !!g)
      .map((g) => {
        const invite = state.invites.find((i) => i.groupId === g.id && i.inviteeId === state.me && i.status === 'pending');
        const member = state.members.some((m) => m.groupId === g.id && m.userId === state.me);
        const pendingApproval = state.suggestions.some(
          (s) => s.groupId === g.id && s.type === 'member' && s.status === 'pending' && (s.payload as { user_id: string }).user_id === state.me,
        );
        return {
          groupId: g.id,
          name: g.name,
          kind: g.kind,
          verifiedAt: g.verifiedAt,
          memberCount: state.members.filter((m) => m.groupId === g.id).length,
          inviteId: invite?.id ?? null,
          status: member ? 'member' : invite ? 'invited' : pendingApproval ? 'pending_approval' : 'none',
        };
      }),
  };
}

export function unlink() {
  const r = invites.find((i) => i.acceptedBy === state.me && i.status === 'claimed');
  if (!r) throw new GroupError('friend_invite_not_found');
  r.status = 'unlinked';
  state.invites.forEach((i) => {
    if (i.inviteeId === state.me && i.status === 'pending' && i.invitedBy === r.inviterId && r.presetGroupIds.includes(i.groupId)) i.status = 'declined';
  });
  state.suggestions.forEach((s) => {
    if (s.authorId === r.inviterId && s.type === 'member' && s.status === 'pending' && (s.payload as { user_id: string }).user_id === state.me) s.status = 'withdrawn';
  });
  emit();
}

// ---------------------------------------------------------------------------
// Messages 1-1
// ---------------------------------------------------------------------------
const linked = (a: string, b: string) =>
  invites.some((i) => i.status === 'claimed' && ((i.inviterId === a && i.acceptedBy === b) || (i.inviterId === b && i.acceptedBy === a))) ||
  state.members.some((x) => x.userId === a && state.members.some((y) => y.userId === b && y.groupId === x.groupId));

export function sendMessage(to: string, kind: DirectMessageKind, body?: string | null, payload?: DirectMessage['payload']) {
  if (!to || to === state.me || !linked(state.me, to)) throw new GroupError('forbidden');
  if (kind === 'text' && !(body ?? '').trim()) throw new GroupError('invalid_payload');
  if (kind === 'ride' && (!payload || (payload.title ?? '').trim().length < 2 || !(Date.parse(payload.starts_at) > Date.now()) || (payload.meeting_point ?? '').trim().length < 2)) {
    throw new GroupError('invalid_payload');
  }
  messages.push({ id: uid('dm'), senderId: state.me, recipientId: to, kind, body: body?.trim() || null, payload: payload ?? null, createdAt: now() });
  emit();
}

export function thread(withUser: string): DirectMessage[] {
  return messages
    .filter((m) => (m.senderId === state.me && m.recipientId === withUser) || (m.senderId === withUser && m.recipientId === state.me))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function threads(): DirectThread[] {
  const byOther = new Map<string, DirectMessage[]>();
  messages
    .filter((m) => m.senderId === state.me || m.recipientId === state.me)
    .forEach((m) => {
      const other = m.senderId === state.me ? m.recipientId : m.senderId;
      byOther.set(other, [...(byOther.get(other) ?? []), m]);
    });
  return [...byOther.entries()]
    .map(([other, list]) => {
      const sorted = list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      return { other: profile(other), last: sorted[sorted.length - 1]!, unread: 0 };
    })
    .sort((a, b) => b.last.createdAt.localeCompare(a.last.createdAt));
}

// ---------------------------------------------------------------------------
// Données de démo : Yanis vient d'arriver, invité par Julie il y a 1 h.
// ---------------------------------------------------------------------------
(function seed() {
  const at = (h: number) => new Date(Date.now() - h * 36e5).toISOString();
  const moto = state.groups.find((g) => g.name === 'Moto-école Bastille')?.id;
  const yanis: Row = {
    id: 'f-yanis',
    inviterId: 'u-julie',
    code: 'YAN2S7RD',
    phone: null,
    email: null,
    presetGroupIds: ['g-night-riders', ...(moto ? [moto] : [])],
    status: 'claimed',
    via: 'code',
    acceptedBy: 'u-yanis',
    claimedAt: at(1),
    welcomedAt: null,
    expiresAt: new Date(Date.now() + 29 * DAY).toISOString(),
    createdAt: at(30),
  };
  invites.push(yanis);
  openPresetGroups(yanis);

  // Invitation encore en attente, avec téléphone et un groupe mémorisé.
  invites.push({
    id: 'f-tom',
    inviterId: 'u-julie',
    code: 'TOMRDE29',
    phone: '+33612345678',
    email: null,
    presetGroupIds: ['g-night-riders'],
    status: 'pending',
    via: null,
    acceptedBy: null,
    claimedAt: null,
    welcomedAt: null,
    expiresAt: new Date(Date.now() + 27 * DAY).toISOString(),
    createdAt: at(72),
  });
})();
