# Design system

*Last updated: 13 Oct 2026. Tokens below are the source of truth. If a component needs a value that isn't here, add a token first, then use it.*

The look: warm, soft, a bit glassy, never crowded. Light mode borrows the peach, lavender and coral of the reference image. Dark mode is the warm brown theme with faint glows so it never goes flat black.

## Themes

Set with `data-theme="light|dark"` on the root. Default follows the system setting, a nav toggle overrides it, and the choice is saved. Every page and every component must read from variables. If something stays dark in light mode, a color is hardcoded somewhere. (This has already happened once on the Create your twin page.)

| Token | Light | Dark |
|---|---|---|
| --bg | #FBEBDD | #120D0A |
| --surface | #FFF7F0 | #1B1410 |
| --surface-2 | #F4E3D3 | #2A1F18 |
| --text | #2B1B3D | #F8F7F5 |
| --text-secondary | #5B4A6E | #E6D2BE |
| --text-muted | #6E5F80 | #C8B4A0 |
| --border | #E7CBB8 | rgba(107,85,69,.4) |
| --primary | #7C4DFF | #C8B4A0 |
| --primary-grad | #7C4DFF to #B388FF | #C8B4A0 to #967A68 |
| --coral | #FF8A7A | #E5675F |
| --amber | #FFC66B | #E0A24A |
| --success | #2E7D32 | #5FB57A |
| --warning | #B26A00 | #E0A24A |
| --error | #B3261E | #E5675F |

Small text must hit 4.5:1 contrast. The accent shades (#C8B4A0, #967A68) are for fills, borders and large text only.

Page backgrounds are gradients, never flat: peach into lavender into a coral glow in light mode, brown with plum and coral haze in dark.

## Type

Inter for everything. Instrument Serif italic for one accent word per heading, no more. Scale: 12, 14, 16, 18, 24, 30, 48, 60 px. Body line length caps at 65 characters. Sentence case everywhere. No all-caps paragraphs.

## Space and shape

Spacing on a 4 px scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Radius: 12 for inputs and buttons, 20 for cards and modals, full pill for chips and the scrolled nav. Nothing else. One soft warm shadow. Cards use a glass surface with a 1 px border.

## Layout

Mobile first. Check at 360, 768 and 1280 px. Container max width 1200 px (1280 for the model grid). Model grid: 2 columns under 640 px, 3 at 768, 4 at 1024, 5 from 1280. Equal card heights. Text clamps instead of overflowing. No horizontal scroll, ever.

## Components

One component per pattern: Button, Card, Chip, Input, Tooltip, Modal, Stepper, Toast, Section, GlassFigure. No copy-pasted styling.

**Buttons.** Primary (gradient fill), Secondary (outline), Ghost (text with an arrow, except on "Create your twin", which has none). 44 to 48 px tall. One primary per section. Labels say what happens: "Create video", not "Submit". Every button needs default, hover, focus-visible, active, disabled and loading states.

**Model card.** Glass silhouette (3:4), name, one role line, at most two chips. Play icon on hover. The "AI-generated" mark is a small corner icon with a tooltip, not repeated text.

**Model profile.** Top: media, name, role, "Use this model", "Character kit". Below: four tabs (Overview, Looks, Videos, Voice), one visible at a time. Sticky CTA on mobile.

**Home cards.** Icon, a title of four words or fewer, one sentence of 16 words or fewer. Nothing more.

**Nav.** Full width at the top, transparent. After about 40 px of scroll it turns into a floating glass pill with a spring transition (roughly 400 ms), roomy spacing, same text size. Signed-in users see their name as a button that opens a small panel with their email and "Sign out". There is no standalone sign-out icon. On mobile the sheet shows the same info.

**Scrollbar.** The native bar is hidden so the page uses the full width. A thin overlay thumb appears while scrolling and fades about 800 ms after the last scroll event.

**Cursor glow.** A fixed radial gradient that sticks to the pointer with no easing. Fine pointers only, and off when the user prefers reduced motion.

## Motion

Reveal on scroll (fade plus 16 px rise, staggered 80 ms, once). Cards lift 4 px on hover. Page transitions fade. 200 to 500 ms, ease-out. Animate transform and opacity only. Pause anything off-screen. Honor `prefers-reduced-motion` by removing movement, not by removing meaning.

## States every screen needs

Loading (skeletons, not spinners on blank pages), empty (say what to do next), error (one sentence and one action), disabled (explain why if it isn't obvious), success (short, then move on).

## Help and errors

Use a small (i) icon for anything non-obvious: consent, voice samples, styles, liveness, the character kit. It must work with a keyboard. Error text is plain and specific, with one next step, and no codes or stack traces. See the catalog in SYSTEM_DESIGN.md.

Write: "That photo is too dark. Try one near a window."
Don't write: "Error 422: image luminance below threshold."

## Accessibility

Semantic HTML. Visible focus ring on every interactive element. Full keyboard navigation (the profile menu uses arrow keys and Escape). Alt text on images. Contrast of 4.5:1 for body text. `aria-live` for errors and job status.

## Copy

Short and concrete. The writing rules in AI_RULES.md apply to every word on the site.
