# Intégration dans Base44 — guide pas à pas

Objectif : faire tourner l'agent IA graphiste **dans votre app izencustom.fr (Base44)**, avec les
clés API protégées côté serveur.

## Fichiers de ce dossier
| Fichier | Où il va dans Base44 |
|---|---|
| `brief.js` | Backend function `brief` (dialogue Claude → concepts) |
| `render.js` | Backend function `render` (Gemini image → rendu sur photo) |
| `DesignerIA.jsx` | Composant/page frontend "Designer IA" |

## Étape 1 — Configurer les secrets
Dans Base44 : **Settings → Secrets / Variables d'environnement**, ajouter :
- `ANTHROPIC_API_KEY` = `sk-ant-...`  (console.anthropic.com)
- `GEMINI_API_KEY` = `AIza...`  (aistudio.google.com/apikey)

## Étape 2 — Créer les backend functions
1. Dans Base44 : **Backend → Functions → New function**, nommer **`brief`**, coller le contenu de `brief.js`.
2. Idem pour **`render`** avec `render.js`.
3. Vérifier l'enveloppe : si Base44 n'utilise pas `Deno.serve(handler)`, remplacer ce bloc par la
   forme attendue (commentaire en tête de chaque fichier). Le reste est portable tel quel.

## Étape 3 — Brancher le frontend
1. Créer une page **`DesignerIA`** (ou un composant), coller `DesignerIA.jsx`.
2. Ajuster **uniquement** la fonction `callFunction()` :
   - Si Base44 fournit un SDK (`import { brief, render } from "@/api/functions"`),
     remplacer `callFunction("brief", payload)` par `brief(payload)` et `callFunction("render", payload)` par `render(payload)`.
   - Sinon, mettre dans `FUNCTIONS_BASE` l'URL réelle de vos functions.
3. Reprendre le style/CSS depuis le prototype `izen-graphiste.html` si vous voulez le même rendu visuel.

## Étape 4 — Relier à la commande
- Créer une entité **`Project`** (champs : véhicule, brief, concept retenu, image).
- Le bouton **Commander** : sauver le `Project` puis rediriger vers votre `/configurator` ou `/checkout`.

## Étape 5 — Tester puis durcir
- Tester avec une vraie photo de moto + un brief.
- Garde-fous recommandés avant mise en prod :
  - **Limiter** le nombre de régénérations gratuites par session/client (coût image).
  - **Valider** la taille/format de la photo uploadée (compresser si > ~2-3 Mo).
  - **Filtrer** les briefs hors-sujet (le SYSTEM_PROMPT cadre déjà, mais surveiller).
  - **Watermark** discret sur les aperçus tant que la commande n'est pas validée.

## Flux complet
```
DesignerIA.jsx  --POST /functions/brief-->  brief.js  --> Claude --> { concepts }
                --POST /functions/render--> render.js --> Gemini (photo+prompt) --> image
   stocke Project -> bouton Commander -> configurator / checkout existant
```

## Coûts (ordre de grandeur)
Par client (1 brief + 3 rendus) : ~quelques centimes à ~0,10–0,20 €. À surveiller via les garde-fous
de l'étape 5. Mettre en place un suivi du nombre de générations par jour.
