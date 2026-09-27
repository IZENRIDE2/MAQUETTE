/** Contrôle du SIRET identique à `is_valid_siret` (SQL) : clé de Luhn, cas La Poste. */
export function isValidSiret(input: string): boolean {
  const s = input.replace(/\s/g, '');
  if (!/^\d{14}$/.test(s)) return false;
  let luhn = 0;
  let total = 0;
  for (let i = 1; i <= 14; i++) {
    let d = Number(s[14 - i]);
    total += d;
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    luhn += d;
  }
  return luhn % 10 === 0 || (s.startsWith('356000000') && total % 5 === 0);
}

/** « 732 829 320 00074 » */
export const formatSiret = (s: string) => s.replace(/\s/g, '').replace(/^(\d{3})(\d{3})(\d{3})(\d{5})$/, '$1 $2 $3 $4');

const LEGAL_FORMS = /\b(sas|sasu|sarl|eurl|sa|sci|snc|ei|eirl|ste|societe|association|asso)\b/g;
const simplify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(LEGAL_FORMS, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * La raison sociale saisie correspond-elle au registre (dénomination ou
 * enseigne) ? Sans accents, casse ni forme juridique ; l'un contient l'autre.
 */
export function nameMatchesRegistry(entered: string, registry: { legalName: string | null; tradeName: string | null }): boolean {
  const a = simplify(entered);
  if (!a) return false;
  return [registry.legalName, registry.tradeName].some((n) => {
    const b = n ? simplify(n) : '';
    return !!b && (a.includes(b) || b.includes(a));
  });
}
