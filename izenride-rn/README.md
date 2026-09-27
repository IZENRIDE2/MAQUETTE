# IzenRide — App React Native (Expo)

Conversion des **101 maquettes** IzenRide (`IzenRide_Maquette_2.html`) en application **React Native / Expo (TypeScript)**, thème ultra-dark premium, **entièrement localisée Paris / Île-de-France**.

## Lancer le projet

> Prérequis : **Node.js 18+** et un téléphone avec **Expo Go** (ou un émulateur iOS/Android). Node n'était pas installé sur la machine de conversion — installe-le depuis https://nodejs.org puis :

```bash
cd "izenride-rn"
npm install
npx expo start          # puis scanner le QR code avec Expo Go
# ou : npm run android / npm run ios / npm run web
```

Si Expo signale des versions de dépendances à aligner :
```bash
npx expo install --fix
```

## Navigation

- **Accueil = catalogue** : tous les écrans groupés par catégorie, avec recherche (`app/index.tsx`).
- Touche un écran → route dynamique `app/s/[id].tsx` qui rend le composant via le **registre** (`src/screens/registry.ts`).
- Les écrans d'onglet (Carte, Match, Messages, Agenda, Profil, Shop) embarquent une `BottomTabBar` qui navigue entre les 6 sections principales.

## Structure

```
izenride-rn/
├── app/                      # Routes expo-router
│   ├── _layout.tsx           # Root + chargement polices Geist
│   ├── index.tsx             # Catalogue des 101 écrans
│   └── s/[id].tsx            # Rendu d'un écran par id
├── src/
│   ├── theme/index.ts        # Tokens (couleurs, typo, radius, ombres)
│   ├── data/paris.ts         # Référentiel de localisation Paris/IDF
│   ├── components/           # Fondation : Screen, Panel, AppBar, Avatar,
│   │                         #   Logo, MapBackground, BottomTabBar, boutons, bits…
│   └── screens/
│       ├── manifest.ts       # Métadonnées des 101 écrans (auto-généré)
│       ├── registry.ts       # id → composant (auto-généré)
│       ├── auth/ map/ match/ messages/ events/ market/
│       └── profile/ premium/ notifs/ safety/ settings/ system/
└── package.json
```

## Choix de conversion (fidélité moyenne)

- `backdrop-filter`/blur → fonds translucides (`colors.panel`).
- Dégradés CSS → `expo-linear-gradient`.
- Animations CSS (`@keyframes`, pulse, dash…) → **état statique au repos**.
- Icônes SVG → `lucide-react-native` (équivalents proches) ; illustrations → `react-native-svg` simplifié.
- Polices **Geist** + **Geist Mono** (chiffres, distances, prix).

## Localisation Paris

Toutes les références géographiques (Lyon, Aix, Marseille, Corse, Provence, Galibier, Verdon…) ont été remplacées par des équivalents **Paris / Île-de-France** : quartiers (Montmartre, Le Marais, Bercy…), balades moto (Forêt de Fontainebleau, Vallée de Chevreuse, Rambouillet, Vexin, Provins), axes (Périphérique, A6a, A13, N118, D906), adresses parisiennes, RCS/siège à Paris. Référentiel centralisé dans `src/data/paris.ts`.

## Groupes (lot 1) — backend Supabase

Spec complète : groupes d'amis privés, rôles personnalisables, suggestions 1 clic, invitation d'amis.
Le lot 1 livre le socle **groupes + rôles + membres**.

### Mode démo ou Supabase

- **Sans configuration**, l'app tourne en **mode démo** : données locales (groupe « Night Riders Paris »),
  mêmes règles que le serveur. Un bandeau « Démo · vu par … » permet de changer d'utilisateur pour
  tester l'app avec d'autres droits (fondatrice, admin, simple membre).
- **Avec Supabase** : copier `.env.example` en `.env` et renseigner l'URL et la clé `anon` du projet.

### Appliquer la migration

```bash
# Avec la CLI Supabase, projet lié :
supabase db push
# ou coller supabase/migrations/20260927000001_groups_core.sql dans l'éditeur SQL du dashboard
```

