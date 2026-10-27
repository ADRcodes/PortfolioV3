import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../styles/summit.css', import.meta.url), 'utf8');
const palette = Object.fromEntries([...css.matchAll(/--summit-([\w-]+):\s*(#[\da-f]{6});/gi)].map(([, name, value]) => [name, value]));
const luminance = hex => {
  const channels = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return channels.reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
};
const contrast = (foreground, background) => {
  assert.ok(palette[foreground], foreground);
  assert.ok(palette[background], background);
  const values = [luminance(palette[foreground]), luminance(palette[background])].sort((a, b) => a - b);
  return (values[1] + .05) / (values[0] + .05);
};

test('Summit reading, metadata and action colours meet normal-text contrast on their surfaces', () => {
  for (const surface of ['surface', 'surface-raised', 'surface-soft', 'surface-hover', 'panel', 'panel-hover', 'workshop', 'workshop-hover', 'success-surface']) {
    assert.ok(contrast('ink', surface) >= 4.5, `ink on ${surface}`);
    assert.ok(contrast('muted', surface) >= 4.5, `metadata on ${surface}`);
  }
  for (const surface of ['bg', 'bg-deep', 'bg-hover']) {
    assert.ok(contrast('on-dark', surface) >= 4.5, `text on ${surface}`);
    assert.ok(contrast('on-dark-muted', surface) >= 4.5, `metadata on ${surface}`);
    assert.ok(contrast('accent', surface) >= 4.5, `accent on ${surface}`);
  }
  assert.ok(contrast('ink', 'accent') >= 4.5);
  assert.ok(contrast('ink', 'accent-hover') >= 4.5);
  assert.ok(contrast('link', 'surface') >= 4.5);
});

test('Summit control boundaries remain visible on dark and light surfaces', () => {
  assert.ok(contrast('control-line-dark', 'bg-deep') >= 3);
  assert.ok(contrast('control-line', 'surface') >= 3);
  assert.ok(contrast('line-dark', 'bg') >= 3);
});


test('Summit styles keep colour literals in the shared palette definitions', () => {
  const directory = new URL('../styles/', import.meta.url);
  for (const filename of readdirSync(directory).filter(name => name.endsWith('.css'))) {
    const styles = readFileSync(new URL(filename, directory), 'utf8').replace(/^\s*--summit-[\w-]+:[^\n]*$/gm, '');
    assert.ok(!/#[\da-f]{3,8}\b/i.test(styles), `${filename} contains a detached colour literal`);
  }
});
