# techNL Summit 2026 foundation

Independent conference notes site mounted at `/technlsummit`. The official 19–20 October 2026 programme is imported as upcoming events, with linked speaker and organization profiles. See [content/SOURCES.md](content/SOURCES.md) for provenance, registration qualifications and unresolved room details. The fictional demo sessions have been removed. Will’s meetup article remains accessible at its existing detail URL as an external editorial test (its recording is from October 13), excluded from official listings. Demonstration profiles remain in source for guide examples but are excluded from public directories and profile routes. See [LAUNCH_FUNCTIONALITY.md](LAUNCH_FUNCTIONALITY.md) for classification, navigation, filtering, search, sharing and social-preview findings.

## Structure

Static social previews are generated automatically during the normal build. See [SOCIAL_PREVIEWS.md](SOCIAL_PREVIEWS.md) for exact-key S3 uploads, slash handling, privacy and verification. No backend or client-head dependency is introduced.

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
- `/technlsummit/sessions` redirects to the agenda (legacy index URL).
- `/technlsummit/sessions/:slug`
- `/technlsummit/speakers`
- `/technlsummit/speakers/:slug`
- `/technlsummit/companies`
- `/technlsummit/companies/:slug`

Unknown summit paths, missing profiles and draft session URLs show the summit not-found page. Existing portfolio unknown-route behavior is unchanged. The existing CloudFront 403/404 fallback to `/index.html` supports direct deep links, with no workflow or infrastructure changes. A not-found page is client-rendered and inherits the existing HTTP 200 SPA fallback.

## Adding a session

Use [EDITORIAL_GUIDE.md](./EDITORIAL_GUIDE.md) as the source of truth for editorial standards and the full implemented article schema/example.

Create any uniquely named `.json` file directly in `content/sessions/`. `import.meta.glob('./sessions/*.json', { eager: true, import: 'default' })` discovers it automatically on the next build. There is no session registry, and no React edit is required. Restart the dev server after content edits if hot updates do not appear; a fresh build is the publishing check.

Exact session shape (`eventType` and `programme` default for legacy records; include them explicitly in new records. `recordingUrl` may be omitted or null):

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
  "eventType": "talk",
  "programme": "conference",
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
- External editorial articles may explicitly use `startTime: null`, `endTime: null` and `location: null` for date-only metadata. Both times must be null together. Official conference scheduling remains required. Shared article components hide absent facts and empty presenter placeholders.
- `date`: valid `YYYY-MM-DD`. Times are 24-hour `HH:mm`, in `America/St_Johns`. End time must follow start time on the same day. Overnight sessions are not supported in this phase.
- `speakerIds` and `companyIds`: arrays of existing profile IDs, empty arrays allowed. Missing references, duplicate IDs/slugs and malformed fields fail the build.
- `eventType`: `talk`, `panel`, `workshop`, `networking`, `registration`, `break` or `activity`; independent of publication status. Only the first three promise future notes.
- `programme`: `conference` for official schedule entries or `external` for an independent editorial article. External articles retain their public URL but are excluded from programme lists and counts.
- `status`: exactly `upcoming`, `draft` or `published`.
- `summary`: required plain-text `overview` and `keyTakeaways` array. Takeaways accept legacy strings or `{ "heading": "Optional heading", "explanation": "Required explanation" }`. Optional `detailedSummary` sections contain `heading`, nonempty `paragraphs` and optional `bullets`. Optional `notableIdeas` and `practicalApplications` remain string arrays. Missing/empty optional arrays are hidden; null/blank entries are invalid. No HTML or Markdown rendering. Published sessions require an overview and at least one takeaway.
- `recordingUrl`: optional absolute HTTP(S) URL or null. Only published sessions expose it. Confirm a source link is suitable for public sharing before including it.
- `updatedAt`: ISO timestamp including `Z` or an explicit timezone offset. Update it when publishing/editing; recent summaries sort by this timestamp.

A build-time Vite plugin validates content and replaces draft JSON with `null` before bundling. It removes summary/source fields entirely from upcoming JSON. Public pages and reverse relationships only use the resulting public records. Published summary text is rendered as escaped React text.

This excludes drafts from the production website and JavaScript, not from Git history or a public source repository. Keep genuinely confidential transcripts and recordings out of this repository. Do not import session files via alternate raw/URL mechanisms or move private JSON into `public/`.

## Speaker and company records

`speakers.json` and `companies.json` are arrays; public directories exclude explicitly flagged `demo: true` records (retained for guide references). Example speaker:

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

