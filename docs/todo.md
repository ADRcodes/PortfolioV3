# PortfolioV3 Todo

Last updated: 2026-10-15

Use this file for actionable implementation tasks. `DO` and `NEXT` should complete exactly one unchecked item, then update this file and `memory-bank/progress.md`.

## Completed October 15, 2026

- [x] Fix route scroll positioning while preserving browser history and section links.
- [x] Fix contact field accessibility without changing the approved appearance.
- [x] Prevent overlapping contact submissions and edits being cleared during a pending send.
- [x] Sync README, deployment documentation, roadmap, and project history with the reviewed implementation.

## Ready

- [ ] Audit all pages at mobile and desktop widths and fix any layout overflow or awkward typography.
- [ ] Polish the hiRAG case study copy around problem, approach, constraints, outcome, and lessons learned.
- [ ] Replace AI Consulting placeholder images with intentional visuals or project-specific assets.
- [ ] Add richer case-study detail for Out & About Events.
- [ ] Add richer case-study detail for Portfolio / AI Dev Workflow.
- [ ] Add a lightweight post-build route smoke check for the main pages and project detail routes.
- [ ] Review the EmailJS contact form for spam protection and public configuration risk.
- [ ] Add a concise technical note or source link for the Pretext playground demo.
- [x] Reconcile brand documentation: use `PRODUCT.md` for positioning/voice/references and `DESIGN.md` for visual/interaction guidance.

## Deferred Review Follow-Ups

- [ ] Revisit project browsing with direct selection and a reduced-motion alternative.
- [ ] Add a general page-not-found route after the user confirms the proposed behavior.
- [ ] Restrict immutable caching to versioned assets; add deployment serialization and smoke checks.

## Blocked Or Needs Decision

- [ ] Confirm whether hiRAG should be publicly demoable, privately described, or linked only through screenshots.
- [ ] Confirm whether the AI Consulting page should remain service-oriented or become a direct offer page with pricing/packages.
- [ ] Confirm whether deployment should remain S3/CloudFront only or add preview deployments later.

## techNL Summit foundation (October 16, 2026)

- [x] Add an isolated `/technlsummit` application, directory/detail routes, automatic JSON session loading, publication filtering, relationship validation, sample content and neutral responsive styling.
- [ ] Replace all summit demonstration content with verified conference information; confirm schedule/timezone and public recording links.
- [x] Redesign the Summit as a time-aware, scrollable agenda with session cards, quick navigation, mobile controls and a consistent independent visual identity.
- [ ] Prepare summit launch metadata after real content is verified; add a portfolio homepage link only when launch is authorized.

## Summit editorial implementation

- [x] Implement the approved article schema/rendering, preserve legacy content and publication filtering, validate with automated/browser tests and document the final ChatGPT publishing contract.

## Summit browser workflow and focused polish (October 17, 2026)

- [x] Document the Playwright MCP browser workflow and improve the session picker's mobile height and independent list scrolling, with rendered desktop/mobile verification.


## Summit editorial motion redesign (October 17, 2026)

- [x] Rework the Summit around the Zajno-inspired editorial layout and continuous card-to-detail transition, preserving shared title/facts, reverse navigation, mobile controls and reduced-motion behavior.


## Summit navigation and readability (October 17, 2026)

- [x] Enlarge supporting type, remove purple and the preview banner, promote TechNL Summit 2026 branding, consolidate navigation around the agenda, move Up next into the nav and add independent shared-name profile links in card/detail metadata without an aside.


## Summit colour and welcome composition (October 17, 2026)

- [x] Restore colour without purple, soften the dark canvas, unify the welcome/title/date shortcuts into one viewport-height section, remove redundant labels and tighten page-top/session-header spacing.


## Summit official programme (October 17, 2026)

- [x] Import the official October 19–20 programme with linked presenters/organizations, source notes and upcoming publication status.
- [x] Remove fictional demo sessions and move Will’s editorial test article to October 21, retaining its source-date disclosure.
- [ ] Recheck the organiser’s agenda for last-minute changes before launch.

- [x] Enrich Summit profiles with the official speaker portraits, available biographies, matching company logos and sourced organization context.

- [x] Combine speaker portraits/names/companies in session metadata; add speaker-directory photos, session links, LinkedIn icons and name/company sorting, plus profile back links.

- [x] Research missing Summit speaker bios from public LinkedIn/official profiles and replace all real organization placeholders with sourced short descriptions.


## Summit agenda density and quick scrolling (October 17, 2026)

- [x] Compress agenda cards and presenter metadata, show start/end times once in an unbroken rail, replace time/location labels with accessible icons and add sticky date/session scrubbing with keyboard support, scroll tracking and reduced motion.


## Summit scrolling identity and parallel sessions (October 17, 2026)

- [x] Choreograph the intro identity into the header, correct techNL/year styling, simplify/link Alex's signature, defer quick-scroll controls until the first event passes and group simultaneous sessions into responsive desktop grids/mobile carousels.


## Summit message, directory and profile refinement (October 17, 2026)

- [x] Refine/right-align the personal note and closing, cover quick-scroll edges, tighten affiliations and clarify carousel controls; add sticky speaker sort buttons/large portraits/full desktop bios; redesign both profile types with history Back and associated speaker photos; add company-directory logos and clear detail links.

- [x] Enlarge Summit portraits/logos and replace standalone Back rows with an animated header arrow on non-agenda routes.


## Summit compact layouts and mobile controls (October 18, 2026)

- [x] Make session/speaker intros flush and full width, arrange presenters in responsive grids, compact speaker rows, refine the correction-contact footer and move the one-line mobile quick-scroll toolbar above navigation.

## Summit launch functionality (October 18, 2026)

- [x] Classify events, isolate external editorial tests/demo directories, prioritize current/parallel events, add latest conference notes, agenda filtering, directory search, public session sharing and intro facts; verify and investigate sharing previews without deployment changes. See `src/summit/LAUNCH_FUNCTIONALITY.md`.

## Summit content and directory refinement (October 18, 2026)

- [x] Clean the external editorial sample's metadata; add a coming-notes introduction; prepare compact directories/shared sticky tools, logo background hints/provenance and revised intro structure; preserve complete profiles, search, sorting, agenda relationships and existing animations. See `src/summit/REFINEMENT_HANDOFF.md`.
