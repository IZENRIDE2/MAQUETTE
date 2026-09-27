/**
 * API Groupes pro (lot 4) : badge vérifié et modération, sorties promues dans
 * Événements, statistiques, flag premium. Supabase si configuré, sinon démo.
 */
import { supabase, isDemo } from './supabase';
import * as demo from './demoPro';
import { toGroupError } from './errors';
import { subscribeGroups } from './groups';
import type { GroupStats, PendingVerification, PublicRide, VerificationRequest } from './types';

type Row = Record<string, any>;

const listeners = new Set<() => void>();
export function subscribePro(fn: () => void): () => void {
  const unsubscribe = subscribeGroups(fn);
  if (isDemo) return unsubscribe;
  listeners.add(fn);
  return () => {
    unsubscribe();
    listeners.delete(fn);
  };
}

async function rpc<T>(demoFn: () => T, name: string, args: Record<string, unknown> = {}): Promise<T> {
  try {
    if (isDemo) return demoFn();
    const { data, error } = await supabase!.rpc(name, args);
    if (error) throw error;
    listeners.forEach((fn) => fn());
    return data as T;
  } catch (e) {
    throw toGroupError(e);
  }
}

const toRequest = (r: Row): VerificationRequest => ({
  id: r.id,
  groupId: r.group_id,
  legalName: r.legal_name,
  siret: r.siret,
  website: r.website,
  documentPath: r.document_path,
  status: r.status,
  reviewerNote: r.reviewer_note,
  createdAt: r.created_at,
  decidedAt: r.decided_at,
});

// ---------------------------------------------------------------------------
// Badge vérifié
// ---------------------------------------------------------------------------
export async function listVerificationRequests(groupId: string): Promise<VerificationRequest[]> {
  if (isDemo) return demo.listRequests(groupId);
  const { data, error } = await supabase!.from('group_verification_requests').select('*').eq('group_id', groupId).order('created_at', { ascending: false });
  if (error) throw toGroupError(error);
  return (data as Row[]).map(toRequest);
}

/** Envoie le justificatif dans le dossier du groupe (bucket privé `verification-docs`). */
export async function uploadVerificationDocument(groupId: string, file: { uri: string; name: string; mimeType?: string | null }): Promise<string> {
  const path = `${groupId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
  if (isDemo) return path;
  const body = await (await fetch(file.uri)).arrayBuffer();
  const { error } = await supabase!.storage.from('verification-docs').upload(path, body, { contentType: file.mimeType ?? 'application/octet-stream' });
  if (error) throw toGroupError(error);
  return path;
}

export const requestVerification = (groupId: string, legalName: string, siret: string, website: string | null, documentPath: string | null) =>
  rpc(() => demo.request(groupId, legalName, siret, website, documentPath), 'request_group_verification', {
    p_group: groupId,
    p_legal_name: legalName,
    p_siret: siret,
    p_website: website,
    p_document_path: documentPath,
  }) as Promise<string>;

export async function isModerator(): Promise<boolean> {
  if (isDemo) return demo.isModerator();
  const { data } = await supabase!.rpc('is_app_moderator');
  return !!data;
}

export async function listPendingVerifications(): Promise<PendingVerification[]> {
  if (isDemo) return demo.pending();
  const rows = (await rpc<Row[]>(() => [], 'pending_verifications')) ?? [];
  return rows.map((r) => ({ ...toRequest({ ...r, status: 'pending' }), groupName: r.group_name, memberCount: r.member_count }));
}

export const decideVerification = (id: string, approve: boolean, note?: string | null) =>
  rpc(() => demo.decide(id, approve, note), 'decide_group_verification', { p_request: id, p_approve: approve, p_note: note ?? null });

export const revokeVerification = (groupId: string, reason: string) =>
  rpc(() => demo.revoke(groupId, reason), 'revoke_group_verification', { p_group: groupId, p_reason: reason });

/** Lien temporaire vers le justificatif (modérateurs, fondateur). */
export async function verificationDocumentUrl(path: string): Promise<string | null> {
  if (isDemo) return null;
  const { data } = await supabase!.storage.from('verification-docs').createSignedUrl(path, 300);
  return data?.signedUrl ?? null;
}

// ---------------------------------------------------------------------------
// Sorties promues
// ---------------------------------------------------------------------------
export async function listPublicProRides(): Promise<PublicRide[]> {
  if (isDemo) return demo.publicRides();
  const rows = (await rpc<Row[]>(() => [], 'public_pro_rides', { p_limit: 50 })) ?? [];
  return rows.map((r) => ({
    id: r.id,
    groupId: r.group_id,
    groupName: r.group_name,
    verifiedAt: r.verified_at,
    title: r.title,
    startsAt: r.starts_at,
    meetingPoint: r.meeting_point,
    route: r.route,
    level: r.level,
    participants: r.participants,
    going: r.going,
    isMember: r.is_member,
  }));
}

export const joinPublicRide = (rideId: string, join: boolean) =>
  rpc(() => demo.joinPublic(rideId, join), 'join_public_ride', { p_ride: rideId, p_join: join });

// ---------------------------------------------------------------------------
// Statistiques et flag premium
// ---------------------------------------------------------------------------
export const getGroupStats = (groupId: string) => rpc(() => demo.stats(groupId), 'group_stats', { p_group: groupId }) as Promise<GroupStats>;

/**
 * Flag premium des groupes pro. Toutes les fonctionnalités restent ouvertes
 * tant que l'offre payante n'est pas définie (voir `has_feature` en SQL).
 */
export type ProFeature = 'stats.advanced' | 'managers.unlimited' | 'rides.sponsored';
export const hasFeature = (_plan: 'free' | 'pro', _feature: ProFeature) => true;
