/**
 * Erreurs métier levées par les RPC Supabase (`raise exception '<code>'`)
 * et reproduites à l'identique par le mode démo.
 */
export type GroupErrorCode =
  | 'not_authenticated'
  | 'not_member'
  | 'forbidden'
  | 'founder_only'
  | 'rank_too_high'
  | 'unknown_permission'
  | 'role_not_found'
  | 'member_not_found'
  | 'default_role_locked'
  | 'transfer_founder_first'
  | 'invalid_payload'
  | 'already_member'
  | 'already_invited'
  | 'too_many_pending'
  | 'already_decided'
  | 'suggestion_not_found'
  | 'reason_required'
  | 'muted'
  | 'ride_not_found'
  | 'poll_not_found'
  | 'poll_closed'
  | 'invite_not_found'
  | 'invalid_phone'
  | 'invalid_email'
  | 'too_many_groups'
  | 'too_many_invites'
  | 'friend_invite_not_found'
  | 'pro_only'
  | 'already_verified'
  | 'verification_pending'
  | 'invalid_siret'
  | 'verification_not_found'
  | 'siret_closed'
  | 'siret_not_found'
  | 'unknown';

const MESSAGES: Record<GroupErrorCode, string> = {
  not_authenticated: 'Connecte-toi pour continuer.',
  not_member: 'Tu ne fais pas partie de ce groupe.',
  forbidden: 'Ton rôle ne permet pas cette action.',
  founder_only: 'Seul le fondateur peut faire ça.',
  rank_too_high: 'Tu ne peux agir que sur des rôles et membres de rang inférieur au tien.',
  unknown_permission: 'Permission inconnue.',
  role_not_found: 'Ce rôle n’existe plus.',
  member_not_found: 'Ce membre n’est plus dans le groupe.',
  default_role_locked: 'Le rôle attribué aux nouveaux membres ne peut pas être supprimé.',
  transfer_founder_first: 'Transfère d’abord ton rôle de fondateur à un autre membre.',
  invalid_payload: 'Certains champs sont incomplets ou invalides.',
  already_member: 'Cette personne fait déjà partie du groupe.',
  already_invited: 'Cette personne a déjà une invitation en attente.',
  too_many_pending: 'Tu as déjà 5 suggestions en attente dans ce groupe. Attends qu’elles soient traitées.',
  already_decided: 'Cette suggestion a déjà été traitée.',
  suggestion_not_found: 'Cette suggestion n’existe plus.',
  reason_required: 'Indique un motif de refus.',
  muted: 'Tu es en sourdine dans ce groupe.',
  ride_not_found: 'Cette sortie n’existe plus.',
  poll_not_found: 'Ce sondage n’existe plus.',
  poll_closed: 'Ce sondage est clos.',
  invite_not_found: 'Cette invitation n’est plus valable.',
  invalid_phone: 'Ce numéro de téléphone n’est pas valide.',
  invalid_email: 'Cette adresse email n’est pas valide.',
  too_many_groups: '10 groupes au maximum par invitation.',
  too_many_invites: 'Tu as déjà 50 invitations en attente.',
  friend_invite_not_found: 'Cette invitation n’existe plus.',
  pro_only: 'Réservé aux groupes pro.',
  already_verified: 'Ce groupe est déjà vérifié.',
  verification_pending: 'Une demande est déjà en cours d’examen.',
  invalid_siret: 'Ce SIRET n’est pas valide (14 chiffres, clé de contrôle).',
  verification_not_found: 'Cette demande n’existe plus.',
  siret_closed: 'Cet établissement est fermé au registre des entreprises.',
  siret_not_found: 'Ce SIRET est introuvable au registre des entreprises.',
  unknown: 'Une erreur est survenue. Réessaie.',
};

export class GroupError extends Error {
  constructor(public code: GroupErrorCode, message?: string) {
    super(message ?? MESSAGES[code]);
    this.name = 'GroupError';
  }
}

/** Convertit n'importe quelle erreur (PostgREST, réseau…) en GroupError. */
export function toGroupError(e: unknown): GroupError {
  if (e instanceof GroupError) return e;
  const raw = typeof e === 'object' && e && 'message' in e ? String((e as { message: unknown }).message) : '';
  const code = (Object.keys(MESSAGES) as GroupErrorCode[]).find((c) => raw === c) ?? 'unknown';
  return new GroupError(code);
}
