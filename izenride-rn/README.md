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
concurrence, invitations, sourdine, sondages, expiration et destinataires des push (lot 2).

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

Les invitations par lien / QR code et l'onboarding de l'ami invité arrivent au lot 3.
