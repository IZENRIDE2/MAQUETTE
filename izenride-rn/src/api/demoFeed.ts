/**
 * Mode démo du lot 2 : réplique en mémoire de group_action, decide_suggestion,
 * chat, sorties, sondages, annonces et invitations. Mêmes règles que la
 * migration 20260928000001_groups_suggestions.sql.
 */
import { _demo, DEMO_GROUP_ID } from './demoStore';
import { GroupError } from './errors';
import { normalizePayload, PayloadError, TYPE_META } from './payloads';
import type {
  AnyPayload,
  ChatMessage,
  DecisionResult,
  GroupActionResult,
  GroupFeed,
  NotificationPrefs,
  PayloadOf,
  Profile,
  ReceivedInvite,
  SuggestionType,
} from './types';

const { state, assertPerm, roleOf, effectivePerms, log, emit, uid, now } = _demo;

const groupKind = (groupId: string) => state.groups.find((g) => g.id === groupId)?.kind ?? 'friends';
const nameOf = (id: string | null) => _demo.profiles.find((p) => p.id === id)?.name ?? 'Un rider';

function normalize<T extends SuggestionType>(groupId: string, type: T, payload: Partial<PayloadOf[T]>): PayloadOf[T] {
  let out: PayloadOf[T];
  try {
    out = normalizePayload(type, payload, groupKind(groupId));
  } catch (e) {
    if (e instanceof PayloadError) throw new GroupError('invalid_payload', e.message);
    throw e;
  }
  if (type === 'member') {
    const userId = (out as PayloadOf['member']).user_id;
    if (!_demo.profiles.some((p) => p.id === userId)) throw new GroupError('invalid_payload');
    if (state.members.some((m) => m.groupId === groupId && m.userId === userId)) throw new GroupError('already_member');
    if (state.invites.some((i) => i.groupId === groupId && i.inviteeId === userId && i.status === 'pending')) {
      throw new GroupError('already_invited');
    }
  }
  return out;
}

const pushMessage = (m: Omit<ChatMessage, 'id' | 'createdAt'> & { createdAt?: string }) =>
  state.messages.push({ id: uid('m'), createdAt: now(), ...m });

function apply(groupId: string, type: SuggestionType, p: AnyPayload, authorId: string, suggestionId: string | null): string {
  const id = uid(type);
  switch (type) {
    case 'ride': {
      const r = p as PayloadOf['ride'];
      state.rides.push({
        id,
        groupId,
        title: r.title,
        startsAt: r.starts_at,
        meetingPoint: r.meeting_point,
        route: r.route ?? null,
        level: r.level ?? 'tous',
        membersOnly: r.members_only ?? true,
        createdBy: authorId,
        fromSuggestionId: suggestionId,
      });
      state.rideParticipants.push({ rideId: id, userId: authorId });
      break;
    }
    case 'poll': {
      const q = p as PayloadOf['poll'];
      state.polls.push({ id, groupId, question: q.question, options: q.options, endsAt: q.ends_at ?? null, createdBy: authorId });
      break;
    }
    case 'announcement': {
      const a = p as PayloadOf['announcement'];
      state.announcements.push({
        id,
        groupId,
        body: a.body,
        pinnedUntil: a.pin_days > 0 ? new Date(Date.now() + a.pin_days * 864e5).toISOString() : null,
        authorId,
        createdAt: now(),
      });
      break;
    }
    case 'member': {
      const m = p as PayloadOf['member'];
      state.invites.push({
        id,
        groupId,
        inviteeId: m.user_id,
        invitedBy: authorId,
        intro: m.intro ?? null,
        status: 'pending',
        viaSuggestionId: suggestionId,
        createdAt: now(),
      });
      break;
    }
  }
  pushMessage({ groupId, authorId, kind: type === 'member' ? 'invite' : type, body: null, refId: id });
  log(groupId, `${type}.created`, { id, author_id: authorId, suggestion_id: suggestionId });
  return id;
}

