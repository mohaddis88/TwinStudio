# System design

*Last updated: 13 Oct 2026. Status: proposed. Read ARCHITECTURE.md first.*

This file is the detail behind the boxes: tables, endpoints, job states, limits and failure handling. Names are suggestions. Change them if the code reads better another way, and then fix this file.

## Data model

All tables live in Postgres with row-level security on. `user_id` always means `auth.users.id`.

```sql
-- Synthetic library (public read for published rows)
create table models (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  role text not null,                       -- "Tech UGC creator"
  gender text check (gender in ('female','male','nonbinary')),
  bio text not null,                        -- 2 lines
  traits text[] not null default '{}',      -- up to 3
  languages text[] not null default '{}',
  niches text[] not null default '{}',
  voice_id text,                            -- provider voice reference
  character_prompt text not null,           -- hidden, never sent to the browser
  status text not null default 'draft' check (status in ('draft','published','retired')),
  created_at timestamptz default now()
);

create table model_assets (
  id uuid primary key default gen_random_uuid(),
  model_id uuid references models(id) on delete cascade,
  kind text not null check (kind in ('front','side','up','down','expression','sample_video','voice_sample')),
  storage_path text not null,
  is_public boolean not null default false
);

-- A person's own twin
create table twins (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  display_name text not null,
  status text not null default 'draft'
    check (status in ('draft','pending_verification','pending_review','processing','ready','rejected','deleting')),
  voice_ref text,
  verification_ref text,                    -- vendor case id, not a face template
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table twin_assets (
  id uuid primary key default gen_random_uuid(),
  twin_id uuid references twins(id) on delete cascade,
  kind text check (kind in ('photo','voice','liveness_clip')),
  storage_path text not null,
  sha256 text not null,
  created_at timestamptz default now()
);

create table consents (
  id uuid primary key default gen_random_uuid(),
  twin_id uuid references twins(id) on delete cascade,
  user_id uuid references auth.users(id) not null,
  consent_version text not null,            -- which text they saw
  granted_at timestamptz not null default now(),
  ip_hash text,
  user_agent text,
  withdrawn_at timestamptz
);

-- Generation
create table videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  model_id uuid references models(id),
  twin_id uuid references twins(id),
  script text not null,
  style text not null check (style in ('selfie','talking_head','product_demo')),
  language text not null,
  status text not null default 'queued'
    check (status in ('queued','moderating','generating','postprocessing','ready','failed','blocked')),
  storage_path text,
  error_code text,
  credits_cost int not null default 1,
  idempotency_key text unique not null,
  created_at timestamptz default now(),
  expires_at timestamptz,
  check ((model_id is not null) <> (twin_id is not null))   -- exactly one
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references videos(id) on delete cascade,
  status text not null default 'queued',
  attempt_count int not null default 0,
  available_at timestamptz default now(),
  lease_expires_at timestamptz,
  last_heartbeat_at timestamptz,
  error_code text
);

create table credit_ledger (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  delta int not null,                       -- +grant, -reserve, +refund
  reason text not null,
  video_id uuid references videos(id),
  created_at timestamptz default now()
);

create table audit_log (
  id bigserial primary key,
  actor_id uuid,
  action text not null,                     -- 'twin.create', 'twin.delete', 'video.blocked'
  subject_type text,
  subject_id uuid,
  meta jsonb default '{}',
  created_at timestamptz default now()
);

create table reports (                       -- abuse and takedown requests
  id uuid primary key default gen_random_uuid(),
  video_id uuid references videos(id),
  reporter_email text,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz default now()
);
```

The `check` on `videos` matters: a video uses a library model or a twin, never both and never neither.

### Row-level security in one paragraph

Users read and write only their own `twins`, `twin_assets`, `consents`, `videos` and `credit_ledger` rows (`user_id = auth.uid()` or `owner_id = auth.uid()`). `models` is readable by everyone where `status = 'published'`, and `character_prompt` is hidden behind a view that leaves it out. `jobs`, `audit_log` and `reports` are not readable from the browser at all. The service role (server only) writes those. Every policy gets a test that signs in as user B and tries to touch user A's data.

## API

All endpoints are Edge Functions behind auth unless noted. JSON in, JSON out. Errors use the catalog further down.

| Method and path | Does | Notes |
|---|---|---|
| GET /models | List published models | Public, cached |
| GET /models/:slug | Model detail | Public, no hidden prompt |
| POST /videos | Create a video job | Needs credits and a verified email. Idempotency key required |
| GET /videos/:id | Status and signed URL when ready | Owner only |
| GET /videos | Own history | Paginated |
| DELETE /videos/:id | Delete a video and its file | Owner only |
| POST /twins | Start a twin | Rate limited |
| POST /twins/:id/uploads | Get a signed upload URL | Type and size set at signing time |
| POST /twins/:id/consent | Record consent | Needs the exact consent version |
| POST /twins/:id/verify | Start liveness and match | Returns vendor session |
| POST /webhooks/verification | Vendor callback | Signature checked, no user auth |
| DELETE /twins/:id | Delete twin and all assets | Starts the delete job |
| POST /reports | Report a video | Open to signed-in users and anonymous with a captcha |
| POST /scripts/suggest | Script assistant | Rate limited, moderated |

## Video job states

