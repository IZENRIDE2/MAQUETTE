# Mise en corrélation site ↔ application

État au 2026-08-06. Site audité : ce dossier. Source de vérité :
`C:\Izen-ride\Izenride Demo`, branche `chore/deps-sdk57-web-security`.

## État au 2026-08-06, fin de journée

**Traité :** B1 (détection de chute — texte **et** la scène animée qui
dessinait « CHUTE DÉTECTÉE ») · B3 (case de consentement + mention RGPD) ·
B4 (`10-abonnements.jpg` retirée, carrousel à 9 écrans) · B5 (les 3 pages
légales créées) · B6 partiel (le texte « vrai téléphone » corrigé) ·
M1 partiel (tuile « 12 s ») · M2 (liens légaux dans les 3 pieds de page) ·
M3 (renvois des CGU) · M4 (radars au futur) · M5 (« proches en veille »).

**B2 à moitié :** le formulaire n'annonce plus une inscription qu'il ne fait
pas. L'appel réseau est écrit ; il reste à renseigner `ENDPOINT` dans
`assets/js/app.js` une fois la question CORS tranchée. En attendant il bascule
sur un envoi par e-mail **en le disant**.

**Décidé par Florian le 2026-08-06 :** les chiffres de communauté restent
(données non contractuelles) · les radars sont banqués comme fonctionnalité à
construire, promesse gardée au futur sur le site · hébergement OVH ·
**source unique = ce dossier**.

**M7 (liens magasin) — tranché : on attend.** Les fiches Play et App Store
sont **périmées**, et c'est un point de méthode : l'app publiée
(`com.izenride.app`, 2,2 ★ / 59 avis sur Play, 2,63 ★ / 41 avis sur l'App
Store, version iOS 3.0.7 du 18 novembre 2025) est l'**ancienne**, celle de
l'agence. Sa description vend « les zones de contrôles potentielles » — le
signalement communautaire n'existe pas — et « invisible dans un rayon de deux
kilomètres autour de votre domicile », alors que l'app gère aujourd'hui
plusieurs zones à rayon paramétrable.

🔴 **Une fiche boutique n'est donc pas une source de vérité** : c'est un
document de communication, au même rang que le site, et actuellement plus en
retard que lui. Le paquet est pourtant identique à celui du build en cours
(`app.config.js:31` → `com.izenride.app`), ce qui rend la confusion facile.

Les liens sont retirés du pied de page, URL conservées en commentaire dans
`index.html`. **À rétablir quand les fiches auront été reprises** — et la
reprise des fiches est elle-même un chantier : elles décrivent un produit que
le nôtre contredit, sur le texte que le relecteur Play lit en premier.

**Réseaux sociaux câblés** (vérifiés le 2026-08-06) : Instagram `@izenride`
(1 866 abonnés), TikTok `@IZENRIDE` (640 abonnés). YouTube `@IZENRIDE` est
en place mais **non vérifié** — la chaîne exige d'accepter une bannière de
consentement. Ni Facebook, ni X, ni LinkedIn n'existent.

**Reste ouvert :** M6 (médiateur — souscription externe) ·
B6/B7 (la passe de recapture, et les 2 dettes applicatives à corriger avant) ·
et les 3 points ci-dessous, découverts pendant la production des pages légales.

### Découvert le 2026-08-06 en écrivant les pages légales

