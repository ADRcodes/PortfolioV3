import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadSummitContent } from './content/vite-plugin.js';
import { HTML_CACHE, previewEntry, previewHtml, previewPages } from './lib/social.js';

export default function summitPreviews() {
  return {
    name: 'summit-static-previews', enforce: 'post',
    async generateBundle(_options, bundle) {
      const shell = bundle['index.html']?.source;
      if (typeof shell !== 'string') throw new Error('Summit previews require the built index.html');
      const { sessions } = await loadSummitContent();
      const pages = previewPages(sessions);
      for (const page of pages) this.emitFile({ type: 'asset', fileName: previewEntry(page).file, source: previewHtml(shell, page) });
      this.emitFile({ type: 'asset', fileName: 'summit-previews.json', source: JSON.stringify({ version: 1, entries: pages.map(previewEntry) }, null, 2) });
      this.emitFile({ type: 'asset', fileName: 'summit-preview-unavailable.html', source: previewHtml(shell, {
        path: '/technlsummit', title: 'Page unavailable | Independent Summit companion',
        description: 'This page is unavailable or has not been published.', type: 'website', noindex: true,
      }) });
    },
    async configurePreviewServer(server) {
      // Vite's SPA fallback would otherwise serve portfolio HTML at extensionless URLs.
      // Serve the same manifest mapping used by the exact-key S3 upload.
      const root = resolve(server.config.root, server.config.build.outDir);
      const manifest = JSON.parse(await readFile(resolve(root, 'summit-previews.json'), 'utf8'));
      const routes = new Map(manifest.entries.flatMap(entry => entry.keys.map(key => [`/${key}`, entry.file])));
      server.middlewares.use(async (request, response, next) => {
        const file = routes.get(new URL(request.url, 'http://localhost').pathname);
        if (!file || !['GET', 'HEAD'].includes(request.method)) return next();
        try {
          const html = await readFile(resolve(root, file));
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.setHeader('Cache-Control', HTML_CACHE);
          response.end(request.method === 'HEAD' ? undefined : html);
        } catch (error) { next(error); }
      });
    },
  };
}
