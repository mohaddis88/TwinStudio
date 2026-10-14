# Product Requirements: TwinStudio

*Owner: Alamin. Last updated: 13 Oct 2026. Status: draft for supervisor review.*

## 1. The short version

Marketers need UGC-style video, and shoots are slow and costly. TwinStudio gives them a library of AI creators that pass as real people on a phone screen. They pick one, paste a script, and download a finished 9:16 video. If they want their own face and voice in the library, they can create a twin, with explicit consent, usable only by them.

The product lives or dies on how human the videos look. Everything else is supporting cast.

## 2. Problem

A small business in Kuala Lumpur wants twelve short product videos a month. Hiring a creator costs real money per video, needs a booking, a shoot day and a round of edits. Stock avatars are cheap but look like stock avatars: glassy skin, a frozen stare, a voice that never takes a breath.

Agencies have the same problem at larger volume. And creators have a different one: they would like to scale their face without standing in front of a camera forty times a week.

## 3. Who it's for

**Aisha, runs a skincare shop.** Posts on TikTok and Instagram, no video skills, no budget for a studio. Wants something that looks like a customer talking to a phone. Won't read a manual.

**Daniel, producer at a small agency.** Needs variety across clients: different ages, languages, vibes. Cares about consistency (same face across a campaign) and turnaround. Will notice every flaw.

**Mei, a creator.** Has an audience, wants a twin that works while she doesn't. Cares a lot about control: where her likeness appears, who can use it, and how to delete it.

Aisha is the design target. If Aisha can finish a video without help, Daniel and Mei will manage.

## 4. Goals

1. A first-time visitor can pick a model and get a video in under five minutes, without reading instructions.
2. Videos are rated human-looking by reviewers (see section 8).
3. Anyone can create a twin knowingly and safely, and remove it again.
4. We never become the easy way to fake someone else.

## 5. Non-goals

For this version we are not building: a video editor, multi-scene storyboards, team workspaces, a marketplace where twin owners get paid, live avatars for video calls, or auto-posting to social platforms (that's PostPilot's job). Some of these may come later. None are needed to prove the idea.

## 6. How people use it

```
Browse models  ->  pick one  ->  write or paste script  ->  choose a style  ->  generate  ->  download MP4
```

Users never see a prompt. Behind each model sits a fixed identity: reference images, a voice, and a hidden character description. The platform feeds those into the video provider every time, so the same person comes back.

For people who prefer their own generator, each model has an optional character kit: front, side, up and down images, a voice sample, and a copy-ready prompt block. It's a secondary path. Most users won't touch it.

Creating a twin follows the same flow after one extra step: upload photos and a voice sample, give consent, pass a liveness check, wait for processing.

## 7. Features

P0 means the product doesn't make sense without it. P1 is next. P2 can wait.

| # | Feature | Priority | Notes |
|---|---|---|---|
| 1 | Model library with filters (gender, niche, language) | P0 | Compact cards, 2 per row on mobile, 5 on wide screens |
| 2 | Model profile (looks, sample videos, voice, bio) | P0 | One tab visible at a time |
| 3 | Studio: script, style, generate, download | P0 | Styles: selfie, talking head, product demo |
| 4 | Sign up, sign in, Google, forgot password, email verification | P0 | Required before Studio |
| 5 | AI-generated label on every model and video | P0 | Visible, not hidden in settings |
| 6 | Content moderation on scripts and outputs | P0 | Blocks impersonation, scams, harmful content |
| 7 | Create your twin with consent and liveness | P1 | Consent record stored with every twin |
| 8 | Twin deletion, including all source files | P1 | Must work from the UI, no email needed |
| 9 | Character kit download | P1 | Images, voice sample, prompt block |
| 10 | "Help me write it" script assistant | P1 | Short, spoken-style scripts only |
| 11 | Usage credits and limits | P1 | Protects us from cost spikes and abuse |
| 12 | Video history with re-download | P1 | Kept for a set period, see DATA_SECURITY |
| 13 | Multi-language voice (English, Bahasa Malaysia, Mandarin first) | P1 | More later |
| 14 | Teams and shared libraries | P2 | |
| 15 | Payments | P2 | Decide pricing after we know real cost per video |

## 8. What "human-looking" means

This is the part most likely to fail, so it gets numbers.

A reviewer watches a clip and scores five things from 1 to 5: blinking and micro-expressions, lip sync, skin and hair, voice (pauses, breaths, pace), and camera feel (handheld, real room, real light). A clip counts as passing when the average is at least 4 and no single score is below 3.

Launch bar: at least 80% of a 20-clip test set passes, scored by three people who didn't make the clips. We also run a side-by-side against ProxifAI's public samples and want to win more than we lose. If we don't, we fix the pipeline before adding features.

Rules of thumb that tend to help: short clips stitched together (under 10 seconds each), handheld framing, uneven pacing, ordinary rooms, and scripts written like speech.

## 9. Twin creation requirements

Consent is the whole point of this feature, so it isn't a checkbox buried in a form.

- The person uploading must be the person in the photos. A liveness step (read a random phrase on camera) and a face match against the uploads are required.
- Consent is explicit, in plain language, with its own screen. We store who agreed, when, which version of the text, and the IP and device summary.
- A twin is private by default. Only its owner can generate with it.
- The owner can delete the twin and every source file at any time. Deletion starts immediately and finishes within 30 days at the latest (backups included). Proposed, pending legal review.
- Under-18s can't create twins.
- We refuse celebrity and public-figure likeness. If a match is suspected, the twin goes to manual review.

## 10. Success metrics

Targets are placeholders until we have real traffic. The list matters more than the numbers.

| Metric | Why | Starting target |
|---|---|---|
| Time from landing to first downloaded video | Measures how easy it is | Median under 5 min |
| Videos passing the realism review | Measures the core promise | 80% |
| Share of generations that fail or get blocked | Measures reliability and moderation noise | Under 5% |
| Twin creation completion rate | Measures consent flow friction | Over 60% |
| Cost per finished video | Decides whether this can exist | Set after provider pricing is known |
| Takedown or abuse reports per 1,000 videos | Measures safety | Trending down |

## 11. Risks

The big one is misuse. A tool that makes convincing videos of people attracts people who want convincing videos of other people. Our answer is a mix of product decisions (verification, private twins, labels), moderation, and logs good enough to investigate a complaint. THREAT_MODEL.md goes through it.

The second is cost. Video generation is the most expensive thing we do. Credits and per-user limits are in the plan from day one, not bolted on after the first surprise bill.

The third is the uncanny valley. If outputs look off, users leave and no UI polish rescues it. That's why realism has its own acceptance test.

## 12. Prototype vs production

The prototype proves the experience: pages, flow, tone, motion. It uses mock data, a fake auth module and a pre-rendered clip. Production replaces each of those behind the same function calls in `lib/api`. PLAN.md has the order.

## 13. Open questions

1. Which provider produces the best realism for the money, and can it hold a consistent face from reference images? Needs a bake-off with the same three scripts across providers.
2. How do we handle a twin owner who wants to restrict use (for example, no political content)? Content rules per twin may be needed.
3. Do we allow users to upload a voice sample on its own, without a face? Voice cloning of a non-consenting person is its own abuse route.
4. Is a watermark on every video acceptable commercially, or is a metadata-only label enough? Needs a legal and brand decision.
5. What happens to a twin when an account is closed? Proposal: deleted with the account.