```
queued -> moderating -> generating -> postprocessing -> ready
                |            |              |
                v            v              v
             blocked       failed         failed
```

Each hop is written to the database before the next step starts, so a crash never leaves a job in an unknown place.

A worker claims a job by setting `lease_expires_at` a few minutes ahead and pinging `last_heartbeat_at` as it works. If a lease runs out without a heartbeat, another worker may take the job. Provider calls carry the job's idempotency key where the provider supports one, so a retry can't create a second paid clip.

After the retry limit (3 attempts, exponential backoff starting at 30 seconds) the job fails with a specific code, and the reserved credit goes back to the user.

## Twin states

```
draft -> pending_verification -> processing -> ready
              |                       |
              v                       v
          rejected               pending_review -> ready | rejected

any state -> deleting -> (gone)
```

`deleting` runs a job that removes storage objects, vendor cases, derived data and rows, then writes one audit entry that says it happened without describing who was in it.

## Credits and limits

Credits are a ledger, not a counter. Reserve on create (negative row), settle on success, refund on failure. The balance is the sum. This makes disputes easy to explain.

Starting limits, tunable:

| Limit | Value |
|---|---|
| Free credits at sign-up | 3 |
| Max script length | 600 characters |
| Concurrent jobs per user | 2 |
| Videos per user per day | 20 |
| Twin creations per user per day | 2 |
| Auth attempts per IP | 5 per 10 min |
| Script suggestions per user | 30 per hour |

## Storage layout

```
public-previews/models/<slug>/{front,side,up,down}.webp
public-previews/models/<slug>/sample-<style>.mp4
private-twins/<owner_id>/<twin_id>/{photo-1..5,voice,liveness}
private-videos/<user_id>/<video_id>.mp4
```

Private buckets have no public URL. Signed URLs last 60 seconds for twin assets and 10 minutes for the user's own videos, long enough to play and download.

## The generation pipeline in detail

1. **Validate.** Length, language, style, ownership of the twin, credits.
2. **Moderate the script.** Block impersonation of real people, scams, explicit content, harmful claims (medical, financial), hate. Unclear cases go to a stricter pass, then to a human queue if we have one.
3. **Build the request.** Model's hidden character prompt plus reference images, voice, the user's script, style template (framing, lighting, handheld feel).
4. **Generate clips.** If the provider limits clip length, split the script on sentence breaks and generate each clip with the same references.
5. **Check output.** Automated checks (face present, duration, aspect ratio 9:16), plus an output moderation pass.
6. **Post-process.** Stitch, add captions, light grain and micro-shake, loudness normalize.
7. **Store, mark ready, settle credit, write audit entry.**

Realism lives mostly in steps 3 and 6. Keep both as small configuration objects (`styles/selfie.json`) so tuning doesn't mean redeploying code.

## Error catalog

Every error has a stable code and a plain-language message with one next step. The UI never shows the code unless the user opens "Details".

| Code | Message the user sees | Next action |
|---|---|---|
| SCRIPT_TOO_LONG | Your script is a bit long. Keep it under 600 characters. | Edit script |
| SCRIPT_BLOCKED | We can't make a video from this script. It may copy a real person or break our rules. | Edit script, see rules |
| NO_CREDITS | You've used all your credits. | Get more credits |
| GENERATION_FAILED | Something went wrong creating your video. Your script is saved and you haven't been charged. | Try again |
| PROVIDER_BUSY | We're busy right now. We'll keep trying and email you when it's ready. | Wait or leave |
| PHOTO_TOO_DARK | That photo is too dark. Try one taken near a window. | Upload again |
| PHOTO_NO_FACE | We couldn't find a face in this photo. Use a clear, front-facing one. | Upload again |
| LIVENESS_FAILED | We couldn't confirm it's you. Try again in good light and read the phrase aloud. | Retry |
| TWIN_REVIEW | Your twin is being checked by our team. This usually takes about a day. | Wait |
| SESSION_EXPIRED | You've been signed out. Sign in to continue. | Sign in |
| RATE_LIMITED | Too many tries. Wait a minute and try again. | Wait |

## Failure modes

| What breaks | What happens | Why that's acceptable |
|---|---|---|
| Browser closed mid-generation | Job keeps going, video shows in history | State is server-side |
| Worker crashes | Lease expires, another worker takes over | Idempotency key prevents a double charge |
| Provider down | Jobs retry with backoff, then fail with refund | User is told plainly |
| Webhook arrives twice | Second one is ignored (same event id) | Handlers are idempotent |
| Webhook never arrives | A sweep re-checks pending verifications hourly | No twin gets stuck forever |
| Storage delete fails | Delete job retries, alerts after 3 failures | Deletion is a promise we made |
| Credit ledger and video disagree | Nightly reconcile job flags mismatches | Money problems get noticed |

## Observability

Structured logs with a request id on every line and no personal data in them (no scripts, no emails, no file names). Metrics: job queue depth, time in each state, failure rate by code, provider latency, cost per video. Alerts on: failure rate above 10% over 15 minutes, queue older than 10 minutes, any delete job failing, any spike in blocked scripts from one account.

## Front-end rules that touch system design

All data calls go through `lib/api`. Components never call fetch directly. Every list handles empty, loading and error. Polling for job status uses an increasing interval (2s, 4s, 8s up to 15s) and stops when the tab is hidden. Pages are lazy-loaded by route.
