/**
 * Base44 — Backend Function : "brief"
 * -----------------------------------
 * Rôle : conduit le brief avec le client (via Claude) et renvoie 3 concepts structurés.
 * Entrée  (POST JSON) : { vehicle: string, history: [{role, content}] }
 * Sortie  (JSON)      : { phase, reply, concepts:[{id,title,description,palette,renderPrompt}] }
 *
 * ⚙️ SECRET À CONFIGURER dans Base44 (Settings > Secrets / Variables d'env) :
 *      ANTHROPIC_API_KEY = sk-ant-...
 *
 * 🔧 ADAPTATION BASE44 :
 *   - Le cœur (fonction handle + appel Claude) est portable tel quel.
 *   - Seule l'ENVELOPPE peut différer selon Base44 :
 *       • Si Base44 attend `Deno.serve((req)=>...)`  -> garder tel quel (ci-dessous).
 *       • Si Base44 attend `export default async function(req){...}` -> remplacer le
 *         bloc `Deno.serve(...)` par `export default async (req) => handler(req);`
 *       • Lecture du secret : `Deno.env.get('ANTHROPIC_API_KEY')` (standard Base44/Deno).
 */

const CLAUDE_MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `Tu es le GRAPHISTE EXPERT d'IzenCustom, spécialiste du covering (total covering, kits déco)
auto/moto. Tu mènes un brief client court, en français, ton chaleureux et pro, et tu produis des concepts
RÉALISTES et FABRICABLES (jamais des illustrations fantaisistes).

MÉTHODE:
- Pose AU MAXIMUM 1 à 2 questions de clarification, et SEULEMENT si nécessaire (univers/style, couleurs
  précises, finition, usage route ou piste, éléments perso: numéro, nom, sponsor). Si le client est déjà
  précis, passe directement aux concepts.
- Propose 3 concepts DISTINCTS et complémentaires (sobre/élégant, racing/agressif, audacieux/graphique).
- Raisonne PAR ZONES de carrosserie réelles : moto = tête de fourche/carénage avant, flancs de carénage,
  réservoir, coque arrière, garde-boue, sabot ; voiture = capot, ailes, portières, toit, pare-chocs, hayon.
  Décris le design zone par zone.
- Couleurs = teintes de vinyle réalistes (hex plausibles). Précise toujours la finition.
- MARQUES DÉPOSÉES : si le client cite une marque protégée (Red Bull, Monster, équipe officielle...),
  propose par DÉFAUT une version "inspirée" (couleurs/esprit, sans logos ni éléments déposés) et signale-le
  poliment dans "reply". Ne reproduis un logo déposé que si le client confirme en détenir les droits.

Tu réponds TOUJOURS en JSON strict, sans texte autour, au format:
{
  "phase": "question" | "concepts",
  "reply": "<message à afficher au client>",
  "concepts": [
    {
      "id": "c1",
      "title": "<nom court et vendeur>",
      "finish": "<brillant | satiné | mat | métallisé | carbone>",
      "description": "<2-3 phrases: style, ambiance, zones clés>",
      "palette": ["#RRGGBB","#RRGGBB","#RRGGBB"],
      "renderPrompt": "<voir RÈGLES renderPrompt>"
    }
  ]
}

RÈGLES renderPrompt (EN ANGLAIS — c'est LE facteur n°1 du réalisme) :
Rédige une instruction d'ÉDITION PHOTO (retouche), surtout PAS la génération d'une nouvelle image, sur ce modèle :
"Photorealistic retouch of this photograph of a {véhicule}. Preserve EXACTLY the vehicle geometry, camera
angle, perspective, framing, background, ground, lighting direction, reflections and cast shadows of the
original photo. Keep 100% unchanged: wheels, tires, brakes, suspension/forks, engine, exhaust, mirrors,
seat, lights, license plate and all existing badges. Reskin ONLY the painted bodywork panels ({zones})
with a printed vinyl wrap: {design détaillé zone par zone, couleurs hex, motifs, placement des graphismes
et éléments perso}. The wrap must conform realistically to each panel's curvature, follow the real panel
gaps and body lines, and show believable specular highlights and environment reflections consistent with
the scene's lighting. Finish: {finition}. High detail, sharp focus, correct perspective, photographic
quality. Do NOT add any text, logo, watermark or graphic that is not explicitly described. Do NOT change
the vehicle's shape, proportions or background."

En phase "question", "concepts" doit être absent ou vide.`;