1. ~~La suppression de compte promise n'est pas exécutée~~ — **traité le
   2026-08-06, et la réalité était différente de ce que j'avais annoncé.**

   Je m'étais fié à l'en-tête du fichier de migration (« NON APPLIQUÉE ») pour
   affirmer que le serveur faisait « trois UPDATE, zéro DELETE ». **La base
   disait le contraire** : les 17 clés étrangères étaient conformes, le journal
   `account_deletion_log` existait, et la fonction contenait bien
   `DELETE FROM auth.users`. Un commentaire d'en-tête n'est pas un état de
   déploiement.

   🔴 **Mais la fonction plantait quand même**, et je ne l'ai vu qu'en
   l'exécutant : `purge_contenu_personnel()` fait
   `DELETE FROM storage.objects`, que Supabase interdit par le déclencheur
   `protect_objects_delete` (ERROR 42501). Or la fonction n'attrapait que
   `foreign_key_violation` — le 42501 remontait et faisait échouer **toute**
   la suppression : aucun compte effacé, **aucune anonymisation de repli**,
   aucune trace au journal, cron en erreur chaque nuit.

   Invisible jusque-là parce qu'il y avait **0 compte en attente** : la boucle
   n'entrait jamais. Le défaut n'existait que le jour du premier utilisateur
   qui demanderait vraiment la suppression.

   **Corrigé et prouvé** par
   `supabase/migrations/2026_08_06a_effacement_survit_au_garde_storage.sql`
   (appliquée) et `supabase/tests/preuve-effacement-compte.sql` — compte
   synthétique, exécution réelle, transaction annulée, plus contrôle négatif
   vérifié.

   🔴 **Ce qui reste faux dans la page** : les **photos ne sont pas
   supprimées du Storage**. Ni les lignes `storage.objects`, ni les fichiers.
   Les buckets `avatars`, `bike-photos` et `photos` sont **publics** : l'URL
   d'un avatar « supprimé » répond encore 200. Seul un appel Storage API
   depuis une fonction Edge en service_role peut le faire. Tant que ce n'est
   pas câblé, l'article 4 de `suppression-compte.html` sur-promet en listant
   les photos parmi les données effacées. **Deux issues** : câbler l'appel, ou
   nuancer la page. La première est la bonne.
2. 🔴 **CGU et CGV vendaient comme payante une fonction gratuite.** Les deux
   pages annonçaient la navigation turn-by-turn dans le Premium, alors que
   `route-search.tsx:929` acte qu'elle est **gratuite depuis le 2026-07-26**
   (décision produit) et que `cgu.ts:153` / `cgv.ts:167` le disent aussi.
   **Corrigé**, et les trois avantages Premium qui manquaient ont été ajoutés.
3. ~~Deux engagements de la politique viennent du miroir web~~ — **tranché, et
   je m'étais trompé.** J'avais retiré « Algolia — statut Premium » et
   « Sentry — hébergement Union européenne » au motif qu'ils sont absents de
   `privacy.ts`. Le code dit le contraire :
   `supabase/functions/algolia-sync-user/index.ts:163` transmet bien
   `is_premium`, et le DSN de production est `…ingest.**de**.sentry.io`
   (Allemagne). **Les deux mentions sont rétablies.**
   🔴 Ce sont donc `privacy.ts:263` et `:275` qui sont **incomplets** — la
   politique de l'app sous-déclare une transmission que le code effectue,
   pendant que `cookies.ts:213` la déclare correctement. Deux documents
   juridiques de l'app se contredisent. À corriger côté app.

### Trois défauts de l'app découverts par la comparaison

Ils ne concernent pas le site, mais ils le concerneront dès qu'on le
régénérera depuis les sources.

- 🔴 **`privacy.ts` sous-déclare Algolia** (ci-dessus). Sous-déclarer une
  transmission est la faute RGPD ; sur-déclarer ne l'est pas.
- 🔴 **RevenueCat est annoncé au présent alors qu'aucune donnée ne part.**
  Les clés `EXPO_PUBLIC_REVENUECAT_API_KEY_*` n'existent que dans
  `.env.example` — ni dans `.env`, ni dans `.env.demo`, ni dans `eas.json`.
  L'adaptateur dégrade en no-op, `cookies.ts` le marque « Inactif / à venir »
  et `cgv.ts` dit qu'aucun paiement n'est prélevé en bêta. `privacy.ts` et le
  site, eux, l'annoncent comme un destinataire actif. À trancher avec la
  décision RevenueCat en attente.
- **Le tableau du paywall promet des quotas introuvables dans le code** :
  « Sorties moto par mois : 3 en gratuit / illimité en Premium » et « Matchs
  motards illimités » (`paywall.tsx:45-46`). Aucune constante de limite
  mensuelle n'existe. Ni le site ni les CGU n'en parlent — ce n'est donc pas
  un écart site/app, mais c'est un argument de vente dont rien ne prouve
  qu'il porte sur une limite réelle.

### 🔴 Aucune garde ne surveille ce site

`__tests__/lib/legal/politique-vs-divulgation.test.ts` protège `privacy.ts`,
`apps/web` et `apps/site-institutionnel` — **pas ce site**, qui est dans un
autre dépôt. C'est pourtant lui qui sera servi sur izenride.com et lu par le
relecteur Play. Tout ce qui a été corrigé aujourd'hui peut donc re-diverger en
silence. Même motif de périmètre que les gardes déjà banquées : une garde qui
ne balaie pas là où l'impact est maximal.

