import { readFile, access, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
const css = await readFile(resolve(dist, 'styles.css'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique');
for (const match of html.matchAll(/(?:src|href)="([^"#?]+)(?:#[^"]*)?"/g)) {
  const link = match[1];
  if (/^(https?:|tel:|mailto:)/.test(link)) continue;
  await access(resolve(dist, link));
}
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]), `Missing anchor: ${match[1]}`);
for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) await access(resolve(dist, match[1]));
for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
for (const name of ['hero.webp', 'fleet.webp', 'coastal-road.webp']) {
  const info = await stat(resolve(dist, 'assets', name));
  assert(info.size < 1_500_000, `${name} should be optimized for the web`);
}
assert(css.includes('prefers-reduced-motion'), 'Reduced motion styling is required');
console.log('Passed: local assets, anchors, unique IDs, structured data and image budgets.');
