import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createContent, publicSession, validateSession } from './model.js';
const read = name => JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8'));
const sessions = readdirSync(new URL('./sessions/', import.meta.url)).filter(file => file.endsWith('.json')).map(file => read(`./sessions/${file}`));
const speakers = read('./speakers.json');
const companies = read('./companies.json');
const published = {
  id: 'test-session', slug: 'test-session', title: 'Test session',
  date: '2026-10-26', startTime: '09:00', endTime: '09:45',
  location: 'Test room', description: 'Test description',
  speakerIds: [], companyIds: [], status: 'published',
  updatedAt: '2026-10-16T12:00:00Z', recordingUrl: null,
  summary: { overview: 'Test overview', keyTakeaways: ['Test takeaway'], notableIdeas: [], practicalApplications: [] },
};

test('sample content validates, with unique identities and resolvable relationships', () => {
  sessions.forEach(validateSession);
  assert.equal(createContent(sessions, speakers, companies).sessions.length, sessions.length);
});
test('profile images accept bundled assets while rejecting unsafe or malformed local paths', () => {
  const profile = { id: 'test-company', slug: 'test-company', name: 'Test company', description: 'Test', urls: [], imageAlt: 'Test logo' };
  for (const image of ['/images/summit/companies/cbc-v1.svg', '/images/logo.png', 'https://example.com/logo.png']) {
    assert.equal(createContent([], [], [{ ...profile, image }]).companies[0].image, image);
  }
  for (const image of ['//example.com/logo.svg', '/images/../private.svg', '/images/%2e%2e/private.svg', '/images/logo.html', 'javascript:alert(1)', 'data:image/svg+xml,invalid']) {
    assert.throws(() => createContent([], [], [{ ...profile, image }]), /image requires/);
  }
  assert.throws(() => createContent([], [], [{ ...profile, image: '/images/logo.svg', imageAlt: '' }]), /imageAlt/);
});
test('public projection excludes drafts and all unpublished summary/source fields', () => {
  assert.equal(publicSession({ ...published, status: 'draft' }), null);
  const upcoming = publicSession({ ...published, status: 'upcoming' });
  assert.equal('summary' in upcoming, false);
  assert.equal('recordingUrl' in upcoming, false);
  assert.deepEqual(publicSession(published).summary, published.summary);
});
test('a newly discovered session needs no registry or profile updates', () => {
  const testSpeakers = [{ id: 'test-speaker', slug: 'test-speaker', name: 'Test speaker', description: 'Test', urls: [], companyIds: [] }];
  const added = { ...published, id: 'test-new', slug: 'test-new', speakerIds: ['test-speaker'] };
  const content = createContent([published, added].map(publicSession), testSpeakers, []);
  assert.ok(content.sessions.some(session => session.slug === 'test-new'));
  assert.ok(content.sessions.filter(session => session.speakerIds.includes('test-speaker')).some(session => session.id === 'test-new'));
});
test('invalid status, dates, times, URLs and incomplete published content fail clearly', () => {
  for (const change of [
    { status: 'private' }, { date: '2026-02-30' }, { startTime: '25:00' },
    { endTime: '08:00' }, { updatedAt: 'yesterday' }, { recordingUrl: 'javascript:alert(1)' },
    { summary: { ...published.summary, overview: '' } },
  ]) assert.throws(() => validateSession({ ...published, ...change }), /Summit content:/);
});
test('duplicate slugs and broken references fail clearly', () => {
  assert.throws(() => createContent([published, { ...published, id: 'duplicate' }], speakers, companies), /duplicate sessions slug/);
  assert.throws(() => createContent([{ ...published, speakerIds: ['missing'] }], speakers, companies), /unknown speaker reference/);
  assert.throws(() => createContent([{ ...published, companyIds: ['missing'] }], speakers, companies), /unknown company reference/);
});

const structuredSummary = {
  overview: 'A useful overview.',
  keyTakeaways: [{ heading: 'Measure first', explanation: 'Define a baseline before changing the workflow.' }, 'Legacy takeaway'],
  detailedSummary: [{ heading: 'Evaluation', paragraphs: ['Compare outcomes against a baseline.'], bullets: ['Record errors.'] }],
};

