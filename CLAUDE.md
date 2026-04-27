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

The site is a static Next.js/Nextra application deployed to Cloudflare Workers via OpenNext. Content lives outside the deployment artifact: reflections and blog posts are MDX files in R2, fetched and rendered at request time. Cloudflare's zone CDN absorbs warm traffic without invoking the Worker; the Worker only runs on cold misses, post-purge first hits, and dynamic paths (RSC, internal endpoints). The whole thing runs for the price of a coffee per month.

### Directory Tree

```
.
├── mdx-components.js                      Next.js canonical MDX entry point (merges Nextra + package + overrides)
├── next.config.mjs                        Next.js config, wraps Nextra, initializes OpenNext for dev
├── open-next.config.ts                    OpenNext adapter config (selects kvIncrementalCache)
├── wrangler.jsonc                         Cloudflare Worker bindings (R2, KV, assets, images, services)
├── package.json                           Workspace root, npm scripts (prebuild, build, deploy, preview)
├── packages/
│   └── website/                           Local @axivo/website package with subpath exports
│       ├── index.js                       Shared components and utilities
│       ├── blog.js                        Blog collection factory and variables
│       ├── claude.js                      Claude section factory and variables
│       ├── k3s-cluster.js                 K3s section variables
│       ├── global.js                      Domain, cloudflare, repository, crawlers constants
│       ├── menu.js                        Re-export of the build-time menu/icon registry
│       ├── page.js                        Re-export of the dynamic Page factory and parseMdx pipeline
│       └── remark.js                      Server-only remark plugin re-exports for prebuild and dynamic render
├── public/                                Static assets organized by section (home/, claude/, k3s-cluster/)
├── scripts/
│   ├── deploy.js                          Deploy-time: KV purge, wrangler deploy, edge purge, warming
│   ├── prebuild.js                        Build-time: generates menu registry, timestamps, R2 manifests
│   ├── preview.js                         Local dev: issues Let's Encrypt cert via Cloudflare DNS-01, runs Wrangler over HTTPS
│   └── worker.js                          Runtime: Worker entry, wraps OpenNext with caches.default
└── src/
    ├── app/                               Next.js app routes with section layouts
    │   ├── _meta.js
    │   ├── layout.jsx
    │   ├── manifest.js
    │   ├── not-found.jsx
    │   ├── robots.js
    │   ├── sitemap.js
    │   ├── (home)/
    │   ├── blog/
    │   ├── claude/
    │   └── k3s-cluster/
    ├── components/                        Structural and navigational React components
    │   ├── Blog.jsx                       Binds the Post.jsx helpers to the blog collection descriptor
    │   ├── ExploreMenu.jsx                Subnavbar action dropdown wiring _menu actions to Nextra hooks
    │   ├── FeatureCard.jsx                Responsive card grid and individual feature card for landing pages
    │   ├── FeatureCard.module.css
    │   ├── Hero.jsx                       Full-width landing hero with gradient title and theme-aware image
    │   ├── Hero.module.css
    │   ├── Meta.jsx                       Author and date strip displayed below entry titles
    │   ├── Meta.module.css
    │   ├── Navbar.jsx                     Sticky header shell replacing Nextra's navbar
    │   ├── NavbarMenu.jsx                 Reusable dropdown with click-outside dismissal for nav menus
    │   ├── NavbarMenu.module.css
    │   ├── NavbarMenuItems.jsx            Walks Nextra's page map and renders nav links and dropdown menus
    │   ├── NotFound.jsx                   Theme-aware 404 page matching Next.js default styling
    │   ├── Page.jsx                       Page handler factory combining bundled MDX with R2-backed entries
    │   ├── Post.jsx                       Collection-agnostic post fetching, listing, and pagination helpers
    │   ├── PostCard.jsx                   Renders a single entry card with title, meta, description, and tags
    │   ├── PostCard.module.css
    │   ├── PostPage.jsx                   Client-side paginator updating TOC and scroll-spy on page change
    │   ├── PostPage.module.css
    │   ├── Reflection.jsx                 Binds the Post.jsx helpers to the reflections collection descriptor
    │   ├── Search.jsx                     Algolia DocSearch trigger replacing Nextra's Pagefind
    │   ├── Search.module.css
    │   ├── Subnavbar.jsx                  Sticky breadcrumb bar with Explore button below the navbar
    │   ├── Subnavbar.module.css
    │   ├── Tag.jsx                        Tags grid rendering content-sized pills with entry counts
    │   ├── Tag.module.css
    │   └── mdx/                           Components authored inside MDX content
    │       ├── Button.jsx                 Wraps Nextra's Button with block-level spacing for standalone use
    │       ├── Button.module.css
    │       ├── Callout.jsx                GitHub-alert callouts plus a quote variant with attribution
    │       ├── Callout.module.css
    │       ├── footnotes.js               MDAST preprocessor that numbers footnote refs and appends the section
    │       ├── Image.jsx                  Theme-aware image with optional card template and caption
    │       ├── Image.module.css
    │       ├── List.jsx                   Ordered and unordered list overrides with custom indent
    │       ├── List.module.css
    │       ├── PageTitle.jsx              H1 override emitting page title plus blog-template author bar
    │       ├── PageTitle.module.css
    │       ├── renderers/                 Per-MDAST-node renderers for the dynamic safe-mdx pipeline
    │       │   ├── alert.js               Routes GFM alert blockquotes to Callout, mirroring withGitHubAlert
    │       │   ├── code.js                Injects precomputed shiki HTML for fenced blocks via cursor
    │       │   ├── footnoteReference.js   Renders footnote refs as numbered superscript links
    │       │   ├── footnotesSection.js    Renders the synthetic footnotes section appended by the preprocessor
    │       │   ├── footnotesSection.module.css
    │       │   ├── image.js               Routes markdown images through the CDN-aware Image component
    │       │   ├── inlineCode.js          Injects precomputed shiki HTML for inline code with {:lang} hints
    │       │   ├── list.js                Renders task-list containers with the contains-task-list class
    │       │   ├── list.module.css
    │       │   ├── listItem.js            Unwraps leading paragraph and emits the task checkbox when present
    │       │   ├── listItem.module.css
    │       │   ├── node.js                Per-render dispatcher factory closing over highlighted-code arrays
    │       │   └── table.js               Splits header from body and applies per-column alignment
    │       ├── SourceCode.jsx             Module-scoped store bridging MDX wrapper and Subnavbar Explore
    │       ├── Steps.jsx                  Wraps headings as numbered or bullet step markers
    │       ├── Steps.module.css
    │       ├── utils.js                   Resolves CDN paths for Image and Video media sources
    │       ├── Var.jsx                    Inline variable rendered as code, link, or plain text
    │       ├── Video.jsx                  Plyr-backed media embed for HTML5, YouTube, and Vimeo
    │       └── Video.module.css
    ├── config/
    │   ├── site.js                        Theme config (navbar, sidebar, footer)
    │   └── variables/                     Section-specific configuration
    │       ├── global.js
    │       ├── blog.js
    │       ├── claude.js
    │       └── cluster.js
    ├── content/                           MDX content organized by section with Nextra page maps
    ├── generated/                         Build-time generated files (gitignored)
    │   ├── menu.js                        Menu and icon registry from prebuild
    │   └── timestamps.json                Last-modified timestamps from git history
    └── styles/                            Global Tailwind styles
```

