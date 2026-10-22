import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRecaps, publicRecap } from './recaps.js';
import { createContent, publicSession, validateSession } from './model.js';

const directory = fileURLToPath(new URL('./sessions/', import.meta.url));
const recapDirectory = fileURLToPath(new URL('./recaps/', import.meta.url));
const speakerFile = fileURLToPath(new URL('./speakers.json', import.meta.url));
export async function loadSummitContent() {
  const files = (await readdir(directory)).filter(file => file.endsWith('.json'));
  const sessions = await Promise.all(files.map(async file => validateSession(JSON.parse(await readFile(directory + file, 'utf8')))));
  const speakers = JSON.parse(await readFile(new URL('./speakers.json', import.meta.url), 'utf8'));
  const companies = JSON.parse(await readFile(new URL('./companies.json', import.meta.url), 'utf8'));
  const content = createContent(sessions, speakers, companies);
  const recaps = await Promise.all((await readdir(recapDirectory)).filter(file => file.endsWith('.json')).map(async file => JSON.parse(await readFile(recapDirectory + file, 'utf8'))));
  return { ...content, recaps: createRecaps(recaps, content.sessions, content.speakers) };
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
      if (path.startsWith(recapDirectory) && path.endsWith('.json')) {
        return { code: JSON.stringify(publicRecap(JSON.parse(await readFile(path, 'utf8')))), map: null };
      }
      if (path === speakerFile) {
        const { speakers } = await loadSummitContent();
        for (const file of (await readdir(directory)).filter(file => file.endsWith('.json'))) this.addWatchFile(directory + file);
        return { code: JSON.stringify(speakers), map: null };
      }
      if (!path.startsWith(directory) || !path.endsWith('.json')) return;
      // Read the original file regardless of JSON query flags.
      const session = JSON.parse(await readFile(path, 'utf8'));
      return { code: JSON.stringify(publicSession(session)), map: null };
    },
  };
}