## Comment lire ce document

Chaque point porte son **niveau de preuve**. C'est la partie la plus
importante du document, parce qu'un audit qui ne distingue pas ce qu'il a vu
de ce qu'il a déduit fait perdre plus de temps qu'il n'en fait gagner.

| Marque | Signification |
|---|---|
| **[VU]** | J'ai ouvert le fichier ou l'image et constaté moi-même. |
| **[CODE]** | Vérifié par lecture du code de l'app, référence donnée. |
| **[AGENT]** | Vient du lot d'audit automatisé, non recontrôlé à la main. |
| **[DÉCISION]** | Demande un arbitrage humain : je ne tranche pas. |

### Ce que cet audit ne couvre pas

258 affirmations ont été relevées et confrontées au code. 145 ont reçu un
verdict négatif, mais **seules 14 ont été soumises à un contradicteur** — et
**13 de ces 14 sont tombées**. Autrement dit : les vérificateurs se trompent
environ neuf fois sur dix quand ils crient au faux, et 131 verdicts négatifs
n'ont jamais été contestés.

Conséquence pratique : **ce document ne retient que ce qui a survécu à une
contre-expertise ou à ma vérification directe.** Il est donc court et solide,
plutôt que long et bruyant. Il peut en revanche être **incomplet** — un
défaut réel a pu se perdre parmi les 131 non contestés.

---

## BLOQUANT

### B1 — « Détection de chute par capteurs » : la fonction n'existe pas

**[CODE]** Dans tout `apps/mobile`, le mot « chute » apparaît **une fois** :
un commentaire, `app/(safety)/sos-confirmation.tsx:69`. Aucun `expo-sensors`,
aucun accéléromètre, aucun `DeviceMotion` dans les sources. Le seul
`crash_zone` du dépôt est une valeur de `HazardKind` — une catégorie de
danger sur la route, pas un détecteur.

Ce que l'app fait réellement **[CODE]** :

- `app/(tabs)/map.tsx:691` — un **appui simple** sur le bouton rouge ouvre
  l'écran SOS. Pas de maintien.
- `app/(safety)/sos.tsx:230` — `<SOSCountdownRing durationSec={10} …>` :
  décompte de **10 secondes**, annulable (« Je vais bien »).

> ⚠️ Le premier jet de cet audit proposait « 3 s d'appui pour déclencher ».
> **C'est faux** : la valeur venait du brief testeur, pas du code. Vérifié et
> corrigé ici. Ne pas réintroduire.

**Corrections :**

- `index.html:259-263` — actuel :
  « Position partagée en éphémère avec vos proches, **détection de chute par
  capteurs**, compte à rebours avant alerte, et SOS avec vos coordonnées
  exactes. »
  → « Position partagée en éphémère avec vos proches, SOS déclenché d'un
  appui, **décompte de 10 secondes pour annuler une fausse alerte**, et vos
  coordonnées exactes transmises avec l'alerte. »
- `index.html:265` — « < 12 s / de la chute à l'alerte »
  → « 10 s / pour annuler avant l'envoi »
- `index.html:393` — la tuile `data-count="12"` « chute → alerte » :
  supprimer (traité avec M1).

C'est une allégation de sécurité sur une page publique. Elle passe avant tout
le reste.

### B2 — Le formulaire bêta ne transmet rien et affiche quand même « Place réservée »

**[VU]** `index.html:426` : `<form class="form reveal" id="betaForm" novalidate>`
— ni `action`, ni `method`. `assets/js/app.js:278-295` fait `preventDefault()`,
valide par regex, puis écrit `'Place réservée pour ' + region.value + …`.
**Zéro `fetch`, `XMLHttpRequest` ou `sendBeacon` dans les trois fichiers JS**
(vérifié par grep). L'adresse est jetée. Le visiteur croit être inscrit.

Le back-end existe **[AGENT]** :
`apps/site-institutionnel/src/pages/api/preinscription.ts:29-75` — insertion
dans `waitlist`, pot de miel, limitation à 5 requêtes / 10 min, déduplication
sur `23505`. C'est du raccordement, pas du développement.

