import { existsSync, copyFileSync, writeFileSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.cwd(), 'out');

if (!existsSync(out)) {
  console.error('postbuild: out/ not found — did next build run?');
  process.exit(1);
}

/**
 * `.nojekyll` is mandatory on GitHub Pages.
 *
 * Without it Pages runs the output through Jekyll, whose default behaviour is to
 * ignore any path beginning with an underscore. Every Next.js asset lives in
 * `_next/`, so Jekyll would silently delete the entire JS and CSS bundle and the
 * deployed site would render unstyled and inert. The empty file disables that
 * processing and Pages serves `out/` verbatim.
 */
writeFileSync(join(out, '.nojekyll'), '', 'utf8');

/**
 * Publish the Open Graph card at a plain, extensioned path.
 *
 * `next export` writes the Satori output to `out/opengraph-image` (no extension)
 * and the injected `<meta og:image>` points at `.../opengraph-image?<hash>`.
 * GitHub Pages is a dumb static host: it resolves files by name and ignores the
 * query string, so social crawlers would get a 404 and the card would never
 * render. Copying the file to `opengraph-image.png` gives a real path that the
 * tag in `layout.tsx` references directly.
 */
const ogSource = join(out, 'opengraph-image');
const ogTarget = join(out, 'opengraph-image.png');

if (existsSync(ogSource)) {
  copyFileSync(ogSource, ogTarget);
  console.log('postbuild: wrote out/opengraph-image.png');
} else {
  console.error('postbuild: out/opengraph-image missing — og:image will be broken.');
  process.exit(1);
}

/**
 * Rewrite the auto-injected `og:image` to the stable path.
 *
 * The `opengraph-image.tsx` file convention makes Next emit its own
 * `<meta property="og:image">` pointing at `<basePath>/opengraph-image?<hash>`,
 * which overrides the explicit entry in `layout.tsx`. GitHub Pages resolves files
 * by name and ignores the query string, so that URL 404s and the card never renders.
 *
 * Two details make this reliable:
 *   1. The existing origin+basePath prefix is *reused* rather than recomposed.
 *      Next has already resolved `metadataBase` against `basePath`, and rebuilding
 *      the string here produced a doubled `/NxtGenIT/NxtGenIT/`.
 *   2. The same URL also appears in React's serialised hydration payload, where the
 *      quotes are escaped. Rewriting only the plain meta tag would let hydration
 *      restore the hashed URL, so the escaped form is matched too.
 *
 * Only the filename is changed. The companion `og:image:width`, `:height`, `:type`
 * and `:alt` tags are correct and are left alone.
 */
const OG_URL_RE = /(\/opengraph-image)\?[0-9a-f]+/g;

function rewriteHtml(file) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('/opengraph-image?')) return false;

  const patched = html.replace(OG_URL_RE, '$1.png');
  if (patched === html) return false;

  writeFileSync(file, patched, 'utf8');
  return true;
}

let patchedCount = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry.endsWith('.html') && rewriteHtml(full)) {
      patchedCount += 1;
    }
  }
}

walk(out);
console.log(`postbuild: rewrote og:image in ${patchedCount} HTML file(s)`);

/**
 * Pages serves `/404.html` for unknown paths. `trailingSlash: true` means the
 * app's not-found route is exported to `404/index.html` as well; the flat file is
 * the one Pages actually looks for, and it is already written, so nothing else is
 * needed here. This is just a guard so a silent regression is visible.
 */
if (!existsSync(join(out, '404.html'))) {
  console.warn('postbuild: warning — out/404.html missing; Pages will use its default 404.');
}

console.log('postbuild: done');