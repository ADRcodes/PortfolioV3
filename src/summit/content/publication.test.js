import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { build } from 'vite';

const sessionDirectory = new URL('./sessions/', import.meta.url);
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
  try {
    const summary = marker => ({
      overview: `${marker} overview`,
      keyTakeaways: [{ heading: `${marker} heading`, explanation: `${marker} explanation` }],
      detailedSummary: [{ heading: `${marker} section`, paragraphs: [`${marker} paragraph`], bullets: [`${marker} bullet`] }],
      notableIdeas: [`${marker} notable`],
      practicalApplications: [`${marker} application`],
    });
    for (const status of ['published', 'draft', 'upcoming']) {
      const marker = `${status}-${token}`;
      const path = new URL(`test-${marker}.json`, sessionDirectory);
      paths.push(path);
      await writeFile(path, JSON.stringify({
        id: `test-${marker}`, slug: `test-${marker}`, title: `${status} test article`,
        date: '2026-10-19', startTime: '09:00', endTime: '09:30',
        location: 'Test room', description: 'Temporary integration fixture',
        speakerIds: [], companyIds: [], status, summary: summary(marker),
        recordingUrl: `https://example.com/${marker}/recording`, updatedAt: '2026-10-16T12:00:00Z',
      }));
    }
    await build({ logLevel: 'silent', build: { outDir: output, emptyOutDir: true } });
    const built = await outputText(output);
    for (const field of ['overview', 'heading', 'explanation', 'section', 'paragraph', 'bullet', 'notable', 'application']) {
      assert.ok(built.includes(`published-${token} ${field}`), `Missing automatically discovered ${field}`);
      for (const status of ['draft', 'upcoming']) assert.ok(!built.includes(`${status}-${token} ${field}`), `${status} ${field} leaked`);
    }
    for (const status of ['draft', 'upcoming']) assert.ok(!built.includes(`https://example.com/${status}-${token}/recording`));
  } finally {
    await Promise.all(paths.map(path => rm(path, { force: true })));
    await rm(output, { recursive: true, force: true });
  }
});