Toutes les écritures passent par des fonctions RPC (`create_group`, `upsert_role`, `assign_role`…)
qui vérifient permissions et rangs ; les tables sont en lecture seule pour les membres (RLS).

### Tests SQL

```bash
PGHOST=localhost PGUSER=postgres ./supabase/tests/run.sh
```
Rejoue la migration sur un Postgres local (schéma `auth` simulé) et vérifie RLS, permissions,
rangs, rôles par défaut, transfert du fondateur (lot 1), puis suggestions, décision en 1 clic,
concurrence, invitations, sourdine, sondages, expiration et destinataires des push (lot 2),
puis normalisation, empreintes, rattachement par code / téléphone / email, groupes mémorisés,
« Ce n'est pas moi », messages 1-1 et expiration des invitations (lot 3), puis badge vérifié
et modération, sorties promues, statistiques, rétention du journal (lot 4).

### Écrans et routes

| Écran | Route | Catalogue |
| --- | --- | --- |
| Messages (filtre Groupes, bandeau « Mes groupes », bouton +) | `/s/035` | 035 |
| Créer un groupe | `/groups/new` | 101 |
| Accueil du groupe (Chat, Sorties, Membres, Infos) | `/groups/<id>?tab=membres` | 102–105 |
| Gérer le groupe | `/groups/<id>/manage` | 106 |
| Rôles et permissions | `/groups/<id>/roles` | 107 |
| Éditeur de rôle | `/groups/<id>/roles/<roleId|new>` | 108 |

## Groupes (lot 2) — suggestions en 1 clic

Chaque action d'un groupe (sortie, sondage, annonce, invitation d'un membre) passe par une seule RPC,
`group_action` : si le rôle a la permission directe, c'est publié ; sinon ça devient une **suggestion**
qu'un membre habilité accepte en 1 clic (`decide_suggestion`), éventuellement après l'avoir modifiée.
Le premier qui décide gagne (verrou de ligne) ; les suivants reçoivent `already_decided`.

- **Où valider** : carte dans le chat, onglet « Valider » du groupe (glisser à droite = accepter,
  à gauche = refuser, « Tout accepter » par type), notification push avec boutons Accepter / Refuser…
- **Garde-fous** : 5 suggestions en attente max par membre et par groupe, expiration à 14 jours
  (ou à la date de la sortie), motif obligatoire pour refuser, 👍 indicatifs sans valeur de vote.
- **Invitations** : une suggestion « Membre » acceptée crée une invitation ; l'invité la voit dans
  Messages → Invitations et rejoint en 1 tap avec le rôle par défaut.
- **Réglages** : Notifications → Groupes (global, par groupe, issue de mes suggestions).

### Mise en service Supabase

1. Appliquer `supabase/migrations/20260928000001_groups_suggestions.sql` (après celle du lot 1).
2. Déployer l'Edge Function des push :
   ```bash
   supabase functions deploy notify --no-verify-jwt
   supabase secrets set NOTIFY_WEBHOOK_SECRET=<secret> PROFILES_TABLE=profiles
   ```
3. Dashboard → Database → Webhooks : sur `public.group_suggestions` (INSERT, UPDATE), appeler
   la fonction `notify` avec l'en-tête `x-webhook-secret: <secret>`.
4. Expiration automatique (extension `pg_cron` activée) :
   ```sql
   select cron.schedule('expire-group-suggestions', '*/15 * * * *', 'select public.expire_group_suggestions()');
   ```
5. Push côté app : renseigner `extra.eas.projectId` dans `app.json` (projet EAS) pour obtenir un
   jeton Expo ; il est enregistré par `register_push_token` au démarrage. Inactif sur le web et en démo.

### Nouveaux écrans

