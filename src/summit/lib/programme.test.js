import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAgenda, recentSummaries } from './programme.js';
import { matchesSearch } from './search.js';
import { canonicalSessionUrl, shareSession } from './share.js';
const article = (id, updatedAt, extra = {}) => ({ id, updatedAt, programme: 'conference', status: 'published', ...extra });
test('latest summaries use timestamps rather than schedule dates, limit to three and exclude drafts/external tests', () => {
  const records = [article('a', '2026-10-20T15:00:00Z'), article('b', '2026-10-20T14:00:00Z'), article('c', '2026-10-20T16:00:00Z'), article('d', '2026-10-20T13:00:00Z'), article('external', '2026-10-21T00:00:00Z', { programme: 'external' }), article('draft', '2026-10-21T00:00:00Z', { status: 'draft' }), article('upcoming', '2026-10-21T00:00:00Z', { status: 'upcoming' })];
  assert.deepEqual(recentSummaries(records).map(item => item.id), ['c', 'a', 'b']);
  assert.equal(filterAgenda(records, 'all').length, 5);
  assert.equal(filterAgenda(records, 'notes').length, 4);
  assert.deepEqual(recentSummaries([]), []);
  assert.equal(records[0].id, 'a');
});
test('search folds accents and punctuation and includes all company affiliations plus biography', () => {
  const person = { name: 'Renée O’Keefe', description: 'Builds retrieval systems.', companyIds: ['a', 'b'] };
  const companies = [{ id: 'a', name: 'First' }, { id: 'b', name: 'Co-Lab AI' }];
  for (const query of ['RENEE', 'okeefe', 'o keefe', 'retrieval', 'colab', 'co lab', 'first', '']) assert.ok(matchesSearch(person, query, companies), query);
  assert.ok(!matchesSearch(person, 'unrelated', companies));
  assert.ok(matchesSearch({ name: 'Company', description: 'Marine engineering' }, 'marine'));
});
test('native share uses only title and canonical public URL', async () => {
  let shared;
  const result = await shareSession({ title: 'A title', slug: 'a-session', recordingUrl: 'private' }, { share: async data => { shared = data; } });
  assert.equal(result, 'shared');
  assert.deepEqual(shared, { title: 'A title', url: 'https://www.alexrussell.info/technlsummit/sessions/a-session' });
  assert.equal(canonicalSessionUrl('a-session'), shared.url);
});
test('clipboard fallback, native cancellation and denied/unavailable access are handled', async () => {
  const session = { title: 'Test', slug: 'test' };
  let copied;
  assert.equal(await shareSession(session, { clipboard: { writeText: async url => { copied = url; } } }), 'copied');
  assert.equal(copied, canonicalSessionUrl('test'));
  assert.equal(await shareSession(session, {}), 'manual');
  assert.equal(await shareSession(session, { clipboard: { writeText: async () => { throw new Error('Denied'); } } }), 'manual');
  assert.equal(await shareSession(session, { share: async () => { throw Object.assign(new Error(), { name: 'AbortError' }); } }), 'cancelled');
  assert.equal(await shareSession(session, { share: async () => { throw new Error('Denied'); }, clipboard: { writeText: async () => {} } }), 'copied');
});
