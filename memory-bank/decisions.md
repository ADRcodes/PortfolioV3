# PortfolioV3 Decisions

Last updated: 2026-10-15

## Product and Content

- Position the site around practical AI-powered web tools, not generic full-stack development.
- Treat hiRAG as the flagship AI systems project because it shows document ingestion, retrieval, grounded answers, and AWS implementation work.
- Keep AI consulting framed around small testable engagements: workflow mapping, retrieval prototypes, AI interface design, and build readiness.
- Keep older PortfolioV2 projects available, but use them as supporting evidence rather than the main positioning.
- Use Playground for experiments that show interface curiosity or technical exploration.
- Present projects as case studies, not simple portfolio cards, where project substance supports that depth.

## Architecture

- Use Vite + React as the static app foundation.
- Use React Router for client-side routing.
- Keep the portfolio static-first. Do not introduce backend infrastructure for the portfolio unless a future requirement demands it.
- Keep project content primarily in `src/data/projects.js`; use `src/data/projectPresentation.js` for presentation-specific mappings like preview images, paths, and notes.
- Use custom project detail rendering only when a project needs case-study depth, as hiRAG does.

- Handle route scroll centrally: start new pages at the top, restore known history-entry positions on Back/Forward, and honor section anchors.
- Keep contact phrase fields visually unchanged; use accessible names, required state, email input mode, and a request lock that lasts until settlement.

## Design

- Keep the current warm technical visual language: paper background, ink text, moss/clay accents, soft borders, and restrained motion.
- The site should feel calm, technical, thoughtful, warm, and slightly playful.
- Avoid corporate stock-site aesthetics, generic developer templates, excessive AI buzzwords, overly dark cyberpunk styling, excessive animations, and visual clutter.
- Use large editorial typography for main pages and tighter typography inside cards, tool surfaces, and dense sections.
- Prefer concrete project screenshots and useful visuals over generic decoration.
- Avoid turning the site into a marketing landing page. The first screen should feel like the portfolio itself.

- `PRODUCT.md` owns audience, voice, personality, and inspiration references; `DESIGN.md` owns visual and interaction guidance. Reuse these rather than duplicate them in `docs/brand.md`.
- October 15: preserve the approved contact contrast and appearance at the user's request.

## Deployment

- Deploy the built `dist/` output to the S3 bucket `www.alexrussell.info`.
- Use CloudFront distribution `E2IJYG6SCPF50B` for invalidation and SPA fallback behavior.
- Intended policy: keep hashed Vite assets long-lived and immutable. The current workflow applies this to all non-HTML files, including stable image paths; correcting that remains follow-up work.
- Keep HTML entry points uncached.
- Do not use `aws s3 sync --delete` for all files in the deploy step because previously cached HTML may still request older hashed assets.
- Configure CloudFront custom error responses for 403 and 404 to serve `/index.html` with HTTP 200 so BrowserRouter deep links work.

## Collaboration

- Follow the mode system in `AGENTS.md`.
- `SYNC` means read documentation and memory-bank files, summarize current state, recommend next task, and make no code changes.
- `DOCS` means update documentation only and make no source code changes.
- `DO` and `NEXT` mean implement exactly one unchecked TODO item, then update `memory-bank/progress.md` and `docs/todo.md`.
- `FIX` means fix only the reported issue with the smallest reasonable change and update progress if needed.
- Do not push to GitHub unless the user explicitly asks for it.
- Do not deploy unless the user explicitly asks for it.
- Preserve user edits and untracked files. Check `git status --short` before making changes.

## October 16, 2026: techNL Summit

- Keep the independent conference notes application in `src/summit/`, mounted beside the portfolio route layout; do not reuse AppShell or portfolio presentation components.
- Use one automatically discovered JSON file per session and stable speaker/company IDs. Derive reverse session relationships rather than maintaining duplicate registries.
- Filter drafts and unpublished summary/recording fields before Vite bundles JSON; validate schemas, unique identities and references during build. Speaker/company directories are public.
- Keep neutral styles scoped to `.summit-app` with separate tokens and an opaque root. Defer final identity, real content, social metadata and any prominent portfolio link.
- Retain the existing single Vite build and deployment fallback. No dependencies, backend, workflow, AWS changes, push or deployment are part of this phase.
- Extraction requires moving the summit directory, retaining its Vite content plugin and router entry, changing its mount constant and making the portfolio footer link absolute. See `src/summit/README.md`.

## October 16, 2026: Summit companion design

- Prioritize attendees finding their next event and returning to notes. Home is a chronological timeline, with an independently written welcome above it.
- Use restrained lilac and plum as a nod to techNL, green for the next-event action, cool neutral surfaces, and system sans typography. Summit styling remains scoped and independent from the portfolio.
- Determine upcoming/live/past from the conference clock, not `status`, which continues to control summary publication. On entry, prefer the next start; fall back to a running session, then the final event. Never auto-scroll on clock ticks.
- Keep native scrolling and an accessible native dialog for quick jumps. Browser history restores the reading position; explicit agenda links can target a session.
- Keep existing sample/test content intact and disclose the preview. Real agenda import, metadata, deployment and affiliation are separate from design.