| Écran | Route | Catalogue |
| --- | --- | --- |
| Boîte « Valider » (glisser pour accepter) | `/groups/<id>?tab=valider` | 109 |
| Détail d'une suggestion | `/groups/<id>/suggestions/<sid>` | 110 |
| Créer / proposer (sortie, sondage, annonce, membre) | `/groups/<id>/propose/<type>` | 111, 112 |
| Modifier puis accepter | `/groups/<id>/propose/<type>?suggestion=<sid>` | 113 |
| Mes suggestions | `/groups/<id>/mine` | 114 |
| Messages → Invitations, Réglages → Notifications → Groupes | `/s/035`, `/s/071` | — |

## Invitation d'amis (lot 3)

- **Inviter** (Profil → Inviter un ami, ou depuis une suggestion de membre) : téléphone et/ou email
  optionnels, **groupes mémorisés dès la création** (modifiables jusqu'à l'inscription de l'ami),
  puis lien personnel `izenride.app/i/<CODE>` + QR code à faire scanner au point de RDV.
- **Rattachement** (`claim_friend_invite`, à la connexion) : par le code du lien / du QR / saisi à
  l'inscription, sinon par téléphone ou email **vérifiés** (l'invitation la plus récente gagne).
  Téléphone et email ne sont jamais stockés en clair : empreinte HMAC-SHA256 (clé dans
  `private.app_secrets`), effacée au rattachement ou à l'expiration (30 jours).
- **Groupes mémorisés** : à l'arrivée de l'ami, invitation directe si l'inviteur a `member.invite`,
  sinon suggestion « Membre » à valider en 1 clic.
- **Ami invité** : « Julie t'a invité », puis ses groupes à rejoindre en 1 tap ; « Ce n'est pas moi »
  annule le rattachement et ce qu'il a ouvert. Bandeau dans Messages pendant 7 jours.
- **Inviteur** : push « Yanis vient d'arriver » + carte dans Messages → écran de bienvenue :
  message pré-écrit, V de motard, invitation dans d'autres groupes, sortie à deux. Conversation 1-1.

### Mise en service

1. Appliquer `supabase/migrations/20260929000001_friend_invites.sql` (active `pgcrypto`).
2. Déployer la page du lien : `supabase functions deploy invite-landing --no-verify-jwt`, secrets
   `APP_STORE_URL`, `PLAY_STORE_URL`, puis rediriger `https://izenride.app/i/*` vers la fonction.
3. Webhooks vers `notify` : ajouter `public.friend_invites` (UPDATE) et `public.direct_messages` (INSERT).
4. `pg_cron` : `select cron.schedule('expire-friend-invites', '0 * * * *', 'select public.expire_friend_invites()');`
5. Liens universels (optionnel) : associer `izenride.app` à l'app iOS / Android ; sinon la page
   ouvre `izenride://i/<CODE>` et affiche le code à saisir à l'inscription.

### Écrans

| Écran | Route | Catalogue |
| --- | --- | --- |
| Inviter un ami (lien, QR, groupes) | `/friends/invite` | 115 |
| Mes invitations | `/friends/invites` | 116 |
| Souhaite la bienvenue (inviteur) | `/friends/welcome/<inviteId>` | 117 |
| Onboarding invité : accueil, groupes | `/welcome`, `/welcome?step=groupes` | 118, 119 |
| Conversation 1-1 | `/dm/<userId>` | 120 |
| Lien d'invitation ouvert dans l'app | `/i/<CODE>` | — |
| Inscription avec « Code d'invitation » | `/s/006` | 006 |

## Groupes pro (lot 4)

- **Badge vérifié** : le fondateur d'un groupe pro envoie raison sociale, SIRET (clé de Luhn,
  cas La Poste), site et justificatif (bucket Storage privé `verification-docs`, un dossier par
  groupe). Les modérateurs IzenRide (table `app_moderators`) valident ou refusent avec motif depuis
  Profil → Modération, et peuvent retirer le badge.
- **Sorties promues** : une sortie pro non « réservée aux membres » apparaît dans Agenda →
  « Sorties des pros ». Tout rider peut s'y inscrire (`join_public_ride`) sans entrer dans le groupe.
- **Au nom de l'organisation** : dans un groupe pro, les messages, sorties et annonces des
  gestionnaires sont signés « Moto-école Bastille · par Marc ».
