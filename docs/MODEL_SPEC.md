# Model spec: what to make for every AI model

*Last updated: 13 Oct 2026.*

You'll be creating the models yourself, and this is the checklist that keeps them consistent. A model is more than a pretty face. It's a package: a face from several angles, a voice, a personality, and a hidden description that the pipeline feeds to the provider every single time.

Make two models first. Check them. Then make the rest. Fixing a flawed template after six models exist is miserable.

## The package

| Item | Needed | Notes |
|---|---|---|
| Identity sheet | Yes | Front, left side, right side, three-quarter, looking up, looking down. Neutral expression, even light, plain background |
| Expression set | Yes | Smile, laugh, serious, surprised, thinking. Same face, same light |
| Full upper-body shot | Yes | Shoulders and hands visible, for gesture reference |
| Everyday-setting shots | 3 | Kitchen, desk, outdoors. Phone-camera look, not studio |
| Voice | Yes | One voice id per language. A 10 to 20 second reference sample |
| Sample videos | 3 | Selfie, talking head, product demo. 8 to 15 seconds each |
| Bio | Yes | Two lines, plain words |
| Personality | Yes | Three traits, one speaking habit |
| Languages | Yes | Only list a language if the voice and lip sync have been tested in it |
| Hidden character prompt | Yes | See template below. Never shown to the user |
| License note | Yes | Where the face came from and that it isn't a real person |

## Making the face

Generate in Flow (as for the Task 3 avatar), then lock the identity: pick one hero image and use it as the reference for every other angle. Compare each new angle against the hero image before accepting it. Reject anything with a different jaw, eye spacing, or hairline, even if it looks nice by itself.

Make people who look like people. Slight asymmetry, visible pores, a few flyaway hairs, tired eyes at the end of the day. Avoid the glossy, airbrushed look. If you showed the image to a friend and they said "that's AI" in under three seconds, it needs another pass.

Variety on purpose: across the library, vary age, ethnicity, build, hair, and style. Don't make six versions of one attractive twenty-eight-year-old.

No real person's likeness. Don't prompt with a celebrity's name, and run a reverse image search on each hero image before approving it, to make sure it doesn't accidentally resemble someone identifiable.

## Making the voice

Pick or design a voice that matches the face's age and personality. Test it on three scripts: a product pitch, a casual story, and a short question. Listen for breaths and uneven pacing. If the voice reads like a news anchor, it will break the illusion even when the face is perfect.

For each language, test mouth shapes on hard sounds (B, P, M, F, V). Bad lip sync on those is the first thing viewers notice.

## Character prompt template

This text is stored in `models.character_prompt` and sent to the provider with the reference images. Keep it factual and specific.

```
Identity: [name], [age range], [ethnicity or heritage if relevant to look], [build].
Face: [face shape], [eye shape and color], [brows], [nose], [lips], [skin tone and texture].
Hair: [color, length, style, usual parting].
Distinguishing details: [mole, dimple, small scar, glasses, earrings].
Wardrobe defaults: [two or three usual outfits].
Manner: [how they move and speak: quick hands, head tilts, laughs easily].
Always: natural skin texture, natural blinking, handheld phone-camera feel, ordinary room, soft daylight.
Never: airbrushed skin, studio lighting, perfect symmetry, exaggerated expressions, text overlays.
```

## Bio and personality: how to write them

Two lines for the bio. State what they do and what they're like, with one specific detail.

Good: "Shares gadget reviews from a cluttered desk in Subang. Talks fast, laughs at her own jokes."

Weak: "A passionate tech creator who delivers engaging and authentic content."

Traits: three words max, and at least one should be a little unexpected. "Dry-humored" tells a marketer more than "friendly".

## File naming

```
models/<slug>/identity/front.webp
models/<slug>/identity/side-left.webp
models/<slug>/identity/side-right.webp
models/<slug>/identity/up.webp
models/<slug>/identity/down.webp
models/<slug>/expressions/smile.webp   (and the rest)
models/<slug>/samples/selfie.mp4
models/<slug>/samples/talking-head.mp4
models/<slug>/samples/demo.mp4
models/<slug>/voice/<lang>.mp3
models/<slug>/model.json               (bio, traits, languages, tags, prompt)
```

Images: WebP, 1600 px on the long side for identity shots, under 300 KB each for previews. Videos: MP4, 9:16, 1080x1920, under 8 MB for previews.

## QA before a model is published

- [ ] Same person in all angles (check against the hero image)
- [ ] Passes the five-point realism score at 4 or above
- [ ] Voice tested in every listed language
- [ ] Three sample videos that didn't need heavy fixing
- [ ] Reverse image search found no look-alike of a real person
- [ ] Bio and traits read like a person wrote them
- [ ] "AI-generated" label shows on the card and the profile
- [ ] Hidden prompt reviewed, with no real names or brands in it
- [ ] Files named and sized as above