### Scripts

Four scripts in `scripts/`, each running at a different lifecycle stage:

- `deploy.js` — deploy-time, runs after `next build`. Orchestrates the three-step deploy:
  - KV cache purge through the currently-deployed Worker's internal endpoint
  - `wrangler deploy` to ship the new Worker
  - Edge cache purge for configured route prefixes
- `prebuild.js` — build-time, runs before `next build`. Generates the artifacts the build depends on:
  - Menu and icon registry at `src/generated/menu.js`
  - Timestamps map at `src/generated/timestamps.json` from git history
  - Metadata manifests uploaded to R2 for each collection
- `preview.js` — local dev, runs via `npm run preview`. Produces a LAN-accessible HTTPS preview server:
  - Issues a Let's Encrypt certificate via ACME DNS-01, using the Cloudflare API to manage the challenge TXT record
  - Caches the PEMs under `./certs/` and reuses them until the renewal threshold
  - Builds the OpenNext bundle and runs `opennextjs-cloudflare preview` over HTTPS bound to the Mac's LAN IP
  - Falls back to plain HTTP when Cloudflare credentials are missing
- `worker.js` — runtime, the Worker entry point. Wraps OpenNext with the request-time caching and policy layer:
  - `caches.default` layer scoped by `BUILD_ID` so deploys invalidate naturally
  - `Vary` normalization on cacheable responses so the zone CDN accepts them
  - Status-keyed `cache-control` policy applied to responses leaving the Worker
  - Internal `/__internal/purge-kv-cache` endpoint for the deploy-time KV purge

