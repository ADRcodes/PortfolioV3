import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import { copyPublicLink, sharePublicLink, SUMMIT_SHARE_URL } from './share.js';

const asset = name => new URL(`../../../public/images/summit/${name}`, import.meta.url);
const qr = PNG.sync.read(await readFile(asset('technl-summit-qr-v1.png')));
const wallpaper = PNG.sync.read(await readFile(asset('technl-summit-iphone-wallpaper-v1.png')));

// Sample the real committed assets at screen sizes, independently of the encoder.
function resize(image, width, height = Math.round(image.height * width / image.width)) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const source = (Math.min(image.height - 1, Math.floor((y + .5) * image.height / height)) * image.width + Math.min(image.width - 1, Math.floor((x + .5) * image.width / width))) * 4;
    data.set(image.data.subarray(source, source + 4), (y * width + x) * 4);
  }
  return { data, width, height };
}
function decode(image) {
  return jsQR(image.data, image.width, image.height, { inversionAttempts: 'dontInvert' })?.data;
}

test('high-resolution QR is local, square, high contrast and decodes at mobile sizes', () => {
  assert.ok(qr.width >= 2000);
  assert.equal(qr.width, qr.height);
  assert.deepEqual([...qr.data.subarray(0, 4)], [255, 255, 255, 255]);
  for (const width of [160, 192, 216, 240, 248, 280]) {
    assert.equal(decode(resize(qr, width)), 'https://alexrussell.info/technlsummit', `${width}px QR`);
  }
});

test('portrait wallpaper retains a readable QR at narrow iPhone screen sizes', () => {
  assert.deepEqual([wallpaper.width, wallpaper.height], [1290, 2796]);
  for (const width of [320, 375, 390, 430]) {
    assert.equal(decode(resize(wallpaper, width)), 'https://alexrussell.info/technlsummit', `${width}px wallpaper`);
  }
});

test('QR display SVG is self-contained with crisp modules and a white background', async () => {
  const svg = await readFile(asset('technl-summit-qr-v1.svg'), 'utf8');
  assert.ok(svg.includes('shape-rendering="crispEdges"'));
  assert.ok(svg.includes('fill="#ffffff"'));
  assert.ok(!/<(?:image|script)|https?:\/\/(?!www\.w3\.org)/.test(svg));
});

test('Summit copy and native share use the requested public URL with graceful fallbacks', async () => {
  assert.equal(SUMMIT_SHARE_URL, 'https://alexrussell.info/technlsummit');
  let copied, shared;
  assert.equal(await copyPublicLink(SUMMIT_SHARE_URL, { clipboard: { writeText: async url => { copied = url; } } }), 'copied');
  assert.equal(copied, SUMMIT_SHARE_URL);
  assert.equal(await copyPublicLink(SUMMIT_SHARE_URL, {}), 'manual');
  assert.equal(await copyPublicLink(SUMMIT_SHARE_URL, { clipboard: { writeText: async () => { throw new Error('Denied'); } } }), 'manual');
  assert.equal(await sharePublicLink({ title: 'Summit', url: SUMMIT_SHARE_URL, recordingUrl: 'private' }, { share: async payload => { shared = payload; } }), 'shared');
  assert.deepEqual(shared, { title: 'Summit', url: SUMMIT_SHARE_URL });
  assert.equal(await sharePublicLink(shared, { share: async () => { throw Object.assign(new Error(), { name: 'AbortError' }); } }), 'cancelled');
  assert.equal(await sharePublicLink(shared, { share: async () => { throw new Error('Denied'); }, clipboard: { writeText: async () => {} } }), 'copied');
});
