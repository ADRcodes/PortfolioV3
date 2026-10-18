import { Link } from 'react-router';
import { allCompanies } from '../content/index.js';
import { summitPath } from '../routing/paths.js';

export default function SpeakerIdentity({ speaker, heading = false, compact = false, showCompanies = true }) {
  const companies = allCompanies.filter(company => speaker.companyIds.includes(company.id));
  const name = <Link className="summit-profile-link" data-profile={`speakers/${speaker.slug}`} to={summitPath(`speakers/${speaker.slug}`)}>{speaker.name}</Link>;
  return <div className={`summit-speaker-identity${compact ? ' is-compact' : ''}`}>
    {!compact && speaker.image && <Link className="summit-speaker-portrait-link" to={summitPath(`speakers/${speaker.slug}`)} tabIndex={-1} aria-hidden="true"><img src={speaker.image} alt="" width={96} height={96} loading="lazy" /></Link>}
    <div className="summit-speaker-info">
      {heading ? <h2>{name}</h2> : name}
      {showCompanies && !!companies.length && <ul className="summit-speaker-companies">{companies.map(company => <li key={company.id}><Link className="summit-profile-link" data-profile={`companies/${company.slug}`} to={summitPath(`companies/${company.slug}`)}>{company.name}</Link></li>)}</ul>}
    </div>
  </div>;
}
