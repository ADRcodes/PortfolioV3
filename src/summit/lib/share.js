import { summitPath } from '../routing/paths.js';

export const canonicalSessionUrl = slug => `https://www.alexrussell.info${summitPath(`sessions/${slug}`)}`;
export const SUMMIT_SHARE_URL = 'https://alexrussell.info/technlsummit';
export const SUMMIT_QR_ASSET = '/images/summit/technl-summit-qr-v1.svg';
export const SUMMIT_QR_DOWNLOAD = '/images/summit/technl-summit-qr-v1.png';

export function shareSession(session, platform = navigator) {
  return sharePublicLink({ title: session.title, url: canonicalSessionUrl(session.slug) }, platform);
}
export async function sharePublicLink({ title, url }, platform = navigator) {
  if (typeof platform.share === 'function') {
    try {
      await platform.share({ title, url });
      return 'shared';
    } catch (error) {
      if (error.name === 'AbortError') return 'cancelled';
      // A denied/unsupported native share can still offer clipboard or manual copying.
    }
  }
  return copyPublicLink(url, platform);
}
export async function copyPublicLink(url, platform = navigator) {
  try {
    if (typeof platform.clipboard?.writeText !== 'function') return 'manual';
    await platform.clipboard.writeText(url);
    return 'copied';
  } catch { return 'manual'; }
}
