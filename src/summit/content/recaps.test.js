import test from 'node:test';
import assert from 'node:assert/strict';
import { createRecaps, publicRecap, validateRecap } from './recaps.js';
import { recapFixture } from './test-fixtures/recap.js';
const sessions = ['assumption-trap', 'internal-innovation'].map(slug => ({ slug, programme: 'conference', status: 'published' }));
const speakers = [{ id: 'speaker-real', name: 'Sample Speaker', slug: 'sample-speaker' }, { id: 'speaker-demo', name: 'Fake Speaker', demo: true }];

test('recaps are independent, automatically ordered by publication, and recursively projected', () => {
  const first = recapFixture({ privateNote: 'PRIVATE', recordingUrl: 'PRIVATE' });
  first.sections[0].privateNote = 'PRIVATE'; first.highlightedInsight.privateNote = 'PRIVATE';
  first.sections[0].highlightedInsight = { label: 'Editorial context', heading: 'Meaning', explanation: 'Supported explanation', privateNote: 'PRIVATE' };
  first.sections[0].paragraphs[0] = `Sample Speaker introduces this topic. ${first.sections[0].paragraphs[0]}`;
  first.sections[0].speakerLinks = [{ paragraphIndex: 0, speakerId: 'speaker-real', text: 'Sample Speaker', privateNote: 'PRIVATE' }];
  first.speakerIds = ['speaker-real'];
  const newer = recapFixture({ id: 'newer', slug: 'newer', publishedAt: '2026-10-21T14:00:00Z', updatedAt: '2026-10-21T14:00:00Z' });
  const records = createRecaps([first, { ...first, id: 'draft', slug: 'draft', status: 'draft' }, newer], sessions, speakers);
  assert.deepEqual(records.map(item => item.id), ['newer', first.id]);
  assert.ok(!JSON.stringify(records).includes('PRIVATE'));
  assert.equal(records[1].sections[0].highlightedInsight.label, 'Editorial context');
  assert.ok(!('privateNote' in records[1].sections[0].highlightedInsight));
  assert.deepEqual(records[1].sections[0].speakerLinks, [{ paragraphIndex: 0, speakerId: 'speaker-real', text: 'Sample Speaker' }]);
  assert.equal(publicRecap({ ...first, status: 'draft' }), null);
  assert.ok(!('date' in records[0]) && !('location' in records[0]) && !('startTime' in records[0]));
  assert.deepEqual(createRecaps([], sessions, speakers), []);
});

test('invalid records fail closed, and all links resolve to public conference articles or real speakers', () => {
  for (const change of [
    { slug: '../escape' }, { publishedAt: '2026-02-30T12:00:00Z' }, { status: 'upcoming' }, { publishedAt: 'yesterday' }, { updatedAt: '2026-10-20T00:00:00Z' },
    { sections: [] }, { sections: [{ heading: 'Missing paragraphs' }] },
    { sections: [{ heading: 'Invalid insight', paragraphs: ['Text'], highlightedInsight: { heading: 'Missing explanation' } }] },
    { sections: [{ heading: 'Invalid label', paragraphs: ['Text'], highlightedInsight: { label: '', explanation: 'Text' } }] },
    { relatedSessionSlugs: [] },
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

test('speaker links are explicit, resolve to profiles and appear only on first exact name mentions', () => {
  const base = recapFixture({
    speakerIds: ['speaker-real'],
    sections: [
      { heading: 'Introduction', paragraphs: ['Sample Speaker explains the idea.', 'Later the discussion continues.'], speakerLinks: [{ paragraphIndex: 0, speakerId: 'speaker-real', text: 'Sample Speaker' }] },
      { heading: 'Next', paragraphs: ['Sample Speaker may be mentioned again without linking.'] },
    ],
  });
  assert.doesNotThrow(() => createRecaps([base], sessions, speakers));
  const invalid = [
    { ...base, sections: [{ ...base.sections[0], speakerLinks: [{ paragraphIndex: 2, speakerId: 'speaker-real', text: 'Sample Speaker' }] }] },
    { ...base, sections: [{ ...base.sections[0], speakerLinks: [{ paragraphIndex: 0, speakerId: 'speaker-real', text: 'Sample' }] }] },
    { ...base, sections: [{ ...base.sections[0], speakerLinks: [{ paragraphIndex: 0, speakerId: 'speaker-unknown', text: 'Sample Speaker' }] }] },
    { ...base, speakerIds: [], sections: [base.sections[0]] },
    { ...base, sections: [{ ...base.sections[0], paragraphs: ['Earlier mention of Sample Speaker.', 'Sample Speaker again.'], speakerLinks: [{ paragraphIndex: 1, speakerId: 'speaker-real', text: 'Sample Speaker' }] }] },
    { ...base, sections: [base.sections[0], { ...base.sections[1], speakerLinks: [{ paragraphIndex: 0, speakerId: 'speaker-real', text: 'Sample Speaker' }] }] },
    { ...base, sections: [{ ...base.sections[0], speakerLinks: [{ paragraphIndex: 0, speakerId: 'speaker-real', text: 'Sample Speaker' }, { paragraphIndex: 0, speakerId: 'speaker-real', text: 'Sample Speaker' }] }] },
  ];
  for (const record of invalid) assert.throws(() => createRecaps([record], sessions, speakers));
});
