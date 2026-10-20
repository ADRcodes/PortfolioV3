const text = value => typeof value === 'string' && value.trim().length > 0;

export function validateSpeakerPerspectives(speaker) {
  if (speaker.summitPerspectives === undefined) return;
  const fail = message => { throw new Error(`Summit content: ${speaker.id}.summitPerspectives ${message}`); };
  if (!Array.isArray(speaker.summitPerspectives)) fail('must be an array when supplied');
  speaker.summitPerspectives.forEach((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) fail(`[${index}] must be an object`);
    if (!text(item.sessionSlug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.sessionSlug)) fail(`[${index}].sessionSlug must be a session slug`);
    if (!text(item.summary)) fail(`[${index}].summary must be nonempty text`);
    if (item.quote !== undefined && !text(item.quote)) fail(`[${index}].quote must be nonempty text when supplied`);
    if (item.heading !== undefined && !text(item.heading)) fail(`[${index}].heading must be nonempty text when supplied`);
    if (item.publishedAt !== undefined && (!text(item.publishedAt) || !/^\d{4}-\d{2}-\d{2}T/.test(item.publishedAt) || !/(Z|[+-]\d{2}:\d{2})$/.test(item.publishedAt) || Number.isNaN(Date.parse(item.publishedAt)))) fail(`[${index}].publishedAt must be an ISO timestamp with a timezone`);
  });
}

export function getSpeakerPerspectives(speaker, sessions) {
  return (speaker.summitPerspectives ?? []).flatMap(item => {
    const session = sessions.find(session => session.slug === item.sessionSlug);
    // Withdrawn, unpublished, missing and unrelated sessions never expose a perspective.
    if (session?.status !== 'published' || !session.speakerIds.includes(speaker.id)) return [];
    return [{
      sessionSlug: session.slug,
      sessionTitle: session.title,
      summary: item.summary,
      ...(item.quote !== undefined ? { quote: item.quote } : {}),
      ...(item.heading !== undefined ? { heading: item.heading } : {}),
      ...(item.publishedAt !== undefined ? { publishedAt: item.publishedAt } : {}),
    }];
  });
}

export function publicSpeaker(speaker, sessions) {
  if (speaker.summitPerspectives === undefined) return speaker;
  return { ...speaker, summitPerspectives: getSpeakerPerspectives(speaker, sessions) };
}
