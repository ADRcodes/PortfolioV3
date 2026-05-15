# PortfolioV3

A static Vite + React foundation for Alex Russell's redesigned portfolio.

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

This version is intentionally static: no backend, CMS, authentication, deployment setup, AI chatbot, or imported content from older repositories.
