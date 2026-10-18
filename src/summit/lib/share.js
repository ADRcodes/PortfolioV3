import { summitPath } from '../routing/paths.js';

export const canonicalSessionUrl = slug => `https://www.alexrussell.info${summitPath(`sessions/${slug}`)}`;
export async function shareSession(session, platform = navigator) {
  const url = canonicalSessionUrl(session.slug);
  if (typeof platform.share === 'function') {
    try {
      await platform.share({ title: session.title, url });
      return 'shared';
    } catch (error) {
      if (error.name === 'AbortError') return 'cancelled';
      // A denied/unsupported native share can still offer clipboard or manual copying.
    }
  }
  try {
    if (typeof platform.clipboard?.writeText !== 'function') return 'manual';
    await platform.clipboard.writeText(url);
    return 'copied';
  } catch { return 'manual'; }
}
