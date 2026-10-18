# PortfolioV3

Alex Russell's static portfolio for practical AI systems, web projects, experiments, and consulting.

## Tech

- Vite
- React
- Tailwind CSS v4 via `@tailwindcss/vite`
- React Router
- Motion for React
- pnpm

## Run Locally

```bash
pnpm install
pnpm dev
```

Build a production bundle:

```bash
pnpm build
```

## Structure

- `src/data/navigation.js` keeps nav labels and paths in one place so labels like `Projects` can be renamed later.
- `src/data/projects.js` contains the editable project data model.
- `src/components/layout` contains the app shell, header, and footer.
- `src/components/ui` contains shared presentation primitives.
- `src/lib/motion.js` contains reusable Motion animation settings.
- `src/styles/global.css` defines Tailwind v4 theme tokens, global CSS variables, surfaces, and base styling.

## Design System Notes

The first pass uses calm, warm technical styling with shared CSS tokens for color, radius, shadow, and surfaces. Components lean on soft borders, organic rounded shapes, subtle gradients, and restrained Motion transitions. `MotionConfig` is set to respect the user's reduced-motion preference.

The portfolio has no backend, CMS, authentication, or AI chatbot. The contact form sends through EmailJS in the browser, and selected projects were brought forward from PortfolioV2.

## Documentation

- `docs/spec.md`: product scope and requirements.
- `docs/plan.md` and `docs/todo.md`: roadmap and actionable work.
- `PRODUCT.md`: audience, voice, personality, and reference sites.
- `DESIGN.md`: visual tokens, typography, components, and interaction guidance.
- `memory-bank/progress.md` and `memory-bank/decisions.md`: history and rationale.
- `docs/deployment.md`: current deployment process, verification, and limitations.

Use PRODUCT.md and DESIGN.md together as the existing brand reference; a separate docs/brand.md is not currently needed.
