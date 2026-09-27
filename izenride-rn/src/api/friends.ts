/**
 * API Invitations d'amis (lot 3) : création du lien / QR code, rattachement
 * à l'inscription, onboarding de l'invité, bienvenue et messages 1-1.
 * Supabase si configuré, sinon mode démo.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscribeGroups } from './groups';
import { supabase, isDemo, PROFILES_TABLE } from './supabase';
import * as demo from './demoFriends';
import { demoMe, demoProfiles, setDemoMe } from './demoStore';
import { GroupError, toGroupError } from './errors';
import type { ClaimResult, DirectMessage, DirectMessageKind, DirectThread, FriendInvite, MyInvitation, Profile } from './types';

type Row = Record<string, any>;

// Les mutations Supabase préviennent les écrans abonnés (useQuery).
const listeners = new Set<() => void>();
export function subscribeFriends(fn: () => void): () => void {
  const unsubscribeGroups = subscribeGroups(fn);
  if (isDemo) return unsubscribeGroups;
  listeners.add(fn);
  return () => {
    unsubscribeGroups();
    listeners.delete(fn);
  };
}
const notify = () => listeners.forEach((fn) => fn());

async function rpc<T>(demoFn: () => T, name: string, args: Record<string, unknown> = {}): Promise<T> {
  try {
    if (isDemo) return demoFn();
    const { data, error } = await supabase!.rpc(name, args);
    if (error) throw error;
    notify();
    return data as T;
  } catch (e) {
    throw toGroupError(e);
  }
}

async function profiles(ids: (string | null)[]): Promise<Map<string, Profile>> {
  const unique = [...new Set(ids.filter((x): x is string => !!x))];
  if (!unique.length) return new Map();
  const { data } = await supabase!.from(PROFILES_TABLE).select('*').in('id', unique);
  return new Map(
    ((data ?? []) as Row[]).map((r) => [
      r.id,
      { id: r.id, name: r.display_name ?? r.username ?? r.first_name ?? r.name ?? 'Rider', avatarUrl: r.avatar_url ?? r.photo_url ?? null },
    ]),
  );
}
const fallback = (id: string): Profile => ({ id, name: 'Un rider', avatarUrl: null });

export async function currentUserId(): Promise<string> {
  if (isDemo) return demoMe();
  const { data } = await supabase!.auth.getUser();
  if (!data.user) throw new GroupError('not_authenticated');
  return data.user.id;
}

// ---------------------------------------------------------------------------
// Côté inviteur
// ---------------------------------------------------------------------------
export const createFriendInvite = (phone: string | null, email: string | null, groupIds: string[]) =>
  rpc(() => demo.createInvite(phone, email, groupIds), 'create_friend_invite', {
    p_phone: phone || null,
    p_email: email || null,
    p_group_ids: groupIds,
  }) as Promise<{ id: string; code: string }>;

export const updateFriendInviteGroups = (id: string, groupIds: string[]) =>
  rpc(() => demo.updateGroups(id, groupIds), 'update_friend_invite_groups', { p_invite: id, p_group_ids: groupIds });

export const cancelFriendInvite = (id: string) => rpc(() => demo.cancel(id), 'cancel_friend_invite', { p_invite: id });
export const renewFriendInvite = (id: string) => rpc(() => demo.renew(id), 'renew_friend_invite', { p_invite: id });
export const markFriendWelcomed = (id: string) => rpc(() => demo.markWelcomed(id), 'mark_friend_welcomed', { p_invite: id });

export async function listMyFriendInvites(): Promise<FriendInvite[]> {
  if (isDemo) return demo.listMine();
  try {
    const { data, error } = await supabase!.rpc('my_friend_invites');
    if (error) throw error;
    const rows = data as Row[];
    const people = await profiles(rows.map((r) => r.accepted_by));
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      status: r.status,
      hasPhone: r.has_phone,
      hasEmail: r.has_email,
      presetGroupIds: r.preset_group_ids,
      acceptedBy: r.accepted_by,
      friend: r.accepted_by ? people.get(r.accepted_by) ?? fallback(r.accepted_by) : null,
      claimedAt: r.claimed_at,
      welcomedAt: r.welcomed_at,
      expiresAt: r.expires_at,
      createdAt: r.created_at,
    }));
  } catch (e) {
    throw toGroupError(e);
  }
}

// ---------------------------------------------------------------------------
// Côté ami invité
// ---------------------------------------------------------------------------
const PENDING_CODE_KEY = 'izenride.pendingInviteCode';

/** Code reçu par le lien (deep link) : gardé jusqu'à l'inscription. */
export async function savePendingInviteCode(code: string) {
  await AsyncStorage.setItem(PENDING_CODE_KEY, code.trim().toUpperCase()).catch(() => {});
}
export async function readPendingInviteCode(): Promise<string | null> {
  return AsyncStorage.getItem(PENDING_CODE_KEY).catch(() => null);
}

