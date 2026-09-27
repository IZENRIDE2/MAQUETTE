/**
 * Contenus des sorties, invitations, annonces et sondages : validation et
 * normalisation identiques à `normalize_group_payload` (SQL). Sert aux
 * formulaires (erreurs par champ) et au mode démo.
 */
import type { AnyPayload, GroupKind, PayloadOf, RideLevel, SuggestionType } from './types';
import type { Permission } from './permissions';

export const TYPE_META: Record<
  SuggestionType,
  { label: string; direct: Permission; accept: Permission; create: string; propose: string; article: string }
> = {
  ride: { label: 'Sortie', direct: 'ride.create', accept: 'accept.ride', create: 'Créer une sortie', propose: 'Proposer une sortie', article: 'une sortie' },
  poll: { label: 'Sondage', direct: 'poll.create', accept: 'accept.poll', create: 'Lancer un sondage', propose: 'Proposer un sondage', article: 'un sondage' },
  announcement: {
    label: 'Annonce',
    direct: 'content.announce',
    accept: 'accept.content',
    create: 'Publier une annonce',
    propose: 'Proposer une annonce',
    article: 'une annonce',
  },
  member: { label: 'Membre', direct: 'member.invite', accept: 'accept.member', create: 'Inviter un membre', propose: 'Proposer un membre', article: 'un membre' },
};

export const LEVELS: { key: RideLevel; label: string }[] = [
  { key: 'tous', label: 'Tous niveaux' },
  { key: 'intermediaire', label: 'Intermédiaire' },
  { key: 'confirme', label: 'Confirmé' },
];

/** Erreurs par champ, en français, prêtes à afficher sous les champs. */
export type FieldErrors = Partial<Record<string, string>>;

export class PayloadError extends Error {
  constructor(public fields: FieldErrors) {
    super(Object.values(fields)[0] ?? 'Contenu invalide');
  }
}

const len = (v: unknown) => (typeof v === 'string' ? v.trim().length : 0);
const isFuture = (iso: unknown) => typeof iso === 'string' && !Number.isNaN(Date.parse(iso)) && Date.parse(iso) > Date.now();

/**
 * Valide et normalise un contenu. `groupKind` règle `members_only` :
 * une sortie d'un groupe d'amis reste toujours interne.
 */
export function normalizePayload<T extends SuggestionType>(type: T, raw: Partial<PayloadOf[T]>, groupKind: GroupKind): PayloadOf[T] {
  const e: FieldErrors = {};
  const p = raw as Record<string, unknown>;
  let out: AnyPayload;

  switch (type) {
    case 'ride': {
      if (len(p.title) < 2 || len(p.title) > 80) e.title = 'Donne un titre de 2 à 80 caractères.';
      if (!isFuture(p.starts_at)) e.starts_at = 'Choisis une date et une heure à venir.';
      if (len(p.meeting_point) < 2 || len(p.meeting_point) > 200) e.meeting_point = 'Indique le point de rendez-vous.';
      if (len(p.route) > 500) e.route = '500 caractères maximum.';
      const level = (p.level as RideLevel) ?? 'tous';
      if (!LEVELS.some((l) => l.key === level)) e.level = 'Niveau inconnu.';
      out = {
        title: String(p.title ?? '').trim(),
        starts_at: e.starts_at ? '' : new Date(Date.parse(String(p.starts_at))).toISOString(),
        meeting_point: String(p.meeting_point ?? '').trim(),
        route: len(p.route) ? String(p.route).trim() : null,
        level,
        members_only: groupKind === 'pro' ? Boolean(p.members_only ?? false) : true,
      };
      break;
    }
    case 'member': {
      if (!p.user_id) e.user_id = 'Choisis la personne à inviter.';
      if (len(p.intro) > 200) e.intro = '200 caractères maximum.';
      out = { user_id: String(p.user_id ?? ''), intro: len(p.intro) ? String(p.intro).trim() : null };
      break;
    }
    case 'announcement': {
      if (len(p.body) < 1 || len(p.body) > 1000) e.body = 'Écris l’annonce (1 000 caractères maximum).';
      const pin = p.pin_days === undefined ? 7 : Number(p.pin_days);
      if (!Number.isInteger(pin) || pin < 0 || pin > 30) e.pin_days = 'Durée d’épinglage entre 0 et 30 jours.';
      out = { body: String(p.body ?? '').trim(), pin_days: pin };
      break;
    }
    case 'poll': {
      if (len(p.question) < 3 || len(p.question) > 200) e.question = 'Pose une question de 3 à 200 caractères.';
      const options = (Array.isArray(p.options) ? p.options : []).map((o) => String(o).trim()).filter(Boolean);
      if (options.length < 2 || options.length > 6) e.options = 'Il faut entre 2 et 6 réponses.';
      else if (options.some((o) => o.length > 80)) e.options = '80 caractères maximum par réponse.';
      else if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) e.options = 'Deux réponses sont identiques.';
      if (p.ends_at && !isFuture(p.ends_at)) e.ends_at = 'La fin du sondage doit être à venir.';
      out = { question: String(p.question ?? '').trim(), options, ends_at: p.ends_at ? String(p.ends_at) : null };
      break;
    }
    default:
      throw new PayloadError({ type: 'Type inconnu.' });
  }
  if (Object.keys(e).length) throw new PayloadError(e);
  return out as PayloadOf[T];
}

// ---------------------------------------------------------------------------
// Affichage
// ---------------------------------------------------------------------------
const DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

/** « ven. 3 oct. · 21h30 » */
export function formatRideDate(iso: string): string {
  const d = new Date(iso);
  const hm = `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`;
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} · ${hm}`;
}

/** Résumé en une ligne d'un contenu, pour les cartes et notifications. */
export function summarize(type: SuggestionType, p: AnyPayload, nameOf?: (id: string) => string): string {
  switch (type) {
    case 'ride': {
      const r = p as PayloadOf['ride'];
      return `${r.title} · ${formatRideDate(r.starts_at)}`;
    }
    case 'poll':
      return (p as PayloadOf['poll']).question;
    case 'announcement':
      return (p as PayloadOf['announcement']).body;
    case 'member': {
      const m = p as PayloadOf['member'];
      return `Inviter ${nameOf ? nameOf(m.user_id) : 'un rider'}`;
    }
  }
}

/**
 * Lit « JJ/MM » ou « JJ/MM/AAAA » + « HH:MM » (ou « 21h30 ») en date ISO.
 * Sans année, prend la prochaine occurrence. Renvoie null si illisible.
 */
export function parseFrenchDateTime(date: string, time: string): string | null {
  const dm = date.trim().match(/^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?$/);
  const tm = time.trim().match(/^(\d{1,2})\s*[h:]\s*(\d{2})?$/i);
  if (!dm || !tm) return null;
  const day = Number(dm[1]);
  const month = Number(dm[2]) - 1;
  const hour = Number(tm[1]);
  const minute = Number(tm[2] ?? 0);
  if (month < 0 || month > 11 || day < 1 || day > 31 || hour > 23 || minute > 59) return null;
  const now = new Date();
  let year = dm[3] ? Number(dm[3].length === 2 ? `20${dm[3]}` : dm[3]) : now.getFullYear();
  let d = new Date(year, month, day, hour, minute);
  if (!dm[3] && d.getTime() < now.getTime()) d = new Date(++year, month, day, hour, minute);
  if (d.getMonth() !== month) return null;
  return d.toISOString();
}

/** Inverse de parseFrenchDateTime, pour pré-remplir un formulaire. */
export function splitFrenchDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return { date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}
