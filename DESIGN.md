---
name: PortfolioV3
description: A warm, technical personal portfolio for a creative and thoughtful builder.
colors:
  ink: "#1f2a24"
  ink-soft: "#526059"
  paper: "#fbf8ef"
  paper-soft: "#f3ead9"
  line: "#ded2bf"
  moss: "#607466"
  moss-dark: "#3d5146"
  clay: "#bd6f4c"
  peach: "#ffb58e"
  cobalt: "#3157ff"
  sky: "#8ab6c8"
  lilac: "#b6a4ca"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 8vw, 7rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.18em"
rounded:
  subtle: "0.25rem"
  field: "0.08em"
  surface: "0.5rem"
  soft: "1.25rem"
  organic: "2rem"
  pill: "9999px"
spacing:
  page-x-mobile: "1rem"
  page-x-tablet: "1.5rem"
  page-x-desktop: "2rem"
  control-x: "1.25rem"
  control-y: "0.75rem"
  surface-padding: "1.5rem"
  section-gap: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.moss-dark}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.25rem"
  chip-neutral:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
  surface:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "1.5rem"
  navigation-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.875rem"
---

# Design System: PortfolioV3

## 1. Overview

**Creative North Star: "The Builder's Studio"**

PortfolioV3 should feel like entering the personal space of a creative, thoughtful, fun, and professional builder. The work is presented with enough clarity to establish technical credibility, while interactions and visual details reveal curiosity, experimentation, and personality.

The system is warm and technical rather than corporate or futuristic. It uses paper-like neutrals, dark green ink, practical project imagery, generous editorial scale, and moments of color that feel selected rather than decorative. Existing patterns are a foundation, not a restriction: pill controls, Inter typography, and soft surfaces may evolve when a stronger solution better expresses the brand.

Motion is part of the identity. It should be thoughtful, distinctive, and sometimes playful, especially when it helps a page feel authored. It should not become constant background activity or prevent visitors from understanding the work.

**Key Characteristics:**

- Warm, technical, and personal
- Clear project storytelling with room for experimentation
- Mostly flat layouts with selective ambient depth
- Soft, confident, and quietly playful components
- Intentional motion that contributes to the brand
- Consistent identity without forcing every page into the same composition

## 2. Colors

The palette combines paper and ink neutrals with natural moss and clay accents, supported by brighter colors for playful or experimental moments.

### Primary

- **Deep Ink** (`#1f2a24`): Primary text, strong controls, active navigation, and high-contrast anchors.
- **Moss Green** (`#607466`): Calm technical accent for supporting emphasis, focus treatments, and subtle tinted states.
- **Dark Moss** (`#3d5146`): Hover states, selected details, and stronger green emphasis.

### Secondary

- **Clay** (`#bd6f4c`): Warm emphasis for links, editable fields, small markers, and selected labels.
- **Sky** (`#8ab6c8`): Cool balancing accent for backgrounds, project treatments, and gentle atmosphere.

### Tertiary

- **Peach** (`#ffb58e`), **Cobalt** (`#3157ff`), and **Lilac** (`#b6a4ca`): Playful colors used sparingly in experiments, motion, and expressive details.

### Neutral

- **Paper** (`#fbf8ef`): Main page background and light text on dark controls.
- **Soft Paper** (`#f3ead9`): Tonal surface background and image framing.
- **Soft Ink** (`#526059`): Supporting copy, metadata, and secondary navigation.
- **Line** (`#ded2bf`): Dividers and quiet structural borders.

### Named Rules

**The Ink First Rule.** Deep Ink and Paper establish the visual hierarchy before accents are introduced.

**The Selected Color Rule.** Bright accents should appear as authored moments, not as a rainbow applied evenly across every component.

## 3. Typography

**Display Font:** Inter with system sans-serif fallbacks  
**Body Font:** Inter with system sans-serif fallbacks  
**Label Font:** Inter with system sans-serif fallbacks

**Character:** The current single-family system is direct, readable, and flexible. Hierarchy comes from scale, weight, spacing, and composition rather than a decorative type pairing. Inter is an existing implementation choice, not a permanent brand requirement.

### Hierarchy

- **Display** (600, fluid `clamp()` scales, `1` line-height): Hero statements, page titles, and large project names.
- **Headline** (600, approximately `3.75rem`, `1` line-height): Major section headings.
- **Title** (600, approximately `1.875rem`, `1.25` line-height): Project cards, component titles, and dense content headings.
- **Body** (400, `1rem`, `1.75` line-height): Explanatory copy, project narratives, and supporting detail. Keep long prose near `65–75ch`.
- **Label** (600, `0.875rem`, up to `0.18em` letter spacing): Short metadata, navigation, and occasional section labels.

### Named Rules

