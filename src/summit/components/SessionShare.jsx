import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { canonicalSessionUrl, shareSession } from '../lib/share.js';

export default function SessionShare({ session }) {
  const [state, setState] = useState('idle');
  const messages = { copied: 'Session link copied.', shared: 'Session shared.', cancelled: 'Sharing cancelled.', manual: 'Could not copy automatically. Select and copy the link below.' };
  return <div className="summit-session-share" data-share-state={state}>
    <button className="summit-share-button" type="button" disabled={state === 'sharing'} onClick={async () => {
      setState('sharing');
      setState(await shareSession(session));
    }}><Share2 size={18} aria-hidden="true" /><span>Share session</span></button>
    <p className="summit-share-feedback" role="status" aria-live="polite">{messages[state] ?? ''}</p>
    {state === 'manual' && <label className="summit-share-fallback">Session link<input readOnly value={canonicalSessionUrl(session.slug)} onFocus={event => event.target.select()} /></label>}
  </div>;
}
