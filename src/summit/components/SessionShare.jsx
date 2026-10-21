import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { canonicalSessionUrl, sharePublicLink } from '../lib/share.js';

export default function SessionShare({ session, url = canonicalSessionUrl(session.slug), kind = 'session' }) {
  const [state, setState] = useState('idle');
  const label = kind === 'recap' ? 'Article' : 'Session';
  const messages = { copied: `${label} link copied.`, shared: `${label} shared.`, cancelled: 'Sharing cancelled.', manual: 'Could not copy automatically. Select and copy the link below.' };
  return <div className="summit-session-share" data-share-state={state}>
    <button className="summit-share-button" type="button" disabled={state === 'sharing'} onClick={async () => {
      setState('sharing');
      setState(await sharePublicLink({ title: session.title, url }));
    }}><Share2 size={18} aria-hidden="true" /><span>Share {kind === 'recap' ? 'article' : 'session'}</span></button>
    <p className="summit-share-feedback" role="status" aria-live="polite">{messages[state] ?? ''}</p>
    {state === 'manual' && <label className="summit-share-fallback">{label} link<input readOnly value={url} onFocus={event => event.target.select()} /></label>}
  </div>;
}
