const fail = (message) => { throw new Error(`Summit content: ${message}`); };
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const strings = (value) => Array.isArray(value) && value.every(text);
const url = (value) => {
  try { return typeof value === 'string' && ['https:', 'http:'].includes(new URL(value).protocol); }
  catch { return false; }
};

export function validateSession(session) {
  for (const key of ['id', 'slug', 'title', 'location', 'description']) {
    if (!text(session[key])) fail(`session requires ${key}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(session.slug)) fail(`invalid slug ${session.slug}`);
  if (!['upcoming', 'draft', 'published'].includes(session.status)) fail(`invalid status for ${session.id}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(session.date) || Number.isNaN(Date.parse(session.date)) || new Date(session.date).toISOString().slice(0, 10) !== session.date) fail(`invalid date for ${session.id}`);
  for (const key of ['startTime', 'endTime']) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(session[key])) fail(`invalid ${key} for ${session.id}`);
  }
  if (session.endTime <= session.startTime) fail(`endTime must follow startTime for ${session.id}`);
  for (const key of ['speakerIds', 'companyIds']) {
    if (!strings(session[key])) fail(`invalid ${key} for ${session.id}`);
  }
  if (!text(session.updatedAt) || !/(Z|[+-]\d{2}:\d{2})$/.test(session.updatedAt) || Number.isNaN(Date.parse(session.updatedAt))) fail(`invalid updatedAt for ${session.id}`);
  if (session.recordingUrl != null && !url(session.recordingUrl)) fail(`invalid recordingUrl for ${session.id}`);
  if (!session.summary || typeof session.summary.overview !== 'string') fail(`summary required for ${session.id}`);
  for (const key of ['keyTakeaways', 'notableIdeas', 'practicalApplications']) {
    if (!strings(session.summary[key])) fail(`invalid summary.${key} for ${session.id}`);
  }
  if (session.status === 'published' && (!text(session.summary.overview) || !session.summary.keyTakeaways.length)) fail(`published session ${session.id} requires an overview and takeaways`);
  return session;
}

// This runs before Vite bundles JSON: private content never reaches browser assets.
export function publicSession(session) {
  validateSession(session);
  if (session.status === 'draft') return null;
  const { id, slug, title, date, startTime, endTime, location, description, speakerIds, companyIds, status, updatedAt } = session;
  return { id, slug, title, date, startTime, endTime, location, description, speakerIds, companyIds, status, updatedAt,
    ...(status === 'published' ? { summary: session.summary, recordingUrl: session.recordingUrl ?? null } : {}) };
}

export function createContent(rawSessions, speakers, companies) {
  const sessions = rawSessions.filter(Boolean).sort((a, b) => `${a.date} ${a.startTime} ${a.id}`.localeCompare(`${b.date} ${b.startTime} ${b.id}`));
  for (const [label, items] of Object.entries({ sessions, speakers, companies })) {
    for (const key of ['id', 'slug']) {
      if (new Set(items.map(item => item[key])).size !== items.length) fail(`duplicate ${label} ${key}`);
    }
    for (const item of items) {
      if (!text(item.id) || !text(item.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) fail(`invalid ${label} identity`);
      if (label !== 'sessions') {
        if (!text(item.name) || !text(item.description) || !Array.isArray(item.urls) || !item.urls.every(link => text(link.label) && url(link.url))) fail(`invalid ${label} profile ${item.id}`);
        if (item.image != null && (!url(item.image) || !text(item.imageAlt))) fail(`image requires HTTPS/HTTP URL and imageAlt for ${item.id}`);
      }
    }
  }
  const check = (ids, targets, label) => {
    if (!strings(ids) || ids.some(id => !targets.some(target => target.id === id))) fail(`unknown ${label} reference`);
  };
  for (const session of sessions) {
    check(session.speakerIds, speakers, 'speaker');
    check(session.companyIds, companies, 'company');
  }
  for (const speaker of speakers) check(speaker.companyIds, companies, 'speaker company');
  // Session relationships are derived from the authoritative session files.
  return { sessions, speakers, companies };
}
