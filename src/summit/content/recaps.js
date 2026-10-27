const fail = message => { throw new Error(`Summit recap: ${message}`); };
const text = value => typeof value === 'string' && value.trim().length > 0;
const slug = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const strings = value => Array.isArray(value) && value.every(text) && new Set(value).size === value.length;
const timestamp = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(`${value.slice(0, 10)}T00:00:00Z`).toISOString().slice(0, 10) === value.slice(0, 10);
const insight = value => value && text(value.explanation) && (value.heading === undefined || text(value.heading)) && (value.label === undefined || text(value.label));
const publicInsight = value => ({ ...(value.label ? { label: value.label } : {}), ...(value.heading ? { heading: value.heading } : {}), explanation: value.explanation });

export function validateRecap(recap) {
  if (!recap || typeof recap !== 'object') fail('expected an object');
  for (const field of ['id', 'title', 'description', 'excerpt']) if (!text(recap[field])) fail(`requires ${field}`);
  if (!slug(recap.slug)) fail('invalid slug');
  if (!['draft', 'published'].includes(recap.status)) fail(`invalid status for ${recap.id}`);
  for (const field of ['publishedAt', 'updatedAt']) if (!timestamp(recap[field])) fail(`invalid ${field} for ${recap.id}`);
  if (Date.parse(recap.updatedAt) < Date.parse(recap.publishedAt)) fail(`updatedAt precedes publishedAt for ${recap.id}`);
  if (!strings(recap.relatedSessionSlugs) || !recap.relatedSessionSlugs.length || !recap.relatedSessionSlugs.every(slug)) fail(`invalid relatedSessionSlugs for ${recap.id}`);
  if (recap.speakerIds !== undefined && !strings(recap.speakerIds)) fail(`invalid speakerIds for ${recap.id}`);
  if (recap.highlightedInsight !== undefined && !insight(recap.highlightedInsight)) fail(`invalid highlightedInsight for ${recap.id}`);
  if (!Array.isArray(recap.sections) || !recap.sections.length) fail(`requires sections for ${recap.id}`);
  for (const section of recap.sections) {
    if (!section || !text(section.heading) || !strings(section.paragraphs) || !section.paragraphs.length) fail(`invalid section for ${recap.id}`);
    if (section.highlightedInsight !== undefined && !insight(section.highlightedInsight)) fail(`invalid section highlightedInsight for ${recap.id}`);
    if (section.bullets !== undefined && !strings(section.bullets)) fail(`invalid bullets for ${recap.id}`);
    if (section.sessionSlugs !== undefined && (!strings(section.sessionSlugs) || !section.sessionSlugs.every(value => recap.relatedSessionSlugs.includes(value)))) fail(`section links must be relatedSessionSlugs for ${recap.id}`);
  }
  return recap;
}

// Allowlist every public field recursively; draft files become JSON null before bundling.
export function publicRecap(record) {
  const recap = validateRecap(record);
  if (recap.status !== 'published') return null;
  return Object.fromEntries([
    ...['id', 'slug', 'title', 'description', 'excerpt', 'status', 'publishedAt', 'updatedAt', 'relatedSessionSlugs'].map(field => [field, recap[field]]),
    ['speakerIds', recap.speakerIds ?? []],
    ['sections', recap.sections.map(section => ({ heading: section.heading, paragraphs: section.paragraphs,
      ...(section.bullets ? { bullets: section.bullets } : {}), ...(section.sessionSlugs ? { sessionSlugs: section.sessionSlugs } : {}),
      ...(section.highlightedInsight ? { highlightedInsight: publicInsight(section.highlightedInsight) } : {}) }))],
    ...(recap.highlightedInsight ? [['highlightedInsight', publicInsight(recap.highlightedInsight)]] : []),
  ]);
}

export function createRecaps(records, sessions, speakers) {
  const ids = new Set();
  const slugs = new Set();
  for (const record of records) {
    validateRecap(record);
    if (ids.has(record.id) || slugs.has(record.slug)) fail(`duplicate identity ${record.id}/${record.slug}`);
    ids.add(record.id); slugs.add(record.slug);
    if (record.status === 'draft') continue;
    for (const related of record.relatedSessionSlugs) if (!sessions.some(session => session.slug === related && session.programme === 'conference' && session.status === 'published')) fail(`related session must be a published conference article: ${related}`);
    for (const id of record.speakerIds ?? []) if (!speakers.some(speaker => speaker.id === id && !speaker.demo)) fail(`unknown public speaker ${id}`);
  }
  return records.map(publicRecap).filter(Boolean).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a.slug.localeCompare(b.slug));
}