**[DÉCISION] Trois points avant de coder :**

1. **L'adresse de l'endpoint.** Le site est statique ; l'endpoint est une
   route serveur d'un autre déploiement. Il faut soit servir les deux sous la
   même origine, soit ajouter les en-têtes CORS à `preinscription.ts` — il
   n'en pose aucun, un POST cross-origine sera bloqué par le navigateur.
2. **Le champ « Région » n'a aucune destination.** La table `waitlist` ne
   porte pas de colonne région. Soit on supprime le champ, soit on ajoute la
   colonne, soit on le range dans `utm_campaign`. Tant que ce n'est pas
   tranché, la promesse « les invitations partent par région »
   (`index.html:422-423`) est sans support.
3. **Si aucun raccordement n'est possible avant la mise en ligne**, remplacer
   le formulaire par un `mailto:` vers `direction@izenride.com`. Ne pas
   publier l'état actuel : promettre une inscription qu'on jette est pire que
   ne rien proposer.

### B3 — Aucune mention RGPD au point de collecte, pas de case de consentement

**[VU]** `index.html:447-451` ne porte qu'un argument commercial (« Pas de
spam, pas de revente »). Il manque le responsable de traitement, la finalité,
la base légale, la durée de conservation et les droits.

**[AGENT]** L'endpoint **refuse** d'ailleurs toute soumission sans `consent`
(`preinscription.ts:45` → `400 consentement_requis`) : la case est à la fois
une obligation légale et une condition technique du raccordement B2.

**[DÉCISION]** La durée de conservation. 24 mois est une valeur usuelle, pas
une valeur constatée. Elle devra être identique ici et dans
`confidentialite.html`.

### B4 — `10-abonnements.jpg` : des tarifs qui n'existent nulle part

**[VU — image ouverte]** L'image affiche « Mensuel / Trimestriel **−15 %** /
Annuel **−50 %** » et 9 lignes comparatives, dont « **Annonces marketplace
3 / Illimitées** ».

**[CODE]** `apps/mobile/lib/legal/content/cgv.ts:73-75` :
**Mensuel 9,99 € · Semestriel 49,99 € · Annuel 79,99 €**. Aucun palier
trimestriel n'existe. La remise annuelle réelle est de **−33 %**, pas −50 %.
La marketplace est hors périmètre (`lib/feature-flags.ts:43-57`).

Allégation tarifaire fausse sur une page publique, plus la mise en avant d'un
quota pour une fonctionnalité retirée.

