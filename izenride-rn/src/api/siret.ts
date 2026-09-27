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
