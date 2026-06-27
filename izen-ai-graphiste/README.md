# IzenCustom — Agent IA Graphiste (prototype)

Prototype d'un **agent IA qui fait le travail d'un graphiste** pour le covering et les kits déco
par modèle de véhicule. Le client renseigne son véhicule, décrit son projet, et reçoit **plusieurs
concepts** visualisés sur la photo de sa machine.

## 🚀 Lancer le prototype

Double-cliquez sur **`izen-graphiste.html`** (s'ouvre dans votre navigateur). Aucune installation.

- **Mode démo (par défaut)** : tout fonctionne sans clé API. Le brief et les rendus sont simulés
  (le rendu compose votre photo + la palette pour illustrer la présentation « plusieurs projets »).
- **Mode réel** : ouvrez **⚙️ Configuration**, collez vos clés, cliquez *Enregistrer*.

### Parcours client (3 étapes)
1. **Véhicule** : type / marque / modèle / année + photo (la photo sert au rendu réaliste).
2. **Brief** : le client écrit son idée ; l'agent (Claude) pose 1-2 questions puis propose.
3. **Concepts** : 3 directions visualisées sur la photo. Boutons *Affiner* / *Commander*.

## 🔑 Les deux IA

| Rôle | Modèle | Ce qu'il fait |
|---|---|---|
| Le « cerveau » (brief) | **Claude** (`claude-sonnet-4-6`) | Dialogue, comprend le besoin, produit 3 concepts structurés (titre, palette, prompt de rendu) |
| La « main » (visuel) | **Gemini image** (`gemini-2.5-flash-image`, alias *Nano Banana*) | Prend la **photo** + le prompt et **repeint la carrosserie** en gardant la forme/angle réels |

> Claude ne génère pas d'images : il pilote et structure. Le rendu vient du modèle image.

### Obtenir les clés
- **Claude** : https://console.anthropic.com → API Keys (`sk-ant-...`)
- **Gemini** : https://aistudio.google.com/apikey (`AIza...`)

## ⚠️ Sécurité — important

Dans ce prototype, les clés sont dans le **navigateur** et les appels partent du navigateur :
c'est acceptable pour un test local sur votre machine, **jamais en production** (la clé serait volée).
En production, les appels doivent passer par un **backend** (voir Base44 ci-dessous).

## 🔗 Portage dans Base44 (votre site)

Base44 fournit des **backend functions** + des intégrations IA. L'architecture cible :

```
[ Frontend Base44 ]  -- véhicule + photo + message -->  [ Backend function ]
   (page "Designer IA")                                       |
                                                              |-- Claude (brief -> concepts JSON)
                                                              |-- Gemini image (photo + prompt -> rendu)
                                                       <-- concepts + images --
```

Étapes :
1. **Page / composant** : reprendre l'UI de `izen-graphiste.html` (sélecteur véhicule, upload photo, chat, grille de concepts).
2. **Backend function `brief`** : appelle Claude avec le `SYSTEM_PROMPT` (voir le `<script>` du HTML) et renvoie le JSON `{phase, reply, concepts}`. La clé Anthropic reste en variable d'environnement Base44.
3. **Backend function `render`** : reçoit la photo (base64) + `renderPrompt`, appelle Gemini image, renvoie l'image. Clé Gemini en variable d'env.
   - Alternative : l'intégration **GenerateImage** native de Base44 (text-to-image uniquement, pas d'édition sur photo) — moins adaptée au rendu « sur photo », à réserver aux concepts d'inspiration.
4. **Entités Base44** : stocker `Project` (véhicule, brief, concepts, image retenue) pour relier au panier / configurateur existant.
5. **Bouton *Commander*** : branche le concept choisi sur votre flux `/configurator` / `/checkout`.

Le `SYSTEM_PROMPT` et la logique d'appel (Anthropic Messages API, Gemini `generateContent`) sont
directement réutilisables : il suffit de déplacer `callClaude()` et `callGemini()` du navigateur vers
les backend functions.

## 💸 Ordre de grandeur des coûts (mode réel)

Par génération complète d'un client (1 brief Claude + 3 rendus image) : quelques centimes à ~0,10-0,20 €
selon les modèles. À cadrer précisément selon volumes — utile de plafonner le nombre de régénérations
gratuites par client.

## 🎯 Obtenir un rendu RÉALISTE (important)

Le réalisme tient à 3 choses :
1. **La photo d'entrée** : profil (ou 3/4) du véhicule, **fond neutre**, bonne lumière, véhicule net et
   bien cadré. Une mauvaise photo = un mauvais rendu, quel que soit le modèle.
2. **Le brief de l'agent** : le `SYSTEM_PROMPT` impose désormais un raisonnement **zone par zone**
   (carénage, réservoir, coque…), une **retouche photo** (pas une image inventée) et une matière
   **vinyle** (conforme aux courbes, reflets, jonctions de panneaux) avec finition explicite.
3. **Le garde-fou serveur** (`render.js`) : réinjecte les contraintes de préservation
   (géométrie, fond, lumière, pièces mécaniques) à chaque rendu.

## 🛠️ Personnalisation rapide
- **Concepts démo** : fonction `mockBrief()` dans le HTML.
- **Comportement de l'agent** : constante `SYSTEM_PROMPT`.
- **Style visuel** : bloc `:root` (CSS) en haut du fichier.
