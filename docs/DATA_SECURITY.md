# Data security

*Last updated: 13 Oct 2026. Retention periods and the processor list are proposals. They need legal and supervisor sign-off before launch.*

Not legal advice. We operate from Malaysia, so the Personal Data Protection Act 2010 applies, including its recent amendments (which, as far as I know, treat biometric data as sensitive, add breach notification, and require a data protection officer in some cases). Check the current text with counsel. If we accept users from the EU or elsewhere, their laws may apply too.

## The data we hold

| Data | Class | Where | Why we need it |
|---|---|---|---|
| Email, name, password hash | Personal | Supabase Auth | Accounts |
| Twin photos | Restricted (biometric) | Private bucket | Build the twin |
| Voice sample | Restricted (biometric) | Private bucket | Build the twin's voice |
| Liveness clip | Restricted (biometric) | Vendor, and a private bucket only if the vendor can't hold it | Prove the person is real |
| Face match result | Restricted | Database (result only, no template) | Decide approval |
| Consent record | Personal, legal | Database | Prove consent |
| Scripts | Personal, possibly business-confidential | Database | Generate, support, abuse checks |
| Generated videos | Personal (for twins) or Confidential | Private bucket | Delivery |
| Usage and credits | Internal | Database | Billing and abuse control |
| Audit logs | Internal | Database | Investigations |
| Library model assets | Public after approval | Public bucket | Gallery |

Restricted means the strictest handling: separate private storage, signed URLs only, nobody on the team browses it casually, and every access is logged.

## Collect less

We don't ask for date of birth beyond confirming age 18+, phone number, address, government ID (the verification vendor may see an ID if we choose a flow that uses one, but we don't receive or store it), or social media accounts. We don't store face templates or embeddings unless the generation provider forces us to, and if so, only for the life of the twin.

## Consent

Every twin has a consent record: who, when, the exact text version, and a hashed IP plus a device summary. The text says in plain words what we'll do (build a model of your face and voice, use it only for videos you create), what we won't do (use it for anyone else, train general models on it, show it in the gallery), and how to withdraw. Withdrawing consent starts deletion.

No dark patterns: consent is unticked by default, has its own screen, and declining it doesn't lock the person out of the rest of the product.

## Where data lives and how it's protected

- Encryption in transit (TLS everywhere) and at rest (the hosting platform's disk encryption).
- Twin files in private buckets with no public URL. Signed URLs of 60 seconds for twin assets.
- Access is by role. Only the service role touches Restricted data, and only from server functions. Humans don't get routine access.
- Backups are encrypted, kept for 30 days, and deletion requests are honored in backups by expiry, not by editing them.
- Production data never goes to a laptop or a preview environment. Test with fake data.
- Logs hold ids and codes, not scripts, emails, file names or face data.

## Retention and deletion

| Data | Keep for | Then |
|---|---|---|
| Twin source files | Until the owner deletes the twin or account | Delete files, vendor case, derived data |
| Liveness clip | Delete as soon as verification completes (target: within 24 hours) | Keep only the pass or fail result |
| Generated videos | 90 days, or until the user deletes them | Delete file, keep a minimal log line |
| Scripts | 90 days alongside their video | Delete |
| Blocked scripts and abuse evidence | 12 months | Delete, unless an investigation is open |
| Consent records | 7 years after the twin is deleted (legal proof) | Delete |
| Audit logs | 12 months | Delete or aggregate |
| Account data after account closure | 30 days grace, then delete | Delete |
| Backups | 30 days rolling | Expire |

Deletion has to be a real button, not an email. When someone presses it, the twin is unusable at once, storage objects and vendor records are removed within 30 days at the latest (most within minutes), and we write one audit entry saying it happened. A test confirms nothing is left in storage after a delete. If deletion fails, we alert and retry. The promise is on the screen, so it has to be true.

## People's rights

Users can see what we hold about them, correct it, export their videos and twin metadata, withdraw consent, and delete their account. We answer requests within 21 days or faster. A short "Your data" page in settings covers most of this without a support ticket.

## Third parties

Anyone who touches personal data is a processor and needs an agreement. Before launch, fill in this table with real vendors and check each one's terms on training, retention and region.

| Processor | What it receives | Why | To confirm before launch |
|---|---|---|---|
| Supabase | Everything we store | Database, auth, storage | Region, DPA, backup policy |
| Vercel | Web requests, static front end | Hosting | Region, DPA, log retention |
| Google (Gemini, Veo) | Scripts, model reference images, twin images when generating | Video and text generation | Whether our data is used for training, data retention, region |
| Voice provider (for example ElevenLabs) | Scripts, voice samples | Speech | Voice-cloning terms, retention, deletion API |
| Verification vendor | Face images, liveness video, ID if used | Identity check | Retention, region, biometric handling, deletion API |
| Email sender | Email addresses | Verification and reset mail | DPA |

Cross-border transfers: servers and vendors may sit outside Malaysia. Record where, and make sure the legal basis for each transfer is documented.

No user upload is used to train anything except that user's own twin. If a provider's default terms say otherwise, we don't use that provider for twin data, or we use the plan that turns it off.

## Special cases

Minors: twin creation requires 18 or over. If we learn an account belongs to a minor, we delete their twin data.

Public figures and look-alikes: we don't build twins of public figures. Suspected matches go to manual review, and anything we can't verify gets refused.

Deceased people: no twins of anyone who isn't alive and present to consent.

## If there's a breach

1. Contain: revoke keys, disable the affected feature, snapshot logs.
2. Scope: which data, whose, since when.
3. Decide on notification. Under the amended PDPA there is a notification duty to the regulator and, for significant harm, to affected people, within a short window. Confirm the exact timing with counsel ahead of time, not during the incident.
4. Tell people plainly what happened, what we hold, and what they can do.
5. Fix the cause and update THREAT_MODEL.md.

## Review

Re-read this file before launch, whenever we add a processor, and every six months.
