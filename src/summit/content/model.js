import { publicSpeaker, validateSpeakerPerspectives } from './perspectives.js';

const fail = (message) => { throw new Error(`Summit content: ${message}`); };
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const strings = (value) => Array.isArray(value) && value.every(text);
const url = (value) => {
  try { return typeof value === 'string' && ['https:', 'http:'].includes(new URL(value).protocol); }
  catch { return false; }
};
const imageUrl = value => url(value) || (typeof value === 'string' && /^\/images\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:svg|png|webp|jpe?g|avif)$/i.test(value));

export function validateSession(session) {
  for (const key of ['id', 'slug', 'title', 'description']) {
    if (!text(session[key])) fail(`session requires ${key}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(session.slug)) fail(`invalid slug ${session.slug}`);
  if (session.eventType !== undefined && !['talk', 'panel', 'workshop', 'networking', 'registration', 'break', 'activity'].includes(session.eventType)) fail(`invalid eventType for ${session.id}`);
  if (session.programme !== undefined && !['conference', 'external'].includes(session.programme)) fail(`invalid programme for ${session.id}`);
  if (!['upcoming', 'draft', 'published'].includes(session.status)) fail(`invalid status for ${session.id}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(session.date) || Number.isNaN(Date.parse(session.date)) || new Date(session.date).toISOString().slice(0, 10) !== session.date) fail(`invalid date for ${session.id}`);
  const dateOnly = session.programme === 'external' && session.startTime === null && session.endTime === null;
  if (!dateOnly) {
    for (const key of ['startTime', 'endTime']) {
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(session[key])) fail(`invalid ${key} for ${session.id}`);
    }
    if (session.endTime <= session.startTime) fail(`endTime must follow startTime for ${session.id}`);
  }
  if (!text(session.location) && !(session.programme === 'external' && session.location === null)) fail(`session requires location for ${session.id}`);
  for (const key of ['speakerIds', 'companyIds']) {
    if (!strings(session[key])) fail(`invalid ${key} for ${session.id}`);
  }
  if (!text(session.updatedAt) || !/(Z|[+-]\d{2}:\d{2})$/.test(session.updatedAt) || Number.isNaN(Date.parse(session.updatedAt))) fail(`invalid updatedAt for ${session.id}`);
  if (session.recordingUrl != null && !url(session.recordingUrl)) fail(`invalid recordingUrl for ${session.id}`);
  if (!session.summary || typeof session.summary.overview !== 'string') fail(`summary required for ${session.id}`);
  const summary = session.summary;
  const invalid = (field, expected) => fail(`${session.id}: summary.${field} ${expected}`);
  if (!Array.isArray(summary.keyTakeaways)) invalid('keyTakeaways', 'must be an array');
  summary.keyTakeaways.forEach((takeaway, index) => {
    if (typeof takeaway === 'string') {
      if (!text(takeaway)) invalid(`keyTakeaways[${index}]`, 'must not be blank');
      return;
    }
    if (!takeaway || typeof takeaway !== 'object' || Array.isArray(takeaway) || !text(takeaway.explanation)) {
      invalid(`keyTakeaways[${index}].explanation`, 'must be a nonempty string (or use a legacy string takeaway)');
    }
    if (takeaway.heading !== undefined && !text(takeaway.heading)) invalid(`keyTakeaways[${index}].heading`, 'must be a nonempty string when supplied');
  });
  for (const key of ['notableIdeas', 'practicalApplications']) {
    if (summary[key] !== undefined && !strings(summary[key])) invalid(key, 'must be an array of nonempty strings when supplied');
  }
  const sections = (value, path) => {
    if (!Array.isArray(value)) invalid(path, 'must be an array when supplied');
    value.forEach((section, index) => {
      const field = `${path}[${index}]`;
      if (!section || !text(section.heading)) invalid(`${field}.heading`, 'must be a nonempty string');
      if (!strings(section.paragraphs) || !section.paragraphs.length) invalid(`${field}.paragraphs`, 'must contain at least one nonempty paragraph');
      if (section.bullets !== undefined && !strings(section.bullets)) invalid(`${field}.bullets`, 'must be an array of nonempty strings when supplied');
    });
  };
  const insight = (value, path) => {
    if (!value || !text(value.explanation)) invalid(`${path}.explanation`, 'must be a nonempty string');
    if (value.heading !== undefined && !text(value.heading)) invalid(`${path}.heading`, 'must be a nonempty string when supplied');
  };
  if (summary.detailedSummary !== undefined) sections(summary.detailedSummary, 'detailedSummary');
  if (summary.highlightedInsight !== undefined) insight(summary.highlightedInsight, 'highlightedInsight');
  if (summary.presentations !== undefined) {
    if (!Array.isArray(summary.presentations)) invalid('presentations', 'must be an array when supplied');
    summary.presentations.forEach((presentation, index) => {
      const path = `presentations[${index}]`;
      if (!presentation || !text(presentation.title)) invalid(`${path}.title`, 'must be a nonempty string');
      if (!text(presentation.explanation)) invalid(`${path}.explanation`, 'must be a nonempty string');
      if (presentation.speakerIds !== undefined && (!strings(presentation.speakerIds) || presentation.speakerIds.some(id => !session.speakerIds.includes(id)))) invalid(`${path}.speakerIds`, 'must reference speakers also listed in the session speakerIds');
      if (presentation.sections !== undefined) sections(presentation.sections, `${path}.sections`);
      if (presentation.highlightedInsight !== undefined) insight(presentation.highlightedInsight, `${path}.highlightedInsight`);
    });
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
    eventType: session.eventType ?? 'talk', programme: session.programme ?? 'conference',
    ...(status === 'published' ? { summary: publicSummary(session.summary), recordingUrl: session.recordingUrl ?? null } : {}) };
}

