import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { recaps } from '../content/index.js';
import { formatPublication } from '../lib/programme.js';
import { summitPath } from '../routing/paths.js';
import '../styles/recaps.css';

export default function RecapFeatures() {
  if (!recaps.length) return null;
  return <section className="summit-recap-features" aria-labelledby="summit-recaps-title">
    <h3 id="summit-recaps-title" className="summit-sr-only">Across the sessions</h3>
    <div className="summit-recap-collection">{recaps.map(recap => <article className="summit-recap-feature" key={recap.id}>
      <Link className="summit-recap-preview" to={summitPath(`recaps/${recap.slug}`)} aria-labelledby={`recap-title-${recap.slug}`} aria-describedby={`recap-excerpt-${recap.slug}`}>
        <h4 id={`recap-title-${recap.slug}`}>{recap.title}</h4>
        <p id={`recap-excerpt-${recap.slug}`}>{recap.excerpt}</p>
        <div className="summit-recap-feature-footer">
          <time className="summit-recap-feature-date" dateTime={recap.publishedAt}>{formatPublication(recap.publishedAt)}</time>
          <span className="summit-recap-read" aria-hidden="true">Read the recap <ArrowUpRight size={20} /></span>
        </div>
      </Link>
    </article>)}</div>
  </section>;
}