**The Scale Carries the Voice Rule.** Use clear changes in scale and weight to create hierarchy. Do not rely on repeated decorative labels to make sections feel designed.

**The Readable First Rule.** Large typography can be expressive, but it must remain legible and avoid awkward overflow at mobile and tablet widths.

## 4. Elevation

The system is mostly flat. Dividers, tonal backgrounds, image frames, and spacing should provide the default structure. Ambient shadows are used selectively for floating navigation, primary actions, project previews, and surfaces that genuinely need separation from the page.

### Shadow Vocabulary

- **Soft Ambient** (`box-shadow: 0 24px 80px rgb(57 45 32 / 0.12)`): Large floating surfaces and framed project imagery.
- **Control Lift** (`box-shadow: 0 14px 34px rgb(31 42 36 / 0.18)`): Primary actions and small identity marks.
- **Navigation Float** (`box-shadow: 0 18px 65px rgb(31 42 36 / 0.08)`): Translucent floating navigation.
- **Focus Ring** (`box-shadow: 0 0 0 3px rgb(96 116 102 / 0.28)`): Visible keyboard focus treatment.

### Named Rules

**The Flat by Default Rule.** Start with spacing, color, and borders. Add shadow only when an element needs to float or respond.

## 5. Components

Components should feel soft, confident, and quietly playful. Their shape should support the interaction rather than become a mandatory brand signature.

### Buttons

- **Shape:** Current primary and secondary actions use full-pill shapes, but future controls may use softer or more structured geometry when it better fits the page.
- **Primary:** Deep Ink background, Paper text, compact semibold label, and approximately `0.75rem 1.25rem` padding.
- **Hover / Focus:** Lift slightly, shift to Dark Moss, and retain a visible moss focus ring.
- **Secondary:** Paper-toned background, Deep Ink text, and a quiet Line border.

### Chips

- **Style:** Full-pill metadata markers with thin borders, compact padding, and neutral or lightly tinted backgrounds.
- **State:** Moss, clay, and sky variants communicate category or status without dominating the page.

### Cards / Containers

- **Corner Style:** Small content surfaces commonly use `0.5rem`; expressive project containers may use larger organic radii up to `2rem`.
- **Background:** Paper, Soft Paper, translucent white, or the shared tonal `.surface` treatment.
- **Shadow Strategy:** Flat by default; use Soft Ambient only when separation is meaningful.
- **Border:** Quiet `1px` Line borders are the main structural treatment.
- **Internal Padding:** Commonly `1.5rem`, adjusted for content density.

### Inputs / Fields

- **Style:** The signature contact form uses inline editable phrases instead of conventional boxed inputs. Fields remain transparent and are identified by an underline.
- **Focus:** The underline shifts to Clay, the caret remains visible, and keyboard focus must stay clear.
- **Error / Disabled:** Use concise status text and preserve readable contrast.

### Navigation

- **Style:** Floating, compact, and lightly translucent, with clear active states and a mobile menu that preserves the same visual language.
- **Default / Hover / Active:** Soft Ink at rest, Deep Ink on hover, and Deep Ink background with Paper text for active routes.
- **Mobile:** Use a clear menu control and a separate readable menu surface rather than compressing all links.

### Motion and Signature Interactions

- Use Motion for React for page transitions, scroll-driven project storytelling, hover responses, and authored moments such as the home intro.
- Motion may be expressive, but it should remain purposeful and respect reduced-motion preferences.
- Avoid applying the same fade-up reveal to every section simply for consistency.

## 6. Do's and Don'ts

### Do:

- **Do** present projects as stories about problems, approaches, decisions, outcomes, and lessons.
- **Do** use Deep Ink (`#1f2a24`) and Paper (`#fbf8ef`) to establish strong hierarchy before adding accents.
- **Do** use practical project screenshots and visuals that help visitors understand the work.
- **Do** let motion contribute to the identity through thoughtful, distinctive, and occasionally playful interactions.
- **Do** keep keyboard access, visible focus states, readable contrast, semantic structure, and reduced-motion alternatives in normal implementation work.
- **Do** allow different pages to have different compositions while maintaining a consistent voice.

### Don't:

- **Don't** build a generic developer portfolio template that relies on predictable hero, skills, project-card, and contact sections.
- **Don't** use corporate stock-site aesthetics or consulting language that feels impersonal.
- **Don't** position Alex as an AI influencer, guru, or thought leader.
- **Don't** use excessive AI buzzwords or unsupported claims.
- **Don't** use overly dark cyberpunk styling, terminal cosplay, or technical decoration without purpose.
- **Don't** use excessive animations, visual clutter, or novelty that competes with the work.
- **Don't** directly imitate reference portfolios instead of learning from their intentional interaction design and consistent identity.
- **Don't** treat pill-shaped controls, soft shadows, or any other current implementation pattern as mandatory when a more distinctive solution fits the brand better.
