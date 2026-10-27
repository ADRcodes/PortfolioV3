# Cross-session editorial recaps

Recaps are independent editorial articles at `/technlsummit/recaps/:slug`, not scheduled conference events. They never enter agenda counts, timing, attendance, session filters or profile session relationships. No articles are included in the infrastructure PR.

## Publishing

The existing Pocket → ChatGPT → GitHub `main` commit → GitHub Actions workflow remains intact. Nora/OpenClaw, a CMS and a separate build service are not involved. Infrastructure changes require review; once this extension is merged, an explicitly owner-approved finished recap needs only one content JSON file committed through the normal publishing workflow. Approval of individual session summaries is governed separately by the existing editorial guide.

1. Retrieve the latest editorial guide, this reference, `content/recaps.js`, related session articles and relevant profiles from production `main`. Confirm `main` contains the recap loader, route and preview/uploader support; an open infrastructure PR is not production readiness. Do not publish a recap file to main until that prerequisite is satisfied.
2. Read the full relevant Pocket transcripts and summaries; verify claims and attributions under [EDITORIAL_GUIDE.md](EDITORIAL_GUIDE.md). Connect ideas without inventing agreement between speakers. Distinguish session evidence, editorial synthesis and external context. Existing summaries help locate ideas but do not replace primary sources for quotations or consequential claims.
3. Prepare and review the complete article privately. **Obtain explicit owner approval of its finished title, description, excerpt, body, attributions and supporting links before publication.** Material interpretive revisions require approval of the revised article; do not infer recap approval from standing authorization for individual session summaries. Approval is an editorial gate, not a JSON field: `status: "published"` does not prove approval. **Confidential/unapproved drafts, transcripts, Pocket links and private verification notes must stay outside this public repository.** A `draft` file is excluded from the site but remains public in Git history. Never commit sensitive source material as a draft. Publishing/withdrawal cannot erase old Git history, downloaded bundles or social caches.
4. Add a uniquely named `.json` directly in `content/recaps/`, with stable `id`/`slug` and explicit `status: "published"`. Use actual article publication/update timestamps with timezones; these are not fictional conference dates. No source filenames, recording links or transcripts are part of the public contract.
5. Reference existing **published conference** articles using `relatedSessionSlugs`. Optional section `sessionSlugs` must be a subset of those references. Optional `speakerIds` must be real public profile IDs. These links do not create speaker perspectives or imply endorsement; retain existing perspective attribution rules.
6. Run the available tests and production build sequentially. Check title, article reading layout, notes/profile links, share URL and homepage ordering. Re-read remote files before committing, preserving concurrent publications. Once the finished recap is explicitly approved, proceed through publication and verification without a redundant second approval. Pause if material changes invalidate that approval, consequential ambiguities remain, source material is inaccessible or verification problems are significant. A GitHub-only ChatGPT conversation need not start a local environment: validate the JSON/schema/references using accessible repository data, report unavailable local checks honestly, and inspect the Actions build/deployment result before claiming success.
7. Commit the JSON to `main` using the GitHub connector or the normal local workflow. The glob discovery, validators, feature collection and static previews update automatically. Verify the exact Actions deployment and live `/recaps/:slug` URL, including raw initial HTML, HTML content type, uncached headers and slash variants. Report any checks unavailable in the publishing environment.

Revisions preserve the existing filename, ID/slug and `publishedAt`, and update `updatedAt`. Re-read the current remote JSON and its blob SHA immediately before writing; compare it with the version used while editing. Use the connector’s expected content SHA/branch-head protection. If the file or branch changed, retrieve and reconcile the newer content rather than blindly overwriting it; preserve concurrent edits and obtain renewed approval if the reconciliation materially changes the approved interpretation. Verify the resulting remote commit/file and deployment. Homepage order is newest `publishedAt` first, with slug as a deterministic tie-breaker; editing an old article does not reorder the collection. Every published recap remains listed. Use original publication time for an already-public article, never a future timestamp as a scheduling mechanism: `status` controls publication.

Withdraw by removing the file or changing its status to `draft`. The existing uploader replaces its exact HTML keys with the generic unavailable head; the current app shows Not Found. If a supporting session is withdrawn, update/withdraw dependent recaps in the same commit or validation will stop the build rather than publish broken source links. Keep stable slugs unless a URL change is intentional; old URLs then become unavailable, not redirects.

## Exact content-only publishing contract

A new article creates **one file**: `src/summit/content/recaps/<slug>.json`. A revision changes that same file. No React edit, manual import/registry, homepage edit, speaker/session data change, manifest commit or deployment configuration change is required. Do not commit generated `dist/` files. Adding supporting session articles is a separate publishing task if they are not yet published.

