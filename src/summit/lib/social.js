import { publicSession } from '../content/model.js';
import { summitPath } from '../routing/paths.js';
import { descriptionPreview } from './preview.js';

export const SITE_ORIGIN = 'https://www.alexrussell.info';
export const SOCIAL_IMAGE = '/images/meta/technl-summit-2026-v1.png';
export const HTML_CACHE = 'no-cache,no-store,must-revalidate';
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const plain = value => value.replace(/\s+/g, ' ').trim();

export function previewPages(rawSessions) {
  const home = { path: summitPath(), title: 'techNL Summit 2026 | Independent companion',
    description: 'Explore the October 19–20 programme in St. John’s and return for AI-assisted session notes. An independent companion by Alex Russell.', type: 'website' };
  return [home, ...['speakers', 'companies'].map(directory => ({ ...home, path: summitPath(directory),
    title: `${directory === 'speakers' ? 'Speakers' : 'Companies'} | techNL Summit 2026` })),
  ...rawSessions.map(publicSession).filter(Boolean).map(session => ({
    path: summitPath(`sessions/${session.slug}`), title: session.title,
    description: descriptionPreview(plain(`${session.programme === 'external' ? `External editorial sample (${session.date}). ` : ''}${session.status === 'published' ? session.summary.overview : session.description}`), 240),
    type: session.status === 'published' ? 'article' : 'website',
    ...(session.status === 'published' ? { modifiedAt: session.updatedAt } : {}),
  }))];
}

export function previewHtml(shell, page) {
  // Replace only metadata in a copy; the original portfolio entry is untouched.
  const clean = shell.replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, tag => /(?:name|property)\s*=\s*["'](?:description|og:[^"']+|twitter:[^"']+|robots|article:[^"']+)["']/i.test(tag) ? '' : tag)
    .replace(/<link\b[^>]*\brel\s*=\s*["'](?:canonical|apple-touch-icon)["'][^>]*>/gi, '');
  const url = SITE_ORIGIN + page.path;
  const tags = [
    `<title>${escape(page.title)}</title>`,
    `<link rel="canonical" href="${escape(url)}" />`,
    `<link rel="apple-touch-icon" href="${SOCIAL_IMAGE}" />`,
    ...Object.entries({ description: page.description, 'twitter:card': 'summary_large_image', 'twitter:title': page.title,
      'twitter:description': page.description, 'twitter:image': SITE_ORIGIN + SOCIAL_IMAGE,
      'twitter:image:alt': 'techNL Summit 2026 — independent conference companion', ...(page.noindex ? { robots: 'noindex' } : {}) })
      .map(([name, content]) => `<meta name="${name}" content="${escape(content)}" />`),
    ...Object.entries({ 'og:type': page.type, 'og:title': page.title, 'og:description': page.description, 'og:url': url,
      'og:site_name': 'Independent techNL Summit companion', 'og:image': SITE_ORIGIN + SOCIAL_IMAGE,
      'og:image:type': 'image/png', 'og:image:width': '1200', 'og:image:height': '630',
      'og:image:alt': 'techNL Summit 2026 — independent conference companion',
      ...(page.modifiedAt ? { 'article:modified_time': page.modifiedAt } : {}) })
      .map(([property, content]) => `<meta property="${property}" content="${escape(content)}" />`),
  ].join('\n    ');
  return clean.replace('</head>', `    ${tags}\n  </head>`);
}

export const previewEntry = page => ({ file: `${page.path.slice(1)}/index.html`,
  keys: [page.path.slice(1), `${page.path.slice(1)}/`, `${page.path.slice(1)}/index.html`] });

// This exact namespace belongs to generated HTML, never images, bundles or profiles.
export const isPreviewKey = key => /^technlsummit(?:\/(?:speakers|companies|sessions\/[a-z0-9]+(?:-[a-z0-9]+)*))?(?:\/|\/index\.html)?$/.test(key);
