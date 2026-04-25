// ─────────────────────────────────────────────────────────────────────────────
// theme.ts  —  Mind Matter Wellness  |  Calm-inspired design system
// ─────────────────────────────────────────────────────────────────────────────
//
//  Design DNA (inspired by Calm.com):
//  • Deep azure-to-midnight gradient backgrounds  (like sky over a still lake)
//  • Frosted glass / translucent cards over the gradient
//  • Soft white / cream text — never harsh on dark
//  • Warm gold accent used sparingly — like sunlight on water
//  • Generous whitespace — "the silence between the notes"
//  • Rounded everything — pills, large radius cards
//  • Nature-palette midtones: sage, mist, dusk rose
//
// ─────────────────────────────────────────────────────────────────────────────

// ── Core palette ──────────────────────────────────────────────────────────────
export const C = {
  // Gradient stops (use as LinearGradient colors)
  gradientDeep:    '#0B1E2D',   // deep midnight navy  (bottom / start)
  gradientMid:     '#1A3A4A',   // dusky teal-navy      (middle)
  gradientSky:     '#2B5F72',   // calm lake blue        (upper-mid)
  gradientDawn:    '#3D7A8A',   // horizon teal          (top / end)

  // Glass / overlay surfaces
  glass:           'rgba(255,255,255,0.10)',
  glassBorder:     'rgba(255,255,255,0.18)',
  glassDark:       'rgba(0,0,0,0.25)',
  glassDarkBorder: 'rgba(255,255,255,0.10)',
  overlay:         'rgba(11,30,45,0.55)',

  // Text on dark backgrounds
  textPrimary:     '#F0EDE6',   // warm cream white
  textSecondary:   '#B8C9D0',   // muted sky blue-grey
  textTertiary:    'rgba(240,237,230,0.55)',
  textInverse:     '#0B1E2D',   // for light-bg contexts

  // Accents
  gold:            '#D4A853',   // warm sunlight gold
  goldLight:       '#F0C97A',
  goldFaint:       'rgba(212,168,83,0.18)',

  // Semantic / functional
  sage:            '#7BAE8E',   // nature sage green
  sageFaint:       'rgba(123,174,142,0.18)',
  duskRose:        '#B8748A',   // soft dusk rose
  duskRoseFaint:   'rgba(184,116,138,0.18)',
  mist:            '#8BA8B5',   // mist blue
  mistFaint:       'rgba(139,168,181,0.18)',

  // Legacy compatibility (so existing code using C.primary still works)
  primary:         '#0B1E2D',
  secondary:       '#D4A853',
  background:      '#0B1E2D',
  surface:         'rgba(255,255,255,0.10)',
  surfaceContainerLow:    'rgba(255,255,255,0.06)',
  surfaceContainer:       'rgba(255,255,255,0.10)',
  surfaceContainerHigh:   'rgba(255,255,255,0.16)',
  outline:         'rgba(240,237,230,0.40)',
  outlineVariant:  'rgba(255,255,255,0.12)',
  onSurface:       '#F0EDE6',
  onSurfaceVariant:'#B8C9D0',
  primaryContainer:'rgba(27,58,74,0.80)',
  onPrimaryContainer: '#B8C9D0',
  secondaryContainer: '#D4A853',
  sageDark:        '#4A7A5C',
  terracottaLight: '#D4A853',
  error:           '#CF6679',
  errorContainer:  'rgba(207,102,121,0.20)',
};

// ── Typography ────────────────────────────────────────────────────────────────
export const F = {
  headline:       'Newsreader_500Medium'        as const,
  headlineItalic: 'Newsreader_500Medium_Italic'  as const,
  body:           'PlusJakartaSans_400Regular'   as const,
  medium:         'PlusJakartaSans_500Medium'    as const,
  semibold:       'PlusJakartaSans_600SemiBold'  as const,
  bold:           'PlusJakartaSans_700Bold'      as const,
  extraBold:      'PlusJakartaSans_800ExtraBold' as const,
};

// ── Shadows ───────────────────────────────────────────────────────────────────
export const SHADOW_SM = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.18,
  shadowRadius: 6,
  elevation: 2,
};

export const SHADOW_MD = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.24,
  shadowRadius: 12,
  elevation: 4,
};

export const SHADOW_LG = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.32,
  shadowRadius: 20,
  elevation: 8,
};

// ── Gradient presets (pass directly to LinearGradient colors prop) ────────────
export const GRADIENT_BG     = [C.gradientDeep, C.gradientMid, C.gradientSky] as const;
export const GRADIENT_BG_FULL= [C.gradientDeep, C.gradientMid, C.gradientSky, C.gradientDawn] as const;
export const GRADIENT_GOLD   = ['#D4A853', '#F0C97A'] as const;
export const GRADIENT_CARD   = ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.06)'] as const;
