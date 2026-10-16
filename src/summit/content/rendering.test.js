import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let server;
let SessionSummary;
before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  SessionSummary = (await server.ssrLoadModule('/src/summit/components/SessionSummary.jsx')).default;
});
after(async () => { await server?.close(); });
const render = summary => renderToStaticMarkup(createElement(SessionSummary, { summary }));

test('structured article renders in reading order, with paragraphs and optional bullets', () => {
  const html = render({
    overview: 'Overview text',
    keyTakeaways: [{ heading: 'Takeaway heading', explanation: 'Takeaway explanation' }, { explanation: 'Unheaded explanation' }, 'Legacy takeaway'],
    detailedSummary: [
      { heading: 'First section', paragraphs: ['First paragraph', 'Second paragraph'], bullets: ['Supporting bullet'] },
      { heading: 'Second section', paragraphs: ['Final paragraph'] },
    ],
    notableIdeas: ['Notable observation'],
    practicalApplications: ['Practical action'],
  });
  const sequence = ['Quick overview', 'Overview text', 'Key takeaways', 'Takeaway heading', 'Takeaway explanation', 'Unheaded explanation', 'Legacy takeaway', 'Detailed summary', 'First section', 'First paragraph', 'Second paragraph', 'Supporting bullet', 'Second section', 'Final paragraph', 'Notable insights', 'Notable observation', 'Practical applications', 'Practical action'];
  let previous = -1;
  for (const text of sequence) {
    const position = html.indexOf(text);
    assert.ok(position > previous, `Expected ${text} after the previous article element`);
    previous = position;
  }
  assert.ok(html.includes('<h3>Takeaway heading</h3>'));
  assert.ok(html.includes('<p>Takeaway explanation</p>'));
});

test('legacy summaries render and missing or empty optional sections disappear', () => {
  for (const optional of [{}, { detailedSummary: [], notableIdeas: [], practicalApplications: [] }]) {
    const html = render({ overview: 'Legacy overview', keyTakeaways: ['Legacy insight'], ...optional });
    assert.ok(html.includes('Legacy insight'));
    for (const heading of ['Detailed summary', 'Notable insights', 'Practical applications', 'None recorded.']) assert.ok(!html.includes(heading));
  }
});

test('article text is escaped rather than interpreted as HTML', () => {
  const html = render({ overview: '<script>alert(1)</script>', keyTakeaways: [{ heading: '<img>', explanation: '<b>Text</b>' }] });
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('&lt;b&gt;Text&lt;/b&gt;'));
});
