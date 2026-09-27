/**
 * Mode démo du lot 4 : badge vérifié (Julie est modératrice IzenRide en
 * démo), sorties pro promues, statistiques. Mêmes règles que la migration
 * 20260930000001_pro_groups.sql.
 */
import { _demo } from './demoStore';
import { GroupError } from './errors';
import { isValidSiret } from './siret';
import type { GroupStats, PendingVerification, PublicRide, VerificationRequest } from './types';

const { state, assertPerm, roleOf, log, emit, uid, now, daysAgo } = _demo;

const moderators = new Set(['u-julie']);
const requests: VerificationRequest[] = [];

export const isModerator = () => moderators.has(state.me);

// ---------------------------------------------------------------------------
// Badge vérifié
// ---------------------------------------------------------------------------
export function listRequests(groupId: string): VerificationRequest[] {
  const role = roleOf(groupId, state.me);
  if (!isModerator() && !(role && (role.isFounder || role.permissions.includes('group.edit')))) return [];
  return requests.filter((r) => r.groupId === groupId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function request(groupId: string, legalName: string, siret: string, website?: string | null, documentPath?: string | null): string {
  if (assertPerm(groupId, null) !== 100) throw new GroupError('founder_only');
  const g = state.groups.find((x) => x.id === groupId)!;
  if (g.kind !== 'pro') throw new GroupError('pro_only');
  if (g.verifiedAt) throw new GroupError('already_verified');
  if (requests.some((r) => r.groupId === groupId && r.status === 'pending')) throw new GroupError('verification_pending');
  const clean = siret.replace(/\s/g, '');
  if (!isValidSiret(clean)) throw new GroupError('invalid_siret');
  if (legalName.trim().length < 2 || legalName.trim().length > 120) throw new GroupError('invalid_payload');
  const id = uid('v');
  requests.push({
    id,
    groupId,
    legalName: legalName.trim(),
    siret: clean,
    website: website?.trim() || null,
    documentPath: documentPath ?? null,
    status: 'pending',
    reviewerNote: null,
    createdAt: now(),
    decidedAt: null,
  });
  log(groupId, 'verification.requested', { request_id: id });
  emit();
  return id;
}

export function pending(): PendingVerification[] {
  if (!isModerator()) throw new GroupError('forbidden');
  return requests
    .filter((r) => r.status === 'pending')
    .map((r) => ({
      ...r,
      groupName: state.groups.find((g) => g.id === r.groupId)?.name ?? '—',
      memberCount: state.members.filter((m) => m.groupId === r.groupId).length,
    }));
}

export function decide(id: string, approve: boolean, note?: string | null) {
  if (!isModerator()) throw new GroupError('forbidden');
  const r = requests.find((x) => x.id === id && x.status === 'pending');
  if (!r) throw new GroupError('verification_not_found');
  if (!approve && !note?.trim()) throw new GroupError('reason_required');
  Object.assign(r, { status: approve ? 'approved' : 'rejected', reviewerNote: note?.trim() || null, decidedAt: now() });
  if (approve) state.groups.find((g) => g.id === r.groupId)!.verifiedAt = now();
  state.log.unshift({ id: state.log.length + 1, groupId: r.groupId, actorId: state.me, action: approve ? 'verification.approved' : 'verification.rejected', target: { note }, createdAt: now() });
  emit();
}

export function revoke(groupId: string, reason: string) {
  if (!isModerator()) throw new GroupError('forbidden');
  if (!reason.trim()) throw new GroupError('reason_required');
  const g = state.groups.find((x) => x.id === groupId);
  if (!g?.verifiedAt) throw new GroupError('verification_not_found');
  g.verifiedAt = null;
  requests.filter((r) => r.groupId === groupId && r.status === 'approved').forEach((r) => Object.assign(r, { status: 'revoked', reviewerNote: reason.trim(), decidedAt: now() }));
  state.log.unshift({ id: state.log.length + 1, groupId, actorId: state.me, action: 'verification.revoked', target: { reason }, createdAt: now() });
  emit();
}

// ---------------------------------------------------------------------------
// Sorties promues dans Événements
// ---------------------------------------------------------------------------
export function publicRides(): PublicRide[] {
  return state.rides
    .filter((r) => state.groups.find((g) => g.id === r.groupId)?.kind === 'pro' && !r.membersOnly && Date.parse(r.startsAt) > Date.now())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((r) => {
      const g = state.groups.find((x) => x.id === r.groupId)!;
      const participants = state.rideParticipants.filter((p) => p.rideId === r.id);
      return {
        id: r.id,
        groupId: g.id,
        groupName: g.name,
        verifiedAt: g.verifiedAt,
        title: r.title,
        startsAt: r.startsAt,
        meetingPoint: r.meetingPoint,
        route: r.route,
        level: r.level,
        participants: participants.length,
        going: participants.some((p) => p.userId === state.me),
        isMember: state.members.some((m) => m.groupId === g.id && m.userId === state.me),
      };
    });
}

export function joinPublic(rideId: string, join: boolean) {
  if (!publicRides().some((r) => r.id === rideId)) throw new GroupError('ride_not_found');
  state.rideParticipants = state.rideParticipants.filter((p) => !(p.rideId === rideId && p.userId === state.me));
  if (join) state.rideParticipants.push({ rideId, userId: state.me });
  emit();
}

// ---------------------------------------------------------------------------
// Statistiques (mêmes définitions que group_stats)
// ---------------------------------------------------------------------------
export function stats(groupId: string): GroupStats {
  assertPerm(groupId, 'insights.view');
  const t = Date.now();
  const within = (iso: string, days: number) => t - Date.parse(iso) < days * 864e5;
  const members = state.members.filter((m) => m.groupId === groupId);
  const msgs = state.messages.filter((m) => m.groupId === groupId);
  const rides = state.rides.filter((r) => r.groupId === groupId);
  const sugg = state.suggestions.filter((s) => s.groupId === groupId);
  const inv = state.invites.filter((i) => i.groupId === groupId);
  const active = (days: number) => new Set(msgs.filter((m) => m.authorId && within(m.createdAt, days)).map((m) => m.authorId)).size;

  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = new Date(monday.getTime() - (7 - i) * 7 * 864e5);
    const end = start.getTime() + 7 * 864e5;
    return {
      week: start.toISOString().slice(0, 10),
      count: msgs.filter((m) => m.kind === 'text' && Date.parse(m.createdAt) >= start.getTime() && Date.parse(m.createdAt) < end).length,
    };
  });

  const recentRides = rides.filter((r) => within(r.startsAt, 90) || Date.parse(r.startsAt) > t);
  const counts = recentRides.map((r) => state.rideParticipants.filter((p) => p.rideId === r.id).length);
  const decided = sugg.filter((s) => s.decidedAt && within(s.createdAt, 90)).map((s) => (Date.parse(s.decidedAt!) - Date.parse(s.createdAt)) / 36e5).sort((a, b) => a - b);
  const median = decided.length ? (decided.length % 2 ? decided[(decided.length - 1) / 2]! : (decided[decided.length / 2 - 1]! + decided[decided.length / 2]!) / 2) : null;

  return {
    members: {
      total: members.length,
      joined_30d: members.filter((m) => within(m.joinedAt, 30)).length,
      left_30d: state.log.filter((e) => e.groupId === groupId && (e.action === 'member.left' || e.action === 'member.removed') && within(e.createdAt, 30)).length,
    },
    engagement: { active_7d: active(7), active_30d: active(30), messages_per_week: weeks },
    rides: {
      upcoming: rides.filter((r) => Date.parse(r.startsAt) > t).length,
      past_90d: rides.filter((r) => Date.parse(r.startsAt) <= t && within(r.startsAt, 90)).length,
      avg_participants: counts.length ? Math.round((counts.reduce((a, b) => a + b, 0) / counts.length) * 10) / 10 : null,
      outside_participants: state.rideParticipants.filter((p) => recentRides.some((r) => r.id === p.rideId) && !members.some((m) => m.userId === p.userId)).length,
    },
    suggestions: {
      received_30d: sugg.filter((s) => within(s.createdAt, 30)).length,
      accepted_30d: sugg.filter((s) => within(s.createdAt, 30) && (s.status === 'accepted' || s.status === 'accepted_edited')).length,
      pending: sugg.filter((s) => s.status === 'pending' && Date.parse(s.expiresAt) > t).length,
      median_decision_hours: median === null ? null : Math.round(median * 10) / 10,
    },
    invites: {
      sent_30d: inv.filter((i) => within(i.createdAt, 30)).length,
      accepted_30d: inv.filter((i) => within(i.createdAt, 30) && i.status === 'accepted').length,
    },
  };
}