- **Public status:** only `published` is included. `draft` is excluded from app and previews; it is not private repository storage. Invalid content fails the build. There is no timed/scheduled-publication mechanism.
- **Identity and URL:** unique stable `id` and lowercase hyphenated `slug`; canonical URL `https://www.alexrussell.info/technlsummit/recaps/<slug>`. Filename need not match the slug technically, but using `<slug>.json` makes revisions easier to locate.
- **Discovery/order:** the JSON glob automatically discovers records; published recaps feature in Explore Insights, newest `publishedAt` first, with slug as tie-breaker. `updatedAt` records revisions without changing that ordering. No recap data enters the agenda.
- **Links:** top-level `relatedSessionSlugs` must resolve to published conference articles. Section `sessionSlugs` must be a subset. Optional `speakerIds` must resolve to real public profiles. The renderer creates stable internal links; prose is plain text, not Markdown/HTML.
- **Social/deployment:** the existing build derives title/excerpt, canonical, Open Graph/Twitter, branded image and publication/update metadata. It generates `dist/technlsummit/recaps/<slug>/index.html` and an entry in `dist/summit-previews.json`. Existing Actions publishes that HTML at non-slash, slash and `/index.html` keys with `text/html; charset=utf-8` and `no-cache,no-store,must-revalidate`. No CloudFront or local-development setup is required for normal content publication.

## JSON contract

All text is escaped plain text; HTML and Markdown are not interpreted. Session/profile links are generated from validated references, including optional section-level links, rather than arbitrary URLs in prose. Sections render in array order with `h2` headings. An optional `highlightedInsight` on a section appears immediately after that section's paragraphs and bullets, before its related-session links. Prefer section-level highlights for stories where placement matters; arrange paragraphs so the highlighted moment lands after its evidence. The legacy top-level `highlightedInsight` remains supported and appears after the first section rather than above the opening. An optional nonempty `label` on either insight sets the callout's eyebrow; otherwise it uses 'Highlighted insight'. The full editorial disclosure appears at the end of the article. Avoid repeating an excerpt or highlight throughout the article.

Required: `id`, `slug`, `title`, `description` (subtitle), `excerpt`, `status` (`draft` or `published`), `publishedAt`, `updatedAt`, nonempty `relatedSessionSlugs`, and nonempty `sections`. Each section requires a heading and one or more paragraphs; `bullets`, `sessionSlugs` and `highlightedInsight` are optional. `speakerIds` and a legacy top-level `highlightedInsight` are optional. Insights support an optional `label`, optional `heading` and required `explanation`. Dates must be ISO timestamps with timezones and `updatedAt >= publishedAt`. Duplicate IDs/slugs and unknown/unpublished/external session links fail the build. Unknown/private fields are recursively removed before bundling.

The following is a **fictional, documentation-only copyable schema example**, not a proposed article or production content file. If writing a real approved recap with this slug, the content path would be `src/summit/content/recaps/evidence-example.json`; do not create that example record. Keep real drafts private until approved; replace all sample wording with verified writing and set actual publication metadata when publishing.

```json
{
  "id": "recap-evidence-example",
  "slug": "evidence-example",
  "title": "Fictional example: comparing two editorial arguments",
  "description": "A subtitle that explains the editorial question.",
  "excerpt": "A short, useful description for the homepage and social preview.",
  "status": "draft",
  "publishedAt": "2026-10-21T18:00:00Z",
  "updatedAt": "2026-10-21T18:00:00Z",
  "relatedSessionSlugs": ["assumption-trap", "internal-innovation"],
  "speakerIds": [],
  "highlightedInsight": {
    "heading": "An optional supported insight",
    "explanation": "Label editorial interpretation and preserve the evidence’s qualifications."
  },
  "sections": [
    {
      "heading": "A meaningful section heading",
      "paragraphs": ["The verified article’s opening argument.", "Evidence and interpretation in context."],
      "sessionSlugs": ["assumption-trap"]
    },
    {
      "heading": "A second section",
      "paragraphs": ["Connect the ideas without implying consensus."],
      "bullets": ["An optional practical implication."]
    }
  ]
}
```

## Implementation and verification

- `content/recaps.js`: validation, public projection and ordering. `content/index.js` discovers recap files separately from sessions; `content/vite-plugin.js` validates raw files and replaces drafts with `null` before bundling.
- `pages/RecapDetail.jsx`: article metadata, reused `DetailedSections`/`HighlightedInsight`, shared native/clipboard/manual sharing, supporting links and archive navigation.
- `components/RecapFeatures.jsx`: conditional editorial spread within the existing Explore Insights design. With no records, it renders nothing; notes and perspectives retain their existing markup. Styles are isolated in `styles/recaps.css`, without modifying `summit.css` or transition code.
- `lib/social.js` and `social-vite-plugin.js`: same branded image, initial HTML metadata, canonical URLs and three variants. The uploader's exact namespace adds `recaps/<safe-slug>` only. HTML remains `text/html; charset=utf-8` with `no-cache,no-store,must-revalidate`; no CloudFront/workflow changes.
- Tests cover validation, zero/one/three records, real reference resolution, SSR markup/escaping, full-build draft and private-field isolation, invalid-build rejection, raw HTTP preview metadata/headers and safe withdrawal planning. Test fixtures are outside the production glob and temporary JSON is removed in `finally` cleanup. Never run builds concurrently with publication tests.

```sh
node --test --test-concurrency=1 src/summit/content/*.test.js src/summit/lib/*.test.js
pnpm build
node scripts/upload-summit-previews.mjs www.alexrussell.info dist --dry-run
```
