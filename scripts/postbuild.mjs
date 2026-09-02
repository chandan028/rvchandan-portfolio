/**
 * Post-build fixup for `output: 'export'`.
 *
 * Next generates the ImageResponse routes as real PNGs, but writes them
 * extensionless (`out/opengraph-image`) and links them as
 * `/opengraph-image?<hash>`. A static host has no extension to infer a MIME
 * type from, serves them as application/octet-stream, and Slack and LinkedIn
 * then refuse to render the preview. So: rename each to `.png` and rewrite the
 * references in the emitted HTML.
 *
 * Runs as part of `npm run build`.
 *
 * Note for future me: injecting `<link rel="preload" as="font">` here was tried
 * and reverted. next/font does mark its latin subsets for preload (the `.p.` in
 * the filename) and static export never emits the link tags, so it looks like
 * free LCP. Measured over five Lighthouse runs each, it was not — FCP improved
 * by ~0.1s while TBT roughly doubled (120ms to 250ms) and LCP got worse, for a
 * net loss of three performance points. The fonts are better left to CSS
 * discovery.
 */
import {
  readdirSync,
  statSync,
  renameSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');

/** @param {string} dir @param {(path: string) => void} visit */
function walk(dir, visit) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, visit);
    else visit(path);
  }
}

let renamed = 0;
walk(OUT, (path) => {
  if (/[\\/](opengraph-image|twitter-image)$/.test(path)) {
    renameSync(path, `${path}.png`);
    renamed += 1;
  }
});

/* Rewrite the references. -------------------------------------------------- */

let rewritten = 0;
walk(OUT, (path) => {
  if (!/\.(html|txt|xml|json)$/.test(path)) return;

  const before = readFileSync(path, 'utf8');
  const after = before.replace(
    /\/(opengraph-image|twitter-image)(\?[A-Za-z0-9_-]+)?/g,
    '/$1.png',
  );

  if (after !== before) {
    writeFileSync(path, after, 'utf8');
    rewritten += 1;
  }
});

console.log(
  `postbuild: ${renamed} og image${renamed === 1 ? '' : 's'} renamed, ` +
    `${rewritten} file${rewritten === 1 ? '' : 's'} rewritten`,
);