// ---------------------------------------------------------------------------
// Données de démo
// ---------------------------------------------------------------------------
(function seed() {
  const inDays = (d: number, hour: number) => {
    const x = new Date(Date.now() + d * 864e5);
    x.setHours(hour, 0, 0, 0);
    return x.toISOString();
  };
  const role = (groupId: string, name: string, rank: number, extra: Partial<(typeof state.roles)[number]> = {}) => {
    const r = { id: uid('r'), groupId, name, color: '#7a92b8', rank, permissions: [], isFounder: false, isDefault: false, ...extra };
    state.roles.push(r);
    return r;
  };

  // Moto-école Bastille (Marc, vérifiée) : sorties publiques et internes, activité.
  const moto = state.groups.find((g) => g.name === 'Moto-école Bastille');
  if (moto) {
    state.rides.push(
      { id: 'r-carole', groupId: moto.id, title: 'Stage piste · Circuit Carole', startsAt: inDays(8, 9), meetingPoint: 'Circuit Carole, Tremblay-en-France', route: 'Matinée technique, après-midi en roulage libre', level: 'intermediaire', membersOnly: false, createdBy: 'u-marc', fromSuggestionId: null },
      { id: 'r-eleves', groupId: moto.id, title: 'Sortie élèves permis A2', startsAt: inDays(4, 14), meetingPoint: '12 rue de la Roquette', route: null, level: 'tous', membersOnly: true, createdBy: 'u-marc', fromSuggestionId: null },
    );
    ['u-marc', 'u-nora', 'u-hugo'].forEach((userId) => state.rideParticipants.push({ rideId: 'r-carole', userId }));
    const say = (authorId: string, body: string, d: number) =>
      state.messages.push({ id: uid('m'), groupId: moto.id, authorId, kind: 'text', body, refId: null, createdAt: daysAgo(d) });
    say('u-marc', 'Rappel : gants et dorsale obligatoires sur piste.', 1);
    say('u-marc', 'Il reste 4 places pour le stage de samedi.', 9);
    say('u-julie', 'Je m’inscris !', 9);
    say('u-marc', 'Nouveaux créneaux plateau le mercredi soir.', 16);
    say('u-marc', 'Bienvenue aux nouveaux élèves de septembre 👋', 30);
    pushLog(moto.id, 'member.left', 12);
  }

  // Historique de messages dans Night Riders : 8 semaines pour les statistiques.
  const history: [string, string, number][] = [
    ['u-marc', 'Quelqu’un pour une virée à Fontainebleau ?', 45],
    ['u-sarah', 'Présente !', 45],
    ['u-leo', 'Photos de dimanche dans l’album 📸', 38],
    ['u-camille', 'Merci pour la sortie, top ambiance', 31],
    ['u-marc', 'On refait Chevreuse ?', 24],
    ['u-sarah', 'Dispo samedi matin', 24],
    ['u-antoine', 'Nouveau casque reçu 😎', 17],
    ['u-marc', 'Pneus neufs, prêt pour vendredi', 10],
    ['u-julie', 'Pensez au plein avant le départ', 10],
    ['u-camille', 'Je ramène les talkies', 9],
  ];
  history.forEach(([authorId, body, d]) =>
    state.messages.push({ id: uid('m'), groupId: 'g-night-riders', authorId, kind: 'text', body, refId: null, createdAt: daysAgo(d) }),
  );

  // Concession Bercy Motos (Hugo) : demande de badge en attente, sortie promue.
  const bercy = 'g-bercy';
  state.groups.push({ id: bercy, kind: 'pro', name: 'Concession Bercy Motos', photoUrl: null, description: 'Essais, sorties découverte et ateliers entretien.', rules: null, meetingPoint: 'Quai de Bercy, Paris 12e', plan: 'free', verifiedAt: null, createdAt: daysAgo(60) });
  const bercyFounder = role(bercy, 'Fondateur', 100, { color: '#fbbf24', isFounder: true });
  role(bercy, 'Membre', 10, { isDefault: true });
  state.members.push({ groupId: bercy, userId: 'u-hugo', roleId: bercyFounder.id, joinedAt: daysAgo(60), mutedUntil: null });
  state.rides.push({ id: 'r-mt09', groupId: bercy, title: 'Balade découverte MT-09', startsAt: inDays(11, 10), meetingPoint: 'Quai de Bercy, Paris 12e', route: 'Vallée de Chevreuse, retour par Versailles', level: 'tous', membersOnly: false, createdBy: 'u-hugo', fromSuggestionId: null });
  state.rideParticipants.push({ rideId: 'r-mt09', userId: 'u-hugo' }, { rideId: 'r-mt09', userId: 'u-leo' });
  requests.push({ id: 'v-bercy', groupId: bercy, legalName: 'Bercy Motos SAS', siret: '73282932000074', website: 'https://bercy-motos.fr', documentPath: `${bercy}/kbis-bercy.pdf`, status: 'pending', reviewerNote: null, createdAt: daysAgo(2), decidedAt: null });

  // Julie Moto Coaching (Julie, pro non vérifiée) : pour l'écran de demande de badge.
  const coaching = 'g-coaching';
  state.groups.push({ id: coaching, kind: 'pro', name: 'Julie Moto Coaching', photoUrl: null, description: 'Coaching route et reprise de confiance.', rules: null, meetingPoint: null, plan: 'free', verifiedAt: null, createdAt: daysAgo(10) });
  const founder = role(coaching, 'Fondateur', 100, { color: '#fbbf24', isFounder: true });
  role(coaching, 'Membre', 10, { isDefault: true });
  state.members.push({ groupId: coaching, userId: 'u-julie', roleId: founder.id, joinedAt: daysAgo(10), mutedUntil: null });

  function pushLog(groupId: string, action: string, d: number) {
    state.log.push({ id: state.log.length + 100, groupId, actorId: 'u-nora', action, target: { user_id: 'u-nora' }, createdAt: daysAgo(d) });
  }
})();

export const DEMO_PRO_GROUP_ID = 'g-coaching';
export const DEMO_MOTO_GROUP_NAME = 'Moto-école Bastille';
