/**
 * Base44 — Backend Function : "render"
 * ------------------------------------
 * Rôle : applique un concept de covering sur la PHOTO du véhicule (Gemini image / Nano Banana).
 * Entrée (POST JSON) : { imageBase64: string, mimeType: string, renderPrompt: string }
 * Sortie (JSON)      : { imageBase64: string, mimeType: string }   // l'image générée
 *
 * ⚙️ SECRET À CONFIGURER dans Base44 :
 *      GEMINI_API_KEY = AIza...   (https://aistudio.google.com/apikey)
 *
 * 🔧 ADAPTATION BASE44 : voir notes identiques dans brief.js (enveloppe Deno.serve).
 *
 * Alternative native : Base44 fournit une intégration GenerateImage, mais elle fait du
 * text-to-image (pas d'édition SUR la photo). Pour le rendu réaliste sur le modèle réel,
 * cette function dédiée à Gemini image est la bonne approche.
 */

const GEMINI_MODEL = "gemini-2.5-flash-image"; // "Nano Banana"

/** Cœur métier : édite la photo selon renderPrompt. Portable hors Base44. */
async function renderConcept({ imageBase64, mimeType, renderPrompt }) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY manquant (secret Base44)");
  if (!imageBase64) throw new Error("Photo (imageBase64) requise pour le rendu sur photo");

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=` +
    encodeURIComponent(apiKey);

  // Renfort de prompt côté serveur : garantit le RÉALISME et la préservation de la photo
  // même si le renderPrompt généré est imparfait.
  const guard =
    "Photorealistic retouch of this photograph of a vehicle. This is a PHOTO EDIT, not a new image. " +
    "Preserve EXACTLY the vehicle geometry, camera angle, perspective, framing, background, ground, " +
    "lighting direction, reflections and cast shadows of the original photo. Keep 100% unchanged: wheels, " +
    "tires, brakes, suspension, engine, exhaust, mirrors, seat, lights, license plate and existing badges. " +
    "Reskin ONLY the painted bodywork panels with a printed vinyl wrap that conforms to each panel's " +
    "curvature, follows the real panel gaps and shows realistic highlights and reflections. Maintain the " +
    "original image resolution and framing. Do NOT add any text, logo or watermark that is not described, " +
    "and do NOT alter the vehicle shape or background. Design to apply: ";

  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { inlineData: { mimeType: mimeType || "image/jpeg", data: imageBase64 } },
            { text: guard + (renderPrompt || "") + " High detail, sharp focus, photographic quality." },
          ],
        },
      ],
    }),
  });

  if (!r.ok) throw new Error("Gemini " + r.status + " " + (await r.text()).slice(0, 300));
  const data = await r.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const part = parts.find((p) => p.inlineData || p.inline_data);
  const inline = part?.inlineData || part?.inline_data;
  if (!inline?.data) throw new Error("Aucune image renvoyée par Gemini");

  return { imageBase64: inline.data, mimeType: inline.mimeType || inline.mime_type || "image/png" };
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
    const result = await renderConcept(body);
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
