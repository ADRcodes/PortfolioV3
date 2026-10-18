# Launch functionality — October 18, 2026

## Content contract

`eventType` is `talk`, `panel`, `workshop`, `networking`, `registration`, `break` or `activity`. The first three show “Notes to follow” while upcoming; the others show their event category and timing/location, without promising notes. A published summary always remains readable, regardless of event type. `status` still controls publication only.

`programme` is `conference` or `external`. All existing records explicitly declare both fields. Older guide examples may omit them and project to `talk` / `conference`; invalid supplied values fail validation. Preserve the two fields when publishing a real session. Will’s existing article is `external`, retaining all prior content, identity, illustrative schedule fields and URL. It never contributes to programme listings, timing, counts or recent notes.

The public `sessions` collection still contains every non-draft article for detail lookup. `conferenceSessions` drives official listings and reverse session relationships. `directorySpeakers` / `directoryCompanies` omit profiles with `demo: true`. Jordan Lee and Demo Labs keep their source records and stable IDs for editorial examples and reference validation; their profile routes return the Summit not-found view. No real conference records are removed.

Discovery, build validation and draft/unpublished field exclusion retain the existing Vite plugin. There is no new registry, backend, CMS or dependency.

## Interaction rules

- The conference clock uses America/St_Johns. Active intervals include the start and exclude the end. Every active option is returned, including overlaps with different start times. Between events, select the entire next start slot. Breaks and social events are scheduled events too.
- A simultaneous start targets the existing slot without choosing a carousel card. Overlaps with different starts target a “Happening now” options section with equal links to each active event. After the conference, navigation offers published conference notes when available, otherwise omits the shortcut.
- `?view=notes` filters the official agenda to published summaries. Current/next timing always uses the complete programme. Its shortcut clears the filter when the target is hidden. Deep links to unpublished events reveal the full schedule. Query-only search/filter changes retain reading position.
- Latest notes appear after the welcome, before the agenda, only when published conference summaries exist. Show at most three, ordered by `updatedAt` descending, with a stable ID tiebreaker, speakers, Newfoundland-local update time, overview excerpt and article links.
- Directory search uses `?q=` and preserves speaker sorting. It folds accents, case and punctuation and searches every associated company name plus name/biography. Native search inputs, visible labels, result status and empty states support keyboard and assistive technology. Speaker names now link to profiles on desktop as well as mobile.
- Share works independently of publication: native Web Share first, clipboard second, selectable read-only canonical URL when automatic copying is unavailable/denied. User cancellation does not trigger copying. Only public title and `https://www.alexrussell.info/technlsummit/sessions/:slug` are shared; recordings/transcripts are never included.

## Styling handoff

No functionality edits to `styles/summit.css`. Existing design-session layout/toolbar/footer changes are preserved separately.

New classes:

- Recent notes: `.summit-recent-summaries`, `.summit-recent-list`, `.summit-recent-item`, `.summit-recent-speakers`, `.summit-recent-date`, `.summit-recent-excerpt`, `.summit-recent-link`.
- Agenda: `.summit-event-details`, `.summit-current-options`, `.summit-agenda-filters`, `.summit-filter-status`.
- Directories: `.summit-directory-search`, `.summit-search-status`, `.summit-speaker-profile-link`.
- Sharing/details: `.summit-session-share`, `.summit-share-button`, `.summit-share-feedback`, `.summit-share-fallback`, `.summit-event-information`.

New data attributes:

- Cards/details: `data-event-type="talk|panel|workshop|networking|registration|break|activity"`, `data-programme="conference|external"`, `data-publication-status="upcoming|published"`.
- Filter buttons: `data-agenda-filter="all|notes"`, selected via `aria-pressed="true"`.
- Existing nav shortcut: `data-agenda-navigation="current|next|ended"`.
- Share wrapper: `data-share-state="idle|sharing|shared|copied|cancelled|manual"`.