// ---------------------------------------------------------------------------
// Lecture
// ---------------------------------------------------------------------------
export function getFeed(groupId: string): GroupFeed {
  assertPerm(groupId, null);
  const me = state.me;
  const invites = state.invites.filter((i) => i.groupId === groupId);
  const people: Record<string, Profile> = {};
  invites.forEach((i) => {
    const p = _demo.profiles.find((x) => x.id === i.inviteeId);
    if (p) people[p.id] = p;
  });
  state.suggestions
    .filter((s) => s.groupId === groupId && s.type === 'member')
    .forEach((s) => {
      const p = _demo.profiles.find((x) => x.id === (s.payload as PayloadOf['member']).user_id);
      if (p) people[p.id] = p;
    });
  return {
    messages: state.messages.filter((m) => m.groupId === groupId).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    suggestions: state.suggestions
      .filter((s) => s.groupId === groupId)
      .map((s) => ({
        ...s,
        votes: state.suggestionVotes.filter((v) => v.suggestionId === s.id).length,
        votedByMe: state.suggestionVotes.some((v) => v.suggestionId === s.id && v.userId === me),
      })),
    rides: state.rides
      .filter((r) => r.groupId === groupId)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      .map((r) => ({ ...r, participants: state.rideParticipants.filter((x) => x.rideId === r.id).map((x) => x.userId) })),
    polls: state.polls
      .filter((p) => p.groupId === groupId)
      .map((p) => {
        const votes = state.pollVotes.filter((v) => v.pollId === p.id);
        return { ...p, counts: p.options.map((_, i) => votes.filter((v) => v.option === i).length), myVote: votes.find((v) => v.userId === me)?.option ?? null };
      }),
    announcements: state.announcements.filter((a) => a.groupId === groupId),
    invites: invites.map((i) => ({ id: i.id, groupId: i.groupId, inviteeId: i.inviteeId, invitedBy: i.invitedBy, status: i.status })),
    people,
  };
}

export function myGroupInvites(): ReceivedInvite[] {
  return state.invites
    .filter((i) => i.inviteeId === state.me && i.status === 'pending')
    .map((i) => {
      const g = state.groups.find((x) => x.id === i.groupId)!;
      return {
        id: i.id,
        groupId: g.id,
        groupName: g.name,
        groupKind: g.kind,
        verifiedAt: g.verifiedAt,
        memberCount: state.members.filter((m) => m.groupId === g.id).length,
        invitedBy: i.invitedBy,
        inviterName: nameOf(i.invitedBy),
        intro: i.intro,
        createdAt: i.createdAt,
      };
    });
}

