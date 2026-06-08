# PortfolioV3 Decisions

Last updated: 2026-06-03

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

## Design

- Keep the current warm technical visual language: paper background, ink text, moss/clay accents, soft borders, and restrained motion.
- The site should feel calm, technical, thoughtful, warm, and slightly playful.
- Avoid corporate stock-site aesthetics, generic developer templates, excessive AI buzzwords, overly dark cyberpunk styling, excessive animations, and visual clutter.
- Use large editorial typography for main pages and tighter typography inside cards, tool surfaces, and dense sections.
- Prefer concrete project screenshots and useful visuals over generic decoration.
- Avoid turning the site into a marketing landing page. The first screen should feel like the portfolio itself.

## Deployment

- Deploy the built `dist/` output to the S3 bucket `www.alexrussell.info`.
- Use CloudFront distribution `E2IJYG6SCPF50B` for invalidation and SPA fallback behavior.
- Keep hashed Vite assets long-lived and immutable.
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
