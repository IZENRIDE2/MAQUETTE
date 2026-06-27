/**
 * Base44 — Composant Frontend : page/section "Designer IA"
 * --------------------------------------------------------
 * Reproduit le parcours du prototype, mais appelle les BACKEND FUNCTIONS
 * (les clés API restent côté serveur — jamais dans le navigateur).
 *
 * 🔧 ADAPTATION BASE44 — la SEULE chose à ajuster est `callFunction()` :
 *   Base44 expose vos backend functions. Selon la version, l'appel ressemble à :
 *     import { brief, render } from "@/api/functions";
 *     const data = await brief({ vehicle, history });
 *   Si vous avez ce SDK, remplacez `callFunction("brief", payload)` par `brief(payload)`.
 *   Sinon, gardez le fetch ci-dessous en mettant l'URL réelle de vos functions.
 */
import { useState, useRef } from "react";

const FUNCTIONS_BASE = "/api/functions"; // ← adapter à l'URL réelle des functions Base44

async function callFunction(name, payload) {
  const r = await fetch(`${FUNCTIONS_BASE}/${name}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok || data.error) throw new Error(data.error || `Erreur ${name} (${r.status})`);
  return data;
}

export default function DesignerIA() {
  const [vehicle, setVehicle] = useState({ type: "Moto", brand: "", model: "", year: "" });
  const [photo, setPhoto] = useState(null); // { dataUrl, base64, mime }
  const [history, setHistory] = useState([]);
  const [chat, setChat] = useState([
    { from: "bot", text: "Bonjour 👋 Je suis votre graphiste IzenCustom. Renseignez votre véhicule, puis décrivez votre projet de covering. Je vous proposerai plusieurs concepts !" },
  ]);
  const [input, setInput] = useState("");
  const [concepts, setConcepts] = useState([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();

  const vStr = () => `${vehicle.type} ${vehicle.brand} ${vehicle.model} ${vehicle.year}`.trim();

  function onPhoto(file) {
    const r = new FileReader();
    r.onload = () => setPhoto({ dataUrl: r.result, base64: r.result.split(",")[1], mime: file.type });
    r.readAsDataURL(file);
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setChat((c) => [...c, { from: "user", text }]);
    const newHistory = [...history, { role: "user", content: text }];
    setHistory(newHistory);
    setBusy(true);
    try {
      const res = await callFunction("brief", { vehicle: vStr(), history: newHistory });
      setHistory((h) => [...h, { role: "assistant", content: JSON.stringify(res) }]);
      setChat((c) => [...c, { from: "bot", text: res.reply }]);
      if (res.phase === "concepts" && res.concepts?.length) renderAll(res.concepts);
    } catch (e) {
      setChat((c) => [...c, { from: "bot", text: "⚠️ " + e.message }]);
    }
    setBusy(false);
  }

  function renderAll(list) {
    // Affiche d'abord les cartes (avec spinner), puis remplit les images au fur et à mesure.
    setConcepts(list.map((c) => ({ ...c, image: null, loading: true })));
    list.forEach((c, i) => {
      callFunction("render", {
        imageBase64: photo?.base64,
        mimeType: photo?.mime,
        renderPrompt: c.renderPrompt,
      })
        .then((out) => updateConcept(i, { image: `data:${out.mimeType};base64,${out.imageBase64}`, loading: false }))
        .catch((e) => updateConcept(i, { error: e.message, loading: false }));
    });
  }
  function updateConcept(i, patch) {
    setConcepts((cs) => cs.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* GAUCHE : véhicule + brief */}
      <div>
        <h2>Votre véhicule</h2>
        <select value={vehicle.type} onChange={(e) => setVehicle({ ...vehicle, type: e.target.value })}>
          {["Moto", "Voiture", "Quad", "Scooter", "Jet-ski", "Autre"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <input placeholder="Marque" value={vehicle.brand} onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })} />
        <input placeholder="Modèle" value={vehicle.model} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} />
        <input placeholder="Année" value={vehicle.year} onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })} />

        <div onClick={() => fileRef.current.click()} style={{ border: "1px dashed #888", padding: 16, cursor: "pointer", marginTop: 10 }}>
          {photo ? <img src={photo.dataUrl} alt="" style={{ maxWidth: "100%", maxHeight: 160 }} /> : "📷 Ajouter une photo du véhicule"}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && onPhoto(e.target.files[0])} />
        </div>

        <h2 style={{ marginTop: 20 }}>Votre projet</h2>
        <div style={{ height: 240, overflowY: "auto", border: "1px solid #333", padding: 8 }}>
          {chat.map((m, i) => (
            <p key={i} style={{ textAlign: m.from === "user" ? "right" : "left" }}><b>{m.from === "user" ? "Vous" : "Graphiste"} :</b> {m.text}</p>
          ))}
        </div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="ex. Style enduro noir mat et orange, numéro 46" />
        <button onClick={send} disabled={busy}>{busy ? "…" : "Envoyer au graphiste"}</button>
      </div>

      {/* DROITE : concepts */}
      <div>
        <h2>Les projets proposés</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {concepts.map((c) => (
            <div key={c.id} style={{ border: "1px solid #333", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ aspectRatio: "4/3", background: "#1d222c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {c.loading ? "⏳ Rendu…" : c.error ? `⚠️ ${c.error}` : <img src={c.image} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ padding: 10 }}>
                <h3>{c.title}</h3>
                <div style={{ display: "flex", gap: 4, margin: "4px 0" }}>
                  {(c.palette || []).map((p, i) => <span key={i} style={{ width: 20, height: 20, background: p, borderRadius: 4 }} />)}
                </div>
                <p style={{ fontSize: 12 }}>{c.description}</p>
                <button onClick={() => setInput(`J'aime "${c.title}", propose une variante`)}>Affiner</button>
                {/* TODO: brancher "Commander" sur votre configurateur / checkout Base44 */}
                <button onClick={() => alert("Brancher sur le configurateur / panier")}>Commander</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
