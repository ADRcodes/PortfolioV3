import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { HTML_CACHE, previewEntry, previewHtml, previewPages, SITE_ORIGIN, SOCIAL_IMAGE } from './social.js';
import { putArguments, uploadPlan } from '../../../scripts/upload-summit-previews.mjs';

const fixture = JSON.parse(await readFile(new URL('../content/sessions/wills-ai-meetup-editorial-test.json', import.meta.url), 'utf8'));
const shell = await readFile(new URL('../../../index.html', import.meta.url), 'utf8');

test('the shared preview image is a real 1200 by 630 PNG', async () => {
  const png = await readFile(new URL('../../../public/images/meta/technl-summit-2026-v1.png', import.meta.url));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test('public previews include external articles, exclude drafts, and use only published summaries', () => {
  const pages = previewPages([
    { ...fixture, slug: 'public', status: 'published', recordingUrl: 'https://private.example/recording', transcript: 'PRIVATE TRANSCRIPT' },
    { ...fixture, slug: 'future', programme: 'conference', startTime: '09:00', endTime: '10:00', location: 'Conference room', status: 'upcoming', description: 'Public programme description.', summary: { ...fixture.summary, overview: 'PRIVATE UNPUBLISHED OVERVIEW' } },
    { ...fixture, slug: 'private-draft', status: 'draft', title: 'PRIVATE DRAFT TITLE' },
  ]);
  assert.equal(pages.length, 5);
  assert.equal(pages.find(page => page.path.endsWith('/public')).type, 'article');
  assert.match(pages.find(page => page.path.endsWith('/public')).description, /^External editorial sample \(2026-10-13\)\./);
  assert.equal(pages.find(page => page.path.endsWith('/future')).description, 'Public programme description.');
  assert.equal(pages.find(page => page.path.endsWith('/future')).modifiedAt, undefined);
  const generated = pages.map(page => previewHtml(shell, page)).join('');
  for (const secret of ['private.example', 'PRIVATE TRANSCRIPT', 'PRIVATE UNPUBLISHED OVERVIEW', 'PRIVATE DRAFT TITLE', 'private-draft']) assert.ok(!generated.includes(secret));
});

test('route head replaces portfolio metadata once and keeps the same SPA scripts and body', () => {
  const page = previewPages([fixture]).at(-1);
  const html = previewHtml(shell, page);
  assert.equal(html.split('<title>').length - 1, 1);
  assert.equal(html.match(/property="og:title"/g).length, 1);
  assert.ok(html.includes('Will&#39;s AI Meetup: Five AI Talks &amp; Demos'));
  assert.ok(html.includes(`content="${SITE_ORIGIN}${SOCIAL_IMAGE}"`));
  assert.ok(html.includes(`href="${SITE_ORIGIN}${page.path}"`));
  assert.ok(html.includes('article:modified_time'));
  assert.ok(!html.includes('alex-russell-profile.png'));
  assert.equal(html.split('<body>')[1], shell.split('<body>')[1]);
  assert.ok(shell.includes("Alex Russell's Portfolio"));
});

test('all dynamic head values are escaped and cannot inject tags or attributes', () => {
  const html = previewHtml(shell, { path: '/technlsummit', title: '"></title><script>evil()</script>', description: '" onload="evil & <unsafe>', type: 'article' });
  assert.ok(!html.includes('<script>evil'));
  assert.ok(!html.includes('content="" onload='));
  assert.ok(html.includes('&lt;unsafe&gt;'));
});

test('each route has exact non-slash, slash and index keys with one canonical URL', () => {
  const pages = previewPages([fixture]);
  const manifest = { version: 1, entries: pages.map(previewEntry) };
  const plan = uploadPlan(manifest);
  assert.equal(plan.length, pages.length * 3);
  const home = manifest.entries[0];
  assert.deepEqual(home.keys, ['technlsummit', 'technlsummit/', 'technlsummit/index.html']);
  assert.ok(plan.some(entry => entry.key === `technlsummit/sessions/${fixture.slug}/`));
  const args = putArguments('example-bucket', 'dist', plan[0]);
  assert.equal(args[args.indexOf('--content-type') + 1], 'text/html; charset=utf-8');
  assert.equal(args[args.indexOf('--cache-control') + 1], HTML_CACHE);
  assert.ok(!args.includes('immutable'));
});

test('withdrawn or drafted session keys lose stale metadata, without touching unrelated objects', () => {
  const old = ['technlsummit/sessions/withdrawn', 'technlsummit/sessions/withdrawn/', 'technlsummit/sessions/withdrawn/index.html'];
  const unrelated = ['assets/old-hash.js', 'technlsummit/sessions/withdrawn/recording.mp3', 'technlsummit/speakers/some-person', 'technlsummit-assets/logo.png', 'index.html'];
  const plan = uploadPlan({ version: 1, entries: [previewEntry(previewPages([])[0])] }, [...old, ...unrelated]);
  assert.deepEqual(plan.filter(entry => entry.file === 'summit-preview-unavailable.html').map(entry => entry.key), old);
  for (const key of unrelated) assert.ok(!plan.some(entry => entry.key === key));
});

test('upload planning rejects path traversal, malformed or duplicate keys', () => {
  const entry = previewEntry(previewPages([])[0]);
  for (const entries of [[{ ...entry, file: '../index.html' }], [{ ...entry, keys: ['index.html'] }], [entry, entry]]) {
    assert.throws(() => uploadPlan({ version: 1, entries }));
  }
});

test('recap previews share the existing exact-key, uncached HTML and withdrawal pipeline', () => {
  const recap = { status: 'published', slug: 'cross-session', title: 'Cross-session evidence', excerpt: 'A public editorial excerpt.', publishedAt: '2026-10-21T12:00:00Z', updatedAt: '2026-10-21T13:00:00Z', privateNote: 'PRIVATE' };
  const pages = previewPages([fixture], [recap, { ...recap, status: 'draft', slug: 'draft-recap', title: 'SECRET' }]);
  const page = pages.find(page => page.path === '/technlsummit/recaps/cross-session');
  const html = previewHtml(shell, page);
  assert.ok(html.includes('Cross-session evidence') && html.includes('article:published_time'));
  assert.ok(html.includes('property="og:type" content="article"'));
  assert.ok(html.includes('twitter:description') && html.includes('A public editorial excerpt.'));
  assert.ok(!JSON.stringify(pages).includes('SECRET') && !JSON.stringify(pages).includes('PRIVATE'));
  const entry = previewEntry(page);
  const args = putArguments('test-bucket', 'dist', { key: entry.keys[0], file: entry.file });
  assert.equal(args[args.indexOf('--content-type') + 1], 'text/html; charset=utf-8');
  assert.equal(args[args.indexOf('--cache-control') + 1], HTML_CACHE);
  const plan = uploadPlan({ version: 1, entries: pages.map(previewEntry) });
  assert.equal(plan.filter(item => item.key.includes('/recaps/')).length, 3);
  for (const variant of entry.keys) assert.ok(plan.some(item => item.key === variant));
  const withdrawn = uploadPlan({ version: 1, entries: previewPages([]).map(previewEntry) }, [...entry.keys, 'technlsummit/recaps/cross-session/private.txt', 'technlsummit/recaps/../escape']);
  assert.deepEqual(withdrawn.filter(item => item.file === 'summit-preview-unavailable.html').map(item => item.key), entry.keys);
  assert.throws(() => uploadPlan({ version: 1, entries: [{ file: 'technlsummit/recaps/../index.html', keys: [] }] }));
});