// Only validated article fields belong in the browser bundle.
function publicSummary(summary) {
  const sectionFields = section => ({ heading: section.heading, paragraphs: section.paragraphs, ...(section.bullets !== undefined ? { bullets: section.bullets } : {}) });
  const insightFields = insight => ({ ...(insight.heading !== undefined ? { heading: insight.heading } : {}), explanation: insight.explanation });
  return {
    overview: summary.overview,
    keyTakeaways: summary.keyTakeaways.map(item => typeof item === 'string' ? item : {
      ...(item.heading !== undefined ? { heading: item.heading } : {}),
      explanation: item.explanation,
    }),
    ...(summary.detailedSummary !== undefined ? { detailedSummary: summary.detailedSummary.map(sectionFields) } : {}),
    ...(summary.highlightedInsight !== undefined ? { highlightedInsight: insightFields(summary.highlightedInsight) } : {}),
    ...(summary.presentations !== undefined ? { presentations: summary.presentations.map(presentation => ({
      title: presentation.title,
      explanation: presentation.explanation,
      ...(presentation.speakerIds !== undefined ? { speakerIds: presentation.speakerIds } : {}),
      ...(presentation.sections !== undefined ? { sections: presentation.sections.map(sectionFields) } : {}),
      ...(presentation.highlightedInsight !== undefined ? { highlightedInsight: insightFields(presentation.highlightedInsight) } : {}),
    })) } : {}),
    ...(summary.notableIdeas !== undefined ? { notableIdeas: summary.notableIdeas } : {}),
    ...(summary.practicalApplications !== undefined ? { practicalApplications: summary.practicalApplications } : {}),
  };
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
        if (item.logoBackground !== undefined && !['light', 'dark'].includes(item.logoBackground)) fail(`invalid logoBackground for ${item.id}`);
        if (item.demo !== undefined && typeof item.demo !== 'boolean') fail(`invalid demo flag for ${item.id}`);
        if (!text(item.name) || !text(item.description) || !Array.isArray(item.urls) || !item.urls.every(link => text(link.label) && url(link.url))) fail(`invalid ${label} profile ${item.id}`);
        if (item.image != null && (!imageUrl(item.image) || !text(item.imageAlt))) fail(`image requires HTTPS/HTTP URL or local /images/ asset path and imageAlt for ${item.id}`);
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
  for (const speaker of speakers) {
    check(speaker.companyIds, companies, 'speaker company');
    validateSpeakerPerspectives(speaker);
  }
  // Session relationships are derived from the authoritative session files.
  return { sessions, speakers: speakers.map(speaker => publicSpeaker(speaker, sessions)), companies };
}
