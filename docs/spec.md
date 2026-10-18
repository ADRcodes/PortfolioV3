# PortfolioV3 Spec

Last updated: 2026-10-15

## Purpose

PortfolioV3 is Alex Russell's current personal portfolio and positioning site. It should present practical AI-powered web work, selected projects, experiments, and consulting direction in a way that feels specific, credible, and easy to explore.

The site should make it clear that Alex builds useful web tools and AI systems for messy workflows, with enough project detail to show judgment, process, and implementation ability.

## Primary Audiences

- Potential clients or collaborators evaluating AI workflow, RAG, prototype, or web product help.
- Technical reviewers looking for evidence of real implementation work.
- Community members or peers interested in experiments, demos, and build process.
- Alex, using the site as a living system for project documentation and positioning.

## Current Product Surface

- Home: animated intro sentence with linked phrases that route to key sections.
- Projects: scroll-based selected work index with project previews and links.
- Project detail: reusable project detail template plus a custom hiRAG case study.
- AI consulting: service-oriented page for workflow mapping, retrieval prototypes, AI interface design, and build readiness.
- Playground: experimental area currently featuring the Pretext demo.
- About: concise background and positioning.
- Contact: phrase-based EmailJS contact form plus external links.

## Core Requirements

- The site must remain fast, static, and deployable as a Vite build.
- New page navigation starts at the top; browser Back/Forward restores previously visited scroll positions, and section links target their anchors.
- Contact fields keep the current phrase-based appearance while exposing accessible names, required state, and email input mode. Submission locks the fields until it succeeds or fails.
- Routes must support direct deep links such as `/projects/hirag-personal-ai`.
- Project content should be data-driven where possible through `src/data/projects.js`.
- Shared presentation behavior should live in helpers or reusable components rather than being duplicated across pages.
- Motion should add polish without making the site unusable for reduced-motion users.
- Copy should stay practical and concrete. Avoid vague claims that are not backed by project evidence.
- Mobile layouts must be first-class, especially for Projects, Project Detail, Contact, and AI Consulting.

## Content Requirements

- hiRAG should be the flagship AI systems project and should communicate:
  - document ingestion,
  - retrieval,
  - source-backed answers,
  - AWS/Bedrock/CDK/DynamoDB architecture,
  - MVP status and next improvement areas.
- Older PortfolioV2 projects should remain available where useful, but they should not dominate the positioning.
- AI consulting should point toward small, testable engagements rather than broad AI transformation language.
- Playground should house experiments that are useful as interface or technical demonstrations.

## Technical Requirements

- Framework: Vite + React.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`, with global tokens in `src/styles/global.css`.
- Routing: React Router.
- Motion: Motion for React with shared variants in `src/lib/motion.js`.
- Contact: EmailJS client-side send flow.
- Deployment: GitHub Actions build to S3 with CloudFront invalidation and SPA fallback handling.

## Non-Goals

- No CMS until content volume or editing workflow clearly requires one.
- No authentication.
- No backend for the portfolio itself.
- No analytics or tracking unless explicitly added later.
- No broad component library migration unless the design system outgrows the current primitives.
- No automatic deploy or push action from an agent unless explicitly requested.

## Quality Bar

- Production build passes before a change is considered ready.
- UI changes should be checked at desktop and mobile widths when practical.
- Text must not overlap or overflow awkwardly.
- Project pages should have enough substance to justify being linked from the main Projects route.
- Deployment changes should be treated as high risk because they affect live availability.

## techNL Summit foundation

- Mount an independent conference notes site at `/technlsummit`, with its own layout, navigation and scoped styles under `src/summit/`.
- Support home, session/speaker/company directories and individual detail routes without changing existing portfolio behavior.
- Discover individual session JSON files automatically at build time; use stable speaker/company IDs and derive reverse relationships.
- Exclude drafts and unpublished summaries/recording links from production content. Keep the existing Vite build and deployment fallback.
- The Summit uses a distinct conference-companion identity, a time-aware home timeline and clearly marked demonstration data. Real conference content and launch metadata follow separately.

## Summit agenda experience

- Home presents a chronological, vertically scrollable timeline of clickable sessions and events. Earlier events and published summaries remain above the upcoming sessions.
- On fresh unanchored entry, show the welcome and identity. Keep an explicit Up next action using `America/St_Johns`, independent of the visitor’s timezone and summary status. Preserve browser Back/Forward scroll positions and direct session anchors.
- Update time labels without moving the reader. Keep simultaneous sessions visible and provide an explicit Up next shortcut.
- Place Alex’s independent-project welcome at the top of the timeline. Use the agenda as the single session index, with Speakers, Companies and a distinct Up next link in navigation; place navigation at the bottom on phones.
- Respect reduced motion, keep native scrolling, and retain keyboard focus through navigation and profile links.

## Summit refinement direction (October 17, 2026)

- Prominently identify techNL Summit 2026 and use a softer slate-green canvas, warm-neutral panels and apricot accents without purple. Prioritize readable supporting text as well as display typography.
- Remove the Preview banner, redundant Sessions directory and jump popup. Keep legacy `/technlsummit/sessions` links working by redirecting to the agenda.
- Place linked presenter and company names with time and location in card/detail metadata, with continuous name-to-profile transitions. Keep the detail reading area free of a duplicated profile aside.

- Combine the agenda title and personal note in one viewport-height welcome section; allow it to grow on short screens. Remove the companion kicker, current-time display and running-order heading. Keep content-page top spacing compact.

- Keep agenda cards compact: inline presenter/company links, icon-led location, and start/expected-end times only in the non-wrapping rail. Reveal fixed date shortcuts and a native session slider when the first event begins passing the header. Keep them synchronized with scrolling and accessible by keyboard without a popup.

- The welcome identity scrolls into the previously hidden header. Use the casing techNL and the same size for 2026 as the other words. Remove the separate Alex byline, link the signature to the portfolio and provide a LinkedIn icon. Date shortcuts belong only in the quick-scroll bar, with no visible caption above its slider.
- Group identical session start times: side-by-side desktop choices, a native swipeable carousel with controls on mobile. Preserve every session anchor, slider stop, shared transition and return focus, including offscreen carousel cards.

- Speaker directory: sticky Presenting order/Name/Company buttons, large portraits, plain presentation times and linked session titles. Show full biographies on desktop without profile navigation; on mobile the row opens the speaker profile while other links remain independent.
- Company directory: alphabetical rows with available logos, descriptions and clear full-row detail navigation. Speaker and company profiles share a portrait/logo-led editorial layout, an aligned LinkedIn action, history Back (directory fallback for direct entries), no official-programme link and associated speaker portraits on company pages.
- Right-align the personal message, keep its practical lines separate and place the larger portfolio/LinkedIn closing before the affiliation disclosure. Cover the full viewport behind quick scrolling, tighten name/company spacing and use visible labelled carousel arrows without a visible counter.
