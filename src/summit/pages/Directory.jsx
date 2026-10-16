import { Link, useParams } from 'react-router';
import { allSpeakers, allCompanies, sessionsForSpeaker, sessionsForCompany, speakersForCompany } from '../content/index.js';
import { summitPath } from '../routing/paths.js';
import ContentLinks from '../components/ContentLinks.jsx';
import SessionList from '../components/SessionList.jsx';
import NotFound from './NotFound.jsx';

const collections = { speakers: allSpeakers, companies: allCompanies };
export function Directory({ type }) {
  const title = type === 'speakers' ? 'Speakers' : 'Companies';
  return <><h1>{title}</h1>{!collections[type].length && <p>No {type} listed yet.</p>}<ul className="summit-directory">{collections[type].map(item => <li key={item.id}><h2><Link to={summitPath(`${type}/${item.slug}`)}>{item.name}</Link></h2><p>{item.description}</p></li>)}</ul></>;
}
export function Profile({ type }) {
  const { slug } = useParams();
  const item = collections[type].find(item => item.slug === slug);
  if (!item) return <NotFound />;
  const isSpeaker = type === 'speakers';
  const companies = isSpeaker ? allCompanies.filter(company => item.companyIds.includes(company.id)) : [];
  return <article><h1>{item.name}</h1>
    {item.image && <img className="summit-profile-image" src={item.image} alt={item.imageAlt} />}
    <p className="summit-intro">{item.description}</p>
    {!!item.urls.length && <ul className="summit-links">{item.urls.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noreferrer">{link.label} (new tab)</a></li>)}</ul>}
    <section><h2>{isSpeaker ? 'Companies' : 'Speakers'}</h2><ContentLinks items={isSpeaker ? companies : speakersForCompany(item.id)} directory={isSpeaker ? 'companies' : 'speakers'} /></section>
    <section><h2>Sessions</h2><SessionList sessions={isSpeaker ? sessionsForSpeaker(item.id) : sessionsForCompany(item.id)} /></section>
  </article>;
}