Names/descriptions/identities are required, `urls` can be empty. Images are optional HTTP(S) URLs with required nonempty `imageAlt` when set. Optional `logoBackground: "light" | "dark"` supplies an unchanged-image rendering hint for company marks. Speakers require `companyIds`, which may be empty. Add profiles before referencing their IDs. Associated sessions are derived from session `speakerIds`/`companyIds`, and company speakers from speaker `companyIds`. Do not maintain duplicate `sessionIds` arrays; adding one session file updates every associated profile automatically. Use explicit `companyIds` on sessions to record organizations relevant to that session, independently of a speaker's affiliations.

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

Verify agenda, speaker/company directories, both public session states, speaker/company profiles, their cross-links, invalid paths and draft `/technlsummit/sessions/demo-draft`. Confirm portfolio routes still render after using the footer link. Inspect mobile/desktop widths and keyboard focus. To test discovery, copy a sample to a new file, give it unique `id`/`slug`, rebuild, and visit its URL without changing React or profile JSON. Remove temporary data afterward.

## Extraction and deferred decisions

Copy `src/summit/`, install the same React/Vite/React Router stack, retain `summitContent()` in the new Vite config, and supply a `BrowserRouter` entry with these routes mounted at `/*`. Set `SUMMIT_BASE` in `routing/paths.js` to `''` for a root-hosted site. Replace the footer's local portfolio `Link` with an absolute `https://alexrussell.info/` link after extraction. The current local footer link preserves SPA navigation back to the portfolio.

Confirm real schedule, local timezone, content accuracy, branding/permission to use event assets and recording-link publication before launch. The shared HTML entry still carries portfolio favicon, description and social metadata; the summit sets/restores its document title only. Dedicated sharing metadata/favicon and final visual identity belong to the launch phase. No prominent portfolio link, AWS changes, workflow changes, push or deployment are included.


Current content/directory refinements and design hooks: [REFINEMENT_HANDOFF.md](REFINEMENT_HANDOFF.md). Recent notes now use an introductory coming-soon state until actual conference summaries exist; no dummy cards are rendered.


## Attendance and contribution requests

Edit `content/attendance.js` to change Alex’s selected session IDs. Overlap dates and times are read from the agenda; no attendance is inferred for dates without a selected session. The current selections are The Assumption Trap, Funding for Talent and Internal Innovation on Monday, October 19.

Unpublished presentations overlapping those selections show a compact “Help capture this session” notice below the normal notes placeholder. Attended sessions, registration, meals, networking, other activities and external articles are excluded. Publishing a session summary automatically hides its request. The notice asks attendees to respect speaker/event recording permissions and email transcripts to `alexrussellria@gmail.com`, rather than sharing public recording links. No upload service or new recording publication behavior is added.

The nine current requests cover AI and EDI in Hiring, LinkedIn That Works, Who Owns the Innovation?, Customer Success in the Age of AI, Legal Without the Handbrake, Scrappy Marketing for Startup Growth, Keeping Pace with Change, The ‘New’ Power of Brand in the Age of AI, and Leaving Money on the Table (SR&ED). The agenda currently places Funding for Talent in Bannerman Ballroom 1; attendance selection uses its ID and does not change this venue data.

## QR sharing

The right side of the top bar includes an accessible QR sharing button on desktop and mobile. It opens a native modal dialog with a high-contrast local SVG, readable public URL, Copy Link, native sharing when supported and a high-resolution QR download. The mobile bottom navigation and existing Summit animations remain unchanged. `styles/qr-share.css` scopes this addition separately from `summit.css`. Escape, the close button and backdrop dismiss the dialog; focus returns to its trigger and agenda scroll position is preserved. Clipboard denial exposes a selectable manual-copy field.

The encoded URL is exactly `https://alexrussell.info/technlsummit`. Versioned assets under `public/images/summit/` include a 2160 × 2160 PNG and a 1290 × 2796 iPhone wallpaper, with the QR below the clock/widget area. Keep the black/white contrast and four-module quiet zone. Do not add a decorative centre logo without rechecking scan reliability.

Regenerate assets with `node scripts/generate-summit-qr.mjs` after installing the project's development dependencies. `qrcode`, `pngjs` and independent decoder `jsqr` are development-only; none is bundled into the website. No QR generation service or new API is involved. Bump versioned filenames and the constants in `lib/share.js` if the encoded URL/artwork changes, since public image assets are cached immutably. Tests decode the committed PNG and wallpaper at mobile sizes; browser QA also decoded screenshots of the actual SVG rendering. Physical iPhone camera scanning and wallpaper crop settings still depend on the device.