test('structured and legacy takeaways can coexist, with optional article fields omitted', () => {
  assert.equal(validateSession({ ...published, summary: structuredSummary }).summary, structuredSummary);
  assert.deepEqual(publicSession({ ...published, summary: structuredSummary }).summary, structuredSummary);
  validateSession({ ...published, summary: { overview: 'Overview', keyTakeaways: [{ explanation: 'Explanation without a heading.' }] } });
  validateSession({ ...published, summary: { ...structuredSummary, detailedSummary: [], notableIdeas: [], practicalApplications: [] } });
});

test('invalid article fields identify the session and field path', () => {
  const cases = [
    [{ keyTakeaways: [null] }, 'keyTakeaways[0].explanation'],
    [{ keyTakeaways: [{ heading: 'Heading', text: 'Wrong field' }] }, 'keyTakeaways[0].explanation'],
    [{ keyTakeaways: [{ heading: '', explanation: 'Explanation' }] }, 'keyTakeaways[0].heading'],
    [{ keyTakeaways: [' '] }, 'keyTakeaways[0]'],
    [{ detailedSummary: null }, 'detailedSummary'],
    [{ detailedSummary: [null] }, 'detailedSummary[0].heading'],
    [{ detailedSummary: [{ heading: 'Section', paragraphs: [] }] }, 'detailedSummary[0].paragraphs'],
    [{ detailedSummary: [{ heading: 'Section', paragraphs: [' '] }] }, 'detailedSummary[0].paragraphs'],
    [{ detailedSummary: [{ heading: 'Section', paragraphs: ['Text'], bullets: 'Wrong type' }] }, 'detailedSummary[0].bullets'],
    [{ notableIdeas: null }, 'notableIdeas'],
    [{ practicalApplications: [4] }, 'practicalApplications'],
  ];
  for (const [change, field] of cases) {
    assert.throws(() => validateSession({ ...published, summary: { ...structuredSummary, ...change } }), error => {
      assert.ok(error.message.includes(published.id));
      assert.ok(error.message.includes(`summary.${field}`));
      return true;
    });
  }
});

test('new article fields follow publication rules and unknown fields are not bundled', () => {
  const session = { ...published, summary: { ...structuredSummary, privateNotes: 'Not a public field' } };
  assert.equal(publicSession({ ...session, status: 'draft' }), null);
  assert.equal('summary' in publicSession({ ...session, status: 'upcoming' }), false);
  assert.equal('privateNotes' in publicSession(session).summary, false);
  assert.deepEqual(publicSession(session).summary.detailedSummary, structuredSummary.detailedSummary);
});

test('the complete editorial-guide example matches the implemented schema', () => {
  const guide = readFileSync(new URL('../EDITORIAL_GUIDE.md', import.meta.url), 'utf8');
  const examples = [...guide.matchAll(/```json\n([\s\S]*?)\n```/g)];
  const example = JSON.parse(examples.at(-1)[1]);
  validateSession(example);
  validateSession({ ...example, status: 'published' });
  createContent([example], speakers, companies);
  assert.equal(example.summary.keyTakeaways.length, 3);
  assert.ok(example.summary.detailedSummary.length >= 3);
});

const multipartSummary = {
  ...structuredSummary,
  highlightedInsight: { explanation: 'A session-wide observation.' },
  presentations: [
    { title: 'First demo', speakerIds: [], explanation: 'A concise explanation.',
      sections: [{ heading: 'Evidence', paragraphs: ['Observed result.'], bullets: ['A qualification.'] }],
      highlightedInsight: { heading: 'Important result', explanation: 'A qualified finding.' } },
    { title: 'Short demo', explanation: 'This presentation needs no extra sections.' },
  ],
};

test('multi-presentation articles preserve optional sections and filter nested unknown fields', () => {
  const session = { ...published, summary: multipartSummary };
  validateSession(session);
  assert.deepEqual(publicSession(session).summary, multipartSummary);
  const changed = structuredClone(session);
  changed.summary.presentations[0].privateNotes = 'Private';
  changed.summary.presentations[0].sections[0].transcript = 'Private';
  changed.summary.presentations[0].highlightedInsight.privateNotes = 'Private';
  changed.summary.highlightedInsight.privateNotes = 'Private';
  assert.deepEqual(publicSession(changed).summary, multipartSummary);
  assert.equal(publicSession({ ...session, status: 'draft' }), null);
  assert.equal('summary' in publicSession({ ...session, status: 'upcoming' }), false);
});

