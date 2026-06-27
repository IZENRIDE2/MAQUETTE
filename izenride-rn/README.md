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
