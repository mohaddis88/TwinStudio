# Security checklist

*Last updated: 13 Oct 2026. Tick the boxes. If you can't tick one, write the exception, the owner and the date it gets fixed.*

## Every pull request

- [ ] No secrets in the diff (gitleaks passes)
- [ ] No new dependency, or the reason is in the PR text and the version is pinned
- [ ] No hardcoded colors, so both themes still work
- [ ] No `VITE_` variable holds anything secret
- [ ] New data access goes through `lib/api`
- [ ] New inputs are validated on the server, not just in the form
- [ ] New table or column has a row-level security policy and a cross-user test
- [ ] Error messages are plain and don't leak internals
- [ ] No personal data in new log lines

## Every release

- [ ] `npm ci` and `npm audit` clean, or each finding has a written reason
- [ ] Build output scanned for keys (search the bundle for `AIza`, `sk-`, `eyJ`, and the service-role key name)
- [ ] Preview and production use different keys, databases and buckets
- [ ] Security headers present (check with a header scanner)
- [ ] Auth tests pass: wrong password, rate limit, reset link reuse, unverified email
- [ ] Cross-user tests pass for twins, videos, credits and consents
- [ ] Mock switches are off in production (`USE_MOCK_*=false`)
- [ ] Source maps aren't public unless that's a conscious choice
- [ ] Rollback plan is written down

## Accounts and sessions

- [ ] Email verification required before generation or twin creation
- [ ] Breached-password check on sign-up and reset
- [ ] Generic message for wrong credentials and for "forgot password"
- [ ] Reset links are single-use and expire
- [ ] Sign-out revokes the session
- [ ] Rate limits on sign-in, reset and sign-up
- [ ] Google OAuth redirect URLs allow-listed
- [ ] MFA enforced for every admin account

## Uploads and storage

- [ ] Buckets are private (except the approved public previews)
- [ ] Signed URLs are short-lived (60 seconds for twin files)
- [ ] File type and size enforced at signing time and checked again on receipt
- [ ] Images re-encoded, metadata stripped
- [ ] Malware scan runs before a file can be used
- [ ] Random object names, no user-supplied names in paths
- [ ] Per-user storage cap in place
- [ ] A test uploads a renamed `.exe` and a 200 MB image and both get rejected

## Generation and AI

- [ ] Script moderation runs before generation, output moderation after
- [ ] Hidden character prompt isn't in any API response
- [ ] User text is delimited and treated as data in every model call
- [ ] Provider keys have spending caps and alerts
- [ ] Credits reserve, settle and refund correctly (test a failed job)
- [ ] Per-user concurrency and daily caps work
- [ ] Every generated video and every model shows the AI-generated label
- [ ] Block and review decisions land in the audit log without storing script text
- [ ] Provider settings keep our data out of training (screenshot or doc link saved)

## Twins and consent

- [ ] Consent screen is separate, unticked by default, and shows the version
- [ ] Consent record written with version, time, hashed IP, device
- [ ] Liveness and face match required before a twin can generate
- [ ] Under-18 check in the flow
- [ ] Twin is usable only by its owner (test with a second account)
- [ ] Delete removes storage objects, vendor cases and rows (test it, then list the bucket)
- [ ] Liveness clips are removed within the stated window
- [ ] Manual review path exists for flagged matches
- [ ] Public-figure handling written down and tested with a few obvious cases

## Privacy and legal

- [ ] Privacy policy and consent text reviewed by someone qualified
- [ ] Processor list filled in with agreements, regions and training terms
- [ ] Retention periods in DATA_SECURITY.md match what the code actually does
- [ ] "Your data" page lets users export and delete
- [ ] Breach response contacts and notification timing agreed in advance
- [ ] Data protection officer decision made and recorded

## Infrastructure and monitoring

- [ ] Alerts for failed-login spikes, generation cost, failed deletes and queue age
- [ ] Logs hold ids and codes, with no emails, scripts or file names
- [ ] Backups run, are encrypted, and a restore has been tried once
- [ ] Service-role key exists only in server settings
- [ ] Abuse report form works and goes to a person
- [ ] `security.txt` and a monitored contact address are live

## Before launch

- [ ] Walk every row of THREAT_MODEL.md: closed, or accepted with an owner and date
- [ ] External penetration test, or a documented self-test with ZAP plus manual abuse testing
- [ ] Load test with a realistic burst of generation requests
- [ ] 20-clip realism review passed
- [ ] Soft launch with a small invited group first
- [ ] Someone other than the developer has read the security docs

## Useful commands

```bash
npm ci && npm audit --omit=dev
gitleaks detect --source . --no-banner
npx lighthouse https://your-preview-url --view
# OWASP ZAP baseline (needs Docker)
docker run -t zaproxy/zap-stable zap-baseline.py -t https://your-preview-url
```

## Cadence

Weekly: dependency updates and alerts review. Monthly: rotate anything that should rotate, check provider spend against budget, skim the audit log for odd patterns. Every six months: re-read all security docs, rerun the threat model, test a restore.
