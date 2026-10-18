import speakers from './speakers.json';
import companies from './companies.json';
import { createContent } from './model.js';

const files = import.meta.glob('./sessions/*.json', { eager: true, import: 'default' });
export const { sessions, speakers: allSpeakers, companies: allCompanies } = createContent(Object.values(files), speakers, companies);
export const sessionsForSpeaker = (id) => sessions.filter(session => session.speakerIds.includes(id));
export const sessionsForCompany = (id) => sessions.filter(session => session.companyIds.includes(id));
export const speakersForCompany = (id) => allSpeakers.filter(speaker => speaker.companyIds.includes(id));
