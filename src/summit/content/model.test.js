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
