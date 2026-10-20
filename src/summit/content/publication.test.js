import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { build, preview } from 'vite';

const sessionDirectory = new URL('./sessions/', import.meta.url);
const speakerFile = new URL('./speakers.json', import.meta.url);
async function outputText(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? outputText(join(directory, entry.name))
    : readFile(join(directory, entry.name), 'utf8')))).join('\n');
}

test('Vite discovers new article JSON and excludes draft/upcoming article fields from all assets', async () => {
  const token = randomUUID();
  const output = await mkdtemp(join(tmpdir(), 'summit-publication-'));
  const paths = [];
  const originalSpeakers = await readFile(speakerFile, 'utf8');
  const speakers = JSON.parse(originalSpeakers);
  const speaker = speakers.find(item => !item.demo);
  let previewServer;
  try {
    const summary = marker => ({
      overview: `${marker} overview`,
      keyTakeaways: [{ heading: `${marker} heading`, explanation: `${marker} explanation` }],
      detailedSummary: [{ heading: `${marker} section`, paragraphs: [`${marker} paragraph`], bullets: [`${marker} bullet`] }],
      notableIdeas: [`${marker} notable`],
      practicalApplications: [`${marker} application`],
      highlightedInsight: { explanation: `${marker} session insight` },
      presentations: [{ title: `${marker} presentation`, explanation: `${marker} presentation explanation`,
        sections: [{ heading: `${marker} presentation section`, paragraphs: [`${marker} presentation paragraph`], bullets: [`${marker} presentation bullet`] }],
        highlightedInsight: { heading: `${marker} insight heading`, explanation: `${marker} insight explanation` },
      }],
    });
    for (const status of ['published', 'draft', 'upcoming']) {
      const marker = `${status}-${token}`;
      const path = new URL(`test-${marker}.json`, sessionDirectory);
      paths.push(path);
      await writeFile(path, JSON.stringify({
        id: `test-${marker}`, slug: `test-${marker}`, title: `${status} test article`,
        date: '2026-10-19', startTime: '09:00', endTime: '09:30',
        location: 'Test room', description: 'Temporary integration fixture',
        speakerIds: [speaker.id], companyIds: [], status, summary: summary(marker),
        recordingUrl: `https://example.com/${marker}/recording`, updatedAt: '2026-10-16T12:00:00Z',
      }));
      (speaker.summitPerspectives ??= []).push({
        sessionSlug: `test-${marker}`, summary: `${marker} perspective insight`,
        heading: `${marker} perspective heading`, publishedAt: '2026-10-19T12:00:00Z',
        privateEditorialNote: `${marker} private-perspective-field`,
      });
    }
    await writeFile(speakerFile, JSON.stringify(speakers));
    await build({ logLevel: 'silent', build: { outDir: output, emptyOutDir: true } });
    const built = await outputText(output);
    for (const field of ['overview', 'heading', 'explanation', 'section', 'paragraph', 'bullet', 'notable', 'application', 'session insight', 'presentation', 'presentation explanation', 'presentation section', 'presentation paragraph', 'presentation bullet', 'insight heading', 'insight explanation']) {
      assert.ok(built.includes(`published-${token} ${field}`), `Missing automatically discovered ${field}`);
      for (const status of ['draft', 'upcoming']) assert.ok(!built.includes(`${status}-${token} ${field}`), `${status} ${field} leaked`);
    }
    for (const status of ['draft', 'upcoming']) assert.ok(!built.includes(`https://example.com/${status}-${token}/recording`));
    assert.ok(built.includes(`published-${token} perspective insight`));
    assert.ok(built.includes(`published-${token} perspective heading`));
    for (const status of ['draft', 'upcoming']) {
      assert.ok(!built.includes(`${status}-${token} perspective insight`));
      assert.ok(!built.includes(`${status}-${token} perspective heading`));
    }
    assert.ok(!built.includes(`${token} private-perspective-field`));
    const manifest = JSON.parse(await readFile(join(output, 'summit-previews.json'), 'utf8'));
    assert.ok(!JSON.stringify(manifest).includes(`test-draft-${token}`));
    assert.ok(JSON.stringify(manifest).includes(`test-published-${token}`));
    // Raw HTTP checks: no React execution or document-head mutation involved.
    previewServer = await preview({ logLevel: 'silent', build: { outDir: output }, preview: { host: '127.0.0.1', port: 0, strictPort: true } });
    const origin = `http://127.0.0.1:${previewServer.httpServer.address().port}`;
    for (const route of ['', '/', '/sessions/wills-ai-meetup-editorial-test', '/sessions/wills-ai-meetup-editorial-test/', '/sessions/the-new-org-chart', `/sessions/test-published-${token}`]) {
      const response = await fetch(`${origin}/technlsummit${route}`);
      const html = await response.text();
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type'), /^text\/html/);
      assert.equal(response.headers.get('cache-control'), 'no-cache,no-store,must-revalidate');
      assert.ok(html.includes('og:url'));
      assert.ok(!html.includes('<title>Alex Russell'));
      assert.ok(!html.includes(`https://example.com/published-${token}/recording`));
      assert.match(html, /src="\/assets\/index-[^"]+\.js"/);
      if (route.includes('wills-ai')) assert.ok(html.includes('Will&#39;s AI Meetup'));
    }
    const portfolio = await (await fetch(origin)).text();
    assert.ok(portfolio.includes("<title>Alex Russell's Portfolio</title>"));
    assert.ok(portfolio.includes('content="/images/meta/alex-russell-profile.png"'));
    const image = await fetch(`${origin}/images/meta/technl-summit-2026-v1.png`);
    assert.equal(image.status, 200);
    assert.match(image.headers.get('content-type'), /^image\/png/);
    const draft = await (await fetch(`${origin}/technlsummit/sessions/test-draft-${token}`)).text();
    assert.ok(!draft.includes('draft test article'));
  } finally {
    await writeFile(speakerFile, originalSpeakers);
    if (previewServer) await new Promise(resolve => previewServer.httpServer.close(resolve));
    await Promise.all(paths.map(path => rm(path, { force: true })));
    await rm(output, { recursive: true, force: true });
  }
});
