import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router';
import { createServer } from 'vite';

let server;
let SessionSummary;
let SessionCard;
let SessionDetail;
let Home;
let Directory;
let Profile;
let content;
before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  SessionSummary = (await server.ssrLoadModule('/src/summit/components/SessionSummary.jsx')).default;
  SessionCard = (await server.ssrLoadModule('/src/summit/components/SessionCard.jsx')).default;
  SessionDetail = (await server.ssrLoadModule('/src/summit/pages/SessionDetail.jsx')).default;
  Home = (await server.ssrLoadModule('/src/summit/pages/Home.jsx')).default;
  ({ Directory, Profile } = await server.ssrLoadModule('/src/summit/pages/Directory.jsx'));
  content = await server.ssrLoadModule('/src/summit/content/index.js');
});
after(async () => { await server?.close(); });
const render = summary => renderToStaticMarkup(createElement(SessionSummary, { summary }));

test('structured article renders in reading order, with paragraphs and optional bullets', () => {
  const html = render({
    overview: 'Overview text',
    keyTakeaways: [{ heading: 'Takeaway heading', explanation: 'Takeaway explanation' }, { explanation: 'Unheaded explanation' }, 'Legacy takeaway'],
    detailedSummary: [
      { heading: 'First section', paragraphs: ['First paragraph', 'Second paragraph'], bullets: ['Supporting bullet'] },
      { heading: 'Second section', paragraphs: ['Final paragraph'] },
    ],
    notableIdeas: ['Notable observation'],
    practicalApplications: ['Practical action'],
  });
  const sequence = ['Quick overview', 'Overview text', 'Key takeaways', 'Takeaway heading', 'Takeaway explanation', 'Unheaded explanation', 'Legacy takeaway', 'Detailed summary', 'First section', 'First paragraph', 'Second paragraph', 'Supporting bullet', 'Second section', 'Final paragraph', 'Notable insights', 'Notable observation', 'Practical applications', 'Practical action'];
  let previous = -1;
  for (const text of sequence) {
    const position = html.indexOf(text);
    assert.ok(position > previous, `Expected ${text} after the previous article element`);
    previous = position;
  }
  assert.ok(html.includes('<h3>Takeaway heading</h3>'));
  assert.ok(html.includes('<p>Takeaway explanation</p>'));
});

test('legacy summaries render and missing or empty optional sections disappear', () => {
  for (const optional of [{}, { detailedSummary: [], notableIdeas: [], practicalApplications: [] }]) {
    const html = render({ overview: 'Legacy overview', keyTakeaways: ['Legacy insight'], ...optional });
    assert.ok(html.includes('Legacy insight'));
    for (const heading of ['Detailed summary', 'Notable insights', 'Practical applications', 'None recorded.']) assert.ok(!html.includes(heading));
  }
});

test('article text is escaped rather than interpreted as HTML', () => {
  const html = render({ overview: '<script>alert(1)</script>', keyTakeaways: [{ heading: '<img>', explanation: '<b>Text</b>' }] });
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('&lt;b&gt;Text&lt;/b&gt;'));
});

test('cards expose independent session, presenter and company links without nested anchors', () => {
  const session = content.sessions.find(item => item.speakerIds.length && item.companyIds.length);
  const html = renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(SessionCard, { session, clock: { date: '2026-10-17', time: '10:45' } })));
  const speaker = content.allSpeakers.find(item => session.speakerIds.includes(item.id));
  const company = content.allCompanies.find(item => session.companyIds.includes(item.id));
  for (const path of [`sessions/${session.slug}`, `speakers/${speaker.slug}`, `companies/${company.slug}`]) {
    assert.ok(html.includes(`href="/technlsummit/${path}"`), `Missing independently reachable ${path}`);
  }
  let depth = 0;
  for (const [tag] of html.matchAll(/<\/?a\b[^>]*>/g)) {
    depth += tag.startsWith('</') ? -1 : 1;
    assert.ok(depth >= 0 && depth <= 1, 'Interactive anchors must not nest');
  }
  assert.equal(depth, 0);
});

