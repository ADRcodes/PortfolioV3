import test from 'node:test';
import assert from 'node:assert/strict';
import { createContent } from './model.js';
import { getSpeakerPerspectives, publicSpeaker, validateSpeakerPerspectives } from './perspectives.js';

const speaker = { id: 'speaker-test', slug: 'test', name: 'Test speaker', description: 'Biography', companyIds: [], urls: [] };
const sessions = [
  { id: 'session-published', slug: 'published', title: 'Current article title', status: 'published', speakerIds: [speaker.id], companyIds: [] },
  { id: 'session-upcoming', slug: 'upcoming', title: 'Upcoming', status: 'upcoming', speakerIds: [speaker.id], companyIds: [] },
  { id: 'session-draft', slug: 'draft', title: 'Draft', status: 'draft', speakerIds: [speaker.id], companyIds: [] },
  { id: 'session-unrelated', slug: 'unrelated', title: 'Another speaker', status: 'published', speakerIds: [], companyIds: [] },
];
const perspective = { sessionSlug: 'published', summary: 'A short attributed insight.' };

test('legacy speakers keep their data shape and absent or empty perspectives resolve to no section', () => {
  validateSpeakerPerspectives(speaker);
  assert.equal(publicSpeaker(speaker, sessions), speaker);
  assert.deepEqual(getSpeakerPerspectives(speaker, sessions), []);
  assert.deepEqual(getSpeakerPerspectives({ ...speaker, summitPerspectives: [] }, sessions), []);
});

test('perspectives resolve current session titles, preserve editorial order and expose only supported public fields', () => {
  const item = { ...speaker, summitPerspectives: [
    { ...perspective, sessionTitle: 'An obsolete title', heading: 'A short label', quote: 'A fictional test quotation.', publishedAt: '2026-10-19T18:29:03.875Z', privateEditorialNote: 'Do not publish' },
    { ...perspective, summary: 'Another insight from the same session.' },
  ] };
  validateSpeakerPerspectives(item);
  const result = getSpeakerPerspectives(item, sessions);
  assert.equal(result.length, 2);
  assert.equal(result[0].sessionTitle, 'Current article title');
  assert.equal(result[0].heading, 'A short label');
  assert.equal(result[0].quote, 'A fictional test quotation.');
  assert.equal('quote' in result[1], false);
  assert.equal(result[0].publishedAt, '2026-10-19T18:29:03.875Z');
  assert.equal(result[1].summary, 'Another insight from the same session.');
  assert.equal('privateEditorialNote' in result[0], false);
  assert.equal('heading' in result[1], false);
  assert.equal(item.summitPerspectives[0].sessionTitle, 'An obsolete title');
});

test('optional quotations must contain nonempty plain text', () => {
  for (const quote of [null, '', '  ', 42, {}, []]) {
    assert.throws(() => validateSpeakerPerspectives({ ...speaker, summitPerspectives: [{ ...perspective, quote }] }), /speaker-test\.summitPerspectives \[0\]\.quote/);
  }
});

test('unpublished, missing and unrelated session references are safely hidden before public content is returned', () => {
  const item = { ...speaker, summitPerspectives: ['published', 'upcoming', 'draft', 'unrelated', 'missing'].map(sessionSlug => ({ ...perspective, sessionSlug, summary: `${sessionSlug} insight` })) };
  const content = createContent(sessions, [item], []);
  assert.deepEqual(content.speakers[0].summitPerspectives.map(item => item.sessionSlug), ['published']);
  const withdrawn = sessions.map(session => ({ ...session, status: 'draft' }));
  assert.deepEqual(publicSpeaker(item, withdrawn).summitPerspectives, []);
  assert.deepEqual(getSpeakerPerspectives(content.speakers[0], withdrawn), []);
  assert.equal(item.summitPerspectives.length, 5);
});

test('malformed optional perspective data fails with speaker and field context', () => {
  for (const summitPerspectives of [null, {}, [null], [{ ...perspective, sessionSlug: '../unsafe' }], [{ ...perspective, summary: '' }], [{ ...perspective, heading: '' }], [{ ...perspective, publishedAt: 'yesterday' }], [{ ...perspective, publishedAt: '2026-10-19T12:00:00' }]]) {
    assert.throws(() => createContent([], [{ ...speaker, summitPerspectives }], []), /speaker-test\.summitPerspectives/);
  }
});
