// Edge Function `siret-check` — vérifie un SIRET au registre des entreprises
// via l'API Pappers (https://www.pappers.fr/api). La clé reste côté serveur.
//
// Deux usages :
//   - Depuis l'app (jeton de l'utilisateur) : POST { siret, refresh? }.
//     Réservé aux fondateurs de groupes pro et aux modérateurs
//     (`can_lookup_siret`), plafonné à 20 consultations par heure. Le
//     résultat est mis en cache 7 jours (1 jour pour « introuvable ») ;
//     `refresh` force une nouvelle consultation (modérateurs).
//   - Revérification mensuelle des badges (pg_cron) : en-tête
//     `x-cron-secret: <SIRET_CRON_SECRET>`, POST { mode: "recheck", limit? }.
//
// Réponse (toujours 200 hors authentification) :
//   { result: { status: 'active' | 'closed' | 'not_found', ... } }
//   { error: 'invalid_siret' | 'rate_limited' | 'registry_unavailable' }
//
// Secrets : PAPPERS_API_KEY, SIRET_CRON_SECRET (+ SUPABASE_* fournis).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type Registry = {
  siret: string;
  status: 'active' | 'closed' | 'not_found';
  siren: string | null;
  legal_name: string | null;
  trade_name: string | null;
  legal_form: string | null;
  naf_label: string | null;
  address: string | null;
  created_on: string | null;
  closed_on: string | null;
  checked_at: string;
};
type Row = Record<string, any>;

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const admin = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const PAPPERS_API_KEY = Deno.env.get('PAPPERS_API_KEY');
const CRON_SECRET = Deno.env.get('SIRET_CRON_SECRET');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

/** Même contrôle que `is_valid_siret` (SQL) et src/api/siret.ts. */
function isValidSiret(s: string): boolean {
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

class Unavailable extends Error {}

/** Interroge Pappers et traduit la fiche en résultat IzenRide. */
async function queryPappers(siret: string): Promise<Registry> {
  if (!PAPPERS_API_KEY) throw new Unavailable('PAPPERS_API_KEY manquante');
  const checked_at = new Date().toISOString();
  let res: Response;
  try {
    res = await fetch(`https://api.pappers.fr/v2/entreprise?siret=${siret}`, {
      headers: { 'api-key': PAPPERS_API_KEY, Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    throw new Unavailable(String(e));
  }
  if (res.status === 404) {
    return { siret, status: 'not_found', siren: null, legal_name: null, trade_name: null, legal_form: null, naf_label: null, address: null, created_on: null, closed_on: null, checked_at };
  }
  // 401 (clé), 402/429 (crédits épuisés, quota), 5xx : on ne conclut rien.
  if (!res.ok) throw new Unavailable(`Pappers ${res.status}`);
  const e: Row = await res.json();

  // L'établissement demandé : fiche dédiée, siège ou liste des établissements.
  const etab: Row | undefined = [e.etablissement, e.siege, ...(Array.isArray(e.etablissements) ? e.etablissements : [])].find(
    (x: Row | undefined) => x?.siret === siret,
  );
  const closed = etab ? !!etab.etablissement_cesse || !!e.entreprise_cessee : !!e.entreprise_cessee;
  const address = etab ? [etab.adresse_ligne_1, [etab.code_postal, etab.ville].filter(Boolean).join(' ')].filter(Boolean).join(', ') : null;
  return {
    siret,
    status: closed ? 'closed' : 'active',
    siren: e.siren ?? siret.slice(0, 9),
    legal_name: e.nom_entreprise ?? e.denomination ?? null,
    trade_name: etab?.enseigne ?? etab?.nom_commercial ?? e.nom_commercial ?? null,
    legal_form: e.forme_juridique ?? null,
    naf_label: e.libelle_code_naf ?? null,
    address: address || null,
    created_on: e.date_creation ?? null,
    closed_on: closed ? etab?.date_cessation ?? etab?.date_de_cessation ?? e.date_cessation ?? null : null,
    checked_at,
  };
}

async function lookup(siret: string): Promise<Registry> {
  const r = await queryPappers(siret);
  const { error } = await admin.from('siret_checks').upsert(r);
  if (error) console.error('siret_checks', error.message);
  return r;
}

async function recheck(limit: number) {
  const { data, error } = await admin.rpc('sirets_to_recheck', { p_limit: limit });
  if (error) return json({ error: error.message }, 500);
  const done: Record<string, string> = {};
  for (const { siret } of (data ?? []) as { siret: string }[]) {
    try {
      done[siret] = (await lookup(siret)).status;
    } catch (e) {
      // Registre indisponible : on s'arrête, le prochain passage reprendra.
      console.error('recheck', siret, String(e));
      break;
    }
  }
  return json({ checked: done });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  const body: Row = await req.json().catch(() => ({}));

  // Revérification planifiée.
  if (body.mode === 'recheck') {
    if (!CRON_SECRET || req.headers.get('x-cron-secret') !== CRON_SECRET) return json({ error: 'forbidden' }, 403);
    return recheck(Math.min(Number(body.limit) || 50, 500));
  }

  // Consultation depuis l'app, au nom de l'utilisateur.
  const authorization = req.headers.get('Authorization') ?? '';
  const asUser = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } });
  const { data: auth } = await asUser.auth.getUser(authorization.replace(/^Bearer\s+/i, ''));
  if (!auth?.user) return json({ error: 'not_authenticated' }, 401);
  const { data: allowed } = await asUser.rpc('can_lookup_siret');
  if (!allowed) return json({ error: 'forbidden' }, 403);

  const siret = String(body.siret ?? '').replace(/\s/g, '');
  if (!isValidSiret(siret)) return json({ error: 'invalid_siret' });

  // Cache : 7 jours, 1 jour pour « introuvable » (immatriculation récente).
  const { data: cached } = await admin.from('siret_checks').select('*').eq('siret', siret).maybeSingle();
  const { data: moderator } = body.refresh ? await asUser.rpc('is_app_moderator') : { data: false };
  if (cached && !moderator) {
    const maxAge = (cached.status === 'not_found' ? 1 : 7) * 864e5;
    if (Date.now() - Date.parse(cached.checked_at) < maxAge) return json({ result: cached });
  }

  const { data: underQuota } = await admin.rpc('note_siret_lookup', { p_user: auth.user.id, p_siret: siret });
  if (underQuota === false) return json({ error: 'rate_limited' });

  try {
    return json({ result: await lookup(siret) });
  } catch (e) {
    console.error('pappers', String(e));
    // Registre muet : l'ancien résultat vaut mieux que rien.
    return json(cached ? { result: cached, stale: true } : { error: 'registry_unavailable' });
  }
});
