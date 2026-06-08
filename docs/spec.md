# PortfolioV3 Spec

Last updated: 2026-06-02

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