test('agenda cards keep every profile link but leave time to the rail and portraits to details', () => {
  const session = content.sessions.reduce((most, item) => item.speakerIds.length > most.speakerIds.length ? item : most);
  const renderCard = agenda => renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(SessionCard, { session, agenda, clock: { date: '2026-10-17', time: '10:45' } })));
  const agenda = renderCard(true);
  const profile = renderCard(false);
  assert.ok(!agenda.includes('data-shared="time"'));
  assert.ok(profile.includes('data-shared="time"'));
  assert.ok(!agenda.includes('<img'));
  assert.ok(agenda.includes('Location: '));
  for (const speaker of content.allSpeakers.filter(item => session.speakerIds.includes(item.id))) {
    assert.ok(agenda.includes(`data-profile="speakers/${speaker.slug}"`));
    for (const company of content.allCompanies.filter(item => speaker.companyIds.includes(item.id))) {
      assert.ok(agenda.includes(`data-profile="companies/${company.slug}"`));
    }
  }
});

test('session detail keeps linked presenter and company in its header, without an aside', () => {
  const session = content.sessions.find(item => item.speakerIds.length && item.companyIds.length);
  const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit/sessions/${session.slug}`] },
    createElement(Routes, null, createElement(Route, { path: '/technlsummit/sessions/:slug', element: createElement(SessionDetail) }))));
  const contentStart = html.indexOf('class="summit-detail-content"');
  assert.ok(contentStart > 0);
  const header = html.slice(0, contentStart);
  assert.ok(header.includes('href="/technlsummit/speakers/'));
  assert.ok(header.includes('href="/technlsummit/companies/'));
  assert.ok(!html.includes('<aside'));
});

test('speaker directory offers three sort buttons with bios, plain presenting times and independent links', () => {
  const renderDirectory = query => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit/speakers${query}`] }, createElement(Directory, { type: 'speakers' })));
  const byOrder = renderDirectory('');
  const byName = renderDirectory('?sort=name');
  const byCompany = renderDirectory('?sort=company');
  const position = (html, slug) => html.indexOf(`data-profile="speakers/${slug}"`);
  assert.ok(position(byName, 'adam-walsh') < position(byName, 'amanda-harris'));
  assert.ok(position(byCompany, 'amanda-harris') < position(byCompany, 'adam-walsh'));
  assert.ok(byName.includes('Presenting at 10:00 AM on Monday'));
  assert.ok(byName.includes('href="/technlsummit/sessions/up-next-in-tech"'));
  assert.ok(byName.includes('on LinkedIn (opens in a new tab)'));
  assert.ok(byName.includes('loading="lazy"'));
  assert.ok(!byName.includes('<select'));
  assert.ok(byOrder.includes('aria-pressed="true">Presenting order'));
  assert.ok(position(byOrder, 'daniel-mccarthy') < position(byOrder, 'amanda-harris'));
  assert.ok(byName.includes('summit-speaker-bio-preview'));
  assert.ok(byName.includes('<span class="summit-speaker-session-time">Presenting at'));
  assert.ok(byName.includes('class="summit-speaker-profile-link"'));
});

