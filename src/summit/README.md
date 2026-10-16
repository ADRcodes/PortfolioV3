# techNL Summit 2026 foundation

Independent conference notes site mounted at `/technlsummit`. All current content is fictional demonstration data, including dates, people, companies and AI summaries. Replace it before launch. Final identity and actual conference content are intentionally deferred.

## Structure

```
src/summit/
  components/         SummitLayout, SessionList, ContentLinks
  pages/              Home, Sessions, SessionDetail, Directory/Profile, NotFound
  routing/            SummitRoutes.jsx, paths.js
  styles/             summit.css (scoped rules and summit tokens)
  content/
    sessions/         one JSON file per session, automatically discovered
    speakers.json     speaker profiles and stable company references
    companies.json    company profiles
    index.js          glob discovery and relationship selectors
    model.js          validation and public-content projection
    vite-plugin.js    build-time validation and private-content exclusion
    model.test.js     Node tests, no new dependencies
```

Integration outside this directory consists of one sibling route in `src/App.jsx` and the content plugin in `vite.config.js`. No portfolio layout components are imported. Summit CSS uses `.summit-app` selectors and `--summit-*` tokens. Conditional `:has(.summit-app)` host rules suppress portfolio body decoration/backgrounds and its 320px minimum width only while the summit is mounted, avoiding colored scroll gutters and narrow-screen overflow. The portfolio restores automatically on exit. Shared Tailwind reset rules still apply, with explicit summit typography, lists, links, focus and selection styling. No global portfolio CSS was changed.

## Routes

- `/technlsummit`
- `/technlsummit/sessions`
- `/technlsummit/sessions/:slug`
- `/technlsummit/speakers`
- `/technlsummit/speakers/:slug`
- `/technlsummit/companies`
- `/technlsummit/companies/:slug`

Unknown summit paths, missing profiles and draft session URLs show the summit not-found page. Existing portfolio unknown-route behavior is unchanged. The existing CloudFront 403/404 fallback to `/index.html` supports direct deep links, with no workflow or infrastructure changes. A not-found page is client-rendered and inherits the existing HTTP 200 SPA fallback.

## Adding a session

Use [EDITORIAL_GUIDE.md](./EDITORIAL_GUIDE.md) as the source of truth for editorial standards and the full implemented article schema/example.

Create any uniquely named `.json` file directly in `content/sessions/`. `import.meta.glob('./sessions/*.json', { eager: true, import: 'default' })` discovers it automatically on the next build. There is no session registry, and no React edit is required. Restart the dev server after content edits if hot updates do not appear; a fresh build is the publishing check.

Exact session shape (all fields required except `recordingUrl`, which may be omitted or null):

```json
{
  "id": "session-demo-new",
  "slug": "demo-new-session",
  "title": "New session (demo)",
  "date": "2026-10-26",
  "startTime": "10:00",
  "endTime": "10:45",
  "location": "Demo room",
  "description": "Demonstration description to replace before launch.",
  "speakerIds": ["speaker-demo-jordan"],
  "companyIds": ["company-demo-labs"],
  "status": "upcoming",
  "summary": {
    "overview": "",
    "keyTakeaways": [],
    "notableIdeas": [],
    "practicalApplications": []
  },
  "recordingUrl": null,
  "updatedAt": "2026-10-16T12:00:00Z"
}
```

Rules:

- `id`: unique stable string. Do not rename when changing title or slug.
- `slug`: unique lowercase URL segment, letters/numbers separated by single hyphens.
- `date`: valid `YYYY-MM-DD`. Times are 24-hour `HH:mm`, in `America/St_Johns`. End time must follow start time on the same day. Overnight sessions are not supported in this phase.
- `speakerIds` and `companyIds`: arrays of existing profile IDs, empty arrays allowed. Missing references, duplicate IDs/slugs and malformed fields fail the build.
- `status`: exactly `upcoming`, `draft` or `published`.
- `summary`: required plain-text `overview` and `keyTakeaways` array. Takeaways accept legacy strings or `{ "heading": "Optional heading", "explanation": "Required explanation" }`. Optional `detailedSummary` sections contain `heading`, nonempty `paragraphs` and optional `bullets`. Optional `notableIdeas` and `practicalApplications` remain string arrays. Missing/empty optional arrays are hidden; null/blank entries are invalid. No HTML or Markdown rendering. Published sessions require an overview and at least one takeaway.
- `recordingUrl`: optional absolute HTTP(S) URL or null. Only published sessions expose it. Confirm a source link is suitable for public sharing before including it.
- `updatedAt`: ISO timestamp including `Z` or an explicit timezone offset. Update it when publishing/editing; recent summaries sort by this timestamp.

