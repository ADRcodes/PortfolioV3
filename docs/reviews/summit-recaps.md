# Summit recap infrastructure review — October 21, 2026

Base: production `main` at `926916d`. Review branch: `codex/summit-recap-articles`. No real recap articles, teasers or planning titles are included. `content/recaps/` contains only its README.

## Scope

Structured JSON recaps are independent of sessions and published through the same GitHub-based workflow. They have a validated public projection, dedicated routes, a conditional feature spread in the existing Insights design, reused article-section/highlight/share components and existing-pipeline initial HTML social previews. See `src/summit/RECAPS.md` for the schema and publication/withdrawal contract.

All existing session articles, speaker/company records, attendance preferences, the refined existing Insights markup, shared transitions, `summit.css` and deployment workflow are preserved. No dependency, CMS, backend, service or CloudFront change. Only published recaps enter the site; invalid content fails the build. Draft filtering does not make public Git history private.

## Verification

- All **86** content/library tests pass. New tests exercise schema/reference failures, duplicate identities, chronological timestamps, zero/one/three recap rendering and ordering, escaped article text, unknown routes, shared navigation/links, full-build draft/private-field exclusion and invalid-build rejection.
- Production build passes without temporary articles. The existing large-JavaScript-chunk warning remains. Uploader dry-run with fixture recaps produces exactly three keys per recap; unit tests verify HTML content type/non-immutable caching and withdrawn recap handling without touching nested private/asset/profile paths.
- Chromium via Playwright MCP checked zero and one recap at 1440/390px and three recaps at 1440/820/390/320px. No horizontal overflow. Article pages checked at 1440/390/320px with the existing warm paper background and a body width of approximately 741px on desktop. Home retains existing notes and speaker perspectives without a recap heading when empty.
- Recap-to-session and article-to-insights links work; browser Back restores the exact preceding reading position (1430px before/after). Native-share success, copied-link feedback and denied-clipboard manual fallback were checked with browser-local platform mocks; no share was sent. Canonical share payload contains only article title and public recap URL.
- Speaker name search retains URL sorting/query, company search works, speaker perspectives remain accessible, notes filters show only published sessions, Will’s stable external-article URL renders, and the portfolio contact route renders without sending a contact message. No browser console errors observed.
- Raw HTTP requests to recap HTML return the recap title/excerpt, canonical URL, branded Open Graph/Twitter metadata and correct HTML/no-cache headers. Integration tests cover non-slash, slash and index variants, draft exclusion and unchanged portfolio/session metadata. This verifies initial HTML independently of client JavaScript.

Browser fixtures were built into ignored `.codex/recaps-qa-*` directories and removed from source in `finally` cleanup. Screenshots are local, ignored artifacts in `.playwright-mcp/`: `recaps-zero-{1440,390}.png`, `recaps-one-{1440,390}.png`, `recaps-three-{1440,820,390,320}.png`, and `recap-article-{1440,390,320}.png`. These show explicitly fictional test text, not the planned articles.

## Review and deferred work

This PR provides infrastructure only. The three substantive articles require separate source verification and publication. Keep all confidential/unapproved drafts and source notes outside the public repository. Future normal content publication still commits completed verified JSON to main and relies on existing Actions. Recheck actual live recap HTTP responses after the first approved publication; no production deployment is part of this PR. Physical iPhone/Safari behaviour was not tested.
