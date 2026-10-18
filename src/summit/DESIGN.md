# Summit companion

## Purpose and direction

A conference companion for finding the next session and returning to the notes. The October 17 redesign follows Alex's explicit request for the typography, negative space and coordinated transitions of Zajno's Design Conference reference. See `docs/design-inspiration.md` for attributed visual evidence. This supersedes the earlier soft plum/lilac card system.

## Visual language

- Muted slate-green `#384b4b` canvas; broad warm-neutral `#e3e2d8` session panels; near-black `#181818` ink on panels. Supporting panel text `#51514e`.
- Use warm apricot `#efbc92` for the opening title, year, Up next, current-session markers and selection. Purple is excluded; colour is encouraged. The site is prominently named techNL Summit 2026 in its wordmark and opening heading.
- Arial/Helvetica sans typography, substantial weight/scale contrast, tight display spacing and readable metadata. Desktop article text and fact values are 18px; navigation is 16px and fact labels are 14px. Mobile article text is 17px and factual values are 16px. No external fonts or dependencies.
- Keep route top padding compact. Back navigation lives beside the event identity in the fixed header on every non-agenda route; date/status remain in the session content; avoid adding separate large margins above the title.
- Square surfaces and a consistent time rail. Agenda cards show location plus compact presenter/company identities; start and expected end times appear once in the rail. Detail headers and cards outside the agenda retain their own time. Presenter and company names are independent profile links in both cards and detail headers. The reading body has no redundant profile aside. Card descriptions move to the detail page, keeping the agenda concise.
- The homepage opens with the welcome on a fresh unanchored visit. The heading and personal note form one full-height opening composition, without navigation, date shortcuts, a clock or redundant byline. Alex Russell’s signature links to the portfolio, with a LinkedIn icon beside it. Anchor links, browser history and Up next still restore or select sessions. Navigation contains Agenda, Speakers, Companies and a contrasting filled Up next link. On phones it sits at the bottom. A fixed quick-scroll bar combines date shortcuts, a native session slider and previous/next buttons. It slides into view only when the first event starts passing under the header. There is no visible slider caption; its accessible label and selected-session value remain. Dragging or keyboard scrubbing scrolls immediately, ordinary scrolling updates the slider, and buttons use smooth scrolling with a reduced-motion alternative. The redundant Sessions directory and jump popup are removed; the old `/sessions` index redirects to the agenda, while session detail URLs remain unchanged.

## Motion grammar

The signature interaction is a session card expanding into a detail page. The browser View Transition API captures the existing route before React commits the next one. `useSummitTransition` holds the previous route through `Routes location`, so link clicks and browser Back/Forward share the same transition mechanism without changing the portfolio router.

- The agenda time rail shares its time snapshot with the detail header, while other metadata stays in the card.
- A separate background layer expands into the detail surface. It contains no text, preventing buttons and labels from stretching.
- Title, time, location, presenter and company each have matching shared snapshots and move independently toward their new positions. Names are assigned only to the selected session for the duration of a transition.
- Supporting content slides away. The action disappears with the old page. The summary fades and slides in after the title has begun settling.
- Shared geometry uses a 1.05-second ease-in-out. Exit runs for 600 ms; the summary enters over 650 ms after a 550 ms delay. The complete opening is about 1.2 seconds.
- Return navigation reverses the spatial relationship and restores agenda position. Returning to a matching card also restores keyboard focus to it.
- Presenter/company links carry the clicked name into the profile heading. Returning restores a visible matching name. Card-origin history is tracked so opening a session from a profile and returning still uses the card expansion, rather than substituting a profile-name transition. Other route changes use coordinated slide/fade transitions; persistent navigation stays anchored.
- The opening identity has three measured word positions: techNL, Summit and 2026. On scroll, one visible identity shrinks, clears the words horizontally and joins them on a single line in the header. The chrome slides down behind it. Resize measurements keep the actual heading and brand slots aligned. Scrolling back reverses the handoff; reduced motion uses a direct switch once the heading leaves view. The casing is techNL, and all three parts use the same size within each state. Scroll-linked card arrivals and moving navigation underlines use the same restrained easing vocabulary.
- Native scroll behavior remains intact. Clock updates never move the reader. Rapid navigation skips an obsolete animation rather than queuing journeys.

The native shared transition is progressive enhancement. Browsers without the view-transition CSS support receive a simpler route entrance. Reduced motion bypasses native transitions and disables CSS animation, transitions and smooth scrolling. Content remains readable without animation support. Initial page loads do not wait for an introductory sequence.

## Interaction and accessibility

- Each card is an article with a stretched session-title link. Presenter/company links sit independently above that hit area, so they never nest inside the session link. All links preserve keyboard, modifier-click and deep-link behavior.
- Time calculations use `America/St_Johns`. Publication status remains independent of schedule status. Simultaneous upcoming sessions retain equal emphasis.
- Browser history restores scroll; explicit agenda-return links center their session. Main content receives focus on route changes, with matching-card focus on animated returns.
- Up next is available from every Summit page, returns to the upcoming agenda anchor and scrolls smoothly when already on the agenda. Bottom navigation accounts for mobile safe areas.
- Text is semantic. The decorative split-letter heading is hidden from assistive technology and the heading has a complete accessible name.

