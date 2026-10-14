# Plan: from prototype to product

*Last updated: 13 Oct 2026. Estimates assume one developer working with AI coding tools, and a supervisor who can answer questions within a day. Treat the weeks as a guess, not a promise.*

## Where we are

Phase 0 is done or finishing: every page exists, the design system is settled, and the whole flow can be clicked through on mock data. That took a lot of prompting, fixing and redoing, and a few lessons came out of it. Image-heavy hero ideas fought the tooling and lost, so the hero is text-only. Theme bugs hide in hardcoded colors. And "make it look like the reference" never works as well as "here are the exact tokens".

What follows is the order I'd build the real thing in. The order matters more than the dates.

## Phases

### Phase 1: Foundations (about 1 week)

Goal: a deployed site with real accounts and nothing fake underneath it except generation.

- Export the prototype, push to GitHub, deploy to Vercel on every merge to main.
- Supabase project: Auth (email, Google), Postgres, Storage. Replace `lib/auth.ts` with the real client behind the same function names.
- Create the base tables and row-level security (see SYSTEM_DESIGN.md). Write the RLS tests before writing the UI that depends on them.
- Secrets in environment variables only. Add gitleaks and `npm audit` to CI.
- Security headers on the Vercel config.

Exit: a stranger can sign up, verify their email, reset a password, and see only their own data. A second test account cannot read the first one's rows.

### Phase 2: The real model library (about 2 weeks)

Goal: replace silhouettes and placeholders with actual models.

- Produce 6 models following MODEL_SPEC.md. Start with two and check them before making the rest. Fixing a bad identity after four more are built on it costs a lot.
- Upload to a private bucket, serve through signed URLs and a CDN for public previews.
- Move the mock list to the `models` table. The gallery reads from the API.
- Write bios and personalities with the copy rules in AI_RULES.md.

Exit: the gallery shows real faces and sample clips, and a realism review of the samples averages 4 or more.

### Phase 3: Generation (about 3 weeks)

Goal: a script goes in, a believable video comes out.

- Provider adapter with a mock and a real implementation, switched by `USE_MOCK_VIDEO`.
- Job table, a worker that processes jobs, retries with backoff, and idempotency keys so a retry never produces a second charge.
- Moderation before generation (script) and after (output).
- Stitching for clips longer than the provider allows. Captions and light post-processing (grain, subtle shake).
- Credits and rate limits.
- Realism bake-off before committing: same three scripts, two or three providers, scored blind.

This is the phase most likely to overrun. Provider quality and limits are unknowns until we test them, so run the bake-off in the first two days.

Exit: 20 test videos pass the realism bar in PRD section 8, and the failure rate on a hundred runs is under 5%.

### Phase 4: Your own twin (about 3 weeks)

Goal: consent-based twin creation, end to end.

- Consent screen and the consent record table.
- Liveness and face-match through a verification vendor, behind an adapter like everything else.
- Upload pipeline with type checks, size limits, malware scanning, and metadata stripping.
- Processing flow, owner-only access, and full deletion.
- Manual review queue for flagged matches.

Get legal sign-off on the consent text and retention before this phase ships, not after.

Exit: a tester creates a twin, generates with it, and deletes it, and a storage check confirms nothing is left behind. A second account cannot use that twin.

### Phase 5: Hardening and launch (about 2 weeks)

Goal: be ready for strangers.

- Walk the THREAT_MODEL.md table and close or consciously accept every high item.
- Run through SECURITY_CHECKLIST.md. External penetration test if budget allows, a thorough self-review with ZAP and manual abuse testing if not.
- Load test generation with a realistic burst.
- Monitoring, alerts, and a written incident response contact list.
- Soft launch to a small invited group before opening up.

Exit: every launch item in the checklist is ticked or has a written exception with a name next to it.

## Timeline at a glance

| Phase | Weeks | Cumulative |
|---|---|---|
| 1 Foundations | 1 | 1 |
| 2 Model library | 2 | 3 |
| 3 Generation | 3 | 6 |
| 4 Twin creation | 3 | 9 |
| 5 Hardening and launch | 2 | 11 |

Call it 11 to 13 weeks with slack. Phases 2 and 3 can overlap once the provider is chosen.

## What could derail this

| Risk | What we'd see | What we do |
|---|---|---|
| Provider can't hold a consistent face | Same model looks different across clips | Test with reference images early, switch provider or use image-to-video |
| Cost per video too high | Bake-off numbers don't fit a price people accept | Shorter clips, lower resolution preview, credit packs |
| Legal pushes back on the twin flow | Consent or retention text rejected | Ship the library first, hold twins until cleared |
| AI Studio export drifts from the docs | Folder layout and docs disagree | Update README layout section after each export |
| Scope creep | New pages and animations nobody asked for | Hold the PRD non-goals list, push new ideas to P2 |

## Decisions already made

- Light mode uses the peach, lavender and coral palette. Dark mode uses the warm brown theme.
- Landing page is information only. Tools live on their own pages.
- Mock first, behind `lib/api`, so swapping is a one-file change.
- Text-only hero for now. A hero image can return later as a plain asset.
- Models are synthetic first. Twin creation comes after the library works.

## Definition of done for any task

Works in light and dark. Works at 360, 768 and 1280 px. Has loading, empty and error states. Uses tokens only. No new dependency without a note on why. Docs updated if behavior changed.