New anchors: `#summit-agenda-start`, `#summit-recent-summaries` (only with notes), `#agenda-current` (only overlapping starts), `#agenda-slot-<first-session-id>`. All existing `#agenda-<session-id>` anchors remain.

## Social preview investigation (no deployment changes)

Observed both live routes in the Computer Use in-app browser on October 18:

- `https://alexrussell.info/technlsummit`
- `https://alexrussell.info/technlsummit/sessions/the-new-org-chart`

Both redirect to `www.alexrussell.info`. Both retain description “Alex Russell is a full-stack developer building practical AI-powered web tools for messy workflows and useful prototypes.”, `og:title` “Alex Russell's Portfolio”, portfolio `og:description`, `og:type=website`, and `og:image=/images/meta/alex-russell-profile.png`. Twitter metadata is likewise portfolio-specific. The rendered document title becomes “techNL Summit 2026 | Independent companion”. The local HTML entry confirms these tags are in the shared shell. Raw live HTTP bodies could not be independently fetched: web fetch failed and shell networking denied the domain. Live AWS configuration was not inspected.

Client-side metadata alone is not a dependable preview solution: link unfurlers may read only the initial HTML. Generate Summit-specific HTML heads at build time, using already projected public JSON for per-session title/description, canonical URL, article update time and absolute Open Graph/Twitter image URLs. Use an approved Summit social image (e.g. 1200×630) and never unpublished summaries, transcripts or recording URLs. Keep the same React bundle and empty root; full SSR or a framework migration is unnecessary for previews.

The repository deploy workflow uploads to S3 and uses CloudFront 403/404 fallback to `/index.html`. Merely adding `technlsummit/index.html` does not make extensionless routes resolve to it: CloudFront's default root object applies only at the distribution root ([AWS default-root documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html)). A conventional directory-index output needs a narrowly scoped URI rewrite ([AWS implementation guidance](https://aws.amazon.com/blogs/networking-and-content-delivery/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-cloudfront-functions/)).

For launch, the smallest infrastructure-free option is build-generated shells uploaded at exact extensionless S3 object keys (`technlsummit`, `technlsummit/sessions/the-new-org-chart`, etc.) with explicit `Content-Type: text/html` and uncached HTML headers. Existing missing-route fallback can remain. This requires a focused build/upload workflow change, canonical/trailing-slash strategy, and live verification that no existing viewer-request rewrite overrides these keys. The workflow currently caches everything except root index/404 as immutable, so new shells must be excluded from that sync and uploaded as HTML. Draft/deleted route objects also need deliberate cleanup to avoid stale previews. No such changes were made here.

Recommendation: separately authorize and test the exact-key static-shell approach, including both slash variants and draft/privacy regression checks; use a Summit-only CloudFront rewrite if conventional `index.html` output is preferred. Verify raw HTML for both routes and preview crawlers after deployment. Previously cached iMessage/social cards may take time to refresh.

## Verification

All 45 Node tests passed (`node --test --test-concurrency=1 src/summit/lib/*.test.js src/summit/content/*.test.js`), including a production-asset publication regression. Production build and whitespace checks passed. Existing pnpm preferences EPERM and Vite chunk-size warnings remain non-blocking.

Computer Use in-app browser fallback was used because Playwright MCP reported its shared browser was occupied. Local server: `http://127.0.0.1:5175`. Desktop and 390px phone checks covered schedule exclusion/count, notes filter/empty state, hidden-target recovery, affiliation/company-description search, empty states, focus retention, desktop speaker links and Back search retention, external article with five presentations, clipboard success/canonical URL, simulated overlapping active events, draft-route fallback and portfolio smoke routes. No horizontal overflow observed on checked Summit surfaces. Native share/cancel/clipboard denial use platform-stubbed unit tests; a real OS share dialog was not sent. Latest conference notes have no real published records yet; their ordering, fields and hiding behavior were verified with fixtures. Browser clock override was confined to the local tab and cleared by navigation. Screenshots are local `.codex/screenshots/summit-functionality-*` evidence, outside the commit.