### Content Pipeline

Blog posts live in [`axivo/journal`](https://github.com/axivo/journal), reflections in [`axivo/claude-reflections`](https://github.com/axivo/claude-reflections). A PR merged in either repo drives the pipeline forward:

1. **Prettier formatting:** GitHub Actions runs Prettier against changed Markdown files. Any formatting change is committed back to the branch as `github-actions[bot]` so source and canonical format stay in sync.
2. **Frontmatter parse:** For each changed file, the workflow reads YAML frontmatter and extracts the body, lifting MDX components out of comment blocks and stripping repo-only content.
3. **R2 content sync:** The processed MDX body is uploaded to R2 under `src/content/<section>/YYYY/MM/DD/<slug>.mdx`. Frontmatter fields (author, date, description, source, tags, template, title) are written as R2 custom metadata on the object.
4. **Media sync:** Co-located images and videos are uploaded to `public/<section>/YYYY/MM/` in R2 and served via `cdn.axivo.com`. The `<Image>` component rewrites matching paths to the CDN at render time.
5. **Issue reporting:** If any step fails, the workflow opens a labeled issue against the repo with the run details.
6. **Website deploy:** The next deploy of `axivo/website` runs `scripts/prebuild.js`, which iterates the bucket, reads each entry's custom metadata, sorts by date, and writes `metadata/<collection>.json` back to R2. Listing and tag pages read these manifests instead of walking R2 per request.

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

Four layers, each with a distinct purpose. Listed in order of how a request encounters them:

- **Cloudflare zone CDN** — configured via a Cache Rule in the Cloudflare dashboard
  - First layer a request hits. Stores responses at the PoP keyed by URL.
  - Cache Rule expression matches `axivo.com` and excludes `/_next/data`, `/__internal`, and RSC requests (`?_rsc=` query string).
  - Edge TTL set to "Use cache-control header if present" — the rule trusts the Worker's emitted cache-control as the policy, rather than overriding it from the dashboard.
  - On hit, the Worker is not invoked. The CDN responds directly. This is the dominant path for warm sitemap traffic.
- **`caches.default`** — managed by `scripts/worker.js`
  - Per-PoP cache inside the Worker, used when the zone CDN didn't already have an answer.
  - Cache keys include `BUILD_ID` so deploys invalidate naturally
  - RSC and prefetch requests bypass this layer to avoid serving HTML to clients expecting an RSC stream
- **OpenNext incremental cache (KV)** — configured in `open-next.config.ts` via `kvIncrementalCache`, backed by the `NEXT_INC_CACHE_KV` binding in `wrangler.jsonc`
  - Global via Cloudflare KV's edge-local replication
  - Persists rendered HTML across PoPs; when any edge has a cold `caches.default`, OpenNext reads prerendered HTML from KV instead of re-rendering
  - KV was chosen over R2 after measurement showed 2-4x faster reads for our workload
- **In-isolate memoization** — implemented in `src/components/Post.jsx` via `getMetadata`
  - Caches the manifest fetch per-isolate using a module-scoped `Map` keyed by R2 object key
  - Concurrent renders share one R2 call
  - Rejected promises are evicted so a transient failure doesn't poison the isolate

Content sizes and cost economics come from Cloudflare's zero-egress R2 pricing: when a Worker reads an R2 object in the same account, no per-GB charge applies. The architecture is built around this — moving content out of the bundle would trade one bill for another on any other provider.

### Cache Policy

The Worker is the authoritative source for cache policy across all responses. The zone CDN trusts whatever `cache-control` header the Worker sends. Three pieces of policy live in `scripts/worker.js`:

- **`Vary` normalization.** OpenNext emits `Vary: RSC, Next-Router-State-Tree, ...` on prerendered pages. Cloudflare's CDN refuses to cache responses with non-standard `Vary` values. The Worker overwrites `Vary` to `Accept-Encoding` on cacheable responses before returning to the zone, which the CDN honors. RSC and prefetch requests bypass this code path entirely, so the original `Vary` is preserved where it matters semantically.
- **`statusTtl` and `setTtl`.** A status-keyed table at module scope sets per-status `cache-control` policy on responses leaving the Worker: 60s for 404/410, 24h for 301/308, no-store for 302/307 and all 5xx. For 3xx/4xx, origin retains opt-out via `no-store|no-cache|private`. For 5xx, the rewrite is unconditional — a safety floor that origin cache-control cannot override. Adding or changing policy is a one-line edit to the table.
- **HEAD as GET.** HEAD requests are rewritten to GET internally for cache lookup and origin fetch, then the body is stripped on return. This routes around an OpenNext bug where HEAD on cold-cache state returns 503, and lets HEAD share cache state with GET so monitoring and health checks see consistent latency.

### Rendering

The site has two render paths. Authoring intent is that they produce identical HTML for identical input — every architectural choice flows from this parity contract.

- **Bundled path.** Static MDX files under `src/content/` (wiki, tutorials, home, the k3s-cluster section) are compiled at deploy time by Nextra's MDX loader and served as Workers Static Assets. JSX components imported in MDX are resolved at compile time against the components map.
- **Dynamic path.** R2-backed entries (blog, reflections) are fetched, parsed to MDAST, and rendered at request time via [`safe-mdx`](https://www.npmjs.com/package/safe-mdx) — a constrained renderer that walks the MDAST and resolves JSX tags against the same components map without executing arbitrary JavaScript. Security boundary stays on the Worker side; authoring ergonomics match the bundled path.

Dynamic pages use a shared factory in `src/components/Page.jsx`:

- **Routes handled by the factory** — reflection entries, blog entries, tag pages, and index pages (year, month, day)
- **Inputs the factory takes:**
  - Source descriptor — path and title for the section
  - Collection descriptor — R2 prefix, route path, section metadata
- **Outputs the factory returns** — Next.js page exports (`generateMetadata`, `generateStaticParams`, `Page`)
- **What gets prerendered vs on-demand:**
  - `generateStaticParams` prerenders section roots and year/month/day indexes
  - Individual entries and tag pages render on-demand, cached afterward in KV

MDX rendering on the dynamic path relies on four pieces:

- **`parseMdx` in `src/components/Page.jsx`** runs the unified pipeline: `remark-parse` → `remark-mdx` → `remarkMarkAndUnravel` (deep-imported from `@mdx-js/mdx`, unwraps JSX-only paragraphs so dynamic HTML matches bundled HTML) → `remark-gfm` → `remarkMermaid`. The output is an MDAST tree handed to safe-mdx.
- **`safe-mdx`** walks the MDAST and emits React. JSX tags resolve against the components map from `mdx-components.js`. No arbitrary JavaScript is ever evaluated.
- **`renderers/` directory** at `src/components/mdx/renderers/` is a per-MDAST-node-type dispatch registry. The dispatcher is built by `createDispatch` in `node.js` and passed to safe-mdx as its `renderNode` hook. Each handler under `renderers/` covers one node type (alert blockquotes, fenced code, footnote refs, footnotes section, markdown images, inline code with `{:lang}` hints, task-list containers, list items, tables). Handlers that return undefined fall back to safe-mdx's default rendering. Adding a new node type means adding one file to `renderers/` and one entry to the registry in `node.js`.

The bundled path runs Nextra's standard compile pipeline, which already includes `remark-mark-and-unravel` and `rehype-pretty-code`, so its output is the structural baseline the dynamic path is shaped against.

### Components

Components live in two directories with distinct roles. The directory tree above lists every file with a one-line purpose; the notes below capture how the pieces fit together.

`src/components/` — structural and navigational pieces that frame the site (navbar, sub-navbar, hero, search, post listings, page factory). Not used from inside MDX. `Page.jsx` is the most architecturally important of these — it's the factory for R2-backed dynamic entries, and it owns the `parseMdx` pipeline plus the `getMetadata` memoization.

`src/components/mdx/` — components authored from inside MDX, plus the dynamic-path renderers:

- The top-level `.jsx` files (Button, Callout, Image, List, PageTitle, SourceCode, Steps, Var, Video) are MDX-authored components shared between bundled and dynamic paths via the components map. They're the override layer over Nextra's primitives.
- `footnotes.js` is a one-shot MDAST preprocessor that runs before safe-mdx visits the tree, numbering footnote refs and appending the synthetic Footnotes section.
- `utils.js` holds the shared CDN path resolver used by Image and Video.
- `renderers/` is the dynamic-path dispatch registry — each file handles one MDAST node type that needs custom rendering on the safe-mdx path. `node.js` builds the per-render dispatcher via `createDispatch`. See the Rendering section above for the architecture.

The `mdx-components.js` file at the repo root is Next.js's canonical MDX entry point and the **convergence point for both render paths** — both consult the same map, so overriding once applies everywhere. It merges three sources plus our overrides:

- **Nextra's docs theme components** — headings, code blocks, tables, the default rendering surface
- **Nextra's built-in primitives** (`Banner`, `Bleed`, `Cards`, `Collapse`, `FileTree`, `Tabs`) — explicitly added to the map so the dynamic path resolves them. The bundled path resolves them via ESM imports at compile time, so this only matters for safe-mdx.
- **The website package's shared components** — everything exported from `@axivo/website`
- **Overrides applied on top:**
  - `Button` replaced with our wrapper (`./src/components/mdx/Button`) for block-level spacing
  - `blockquote` wrapped with Nextra's `withGitHubAlert` so the bundled path routes alert syntax to Callout (the dynamic path uses `renderers/alert.js` for the same behavior)
  - `h1` replaced with `PageTitle` (adds author/date bar)
  - `Mermaid` added so fenced mermaid blocks transformed by `remarkMermaid` resolve at render time
  - `ol` and `ul` replaced with `Ordered` and `Unordered` (asymmetric indentation tuning)
  - `wrapper` extended to inject source-code context and timestamp metadata

The `@axivo/website` package at `packages/website/` re-exports components and section configuration under subpath imports:

- `@axivo/website` — shared components and utilities for any section (client-safe)
- `@axivo/website/blog` — blog collection factory and variables
- `@axivo/website/claude` — Claude section factory and variables (reflections collection)
- `@axivo/website/k3s-cluster` — K3s section variables
- `@axivo/website/global` — domain, cloudflare, repository, crawlers constants
- `@axivo/website/menu` — build-time-generated menu and icon registry
- `@axivo/website/remark` — server-only remark plugin re-exports for prebuild and dynamic render (kept separate from the main barrel because pulling in client-side components like Breadcrumb in a Node script breaks resolution)

Each section-scoped entry point lets a section's code import only what it needs without pulling in other sections' config.

### Request Flow

A typical request traces this path:

1. GET arrives at a Cloudflare PoP. The zone CDN checks its cache against the Cache Rule's match expression.
2. If the zone has a stored response, it's returned directly. The Worker is not invoked. This is the dominant path — sitemap URLs at warm steady state are 100% zone-CDN hits.
3. If the zone misses, the Worker wrapper in `scripts/worker.js` runs.
4. If `caches.default` has the response under the BUILD_ID-scoped key, the Worker returns it immediately.
5. If both caches miss, OpenNext handles the request. Static asset routes resolve from bundled HTML. Dynamic routes enter the `createPage` factory.
6. Dynamic entry renders: fetch MDX from R2, parse to MDAST, render via `safe-mdx`, wrap in the Nextra docs layout.
7. The Worker normalizes `Vary` and applies `setTtl` if the response status warrants it, then stores the result in `caches.default` (for this edge) and returns it. OpenNext also stores in the KV incremental cache for other edges. The zone CDN stores the response on its way back to the visitor.
8. RSC and prefetch requests skip the zone CDN (excluded by the Cache Rule's `?_rsc=` filter) and bypass `caches.default` inside the Worker, always re-rendering, because caching one variant under a URL breaks clients expecting the other.
9. HEAD requests are rewritten to GET inside the Worker for cache lookup and origin fetch, then the body is stripped on return.

### Preview

The `npm run preview` command runs `scripts/preview.js`, which produces a local dev server reachable at `https://preview.axivo.com:8787` with a browser-trusted Let's Encrypt certificate. Two paths depending on whether Cloudflare credentials are present:

1. **Credentials present** (`ZONE_DNS_TOKEN` and `ZONE_ID` set in `.dev.vars`):
   1. **Cert lifecycle.** Checks `./certs/` for a cached cert. Reuses if validity is more than 30 days out and the issuer matches the configured `cloudflare.zone.acme.environment` (`staging` or `production`). Otherwise issues a fresh cert via ACME using the [`acme-client`](https://www.npmjs.com/package/acme-client) library against Let's Encrypt directly.
   2. **DNS-01 challenge.** Uses the Cloudflare API to write the challenge TXT record at `_acme-challenge.preview.axivo.com`, waits 10 seconds for Cloudflare's authoritative NS to publish (matching certbot's default `propagation_seconds`), tells Let's Encrypt the challenge is ready, and deletes the TXT record after validation.
   3. **Account keys.** ACME account keys are namespaced per environment (`certs/account.staging.key`, `certs/account.production.key`) so flipping `cloudflare.zone.acme.environment` between staging and production never crosses accounts.
   4. **Wrangler.** Builds the OpenNext bundle, then spawns `opennextjs-cloudflare preview` bound to the Mac's LAN IP with `--local-protocol https`, `--https-cert-path`, and `--https-key-path`. The `preview.axivo.com` A record points at the LAN IP, so Safari resolves the hostname → connects to the LAN IP → SNI matches the cert → green padlock.
2. **Credentials missing.** Logs a notice and runs the preview server in plain HTTP on the LAN IP. Useful for fresh clones that haven't set up the Cloudflare token yet.

Secrets required in `.dev.vars` for the HTTPS path:

- `ZONE_DNS_TOKEN` — Cloudflare API token scoped to `Zone:DNS:Edit` on the website's zone, used to manage the ACME challenge TXT record. Independent from the deploy-time `ZONE_CACHE_TOKEN` so dev and prod credentials rotate separately.
- `ZONE_ID` — Cloudflare zone identifier for `axivo.com`, passed to every DNS API call.

### Deploy

The `npm run deploy` command runs `scripts/deploy.js`, which performs three steps in order:

1. **KV purge.** Calls the currently-deployed Worker's internal `/__internal/purge-kv-cache` endpoint with a shared secret (`KV_PURGE_SECRET`). The Worker uses its own KV binding to delete every key from the previous build. No Cloudflare API token needed.
2. **Wrangler deploy.** Ships the new Worker. OpenNext's deploy step populates the KV namespace with the new build's prerendered pages.
3. **Edge cache purge.** Clears Cloudflare's CDN cache for configured prefixes via the Cloudflare Cache API.

Secrets required in the deploy environment:

- `KV_PURGE_SECRET` — shared secret authenticating the script-to-Worker purge request in step 1. The same value must also be set as a Worker secret via `wrangler secret put` so the Worker can validate it.
- `ZONE_CACHE_TOKEN` — Cloudflare API token scoped to `Zone:Cache Purge` on the website's zone, used by the cache purge in step 3.
- `ZONE_ID` — Cloudflare zone identifier for `axivo.com`, passed to the cache purge call.

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
