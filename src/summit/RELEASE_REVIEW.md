# Release review — October 18, 2026

The tested working copy passes functional verification, but is **not ready to merge until the nine preserved baseline changes below are approved and committed**. The functionality and visual sessions' completed commits are present. No branch switch, merge, push, deployment, CSS edit or infrastructure change was performed during this review.

## Git state and scope

Reviewed branch: `codex/technl-summit-foundation`. Completed work includes:

| Commit | Work |
| --- | --- |
| `b3823af` | Event classification, conference/external isolation, timing, summaries, filtering, search and sharing |
| `2d02b8c` | Summit visual hierarchy and portfolio integration |
| `66388fb` | Editorial metadata and compact directory structure |
| `3adcffc` | Editorial reading and directory styling |
| `1e87097` | Intro actions and profile session dates |
| `50f5b75` | Welcome legibility and session metadata styling |

This review additionally fixes a reproduced `SessionSlot` crash: selecting the fourth simultaneous session, then filtering down to two published sessions, left its selected index outside the new array. Rendered selection, end time, live announcement and button actions now use a bounded index while the existing scroll observer catches up. No motion or styling changes were required.

Remote `main` was fetched read-only over HTTPS into `FETCH_HEAD`: `35aab3399bf19d880224a2ef0f4c8fa6fcbecd77`. Local `main` and the cached `origin/main` were stale at `1e50a6b`; they were not used as the release comparison. Remote main's tree equals the feature branch's common ancestor `e64a449`. The remote-only change is its previous merge commit; the six commits above contain the expected Summit and portfolio integration changes. Deployment workflow, dependencies, lockfile and Vite configuration are unchanged relative to fresh remote main.

`git merge-tree --write-tree FETCH_HEAD HEAD` reports no conflicts without changing either branch or the index. The working-copy baseline is an additional overlay, not part of that committed merge simulation; remote main has no content changes beyond the common ancestor that would conflict with it.

### Preserved changes requiring an ownership/release decision

These nine tracked files were already modified before this review, and their complete file hashes remained unchanged throughout it. The design chat confirmed that these changes also predate its refinement passes. They have been reviewed but left unstaged and uncommitted to respect the instruction to commit only this session's work.

| File | Remaining change |
| --- | --- |
| `docs/todo.md` | Earlier layout/footer completion notes |
| `memory-bank/decisions.md` | Earlier agenda/layout decisions |
| `memory-bank/progress.md` | Earlier implementation and verification notes |
| `src/summit/DESIGN.md` | Earlier agenda/detail layout guidance |
| `src/summit/components/AgendaBrowser.jsx` | Uses shared viewport geometry and removes visible count |
| `src/summit/components/SummitLayout.jsx` | Measures bottom navigation and adds correction/contact footer |
| `src/summit/lib/agenda.js` | Accounts for quick controls/bottom navigation when centering sessions |
| `src/summit/pages/Directory.jsx` | Moves presenting-session markup outside the biography wrapper |
| `src/summit/styles/summit.css` | Matching detail/profile/footer/mobile control layout |

The production build and browser checks include these changes. Merging only committed work would therefore omit part of the tested result. Do not discard them to obtain a clean checkout. `.codex/` contains local QA screenshots only and should remain outside the release commit.

## Verification

Full existing test suite: **53 passed, zero failed/skipped**:

```sh
node --test --test-concurrency=1 src/summit/content/*.test.js src/summit/lib/*.test.js
pnpm build
git diff --check
```

Run tests before the production build, rather than concurrently: the publication integration test temporarily creates and then removes JSON fixtures. The final build completed after those fixtures were removed. Vite's existing approximately 644 kB JS chunk warning remains non-blocking; no dependency or architecture changes were introduced.

Coverage includes schema/event messaging, draft and upcoming-content projection, production bundle privacy, automatic JSON discovery, zero/one/two/three recent summaries and update ordering, external/demo exclusion, speaker/company relationships and search normalization, URL sorting, canonical sharing/native cancellation/clipboard denial, and simulated Newfoundland timing before/during/between/after events, simultaneous sessions, overlapping slots and breaks.

### Local browser checks

Playwright MCP was unavailable because its browser profile was already occupied. Computer Use's Codex in-app browser was used instead, against the actual production build served on a separate local preview port. Desktop and narrow-screen checks verified:

