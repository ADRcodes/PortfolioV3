# PortfolioV3 Progress

Last updated: 2026-06-03

## Completed

- Built the core Vite + React + Tailwind v4 portfolio foundation.
- Added React Router routes for Home, Projects, Project Detail, AI Consulting, Playground, About, and Contact.
- Created shared layout and UI primitives under `src/components/layout` and `src/components/ui`.
- Added reusable motion settings in `src/lib/motion.js`.
- Added data-driven project content in `src/data/projects.js`.
- Added project presentation helpers in `src/data/projectPresentation.js`.
- Added a scroll-driven Projects page with animated project previews.
- Added mobile improvements to project views, About, and Contact in recent work.
- Added a custom hiRAG case study route for `projects/hirag-personal-ai`.
- Added hiRAG project screenshots and architecture visuals under `public/images/projects`.
- Added an AI Consulting page focused on workflow mapping, retrieval prototypes, AI interface design, and build readiness.
- Added a Playground page with the Pretext demo.
- Added an EmailJS-powered Contact page with phrase-style editable fields and send states.
- Added deployment workflow support for S3/CloudFront.
- Added SPA fallback handling in the deploy workflow so deep links can resolve through CloudFront/S3.
- Added project documentation in the structure required by `AGENTS.md`: `docs/spec.md`, `docs/plan.md`, `docs/todo.md`, `memory-bank/progress.md`, and `memory-bank/decisions.md`.

## Recent Verification

- Production Vite build passed locally on 2026-06-02 by running Vite directly through the local Node binary.
- Local Vite dev server served `/projects/hirag-personal-ai` with `200 OK` on 2026-06-02.
- `git diff --check` passed before the most recent local UI/deploy commit.

## Current Repo State Notes

- `AGENTS.md` was updated by the user to define required read order, documentation structure, and mode behavior.
- `origin/main` is behind the local branch by one local commit at the time these docs were written. That local commit was not pushed because push permission was denied.
- Future `SYNC` requests should read docs and memory-bank files, summarize current state, recommend a next task, and make no code changes.

## Needs Follow-Up

- Run a full browser visual QA pass once browser tooling is available.
- Confirm GitHub Actions deploy behavior after the workflow changes are intentionally pushed.
- Replace placeholder visuals on AI Consulting when better assets are ready.
- Decide which additional project pages should get custom case-study treatment.

## October 16, 2026: techNL Summit foundation

- Completed the initial requested phase under `src/summit/`: independent layout/header/footer/navigation, all seven route patterns, directories/profile/session pages, linked relationships, not-found handling and neutral responsive styles.
- Kept portfolio routes and presentation components separate. Conditional summit host styles suppress portfolio decoration only while the summit is mounted.
- Added automatic per-session JSON discovery, stable profile IDs, derived reverse relationships, build-time validation and exclusion of draft/unpublished summary content from the production assets.
- Added explicit fictional demonstration content and a guide containing the exact schemas, content workflow, local commands and extraction steps in `src/summit/README.md`.
- Final acceptance: `pnpm build`, all five Node content tests and whitespace checks passed. No source/build errors remained. pnpm emitted a non-blocking EPERM warning reading its user preferences file.
- Browser checks on the running Vite dev server covered homepage, session/speaker/company directories, individual details, cross-links, footer navigation, upcoming placeholders, draft URLs and invalid routes.
- Production preview checks confirmed a newly added session JSON generated a working page without React/profile changes, while draft session routes returned the summit not-found page. Unique markers covering draft title, description, every summary section and recording URL were absent from every dist file; the upcoming-summary marker was also absent.
- Removed temporary validation JSON files and rebuilt; final assets contain neither private markers nor temporary content.
- Inspected responsive layouts at 320px, 390px and 1280px: no horizontal overflow, one independent header/footer and wrapped navigation. Verified portfolio styles restore when leaving the summit.
- Existing Home, Projects, hiRAG detail, AI Consulting, Playground, About and Contact rendered with portfolio navigation and styling. No email was sent.
- Reviewed architecture against the original requirements: no extra dependencies, backend, registry, separate build, final visual design, portfolio homepage link, workflow or AWS changes.
- Confirmed branch `codex/technl-summit-foundation`. Git staging and commit dry-run succeed after the user's permission update. Foundation changes are prepared for a local commit; no push, merge or deployment is authorized. Earlier unrelated portfolio changes remain outside the foundation commit.
- Launch follow-ups remain real content/schedule/timezone verification, public-source-link review, visual identity and dedicated sharing metadata/favicon. Draft exclusion protects site routes and assets, not source files committed to Git.
