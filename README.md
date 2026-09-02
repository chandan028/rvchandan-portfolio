# rvchandan.dev

Personal portfolio for R V Chandan — backend engineer (Java, Spring Boot), Bengaluru.

Next.js App Router, TypeScript, Tailwind, **static export**. No server, no CMS, no
database. All copy lives in typed data files under [`src/data`](src/data) so it can be
edited without touching a component.

---

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # static export → ./out  (also fixes OG image extensions)
npm run start        # serve ./out locally to check the real static output
npm run typecheck    # tsc --noEmit
```

`npm run build` writes a fully static site to `out/`. There is no Node runtime at
serve time — every page, the sitemap, `robots.txt` and every Open Graph image is a
file on disk.

---

## Before you deploy

Three things, in order.

**1. Set the deployed origin.** [`src/data/site.ts`](src/data/site.ts) has
`url: 'https://rvchandan.dev'`. Open Graph tags and the sitemap build absolute URLs
from it, and relative URLs do not unfurl in Slack or LinkedIn. Change it to wherever
this is actually going.

**2. Replace the résumé.** `public/resume.pdf` is a generated placeholder. Drop your
real PDF in at that exact path — it is linked from the hero, the header and the
footer, and the path is stable so an old link keeps working.

```bash
node scripts/make-placeholder-resume.mjs   # regenerate the placeholder if needed
```

**3. Fill the gaps.** The case studies contain `[VERIFY: ...]` markers wherever a
number, tool name or failure mode was needed and not supplied. They render as
visible red-bordered marks on the page, so they cannot ship by accident.

```bash
grep -rn "\[VERIFY:" src/data
```

---

## Deploying

### Vercel

Import the repo. Vercel detects Next.js and reads `output: 'export'` from
`next.config.mjs` — no configuration needed. Build command `npm run build`, output
directory `out`.

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

Add an empty `public/.nojekyll` so GitHub Pages serves the `_next` directory. If you
deploy to a project page rather than a custom domain, the site will live under a
subpath — set `basePath` and `assetPrefix` in `next.config.mjs` to match.

### Anything else

`out/` is a plain static directory. Netlify, Cloudflare Pages, S3 and nginx all serve
it as-is.

---

## Editing content

| What | Where |
| --- | --- |
| Name, positioning, links, canonical URL | [`src/data/site.ts`](src/data/site.ts) |
| Case-study prose, diagrams to render, meta descriptions | [`src/data/case-studies.ts`](src/data/case-studies.ts) |
| Roles and the timeline | [`src/data/experience.ts`](src/data/experience.ts) |
| Yodhha NotesAI | [`src/data/projects.ts`](src/data/projects.ts) |
| Skill groups | [`src/data/skills.ts`](src/data/skills.ts) |
| Degree | [`src/data/education.ts`](src/data/education.ts) |

### Case-study copy

Sections are `{ heading, body: string[] }` — one string per paragraph. The renderer
([`src/lib/rich-text.tsx`](src/lib/rich-text.tsx)) understands four inline tokens and
nothing else:

| Token | Renders as |
| --- | --- |
| `**bold**` | `<strong>` |
| `*emphasis*` | `<em>` |
| `` `code` `` | inline mono |
| `[VERIFY: something]` | a visible marker |

Keep the **What I'd do differently** section on every case study. It is the section
that makes an interviewer trust the other four.

### Adding a case study

1. Append an entry to `caseStudies` in `src/data/case-studies.ts`.
2. Add a diagram function to [`src/components/diagrams.tsx`](src/components/diagrams.tsx)
   and register it in the `registry` map at the bottom of that file.
3. Widen `DiagramKey` to include the new key — TypeScript will point at every place
   that needs updating.

The route, the sitemap entry, the Open Graph image and the home-page index all derive
from the data. Nothing else to touch.

---

## Design system

Six named values, defined once in [`tailwind.config.ts`](tailwind.config.ts) and
mirrored as CSS custom properties in [`src/app/globals.css`](src/app/globals.css). If
a colour is not in this list, it does not belong on the page.

| Token | Hex | Role |
| --- | --- | --- |
| `ink` | `#0A0E1A` | Page ground |
| `weave` | `#141B31` | Raised surfaces |
| `thread` | `#26304F` | Rules, borders, diagram strokes |
| `dust` | `#8A93A8` | Secondary text |
| `silk` | `#F2F4F8` | Primary text |
| `spider` | `#F03A42` | The one bold spend |
| `web` | `#6E93F5` | Links |

Both accents are tuned for contrast on `ink`, not picked by eye. `spider` clears
4.95:1 and `web` clears 6.6:1, so either can carry small text, links or a focus ring
without failing WCAG AA. The suit colours as-drawn (`#E01B24`, `#2B5BD7`) come in at
4.0:1 and 3.0:1 respectively and would have failed — which is why these are lighter.

Typefaces, via `next/font` (self-hosted at build, no runtime request to Google):
**Archivo Black** for display, **Inter** for body, **JetBrains Mono** for dates,
stack tags and diagram labels.

### The 3D layer

- [`src/components/web-lattice.tsx`](src/components/web-lattice.tsx) — a procedural
  orb web built as WebGL line segments (react-three-fiber). No model files, no
  textures, no external assets.
- [`src/components/hero-canvas.tsx`](src/components/hero-canvas.tsx) — renders a
  static SVG web on the server, then swaps in the WebGL scene on
  `requestIdleCallback`. three.js is dynamically imported and stays out of the first
  load, so the hero headline never waits on it. Both occupy the same box, so there is
  no layout shift on the swap.
- [`src/components/tilt-card.tsx`](src/components/tilt-card.tsx) — pointer-driven
  perspective tilt on the work cards, written to CSS custom properties rather than
  React state. Disabled for coarse pointers and for `prefers-reduced-motion`, in the
  handler *and* in CSS.

`prefers-reduced-motion: reduce` stops the WebGL animation (the scene renders once,
at rest), disables the tilt, and turns off smooth scrolling.

---

## The Open Graph workaround

Next generates the `opengraph-image` routes as real PNGs under `output: 'export'`, but
writes them **extensionless** and links them as `/opengraph-image?<hash>`. A static
host has no extension to infer a MIME type from, serves them as
`application/octet-stream`, and Slack and LinkedIn then refuse to render the preview.

[`scripts/postbuild.mjs`](scripts/postbuild.mjs) runs as part of `npm run build`: it
renames each image to `.png` and rewrites the references in the emitted HTML. If you
upgrade Next and previews break, check there first.

The same script briefly injected `<link rel="preload" as="font">` tags, since static
export never emits them and it looks like free LCP. It was measured and reverted — see
the note at the top of the file.

---

## Quality notes

- Responsive to 360px. Diagrams scroll inside their own container rather than
  shrinking or pushing the page sideways.
- One visible focus treatment, applied globally via `:focus-visible`.
- Semantic headings — one `h1` per page, sections labelled with `aria-labelledby`.
- Every diagram is an `svg` with `role="img"` and a full prose `aria-label`, so the
  architecture is available to a screen reader and not only to sighted readers.
- Per-page `title` and `description`; Open Graph and Twitter card tags on every route.
- Skip link to `#main`.
