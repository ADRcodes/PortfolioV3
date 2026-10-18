# Content and directory refinement handoff — October 18, 2026

## Article metadata and summaries

External articles may explicitly store `startTime: null`, `endTime: null` and `location: null` when these facts are unverified or irrelevant. Both times must be null together; conference events retain strict time/location validation. Shared facts/meta/card components handle date-only articles and omit empty presenter placeholders generally, without slug-specific conditions. Empty facts do not leave a placeholder panel. Published external details show one “External editorial sample” dateline label and the normal AI-assisted editorial disclosure.

Will's stable ID/slug and complete `summary` object are preserved. Its date is October 13, 2026; title loses the test suffix, description names the existing five topics, and invented times/location are removed. `programme: external` still excludes it from official listings, counts, navigation and latest conference notes. This metadata-only edit updates `updatedAt` but does not publish it into conference summaries.

`RecentSummaries` now always provides its section. With no published conference records, it shows “Session notes coming soon” and a short introduction, without dummy cards or any recording promise. It automatically switches to one, two or up to three real notes, retaining newest-update ordering and external/draft exclusion.

Hooks: `.summit-notes-coming-soon`, `.summit-notes-coming-soon-copy`, `data-summary-state="coming-soon|published"`. Existing `.summit-recent-*` hooks remain.

## Directory markup

- `.summit-directory-toolbar[data-directory="speakers"]` groups search and the existing `.summit-sortbar`. Companies use a matching toolbar with `data-directory="companies"`. Visible labels, result status and URL `q`/`sort` remain. Use existing `--summit-header-height` and `--summit-nav-height` for sticky positioning; no new JS geometry or motion changes are needed. CSS owns sticky placement and resets the old sortbar/search standalone positioning.
- Speaker list retains `.summit-speaker-directory`, adding `.summit-directory-grid` and `data-directory="speakers"`. Rows retain `.summit-speaker-row`, adding `.summit-speaker-card` and `data-speaker`. `.summit-directory-portrait` allows small imagery. `.summit-speaker-bio-preview` adds a sentence-aware short biography without deleting source text. Profiles and search still use complete biographies.
- `.summit-speaker-sessions[data-directory-detail="presentations"]` stays available for desktop or optional display. CSS may hide it on phones. Individual profiles retain full linked sessions with time/location. Speaker name/profile, LinkedIn and company links remain independently accessible. The pre-existing session-list relocation outside speaker copy is preserved as another session's change.
- Companies retain `.summit-company-directory`, adding `.summit-company-grid`. Each `.summit-company-card[data-company]` contains `.summit-company-card-logo`, the full company name and the existing labelled profile link. Directory descriptions are omitted; full profile descriptions and search indexing remain.
- Company portrait containers and affiliation logo images expose `data-company` and `data-logo-background="light|dark"`. Portraits also expose `data-logo-availability="image|initials"`; text fallbacks use `.summit-logo-fallback`, retaining short uppercase abbreviations such as CBC.

Logo audit/provenance and unresolved rights/asset issues are in [content/SOURCES.md](content/SOURCES.md#logo-review--october-18-2026). JAC/Melotech/techNL need dark backing for their retained white assets; CBC now uses text. No new logo downloads or pixel modifications.

## Agenda and introduction

Agenda identities stay text-first, retaining every speaker/company relationship and independent link. Added `.summit-agenda-speaker-name`, `.summit-agenda-speaker-companies` and `data-speaker` for compact treatment. Avatars are deliberately omitted to keep four-column slots readable.

`.summit-intro-event` immediately follows the unchanged animated h1. `.summit-event-date` (with existing time elements) and `.summit-event-location` sit inside `.summit-event-details`, without the interpunct. `.summit-official-event-link` provides the single labelled official-site CTA. Personal copy is refined; independence disclosure and Explore agenda remain. No animation or CSS edits by the functionality session.

## Verification

All 51 tests passed with `node --test --test-concurrency=1 src/summit/content/*.test.js src/summit/lib/*.test.js`, including production-bundle discovery/privacy checks and zero/one/two/three recent summaries. `pnpm build` and whitespace checks passed. Existing pnpm preferences-access and Vite chunk-size warnings remain non-blocking. A structural JSON comparison verified that Will’s entire summary, ID, slug, status and external classification are unchanged.

Playwright MCP remained occupied; Computer Use in-app browser fallback verified the article, sticky search/sort wrappers, retained query/sort URL, desktop grid and phone directory/profile flows, full profile content, company search/cards, logo backgrounds/proportional containment, notes introduction, filtering and external isolation. The observed narrow viewport is approximately 390 CSS pixels; viewport overrides are reset after QA. CSS rendered in these checks belongs to the parallel design session and is excluded from this functionality commit. Screenshots remain local under `.codex/screenshots/summit-refinement-*`.
