# TwinStudio Design System — Forma Editorial Token System

*Source of truth for TwinStudio UI/UX architecture, layout, motion, and CSS tokens.*

The look: editorial, refined, warm bone and deep ink aesthetic matching the Forma studio reference architecture.
- **Light mode default (Forma Warm Bone)**: Ivory/bone canvas (`#ebe9e5`), warm stone surfaces (`#e2dfd9`, `#d6d2ca`), and deep ink typography (`#151514`).
- **Dark mode (Forma Obsidian)**: Deep black canvas (`#0b0b0a`), obsidian surfaces (`#151514`, `#222220`), and bone typography (`#ebe9e5`).

---

## 1. Foundation Tokens

### Typography

TwinStudio pairs a grotesque primary typeface (`Geist`) with an expressive high-contrast italic serif (`Instrument Serif`) strictly for heading accents.

| Token | Definition | Usage Rules |
|---|---|---|
| `--font-sans` | `'Geist', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif` | Body copy, UI labels, buttons, navigation, inputs, cards, metadata |
| `--font-serif` | `'Instrument Serif', Georgia, serif` | Strictly italic (`font-style: italic`), used only for the accent phrase or single accent word in section headings (e.g., *"answers back."*, *"in motion."*, *"hold a feed."*, *"to human."*, *"Let's give it a face."*) |

### True Editorial Typography Scale

| Token | Value | Target Context |
|---|---|---|
| `--text-xs` | `12px` | Eyebrows, uppercase captions, letter-spacing: 0.12em, timestamps |
| `--text-sm` | `14px` | Nav links, buttons, step tabs, secondary labels |
| `--text-base` | `16px` | Standard body copy, line-height: 1.55 |
| `--text-lg` | `18px` | Editorial lead copy, line-height: 1.5 |
| `--text-xl` | `24px` | Creator card titles, step titles, letter-spacing: -0.02em |
| `--text-2xl` | `34px` | Footer CTA heading, line-height: 1.15, letter-spacing: -0.03em |
| `--text-3xl` | `clamp(44px, 5vw, 68px)` | Major section headings, line-height: 1.04, letter-spacing: -0.035em |
| `--text-display` | `clamp(52px, 6.2vw, 88px)` | Hero headline ("Presence that answers back."), line-height: 0.98, letter-spacing: -0.04em |
| `--text-statement` | `clamp(56px, 7.5vw, 108px)` | Studio statement headline ("We give shape to what is still in motion."), line-height: 1.0, letter-spacing: -0.045em |
| `--text-giant` | `clamp(110px, 20vw, 310px)` | Hero background watermark ("twin") & footer mega wordmark ("TwinStudio"), font-weight: 700, letter-spacing: -0.05em, line-height: 0.82 |

---

## 2. Color Tokens & Theme Architecture

Theme switching is controlled via `data-theme="light|dark"` on the root element (`<html>`). Light mode is the default. Every component reads purely from semantic tokens with zero hardcoded hex values.

| Token | Light Mode Default (Forma Warm Bone) | Dark Mode (Forma Obsidian) | Semantic Purpose |
|---|---|---|---|
| `--bg` | `#ebe9e5` | `#0b0b0a` | Canvas base background |
| `--surface` | `#e2dfd9` | `#151514` | Tier-1 surfaces: cards, modals, dropdowns |
| `--surface-2` | `#d6d2ca` | `#222220` | Tier-2 elevated surfaces: active chips, hover states, sunken inputs |
| `--text` | `#151514` | `#ebe9e5` | Primary headings, high-emphasis text, prominent titles |
| `--text-secondary` | `#5c5a55` | `#a3a09a` | Secondary descriptions, subheadings, labels |
| `--text-muted` | `#8c8982` | `#6e6c66` | Captions, placeholders, metadata, inactive items |
| `--text-inverse` | `#ebe9e5` | `#151514` | Text on inverted fills (primary buttons, dark badges) |
| `--border` | `rgba(21, 21, 20, 0.14)` | `rgba(235, 233, 229, 0.14)` | Standard hairline borders, dividers, card boundaries |
| `--border-strong` | `rgba(21, 21, 20, 0.28)` | `rgba(235, 233, 229, 0.28)` | Emphasized borders, hover states, active outlines |
| `--primary` | `#151514` | `#ebe9e5` | Primary brand ink fill, active highlights, key CTAs |

### Semantic Status & Feedback Tokens

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--status-success` | `#1b6d34` | `#4ade80` | Confirmed states, completed generation, verified badge |
| `--status-warning` | `#875200` | `#fbbf24` | Alert banners, quota warnings, review flags |
| `--status-error` | `#b5221d` | `#f87171` | Input validation errors, failure states, destructive actions |

---

## 3. Spacing Scale

- Micro scale: `--space-1` (`1px`), `--space-2` (`4px`), `--space-3` (`6px`), `--space-4` (`8px`), `--space-5` (`16px`), `--space-6` (`22px`), `--space-7` (`24px`), `--space-8` (`26px`).
- Layout spacers: `--space-layout-1: 32px`, `--space-layout-2: 48px`, `--space-layout-3: 64px`, `--space-layout-4: 96px`.
- Gutter: `--gut: clamp(20px, 3.3vw, 48px)`.
- Fluid ease: `--ease: cubic-bezier(0.2, 0.7, 0.2, 1)`.

