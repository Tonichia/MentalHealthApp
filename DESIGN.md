---
name: Mind Matter
colors:
  # ── Dark surfaces (Welcome, Paywall, dark UI) ──────────────────────────────
  surface-deepest: "#0F172A"
  surface-dark: "#1E293B"
  surface-dark-border: "#334155"
  surface-dark-muted: "#475569"

  # ── Light surfaces (Home, Auth, content screens) ───────────────────────────
  surface: "#F8FAFC"
  surface-bright: "#FFFFFF"
  surface-container-low: "#F1F5F9"
  surface-container: "#E2E8F0"
  surface-container-high: "#CBD5E1"

  # ── Text ──────────────────────────────────────────────────────────────────
  on-surface: "#0F172A"
  on-surface-body: "#334155"
  on-surface-muted: "#475569"
  on-surface-subtle: "#64748B"
  on-surface-placeholder: "#94A3B8"
  on-surface-faint: "#CBD5E1"
  on-dark: "#F8FAFC"

  # ── Brand accent ──────────────────────────────────────────────────────────
  primary: "#F59E0B"
  primary-deep: "#451A03"
  primary-dark: "#78350F"
  primary-muted: "#D97706"
  primary-faint: "#FFFBEB"
  primary-border: "#FCD34D"

  # ── Links & secondary actions ─────────────────────────────────────────────
  secondary: "#2563EB"
  secondary-container: "#EFF6FF"
  secondary-border: "#93C5FD"

  # ── Semantic / category palette ───────────────────────────────────────────
  category-indigo: "#6366F1"
  category-emerald: "#10B981"
  category-amber: "#F59E0B"
  category-pink: "#EC4899"

  # ── Status ────────────────────────────────────────────────────────────────
  success: "#22C55E"
  success-container: "#DCFCE7"
  success-on: "#16A34A"
  error: "#EF4444"
  error-container: "#FEF2F2"
  error-border: "#FECACA"

typography:
  display:
    fontFamily: System (San Francisco on iOS)
    fontSize: 40px
    fontWeight: "900"
    lineHeight: 46px
    letterSpacing: "-1px"
  headline-lg:
    fontFamily: System
    fontSize: 32px
    fontWeight: "800"
    lineHeight: 38px
  headline-md:
    fontFamily: System
    fontSize: 28px
    fontWeight: "800"
    lineHeight: 34px
    letterSpacing: "-0.5px"
  headline-sm:
    fontFamily: System
    fontSize: 26px
    fontWeight: "800"
    lineHeight: 32px
    letterSpacing: "-0.5px"
  title-lg:
    fontFamily: System
    fontSize: 24px
    fontWeight: "800"
    lineHeight: 29px
    letterSpacing: "-0.3px"
  title-md:
    fontFamily: System
    fontSize: 22px
    fontWeight: "800"
    lineHeight: 28px
  title-sm:
    fontFamily: System
    fontSize: 20px
    fontWeight: "800"
    lineHeight: 26px
    letterSpacing: "-0.3px"
  body-lg:
    fontFamily: System
    fontSize: 17px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: System
    fontSize: 15px
    fontWeight: "500"
    lineHeight: 23px
  body-sm:
    fontFamily: System
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 21px
  label-lg:
    fontFamily: System
    fontSize: 16px
    fontWeight: "700"
    lineHeight: 22px
  label-md:
    fontFamily: System
    fontSize: 13px
    fontWeight: "700"
    lineHeight: 18px
  label-sm:
    fontFamily: System
    fontSize: 11px
    fontWeight: "800"
    lineHeight: 16px
    letterSpacing: "1.5px"
  label-xs:
    fontFamily: System
    fontSize: 10px
    fontWeight: "900"
    lineHeight: 14px
    letterSpacing: "1px"

rounded:
  full: 9999px
  xl: 36px
  lg: 28px
  card: 24px
  md: 20px
  sm: 18px
  button: 16px
  input: 14px
  chip: 12px
  tag: 8px

spacing:
  base: 8px
  xs: 4px
  sm: 10px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 28px
  section: 36px
  gutter: 20px
  screen: 24px

elevation:
  ambient:
    shadowColor: "#94A3B8"
    shadowOffset: "0 4px"
    shadowOpacity: 0.10
    shadowRadius: 8px
    elevation: 3
  medium:
    shadowColor: "#000000"
    shadowOffset: "0 4px"
    shadowOpacity: 0.06
    shadowRadius: 12px
    elevation: 4
  strong:
    shadowColor: "#0F172A"
    shadowOffset: "0 10px"
    shadowOpacity: 0.25
    shadowRadius: 20px
    elevation: 10
  brand:
    shadowColor: "#F59E0B"
    shadowOffset: "0 8px"
    shadowOpacity: 0.35
    shadowRadius: 16px
    elevation: 8