- `/technlsummit`: 36 official events, date/venue/independence/official-site link, upcoming agenda destination, notes introduction, empty notes filter, and recovery of an agenda deep link whose target would otherwise be hidden by the filter.
- `/technlsummit/sessions/wills-ai-meetup-editorial-test`: stable direct URL, October 13 date, corrected title, one external-sample label, all five presentation sections, normal AI disclosure, and no invented time/location/presenter placeholder. It is absent from the official 36 events and latest notes.
- `/technlsummit/sessions/the-new-org-chart`: direct URL, four presenter/company relationships, scheduled metadata, upcoming publication message, and share control independent of publication status.
- `/technlsummit/speakers`: 74 public speakers; Mysa company association search, no-match message, URL-preserving name/company sorting and desktop profile navigation. Jordan Lee is absent.
- `/technlsummit/companies`: 62 public companies; Mysa name search and punctuation-tolerant full-description search for `temperature control`, accessible profile links and complete company profile descriptions/relationships. Demo Labs is absent.
- `/technlsummit/sessions` redirects to the agenda; an unavailable session shows the intended not-published/not-found page. Portfolio `/` and `/projects` render correctly.
- No console errors were observed on the final checked routes. Narrow article rendering had no horizontal document overflow. Browser viewport overrides were reset after verification.

An isolated temporary copy of the app, never the real content files, supplied two published sessions in the October 19 13:00 four-session slot. Before the fix, selecting card four and clicking Notes available produced `Cannot read properties of undefined (reading 'endTime')` and blanked the page. After restarting that isolated server with the fix, the same sequence rendered two articles, announced Session 2 of 2, disabled Next correctly, and Previous returned to Session 1 of 2. The recent section showed exactly the two conference summaries and excluded Will. This is a browser regression check, not an additional automated Node test.

The isolated copy also disabled native sharing for a test route to exercise the actual browser clipboard: it copied Will's canonical public URL and announced “Session link copied.” Simulated clipboard denial displayed an accessible selectable URL and the manual-copy explanation without console errors. Native sharing is covered by unit tests; completing a real operating-system share sheet remains a device smoke test. No share was sent to another person. All fixture changes stayed outside the repository and final build.

Screenshots are local under `.codex/screenshots/release-*`. They are evidence, not release assets.

## Outstanding limitations

- Approve and commit the nine baseline files before merging, then rerun the checks on the final committed/merged tree.
- Social crawlers still receive portfolio HTML metadata. Summit/session static previews were deliberately deferred; client-side metadata alone will not reliably fix crawlers. The previously recommended build-time route HTML solution still requires a separate reviewed deployment/routing change.
- Some organization images remain remote assets, and organizations without a trustworthy usable logo retain text/initials. Provenance and unresolved logo/rights questions are recorded in `content/SOURCES.md`; do not replace them with guessed assets.
- Local preview validates client routing, not production S3/CloudFront fallback/cache behavior. After an approved deployment, smoke-test direct session/profile URLs and asset loading on the live domain.
- Existing documentation contains historical layout/timing notes superseded by the current implementation and refinement handoff; treat current source and content as authoritative.

## Safe release sequence — for later authorization

The following commands are a handoff, **not commands executed by this review**. Stop the two editing sessions before changing branch state. First approve the nine-file baseline scope, inspect it, and commit those exact files:

```sh
git status --short
git diff -- docs/todo.md memory-bank/decisions.md memory-bank/progress.md src/summit/DESIGN.md src/summit/components/AgendaBrowser.jsx src/summit/components/SummitLayout.jsx src/summit/lib/agenda.js src/summit/pages/Directory.jsx src/summit/styles/summit.css
git add -- docs/todo.md memory-bank/decisions.md memory-bank/progress.md src/summit/DESIGN.md src/summit/components/AgendaBrowser.jsx src/summit/components/SummitLayout.jsx src/summit/lib/agenda.js src/summit/pages/Directory.jsx src/summit/styles/summit.css
git diff --cached --check
git diff --cached
git commit -m "Finalize reviewed Summit layout and navigation baseline"
```

Review status again. Tracked/index changes must be empty; local screenshot-only `.codex/` may remain untracked. Preserve and investigate any new changes rather than continuing blindly. Then, only when a merge is authorized:

```sh
git diff --exit-code
git diff --cached --exit-code
git fetch origin main
git merge-tree --write-tree FETCH_HEAD codex/technl-summit-foundation
git switch main
git merge --ff-only FETCH_HEAD
git merge --no-ff codex/technl-summit-foundation
node --test --test-concurrency=1 src/summit/content/*.test.js src/summit/lib/*.test.js
pnpm build
git diff --check
git status --short
```

Stop on any failed command or merge conflict. Repeat local direct-link smoke checks if the final merge changes content. Do not push on a failing test/build. Finally, **only after explicit production authorization**, publish:

```sh
git push origin main
```

That push automatically triggers `.github/workflows/deploy.yml`, which uploads the production build to S3, configures the existing CloudFront SPA fallback and invalidates the CDN. Wait for the Actions deployment to succeed, then check the live homepage, directories, a conference session and Will's direct URL. Never force-push or independently deploy a different local build.
