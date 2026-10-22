import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { HTML_CACHE, isPreviewKey } from '../src/summit/lib/social.js';

export function uploadPlan(manifest, existingKeys = []) {
  if (manifest.version !== 1 || !Array.isArray(manifest.entries) || !manifest.entries.length) throw new Error('Invalid preview manifest');
  const current = new Map();
  for (const entry of manifest.entries) {
    if (!/^technlsummit(?:\/(?:speakers|companies|(?:sessions|recaps)\/[a-z0-9]+(?:-[a-z0-9]+)*))?\/index\.html$/.test(entry.file)) throw new Error('Invalid preview file');
    const base = entry.file.slice(0, -'/index.html'.length);
    if (JSON.stringify(entry.keys) !== JSON.stringify([base, `${base}/`, entry.file])) throw new Error('Invalid preview keys');
    for (const key of entry.keys) {
      if (current.has(key)) throw new Error('Duplicate preview key');
      current.set(key, entry.file);
    }
  }
  return [...current].map(([key, file]) => ({ key, file } )).concat(
    existingKeys.filter(key => isPreviewKey(key) && !current.has(key)).map(key => ({ key, file: 'summit-preview-unavailable.html' })));
}

export function putArguments(bucket, directory, entry) {
  return ['s3api', 'put-object', '--bucket', bucket, '--key', entry.key, '--body', resolve(directory, entry.file),
    '--content-type', 'text/html; charset=utf-8', '--cache-control', HTML_CACHE];
}

async function main() {
  const [bucket, directory = 'dist', option] = process.argv.slice(2);
  if (!bucket) throw new Error('Usage: node scripts/upload-summit-previews.mjs BUCKET [dist] [--dry-run]');
  if (option && option !== '--dry-run') throw new Error('Unknown option; use --dry-run to inspect without AWS access');
  const manifest = JSON.parse(await readFile(resolve(directory, 'summit-previews.json'), 'utf8'));
  // List only the Summit prefix. Never delete or overwrite retained hashed assets.
  const existing = option === '--dry-run' ? [] : JSON.parse(execFileSync('aws', [
    's3api', 'list-objects-v2', '--bucket', bucket, '--prefix', 'technlsummit', '--query', 'Contents[].Key', '--output', 'json',
  ], { encoding: 'utf8' })) ?? [];
  const plan = uploadPlan(manifest, existing);
  // Fail before uploading anything if the build is incomplete.
  for (const file of new Set(plan.map(entry => entry.file))) await readFile(resolve(directory, file));
  for (const entry of plan) {
    const args = putArguments(bucket, directory, entry);
    if (option !== '--dry-run') execFileSync('aws', args, { stdio: 'pipe' });
    console.log(`${option === '--dry-run' ? 'Would upload' : 'Uploaded'} HTML: ${entry.key}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
