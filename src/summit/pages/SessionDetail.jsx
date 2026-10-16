import { useParams } from 'react-router';
import { sessions, allSpeakers, allCompanies } from '../content/index.js';
import { SessionMeta } from '../components/SessionList.jsx';
import SessionSummary from '../components/SessionSummary.jsx';
import ContentLinks from '../components/ContentLinks.jsx';
import NotFound from './NotFound.jsx';

export default function SessionDetail() {
  const { slug } = useParams();
  const session = sessions.find(item => item.slug === slug);
  if (!session) return <NotFound />;

  return (
    <article>
      <h1>{session.title}</h1>
      <SessionMeta session={session} />
      <p className="summit-intro">{session.description}</p>
      {session.status === 'published' ? <>
        <SessionSummary summary={session.summary} />
        {session.recordingUrl && <p><a href={session.recordingUrl} target="_blank" rel="noreferrer">Open source recording (new tab)</a></p>}
      </> : (
        <section>
          <h2>Summary not available yet</h2>
          <p>This session is upcoming. Notes will appear here once the summary is published.</p>
        </section>
      )}
      <section>
        <h2>Speakers</h2>
        <ContentLinks items={allSpeakers.filter(item => session.speakerIds.includes(item.id))} directory="speakers" />
      </section>
      <section>
        <h2>Companies</h2>
        <ContentLinks items={allCompanies.filter(item => session.companyIds.includes(item.id))} directory="companies" />
      </section>
      <p className="summit-meta">Last updated: <time dateTime={session.updatedAt}>{new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/St_Johns' }).format(new Date(session.updatedAt))} (Newfoundland time)</time></p>
    </article>
  );
}