components:
  # Buttons
  button-primary:
    backgroundColor: "{colors.surface-deepest}"
    textColor: "{colors.on-dark}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.button}"
    paddingVertical: "{spacing.md}"
  button-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-deep}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.button}"
    paddingVertical: 18px
    shadow: "{elevation.brand}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-subtle}"
    typography: "{typography.label-lg}"
  button-secondary:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.chip}"
    paddingVertical: "{spacing.sm}"
    paddingHorizontal: "{spacing.md}"

  # Cards
  card-surface:
    backgroundColor: "{colors.surface-bright}"
    borderWidth: 1px
    borderColor: "{colors.surface-container-low}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    shadow: "{elevation.ambient}"
  card-dark:
    backgroundColor: "{colors.surface-deepest}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
    shadow: "{elevation.strong}"
  card-pro:
    backgroundColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
    shadow: "{elevation.brand}"

  # Form inputs
  input-field:
    backgroundColor: "{colors.surface}"
    borderWidth: 1px
    borderColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    placeholderColor: "{colors.on-surface-placeholder}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.input}"
    paddingVertical: 14px
    paddingHorizontal: "{spacing.md}"

  # Tier badges
  badge-free:
    backgroundColor: "{colors.surface-container-low}"
    borderColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface-muted}"
    rounded: "{rounded.full}"
  badge-plus:
    backgroundColor: "{colors.secondary-container}"
    borderColor: "{colors.secondary-border}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
  badge-pro:
    backgroundColor: "{colors.primary-faint}"
    borderColor: "{colors.primary-border}"
    textColor: "{colors.primary-muted}"
    rounded: "{rounded.full}"

  # Avatar
  avatar:
    size: 50px
    borderRadius: 25px
    ring-size: 58px
    ring-radius: 29px
    ring-color: "{colors.primary}"
    ring-width: 2.5px

  # Chat bubbles
  bubble-mine:
    backgroundColor: "{colors.surface-deepest}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.button}"
    borderBottomRightRadius: 4px
  bubble-theirs:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.button}"
    borderBottomLeftRadius: 4px
    shadow: "{elevation.ambient}"
    borderWidth: 1px
    borderColor: "{colors.surface-container-low}"

  # Accent bar (decorative rule used in cards and story detail)
  accent-bar:
    width: 44px
    height: 4px
    backgroundColor: "{colors.primary}"
    borderRadius: 2px
---

## Brand & Style

Mind Matter is a premium mental health companion app built on the idea that emotional growth should feel calm, considered, and trustworthy — never clinical or intimidating. The visual language pairs a rich, near-black foundation with warm amber accents to project both depth and optimism. The result is an interface that feels grounded at rest and inviting when you tap into it.

The overall aesthetic is **premium dark-light duality**: dark surfaces dominate onboarding and monetization screens to create intimacy and focus, while content screens open up into a clean, airy off-white that gives journal entries and stories room to breathe.

## Colors

The palette is built around two poles:

- **Slate 900 (`#0F172A`)** — the primary dark tone. Used as the hero background on onboarding and paywall screens, as the primary action button, as group chat "mine" bubbles, and as the avatar fill. It anchors the app in seriousness without feeling sterile.
- **Amber (`#F59E0B`)** — the brand warmth signal. Used as the CTA button color on dark screens, as the avatar ring highlight, as the affirmation card's accent bar, and as the entire Pro tier card. Amber communicates hope and energy without the harshness of red or yellow.

Light screens use **Slate 50 (`#F8FAFC`)** as the page background and pure white for card surfaces, creating a clear one-stop-up hierarchy. Card borders use the near-invisible **Slate 100 (`#F1F5F9`)** to preserve depth without heaviness.

The category palette (Indigo, Emerald, Amber, Pink) applies to self-help plan icons, onboarding slides, and story tags. Each color tints icon container backgrounds at 15–18% opacity using hex alpha suffixes (e.g., `#10B981` + `18` = `#10B98118`), never as flat fills, so the colors feel like a wash of light rather than paint.

Text follows a strict tonal scale from **Slate 900** (headings) → **Slate 700** (body) → **Slate 600** (subtitles) → **Slate 500** (metadata) → **Slate 400** (placeholders). This enforces clear hierarchy without requiring size changes alone.

## Typography