## October 17, 2026: Summit editorial motion direction

- Alex explicitly authorized moving from inspiration research into a major redesign, closely following Zajno’s typography, whitespace and transition choreography. The sharp charcoal/gray composition supersedes the initial soft plum/lilac presentation; purple remains an event connection.
- Use browser-native shared snapshots for the selected card background, title and factual metadata. Hold the previous Summit route until capture, then commit the destination. This supports links and history navigation within the existing React Router architecture, with no new dependencies.
- Keep background geometry separate from text/control snapshots to avoid stretching labels. Reduced motion receives immediate navigation; unsupported browsers retain content and a simpler entrance.


## October 17, 2026: Summit navigation and profile refinements

- Alex requested removing purple entirely, enlarging small type and making TechNL Summit 2026 the prominent identity. Use monochrome states as well as surfaces; keep the editorial motion direction.
- The agenda is the single session index. Remove the Sessions page, preview banner and jump popup; redirect the legacy Sessions index to the agenda. Put a filled Up next action in primary navigation, including the phone bottom bar.
- Cards use an article with a stretched primary link and independent presenter/company links, avoiding nested anchors. Put those same linked facts in the session header and remove the redundant aside. Shared name snapshots connect profiles to their originating names; card-origin history preserves the card morph when sessions are opened from a profile.


## October 17, 2026: Summit colour clarification and unified welcome

- Alex clarified that excluding purple did not mean monochrome. Use muted slate-green with warm apricot accents and warm-neutral panels, retaining the editorial typography and shared-element choreography.
- The heading, personal note and date shortcuts belong in one full-height opening section. Use minimum viewport height rather than a fixed clipped height, subtract the header and phone navigation, and allow shorter screens to scroll. Remove the redundant clock, companion kicker and running-order heading. Keep the existing next-event entry behavior.
- Reduce stacked page-top spacing; put session back navigation and date/status together before the title, with responsive wrapping.


## October 17, 2026: Dense agenda and inline session navigation

- Keep all presenter and company links in agenda cards, but use inline names/affiliations and reserve portraits for details. Remove the redundant card time and separate action footer. The rail carries start and expected end times, never splitting a clock value; phone cards get one horizontal range above them.
- Use a sticky inline bar rather than reviving the rejected jump popup. Date buttons and a native range input cover all sessions, including parallel events. Pointer/keyboard scrubbing is immediate; ordinary scrolling updates the selection. Step/day buttons retain smooth scrolling. Account for sticky controls and bottom navigation when centering sessions; keep keyboard focus on the active control.
- Include the rail's time in shared session snapshots so the existing card-to-detail choreography survives the denser layout. No new dependencies or content/schema changes.


## October 17, 2026: Scrolling identity and simultaneous choices

- Alex's new intro request supersedes the automatic next-session landing: fresh unanchored entry starts at the welcome. Keep explicit Up next, deep anchors and history restoration.
- Render one visible identity moving between measured heading/navigation positions. Shrink before merging the second line, so letters never collide. Reveal the header chrome behind it, reverse with scroll, and use a direct reduced-motion handoff. Preserve lowercase techNL branding and equal year size. The note has a linked Alex Russell signature and LinkedIn icon; remove its redundant byline and introductory date shortcuts.
- The quick-scroll bar appears only as the first event passes under the header, without a visible caption. Hidden controls are inert. Keep the slider usable while focused when selecting early events.
- Simultaneous starts share one slot and time rail: four columns on wide desktops, two on narrower desktops, native horizontal scroll snapping on phones/tablets. Preserve independent anchors and slider stops, track the visible carousel card and reveal selected/returning cards before shared transitions. No new dependencies or programme content changes.


## October 17, 2026: Complete desktop speaker rows and editorial profiles

- Alex requested full biographies in the desktop speaker list, making profile navigation redundant there. Desktop rows therefore expose the full biography and direct session/company/social links; mobile rows retain whole-row profile access, independent secondary links and plain name headings. Presenting times are unlinked. Use three sticky sort buttons and default to chronological presentation order.
- Share an editorial portrait/logo and pale-content hero between speaker and company profiles, with LinkedIn aligned to the identity and company-related speaker portraits. Hide organizer-programme links in the rendered profiles without changing source data. Back uses the router's previous in-app history entry, with the corresponding directory as a direct-entry fallback.
- The note is a right-aligned personal message, practical lines separate, with a larger serif closing before its disclosure. The full-width quick-scroll background covers gutters. Keep affiliations close to names and replace the visible carousel count with labelled, filled navigation buttons; retain a screen-reader count.
