import { ArrowUpRight, FileText } from 'lucide-react';
import { useParams } from 'react-router';
import { sessions } from '../content/index.js';
import { formatDay } from '../components/SessionList.jsx';
import SessionFacts from '../components/SessionFacts.jsx';
import SessionSummary from '../components/SessionSummary.jsx';
import NotFound from './NotFound.jsx';

export default function SessionDetail() {
  const { slug } = useParams();
  const session = sessions.find(item => item.slug === slug);
  if (!session) return <NotFound />;
  return <article className="summit-detail" data-session={session.slug}>
    <span className="summit-session-surface" data-shared="surface" aria-hidden="true" />
    <div className="summit-detail-topbar"><div className="summit-detail-dateline"><time dateTime={session.date}>{formatDay(session.date)}</time><span>{session.status === 'published' ? 'Session notes' : 'On the agenda'}</span></div></div>
    <div className="summit-detail-header"><h1 data-shared="title">{session.title}</h1><SessionFacts session={session} /></div>
    <div className="summit-detail-content" data-shared="summary">
    <p className="summit-intro">{session.description}</p>
    <div className="summit-detail-layout">
      <div>
        {session.status === 'published' ? <>
          <SessionSummary summary={session.summary} />
          {session.recordingUrl && <p><a className="summit-source-link" href={session.recordingUrl} target="_blank" rel="noreferrer">Open source recording <ArrowUpRight size={17} aria-hidden="true" /><span className="summit-sr-only"> (new tab)</span></a></p>}
        </> : <section className="summit-notes-empty"><FileText size={27} strokeWidth={1.4} aria-hidden="true" /><h2>Notes to follow.</h2><p>The summary will appear here after the session.</p></section>}
        <p className="summit-updated">Last updated <time dateTime={session.updatedAt}>{new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/St_Johns' }).format(new Date(session.updatedAt))}</time> · Newfoundland time</p>
      </div>
    </div>
    </div>
  </article>;
}
