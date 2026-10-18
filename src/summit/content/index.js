import speakers from './speakers.json';
import companies from './companies.json';
import { createContent } from './model.js';

const files = import.meta.glob('./sessions/*.json', { eager: true, import: 'default' });
export const { sessions, speakers: allSpeakers, companies: allCompanies } = createContent(Object.values(files), speakers, companies);
export const conferenceSessions = sessions.filter(session => session.programme === 'conference');
export const directorySpeakers = allSpeakers.filter(item => !item.demo);
export const directoryCompanies = allCompanies.filter(item => !item.demo);
export const sessionsForSpeaker = (id) => conferenceSessions.filter(session => session.speakerIds.includes(id));
export const sessionsForCompany = (id) => conferenceSessions.filter(session => session.companyIds.includes(id));
export const speakersForCompany = (id) => directorySpeakers.filter(speaker => speaker.companyIds.includes(id));