test('profiles leave back navigation to the header, omit programme links and place LinkedIn with the identity', () => {
  for (const [type, slug] of [['speakers', 'zach-green'], ['companies', 'mysa']]) {
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit/${type}/${slug}`] },
      createElement(Routes, null, createElement(Route, { path: `/technlsummit/${type}/:slug`, element: createElement(Profile, { type }) }))));
    assert.ok(!html.includes('class="summit-back-link"'));
    assert.ok(!html.includes('class="summit-header-back"'));
    assert.ok(!html.includes('href="https://technl.ca/technlsummit26/"'));
    assert.ok(html.includes('class="summit-profile-hero"'));
    if (type === 'companies') {
      const people = html.slice(html.indexOf('class="summit-profile-people"'));
      assert.ok(people.includes('<img') && people.includes('data-profile="speakers/'));
    }
    if (type === 'speakers') {
      assert.ok(html.includes('aria-label="Zach Green on LinkedIn (opens in a new tab)"'));
      assert.ok(!html.includes('>LinkedIn (new tab)</a>'));
    }
  }
});

test('sessions retain organization links when no presenter is assigned', () => {
  const session = content.sessions.find(item => item.slug === 'coffee-and-networking');
  const html = renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(SessionCard, { session, clock: { date: '2026-10-17', time: '10:45' } })));
  assert.ok(html.includes('href="/technlsummit/companies/cgi"'));
  assert.ok(!html.includes('data-shared="company"'));
});

test('multiple presentations have a linked overview, numbered headings and fully visible optional detail', () => {
  const speaker = { id: 'speaker-demo-jordan', slug: 'demo-jordan-lee' };
  const summary = { overview: 'Session overview', keyTakeaways: [{ heading: 'A finding', explanation: 'Its meaning.' }], presentations: [
    { title: 'First presentation', speakerIds: [speaker.id], explanation: 'First explanation',
      highlightedInsight: { heading: 'A qualified insight', explanation: 'Only in this experiment.' },
      sections: [{ heading: 'Supporting evidence', paragraphs: ['A supporting paragraph'], bullets: ['A useful qualification'] }] },
    { title: 'Second presentation', explanation: 'Second explanation' },
  ] };
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SessionSummary, { summary })));
  const nav = html.slice(html.indexOf('<nav'), html.indexOf('</nav>'));
  assert.ok(nav.includes('First presentation') && nav.includes('Second presentation'));
  assert.ok(nav.includes('href="#session-presentation-1"'));
  assert.ok(html.includes('id="session-presentation-1"'));
  assert.ok(html.includes('id="session-presentation-2"'));
  assert.ok(html.includes('>01</span>') && html.includes('>02</span>'));
  for (const text of ['First explanation', 'A qualified insight', 'Only in this experiment.', 'Supporting evidence', 'A supporting paragraph', 'A useful qualification', 'Second explanation']) assert.ok(html.includes(text));
  assert.ok(html.includes(`href="/technlsummit/speakers/${speaker.slug}"`));
  assert.ok(!html.includes('<details') && !/\shidden(?:=|>|\s)/.test(html));
});

test('short presentations omit empty sections, retain escaping and need no overview index', () => {
  const html = render({ overview: 'Overview', keyTakeaways: ['Legacy insight'], presentations: [{ title: '<script>Title</script>', explanation: 'Brief demo', sections: [] }], highlightedInsight: { explanation: '<b>A finding</b>' } });
  assert.ok(!html.includes('<nav') && !html.includes('Detailed summary'));
  assert.ok(html.includes('&lt;script&gt;Title&lt;/script&gt;'));
  assert.ok(html.includes('&lt;b&gt;A finding&lt;/b&gt;'));
  assert.ok(!html.includes('summit-article-section'));
});

test('agenda groups parallel choices without losing individual session anchors or links', () => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Home)));
  assert.ok(html.includes('aria-label="4 simultaneous sessions at 1:00 PM"'));
  assert.equal((html.match(/data-session="/g) ?? []).length, content.conferenceSessions.length);
  for (const session of content.conferenceSessions) {
    assert.equal(html.split(`id="agenda-${session.id}"`).length - 1, 1);
    assert.ok(html.includes(`href="/technlsummit/sessions/${session.slug}"`));
  }
});

test('company directory provides logos and independently labelled detail links', () => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Directory, { type: 'companies' })));
  assert.ok(html.includes('summit-company-directory summit-company-grid'));
  assert.ok(html.includes('<img'));
  assert.ok(html.includes('aria-label="View Mysa"'));
  assert.ok(html.includes('href="/technlsummit/companies/mysa"'));
  assert.ok(!html.includes('demo-labs'));
  assert.ok(html.indexOf('data-profile="companies/airtable"') < html.indexOf('data-profile="companies/mysa"'));
});


test('official agenda excludes external samples and filters current publication states with accessible controls', () => {
  const home = query => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit${query}`] }, createElement(Home)));
  const html = home('');
  assert.ok(!html.includes('wills-ai-meetup-editorial-test'));
  const published = content.conferenceSessions.filter(session => session.status === 'published');
  assert.equal(html.includes('Session notes are still being prepared.'), published.length === 0);
  assert.equal(html.includes('summit-recent-item'), published.length > 0);
  assert.ok(html.includes('October 19') && html.includes('St. John’s Convention Centre'));
  assert.ok(html.includes('Explore insights'));
  const notes = home('?view=notes');
  assert.equal(notes.includes('No conference notes published yet.'), published.length === 0);
  for (const session of content.conferenceSessions) assert.equal(notes.includes(`data-session="${session.slug}"`), session.status === 'published', session.slug);
  assert.ok(notes.includes('data-agenda-filter="notes" aria-pressed="true"'));
  const unpublished = content.conferenceSessions.find(session => session.status !== 'published');
  if (unpublished) {
    const anchored = home('?view=notes#agenda-' + unpublished.id);
    assert.ok(anchored.includes(`id="agenda-${unpublished.id}"`));
  }
});
test('each event type has accurate publication messaging in cards and detail pages', () => {
  for (const eventType of ['talk', 'panel', 'workshop', 'registration', 'break', 'networking', 'activity']) assert.ok(content.conferenceSessions.some(item => item.eventType === eventType));
  for (const session of content.conferenceSessions) {
    const { eventType } = session;
    const card = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SessionCard, { session, clock: { date: '2026-10-18', time: '12:00' } })));
    const detail = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit/sessions/${session.slug}`] }, createElement(Routes, null, createElement(Route, { path: '/technlsummit/sessions/:slug', element: createElement(SessionDetail) }))));
    const expected = session.status !== 'published' && ['talk', 'panel', 'workshop'].includes(eventType);
    assert.equal(card.includes('Notes to follow'), expected);
    assert.equal(detail.includes('Notes to follow'), expected);
    assert.ok(card.includes(`data-event-type="${eventType}"`));
    assert.ok(detail.includes('Share session'));
    assert.equal(detail.includes('Quick overview'), session.status === 'published');
  }
});
test('Will’s article remains readable with its five presentations and sharing control', () => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/technlsummit/sessions/wills-ai-meetup-editorial-test'] }, createElement(Routes, null, createElement(Route, { path: '/technlsummit/sessions/:slug', element: createElement(SessionDetail) }))));
  assert.ok(html.includes('External editorial sample'));
  assert.ok(html.includes('id="session-presentation-5"'));
  assert.ok(html.includes('Share session'));
});
test('speaker profiles show opted-in perspectives with current article links; other profiles stay unchanged', () => {
  const profile = (type, slug) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit/${type}/${slug}`] }, createElement(Routes, null, createElement(Route, { path: `/technlsummit/${type}/:slug`, element: createElement(Profile, { type }) }))));
  for (const speaker of content.directorySpeakers.filter(speaker => speaker.summitPerspectives?.length)) {
    const html = profile('speakers', speaker.slug);
    assert.ok(html.includes('Perspectives from the Summit'));
    for (const perspective of speaker.summitPerspectives) {
      assert.ok(html.includes(perspective.summary.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&#x27;').replaceAll('"', '&quot;')));
      assert.ok(html.includes(`href="/technlsummit/sessions/${perspective.sessionSlug}"`));
      if (perspective.quote) {
        assert.ok(html.includes(perspective.quote.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&#x27;').replaceAll('"', '&quot;')));
        assert.ok(html.includes('Machine-transcript excerpt; not checked against the original audio.'));
        assert.ok(html.includes('<blockquote>'));
        assert.ok(html.includes('<figcaption>— '));
      } else {
        assert.ok(html.includes('Paraphrased perspective: '));
      }
    }
    assert.ok(html.includes('Read the full session notes'));
    assert.ok(html.includes('At the Summit'));
    assert.ok(!html.includes('<time dateTime="undefined"'));
  }
  for (const speaker of content.directorySpeakers.filter(speaker => !speaker.summitPerspectives?.length)) {
    const legacy = profile('speakers', speaker.slug);
    assert.ok(legacy.includes('At the Summit'), speaker.slug);
    assert.ok(!legacy.includes('Perspectives from the Summit'), speaker.slug);
  }
  assert.ok(!profile('companies', 'mysa').includes('Perspectives from the Summit'));
});

test('perspective rendering escapes text, supports optional dates, and hides withdrawn or unrelated notes', async () => {
  const Perspectives = (await server.ssrLoadModule('/src/summit/components/SpeakerPerspectives.jsx')).default;
  const speaker = { id: 'speaker-test', summitPerspectives: [{ sessionSlug: 'source-session', heading: '<b>A label</b>', summary: '<script>Untrusted text</script>', publishedAt: '2026-10-19T18:00:00Z' }] };
  const session = { slug: 'source-session', title: 'Real <article> title', status: 'published', speakerIds: [speaker.id] };
  const render = (speaker, sessions) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Perspectives, { speaker, sessions })));
  const html = render(speaker, [session]);
  assert.ok(html.includes('Real &lt;article&gt; title'));
  assert.ok(html.includes('&lt;b&gt;A label&lt;/b&gt;'));
  assert.ok(html.includes('&lt;script&gt;Untrusted text&lt;/script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('<time dateTime="2026-10-19T18:00:00Z"'));
  assert.ok(html.includes('href="/technlsummit/sessions/source-session"'));
  assert.ok(!html.includes('<blockquote>'));
  const quoted = render({ ...speaker, name: 'Speaker <name>', summitPerspectives: [{ ...speaker.summitPerspectives[0], quote: '<script>A fictional test quote</script>' }] }, [session]);
  assert.ok(quoted.includes('<blockquote><p>“&lt;script&gt;A fictional test quote&lt;/script&gt;”</p></blockquote>'));
  assert.ok(quoted.includes('<figcaption>— Speaker &lt;name&gt;'));
  assert.ok(quoted.includes('Machine-transcript excerpt; not checked against the original audio.'));
  assert.ok(quoted.includes('Source: '));
  assert.ok(!quoted.includes('Paraphrased perspective: '));
  assert.ok(html.includes('Paraphrased perspective: '));
  assert.ok(!quoted.includes('<script>'));
  for (const status of ['upcoming', 'draft']) assert.equal(render(speaker, [{ ...session, status }]), '');
  assert.equal(render(speaker, [{ ...session, speakerIds: [] }]), '');
  assert.equal(render(speaker, []), '');
  assert.equal(render({ id: speaker.id }, [session]), '');
  assert.equal(render({ ...speaker, summitPerspectives: [] }, [session]), '');
});

test('session details show a distinct transcript request only for eligible unattended Monday presentations', async () => {
  const { needsRecordingRequest } = await server.ssrLoadModule('/src/summit/lib/attendance.js');
  let requests = 0;
  for (const session of content.sessions) {
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit/sessions/${session.slug}`] }, createElement(Routes, null, createElement(Route, { path: '/technlsummit/sessions/:slug', element: createElement(SessionDetail) }))));
    const eligible = needsRecordingRequest(session, content.sessions);
    assert.equal(html.includes('Help capture this session'), eligible, session.slug);
    if (!eligible) continue;
    requests++;
    assert.ok(html.includes('Notes to follow.'));
    assert.ok(html.indexOf('Help capture this session') > html.indexOf('Notes to follow.'));
    assert.ok(html.includes('aria-labelledby="summit-recording-request-title"'));
    assert.ok(html.includes('href="mailto:alexrussellria@gmail.com"'));
    for (const text of ['Voice Memos', '(on supported devices)', 'recording permissions', 'send transcripts rather than public recording links']) assert.ok(html.includes(text), text);
  }
  assert.equal(requests, content.sessions.filter(session => needsRecordingRequest(session, content.sessions)).length);
});

test('publishing an affected session replaces the request with its summary', () => {
  const session = content.sessions.find(item => item.slug === 'linkedin-that-works');
  const original = { ...session };
  try {
    session.status = 'published';
    session.summary = { overview: 'Published LinkedIn insights.', keyTakeaways: ['A useful takeaway.'] };
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit/sessions/${session.slug}`] }, createElement(Routes, null, createElement(Route, { path: '/technlsummit/sessions/:slug', element: createElement(SessionDetail) }))));
    assert.ok(html.includes('Published LinkedIn insights.'));
    assert.ok(!html.includes('Help capture this session'));
    assert.ok(!html.includes('Notes to follow.'));
  } finally {
    delete session.summary;
    Object.assign(session, original);
  }
});
test('directories exclude fictional profiles, search affiliations, names and biographies, and expose empty states', () => {
  const directory = (type, query) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit/${type}?q=${encodeURIComponent(query)}`] }, createElement(Directory, { type })));
  assert.ok(!directory('speakers', '').includes('demo-jordan-lee'));
  assert.ok(!directory('companies', '').includes('demo-labs'));
  const companyMatches = directory('speakers', 'MYSA');
  assert.ok(companyMatches.includes('zach-green'));
  assert.ok(!companyMatches.includes('adam-walsh'));
  assert.ok(directory('speakers', 'Falon Okeefe').includes('falon-o-keefe'));
  assert.ok(directory('companies', 'zzzzzzzzzzzz').includes('0 companies found. Try another name or keyword.'));
  assert.ok(directory('speakers', 'zzzzzzzzzzzz').includes('0 speakers found. Try another name or keyword.'));
});


test('recent summaries render newest first with speaker, timestamp, excerpt and article links', async () => {
  const Recent = (await server.ssrLoadModule('/src/summit/components/RecentSummaries.jsx')).default;
  const base = content.conferenceSessions.find(session => session.speakerIds.length);
  const records = ['2026-10-20T12:00:00Z', '2026-10-20T16:00:00Z', '2026-10-20T14:00:00Z', '2026-10-20T13:00:00Z'].map((updatedAt, index) => ({ ...base, id: `recent-${index}`, slug: `recent-${index}`, title: `Recent ${index}`, status: 'published', updatedAt, summary: { overview: `Useful excerpt ${index}` } }));
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Recent, { sessions: [...records, { ...records[0], id: 'external', programme: 'external' }] })));
  assert.ok(html.indexOf('Recent 1') < html.indexOf('Recent 2'));
  assert.ok(html.indexOf('Recent 2') < html.indexOf('Recent 3'));
  assert.ok(!html.includes('Recent 0'));
  assert.ok(html.includes('Useful excerpt 1'));
  assert.ok(html.includes('dateTime="2026-10-20T16:00:00Z"'));
  assert.ok(html.includes('href="/technlsummit/sessions/recent-1"'));
  assert.ok(html.includes(content.allSpeakers.find(speaker => base.speakerIds.includes(speaker.id)).name));
});


test('external articles use date-only facts without invented time, place or presenter placeholders', async () => {
  const session = content.sessions.find(item => item.slug === 'wills-ai-meetup-editorial-test');
  assert.equal(session.date, '2026-10-13');
  assert.equal(session.title, "Will's AI Meetup: Five AI Talks & Demos");
  const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit/sessions/${session.slug}`] }, createElement(Routes, null, createElement(Route, { path: '/technlsummit/sessions/:slug', element: createElement(SessionDetail) }))));
  assert.ok(html.includes('Tuesday, October 13, 2026'));
  assert.equal(html.split('External editorial sample').length - 1, 1);
  for (const text of ['To be announced', 'data-shared="time"', 'data-shared="place"', '(test article)', 'Editorial layout test', 'illustrative']) assert.ok(!html.includes(text), text);
  assert.ok(html.includes('Independent, AI-assisted summary.'));
  // The behavior also applies to another external article without profile relationships.
  const Facts = (await server.ssrLoadModule('/src/summit/components/SessionFacts.jsx')).default;
  const facts = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Facts, { session: { ...session, id: 'unrelated-external', slug: 'unrelated-external' } })));
  assert.ok(!facts.includes('To be announced') && !facts.includes('Presenters'));
  const Card = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SessionCard, { session, clock: { date: '2026-10-13', time: '12:00' } })));
  assert.ok(Card.includes('Editorial article'));
});
test('archive discovery handles zero to three recent summaries without external articles or fictional entries', async () => {
  const Recent = (await server.ssrLoadModule('/src/summit/components/RecentSummaries.jsx')).default;
  const base = { ...content.conferenceSessions[0], status: 'published', summary: { overview: 'A useful published insight.' } };
  const external = content.sessions.find(item => item.programme === 'external');
  for (const count of [0, 1, 2, 3, 4]) {
    const records = Array.from({ length: count }, (_, index) => ({ ...base, id: `real-${index}`, slug: `real-${index}`, title: `Real article ${index}`, updatedAt: `2026-10-20T1${index}:00:00Z` }));
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Recent, { sessions: [...records, external] })));
    assert.equal(html.includes('Session notes are still being prepared.'), count === 0);
    assert.equal((html.match(/class="summit-recent-item"/g) ?? []).length, Math.min(count, 3));
    assert.ok(!html.includes('wills-ai-meetup-editorial-test'));
    assert.ok(!html.includes('recording'));
  }
});
test('directory tools share one wrapper, compact previews retain full profiles and presentation relationships', () => {
  const directory = type => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Directory, { type })));
  const speakers = directory('speakers');
  const toolsStart = speakers.indexOf('class="summit-directory-toolbar"');
  const listStart = speakers.indexOf('class="summit-speaker-directory');
  const tools = speakers.slice(toolsStart, listStart);
  assert.ok(tools.includes('Search speakers') && tools.includes('Sort speakers'));
  assert.ok(speakers.includes('summit-speaker-card') && speakers.includes('summit-directory-portrait'));
  assert.ok(speakers.includes('data-directory-detail="presentations"'));
  const speaker = content.directorySpeakers.find(item => item.description.length > 220 && content.sessionsForSpeaker(item.id).length);
  const profile = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit/speakers/${speaker.slug}`] }, createElement(Routes, null, createElement(Route, { path: '/technlsummit/speakers/:slug', element: createElement(Profile, { type: 'speakers' }) }))));
  assert.ok(profile.includes(speaker.description.replaceAll('&', '&amp;').replaceAll("'", '&#x27;')));
  assert.ok(profile.includes(content.sessionsForSpeaker(speaker.id)[0].title.replaceAll('&', '&amp;')));
  const companies = directory('companies');
  assert.ok(companies.includes('Company directory tools'));
  assert.ok(companies.includes('summit-company-grid') && companies.includes('summit-company-card-logo'));
  assert.ok(!companies.includes(content.directoryCompanies.find(item => item.slug === 'mysa').description));
  for (const slug of ['jac', 'melotech', 'technl']) assert.ok(companies.includes(`data-company="${slug}" data-logo-background="dark"`));
  assert.ok(companies.includes('src="/images/summit/companies/cbc-v1.svg"'));
});
test('intro keeps secondary event details and a compact personal disclosure without an external CTA', () => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Home)));
  const afterHeading = html.slice(html.indexOf('</h1>'));
  assert.ok(afterHeading.indexOf('summit-intro-event') < afterHeading.indexOf('summit-personal-note'));
  assert.ok(afterHeading.includes('summit-event-date') && afterHeading.includes('summit-event-location'));
  assert.ok(!html.includes('href="https://technl.ca/technlsummit26/"'));
  assert.ok(html.includes('I built this little companion to help us revisit the ideas from techNL Summit 2026.'));
  assert.ok(html.includes('And, fittingly, built with AI.'));
  assert.ok(html.includes('An independent project, not affiliated with techNL.'));
});


test('profile session cards show an explicit date while agenda cards avoid duplicated dates', () => {
  const session = content.conferenceSessions[0];
  const card = agenda => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SessionCard, { session, agenda, clock: { date: '2026-10-18', time: '12:00' } })));
  assert.ok(card(false).includes(`class="summit-card-date" dateTime="${session.date}"`));
  assert.ok(!card(true).includes('summit-card-date'));
  const company = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/technlsummit/companies/mysa'] }, createElement(Routes, null, createElement(Route, { path: '/technlsummit/companies/:slug', element: createElement(Profile, { type: 'companies' }) }))));
  assert.ok(company.includes('People presenting from Mysa'));
  assert.ok(company.includes('summit-card-date'));
});
test('archive CTA stays available independent of publication availability and notes filtering retains its result status', () => {
  const home = query => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/technlsummit${query}`] }, createElement(Home)));
  const html = home('');
  assert.equal(html.split('class="summit-explore-agenda"').length - 1, 1);
  const publishedCount = content.conferenceSessions.filter(session => session.status === 'published').length;
  assert.ok(html.includes('Explore insights'));
  assert.ok(home('?view=notes').includes(`role="status">${publishedCount} conference summaries available.`));
  const statuses = content.conferenceSessions.map(session => session.status);
  try {
    content.conferenceSessions.forEach(session => { session.status = 'upcoming'; });
    const unpublished = home('');
    assert.ok(unpublished.includes('Explore insights'));
    assert.ok(!unpublished.includes('Catch up on the sessions'));
  } finally {
    content.conferenceSessions.forEach((session, index) => { session.status = statuses[index]; });
  }
});

