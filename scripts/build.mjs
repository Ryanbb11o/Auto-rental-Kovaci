import { cp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const source = resolve(root, 'dist');
const output = resolve(root, 'build');
// Only the generated build directory may be cleaned; source is never modified.
if (dirname(output) !== root || basename(output) !== 'build') throw new Error('Invalid build directory.');
// Do not follow an unexpected symlink/junction outside the project.
try {
  if (await realpath(output) !== output) throw new Error('Build directory must not be a symlink.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

let html = await readFile(resolve(source, 'index.html'), 'utf8');
const siteURL = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
if (siteURL) {
  const url = new URL(/^https?:\/\//i.test(siteURL) ? siteURL : `https://${siteURL}`);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('SITE_URL must be a public HTTP(S) origin.');
  const origin = url.origin;
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${origin}$2`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${origin}/assets/hero.webp$2`);
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (_, open, json, close) => {
    const data = JSON.parse(json);
    data.url = origin;
    return `${open}\n  ${JSON.stringify(data)}\n  ${close}`;
  });
}

await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });
await writeFile(resolve(output, 'index.html'), html);
console.log(`Static website built in build/${siteURL ? ` with metadata for ${new URL(/^https?:\/\//i.test(siteURL) ? siteURL : `https://${siteURL}`).origin}` : ''}.`);
