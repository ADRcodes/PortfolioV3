# Homepage Insights hierarchy review

October 27, 2026. Review branch: `codex/summit-insights-hierarchy`, based on GitHub main `124bdf0`.

## Design

- Compact section introduction describes editorial analysis. Equal-weight recap previews lead the section, followed by quieter speaker perspectives.
- Existing Oxblood & Limestone tokens, sharp borders and readable typography define the preview surfaces. One native link covers each entire preview, with an accessible article-title name and excerpt description; the visible reading action is part of that link.
- Grid columns adapt to available width, with no article limit or first-article promotion. A lone preview caps at 52rem. Dates and reading actions align at the bottom of desktop previews and wrap naturally on phones.
- Publication filtering, ordering, excerpts, routes and perspective eligibility/attribution are unchanged. Session notes remain in the agenda and its filters; the redundant Insights CTA is removed. Individual recap pages, content, shared transitions and other homepage sections are unchanged.

## Verification

- All 90 Node tests passed using `node --test --test-concurrency=1`. Rendering assertions cover zero/one/two/five recap records, ordering, full-preview link semantics, accessible naming/description, and articles preceding perspectives. Existing publication, attribution, routing and build-integration checks pass.
- `pnpm build` and `git diff --check` passed. The existing large-bundle warning remains.
- Playwright Chromium inspected the actual production preview at 1440, 1024, 820, 390 and 320px. No horizontal overflow or browser errors. Both published previews use the same heading size at each width; mobile reading actions and profile links remain readable and usable.
- Verified hover surface/border/title-underlining feedback, a visible keyboard focus ring, Enter navigation, clicking preview padding, speaker profile links, and the existing navigation-to-Insights anchor. Browser Back restored the exact previous agenda scroll position (740px in the recorded desktop check).
- Reduced-motion preview transitions compute to 0 seconds. One/three/five-article layout stress checks used temporary DOM copies of real previews, with no source fixtures or fictional content. All checked widths remained free of overflow.
- Local before/after screenshots are ignored in `.playwright-mcp/insights-review/`, including desktop/mobile, tablet, narrow mobile perspectives and keyboard focus. They are review artifacts, not production assets.

Safari, Firefox, physical devices and assistive-technology testing were not performed. No merge, push or deployment was performed for this refinement.