## Content and development

Demonstration content remains until verified event content is ready. The preview banner was removed at Alex’s request; existing demo/test titles and descriptions still accurately identify their content. No automatic summary generation or live backend is implied.

The old preview on port 5173 can serve stale cached modules. The October 17 redesign preview runs at `http://127.0.0.1:5174/technlsummit`; restart that project process after edits when file watching does not update. No global configuration changes are required. Prefer Playwright MCP for QA; Computer Use is the fallback when that browser is occupied.

## Agenda density and navigation

Agenda cards have no fixed minimum height or separate action footer. A small title/status arrow reinforces that the card opens. All presenter and affiliation links remain available, arranged inline with wrapping; portraits remain in session details and speaker views. Use 16px card identities and 14px affiliations, without truncating people. Time and location use labelled-for-accessibility icons. Keep each time unbroken at every width, stack start/end on the desktop rail and show one horizontal range above phone cards.

The quick-scroll bar is fixed below the main header and hidden/inert until the first schedule slot begins passing it. It does not cover the welcome or persist onto other routes. Use the native range input's keyboard and pointer behavior (including Home/End); preserve focus on the control during scrubbing and announce the selected date/time/title with `aria-valuetext`. Every session, including simultaneous sessions, has a separate stop. The selected day follows scroll position. Empty or single-session schedules do not need the bar. Session centering accounts for the sticky controls and phone navigation; tall cards align below the controls rather than hiding their titles.

## Parallel sessions

Group sessions with the same date/start time into one schedule slot, retaining every session’s stable anchor and independent quick-scroll stop. Use four columns at 1200px and above, two on smaller desktops, and native horizontal scroll snapping at 800px and below. Mobile shows a peek of the next card, a count and previous/next buttons. There is no automatic rotation or vertical scroll interception. Keep carousel heights steady as users compare choices.

The quick-scroll slider tracks horizontal swipes as well as vertical scrolling. Selecting a session reveals its carousel card before centering the slot; returning from a detail page restores that same card before shared snapshots are named. Focus outlines sit inside the carousel’s clipping boundary. Resize observation updates the active mobile card after breakpoint changes.

## Message, directories and profiles

The welcome note is right-aligned, with the two practical lines set separately. Place the larger italic Georgia signature (portfolio link plus LinkedIn icon) before the independent-project disclosure. Georgia is used only for the personal closing, with the existing Arial system elsewhere.

The agenda browser has an opaque full-width background with content aligned to the page gutters, so scrolling cards cannot show through at its edges. Keep presenter/affiliation gaps tight within each identity. Carousel counters remain available to assistive technology; visible controls are labelled Previous/Next buttons with clear filled backgrounds.

Speaker sorting uses three sticky buttons: Presenting order (default), Name and Company, represented in the URL. Use substantially larger portraits. Presenting dates/times are plain text; only the session title links to the session. Desktop rows contain the full biography and do not open a profile. Mobile rows omit the biography and have a stretched profile link, with independent company/session/LinkedIn links above that hit area. Names are headings rather than name-only links.

Company rows are alphabetical and include available logos (initials when no image is supplied), descriptions, a visible detail arrow and desktop View company text. The full row is the detail link.

Both profiles use a split portrait/logo and pale editorial content surface, with a large title, affiliations, biography and relevant external links. LinkedIn is a framed action alongside the title. Filter the official programme link from the rendered profile, retaining source URLs in the data. Company profiles show associated speaker portraits next to names. Back is a real history action, with a directory fallback for direct visits. Keep the existing native shared-name and route transitions, responsive stacks and reduced-motion alternatives.


## Image scale and header navigation

Portraits and logos carry more visual weight: directory portraits are 384px on wide desktops, 320px on smaller desktops, 288px in split windows and 208px on phones. Phone speaker rows stack so the image does not squeeze the identity. Company directory logos are 224px desktop and 160px on smaller screens. Profile hero media occupies roughly half of the desktop composition and stacks on phones. Supporting speaker portraits are 96px in session details and 128px on company profiles; affiliation logos are 72px. Compact agenda identities stay text-only.

Use one icon-only, accessible Back button immediately before the header wordmark on every route except the agenda. It follows browser history with an agenda fallback for direct visits. There is no separate Back row in article content. The arrow slides in/out through its own native view-transition snapshot; the wordmark moves to its adjacent slot. Ordinary non-agenda navigation keeps the control steady. Initial/fallback entrance uses CSS, and reduced motion disables both pathways.


Company profile intros run edge to edge below the fixed header. Their related people and sessions retain the usual page gutters. Mobile navigation labels stay on one line; weighted columns give Companies enough width while Up next keeps its natural button width.
