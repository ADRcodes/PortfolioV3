export const eventLabels = { talk: 'Presentation', panel: 'Panel', workshop: 'Workshop', networking: 'Networking / social', registration: 'Registration', break: 'Break / meal', activity: 'Other activity' };
export const expectsSummary = session => ['talk', 'panel', 'workshop'].includes(session.eventType ?? 'talk');
export const publicationLabel = session => session.status === 'published' ? 'Notes available' : expectsSummary(session) ? 'Notes to follow' : eventLabels[session.eventType];
export const officialSessions = sessions => sessions.filter(session => (session.programme ?? 'conference') === 'conference' && session.status !== 'draft');
export const filterAgenda = (sessions, filter) => officialSessions(sessions).filter(session => filter !== 'notes' || session.status === 'published');
export const recentSummaries = sessions => filterAgenda(sessions, 'notes').sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || a.id.localeCompare(b.id)).slice(0, 3);
export const formatPublication = timestamp => new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/St_Johns' }).format(new Date(timestamp));
