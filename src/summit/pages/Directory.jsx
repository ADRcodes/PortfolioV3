import { Link, useParams, useSearchParams } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { allCompanies, sessionsForSpeaker, sessionsForCompany, speakersForCompany } from '../content/index.js';
import { summitPath } from '../routing/paths.js';
import SessionList from '../components/SessionList.jsx';
import NotFound from './NotFound.jsx';
import SpeakerIdentity from '../components/SpeakerIdentity.jsx';
import LinkedInLink, { linkedInUrl } from '../components/LinkedInLink.jsx';
import { matchesSearch } from '../lib/search.js';
import { directorySpeakers, directoryCompanies } from '../content/index.js';
import { formatTime } from '../lib/agenda.js';

const collections = { speakers: directorySpeakers, companies: directoryCompanies };
const compare = new Intl.Collator('en-CA', { sensitivity: 'base', numeric: true }).compare;
const weekday = date => new Intl.DateTimeFormat('en-CA', { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
const affiliations = speaker => allCompanies.filter(company => speaker.companyIds.includes(company.id));
const initials = name => name.split(/\s+/).slice(0, 2).map(word => word[0]).join('');
const firstPresentation = speaker => {
  const session = sessionsForSpeaker(speaker.id)[0];
  return session ? `${session.date} ${session.startTime}` : '9999';
};
function CompanyLinks({ companies, logos = false }) {
  return <ul className="summit-affiliations">{companies.map(company => <li key={company.id}><Link data-profile={`companies/${company.slug}`} to={summitPath(`companies/${company.slug}`)}>{logos && company.image && <img src={company.image} alt="" loading="lazy" />}<span>{company.name}</span></Link></li>)}</ul>;
}
function Portrait({ item, company = false, className = '' }) {
  return <div className={`summit-portrait${company ? ' is-company' : ''} ${className}`}>{item.image ? <img src={item.image} alt="" loading="lazy" /> : <span aria-hidden="true">{initials(item.name)}</span>}</div>;
}
function SpeakerRow({ speaker }) {
  return <li className="summit-speaker-row">
    <Portrait item={speaker} />
    <div className="summit-speaker-row-copy">
      <div className="summit-person-heading"><h2 data-profile={`speakers/${speaker.slug}`}><Link className="summit-speaker-profile-link" data-profile={`speakers/${speaker.slug}`} to={summitPath(`speakers/${speaker.slug}`)}>{speaker.name}</Link></h2><LinkedInLink item={speaker} /><Link className="summit-mobile-profile-link" to={summitPath(`speakers/${speaker.slug}`)} aria-label={`About ${speaker.name}`}><ArrowUpRight size={24} aria-hidden="true" /></Link></div>
      <CompanyLinks companies={affiliations(speaker)} />
      <p className="summit-speaker-bio">{speaker.description}</p>
      <ul className="summit-speaker-sessions">{sessionsForSpeaker(speaker.id).map(session => <li key={session.id}><span className="summit-speaker-session-time">Presenting at {formatTime(session.startTime)} on {weekday(session.date)}</span><Link to={summitPath(`sessions/${session.slug}`)}>{session.title}<ArrowUpRight size={16} aria-hidden="true" /></Link></li>)}</ul>
    </div>
  </li>;
}
export function Directory({ type }) {
  const [params, setParams] = useSearchParams();
  const title = type === 'speakers' ? 'Speakers' : 'Companies';
  const query = params.get('q') ?? '';
  const results = collections[type].filter(item => matchesSearch(item, query, allCompanies));
  const search = <div className="summit-directory-search"><label htmlFor={`summit-search-${type}`}>Search {title.toLowerCase()}</label><input id={`summit-search-${type}`} type="search" value={query} onChange={event => { const value = event.target.value; setParams(previous => { const next = new URLSearchParams(previous); value ? next.set('q', value) : next.delete('q'); return next; }, { replace: true }); }} /><p className="summit-search-status" role="status">{results.length} {title.toLowerCase()} found{!results.length ? '. Try another name or keyword.' : '.'}</p></div>;
  if (type === 'speakers') {
    const sort = ['name', 'company'].includes(params.get('sort')) ? params.get('sort') : 'presenting';
    const companyName = speaker => affiliations(speaker).map(company => company.name).sort(compare)[0] ?? '';
    const speakers = [...results].sort((a, b) => {
      if (sort === 'presenting') {
        const order = compare(firstPresentation(a), firstPresentation(b));
        if (order) return order;
      }
      if (sort === 'company') {
        const left = companyName(a), right = companyName(b);
        if (Boolean(left) !== Boolean(right)) return left ? -1 : 1;
        const order = compare(left, right);
        if (order) return order;
      }
      return compare(a.name, b.name);
    });
    return <><div className="summit-directory-heading"><h1>{title}</h1></div>{search}
      <div className="summit-sortbar" role="group" aria-label="Sort speakers">{[['presenting', 'Presenting order'], ['name', 'Name'], ['company', 'Company']].map(([value, label]) => <button key={value} type="button" aria-pressed={sort === value} onClick={() => setParams(previous => { const next = new URLSearchParams(previous); next.set('sort', value); return next; }, { replace: true })}>{label}</button>)}</div>
      <ul className="summit-speaker-directory">{speakers.map(speaker => <SpeakerRow key={speaker.id} speaker={speaker} />)}</ul></>;
  }
  return <><h1>{title}</h1>{search}<ul className="summit-company-directory">{[...results].sort((a, b) => compare(a.name, b.name)).map(item => <li key={item.id}>
    <Portrait item={item} company />
    <div className="summit-company-row-copy"><h2 data-profile={`${type}/${item.slug}`}>{item.name}</h2><p>{item.description}</p></div>
    <Link className="summit-company-row-open" to={summitPath(`${type}/${item.slug}`)} aria-label={`View ${item.name}`}><span>View company</span><ArrowUpRight size={26} aria-hidden="true" /></Link>
  </li>)}</ul></>;
}
export function Profile({ type }) {
  const { slug } = useParams();
  const item = collections[type].find(item => item.slug === slug);
  if (!item) return <NotFound />;
  const isSpeaker = type === 'speakers';
  const companies = isSpeaker ? affiliations(item) : [];
  const linkedin = linkedInUrl(item);
  const urls = item.urls.filter(link => {
    const url = new URL(link.url);
    const programme = /(^|\.)technl\.ca$/.test(url.hostname) && url.pathname.replace(/\/$/, '') === '/technlsummit26';
    return link.url !== linkedin && !programme;
  });
  return <article className={`summit-profile${isSpeaker ? ' is-speaker' : ' is-company'}`}>
    <header className="summit-profile-hero">
      <Portrait item={item} company={!isSpeaker} className="summit-profile-media" />
      <div className="summit-profile-copy">
        <div className="summit-person-heading"><h1 data-profile={`${type}/${item.slug}`}>{item.name}</h1>{linkedin && <LinkedInLink item={item} />}</div>
        {!!companies.length && <CompanyLinks companies={companies} logos />}
        <p className="summit-profile-description">{item.description}</p>
        {!!urls.length && <ul className="summit-profile-urls">{urls.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={17} aria-hidden="true" /><span className="summit-sr-only"> (opens in a new tab)</span></a></li>)}</ul>}
      </div>
    </header>
    {!isSpeaker && <section className="summit-profile-section"><h2>People at {item.name}</h2><ul className="summit-profile-people">{speakersForCompany(item.id).map(speaker => <li key={speaker.id}><SpeakerIdentity speaker={speaker} showCompanies={false} /></li>)}</ul>{!speakersForCompany(item.id).length && <p>No speakers listed yet.</p>}</section>}
    <section className="summit-profile-section"><h2>At the Summit</h2><SessionList sessions={isSpeaker ? sessionsForSpeaker(item.id) : sessionsForCompany(item.id)} /></section>
  </article>;
}
