// Optional asset regeneration only. No QR encoder is shipped to visitors.
// node scripts/generate-summit-qr.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import QRCode from 'qrcode';
import { PNG } from 'pngjs';
import { SUMMIT_SHARE_URL } from '../src/summit/lib/share.js';

const output = new URL('../public/images/summit/', import.meta.url);
await mkdir(output, { recursive: true });
const options = { errorCorrectionLevel: 'H', margin: 4, color: { dark: '#000000ff', light: '#ffffffff' } };
await writeFile(new URL('technl-summit-qr-v1.svg', output), await QRCode.toString(SUMMIT_SHARE_URL, { ...options, type: 'svg' }));
const large = await QRCode.toBuffer(SUMMIT_SHARE_URL, { ...options, scale: 48 });
await writeFile(new URL('technl-summit-qr-v1.png', output), large);

// 1290 × 2796 portrait canvas, with the code below the lock-screen clock/widgets.
const wallpaper = new PNG({ width: 1290, height: 2796 });
for (let i = 0; i < wallpaper.data.length; i += 4) {
  wallpaper.data.set([56, 75, 75, 255], i);
}
const code = PNG.sync.read(await QRCode.toBuffer(SUMMIT_SHARE_URL, { ...options, scale: 24 }));
PNG.bitblt(code, wallpaper, 0, 0, code.width, code.height, Math.floor((wallpaper.width - code.width) / 2), 1250);
await writeFile(new URL('technl-summit-iphone-wallpaper-v1.png', output), PNG.sync.write(wallpaper));
console.log(`Generated local QR assets for ${SUMMIT_SHARE_URL}; ${PNG.sync.read(large).width}px QR and 1290 × 2796 wallpaper.`);
