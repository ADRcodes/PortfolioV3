# Summit companion

## Current post-event experience (October 20, 2026)

The event has concluded. Preserve the existing animated identity, historical dates/venue, personal voice and shared-element transitions. “Explore insights” replaces live timing actions from every page and targets the homepage discovery section. That section is a cream editorial spread with a published-notes action and attributed speaker-perspective previews. The complete archive follows naturally below; redundant archive navigation and the expandable recently-published list have been removed. No recap placeholders are shown. The existing private attendance configuration orders only parallel cards and adds no public markers. Scoped presentation refinements live in `styles/hierarchy.css` and `styles/speaker-perspectives.css`. Compact font declarations in `summit.css` have a 14px floor; the title geometry and transition implementation remain unchanged. These decisions supersede historical live-session navigation descriptions below.

## Purpose and direction

A conference companion for finding the next session and returning to the notes. The October 17 redesign follows Alex's explicit request for the typography, negative space and coordinated transitions of Zajno's Design Conference reference. See `docs/design-inspiration.md` for attributed visual evidence. This supersedes the earlier soft plum/lilac card system.

## Visual language

- Owner-selected Oxblood & Limestone palette: deep oxblood `#43282e` canvas, limestone `#f1ede4` reading surfaces, warm ink `#2e2527` and secondary ink `#65585b`. This supersedes the historical slate-green/apricot references below.
- Use copper `#e4af83` for the opening title, year, primary actions and selection, with darker oxblood `#8a3846` for links on light surfaces. Purple is excluded; colour is encouraged. The site is prominently named techNL Summit 2026 in its wordmark and opening heading.
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


## Compact people and mobile agenda controls (October 18)

- Session and profile surfaces span the viewport and meet the fixed header directly. Session content keeps internal padding and a 90rem reading composition; profile follow-on sections keep page gutters.
- Detailed session presenters use three balanced columns on wide desktops and two on smaller screens. Phone presenter cards stack square portraits over independently linked names/affiliations. Compact agenda identities use a responsive text grid with quiet top rules and two phone columns, avoiding the long single presenter column.
- Directory portraits are 25% smaller on desktop (288px wide, 240px intermediate, 216px split-window); phone rows use 104px portraits, identity/company/LinkedIn to the right, and session links below. Preserve full desktop biographies, phone row navigation and independent links.
- The footer uses a darker slate surface, an apricot portfolio signature and a correction/removal contact note linking to alexrussellria@gmail.com.
- Mobile quick scrolling is one line above bottom navigation. Keep the October 19/20 shortcuts and keyboard-accessible native range/44px unboxed arrows; remove the visual count. October 21 remains readable in the feed/range but is not a conference-day shortcut. Desktop controls remain below the header.
- Measure actual mobile navigation height for the lower toolbar offset. Shared viewport calculations reserve the correct top/bottom controls during centering and scroll tracking. Preserve delayed reveal, reverse scrolling, range focus and reduced motion.

The active preview runs on port 5173. After the October 18 manual server restart, the normal Vite entry serves the latest design and stylesheet hot updates were confirmed through the browser WebSocket. The temporary production-build QA entry has been removed.


## Mobile session continuity (October 18)

Phone card journeys (up to 40rem) retain the native shared surface and title geometry, using a 760ms morph. Capture the viewport background instead of animating the document-height `summit-page` group: interpolating that group's agenda/detail coordinates produced a multi-thousand-pixel background sweep. Actual scroll restoration remains instant inside the snapshot update, before the destination is revealed. Back/Forward restore the original history entry; a phone Agenda link from a card detail also restores its recorded origin position. Carousel reveal still happens before capture.

The old and new title images share one moving box. Contain-fit preserves their captured wrapping and glyph proportions; the old title fades during 240–360ms and the destination appears during 360–520ms. Their ink never overlaps. Do not replace this with separate stationary title entrances or live font-size/width reflow. End-state typography is unchanged.

Card labels and facts fade out over 200ms. Destination labels/time/location enter after 440ms, presenters after 500ms, and article content after 500ms. A persistent surface underlay prevents a translucent-panel flash. The mobile navigation has its own fixed snapshot above the content. Scroll-driven identity/toolbar measurements resolve synchronously after restoration and before capture; the returning quick toolbar fades in during 760–960ms, after the surface settles.

These overrides activate only for phone session-card journeys. Desktop uses the original 1.05s shared-element motion, and directory/profile motion retains its existing geometry and scrolling. Reduced-motion and unsupported browsers take the immediate navigation path. Transition cleanup handles interruption and unmounting. No new animation dependency or scroll interception is introduced.


