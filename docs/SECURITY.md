# Security

*Last updated: 13 Oct 2026. Applies to production. The prototype fakes several of these on purpose, and the last section says which.*

TwinStudio holds faces and voices. Leak a password database and people reset their passwords. Leak a face and there's no reset. That fact shapes how strict we are here.

Related: DATA_SECURITY.md (what we keep and for how long), THREAT_MODEL.md (what can go wrong), SECURITY_CHECKLIST.md (tick-boxes).

## Principles

1. Least privilege, everywhere. Users see their rows. The browser holds no secrets. Workers get only the keys they need.
2. Deny by default. Row-level security is on for every table, and a missing policy means no access.
3. Don't build what you can rent safely. Auth, payments, liveness and malware scanning come from services that do nothing else.
4. Treat all input as hostile: forms, files, file names, scripts, webhooks, and the text inside images.
5. Keep less. Data we never stored can't leak.
6. Log enough to investigate, never enough to expose.

## Accounts and sessions

Supabase Auth handles sign-up, sign-in, Google OAuth, email verification, password reset and sessions. We don't write our own password code.

- Passwords: at least 10 characters, no composition rules, check against known-breached lists, allow long passphrases and password managers.
- Email must be verified before a user can generate videos or create a twin.
- Password reset links are single-use and expire in 30 minutes. The response to "forgot password" is identical whether or not the account exists.
- Wrong credentials get one generic message. No "no account with that email".
- Rate limit sign-in and reset (5 attempts per 10 minutes per IP and per account), with a captcha after repeated failures.
- Sessions: short-lived access tokens, refresh token rotation, sign-out revokes the session. Sensitive actions (delete twin, delete account) ask for a recent sign-in.
- Multi-factor authentication is planned for Phase 5 and required for anyone with admin access from day one.
- Google OAuth: request only email and profile scopes. Validate the redirect URL against an allow-list.

## Authorization

Every table has policies. The patterns:

- Owner rows: `user_id = auth.uid()` for read and write.
- Public rows: published models only, through a view that hides the hidden prompt.
- Server-only tables (jobs, audit log, reports): no browser access at all.

Each policy has an automated test that signs in as a second user and tries to read, update and delete the first user's data. If one of those tests passes when it should fail, the release stops.

Check ownership on the server too. A policy is the last line of defense, so don't make it the only one: every function that takes an id checks that the caller owns it.

Admin tools, when they exist, live behind a separate role with MFA and an audit entry for every action.

## Uploads

Uploads are the riskiest feature after generation itself.

- Files go straight to a private bucket through a signed upload URL. The URL fixes the path, max size and content type.
- Allow-list: JPEG and PNG for photos (10 MB max), MP3 and WAV for voice (20 MB max), MP4 and WebM for liveness clips (50 MB max). Reject by content sniffing, not by extension.
- Re-encode images on the server to strip metadata (GPS, device, timestamps) and neutralize embedded payloads.
- Scan every file with a malware scanner before it can be used.
- Random object names. Never use the uploaded name in a path.
- Cap the number of files per twin and total storage per user.
- Never serve user uploads from our main domain with executable content types. Set `Content-Disposition` and `X-Content-Type-Options: nosniff`.

## API and server code

- Validate every body with a schema. Reject unknown fields.
- Parameterized queries only. No string-built SQL.
- Idempotency keys on anything that costs money.
- Rate limits per user and per IP on every endpoint, with tighter ones for auth, uploads and generation.
- Webhooks verify a signature and a timestamp, and reject replays. Handlers are idempotent.
- Return generic errors to the client and specific ones to the logs.
- CORS: our own origin only.
- No server-side fetch of user-supplied URLs. If we ever need one, it goes through an allow-list to prevent SSRF.

## Secrets

- Environment variables only. Never in the repo, never in the front-end bundle, never pasted into a chat tool.
- Anything prefixed `VITE_` (or `NEXT_PUBLIC_`) ends up in the browser. Only the Supabase URL and anon key belong there.
- The service-role key lives in server functions and nowhere else.
- In AI Studio exports, the Gemini key can end up in client code. Before any real deploy, move that call into a server function and rotate the key.
- Separate keys for local, preview and production. Rotate on a schedule and immediately after any suspected exposure.
- Run gitleaks in CI and as a pre-commit hook.

## Browser hardening

Set these headers on every response (Vercel config):

```
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://*.supabase.co; media-src 'self' https://*.supabase.co; connect-src 'self' https://*.supabase.co; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(self), microphone=(self), geolocation=()
```

Camera and microphone are allowed for our own origin because liveness needs them. Tighten the CSP once you know exactly which fonts and scripts the app loads. Never render user text as HTML. Our own pages escape by default, so don't turn that off.

## Dependencies and supply chain

- Commit the lockfile. Pin exact versions. Use `npm ci` in CI.
- Turn on Dependabot or Renovate, and read the diffs.
- `npm audit` in CI. High and critical findings block a merge unless someone writes down why not.
- Avoid packages with a few downloads and one maintainer for something we can write in twenty lines.
- Wait about two weeks before adopting a brand-new release of a critical package.
- Review any AI-suggested dependency like a stranger's pull request.

## AI-specific security

- The script assistant and moderation prompts treat user text as data. Delimit it, don't concatenate instructions into it, and never give the model tools it doesn't need.
- Model output is untrusted too. Escape before rendering. Don't let a model's reply trigger an action without server-side validation.
- Provider keys have spending caps and alerts.
- Per-user credits and daily limits stop a stolen account from running up a bill.
- The hidden character prompt never leaves the server.

## Monitoring and response

Alert on: spikes in failed sign-ins, many twin creations from one account or IP, many blocked scripts from one account, a jump in generation cost, any storage-delete failure, any service-role key use from an unexpected place.

When something goes wrong: contain first (revoke keys, disable the feature), then work out what was touched, then notify affected people and, where law requires, the regulator, then write down what we changed. Keep a short contact list (developer, supervisor, legal, hosting support) where it can be found at 2 a.m.

Add a `security.txt` and a monitored address for reports. Reply to every report within 72 hours.

## Abuse handling

Anyone can report a video. Reports go to a queue, a human looks, and takedown happens quickly for impersonation or non-consensual content. Repeat offenders lose access. We keep the evidence needed to respond to a complaint (video, script hash, account, time) for the retention period in DATA_SECURITY.md.

## What the prototype fakes

So nobody mistakes it for the real thing: sign-in accepts anything and stores nothing, Google sign-in is a stub, uploads never leave the browser, liveness is an animation, consent isn't recorded, rate limits and moderation don't exist, and there's no backend to attack. Don't put real people's photos or voices in the prototype, and don't put it on a public URL with a real API key.
