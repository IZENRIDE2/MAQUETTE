/**
 * Référentiel de localisation — Paris / Île-de-France.
 *
 * RÈGLE PROJET : tous les visuels IzenRide sont localisés sur Paris.
 * Toute référence géographique (ville, quartier, route, adresse, région,
 * plaque, balade) doit utiliser ces valeurs — jamais Lyon ni la Provence.
 */

export const PARIS = {
  ville: 'Paris',
  region: 'Île-de-France',

  /** Quartiers / arrondissements parisiens (remplacent Croix-Rousse, Presqu'île, Gerland…) */
  quartiers: [
    'Montmartre',
    'Le Marais',
    'Bercy',
    'Bastille',
    'République',
    'Belleville',
    'Saint-Germain',
    'Batignolles',
    'Canal Saint-Martin',
    'Butte-aux-Cailles',
  ],

  /** Adresses parisiennes (remplacent rue Paradis, Av. Henri Pontier…) */
  adresses: [
    '24 rue de Rivoli',
    '12 boulevard Saint-Germain',
    "8 place de la Bastille",
    '45 rue du Faubourg Saint-Antoine',
    '3 quai de la Tournelle',
    '17 rue Oberkampf',
    '60 avenue des Champs-Élysées',
  ],

  /** Stations service (remplacent Total Aix Sud…) */
  stations: [
    'Total Porte d’Orléans',
    'TotalEnergies Quai de Bercy',
    'Esso Porte de la Chapelle',
    'BP Boulevard Périphérique',
  ],

  /** Axes routiers Île-de-France (remplacent A6/A7, D952…) */
  routes: [
    'Boulevard Périphérique',
    'A6a — Porte d’Orléans',
    'A13 — direction Normandie',
    'A4 — direction Marne-la-Vallée',
    'N118 — Vélizy',
    'D906 — Vallée de Chevreuse',
  ],

  /**
   * Destinations de balades moto près de Paris
   * (remplacent Col du Galibier, Sainte-Victoire, Gorges du Verdon…)
   */
  balades: [
    { nom: 'Forêt de Fontainebleau', detail: 'Boucle des gorges · 1 jour' },
    { nom: 'Vallée de Chevreuse', detail: 'D906 · matinée' },
    { nom: 'Rambouillet', detail: 'Forêt domaniale · demi-journée' },
    { nom: 'Vexin français', detail: 'Routes panoramiques · 1 jour' },
    { nom: 'Provins', detail: 'Cité médiévale · journée' },
    { nom: 'Versailles', detail: 'Run matinal · 45 min' },
  ],

  /** Lieux de RDV / cafés motards (remplacent Place Saint-Nicolas…) */
  spots: [
    'Café motards · Place de la Bastille',
    'Place de la République',
    'Esplanade de la Défense',
    'Bois de Vincennes',
    'Parc de la Villette',
  ],

  /** Plaques d'immatriculation (département 75 / IDF) */
  plaques: ['AB-123-CD · 75', 'EZ-456-RT · 92', 'GK-789-LM · 93'],
};

/** Coordonnées approx. du centre de Paris (Notre-Dame) pour les cartes. */
export const PARIS_CENTER = { latitude: 48.8566, longitude: 2.3522 };
