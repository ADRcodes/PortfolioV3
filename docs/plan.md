# PortfolioV3 Plan

Last updated: 2026-10-15

## Current Focus

Make PortfolioV3 a polished, credible portfolio for practical AI systems and product-focused web work, with hiRAG as the strongest proof point and AI consulting as the clearest service direction.

## Near-Term Plan

1. Stabilize documentation
   - Keep `AGENTS.md` and `docs/` updated as project memory.
   - Keep actionable implementation work in `docs/todo.md`.
   - Record meaningful product, deployment, and architecture decisions in `memory-bank/decisions.md`.
   - Update `memory-bank/progress.md` after notable UI, content, or deployment changes.

2. Polish the hiRAG case study
   - Tighten case study copy around the problem, architecture, constraints, and outcome.
   - Add clearer screenshots or diagrams if newer hiRAG visuals are available.
   - Consider a short "What I learned" or "Constraints handled" section.
   - Add live/demo/code links only when they are safe and useful to share.

3. Improve project detail coverage
   - Decide which projects deserve custom case-study pages.
   - Add richer detail for Out & About Events and Portfolio / AI Dev Workflow.
   - Keep older PortfolioV2 projects concise unless they support the current positioning.

4. Finish responsive QA
   - Check Home, Projects, Project Detail, AI Consulting, Playground, About, and Contact at mobile and desktop widths.
   - Pay special attention to large typography, scroll-based project layout, and the phrase-based contact form.
   - Verify reduced-motion behavior still feels usable.

5. Deployment verification
   - Latest reviewed deployment succeeded on June 8, 2026, at commit `1e50a6b`. Reverify after future workflow changes.
   - Live project deep links rendered during the October 15 review; add automated route checks.
   - Verify effective cache headers; restrict immutable caching to versioned assets.
   - Add deployment serialization and post-deployment checks. See `docs/deployment.md`.

## Backlog

- Replace AI Consulting placeholder images with intentional visuals or project-specific assets.
- Add metadata per route if SEO/social previews need to become more specific.
- Add lightweight accessibility checks for interactive text, form states, focus visibility, and keyboard navigation.
- Add a small smoke-test script for route availability after build.
- Consider project tags or filters only if the project list grows enough to need them.
- Review EmailJS public configuration and decide whether the contact form needs spam protection.
- Decide whether the Pretext demo needs a short technical note or source link.

## Verification Checklist

- `pnpm build` or equivalent Vite build command passes.
- `/projects/hirag-personal-ai` renders locally and direct links work.
- Contact form validation only enables send when name, message, and email are present.
- Project links open externally with correct labels.
- No unrelated files are committed or pushed.

## Deferred Review Findings

- Revisit the scroll-driven Projects experience, direct project selection, and reduced-motion alternative.
- Replace consulting placeholders and expand case-study evidence in a later content pass.
- A general unknown route currently renders an empty page; the user requested an explanation, not implementation yet.

## Open Questions

- Should PortfolioV3 keep the current warm editorial visual direction, or move toward a more utilitarian consulting/product feel?
- Should hiRAG be publicly demoable, private but described, or linked only through screenshots?
- Should the AI consulting page remain service-oriented, or become a more direct offer page with pricing or engagement packages?
- Should deployment remain S3/CloudFront only, or should preview deployments be added later?

## techNL Summit foundation

The isolated application and file-based publishing foundation are implemented and validated. See `src/summit/README.md` for authoring and extraction details. Next, replace fictional conference data, confirm the schedule and public recording links, and prepare sharing metadata. The time-aware agenda and independent visual identity are implemented; see `src/summit/DESIGN.md`. Add a prominent portfolio link only when launch is authorized. Keep the existing build/deployment process; do not push or merge without authorization.
