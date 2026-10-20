# techNL Summit visual hierarchy review

Initial review branch: `refine/summit-visual-hierarchy` at `946ed17`. Baseline: production main `19c04c5`. The comparisons below document that first draft. The owner subsequently authorized publication after the personal-voice/right-alignment follow-up described below.

Open [the screenshot comparison](index.html) to switch between nine views at 1440 × 960, 390 × 844 and 320 × 844. Images are also linked directly by their before/after filenames. Screenshots use reduced motion for consistent static comparisons; normal-motion navigation was tested separately.

## Findings and decisions

The welcome scattered attention across the large identity, prominent event details, an oversized right-aligned note, two directions, a signature, the disclosure, the external event link and a relatively quiet bottom-left scroll action. Its forced full-viewport height left a large gap on phones. Recent notes had several similarly dense text blocks. Agenda card furniture (event type, publication status, room, names and affiliations) competed with titles. Mobile articles opened with large presenter tiles, requiring considerable scrolling before the article. Directory presentation links blended into biographies; desktop profile media consumed over half the composition.

The refinement preserves the palette, typeface, animated identity, agenda/carousel layout and editorial character. It changes prominence and grouping rather than replacing the design system.

## Homepage and copy

- Preserve the two-line techNL Summit identity; increase its phone scale without changing the identity animation implementation.
- Keep event date/location directly below it as quiet metadata.
- Opening purpose: **“Find your sessions. Catch up on the ideas.”**
- Primary button: **“Catch up on the sessions”**, scrolling and moving focus to recent notes. It uses published content availability, never browser time. With no notes, it becomes **“Explore the agenda”** and targets the agenda filters.
- Personal note: **“A personal companion I built for fellow attendees.”** Keep Alex’s linked signature and LinkedIn action.
- Disclosure: **“Independent and AI-assisted. Not affiliated with techNL.”** Existing article disclosures and footer independence/contact copy remain intact.
- Move **“Visit the actual event website”** to the footer as a secondary utility link.
- Remove the duplicate “Find your next session / Come back for the notes” instructions and “Scroll to see agenda” prompt.
- Add “Explore the agenda” and “All times Newfoundland” as a clear section boundary. Recent notes get one “Latest dispatch” label and a subordinate “All published notes” link. Shorten “Read complete notes” to “Read notes” and remove the repeated Newfoundland-time suffix from each recent timestamp; dates still use the existing Newfoundland formatter.

The opening falls from **62 to 41 words**. At the compared viewport heights, its height falls from **960 to 673px** on desktop and **844 to 609px** on a 390px phone. The phone CTA begins around **335px** down the page, and the start of actual notes is visible in the first viewport. It also remains visible at 320 × 568.

## Elsewhere

- **Recent notes:** one substantial cream lead story with a short, sentence-aware preview; two quieter headline/byline/date rows. Full overviews remain unchanged in articles. Separate the notes module from the agenda with whitespace, a rule and a clear heading.
- **Agenda:** give published status a high-contrast badge, remove redundant generated Panel/Workshop furniture, reduce the weight of presenter names, quiet rooms/affiliations and group presenters with one rule instead of a rule per person. Keep titles, time rail, simultaneous groups and every link/anchor.
- **Articles:** replace oversized presenter tiles with compact portrait/name/affiliation rows, making content reachable sooner. Keep title typography and responsive measures identical to the existing mobile card/detail pairing. Use a ruled, numbered takeaway section to break up substantial reading; no article prose, claims or quotations are shortened or rewritten.
- **Directories:** quiet biography previews and clearly group associated presentation links. Preserve sorting, search, names, portraits and full profiles. Company initials receive an intentional dark/apricot fallback instead of another pale empty tile; original artwork is unchanged.
- **Profiles:** rebalance desktop media/content proportions, retain the full biography with a readable measure, and add clear section boundaries between biography, perspectives and related sessions. Keep phone portrait geometry and profile links intact.

## Deferred deliberately

No content-schema, publication, deployment, routing, clock, carousel or shared-element-animation changes. No new imagery, promotional banners, gradients or animation. No automatic shortening of articles, research or quotations. No wholesale directory redesign, new article contents navigation, or new disclosure controls; these would increase interaction scope without being necessary for this pass. External-image availability and live rendering require a network-capable browser after review.

## Verification

- **80 Node content/library tests pass**, including publication filtering, no-perspective compatibility and the new primary-action fallback/footer-link checks.
- **Production build passes**, with the existing chunk-size warning.
- Chromium inspected home, notes, agenda, speaker/company directories, articles and speaker/company profiles at **1440, 390 and 320px** with no horizontal overflow or browser JavaScript errors.
- Verified the primary action’s focus destination, keyboard activation, reduced motion, all-notes link, agenda filtering, mobile carousel controls, animated card/detail/Back navigation, matched mobile title font/line-height and scroll restoration.
- Verified the primary label before, during and after the conference; current/up-next behavior remains on the existing separate navigation path.
- Sampled the animated identity at six scroll positions at all three widths: no overlapping words.
- Broader regression checks passed all **74 speaker profiles**, search by name/company, sort/query retention, company search, current notes filtering, legacy articles and portfolio routes.
- New primary action is **56px** tall; the secondary notes action is at least **44px**. Focus is visibly indicated. Selected contrast ratios: CTA text **10.38:1**, secondary text **6.64:1**, published badge **7.94:1**, room metadata **6.33:1**, CTA focus indicator against green **5.39:1**. This is targeted accessibility QA, not a claim of a complete accessibility audit.
- Git diff confirms content JSON, schemas, publishing instructions/pipeline and transition code are unchanged.
- Live desktop/mobile browser inspection was attempted but blocked by the cloud proxy (`ERR_TUNNEL_CONNECTION_FAILED`). External image hosts are similarly restricted; their loading is not claimed as verified. Screenshots compare two builds from the actual repository under matching conditions.

See [browser results](qa.json) and [identity/contrast/baseline results](extra-qa.json). To inspect the current working result locally: `pnpm build`, then `pnpm preview --host 127.0.0.1 --port 4178 --strictPort`, and open `/technlsummit`. The comparison gallery itself is a local review artifact, not shipped site UI.

## Personal-voice follow-up authorized for publication

Restored “I built this little companion to help us get more out of the Summit,” the practical two-line directions and “And, fittingly, built with AI.” Removed the generic left-hand purpose statement. The welcome, filled button, signature and disclosure now form one right-aligned group on desktop and mobile. The opening has 53 words, retaining the character of the original 62-word version while keeping the clearer primary action and content-sized layout.

Current screenshots: [1440px](published-home-1440.png), [390px](published-home-390.png), [320px](published-home-320.png). These supersede the initial after-home screenshots for the release. All 80 tests and the production build passed after merging the latest article/profile publications from main. Browser checks confirmed right alignment, no overflow, visible 56px CTA, focus/navigation, notes filtering and a usable action at 320×568. No browser JavaScript errors were observed. The owner explicitly requested pushing this version to main to assess it live.
