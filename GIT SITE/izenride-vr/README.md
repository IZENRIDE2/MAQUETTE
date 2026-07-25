# IzenRide — site immersif

Landing page « nouvelle génération » pour la bêta IzenRide. Zéro dépendance,
zéro build : trois fichiers JS, une feuille de style, dix captures.

## Lancer

```bash
powershell -ExecutionPolicy Bypass -File izenride-vr/serve.ps1 -Port 4180
```

Puis <http://localhost:4180>. (Ouvrir `index.html` en `file://` fonctionne
aussi, mais le serveur évite les soucis de cache pendant l'itération.)

## Le parcours

Le scroll fait office d'accélérateur : la page se lit comme un trajet, avec
odomètre et étapes dans le rail de gauche.

| Section | Ce qui s'y passe |
|---|---|
| Contact | Écran d'allumage. Le bouton sert aussi de geste utilisateur pour demander l'accès au gyroscope (iOS l'exige). |
| Hero | Route de nuit générée en shader WebGL. Vitesse pilotée par le scroll, caméra par le pointeur ou le gyroscope. |
| Manifeste | Les trois piliers, repris du manifeste produit. |
| Le croisement | Canvas 2D : deux trajectoires se croisent, le compteur monte. |
| Radars | Canvas 2D : signalements qui apparaissent, se propagent aux motards proches, puis expirent. |
| Safety Zone | Canvas 2D : dôme de protection, proches en veille, simulation de détection de chute. |
| Les écrans | Les dix captures officielles de la bêta dans un châssis 3D, pilotées par un rail de vignettes. |
| Chiffres | Compteurs animés à l'entrée dans le viewport. |
| Bêta | Formulaire de pré-inscription (validation côté client uniquement — **non branché**, voir plus bas). |

## Fichiers

```
index.html                  structure + contenu
assets/css/main.css         design system (tokens alignés sur l'app)
assets/js/road-gl.js        shader WebGL du hero
assets/js/scenes.js         les trois scènes canvas
assets/js/app.js            orchestration : un seul RAF pour tout
assets/screens/*.jpg        captures officielles recadrées
serve.ps1                   serveur statique local
```

## Les captures

Recadrées depuis les captures d'émulateur du dépôt `IZENRIDE2/izenride` :
barre de statut Android (96 px) et barre de navigation système (126 px)
retirées, redimensionnées en 540 × 1119 (2× l'affichage), JPEG q90 —
664 ko au total.

Sources :

- `apps/mobile/docs/walkthrough/2026-04-29/` — connexion, safety, events, premium
- `audit-reports/2026-05-15/{map,itineraire,profile}/` — carte, itinéraire, profil, badges, paramètres GPS

Le ratio du châssis (`.phone`) est calé sur 540/1119 : si vous remplacez les
captures par d'autres dimensions, ajustez `height` sur `.phone` sinon
`object-fit: cover` rognera.

## Couleurs

Reprises telles quelles de `apps/mobile/lib/theme/colors.ts` et
`packages/ui/src/theme.ts` : fond `#08090E`, marque `#4D6284`, accent
`#4d8fff`, argent `#AAB1BC`. Le site et l'app parlent la même langue.

> À noter : `apps/site-institutionnel` utilise une palette orange
> (`#ff6b35`) qui date d'avant la refonte v3. Ce site suit le canon de
> l'app, pas celui du site institutionnel.

## Accessibilité et performance

- Un seul `requestAnimationFrame` pilote le shader et les trois canvas ;
  chaque scène s'arrête hors écran (IntersectionObserver).
- `prefers-reduced-motion` coupe les animations ; le bouton « Immersion »
  en bas à droite permet de basculer manuellement.
- Repli complet si WebGL est indisponible (dégradé statique) et si
  JavaScript est désactivé (`<noscript>`).
- DPR plafonné à 1,75 sur le shader.

## Ce qui reste à brancher

- **Le formulaire de pré-inscription ne poste nulle part.** Il valide
  l'e-mail et affiche une confirmation, rien de plus. À câbler sur l'API
  waitlist existante (`apps/site-institutionnel/src/pages/api/`).
- Les chiffres de la section « communauté » (1 284 motards, 47k km,
  9 130 croisements) sont des valeurs de démonstration.
- Pas de page légale, pas de bandeau cookies — à ajouter avant mise en ligne
  publique.
