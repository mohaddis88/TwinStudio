# TwinStudio (working name)

TwinStudio is a website where marketers pick a human-looking AI creator, paste a script, and get a vertical UGC-style video back. No shoot, no studio, no booking a talent. People can also build their own AI twin, which only they can use.

This repo holds the front-end prototype and the docs that describe how it becomes a real product. Right now everything runs on mock data. No video is actually generated, and the sign-in is fake.

*Last updated: 13 Oct 2026. Status: prototype, pre-production.*

## Why it exists

Sites like ProxifAI license digital twins of real people, which is a fair model but slow: every face needs a contract. We start with synthetic creators nobody has to consent to, then add a consent-based path for people who want their own twin.

The bet is on realism. If a viewer scrolls past a TwinStudio video thinking "that's a person", we win. If they spot the AI in two seconds, nothing else on this site matters. Most of the docs here circle back to that.

## What works today

| Area | State |
|---|---|
| Landing, Models, Model profile, About, Contact | Built, mock data |
| Studio (pick model, script, generate, download) | Built, fake progress, plays a pre-rendered clip |
| Create your twin (photos, voice, consent, liveness) | Built, nothing is uploaded or trained |
| Auth (sign up, sign in, Google, forgot password) | Built, mock auth module |
| Light and dark theme, cursor glow, nav morph, themed scrollbar | Built |
| Real backend, real generation, real verification | Not started |

## Quick start

You need Node 20 or newer.

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000 (or whichever port your dev server prints).

Build for production with `npm run build`, then preview with `npm run preview`.

### Environment variables

The prototype needs none. For later phases, the shape is:

```bash
# Public (safe in the browser)
VITE_APP_URL="http://localhost:3000"
VITE_SUPABASE_URL="https://xxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="..."

# Server only. Never prefix these with VITE_ and never import them in client code.
SUPABASE_SERVICE_ROLE_KEY="..."
GEMINI_API_KEY="..."
ELEVENLABS_API_KEY="..."
VERIFICATION_VENDOR_KEY="..."

# Mock switches, one per external service
USE_MOCK_VIDEO=true
USE_MOCK_VOICE=true
USE_MOCK_VERIFICATION=true
USE_MOCK_AUTH=true
```

A warning from experience: an app exported from Google AI Studio can inject the Gemini key into the browser bundle at build time. That is fine for a demo and a leak in production. Read [SECURITY.md](docs/SECURITY.md) before you deploy anything with a real key.

## Project layout

Match this to your actual export. The names matter less than the rule: pages talk to `lib/api`, and only `lib/api` knows whether the data is mock or real.

```
src/
  pages/        Home, Models, ModelProfile, Studio, CreateTwin, Auth, About, Contact
  components/
    ui/         Button, Card, Chip, Input, Tooltip, Modal, Stepper, Toast
    layout/     Nav, Footer, ProfileMenu
    GlassFigure.tsx
  hooks/        usePointer, useReveal, useTheme, useOverlayScrollbar
  lib/
    api/        one function per backend call (mock today, real later)
    mock/       models, videos
    auth.ts
  styles/       tokens.css
docs/           everything below
```

## Docs

Start with the PRD, then Architecture. Skim the security files before touching auth or uploads.

| File | What's in it |
|---|---|
| [PRD.md](docs/PRD.md) | Who it's for, what we build, what we don't |
| [PLAN.md](docs/PLAN.md) | Phases, estimates, exit criteria |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Components, data flow, stack choices |
| [SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md) | Tables, endpoints, job states, limits |
| [MODEL_SPEC.md](docs/MODEL_SPEC.md) | What to produce for each AI model |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Tokens, components, motion, error copy |
| [AI_RULES.md](docs/AI_RULES.md) | Rules for AI coding tools and for AI features in the product |
| [SECURITY.md](docs/SECURITY.md) | How we protect accounts, uploads and keys |
| [DATA_SECURITY.md](docs/DATA_SECURITY.md) | What data we hold, where, for how long |
| [THREAT_MODEL.md](docs/THREAT_MODEL.md) | What can go wrong, and what we do about it |
| [SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md) | Tick-box lists for releases and launch |

## Rules of the house

1. Mock first, behind an adapter. Swapping to the real service should touch one file.
2. Design tokens only. No hex codes or pixel values in components.
3. Every screen handles loading, empty and error states, in both themes.
4. Every AI-made model and video carries an "AI-generated" label.
5. Face and voice data is the most sensitive thing we hold. Treat it that way from day one.

## Open items

These need an answer from someone other than the developer:

- Which video provider and plan, and what it costs per finished video.
- Legal review of the consent flow and data retention (Malaysian PDPA, plus any markets outside Malaysia).
- Which verification vendor handles liveness and face match.
- Final product name.

## License

Not decided. Treat as internal until someone says otherwise.