- **Statistiques** (`insights.view`) : membres, engagement, messages par semaine, sorties, inscrits
  hors groupe, suggestions (taux d'acceptation, délai médian), invitations.
- **Journal** filtrable par type et par personne, conservé 12 mois (`purge_group_activity`).
- **Flag premium** : `has_feature` (SQL) / `hasFeature` (app) — tout reste ouvert en attendant l'offre.

### Mise en service

1. Appliquer `supabase/migrations/20260930000001_pro_groups.sql` (crée le bucket et ses règles si
   Storage est présent).
2. Ajouter les modérateurs : `insert into app_moderators (user_id) values ('<uuid>');`
3. `pg_cron` : `select cron.schedule('purge-group-activity', '15 3 * * *', 'select public.purge_group_activity()');`

| Écran | Route | Catalogue |
| --- | --- | --- |
| Demande de badge vérifié | `/groups/<id>/verification` | 121 |
| Modération des badges | `/moderation` | 122 |
| Statistiques | `/groups/<id>/stats` | 123 |
| Journal filtrable | `/groups/<id>/journal` | 124 |
| Sortie pro (fiche publique) | `/events/pro/<rideId>` | 125 |
| Agenda → Sorties des pros | `/s/040` | 040 |

Non couvert : la présence effective aux sorties (seuls les inscrits sont comptés).

## Vérification des SIRET (Pappers)

Le SIRET d'une demande de badge est vérifié au registre national des entreprises via
[l'API Pappers](https://www.pappers.fr/api). La clé reste côté serveur, dans l'Edge Function
`siret-check`.

- **À la saisie** : dès que le SIRET est complet et valide, l'app affiche la fiche du registre
  (dénomination, enseigne, forme juridique, activité, adresse, date de création). Elle préremplit la
  raison sociale et signale un nom qui diffère du registre.
- **Blocage** : un établissement fermé ou introuvable ne peut pas demander le badge. Le serveur fait
  le même contrôle (`request_group_verification` lit `siret_checks`). Si le registre n'a pas répondu,
  la demande passe et le modérateur voit « Pas encore consulté », avec un bouton pour vérifier.
- **Modération** : chaque demande affiche la fiche du registre, avec un bouton « Revérifier » qui
  ignore le cache.
- **Revérification mensuelle** : les badges accordés sont revérifiés tous les 30 jours. Un
  établissement fermé depuis remonte dans « Badges à revoir », avec le motif de retrait prérempli.
  Le retrait reste une décision de modération.
- **Crédits Pappers** :
  - le résultat est gardé en cache 7 jours (1 jour pour un SIRET introuvable) ;
  - la consultation est réservée aux fondateurs de groupes pro et aux modérateurs ;
  - elle est plafonnée à 20 consultations par heure et par personne, sans plafond pour les
    modérateurs.

### Mise en service

1. Appliquer `supabase/migrations/20261001000001_siret_registry.sql`.
2. Créer une clé sur [pappers.fr/api](https://www.pappers.fr/api), puis :
   ```bash
   supabase secrets set PAPPERS_API_KEY=<clé> SIRET_CRON_SECRET=<chaîne aléatoire>
   supabase functions deploy siret-check
   ```
3. Revérification mensuelle, lancée chaque nuit par lots de 50 (`pg_cron` et `pg_net`) :
   ```sql
   select cron.schedule('siret-recheck', '30 3 * * *', $$
     select net.http_post(
       url     := 'https://<projet>.supabase.co/functions/v1/siret-check',
       headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', '<SIRET_CRON_SECRET>'),
       body    := '{"mode":"recheck","limit":50}'::jsonb)
   $$);
   ```

Sans clé Pappers, l'app fonctionne : les demandes passent et arrivent en modération avec la mention
« registre injoignable ». En mode démo, un registre fictif répond :

| SIRET | Résultat |
| --- | --- |
| 884 019 260 00030 | Actif (Julie Moto Coaching) |
| 842 157 630 00018 | Actif (Bercy Motos) |
| 512 778 040 00018 | Fermé (Garage du Canal, badge à revoir) |
| Autre SIRET valide | Introuvable |