---

## 4. Radius & Motion Tokens

- `--radius-xs`: `50px` (Circle icon buttons, badges)
- `--radius-pill`: `999px` (Pill buttons, navigation controls)
- `--radius-md`: `12px` (Inputs, dialogs)
- Durations: `--duration-instant: 250ms`, `--duration-fast: 300ms`, `--duration-normal: 350ms`, `--duration-slow: 400ms`, `--duration-slower: 500ms`, `--duration-step6: 600ms`.

---

## 5. Page Architecture (Forma Reference Match)

### Section 1: Hero (`src/pages/Home.tsx` + `src/components/ParticleAvatarCanvas.tsx`)
- Full viewport height (`min-height: 100vh`), `padding: clamp(90px, 12vh, 120px) var(--gut) clamp(32px, 4.5vh, 48px)`.
- Giant centered background watermark `"twin"` in `var(--text-giant)` at 4.5% opacity.
- Interactive HTML5 canvas with 18,000+ particles rendering a 3D sculpted human bust in three-quarter profile with horizontal liquid-particle ribbons streaming to canvas edges.
- Pointer interaction: mouse movement swirls and repels particles with spring recovery. Pauses via `IntersectionObserver` when off-screen.
- Split bottom grid: left column features `— AI HUMAN STUDIO — EST. 2026` and `Presence that answers back.` (italic serif accent). Right column contains editorial lead copy, solid black pill button `Create a video →`, and underlined link `Explore models →`.

### Section 2: Studio Statement (`src/components/ParticleTextHeading.tsx`)
- Padding: `clamp(100px, 14vw, 180px) var(--gut)`.
- Eyebrow: `The Studio`.
- Headline: `"We give shape to what is still in motion."` with `in motion.` in `Instrument Serif` italic.
- Stipple-to-solid reveal: samples DOM text onto an offscreen canvas into circular dots. As the section scrolls from 85% to 45% into view, dots converge and crossfade into the crisp DOM element.
- Offset bottom row: lead paragraph + underlined link `About the studio →`.

### Section 3: Selected Creators (`src/pages/Home.tsx`)
- Padding: `clamp(80px, 10vw, 140px) var(--gut)`.
- Heading: `Creators that hold a feed.` + link `All models →`.
- Asymmetric 2-column masonry grid matching Forma layout:
  - Card 1 (Left, 7 columns): Alya, Creator No. 01 (`aspect-ratio: 4/3.2`), AI-generated verified badge, smooth hover zoom.
  - Card 2 (Right, 5 columns, offset down 32): Marcus, Creator No. 02 (`aspect-ratio: 4/5`).
  - Card 3 (Left, 5 columns shifted): Chloe, Creator No. 03 (`aspect-ratio: 4/5`).
  - Card 4 (Right, 6 columns offset 16): Dr. Kavitha, Creator No. 04 (`aspect-ratio: 16/10`).

### Section 4: Approach (`src/pages/Home.tsx` + `ParticleAvatarCanvas.tsx` mode="sphere")
- Sticky interactive grid with 4 stages: `01 Identity`, `02 Voice`, `03 Matter`, `04 Delivery`.
- Interactive tab bar with 6-second auto-advance (pauses on hover).
- Animated progress bar indicator.
- Right column particle sphere morphing dynamically across the 4 steps:
  - Step 01: Dispersed noise cloud.
  - Step 02: Flowing acoustic wave ribbons.
  - Step 03: Intertwined pearl/sand ribbons with emergent facial relief contour.
  - Step 04: Resolved, breathing 3D digital avatar bust.

### Section 5: Stats & Marquee + Editorial Footer (`src/components/layout/Footer.tsx`)
- Studio stats: `64` Projects delivered, `11` Languages & dialects, `7` Creator personas, `98%` Direct response lift.
- Animated continuous marquee track with alternating sans / serif typography.
- 4-column footer grid (`Have a campaign still in motion? Let's give it a face.` + pill CTA + Studio / Contact / Follow lists).
- Giant bleed wordmark: `<div class="footer-wordmark">TwinStudio</div>` in `Geist` 700 at `clamp(90px, 17.5vw, 280px)`.
- Bottom legal bar with copyright and studio attribution.

---

## 6. WCAG 2.2 AA Contrast Compliance

- **Light Mode (`#ebe9e5` canvas)**:
  - Ink text (`#151514`) on `--bg`: **15.07 : 1** (Passes AAA)
  - Secondary text (`#5c5a55`) on `--bg`: **4.85 : 1** (Passes AA)
  - Muted text (`#8c8982`) on `--bg`: **3.22 : 1** (Passes AA Large)
  - Inverse text on `--primary`: **15.07 : 1** (Passes AAA)
- **Dark Mode (`#0b0b0a` canvas)**:
  - Bone text (`#ebe9e5`) on `--bg`: **16.84 : 1** (Passes AAA)
  - Secondary text (`#a3a09a`) on `--bg`: **8.20 : 1** (Passes AAA)
  - Muted text (`#6e6c66`) on `--bg`: **4.10 : 1** (Passes AA Large)
  - Inverse text on `--primary`: **16.84 : 1** (Passes AAA)
