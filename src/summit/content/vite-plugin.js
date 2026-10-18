import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createContent, publicSession, validateSession } from './model.js';

const directory = fileURLToPath(new URL('./sessions/', import.meta.url));
export async function loadSummitContent() {
  const files = (await readdir(directory)).filter(file => file.endsWith('.json'));
  const sessions = await Promise.all(files.map(async file => validateSession(JSON.parse(await readFile(directory + file, 'utf8')))));
  const speakers = JSON.parse(await readFile(new URL('./speakers.json', import.meta.url), 'utf8'));
  const companies = JSON.parse(await readFile(new URL('./companies.json', import.meta.url), 'utf8'));
  return createContent(sessions, speakers, companies);
}
export default function summitContent() {
  return {
    name: 'summit-public-content',
    enforce: 'pre',
    async buildStart() {
      await loadSummitContent();
    },
    async transform(source, id) {
      const path = id.split('?')[0];
      if (!path.startsWith(directory) || !path.endsWith('.json')) return;
      // Read the original file regardless of JSON query flags.
      const session = JSON.parse(await readFile(path, 'utf8'));
      return { code: JSON.stringify(publicSession(session)), map: null };
    },
  };
}