test('multi-presentation validation identifies malformed sections, insights and speaker references', () => {
  const cases = [
    [{ presentations: null }, 'presentations'],
    [{ presentations: [null] }, 'presentations[0].title'],
    [{ presentations: [{ title: 'Title', explanation: '' }] }, 'presentations[0].explanation'],
    [{ presentations: [{ title: 'Title', explanation: 'Text', speakerIds: ['missing'] }] }, 'presentations[0].speakerIds'],
    [{ presentations: [{ title: 'Title', explanation: 'Text', sections: [{ heading: 'Heading', paragraphs: [] }] }] }, 'presentations[0].sections[0].paragraphs'],
    [{ presentations: [{ title: 'Title', explanation: 'Text', highlightedInsight: null }] }, 'presentations[0].highlightedInsight.explanation'],
    [{ highlightedInsight: { heading: '', explanation: 'Text' } }, 'highlightedInsight.heading'],
  ];
  for (const [change, path] of cases) assert.throws(() => validateSession({ ...published, summary: { ...multipartSummary, ...change } }), error => error.message.includes(published.id) && error.message.includes(`summary.${path}`));
  const speaker = { id: 'known', slug: 'known', name: 'Known speaker', description: 'Description', companyIds: [], urls: [] };
  const session = { ...published, speakerIds: ['known'], summary: { ...structuredSummary, presentations: [{ title: 'Title', explanation: 'Text', speakerIds: ['known'] }] } };
  validateSession(session);
  createContent([session], [speaker], []);
  assert.throws(() => createContent([session], [], []), /unknown speaker reference/);
});

test('Will’s migration retains five presentations and the revised source wording', () => {
  const session = sessions.find(item => item.slug === 'wills-ai-meetup-editorial-test');
  assert.equal(session.summary.presentations.length, 5);
  assert.ok(session.summary.presentations[0].highlightedInsight.explanation.includes('local experiment'));
  assert.ok(session.summary.presentations.every(item => !item.speakerIds?.length));
  assert.ok(!session.summary.detailedSummary);
});


test('classification is validated, projected, separate from publication and backward compatible', () => {
  for (const eventType of ['talk', 'panel', 'workshop', 'networking', 'registration', 'break', 'activity']) {
    const projected = publicSession({ ...published, eventType, programme: 'external' });
    assert.equal(projected.eventType, eventType);
    assert.equal(projected.programme, 'external');
    assert.equal(projected.status, 'published');
  }
  assert.equal(publicSession(published).eventType, 'talk');
  assert.equal(publicSession(published).programme, 'conference');
  assert.throws(() => validateSession({ ...published, eventType: 'published' }), /invalid eventType/);
  assert.throws(() => validateSession({ ...published, programme: 'demo' }), /invalid programme/);
  assert.ok(sessions.every(session => session.eventType && session.programme));
  assert.equal(sessions.filter(session => session.programme === 'conference').length, 36);
  assert.equal(speakers.filter(item => item.demo).length, 1);
  assert.equal(companies.filter(item => item.demo).length, 1);
});


test('date-only external articles validate and project without weakening conference scheduling', () => {
  const external = { ...published, programme: 'external', startTime: null, endTime: null, location: null };
  validateSession(external);
  const projected = publicSession(external);
  assert.equal(projected.startTime, null);
  assert.equal(projected.endTime, null);
  assert.equal(projected.location, null);
  assert.throws(() => validateSession({ ...external, programme: 'conference' }), /invalid startTime/);
  assert.throws(() => validateSession({ ...external, endTime: '12:00' }), /invalid startTime/);
  assert.throws(() => validateSession({ ...published, location: null }), /requires location/);
  assert.throws(() => createContent([], [], [{ ...companies[0], logoBackground: 'guess' }]), /invalid logoBackground/);
});
