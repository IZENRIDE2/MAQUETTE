// Edge Function `invite-landing` — page du lien d'invitation personnel.
//
// URL publique : https://izenride.app/i/<CODE> (réécrite vers
// /functions/v1/invite-landing?code=<CODE>). La page :
//   1. tente d'ouvrir l'app (izenride://i/<CODE>) ;
//   2. sinon propose l'App Store / le Play Store ;
//   3. affiche le code, à saisir à l'inscription si le lien s'est perdu en
//      route (le champ « Code d'invitation » est aussi pré-rempli quand l'app
//      est ouverte depuis le lien).
// Variables : APP_STORE_URL, PLAY_STORE_URL, PROFILES_TABLE.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const PROFILES_TABLE = Deno.env.get('PROFILES_TABLE') ?? 'profiles';
const APP_STORE = Deno.env.get('APP_STORE_URL') ?? 'https://apps.apple.com/';
const PLAY_STORE = Deno.env.get('PLAY_STORE_URL') ?? 'https://play.google.com/store';

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function inviterName(code: string): Promise<string | null> {
  const { data: invite } = await supabase
    .from('friend_invites')
    .select('inviter_id')
    .eq('code', code)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  if (!invite) return null;
  const { data: p } = await supabase.from(PROFILES_TABLE).select('*').eq('id', invite.inviter_id).maybeSingle();
  return (p?.display_name ?? p?.username ?? p?.first_name ?? p?.name ?? 'Un rider') as string;
}

// Charte IZEN RIDE : fond #08090E, surfaces #10121A, bordures #1A1E28, bleu #4A9CE8.
function page(code: string, name: string | null): string {
  const title = name ? `${escape(name)} t’invite sur IzenRide` : 'Rejoins IzenRide';
  const deepLink = `izenride://i/${code}`;
  return `<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta property="og:title" content="${title}"><meta property="og:description" content="La communauté des motards et motardes.">
<style>
  :root { color-scheme: dark; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
         background:#08090E; color:#fff; font-family: Inter, system-ui, -apple-system, sans-serif; }
  .card { width:min(92vw,380px); background:#10121A; border:1px solid #1A1E28; border-radius:24px; padding:28px; text-align:center; }
  h1 { font-size:22px; margin:6px 0 8px; }
  p { color:#a8b0c0; font-size:14px; line-height:1.5; margin:0 0 20px; }
  .code { font: 700 26px/1 ui-monospace, 'JetBrains Mono', monospace; letter-spacing:4px; padding:14px; border-radius:14px;
          border:1px dashed #4A9CE8; color:#4A9CE8; margin:0 0 20px; user-select:all; }
  a.btn { display:block; padding:15px; border-radius:16px; text-decoration:none; font-weight:700; margin-top:10px; }
  .primary { background:#4A9CE8; color:#fff; }
  .ghost { border:1px solid #1A1E28; color:#fff; }
  small { display:block; color:#5e6478; margin-top:16px; font-size:12px; }
</style></head>
<body><main class="card">
  <div style="font-size:12px;letter-spacing:2px;color:#5DCAA5;font-weight:700">IZEN RIDE</div>
  <h1>${title}</h1>
  <p>${name ? 'Rejoins ta bande sur l’app : sorties, groupes et suivi live.' : 'Cette invitation a expiré ou a déjà été utilisée. Tu peux quand même rejoindre IzenRide.'}</p>
  ${name ? `<div class="code" aria-label="Code d’invitation">${code}</div>` : ''}
  <a class="btn primary" href="${deepLink}">Ouvrir IzenRide</a>
  <a class="btn ghost" href="${APP_STORE}">Télécharger sur l’App Store</a>
  <a class="btn ghost" href="${PLAY_STORE}">Télécharger sur Google Play</a>
  ${name ? '<small>Pas d’ouverture automatique ? Installe l’app puis saisis ce code à l’inscription.</small>' : ''}
</main>
${name ? `<script>setTimeout(function(){ location.href = ${JSON.stringify(deepLink)}; }, 400);</script>` : ''}
</body></html>`;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const raw = url.searchParams.get('code') ?? url.pathname.split('/').pop() ?? '';
  const code = raw.toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g, '').slice(0, 8);
  const name = code.length === 8 ? await inviterName(code) : null;
  return new Response(page(code, name), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
});
