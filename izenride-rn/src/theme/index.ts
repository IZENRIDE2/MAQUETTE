/**
 * IzenRide — Design tokens
 * Extraits fidèlement de la maquette HTML (thème ultra-dark premium).
 */

export const colors = {
  // Fonds
  bg: '#0a0e15',
  bg2: '#0f141d',
  bgDeep: '#07090f',
  // Texte
  ink: '#ffffff',
  inkDim: '#a8b0c0',
  inkMute: '#5e6478',
  // Bleu IZEN (marque)
  izen: '#4D6284',
  izenBright: '#7a92b8',
  izenLight: '#b8c5dd',
  izenDeep: '#2c3a52',
  // Bleu néon (accent / route GPS)
  neon: '#4d8fff',
  neonBright: '#7eb0ff',
  // Lignes / séparateurs
  line: 'rgba(255,255,255,0.08)',
  lineStrong: 'rgba(255,255,255,0.16)',
  // Surfaces verre (glass panels)
  panel: 'rgba(15,26,46,0.92)',
  panelSoft: 'rgba(15,26,46,0.85)',
  panelDeep: 'rgba(15,26,46,0.88)',
  // États
  success: '#4ade80',
  successText: '#6ef095',
  danger: '#ff5c7a',
  dangerSoft: '#ff8b8b',
  warn: '#fbbf24',
  purple: '#b884e6',
  purpleLight: '#d4b3ec',
  cyan: '#22d3ee',
  cyanLight: '#67e8f9',
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 28,
  round: 56,
  pill: 100,
} as const;

/** Échelle d'espacement (base 4px) */
export const space = (n: number) => n * 4;

export const fonts = {
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semibold: 'Geist_600SemiBold',
  bold: 'Geist_700Bold',
  mono: 'GeistMono_500Medium',
  monoBold: 'GeistMono_700Bold',
} as const;

export const type = {
  h1: { fontFamily: fonts.bold, fontSize: 30, color: colors.ink, letterSpacing: -0.5 },
  h2: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, letterSpacing: -0.3 },
  h3: { fontFamily: fonts.semibold, fontSize: 17, color: colors.ink },
  body: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink },
  bodyDim: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkDim },
  small: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.inkDim,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  },
  mono: { fontFamily: fonts.mono, fontSize: 14, color: colors.neonBright },
} as const;

/** Dégradé de fond ambiant (utilisé par <Screen>) */
export const bgGradient = {
  colors: ['#0a1428', colors.bg, colors.bgDeep] as const,
  start: { x: 0.3, y: 0 },
  end: { x: 0.7, y: 1 },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
  },
  neon: {
    shadowColor: colors.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 10,
  },
} as const;