/** Riders IzenRide trouvables pour une suggestion de membre. */
export function searchProfiles(query: string, groupId: string): Profile[] {
  const q = query.trim().toLowerCase();
  return _demo.profiles.filter(
    (p) => p.id !== state.me && !state.members.some((m) => m.groupId === groupId && m.userId === p.id) && (!q || p.name.toLowerCase().includes(q)),
  );
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export function groupAction<T extends SuggestionType>(groupId: string, type: T, payload: Partial<PayloadOf[T]>): GroupActionResult {
  assertPerm(groupId, null);
  const p = normalize(groupId, type, payload);
  const role = roleOf(groupId, state.me)!;
  if (effectivePerms(role).includes(TYPE_META[type].direct)) {
    const id = apply(groupId, type, p, state.me, null);
    emit();
    return { mode: 'created', id };
  }
  const pending = state.suggestions.filter(
    (s) => s.groupId === groupId && s.authorId === state.me && s.status === 'pending' && Date.parse(s.expiresAt) > Date.now(),
  ).length;
  if (pending >= 5) throw new GroupError('too_many_pending');
  let expires = Date.now() + 14 * 864e5;
  if (type === 'ride') expires = Math.min(expires, Date.parse((p as PayloadOf['ride']).starts_at));
  const id = uid('s');
  state.suggestions.push({
    id,
    groupId,
    authorId: state.me,
    type,
    payload: p,
    status: 'pending',
    decidedBy: null,
    decidedAt: null,
    editedPayload: null,
    refusalReason: null,
    resultId: null,
    expiresAt: new Date(expires).toISOString(),
    createdAt: now(),
  });
  pushMessage({ groupId, authorId: state.me, kind: 'suggestion', body: null, refId: id });
  emit();
  return { mode: 'suggested', id };
}

export function decideSuggestion(id: string, accept: boolean, edited?: AnyPayload | null, reason?: string | null): DecisionResult {
  const s = state.suggestions.find((x) => x.id === id);
  if (!s) throw new GroupError('suggestion_not_found');
  assertPerm(s.groupId, TYPE_META[s.type].accept);
  if (s.status !== 'pending') throw new GroupError('already_decided');
  if (Date.parse(s.expiresAt) <= Date.now()) {
    s.status = 'expired';
    emit();
    return { status: 'expired' };
  }
  if (accept) {
    const final = normalize(s.groupId, s.type, (edited ?? s.payload) as Partial<PayloadOf[typeof s.type]>);
    s.resultId = apply(s.groupId, s.type, final, s.authorId, s.id);
    s.status = edited ? 'accepted_edited' : 'accepted';
    s.editedPayload = edited ? final : null;
  } else {
    const r = (reason ?? '').trim();
    if (r.length < 1 || r.length > 200) throw new GroupError('reason_required');
    s.status = 'refused';
    s.refusalReason = r;
  }
  s.decidedBy = state.me;
  s.decidedAt = now();
  log(s.groupId, `suggestion.${s.status}`, { suggestion_id: s.id, type: s.type, author_id: s.authorId });
  emit();
  return { status: s.status, resultId: s.resultId };
}

export function withdrawSuggestion(id: string) {
  const s = state.suggestions.find((x) => x.id === id && x.authorId === state.me && x.status === 'pending');
  if (!s) throw new GroupError('suggestion_not_found');
  s.status = 'withdrawn';
  emit();
}

export function toggleSuggestionVote(id: string): number {
  const s = state.suggestions.find((x) => x.id === id && x.status === 'pending');
  if (!s) throw new GroupError('suggestion_not_found');
  assertPerm(s.groupId, null);
  const i = state.suggestionVotes.findIndex((v) => v.suggestionId === id && v.userId === state.me);
  if (i >= 0) state.suggestionVotes.splice(i, 1);
  else state.suggestionVotes.push({ suggestionId: id, userId: state.me });
  emit();
  return state.suggestionVotes.filter((v) => v.suggestionId === id).length;
}

export function postMessage(groupId: string, body: string) {
  assertPerm(groupId, null);
  const m = state.members.find((x) => x.groupId === groupId && x.userId === state.me)!;
  if (m.mutedUntil && Date.parse(m.mutedUntil) > Date.now()) throw new GroupError('muted');
  const text = body.trim();
  if (text.length < 1 || text.length > 2000) throw new GroupError('invalid_payload');
  pushMessage({ groupId, authorId: state.me, kind: 'text', body: text, refId: null });
  emit();
}

export function setRideParticipation(rideId: string, join: boolean) {
  const r = state.rides.find((x) => x.id === rideId);
  if (!r) throw new GroupError('ride_not_found');
  assertPerm(r.groupId, null);
  state.rideParticipants = state.rideParticipants.filter((x) => !(x.rideId === rideId && x.userId === state.me));
  if (join) state.rideParticipants.push({ rideId, userId: state.me });
  emit();
}

export function votePoll(pollId: string, option: number) {
  const p = state.polls.find((x) => x.id === pollId);
  if (!p) throw new GroupError('poll_not_found');
  assertPerm(p.groupId, null);
  if (p.endsAt && Date.parse(p.endsAt) <= Date.now()) throw new GroupError('poll_closed');
  if (!Number.isInteger(option) || option < 0 || option >= p.options.length) throw new GroupError('invalid_payload');
  state.pollVotes = state.pollVotes.filter((v) => !(v.pollId === pollId && v.userId === state.me));
  state.pollVotes.push({ pollId, userId: state.me, option });
  emit();
}

export function respondGroupInvite(inviteId: string, accept: boolean) {
  const inv = state.invites.find((i) => i.id === inviteId && i.inviteeId === state.me && i.status === 'pending');
  if (!inv) throw new GroupError('invite_not_found');
  inv.status = accept ? 'accepted' : 'declined';
  if (accept) {
    const def = state.roles.find((r) => r.groupId === inv.groupId && r.isDefault)!;
    state.members.push({ groupId: inv.groupId, userId: state.me, roleId: def.id, joinedAt: now(), mutedUntil: null });
    pushMessage({ groupId: inv.groupId, authorId: state.me, kind: 'system', body: null, refId: inv.id });
    log(inv.groupId, 'member.joined', { user_id: state.me, invited_by: inv.invitedBy });
  }
  emit();
}

// ---------------------------------------------------------------------------
// Préférences de notification
// ---------------------------------------------------------------------------
export function getPrefs(): NotificationPrefs {
  const mine = state.prefs.filter((p) => p.userId === state.me);
  const g = mine.find((p) => p.groupId === null);
  const groups: NotificationPrefs['groups'] = {};
  mine.filter((p) => p.groupId).forEach((p) => (groups[p.groupId!] = { suggestions: p.suggestions, outcome: p.outcome }));
  return { global: { suggestions: g?.suggestions ?? true, outcome: g?.outcome ?? true }, groups };
}

export function setPrefs(groupId: string | null, suggestions: boolean, outcome: boolean) {
  if (groupId) assertPerm(groupId, null);
  const existing = state.prefs.find((p) => p.userId === state.me && p.groupId === groupId);
  if (existing) Object.assign(existing, { suggestions, outcome });
  else state.prefs.push({ userId: state.me, groupId, suggestions, outcome });
  emit();
}

// ---------------------------------------------------------------------------
// Données de démo : un fil vivant dans « Night Riders Paris »
// ---------------------------------------------------------------------------
(function seed() {
  const g = DEMO_GROUP_ID;
  const at = (h: number) => new Date(Date.now() - h * 36e5).toISOString();
  const inDays = (d: number, hour: number, min = 0) => {
    const x = new Date(Date.now() + d * 864e5);
    x.setHours(hour, min, 0, 0);
    return x.toISOString();
  };
  const say = (authorId: string, body: string, h: number) => pushMessage({ groupId: g, authorId, kind: 'text', body, refId: null, createdAt: at(h) });

  // Annonce épinglée par Julie
  state.announcements.push({ id: 'a-gilets', groupId: g, body: 'Gilet haute visibilité obligatoire pour les sorties de nuit. Merci !', pinnedUntil: inDays(5, 23), authorId: 'u-julie', createdAt: at(50) });
  pushMessage({ groupId: g, authorId: 'u-julie', kind: 'announcement', body: null, refId: 'a-gilets', createdAt: at(50) });

  // Sortie créée par Sarah (Road captain)
  state.rides.push({ id: 'r-montmartre', groupId: g, title: 'Night ride Montmartre', startsAt: inDays(3, 21, 30), meetingPoint: 'Place de la Bastille', route: 'Quais rive droite, Pigalle, Sacré-Cœur', level: 'tous', membersOnly: true, createdBy: 'u-sarah', fromSuggestionId: null });
  ['u-sarah', 'u-marc', 'u-camille', 'u-julie'].forEach((userId) => state.rideParticipants.push({ rideId: 'r-montmartre', userId }));
  say('u-marc', 'Vendredi on part à 21h30 de Bastille, ok pour tout le monde ?', 30);
  pushMessage({ groupId: g, authorId: 'u-sarah', kind: 'ride', body: null, refId: 'r-montmartre', createdAt: at(29) });
  say('u-camille', 'Je viens ! Je ramène des talkies 📻', 28);

  // Sondage accepté après une suggestion de Camille
  state.suggestions.push({ id: 's-sondage', groupId: g, authorId: 'u-camille', type: 'poll', payload: { question: 'Prochain week-end : quelle destination ?', options: ['Fontainebleau', 'Vexin', 'Chevreuse'], ends_at: null }, status: 'accepted', decidedBy: 'u-sarah', decidedAt: at(20), editedPayload: null, refusalReason: null, resultId: 'p-weekend', expiresAt: inDays(10, 12), createdAt: at(24) });
  pushMessage({ groupId: g, authorId: 'u-camille', kind: 'suggestion', body: null, refId: 's-sondage', createdAt: at(24) });
  state.polls.push({ id: 'p-weekend', groupId: g, question: 'Prochain week-end : quelle destination ?', options: ['Fontainebleau', 'Vexin', 'Chevreuse'], endsAt: inDays(4, 20), createdBy: 'u-camille' });
  pushMessage({ groupId: g, authorId: 'u-camille', kind: 'poll', body: null, refId: 'p-weekend', createdAt: at(20) });
  [['u-marc', 0], ['u-sarah', 1], ['u-camille', 1], ['u-antoine', 2]].forEach(([userId, option]) => state.pollVotes.push({ pollId: 'p-weekend', userId: userId as string, option: option as number }));

  // Suggestions en attente : une sortie de Léo, une invitation proposée par Antoine
  state.suggestions.push({ id: 's-vexin', groupId: g, authorId: 'u-leo', type: 'ride', payload: { title: 'Balade dans le Vexin', starts_at: inDays(6, 9), meeting_point: 'Porte Maillot', route: 'Cergy, La Roche-Guyon, retour par la D14', level: 'intermediaire', members_only: true }, status: 'pending', decidedBy: null, decidedAt: null, editedPayload: null, refusalReason: null, resultId: null, expiresAt: inDays(6, 9), createdAt: at(6) });
  pushMessage({ groupId: g, authorId: 'u-leo', kind: 'suggestion', body: null, refId: 's-vexin', createdAt: at(6) });
  state.suggestionVotes.push({ suggestionId: 's-vexin', userId: 'u-camille' }, { suggestionId: 's-vexin', userId: 'u-antoine' });
  say('u-leo', 'Je vous ai proposé une balade dans le Vexin, dites-moi 🙏', 5.9);

  state.suggestions.push({ id: 's-ines', groupId: g, authorId: 'u-antoine', type: 'member', payload: { user_id: 'u-ines', intro: 'Inès roule en MT-07, on s’est croisés à Vincennes.' }, status: 'pending', decidedBy: null, decidedAt: null, editedPayload: null, refusalReason: null, resultId: null, expiresAt: inDays(13, 12), createdAt: at(2) });
  pushMessage({ groupId: g, authorId: 'u-antoine', kind: 'suggestion', body: null, refId: 's-ines', createdAt: at(2) });

  // Un autre groupe invite Julie (écran Messages → Invitations)
  const hugoGroup = 'g-cafe-racers';
  state.groups.push({ id: hugoGroup, kind: 'friends', name: 'Café Racers 75', photoUrl: null, description: 'Néo-rétro et cafés du dimanche.', rules: null, meetingPoint: 'Canal Saint-Martin', plan: 'free', verifiedAt: null, createdAt: at(400) });
  const founder = { id: uid('r'), groupId: hugoGroup, name: 'Fondateur', color: '#fbbf24', rank: 100, permissions: [], isFounder: true, isDefault: false };
  const member = { id: uid('r'), groupId: hugoGroup, name: 'Membre', color: '#7a92b8', rank: 10, permissions: [], isFounder: false, isDefault: true };
  state.roles.push(founder, member);
  state.members.push({ groupId: hugoGroup, userId: 'u-hugo', roleId: founder.id, joinedAt: at(400), mutedUntil: null });
  state.members.push({ groupId: hugoGroup, userId: 'u-nora', roleId: member.id, joinedAt: at(300), mutedUntil: null });
  state.invites.push({ id: 'i-julie', groupId: hugoGroup, inviteeId: 'u-julie', invitedBy: 'u-hugo', intro: 'Viens rouler avec nous dimanche !', status: 'pending', viaSuggestionId: null, createdAt: at(3) });
})();
