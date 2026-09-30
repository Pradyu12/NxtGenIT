# NxtGenIT

**Building what comes next.**

A dark-first marketing site for NxtGenIT, a technology studio working on frontend,
backend and full-stack products — plus **Shunya**, our own long-term original game
project.

---

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 15 (App Router)** + React 19 | Native metadata/OG, route-level code splitting, `sitemap.ts` / `robots.ts`, static output |
| Language | **TypeScript**, `strict` | Every content shape is a typed contract |
| Styling | **CSS Modules + design tokens** | Zero runtime, zero framework, total control over the visual language |
| Motion | **`IntersectionObserver` + `requestAnimationFrame` + CSS** | No animation library. See "Performance" below |
| Visuals | **Raw WebGL2 (GLSL ES 1.00)** | ~4KB of shader instead of ~150KB of three.js |
| Runtime deps | **3** (`next`, `react`, `react-dom`) | Nothing else ships to the browser |

There is no Tailwind, no framer-motion, no three.js, no icon package. Everything on
the page is either a design token, a hand-written SVG, or a hand-written shader.

Production First Load JS: **~115 kB** on the home route.

---

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

---

## Project structure

```
src/
├── app/                     # App Router: layout, page, SEO routes, 404
│   ├── layout.tsx           # Fonts, metadata, JSON-LD, boot script
│   ├── page.tsx             # Home page composition (section order)
│   ├── globals.css          # ★ The design system
│   ├── opengraph-image.tsx  # OG card, rendered by Satori
│   ├── sitemap.ts           # Generated from a single route list
│   ├── robots.ts
│   ├── icon.svg             # Favicon + apple-touch icon
│   └── not-found.tsx
│
├── content/                 # ★ All copy and data. Edit here, not in components
│   ├── site.ts              # Name, tagline, description, URL, contact
│   ├── navigation.ts        # Nav links (drives header, mobile nav, footer)
│   ├── services.ts          # Service cards
│   ├── projects.ts          # Work section — add a project here
│   ├── stack.ts             # Technology section
│   ├── philosophy.ts        # The three engineering principles
│   └── shunya.ts            # Shunya copy, status, timeline stages
│
├── components/
│   ├── layout/              # SiteHeader, SiteFooter, Logo
│   ├── sections/            # One file per page section
│   ├── ui/                  # Reveal, SplitHeading, MagneticButton
│   └── visual/              # Atmosphere, CursorGlow, SceneCanvas
│
└── lib/
    ├── hooks/               # useInView, useMediaQuery, usePrefersReducedMotion
    ├── webgl/               # gl.ts, stage.ts, noise.ts, scenes/
    ├── cn.ts                # class-name joiner
    └── graph.ts             # Seeded node-graph generator
```

---

## Updating content

**Every piece of copy and every list on the page lives in `src/content/`.** No
component needs to change.

### Add a project

Append to `projects` in `src/content/projects.ts`:

```ts
{
  id: 'acme-platform',
  title: 'Acme Platform',
  client: 'Acme',
  year: '2026',
  summary: 'One line for the card.',
  body: 'A paragraph for the featured panel.',
  status: 'live',            // 'live' | 'in-progress' | 'archived' | 'private'
  statusLabel: 'Live',
  role: ['Frontend', 'API design'],
  stack: ['Next.js', 'PostgreSQL'],
  featured: false,           // true → becomes the primary panel
  graphSeed: 90210,          // any number; same seed = same diagram
}
```

The Work section picks it up automatically. The first project with
`featured: true` renders as the large primary panel; the rest render as compact
rows.

### Add a service

Append to `serviceSeed` in `src/content/services.ts`. The card number (`01`, `02`,
…) is derived from the array index, so re-ordering never leaves stale labels.

### Add a technology

Append to the relevant discipline in `stack.ts`. Only list tools you actually use.

---

## Shunya

Shunya is a **long-term original game project in active development**, with an
eventual launch on the order of a decade away. The site reflects that:

- There is **no progress percentage, no ETA and no release date** anywhere.
- The timeline in `shunya.ts` models *workstreams*, not milestones. Stages 1–5 are
  all `active` because a project of this scope really is worked on across every
  axis at once; `launch` is `horizon` — a destination, not a date.
- The status indicator is `DEVELOPMENT: LIVE`.

If you add a stage, add it to `shunya.ts` only. Do **not** introduce a progress
metric — the `ShunyaStage` type has no field for one, by design.

---

## Design system

