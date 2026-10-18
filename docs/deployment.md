# Deployment

Last reviewed: 2026-10-15

## Current process

The source of truth is `.github/workflows/deploy.yml`. Every push to `main` triggers a production deployment. Agents must not push or deploy without explicit user authorization.

1. GitHub Actions checks out the repository on Ubuntu.
2. Sets up pnpm (package.json pins 10.20.0) and Node 24.
3. Installs dependencies with `pnpm install --frozen-lockfile` and runs `pnpm build`.
4. Copies `dist/index.html` to `dist/404.html`.
5. Authenticates to AWS in `us-east-1` using the GitHub secrets `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY_ID`. Never put secret values in documentation.
6. Syncs non-HTML build files to `s3://www.alexrussell.info` with `public,max-age=31536000,immutable`. It deliberately retains previous files, including hashed bundles, to keep older cached HTML functional.
7. Uploads index.html and 404.html separately as text/html with `no-cache,no-store,must-revalidate`.
8. Updates CloudFront distribution `E2IJYG6SCPF50B`, replacing its custom error responses with 403/404 mappings to `/index.html`, HTTP 200, error cache TTL 0. This allows BrowserRouter deep links to resolve.
9. Requests a CloudFront invalidation for `/*`.

The workflow has no preview environment, manual dispatch trigger, deployment concurrency group, post-build route tests, post-deployment smoke checks, or wait for invalidation completion.

## Last observed deployment

[Run #6](https://github.com/ADRcodes/PortfolioV3/actions/runs/27146365829) succeeded on June 8, 2026, for commit `1e50a6bbe8ca8e5167e3486aea3267029c9ced24` (Polish portfolio home and contact UX), in 32 seconds. Verified in GitHub on October 15. Local main and the cached origin/main ref matched that commit before the October fixes. The live JavaScript bundle filename matched the pre-fix local production build.

The run reported a warning that v4 actions target Node 20 while being forced onto Node 24. That run succeeded; action upgrades remain maintenance work.

Live Home, Projects, project detail, Consulting, and Contact routes rendered during review, including direct project deep links. AWS IAM permissions and effective production cache headers were not inspected. A successful workflow is not proof that invalidation has finished or that email delivery works.

## Routine verification

Before an authorized push:

- Run `pnpm build` and `git diff --check`.
- Inspect desktop/mobile behavior for affected pages.
- Verify contact validation without sending a real email unless delivery testing is explicitly requested.
- Review the diff and exclude unrelated changes.

After a push, check the corresponding Actions run, wait for propagation, then verify the homepage, a direct project URL, navigation, and affected assets on the live site. Production deployment is automatic when main changes.

## Known limitations and follow-up

- Immutable caching currently includes images with stable filenames. Restrict it to versioned assets or version image URLs; CloudFront invalidation does not clear visitors' browser caches.
- Overlapping deployment jobs can publish out of order or conflict on CloudFront configuration updates. Serialize production deployments.
- CloudFront infrastructure is mutated on every content deployment. Consider managing fallback configuration separately.
- Add route smoke checks and explicit invalidation completion verification.
- Old assets accumulate intentionally; any cleanup must preserve bundles still referenced by cached HTML.
- No automated rollback or release artifact is configured. Recovery requires an explicitly authorized deployment of a known-good revision and subsequent verification. Do not reset or force-push main as an automatic recovery step.
