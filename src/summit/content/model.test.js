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
