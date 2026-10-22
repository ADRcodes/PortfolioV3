# Static social previews

Implemented October 18, 2026. Not deployed by this change.

## Initial HTML, same React app

`social-vite-plugin.js` copies the finished Vite `index.html` into route-specific entries, replacing only each copy's head metadata. Root portfolio HTML stays unchanged. All entries retain the same empty React root, absolute hashed script/style URLs and client routing. This is static head generation, not server rendering.

The existing validated JSON loader automatically discovers every non-draft session. Generated routes include those sessions and the Summit homepage and speaker/company directory landing pages. Each receives title, description, canonical, Open Graph and Twitter metadata with absolute image URLs. Published sessions use a short overview and `article:modified_time`; upcoming sessions use only their public description. Will’s external article gets its own preview without joining the conference programme. Drafts generate no entry or manifest key. Recordings, transcripts and unknown/private fields are never selected for metadata. No content-schema or publishing workflow change is needed.

The canonical origin follows existing sharing links: `https://www.alexrussell.info`. Canonical Summit URLs have no trailing slash. Both variants serve identical HTML with that canonical URL; no new redirect is needed. Query strings/fragments do not affect metadata.

`public/images/meta/technl-summit-2026-v1.png` is the 1200 × 630 branded preview, with original artwork in the adjacent SVG. It uses the companion’s slate/paper/apricot colours and independent-project disclosure, with no official logo or portfolio photograph. Edit/export the SVG at 1200 × 630 to change the artwork, then bump the versioned filename and `SOCIAL_IMAGE` constant to avoid stale image caches. No image tool is required during normal builds.

## Exact S3 keys, without a CloudFront rewrite

A build emits `dist/technlsummit/sessions/wills-ai-meetup-editorial-test/index.html`. Its manifest maps that file to:

```text
technlsummit/sessions/wills-ai-meetup-editorial-test
technlsummit/sessions/wills-ai-meetup-editorial-test/
technlsummit/sessions/wills-ai-meetup-editorial-test/index.html
```

S3 is a flat object store: `technlsummit` can coexist with keys under `technlsummit/`. See [AWS object-key documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html). Exact slash and non-slash objects support an S3 REST origin; also uploading the index form supports website-origin directory lookup. A directory index alone would not resolve extensionless URLs through an unmodified REST origin; [AWS website index behaviour](https://docs.aws.amazon.com/AmazonS3/latest/userguide/IndexDocumentSupport.html) differs.

The uploader uses `aws s3api put-object --key` rather than high-level directory-copy interpretation, so slash-ending keys receive HTML rather than zero-byte folder markers. All entries explicitly receive `Content-Type: text/html; charset=utf-8` and `Cache-Control: no-cache,no-store,must-revalidate`. See [AWS put-object reference](https://docs.aws.amazon.com/cli/latest/reference/s3api/put-object.html).

The workflow excludes all `*.html` and `summit-previews.json` from immutable sync. Root index/404 keep their previous uncached upload. `scripts/upload-summit-previews.mjs` then uploads route entries with explicit HTML headers. The build manifest and generic unavailable template are not independently published by immutable sync. Hashed bundles and retention stay intact; the versioned PNG/SVG can use immutable caching. Production jobs are serialized to avoid overlapping preview publications.

The script lists the Summit prefix and restricts work to exact generated landing/session key patterns. Previously generated keys absent from the current public manifest are overwritten with a generic, non-indexed unavailable-page head loading the current app. This removes stale metadata when articles become drafts, are removed or change slug, without broad deletion or deleting old bundles. It needs the existing S3 list/put permissions and performs no AWS operations in dry-run mode. Withdrawing current metadata cannot erase previously public content from third-party preview caches or retained old bundles.

No CloudFront configuration changes are introduced. The workflow's pre-existing fallback configuration step and `/*` invalidation are unchanged. Unmatched routes retain the portfolio SPA fallback. Exact-key delivery assumes no existing viewer-request rewrite forces all URIs to `/index.html`; live distribution configuration was not inspected. If this fails, request approval for a narrowly scoped CloudFront change rather than changing infrastructure automatically.

## Verification

Run sequentially: the publication integration test creates temporary JSON fixtures.

```sh
node --test --test-concurrency=1 src/summit/content/*.test.js src/summit/lib/*.test.js
pnpm build
node scripts/upload-summit-previews.mjs www.alexrussell.info dist --dry-run
pnpm preview --host 127.0.0.1 --port 4177 --strictPort
```

Vite preview serves the same manifest mapping as the S3 uploader. Development mode remains the normal Vite SPA; use production preview for initial-HTML checks.

```sh
curl -i http://127.0.0.1:4177/technlsummit
curl -i http://127.0.0.1:4177/technlsummit/
curl -i http://127.0.0.1:4177/technlsummit/sessions/wills-ai-meetup-editorial-test
curl -i http://127.0.0.1:4177/technlsummit/sessions/wills-ai-meetup-editorial-test/
curl -i http://127.0.0.1:4177/
```

Tests cover discovery, raw HTTP bodies/headers, unchanged portfolio metadata, slash variants, draft/unpublished-field isolation, escaping, PNG dimensions, upload headers and withdrawn-route handling without affecting unrelated assets. Browser smoke checks confirm portfolio, agenda and direct sessions still render. Playwright MCP was occupied, so Computer Use's in-app browser was used.

Raw live-domain curl/Python requests were blocked by this environment's proxy (`x-proxy-error: blocked-by-allowlist`); web fetch also failed. The shared entry and preceding live-browser investigation confirm the original portfolio metadata behaviour; this change has not altered live responses. Local raw HTTP checks, independent of React, succeeded for both homepage variants, Will’s variants, another session, directories and portfolio routes.

After an approved deployment and completed invalidation, repeat HTTP checks against both `https://alexrussell.info` and `https://www.alexrussell.info`, following redirects with `curl -L`. Inspect final HTML, content type, cache headers and image URL; confirm PNG returns `image/png`, entry assets load, and a removed/draft route has no stale metadata. Effective CloudFront cache-policy minimum TTL and viewer-request behaviour still need production confirmation. Existing iMessage/social cards may take time to refresh after correct HTML is live.


## Cross-session recap previews

Published `content/recaps/*.json` records use the same loader, preview plugin, branded image and uploader. Each `/technlsummit/recaps/:slug` receives its title, excerpt, canonical URL, Open Graph/Twitter card, `article:published_time` and `article:modified_time` in initial HTML. Drafts have no public record, entry or manifest key; unknown/private fields are removed before bundling. Invalid recap content fails validation/build.

The controlled uploader namespace now additionally accepts `technlsummit/recaps/<safe-slug>`, with the existing non-slash, slash and `/index.html` variants. Withdrawn recap keys use the same generic noindex replacement; nested files, traversal, other namespaces and retained assets remain outside the update pattern. Content type and non-immutable HTML caching remain unchanged. No CloudFront or GitHub Actions configuration change is required. Session/portfolio/directory preview generation is preserved. See [RECAPS.md](RECAPS.md) for publication and withdrawal caveats.