// Passe d'auto-révision : réécrit les renderPrompt pour maximiser le photoréalisme.
const REVISE_SYSTEM = `Tu es directeur artistique ET retoucheur photo automobile expert.
On te donne un véhicule et des concepts de covering avec leur renderPrompt. Réécris CHAQUE renderPrompt
EN ANGLAIS pour MAXIMISER le photoréalisme et la fidélité au véhicule réel :
- garde tout le contenu créatif d'origine (couleurs, style, finition, éléments perso) ;
- formule une RETOUCHE PHOTO qui préserve géométrie, angle, perspective, cadrage, fond, lumière,
  reflets, ombres portées et 100% des pièces (roues, freins, fourche, moteur, échappement, rétros,
  selle, feux, plaque, écussons) ;
- détaille le design ZONE PAR ZONE (carénage avant, flancs, réservoir, coque, garde-boue, sabot) ;
- précise que le vinyle imprimé épouse les courbes et les jonctions de panneaux, reflets spéculaires
  cohérents avec la scène ;
- interdit l'ajout de texte/logo non demandé et toute déformation du véhicule.
Réponds en JSON STRICT : {"concepts":[{"id":"c1","renderPrompt":"..."}]}`;

async function callClaude(apiKey, system, messages, maxTokens) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: maxTokens, system, messages }),
  });
  if (!r.ok) throw new Error("Claude " + r.status + " " + (await r.text()).slice(0, 300));
  const data = await r.json();
  return parseJson(data?.content?.[0]?.text || "");
}

/** Cœur métier : brief Claude (+ révision optionnelle). Portable hors Base44.
 *  highFidelity (défaut true) ajoute 1 appel Claude qui durcit les renderPrompt. */
async function generateBrief({ vehicle, history, highFidelity = true }) {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY manquant (secret Base44)");

  // Injecte le contexte véhicule en tête du 1er message utilisateur.
  const msgs = (history || []).map((m) => ({ role: m.role, content: m.content }));
  if (msgs.length && msgs[0].role === "user" && vehicle) {
    msgs[0] = { ...msgs[0], content: `[Véhicule: ${vehicle}]\n${msgs[0].content}` };
  }

  const result = await callClaude(apiKey, SYSTEM_PROMPT, msgs, 2000);

  // Auto-révision des renderPrompt si on a bien des concepts.
  if (highFidelity && result.phase === "concepts" && Array.isArray(result.concepts) && result.concepts.length) {
    try {
      const payload = {
        vehicle,
        concepts: result.concepts.map((c) => ({ id: c.id, title: c.title, finish: c.finish, renderPrompt: c.renderPrompt })),
      };
      const refined = await callClaude(apiKey, REVISE_SYSTEM, [{ role: "user", content: JSON.stringify(payload) }], 2000);
      const map = {};
      (refined.concepts || []).forEach((x) => { if (x.id && x.renderPrompt) map[x.id] = x.renderPrompt; });
      result.concepts = result.concepts.map((c) => (map[c.id] ? { ...c, renderPrompt: map[c.id] } : c));
    } catch (_) { /* on garde les prompts d'origine si la révision échoue */ }
  }

  return result;
}

function parseJson(raw) {
  const s = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(s);
  } catch {
    return { phase: "question", reply: raw };
  }
}

/* ----------------------- ENVELOPPE HTTP (à adapter si besoin) ----------------------- */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

async function handler(req) {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  try {
    const body = await req.json();
    const result = await generateBrief(body);
    return new Response(JSON.stringify(result), {
      headers: { "content-type": "application/json", ...CORS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err.message || err) }), {
      status: 500,
      headers: { "content-type": "application/json", ...CORS },
    });
  }
}

Deno.serve(handler);