Everything is defined as tokens in `globals.css` §1 and consumed by CSS Modules.

**Colour.** Near-black midnight navy surfaces (`--ink-*`), deep → electric blue
(`--blue-*`), cyan (`--cyan-*`), teal (`--teal-*`), and acid green (`--lime-*`) as a
*sparing* accent. Gradients appear only where they add depth: the atmosphere wash,
the CTA fill, and the logo mark.

**Type.** `Geist` for display and UI, `Geist Mono` for technical labels. Both are
self-hosted at build time by `next/font` — no third-party request, no layout shift.
The display scale is fluid (`clamp()`), tuned so 375px, 1440px and 1920px all read
correctly without breakpoint-specific type.

**Shape.** Deliberately near-square (2px radius). Hairline borders. No excessive
rounding, no drop-shadow stacks.


---

## Accessibility

- Semantic landmarks (`header` / `nav` / `main` / `footer` / `section`), one `h1`,
  correctly nested `h2`/`h3`.
- Skip-to-content link, visible on focus.
- `:focus-visible` styling is global and never removed. No `outline: none`
  without a replacement.
- All interactive elements are real `<a>` or `<button>` elements and are
  keyboard-reachable. The service card is a single link.
- The mobile menu closes on `Escape` and locks body scroll while open.
- Contrast: body text is ≥ 4.5:1; `--text-faint` is 4.7:1 on the darkest surface.
- Decorative layers (canvas, atmosphere, cursor) are `aria-hidden` and
  `pointer-events: none`.
- The system diagram exposes an `aria-label`; the timeline is an ordered list with
  a descriptive `<ol>` label.
- `prefers-reduced-motion`: the WebGL scenes render **one still frame** and stop;
  magnetic buttons and the custom cursor degrade to instant tracking; all reveals
  and transitions collapse. Layout is identical either way.
- `forced-colors` mode drops the decorative atmosphere layer.
- **No-JS:** reveal animations are gated behind a `.js` class added by an inline
  boot script, so content is never stuck invisible without JavaScript.

---

## Performance

- **Three runtime dependencies.** Motion is hand-built on
  `IntersectionObserver` + `rAF` + CSS transitions, which is both smaller and
  smoother than a general animation library for this workload.
- **WebGL is code-split and deferred** (`next/dynamic` with `ssr: false`), so no
  shader ships in the initial document. Both scenes pause via
  `IntersectionObserver` when scrolled out of view, and on `visibilitychange`.
- **Adaptive quality:** the stage monitors frame times and drops the backing-store
  scale to 0.6× once if the GPU can't keep up, rather than hunting every frame.
- **DPR capped at 1.5** (1.25 for the Shunya scene). A fullscreen fragment shader
  is fill-rate bound; capping DPR is the single biggest win.
- **No raster images at all.** The wordmark, glyphs, diagram and favicon are
  inline SVG; film grain is a 140px inline data-URI tiled by the compositor.
- Reveals animate `transform` and `opacity` only.
- Scroll and pointer listeners are passive and `requestAnimationFrame`-throttled.
- The cursor ring's rAF loop **parks itself** once it converges on the pointer and
  is restarted by `pointermove`, so an idle page schedules no animation frames.
- `prefers-reduced-data: reduce` drops all ambient looping animation; the resting
  frame is the designed state, so nothing looks broken.
- `content-visibility: auto` on below-the-fold sections was tried and reverted:
  skipping layout also stops the `IntersectionObserver` behind `[data-reveal]`
  from firing (measured: 32 of 41 reveals stranded) and makes scroll height drift.
  The reasoning is recorded at the rule's former location in `globals.css`.
- `removeConsole` strips `console.*` from production bundles.

---

## SEO

- Per-page `title` template and `meta description`.
- Full Open Graph + Twitter card metadata, with a 1200×630 card generated by
  Satori at `/opengraph-image`.
- Canonical URL, `robots` directives, theme colour, and `formatDetection`.
- `sitemap.xml` and `robots.txt` generated from a route list in `sitemap.ts`.
- Organization + WebSite JSON-LD.
- Favicon and apple-touch icon from `app/icon.svg`.

Set the production origin with:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

It defaults to `https://nxtgenit.dev` and feeds canonical URLs, OG URLs, the
sitemap and JSON-LD.

---

## Browser support

Evergreen Chrome, Edge, Firefox and Safari. WebGL is progressive enhancement — if
the context can't be created, each scene falls back to a CSS gradient and the page
is otherwise unaffected.

