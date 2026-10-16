import { useParams } from 'react-router';
import { sessions, allSpeakers, allCompanies } from '../content/index.js';
import { SessionMeta } from '../components/SessionList.jsx';
import ContentLinks from '../components/ContentLinks.jsx';
import NotFound from './NotFound.jsx';

export default function SessionDetail() {
  const { slug } = useParams();
  const session = sessions.find(item => item.slug === slug);
  if (!session) return <NotFound />;
  return <article>
    <h1>{session.title}</h1><SessionMeta session={session} /><p className="summit-intro">{session.description}</p>
    <section><h2>Speakers</h2><ContentLinks items={allSpeakers.filter(item => session.speakerIds.includes(item.id))} directory="speakers" /></section>
    <section><h2>Companies</h2><ContentLinks items={allCompanies.filter(item => session.companyIds.includes(item.id))} directory="companies" /></section>
    {session.status === 'published' ? <>
      <section><h2>AI-generated overview</h2><p>Summary published. AI-generated notes may contain errors; check the source when available.</p><p>{session.summary.overview}</p></section>
      {Object.entries({ keyTakeaways: 'Key takeaways', notableIdeas: 'Notable ideas', practicalApplications: 'Practical applications' }).map(([key, title]) => <section key={key}><h2>{title}</h2>{session.summary[key].length ? <ul className="summit-bullets">{session.summary[key].map((item, index) => <li key={index}>{item}</li>)}</ul> : <p>None recorded.</p>}</section>)}
      {session.recordingUrl && <p><a href={session.recordingUrl} target="_blank" rel="noreferrer">Open source recording (new tab)</a></p>}
    </> : <section><h2>Summary not available yet</h2><p>This session is upcoming. Notes will appear here once the summary is published.</p></section>}
    <p className="summit-meta">Last updated: <time dateTime={session.updatedAt}>{new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/St_Johns' }).format(new Date(session.updatedAt))} (Newfoundland time)</time></p>
  </article>;
}