A build-time Vite plugin validates content and replaces draft JSON with `null` before bundling. It removes summary/source fields entirely from upcoming JSON. Public pages and reverse relationships only use the resulting public records. Published summary text is rendered as escaped React text.

This excludes drafts from the production website and JavaScript, not from Git history or a public source repository. Keep genuinely confidential transcripts and recordings out of this repository. Do not import session files via alternate raw/URL mechanisms or move private JSON into `public/`.

## Speaker and company records

`speakers.json` and `companies.json` are arrays; both directories are public. Example speaker:

```json
{
  "id": "speaker-demo-jordan",
  "slug": "demo-jordan-lee",
  "name": "Jordan Lee (demo)",
  "description": "Fictional demonstration speaker.",
  "companyIds": ["company-demo-labs"],
  "urls": [{ "label": "Website", "url": "https://example.com" }],
  "image": null,
  "imageAlt": ""
}
```

Example company:

```json
{
  "id": "company-demo-labs",
  "slug": "demo-labs",
  "name": "Demo Labs (demo)",
  "description": "Fictional demonstration organization.",
  "urls": [{ "label": "Website", "url": "https://example.com" }],
  "image": null,
  "imageAlt": ""
}
```

Names/descriptions/identities are required, `urls` can be empty. Images are optional HTTP(S) URLs with required nonempty `imageAlt` when set. Speakers require `companyIds`, which may be empty. Add profiles before referencing their IDs. Associated sessions are derived from session `speakerIds`/`companyIds`, and company speakers from speaker `companyIds`. Do not maintain duplicate `sessionIds` arrays; adding one session file updates every associated profile automatically. Use explicit `companyIds` on sessions to record organizations relevant to that session, independently of a speaker's affiliations.

## Recording-to-summary workflow

1. Read this guide and the relevant existing session/speaker/company JSON files.
2. Use the transcript to fill the summary fields; do not invent unsupported details.
3. Keep stable IDs and existing schedule fields unless correcting verified information.
4. Leave work in `draft` while editing, or keep a scheduled session `upcoming` until ready. Set `published` only when the finished summary is ready to appear publicly.
5. Update `updatedAt`, run the tests and build, and review the diff.
6. Follow the separately authorized GitHub commit/review process. A future push/merge to `main` triggers the existing deployment. This implementation does not add Pocket ingestion, GitHub automation, or credentials.

## Local development and verification

From the PortfolioV3 root, using Node 24 and existing pnpm dependencies:

```sh
pnpm dev --host 127.0.0.1
# Open http://127.0.0.1:5173/technlsummit

node --test --test-concurrency=1 src/summit/content/*.test.js
pnpm build
pnpm preview --host 127.0.0.1 --port 4173 --strictPort
# Open http://127.0.0.1:4173/technlsummit
```

Stop either server with Ctrl+C in the terminal that launched it. No separate summit build or server is needed.

Verify homepage, all three directories, both public session states, speaker/company profiles, their cross-links, invalid paths and draft `/technlsummit/sessions/demo-draft`. Confirm portfolio routes still render after using the footer link. Inspect mobile/desktop widths and keyboard focus. To test discovery, copy a sample to a new file, give it unique `id`/`slug`, rebuild, and visit its URL without changing React or profile JSON. Remove temporary data afterward.

## Extraction and deferred decisions

Copy `src/summit/`, install the same React/Vite/React Router stack, retain `summitContent()` in the new Vite config, and supply a `BrowserRouter` entry with these routes mounted at `/*`. Set `SUMMIT_BASE` in `routing/paths.js` to `''` for a root-hosted site. Replace the footer's local portfolio `Link` with an absolute `https://alexrussell.info/` link after extraction. The current local footer link preserves SPA navigation back to the portfolio.

Confirm real schedule, local timezone, content accuracy, branding/permission to use event assets and recording-link publication before launch. The shared HTML entry still carries portfolio favicon, description and social metadata; the summit sets/restores its document title only. Dedicated sharing metadata/favicon and final visual identity belong to the launch phase. No prominent portfolio link, AWS changes, workflow changes, push or deployment are included.
