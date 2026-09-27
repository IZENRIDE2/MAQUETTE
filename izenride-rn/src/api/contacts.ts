/**
 * Normalisation du téléphone et de l'email, identique à `normalize_phone` /
 * `normalize_email` (SQL). Sert à valider la saisie avant l'envoi : côté
 * serveur, seules des empreintes HMAC sont stockées.
 */
export function normalizePhone(input: string | null | undefined): string | null {
  if (!input || !input.trim()) return null;
  let v = input.replace(/[\s.\-()]/g, '');
  if (/^00/.test(v)) v = `+${v.slice(2)}`;
  else if (/^0[1-9]\d{8}$/.test(v)) v = `+33${v.slice(1)}`;
  else if (/^[1-9]\d{7,14}$/.test(v)) v = `+${v}`;
  return /^\+[1-9]\d{7,14}$/.test(v) ? v : null;
}

export function normalizeEmail(input: string | null | undefined): string | null {
  const v = (input ?? '').trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? v : null;
}

/** Lien public d'une invitation (page `invite-landing`). */
export const INVITE_BASE_URL = process.env.EXPO_PUBLIC_INVITE_BASE_URL ?? 'https://izenride.app';
export const inviteUrl = (code: string) => `${INVITE_BASE_URL}/i/${code}`;
