# IzenRide — site immersif

Landing page « nouvelle génération » pour la bêta IzenRide. Zéro dépendance,
zéro build : trois fichiers JS, une feuille de style, dix captures.

## Lancer

```bash
powershell -ExecutionPolicy Bypass -File izenride-vr/serve.ps1 -Port 4180
```

Puis <http://localhost:4180>. (Ouvrir `index.html` en `file://` fonctionne
aussi, mais le serveur évite les soucis de cache pendant l'itération.)

### Version autonome (un seul fichier)

```bash
powershell -ExecutionPolicy Bypass -File izenride-vr/build-standalone.ps1
```

Produit `GIT SITE/SITEWEB OFFICIEL.html` (~1 Mo) : **un seul fichier**, CSS,
JS, les dix captures et les deux documents légaux intégrés. S'ouvre d'un
double-clic, sans serveur, et s'envoie tel quel.

Les CGU/CGV y sont embarquées et s'affichent à la place du site selon le
fragment d'URL (`#cgu`, `#cgv`, ou une ancre interne comme
`#cgu-marketplace`). Leurs identifiants sont préfixés à la fabrication :
`#beta` et `#litiges` existent des deux côtés, et des id en double
casseraient la navigation par ancre.

Le script échoue s'il reste une ressource externe, un identifiant en
double ou une ancre morte.

C'est un fichier **généré** — le régénérer après toute modification du
site, sinon il diverge en silence.

### Liens directs

`?go=1` saute l'écran de contact. Une ancre le saute aussi, et amène
directement à la section — `/#radars`, `/?go=1#cockpit`. Pratique pour
partager un point précis ou capturer la page.

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
cgu.html / cgv.html         pages légales (texte fourni, non modifié)
assets/css/main.css         design system (tokens alignés sur l'app)
assets/css/legal.css        mise en page des documents légaux
assets/js/road-gl.js        shader WebGL du hero
assets/js/scenes.js         les trois scènes canvas
assets/js/app.js            orchestration : un seul RAF pour tout
assets/screens/*.jpg        captures officielles recadrées
docs/apercu/*.png           aperçu du rendu, section par section
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
- Pas de politique de confidentialité ni de bandeau cookies. Les CGU
  renvoient à une Politique de confidentialité qui n'existe pas encore
  sur le site — à écrire avant mise en ligne publique.

## Pages légales

`cgu.html` (v4.0) et `cgv.html` (v1.0) reprennent **mot pour mot** les
documents fournis par IZEN RIDE ; seule la mise en page a été transposée
sur le thème sombre. Ne pas réécrire le texte au fil des retouches de
style : la source de vérité est le document juridique, pas le site.

À la prochaine version des documents, remplacer le contenu des `<article>`
et mettre à jour le numéro de version, la date et l'historique en pied de
page.
