> # 🔴 ARRÊT — LIRE AVANT DE TOUCHER UN FICHIER
>
> **La source unique du site est `GIT SITE/izenride-vr/`.** Décision Florian,
> 2026-08-06.
>
> Tout ce qui se trouve **à la racine de ce dépôt** — `index.html`, `css/`,
> `js/`, `screens/`, `mentions-legales/`, `politique-de-confidentialite/`,
> `conditions-generales-*/` — est une **version morte**. Elle ne sera pas
> publiée.
>
> Le 2026-08-06, une après-midi entière de corrections (rapatriement des
> polices, alignement des prix, suppression de 18 affirmations fausses) a été
> passée sur cette version racine avant qu'on s'aperçoive qu'une version plus
> aboutie existait dans `GIT SITE/izenride-vr/`. Ne pas refaire l'erreur :
> **ouvrir `GIT SITE/izenride-vr/index.html`, pas celui d'à côté.**
>
> Le dossier `C:\Izen-ride\site-a-publier\` est une **sortie jetable** —
> régénérée, jamais éditée à la main. Ce qui y est aujourd'hui vient de la
> version morte et a été téléversé sur OVH par erreur : à réécraser avant que
> le domaine ne pointe dessus.
>
> État des lieux et liste des corrections en cours :
> `GIT SITE/izenride-vr/docs/mise-en-correlation-site-app.md`

# IZEN RIDE — Site vitrine immersif « Inside the phone » (version racine — ARCHIVÉE)

Site one-page ultra haut de gamme de l'application **IZEN RIDE**, la communauté des motards et motardes.
Concept : le visiteur ne regarde pas l'app — **il est propulsé à l'intérieur du téléphone**. Le scroll est le moteur de l'expérience.

---

## 🚀 Lancer le site

Aucun build n'est nécessaire : HTML / CSS / JS natifs.

```bash
# Option 1 — serveur statique Node
npx serve .

# Option 2 — Python
python -m http.server 8080