/**
 * Rattache l'utilisateur connecté : par code, sinon par téléphone / email
 * vérifiés (côté serveur). En démo, `demoAs` simule le compte qui s'inscrit.
 */
export async function claimFriendInvite(code?: string | null, demoAs?: string): Promise<ClaimResult> {
  if (isDemo) {
    if (demoAs) setDemoMe(demoAs);
    const r = demo.claim(code);
    if (r.status !== 'none') await AsyncStorage.removeItem(PENDING_CODE_KEY).catch(() => {});
    return r;
  }
  const r = (await rpc<Row>(() => ({}), 'claim_friend_invite', { p_code: code ?? null })) as Row;
  if (r.status !== 'none') await AsyncStorage.removeItem(PENDING_CODE_KEY).catch(() => {});
  if (r.status === 'claimed') {
    return {
      status: 'claimed',
      inviteId: r.invite_id,
      inviterId: r.inviter_id,
      via: r.via,
      groups: (r.groups as Row[]).map((g) => ({ groupId: g.group_id, mode: g.mode, id: g.id })),
    };
  }
  if (r.status === 'already_claimed') return { status: 'already_claimed', inviteId: r.invite_id, inviterId: r.inviter_id };
  return { status: 'none' };
}

export async function getMyInvitation(): Promise<MyInvitation | null> {
  if (isDemo) return demo.myInvitation();
  try {
    const { data, error } = await supabase!.rpc('my_invitation');
    if (error) throw error;
    const r = data as Row | null;
    if (!r) return null;
    const people = await profiles([r.inviter_id]);
    return {
      inviteId: r.invite_id,
      inviter: people.get(r.inviter_id) ?? fallback(r.inviter_id),
      claimedAt: r.claimed_at,
      groups: (r.groups as Row[]).map((g) => ({
        groupId: g.group_id,
        name: g.name,
        kind: g.kind,
        verifiedAt: g.verified_at,
        memberCount: g.member_count,
        inviteId: g.invite_id,
        status: g.status,
      })),
    };
  } catch (e) {
    throw toGroupError(e);
  }
}

export const unlinkFriendInvite = () => rpc(() => demo.unlink(), 'unlink_friend_invite');

// ---------------------------------------------------------------------------
// Messages 1-1
// ---------------------------------------------------------------------------
export const sendDirectMessage = (to: string, kind: DirectMessageKind, body?: string | null, payload?: DirectMessage['payload']) =>
  rpc(() => demo.sendMessage(to, kind, body, payload), 'send_direct_message', {
    p_to: to,
    p_kind: kind,
    p_body: body ?? null,
    p_payload: payload ?? null,
  });

const toDm = (r: Row): DirectMessage => ({
  id: r.id,
  senderId: r.sender_id,
  recipientId: r.recipient_id,
  kind: r.kind,
  body: r.body,
  payload: r.payload,
  createdAt: r.created_at,
});

export async function getDirectThread(withUser: string): Promise<{ other: Profile; messages: DirectMessage[] }> {
  if (isDemo) {
    const other = demoProfiles().find((p) => p.id === withUser) ?? fallback(withUser);
    return { other, messages: demo.thread(withUser) };
  }
  const me = await currentUserId();
  const { data, error } = await supabase!
    .from('direct_messages')
    .select('*')
    .or(`and(sender_id.eq.${me},recipient_id.eq.${withUser}),and(sender_id.eq.${withUser},recipient_id.eq.${me})`)
    .order('created_at')
    .limit(200);
  if (error) throw toGroupError(error);
  const people = await profiles([withUser]);
  return { other: people.get(withUser) ?? fallback(withUser), messages: (data as Row[]).map(toDm) };
}

export async function listDirectThreads(): Promise<DirectThread[]> {
  if (isDemo) return demo.threads();
  const me = await currentUserId();
  const { data, error } = await supabase!.from('direct_messages').select('*').order('created_at', { ascending: false }).limit(200);
  if (error) throw toGroupError(error);
  const latest = new Map<string, Row>();
  const unread = new Map<string, number>();
  (data as Row[]).forEach((r) => {
    const other = r.sender_id === me ? r.recipient_id : r.sender_id;
    if (!latest.has(other)) latest.set(other, r);
    if (r.recipient_id === me && !r.read_at) unread.set(other, (unread.get(other) ?? 0) + 1);
  });
  const people = await profiles([...latest.keys()]);
  return [...latest.entries()].map(([other, r]) => ({ other: people.get(other) ?? fallback(other), last: toDm(r), unread: unread.get(other) ?? 0 }));
}

/** Temps réel des messages 1-1 (filtré par la RLS aux conversations de l'utilisateur). */
export function subscribeDirectMessages(onChange: () => void): () => void {
  const unsubscribeLocal = subscribeFriends(onChange);
  if (isDemo) return unsubscribeLocal;
  const channel = supabase!
    .channel('direct-messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, onChange)
    .subscribe();
  return () => {
    unsubscribeLocal();
    supabase!.removeChannel(channel);
  };
}
