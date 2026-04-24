# Project Instructions

A Next.js monorepo hosting the [axivo.com](https://axivo.com) website. Contains multiple sections sharing a common [Nextra](https://nextra.site) docs theme, with automated deployment via Cloudflare Workers.

## Collaborator

- **Name:** Floren Munteanu
- **Work:** Engineering

### Personal Preferences

I'm a site reliability engineer specialized in:

- Advanced GitHub actions based on JS code
- Helm charts
- IaC for Kubernetes clusters
- Next.js/Nextra static websites

## Architecture

The site is a static Next.js/Nextra application deployed to Cloudflare Workers via OpenNext. Content lives outside the deployment artifact: reflections and blog posts are MDX files in R2, fetched and rendered at request time. Most traffic is absorbed by caches before reaching the Worker. The whole thing runs for the price of a coffee per month.

### Directory Tree

```
.
├── mdx-components.js          Next.js canonical MDX entry point (merges Nextra + package + overrides)
├── next.config.mjs            Next.js config, wraps Nextra, initializes OpenNext for dev
├── open-next.config.ts        OpenNext adapter config (selects kvIncrementalCache)
├── wrangler.jsonc             Cloudflare Worker bindings (R2, KV, assets, images, services)
├── package.json               Workspace root, npm scripts (prebuild, build, deploy, preview)
├── packages/
│   └── website/               Local @axivo/website package with subpath exports
│       ├── index.js           Shared components and utilities
│       ├── blog.js            Blog collection factory and variables
│       ├── claude.js          Claude section factory and variables
│       ├── k3s-cluster.js     K3s section variables
│       ├── global.js          Domain, cloudflare, repository, crawlers constants
│       └── menu.js            Re-export of the build-time menu/icon registry
├── public/                    Static assets organized by section (home/, claude/, k3s-cluster/)
├── scripts/
│   ├── prebuild.mjs           Build-time: generates menu registry, timestamps, R2 manifests
│   ├── worker.js              Runtime: Worker entry, wraps OpenNext with caches.default
│   └── deploy.mjs             Deploy-time: KV purge, wrangler deploy, edge purge, warming
└── src/
    ├── app/                   Next.js app routes with section layouts
    │   ├── layout.jsx
    │   ├── robots.js
    │   ├── sitemap.js
    │   ├── (home)/
    │   ├── blog/
    │   ├── claude/
    │   └── k3s-cluster/
    ├── components/            Structural and navigational React components
    │   └── mdx/               Components authored inside MDX content
    ├── config/
    │   ├── site.js            Theme config (navbar, sidebar, footer)
    │   └── variables/         Section-specific configuration
    │       ├── global.js
    │       ├── blog.js
    │       ├── claude.js
    │       └── k3s-cluster.js
    ├── content/               MDX content organized by section with Nextra page maps
    ├── generated/             Build-time generated files (gitignored)
    │   ├── menu.js            Menu and icon registry from prebuild
    │   └── timestamps.json    Last-modified timestamps from git history
    └── styles/                Global Tailwind styles
```

### Scripts

Three scripts in `scripts/`, each running at a different lifecycle stage:

- `prebuild.mjs` — build-time, runs before `next build`. Generates the menu and icon registry at `src/generated/menu.js`, the timestamps map at `src/generated/timestamps.json`, and the metadata manifests uploaded to R2.
- `worker.js` — runtime, the Worker entry point. Wraps OpenNext with a `caches.default` layer, scopes cache keys by `BUILD_ID`, and hosts the internal `/__internal/purge-kv-cache` endpoint.
- `deploy.mjs` — deploy-time, runs after `next build`. Orchestrates the four-step deploy: KV cache purge, `wrangler deploy`, edge cache purge, and warming.

### Content Pipeline

Blog posts live in [`axivo/journal`](https://github.com/axivo/journal), reflections in [`axivo/claude-reflections`](https://github.com/axivo/claude-reflections). A PR merged in either repo drives the pipeline forward:

1. **Prettier formatting.** GitHub Actions runs Prettier against changed Markdown files. Any formatting change is committed back to the branch as `github-actions[bot]` so source and canonical format stay in sync.
2. **Frontmatter parse.** For each changed file, the workflow reads YAML frontmatter and extracts the body, lifting MDX components out of comment blocks and stripping repo-only content.
3. **R2 content sync.** The processed MDX body is uploaded to R2 under `src/content/<section>/YYYY/MM/DD/<slug>.mdx`. Frontmatter fields (author, date, description, source, tags, template, title) are written as R2 custom metadata on the object.
4. **Media sync.** Co-located images and videos are uploaded to `public/<section>/YYYY/MM/` in R2 and served via `cdn.axivo.com`. The `<Image>` component rewrites matching paths to the CDN at render time.
5. **Issue reporting.** If any step fails, the workflow opens a labeled issue against the repo with the run details.
6. **Website deploy.** The next deploy of `axivo/website` runs `scripts/prebuild.mjs`, which iterates the bucket, reads each entry's custom metadata, sorts by date, and writes `metadata/<collection>.json` back to R2. Listing and tag pages read these manifests instead of walking R2 per request.

Authoring an entry never touches the website repo. Write Markdown, open a PR in the content repo, merge, and the next deploy surfaces it.

### Storage Layout

R2 bucket `axivo-website` holds three prefixes:

- **MDX bodies** — `src/content/<section>/YYYY/MM/DD/<slug>.mdx`
  - `src/content/blog/2026/04/21/website-infrastructure-design.mdx`
  - `src/content/claude/reflections/2025/11/17/the-first-night.mdx`
- **Metadata manifests** — `metadata/<collection>.json`
  - `metadata/blog.json`
  - `metadata/reflections.json`
- **Media served via `cdn.axivo.com`** — `public/<section>/YYYY/MM/DD-<slug>.<ext>`
  - `public/claude/reflections/2025/12/14-first-light.webp`
  - `public/blog/2026/04/21-architecture-diagram.webp`

KV namespace `NEXT_INC_CACHE_KV` holds OpenNext's rendered-HTML cache, keyed by `BUILD_ID` so each deploy occupies its own namespace. Entries are stored as `<BUILD_ID>/<sha256-of-route>` and accessed via the `NEXT_INC_CACHE_KV` Worker binding.

The Worker bundle itself carries only code — no content. Publishing more entries adds nothing to the deployed artifact.

### Cache Layers

Three layers, each with a distinct purpose:

- **`caches.default`** — managed by `scripts/worker.js`
  - Per-PoP cache, serves repeat visitors at the edge they hit
  - Cache keys include `BUILD_ID` so deploys invalidate naturally
  - RSC and prefetch requests bypass this layer to avoid serving HTML to clients expecting an RSC stream
- **OpenNext incremental cache (KV)** — configured in `open-next.config.ts` via `kvIncrementalCache`, backed by the `NEXT_INC_CACHE_KV` binding in `wrangler.jsonc`
  - Global via Cloudflare KV's edge-local replication
  - Persists rendered HTML across PoPs; when any edge has a cold `caches.default`, OpenNext reads prerendered HTML from KV instead of re-rendering
  - KV was chosen over R2 after measurement showed 2-4x faster reads for our workload
- **In-isolate memoization** — implemented in `src/components/Post.jsx` via `fetchMetadata`
  - Caches the manifest fetch per-isolate using a module-scoped `Map` keyed by R2 object key
  - Concurrent renders share one R2 call
  - Rejected promises are evicted so a transient failure doesn't poison the isolate

Content sizes and cost economics come from Cloudflare's zero-egress R2 pricing: when a Worker reads an R2 object in the same account, no per-GB charge applies. The architecture is built around this — moving content out of the bundle would trade one bill for another on any other provider.

### Rendering

Static pages (wiki, tutorials, home) are built at deploy time from `/src/content` and served from Workers Static Assets. Nothing to understand beyond "they're baked."

Dynamic pages use a shared factory in `src/components/Page.jsx`:

- **Routes handled by the factory** — reflection entries, blog entries, tag pages, and index pages (year, month, day)
- **Inputs the factory takes:**
  - Source descriptor — path and title for the section
  - Collection descriptor — R2 prefix, route path, section metadata
- **Outputs the factory returns** — Next.js page exports (`generateMetadata`, `generateStaticParams`, `Page`)
- **What gets prerendered vs on-demand:**
  - `generateStaticParams` prerenders section roots and year/month/day indexes
  - Individual entries and tag pages render on-demand, cached afterward in KV

MDX rendering relies on two pieces:

- **[`safe-mdx`](https://www.npmjs.com/package/safe-mdx)** — constrained renderer that walks the MDAST and resolves JSX tags against a components map
  - Disallows arbitrary JavaScript execution, keeping the security boundary on the Worker side
  - Invoked from `src/components/Page.jsx` for every dynamic render
- **`renderNode` hook** — custom extension at `src/components/mdx/renderNode.js`
  - Intercepts blockquote nodes and detects GFM alert markers (`> [!NOTE]`, `> [!TIP]`, etc.)
  - Routes matches to the `Callout` component, mirroring Nextra's `withGitHubAlert` behavior on the dynamic path
  - Passed to `safe-mdx` as the `renderNode` prop

### Components

Components live in two directories with distinct roles.

`src/components/` — structural and navigational, not used from inside MDX:

- `Blog` — blog section entry point, wraps the createPage factory for blog
- `ExploreMenu` — action dropdown in the Subnavbar ("Copy Page", "Open in Claude")
- `FeatureCard` — card grid item used on landing pages
- `Hero` — top-of-page hero block with image and tagline
- `Meta` — author and date strip shown on entry and listing pages
- `Navbar` — top navigation bar, wraps Nextra's navbar with custom items
- `NavbarMenu` — reusable dropdown component for navigation and action menus
- `NavbarMenuItems` — maps top-level nav entries through the menu registry
- `NotFound` — 404 page component
- `Page` — page handler factory (`createPage`) returning Next.js page exports
- `Post` — shared listing utilities (`getPosts`, `Posts`, `fetchMetadata`, pagination)
- `PostCard` — single-entry card rendered in listings
- `PostPage` — client-side paginator with scroll-spy TOC integration
- `Reflection` — Claude reflections section entry point
- `Search` — Algolia DocSearch trigger button with lazy-loaded modal
- `Subnavbar` — section-level sub-navigation under the main navbar
- `Tag` — tag pill component
- `renderNode.js` lives under `mdx/`, but `Page.jsx` imports it here

`src/components/mdx/` — authored inside MDX or injected by `renderNode`:

- `Callout` — GitHub-style alert (note, tip, warning, caution, important) and quote variant with attribution
- `Image` — CDN-aware image with dark/light variant support and path rewriting
- `List` — `Ordered` and `Unordered` list overrides with asymmetric indentation
- `PageTitle` — h1 override that adds the Meta author/date bar and copy-page button
- `SourceCode` — wrapper providing source-code context to the page for "Open in Claude"
- `Steps` — numbered step sequence for tutorials
- `Var` — inline variable reference with code styling
- `Video` — CDN-aware video embed
- `renderNode.js` — safe-mdx hook that transforms GFM alert blockquotes into Callout components on the dynamic render path

The `mdx-components.js` file at the repo root is Next.js's canonical MDX entry point. It merges three sources plus our overrides:

- **Nextra's docs theme components** — headings, code blocks, tables, the default rendering surface
- **The website package's shared components** — everything exported from `@axivo/website`
- **Overrides applied on top:**
  - `blockquote` wrapped with Nextra's `withGitHubAlert` for bundled pages
  - `h1` replaced with `PageTitle` (adds author/date bar and copy-page button)
  - `ol` and `ul` replaced with `Ordered` and `Unordered` (asymmetric indentation tuning)
  - `wrapper` extended to inject source-code context and timestamp metadata

The `renderNode` hook handles the equivalent behaviors for the dynamic `safe-mdx` pipeline, since `safe-mdx` doesn't consume the same React-children shape `withGitHubAlert` expects.

The `@axivo/website` package at `packages/website/` re-exports components and section configuration under subpath imports:

- `@axivo/website` — shared components and utilities for any section
- `@axivo/website/blog` — blog collection factory and variables
- `@axivo/website/claude` — Claude section factory and variables (reflections collection)
- `@axivo/website/k3s-cluster` — K3s section variables
- `@axivo/website/global` — domain, cloudflare, repository, crawlers constants
- `@axivo/website/menu` — build-time-generated menu and icon registry

Each section-scoped entry point lets a section's code import only what it needs without pulling in other sections' config.

### Request Flow

A typical request traces this path:

1. GET arrives at a Cloudflare PoP. The Worker wrapper in `scripts/worker.js` runs.
2. If `caches.default` has the response under the BUILD_ID-scoped key, it's returned immediately. No further work.
3. If cache misses, OpenNext handles the request. Static asset routes resolve from bundled HTML. Dynamic routes enter the `createPage` factory.
4. Dynamic entry renders: fetch MDX from R2, parse to MDAST, render via `safe-mdx`, wrap in the Nextra docs layout.
5. OpenNext stores the response in the KV incremental cache (for other edges) and returns it to the Worker wrapper, which stores it in `caches.default` (for this edge) and returns it to the visitor.
6. RSC and prefetch requests skip both cache layers and always re-render, because caching one variant under a URL breaks clients expecting the other.

### Deploy

`npm run deploy` runs `scripts/deploy.mjs`, which performs four steps in order:

1. **KV purge.** Calls the currently-deployed Worker's internal `/__internal/purge-kv-cache` endpoint with a shared secret (`KV_PURGE_SECRET`). The Worker uses its own KV binding to delete every key from the previous build. No Cloudflare API token needed.
2. **Wrangler deploy.** Ships the new Worker. OpenNext's deploy step populates the KV namespace with the new build's prerendered pages.
3. **Edge cache purge.** Clears Cloudflare's CDN cache for configured prefixes via the Cloudflare Cache API.
4. **Warming.** Fetches `/sitemap.xml`, filters to URLs at path depth ≤ 2 (section roots and listings), issues parallel GETs. The Worker renders them, stores in `caches.default`, and Smart Tiered Cache propagates warm state to other PoPs. Individual entries cache on first-visitor demand.

Secrets required in the deploy environment: `KV_PURGE_SECRET` (for step 1), `ZONE_API_TOKEN` and `ZONE_ID` (for step 3). The same `KV_PURGE_SECRET` value must also be set as a Worker secret via `wrangler secret put` so the Worker can validate the purge request.

### Key Bindings

Declared in `wrangler.jsonc`:

- `CONTENT_BUCKET` — R2 bucket containing content, metadata, and media
- `NEXT_INC_CACHE_KV` — KV namespace for OpenNext's incremental cache
- `ASSETS` — static assets from `.open-next/assets`, including the `BUILD_ID` file
- `IMAGES` — Cloudflare Images binding for media optimization
- `WORKER_SELF_REFERENCE` — self-service binding used internally by OpenNext

Runtime secrets (not in `wrangler.jsonc`, set via `wrangler secret put`):

- `KV_PURGE_SECRET` — shared secret for the internal purge endpoint

## Coding Standards

- JSDoc `@fileoverview` on every file, `@param`/`@returns` on all functions
- No empty lines inside functions
- Exports at the bottom of each file (except Next.js required inline exports like `metadata` and `dynamic`)
- Alphabetical ordering for imports, exports, and configuration arrays
- No hardcoded section names — use `source` from section variables
- No hardcoded domain or protocol — use `domain` from `@axivo/website/global`
- CSS Modules with `@reference "tailwindcss"` for Tailwind v4
