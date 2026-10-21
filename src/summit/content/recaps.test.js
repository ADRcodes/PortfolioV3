import test from 'node:test';
import assert from 'node:assert/strict';
import { createRecaps, publicRecap, validateRecap } from './recaps.js';
import { recapFixture } from './test-fixtures/recap.js';
const sessions = ['assumption-trap', 'internal-innovation'].map(slug => ({ slug, programme: 'conference', status: 'published' }));
const speakers = [{ id: 'speaker-real' }, { id: 'speaker-demo', demo: true }];

test('recaps are independent, automatically ordered by publication, and recursively projected', () => {
  const first = recapFixture({ privateNote: 'PRIVATE', recordingUrl: 'PRIVATE' });
  first.sections[0].privateNote = 'PRIVATE'; first.highlightedInsight.privateNote = 'PRIVATE';
  const newer = recapFixture({ id: 'newer', slug: 'newer', publishedAt: '2026-10-21T14:00:00Z', updatedAt: '2026-10-21T14:00:00Z' });
  const records = createRecaps([first, { ...first, id: 'draft', slug: 'draft', status: 'draft' }, newer], sessions, speakers);
  assert.deepEqual(records.map(item => item.id), ['newer', first.id]);
  assert.ok(!JSON.stringify(records).includes('PRIVATE'));
  assert.equal(publicRecap({ ...first, status: 'draft' }), null);
  assert.ok(!('date' in records[0]) && !('location' in records[0]) && !('startTime' in records[0]));
  assert.deepEqual(createRecaps([], sessions, speakers), []);
});

test('invalid records fail closed, and all links resolve to public conference articles or real speakers', () => {
  for (const change of [
    { slug: '../escape' }, { publishedAt: '2026-02-30T12:00:00Z' }, { status: 'upcoming' }, { publishedAt: 'yesterday' }, { updatedAt: '2026-10-20T00:00:00Z' },
    { sections: [] }, { sections: [{ heading: 'Missing paragraphs' }] }, { relatedSessionSlugs: [] },
    { sections: [{ heading: 'Bad link', paragraphs: ['Text'], sessionSlugs: ['missing'] }] },
    { relatedSessionSlugs: ['missing'] }, { speakerIds: ['missing'] }, { speakerIds: ['speaker-demo'] },
  ]) assert.throws(() => createRecaps([recapFixture(change)], sessions, speakers));
  for (const status of ['draft', 'upcoming']) assert.throws(() => createRecaps([recapFixture()], [{ ...sessions[0], status }, sessions[1]], speakers));
  assert.throws(() => createRecaps([recapFixture()], [{ ...sessions[0], programme: 'external' }, sessions[1]], speakers));
  assert.throws(() => createRecaps([recapFixture(), recapFixture()], sessions, speakers));
  assert.throws(() => createRecaps([recapFixture(), recapFixture({ id: 'different' })], sessions, speakers));
  assert.throws(() => validateRecap(null));
  assert.throws(() => publicRecap(recapFixture({ status: 'draft', sections: [] })));
  assert.throws(() => createRecaps([recapFixture(), recapFixture({ slug: 'different' })], sessions, speakers));
  assert.doesNotThrow(() => createRecaps([recapFixture({ speakerIds: ['speaker-real'] })], sessions, speakers));
});
