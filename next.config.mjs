/** @type {import('next').NextConfig} */

// GitHub Pages serves project sites from a subpath (`/NxtGenIT`), not the root.
// `basePath` must be prefixed onto every internal URL, and `assetPrefix` onto
// every static asset, or the site 404s on JS/CSS/fonts in production. Both are
// read from the environment so the same source can build for a domain root
// (set them to an empty string) without a code change.
//
// `trailingSlash` is required: Pages serves `/about/index.html` for `/about/`
// and will not rewrite extensionless paths the way a Node server does.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/NxtGenIT';

const nextConfig = {
  // Emit a plain static bundle in `out/`. GitHub Pages has no Node runtime, so
  // the server-rendered output must be pre-rendered at build time.
  output: 'export',
  // Only used for local dev; Pages ignores the dev server entirely.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // The image optimizer needs a server. Nothing here uses next/image today,
    // but if an image is added later it will render as a plain <img> instead of
    // failing the export.
    unoptimized: true,
  },
  compiler: {
    // Strip console calls in production bundles.
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
