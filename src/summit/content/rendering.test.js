import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { MemoryRouter } from 'react-router';

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

test('multiple presentations have a linked overview, numbered headings and fully visible optional detail', () => {
  const speaker = { id: 'speaker-demo-jordan', slug: 'demo-jordan-lee' };
  const summary = { overview: 'Session overview', keyTakeaways: [{ heading: 'A finding', explanation: 'Its meaning.' }], presentations: [
    { title: 'First presentation', speakerIds: [speaker.id], explanation: 'First explanation',
      highlightedInsight: { heading: 'A qualified insight', explanation: 'Only in this experiment.' },
      sections: [{ heading: 'Supporting evidence', paragraphs: ['A supporting paragraph'], bullets: ['A useful qualification'] }] },
    { title: 'Second presentation', explanation: 'Second explanation' },
  ] };
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SessionSummary, { summary })));
  const nav = html.slice(html.indexOf('<nav'), html.indexOf('</nav>'));
  assert.ok(nav.includes('First presentation') && nav.includes('Second presentation'));
  assert.ok(nav.includes('href="#session-presentation-1"'));
  assert.ok(html.includes('id="session-presentation-1"'));
  assert.ok(html.includes('id="session-presentation-2"'));
  assert.ok(html.includes('>01</span>') && html.includes('>02</span>'));
  for (const text of ['First explanation', 'A qualified insight', 'Only in this experiment.', 'Supporting evidence', 'A supporting paragraph', 'A useful qualification', 'Second explanation']) assert.ok(html.includes(text));
  assert.ok(html.includes(`href="/technlsummit/speakers/${speaker.slug}"`));
  assert.ok(!html.includes('<details') && !/\shidden(?:=|>|\s)/.test(html));
});

test('short presentations omit empty sections, retain escaping and need no overview index', () => {
  const html = render({ overview: 'Overview', keyTakeaways: ['Legacy insight'], presentations: [{ title: '<script>Title</script>', explanation: 'Brief demo', sections: [] }], highlightedInsight: { explanation: '<b>A finding</b>' } });
  assert.ok(!html.includes('<nav') && !html.includes('Detailed summary'));
  assert.ok(html.includes('&lt;script&gt;Title&lt;/script&gt;'));
  assert.ok(html.includes('&lt;b&gt;A finding&lt;/b&gt;'));
  assert.ok(!html.includes('summit-article-section'));
});