**Action immédiate**, en attendant la recapture : retirer les trois
références au fichier — `index.html:328-330` (l'`<img class="scr">`),
`index.html:378-381` (l'onglet « Offres »), `index.html:411` (le mur
d'écrans). Le carrousel fonctionne à 9 écrans.

### B5 — Trois pages légales obligatoires absentes

**[VU]** Le site ne contient que `index.html`, `cgu.html`, `cgv.html`.

Les contenus existent déjà et n'ont pas à être réécrits : il s'agit de les
transposer dans le gabarit de `cgu.html` (même `assets/css/legal.css`, même
en-tête, même pied de page).

| Page à créer | Source à transposer | Motif |
|---|---|---|
| `confidentialite.html` | `apps/mobile/lib/legal/content/privacy.ts` — **resynchronisé le 2026-08-07 sur la v3.5**, voir la note ci-dessous | Play : URL de règlement de confidentialité obligatoire. RGPD art. 12-14. |
| `suppression-compte.html` | `apps/web/src/app/(legal)/suppression-compte/page.tsx` | Play : règle « Suppression de compte ». **L'app la déclare déjà cochée.** Le paragraphe sur l'utilisateur ayant désinstallé est exigé — ne pas l'amputer. |
| `mentions-legales.html` | `apps/mobile/lib/legal/content/legal-mentions.ts` | LCEN art. 6-III-1. Ce qui existe (pied de page + tableau « Identité du vendeur » des CGV) ne porte **ni le directeur de la publication ni l'hébergeur**. |

> 🔴 **`confidentialite.html` — resynchronisation du 2026-08-07 (v3.4 → v3.5).**
> La page portait DEUX fois une collecte « y compris lorsque l'application est
> fermée ou inutilisée » : la puce « Localisation (GPS) » de l'article 2 et
> l'encadré d'avertissement de l'article 4. C'est FAUX sur Android depuis le
> 2026-08-04 — `ACCESS_BACKGROUND_LOCATION` a été retirée du manifeste, absence
> vérifiée sur l'artefact (`aapt2 dump permissions` sur l'APK release). Décrire
> au relecteur Play une collecte que le binaire ne fait pas est la famille
> EXACTE du rejet du 2026-08-03, dans l'autre sens.
>
> Ce que la page dit désormais, recopié de l'app : pendant un guidage la
> collecte se poursuit lorsque l'application passe en arrière-plan, portée par
> un **service de premier plan** (nommé, sinon la phrase se lit comme une
> collecte d'arrière-plan ordinaire) et signalée par une notification
> permanente. iOS est décrit séparément et garde la formule, qui y reste vraie :
> `UIBackgroundModes: ['location']` y est toujours déclaré.
>
> Ajoutés au passage, absents jusque-là : **3.4 Micro — messages vocaux**
> (`RECORD_AUDIO` est délibérée et atteignable), **4.2 Alerte SOS** (le mot
> n'existait plus nulle part après le retrait de l'encadré), la puce « Micro et
> messages vocaux » de l'article 2 et la ligne « Pièces jointes de
> conversation » de l'article 6. Aucune durée de rétention n'est annoncée pour
> les vocaux : la purge à un mois existe en base mais n'est pas armée.
>
> ⚠️ **AUCUNE GARDE AUTOMATIQUE NE COUVRE CETTE PAGE.** Celle du dépôt mobile
> (`apps/mobile/__tests__/lib/legal/politique-vs-divulgation.test.ts`) lit trois
> documents, tous dans l'autre dépôt : la politique intégrée et les deux
> miroirs `apps/web` et `apps/site-institutionnel`. Ce fichier-ci est une
> QUATRIÈME surface, hors de sa portée. Sa conformité a été vérifiée à la main
> en lui appliquant la même logique (14/14 : phrase de référence mot pour mot,
> mécanisme nommé, aucune promesse « app fermée » hors portée iOS, sept
> destinataires nommés). **À rejouer à chaque modification de la politique de
> l'app**, sans quoi cette page dérivera en silence — c'est déjà ce qui s'est
> produit ici.

Valeurs sourcées **[AGENT]** : `legal-mentions.ts:50` → *Christophe Hirtt,
Président* ; `legal-mentions.ts:71-72` → *OVH SAS, 2 rue Kellermann, 59100
Roubaix* pour le site.

**[DÉCISION] L'hébergeur réel de ce site.** `legal-mentions.ts` nomme OVH
pour izenride.com. Si le site immersif part ailleurs, c'est cet hébergeur-là
qu'il faut nommer. Rien dans ce dépôt n'indique où il est publié (pas de CI,
pas de fichier de déploiement — seulement `build-standalone.ps1` et
`serve.ps1`).

**Ne pas recopier `cookies.ts` de l'app** : ce document décrit
l'application. Le site, lui, ne dépose rien — vérifié : aucun
`document.cookie`, `localStorage`, `fetch` ni `gtag` dans les trois JS. La
bonne formulation est « ce site ne dépose aucun cookie ni traceur ». Ce
constat devient faux dès qu'on y ajoute une mesure d'audience ou une police
distante ; le bandeau redeviendrait alors obligatoire.

### B6 — Les captures ont trois mois, et ne viennent pas d'un téléphone

**[VU — `README.md:76-84`]** Le site le dit lui-même :

> « Recadrées depuis les captures d'**émulateur** du dépôt IZENRIDE2/izenride »
> - `apps/mobile/docs/walkthrough/**2026-04-29**/` — connexion, safety, events, premium
> - `audit-reports/**2026-05-15**/{map,itineraire,profile}/` — carte, itinéraire, profil, badges, paramètres GPS

Les images datent donc du **29 avril** et du **15 mai**, pas du 4 août — leur
horodatage identique (04/08 18:01:02) atteste d'une copie, pas d'une capture.

Or `index.html:290-293` affirme : « **Aucune maquette retouchée : ce sont les
écrans de la bêta, capturés sur un vrai téléphone.** » Doublement faux :
émulateur, et trois mois d'écart.

Deux défauts avérés en découlent :

- **[VU — image ouverte] `02-carte.jpg` affiche six onglets dont
  « Market »**, supprimé le 2026-08-01. La barre y est flottante et arrondie
  à pastille bleue, alors qu'elle est ancrée et opaque depuis le 28 juillet ;
  le fond de carte est clair alors que le thème par défaut est sombre.
  `06-profil.jpg` et `07-badges.jpg` montrent le même onglet fantôme.
- **[VU — image ouverte] `08-confidentialite.jpg` : les quatre niveaux de
  précision sont TOUS décochés.** C'est le symptôme exact du défaut corrigé
  le 2026-08-01 (« flouter sa position était impossible — cinq valeurs sur
  cinq refusées »). Publier cette image, c'est illustrer la promesse de
  confidentialité avec la capture de l'écran cassé. En-tête « Paramètrès
  GPS » (sic) et diacritiques perdus sur tout l'écran.

**Correction de texte**, `index.html:290-293` :
→ « Des écrans de la bêta, capturés sur émulateur à partir du build en
cours. Bougez la souris — ou inclinez le vôtre. »

**Action** : refaire le lot complet en une passe, sur un build unique, en
notant commit et `versionCode` dans le `README.md`. Sur émulateur avec
`adb emu geo fix` et le thème de carte par défaut (procédure banquée).

### B7 — Une dette applicative à corriger AVANT de recapturer

**[AGENT]** `app/(onboarding)/step-3-events.tsx` et
`components/onboarding/v2/EventsMarketplaceScene.tsx` affichent la
marketplace **sans consulter le drapeau**, alors que le tour d'accueil filtre
bien sa diapositive sur `isFeatureEnabled('MARKETPLACE')`. `05-events.jpg`
est donc une capture *fidèle* d'un écran *fautif*.

Même chose pour `04-safety.jpg` : le texte d'onboarding annonce une zone
unique à rayon figé (2 km) alors que depuis le 2026-08-04 un motard déclare
**plusieurs** zones à rayon paramétrable — `fr.json:754-755` n'a pas suivi.

Ordre des opérations : corriger l'app, **puis** recapturer. Recapturer
d'abord ne ferait que photographier le défaut.

---

## MAJEUR

### M1 — Chiffres de communauté sans source

**[VU]** `index.html:390-393` — quatre tuiles (`1 284` motards en bêta, `47k`
km, `9 130` croisements, `12 s`), présentées comme factuelles par la note du
dessous : « Chiffres de la bêta fermée — mis à jour à chaque vague
d'invitations ». Aucun n'a de source dans le dépôt. La tuile « 12 s » tombe
avec B1.

Même famille : `assets/js/app.js:40` (« Réseau communautaire : 1 284
motards »), `index.html:113` (« 1 284 en ligne »), `:204` (« croisements
aujourd'hui »), `:241` (« signalements actifs »), `:276` (« 3 proches en
veille »).

**[DÉCISION]** Soit tu fournis les valeurs réelles — le compte d'inscrits est
interrogeable via `apps/site-institutionnel/src/pages/admin/waitlist.astro`
ou `scripts/export-waitlist.mjs` — soit on supprime la section
`index.html:387-397`. Ne pas laisser des nombres inventés sous une phrase qui
affirme qu'ils sont tenus à jour.

### M2 — Liens légaux absents des trois pieds de page

**[VU]** `index.html:473-480`, `cgu.html:197-202`, `cgv.html:175-180` ne
pointent que vers CGU / CGV / Contact. L'accès aux mentions doit être
« facile, direct et permanent » (LCEN art. 6-III).

Insérer dans les trois : `Mentions légales` · `Confidentialité` ·
`Supprimer mon compte`. Et `Confidentialité` dans la nav de tête
(`index.html:73-78`). **À faire après B5**, sinon les liens pointent dans le
vide.

### M3 — Les CGU renvoient à une politique qui n'existe pas

**[VU]** `cgu.html:133` : « … décrit dans notre Politique de
confidentialité, partie intégrante des présentes CGU » — sans lien, et la
page n'existe pas. Ajouter le lien, l'entrée au sommaire (`cgu.html:52-62`),
et un renvoi vers `suppression-compte.html` depuis l'article
« Comportements ».

### M4 — « Radars communautaires » : la chaîne de signalement n'a aucune interface

**[CODE]** Le socle existe et n'est pas en cause : `HazardKind` inclut
`speed_camera`, `hazard-engine.ts` implémente les 5 phases d'alerte,
`poi-service.ts:307` va bien chercher des POI de source `community`.

Ce qui n'existe pas, c'est **l'émission par le motard** :
`createCommunityPOI` (`lib/gps/supabase-poi-service.ts:89`) n'est appelé par
**aucun écran** — seuls ses propres tests l'invoquent. Le seul écrivain de
`routeHazards` du dépôt est `lib/gps/hazard-demo-controller.ts:51`, qui pose
une épingle de démonstration. Aucune validation croisée, aucune expiration
automatique.

Or `index.html:222-226` décrit précisément ces trois choses : « un tap ganté
suffit. L'alerte remonte, **se valide auprès des riders suivants**, et
**s'éteint toute seule** ». Même famille : `:126`, `:219-220`, `:338`, `:343`
(« en direct »).

**[DÉCISION]** Garder la promesse au futur, ou la retirer — c'est un
arbitrage commercial. Formulation possible si tu la gardes :
→ « L'app reçoit et annonce les dangers de votre trajet — contrôle, gravier,
épingle serrée, chaussée glissante — avec une alerte graduée à l'approche.
**La remontée par les riders eux-mêmes arrive avec la bêta ouverte.** »
Et retirer « en direct » des légendes `:338` / `:343`.

### M5 — « 3 proches en veille » : aucun canal ne prévient un non-membre

**[CODE]** `app/(safety)/sos-confirmation.tsx:57-74` acte que
`lib/safety/sos-service.ts` n'a **ni SMS ni SMTP** pour les contacts
d'urgence non inscrits ; seul un contact avec `linked_user_id` reçoit une
notification. Une mise en scène qui affichait « Reçu » en vert a d'ailleurs
été retirée de l'app le 2026-08-01 pour ce motif.

`index.html:276` laisse entendre que trois personnes seraient prévenues.
→ « 3 / contacts enregistrés ». Et ne pas ajouter, autour, de promesse
d'acheminement vers un proche non inscrit.

### M6 — Médiateur : la loi impose de l'inscrire, pas de le tenir à disposition

**[VU]** `cgu.html:160` et `cgv.html:139`, texte identique : « Les
coordonnées du médiateur désigné par IZEN RIDE sont communiquées sur demande
à direction@izenride.com. » L'art. R616-1 du Code de la consommation exige le
**nom**, l'**adresse postale** et le **site** du médiateur, visibles.

**[DÉCISION] + coût externe** : il faut d'abord souscrire auprès d'un
médiateur agréé. Dette déjà connue côté app. Le site et
`apps/mobile/lib/legal/content/{cgu,cgv}.ts` portent la même phrase : les
corriger **ensemble**, sinon ils divergeront.

### M7 — Aucun lien vers la fiche du magasin

**[VU]** Grep sur les trois HTML : zéro occurrence de `play.google.com` ou
`apps.apple.com`. Le site vend une bêta sans jamais permettre d'atteindre
l'application.

**[DÉCISION]** Les URL de fiche, et s'il faut les afficher pendant la bêta
fermée — un lien vers une fiche en accès restreint donne une page d'erreur.

---

## Ce qui n'a pas été vérifié

1. **131 verdicts négatifs sans contradicteur** (voir en tête). Un défaut
   réel a pu s'y perdre. À rejouer avec un plafond plus haut si le temps le
   permet.
2. **Ce que la Play Console déclare aujourd'hui** comme URL de règlement de
   confidentialité et de suppression de compte. À vérifier avant de remplacer
   quoi que ce soit.
3. **Où ce site est publié.** Rien dans le dépôt ne le dit — et ce qui a été
   téléversé sur l'hébergement OVH le 2026-08-06 était **l'autre version du
   site** (`index.html` à la racine de `site-immersif`), pas celle-ci.
4. **Les 5 autres captures** (`01`, `03`, `05`, `07`, `09`) : non ouvertes une
   à une. Elles tombent de toute façon dans la passe de recapture B6.
5. **L'article « Marketplace » des CGU** décrit des transactions entre
   membres pour une fonctionnalité retirée. Le site est ici **fidèle à sa
   source** (`cgu.ts` porte les mêmes occurrences, v4.0 alignée) : ce n'est
   pas un écart site ↔ app mais une question juridique côté app. Signalé pour
   qu'elle ne se perde pas.