Phone title follow-up: card and detail headings now share a 28px font, 1.08 line height and a responsive measure that fits the narrower carousel cards. Compact event headings retain matching 22.4px/1.15 typography. Use ordinary wrapping on both sides: Chromium's pretty wrapping gave different lines for an inline link versus plain heading text despite identical width/type. This supersedes the earlier unchanged-end-state typography note for phone titles only. Desktop remains unchanged.

## Visual hierarchy refinement

Keep the slate green, cream and apricot palette, two-line identity and existing shared-element motion. Replace the forced full-viewport welcome with a content-sized composition: identity, quiet event details and a right-aligned personal welcome with one filled primary action. Retain “I built this little companion…” and the original playful AI disclosure, plus the linked signature. Keep the note, action and credit aligned right at phone sizes too. The primary action follows published-note availability rather than time; the external event link moves to the footer.

Use one cream lead dispatch and quieter recent-note rows before a clearly headed agenda. Published badges, titles and times lead; rooms, names and affiliations support them. Retain simultaneous groups, mobile title geometry and independent profile links. Article presenter rows use compact portraits, and native ordered takeaway markers/rules create reading breaks without shortening the article. Desktop profiles give more room to text; directory session links are grouped separately from biography previews. No new animation, imagery or disclosure control is introduced.

Focused overrides are in `styles/hierarchy.css`; transition geometry and phone card/detail title rules remain in `styles/summit.css`. Review screenshots and decisions: `docs/reviews/summit-hierarchy/index.html` and its README. The first draft was committed for local review. The owner subsequently requested restoring the personal voice/right alignment and explicitly authorized publishing the refinement to main.


## Post-event visual polish (October 21)

- Use a 14px minimum for compact visible labels and at least 16px for reading copy. Desktop welcome details are 20px, supporting invitation 22px, and the personal note scales to 38px; mobile keeps a 24px personal message, 18px invitation and readable 16px disclosure. Preserve the animated heading, right alignment and existing CTA/navigation behavior.
- Discovery is one square cream editorial spread, with a large title and notes action on the left and three structured speaker previews on the right. Each preview reuses an eligible perspective heading through the existing publication/attribution helper, without quoting or inventing new editorial content. It stacks edge-to-edge on phones and collapses to a single lead area when no perspectives are available. The composition can host future featured editorial content without reserving empty placeholder cards. The agenda retains its own green surface and heading after a clear gap. Published session summaries remain in the agenda and notes filter.
- Keep publication labels and their arrow in an unbroken inline-flex group; the whole group may move to a new row. At 320px the Explore insights navigation label uses two lines so the other 14px navigation labels retain comfortable, separate targets.
- Speaker profile heroes remain full width. Portrait regions cap at 448px, use a 4:5 frame and contain-fit artwork without cropping; mobile uses a bounded square frame. The cream background fills remaining header space instead of enlarging photographs indefinitely.
- Perspectives align a section-heading column with a wider reading column at desktop sizes and stack below 960px. Insight headings lead; source sessions, quotations/paraphrases, caveats and reading actions retain clear attribution and ordered spacing. No schema, source text, URL or publishing behavior changes.


## Oxblood & Limestone palette (October 27)

The owner selected this palette after reviewing four options. Colour roles are centralized in `summit.css` and shared by the hierarchy, recaps, perspectives, recording notice and QR-dialog styles. Root/background tokens apply only while the Summit is mounted; portfolio styling remains independent.

Use dark oxblood for the outer canvas/navigation, limestone for reading surfaces, copper for primary actions, and the readable darker oxblood counterpart for links on paper. Panel/workshop tints remain distinct within the same warm family. Hover, selected, copied, focus, input and backdrop states use the same roles. Company-logo surfaces remain neutral, and official artwork, QR modules, downloadable QR artwork and existing static social-preview assets retain their original colours.

The animated identity reads its source/target colours during measurement rather than interpolating obsolete hardcoded RGB endpoints. Geometry, timing, shared elements, responsive title wrapping and reduced-motion behavior remain unchanged. Palette tests check normal-text contrast (4.5:1), control boundaries (3:1) and detached literal colours across the Summit stylesheets.

## Recap-first Insights hierarchy (October 27)

The homepage Insights spread now opens with a compact title and one sentence describing cross-session analysis. Published recaps lead immediately below it, with equal typography, subtle square borders and one native link covering each complete preview. Existing publication ordering and excerpts remain authoritative. Auto-fit columns accommodate additional articles; a single article has a comfortable maximum width, and mobile previews stack with explicit reading actions. Hover and keyboard focus reinforce the full clickable area without introducing entrance or route animations.

Speaker perspectives form a smaller, separated row below the articles, retaining the existing eligibility helper, attributed headings and profile links. The redundant session-notes CTA and preparation message are removed from discovery; the agenda and its filters retain access to session notes. Individual recap pages and their editorial content are unchanged. See `docs/reviews/summit-insights-hierarchy.md` for validation.