The app relies on the **system default typeface** (San Francisco on iOS). No custom font is loaded, which keeps the app feeling native and ensures text renders crisply on all device sizes and accessibility text-size settings.

Weight is used aggressively to create hierarchy within a single typeface:

- **Weight 900** at 40px for the Welcome screen's hero title — the most expressive moment in the app.
- **Weight 800** for all screen-level headings and card titles. Paired with subtle negative letter-spacing (−0.3px to −0.5px) to feel tight and modern.
- **Weight 700** for interactive labels, action text, and entry dates.
- **Weight 500–600** for body content and metadata — comfortable for sustained reading.
- **Weight 400** for form inputs only, signalling editability.

Section labels (e.g., "SUPPORT GROUPS", "TODAY'S PROGRESS") are set entirely in uppercase with **1.5px letter-spacing** at 11px/800 weight — a deliberate choice to distinguish structural labels from content text without adding color or size.

## Layout & Spacing

All screens use a consistent **20–24px horizontal gutter**. The home screen uses 20px; auth, paywall, and detail screens use 24px. Vertical breathing room between major sections is always 24–28px.

Cards use a **gap-based list model** (14–16px between items) rather than margin-based, keeping rhythm predictable. Internal card padding is 16–24px depending on card prominence — larger padding on hero/paywall cards, tighter on list items.

The feature grid on the Home screen divides the width into three equal 31%-wide cards, creating a compact but well-proportioned tool launcher.

## Elevation & Depth

Three distinct shadow tiers define the app's Z-axis:

1. **Ambient** (`#94A3B8` at 10% opacity, 8px blur) — the standard content-card shadow. Slate-tinted, extremely subtle; keeps cards from floating.
2. **Medium** (`#000` at 6% opacity, 12px blur) — used on form cards, progress cards, and story headers where slightly more lift is needed.
3. **Strong** (`#0F172A` at 25% opacity, 20px blur) — used on the affirmation card. A dark, expressive shadow that makes the card feel like it's embedded in the screen.
4. **Brand** (`#F59E0B` at 30–40% opacity, 14–20px blur) — the Pro tier card and the CTA button cast amber-tinted glows, reinforcing the premium signal through light.

## Shape Language

Radii decrease as components get smaller — a consistent visual grammar that signals hierarchy through shape:

- **Pill / Full** (9999px) — avatars, pagination dots, tier badge pills, live chip
- **36px** — hero header bottom corners on PlanDetail (maximum architectural curve)
- **28px** — StoryDetail floating header bottom corners
- **24px** — primary cards (affirmation card, auth form, paywall plan cards)
- **20px** — standard content cards (journal, stories, plans, connections)
- **18px** — secondary surface items (checklist rows, journal entries)
- **16px** — action buttons, send button, paywall CTA
- **14px** — text inputs
- **12px** — action chips (join, message, unlock)
- **8px** — metadata chips (duration, tag pills, availability)

This graduated scale means a user never needs to consciously read the shape — they intuitively know they're looking at a page background, a card, a button, or a chip.

## Key Patterns

### Dual-Mode Screens
The app cleanly alternates between **dark-surface** (Welcome, Paywall) and **light-surface** (all authenticated screens). The transition is abrupt by design — entering the paywall slides a dark modal up over the light home, creating a theatrical moment that frames the upgrade as an exclusive experience.

### Accent Bar
A 44×4px amber rounded rectangle appears in two recurring contexts: the affirmation card (top-left, before the label) and story detail pages (above the body content). It acts as a visual heartbeat — the same shape in both light and dark contexts, tying the brand color across very different screens.

### Tier Gating
Feature cards sport small corner badges ("PLUS", "PRO") positioned at `top: -8, right: -8` — just outside the card boundary — so the lock indicator never competes with the card's own content. Blue for Plus, Amber for Pro, matching their paywall card colors exactly.

### Chat Bubbles
"Mine" bubbles use the app's primary dark (`#0F172A`) background with a clipped bottom-right corner (4px radius vs 20px for all other corners), creating a speech-tail effect. "Their" bubbles are white with a clipped bottom-left corner, ambient shadow, and a subtle slate border. Sender avatars are 30×30 circles filled with `#0F172A` showing white initials — a small echo of the main avatar style.

### Progress Bar
The PlanDetail progress track uses `#F1F5F9` (Slate 100) as the empty state and fills with the plan's category color. Height is 10px with 5px radius — substantial enough to read at a glance, elegant enough not to dominate.

### Empty States
Every list screen has a centered empty state: large emoji icon (44px), a bold short heading in Slate 500, and a softer subtext in Slate 400. The structure is always icon → title → subtitle, never more than three lines.
