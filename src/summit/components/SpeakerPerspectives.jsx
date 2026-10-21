import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { getSpeakerPerspectives } from '../content/perspectives.js';
import { summitPath } from '../routing/paths.js';
import '../styles/speaker-perspectives.css';

const dateFormat = new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeZone: 'America/St_Johns' });

export default function SpeakerPerspectives({ speaker, sessions }) {
  const perspectives = getSpeakerPerspectives(speaker, sessions);
  if (!perspectives.length) return null;
  return <section className="summit-profile-section summit-perspectives" aria-labelledby="summit-perspectives-heading">
    <h2 id="summit-perspectives-heading">Perspectives from the Summit</h2>
    <ul>{perspectives.map((perspective, index) => <li key={`${perspective.sessionSlug}-${index}`}>
      <h3>{!perspective.heading && perspective.quote && <span className="summit-perspective-source">Source: </span>}{perspective.heading || perspective.sessionTitle}</h3>
      {perspective.heading && <p className="summit-perspective-session"><span className="summit-perspective-source">Source: </span>{perspective.sessionTitle}</p>}
      {perspective.quote && <figure className="summit-perspective-quote">
        <blockquote><p>“{perspective.quote}”</p></blockquote>
        <figcaption>— {speaker.name}
          <span className="summit-perspective-source">Machine-transcript excerpt; not checked against the original audio.</span>
        </figcaption>
      </figure>}
      <p>{!perspective.quote && <span className="summit-perspective-source">Paraphrased perspective: </span>}{perspective.summary}</p>
      <div className="summit-perspective-footer">
        <Link to={summitPath(`sessions/${perspective.sessionSlug}`)}>Read the full session notes <ArrowUpRight size={17} aria-hidden="true" /></Link>
        {perspective.publishedAt && <time dateTime={perspective.publishedAt}>{dateFormat.format(new Date(perspective.publishedAt))}</time>}
      </div>
    </li>)}</ul>
  </section>;
}