test('official event link remains available in the footer, outside the opening CTA', async () => {
  const Layout = (await server.ssrLoadModule('/src/summit/components/SummitLayout.jsx')).default;
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Layout)));
  const footer = html.slice(html.indexOf('<footer'));
  assert.equal(html.split('href="https://technl.ca/technlsummit26/"').length - 1, 1);
  assert.ok(footer.includes('Visit the actual event website'));
  assert.ok(footer.includes('not affiliated with techNL'));
});


test('archive navigation is permanent on home, article and profile routes with a real insights destination', async () => {
  const Layout = (await server.ssrLoadModule('/src/summit/components/SummitLayout.jsx')).default;
  for (const path of ['/technlsummit', '/technlsummit/sessions/assumption-trap', '/technlsummit/speakers/james-geneau']) {
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [path] }, createElement(Layout)));
    assert.ok(html.includes('data-agenda-navigation="archive"'));
    assert.ok(html.includes('href="/technlsummit#summit-insights"'));
    assert.ok(!html.includes('Up next') && !html.includes('Happening now'));
  }
  const home = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Home)));
  assert.ok(home.includes('id="summit-insights"'));
  assert.ok(home.includes('Speaker perspectives'));
  assert.ok(home.includes('Recently published notes'));
  assert.ok(home.includes('Complete session archive'));
  assert.ok(!home.includes('Happening now') && !home.includes('Up next') && !home.includes('Coming up'));
  const { attendingSessionIds } = await server.ssrLoadModule('/src/summit/content/attendance.js');
  for (const id of attendingSessionIds) {
    const selected = content.conferenceSessions.find(session => session.id === id);
    const others = content.conferenceSessions.filter(session => session.id !== id && session.date === selected.date && session.startTime === selected.startTime);
    for (const other of others) assert.ok(home.indexOf(`data-session="${selected.slug}"`) < home.indexOf(`data-session="${other.slug}"`));
  }
});