# Option 3 — Windows sans Node ni Python (serveur inclus dans le projet)
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Puis ouvrir `http://localhost:8080` (ou l'URL affichée).

> Ouvrir `index.html` en double-clic fonctionne aussi dans la plupart des navigateurs,
> mais un serveur local est recommandé (chargement des iframes + fontes plus fiable).

**Dépendances (CDN, aucune installation)** : GSAP 3 + ScrollTrigger (animations scroll-driven) et Lenis (inertie de scroll). Si le CDN est indisponible ou si l'utilisateur a activé `prefers-reduced-motion`, le site bascule automatiquement en **version statique élégante** — tout le contenu reste lisible.

---

## 📂 Structure

```
.
├── index.html          ← page unique (ancres de navigation)
├── assets/logo.png     ← logo officiel (lockup badge + wordmark, fond transparent)
├── assets/badge.png    ← badge rond seul (favicon, section finale)
├── tools/extract-logo.ps1 ← script d'extraction depuis le PNG source (relancer si logo plus HD)
├── css/styles.css      ← charte IZEN RIDE + composant téléphone + responsive
├── js/main.js          ← propulsion, dézoom, parallaxe, compteurs, curseur, magnetic buttons
├── screens/            ← écrans de l'app (390 × 844), intégrés en iframe dans les mockups
└── README.md
```

---

## 📱 Où insérer les écrans réels de l'app

Les écrans actuels de `screens/` sont des **recréations haute-fidélité conformes à la charte**, prêtes à être remplacées par les écrans réels de l'application. Il suffit de **remplacer chaque fichier par le vôtre, à nom identique** (format 390 × 844 px) — aucune autre modification n'est requise.

| Section du site            | Fichier à remplacer        | Écran attendu                          |
|----------------------------|----------------------------|----------------------------------------|
| 1. Hero (téléphone 3D)     | `screens/splash.html`      | Splash screen — compteur 0 → 100       |
| 3. Rencontre & matching    | `screens/match.html`       | Écran de match                         |
| 3. Rencontre & matching    | `screens/chat.html`        | Conversation messagerie temps réel     |
| 4. Carte & croisements     | `screens/map.html`         | Carte principale                       |
| 4. Carte & croisements     | `screens/navigation.html`  | Navigation GPS                         |
| 5. Événements & rides      | `screens/events.html`      | Liste des événements                   |
| 5. Événements & rides      | `screens/event-live.html`  | Détail / suivi live                    |
| 6. Sécurité                | `screens/safety.html`      | Safety Zone 2 km                       |
| 6. Sécurité                | `screens/position.html`    | Partage de position                    |
| 7. Marketplace             | `screens/marketplace.html` | Liste des annonces                     |
| 7. Marketplace             | `screens/product.html`     | Fiche produit                          |
| 8. Premium                 | `screens/premium.html`     | Écran d'abonnement Premium             |
| 9. Dézoom / CTA final      | `screens/map.html`         | (réutilise la carte)                   |

Les iframes sont **lazy-loadées** (sauf le splash du hero) et mises à l'échelle automatiquement (`--s = largeur / 390`), quel que soit la taille du mockup.

---

## 🎬 L'expérience (base technique : mysticsaba.com)

0. **Intro d'ouverture (1× par session)** — au tout premier chargement de la session, un écran de démarrage couvre la page : jauge circulaire qui compte **0 → 100 km/h** (écho du splash de l'app) sous le logo, puis le rideau se lève sur le hero. Mémorisée via `sessionStorage` (clé `izen-intro`) : elle ne rejoue pas aux navigations suivantes de la même session, mais revient à la prochaine. Un script inline dans le `<head>` décide avant le 1er paint (aucun flash), verrouille le scroll pendant l'intro, et la saute si `prefers-reduced-motion` est actif. Fallback sans GSAP en `requestAnimationFrame`.
1. **Hero** — canvas 2D génératif « route de nuit » (bandes d'asphalte convergeant vers le point de fuite, bokeh de phares, parallaxe souris), typographie massive Clash Display éclatée caractère par caractère (`data-split="chars"`), kicker mono avec pastille de statut.
2. **Marquee** — bandeau défilant infini avec les chiffres clés.
3. **Feature rows** — sections numérotées `01 / L'APP` : 5 rangées éditoriales (① → ⑤) avec accent de couleur par feature, écran réel de l'app en mockup, effet scanline, tags mono.
4. **Premium** — stage avec wordmark dégradé violet→bleu éclaté au scroll + onde canvas.
5. **Tech / En route / À propos / Contact** — grille avec VU-mètres animés, étapes numérotées, typo de clôture « PRÊT À CROISER LA ROUTE ? ».
6. **Dock « Ride Live »** — widget flottant : compteur de riders en ligne (canvas + ticker), derniers croisements, countdown vers le prochain night ride.

**i18n FR/EN** intégrée (`data-i18n` + dictionnaire JS, persistée en localStorage). Grain de film, curseur custom, boutons magnétiques, reveals GSAP/ScrollTrigger. Typographies : Clash Display + Satoshi (Fontshare) et JetBrains Mono (Google Fonts).

---

## 🎨 Charte (non négociable)

| Usage                  | Couleur   |
|------------------------|-----------|
| Fond principal         | `#08090E` |
| Surfaces / cartes      | `#10121A` |
| Bordures               | `#1A1E28` |
| Accent bleu primaire   | `#4A9CE8` |
| Accent vert « ZEN »    | `#5DCAA5` |
| Accent ambre           | `#FAC775` |
| Rouge (sécurité only)  | `#E24B4A` |
| Violet (premium)       | `#7F77DD` |

Typo : Inter (Google Fonts) avec fallback SF Pro / système. Jamais de fond clair.

---

## ✅ Performance, SEO, accessibilité

- Animations **GPU-only** (transform / opacity), scroll-driven via ScrollTrigger `scrub`.
- Iframes lazy-loadées, fontes en `display=swap`, aucun framework.
- Balises sémantiques, meta OG/Twitter, JSON-LD `MobileApplication`, title/description optimisés « application motard / communauté moto / rencontre motards ».
- Contrastes AA, `aria-label` sur les sections et visuels, focus clavier visible, `prefers-reduced-motion` respecté (fallback statique).
- **i18n-ready** : tous les textes sont dans `index.html` (lang `fr`), structure prête pour une version EN.

---

© 2026 IZEN RIDE SAS
