# Migration: Nextra to Astro

Status: planning only. Nothing has been changed in the codebase.
Started: 2026-10-22 as a Fumadocs investigation. Direction changed to Astro on 2026-11-12.

Legend: **Verified** = checked in this repo or a primary source. **UNVERIFIED** = assumption to test in the proof of concept.

## Why migrate

- Nextra publishing is stalled. The last npm release is 4.6.1 (2025-12-04). The `Release` workflow has failed with `E404` since 2025-12-31 ([shuding/nextra#5010](https://github.com/shuding/nextra/issues/5010)). Versions 4.6.2 to 4.6.5 exist in git but were never published.
- Only the owner can fix it. `npm owner ls nextra` lists two accounts (`shudin`, `quietshu`). The active co-maintainer is not an npm owner and said to ask the owner. Fixes can be merged but not shipped.
- The zod fix (PR #4990) is merged upstream but unreleased. We carry a `zod` 4.3.6 override (see CLAUDE.md, Issues). Fresh installs fail ([discussion #4988](https://github.com/shuding/nextra/discussions/4988)).
- A security fix may not be shippable through Nextra. ArcadeAI reported that Next 16.2.11 (four security fixes) broke their Nextra build, and they stayed on the vulnerable version for about a month before a workaround ([ArcadeAI/docs#1250](https://github.com/ArcadeAI/docs/pull/1250)).

## Decision: Astro

- **2026-10-22.** Fumadocs was investigated as the candidate, with the constraint "Next.js is required", which excluded Docusaurus, Starlight and VitePress.
- **2026-11-12.** Floren decided to migrate to Astro: a supported, actively maintained platform that is easy to customize matters more than staying on Next.js.
- **Why not Fumadocs.** About 81% of its commits are by one developer, bus factor 1 (verified 2026-10-22). Nextra failed because one person holds the npm publish rights, and Fumadocs has the same shape.
- **Why Astro.** It has a core team and several maintainers, and the company joined Cloudflare in January 2026. Starlight is maintained by the same team.
- **Astro ships its fixes.** The Cloudflare adapter had three advisories (CVE-2025-58179, CVE-2025-65019, CVE-2026-41321), and each came with a patched release.

Astro renders React components through `@astrojs/react`, statically by default and hydrated only when asked. Components that depend on Next.js or Nextra APIs (`next/link`, `next/navigation`, `nextra/*` hooks, RSC-only code) must be rewritten. Plain React components can stay. UNVERIFIED per component.

## The site today (Verified from repo, 2026-10-22)

### One frame, several docs sites

The site is one shared frame with several independent documentation sites inside it. All four sections (`(home)`, `blog`, `claude`, `k3s-cluster`) have their own `src/app/<section>/layout.jsx`, and every one renders the same Nextra docs `Layout`. Each section passes its own:

- navbar logo (k3s adds a second "K3s Cluster" logo, `logoLink={false}`)
- `pageMap` (its own sidebar; blog also builds a year-based sidebar)
- Algolia `<Search section=…>` scope
- repository, feedback and `docsRepositoryBase` values
- metadata title template

Shared across all sections: `Navbar`, `NavbarMenuItems`, `Subnavbar` (breadcrumb row and Explore menu) and `Footer`. The home page and the blog are therefore docs sites too, not a separate page type.

### Nextra dependencies

- 25 source files import Nextra: `mdx-components.js`, `next.config.mjs`, the 5 `layout.jsx` files, `sitemap.js` (x2), `llms.txt/route.js`, and these components: ExploreMenu, Footer, Link, Meta, Navbar, NavbarMenu, NavbarMenuItems, Page, Subnavbar, mdx/Button, mdx/Callout, mdx/Var, mdx/renderers/code, inlineCode, table.
- Import counts: `nextra-theme-docs` 14, `nextra/components` 8, `nextra/page-map` 7, `nextra/icons` 4, `nextra/hooks` 2, `nextra/pages` 1, `nextra` 1.
- Content: 61 `.mdx` files and 13 `_meta` files under `src/content` (k3s-cluster 37 files, claude 32, blog 3, plus index and menu).
- Dynamic content: blog and reflections are fetched from R2 and rendered with `safe-mdx` in `src/components/Page.jsx`, inside the Nextra docs layout.
- `@axivo/website/theme` re-exports Nextra's `HeadPropsSchema`.
- Styling relies on Nextra CSS variables (`--x-color-*`), the `x:` Tailwind prefix, and Nextra color pairs (CLAUDE.md, Coding Standards).
- Search: `@docsearch/react` with our own `Search.jsx` (Nextra search is disabled with `search: false`).

### The Nextra theme

`nextra-theme-docs` 4.6.1 is a separate MIT package with React components (Layout, sidebar, TOC, breadcrumb, pagination, back-to-top, theme switch, navbar, footer, last-updated, locale switch) and compiled stylesheets of about 90 KB. It has a peer dependency on `nextra` 4.6.1. We import `nextra-theme-docs/style.css` in `src/styles/globals.css` and layer our own `markdown.css` and `navbar.css` on top. We use `Layout` (4 imports), `useConfig` (4), `Link` (3), `useMenu`/`setMenu`/`useThemeConfig`, `Footer` and the theme's MDX components.

## Design

### Parity rule

All sections (home, blog, claude, k3s-cluster) must show the same navbar, breadcrumb row and footer, with the same colors in light and dark. This is a pass/fail criterion for the proof of concept.

### Subnavbar (decided 2026-10-22)

The current live design stays. The two-row frame (navbar + Subnavbar) is kept, with the breadcrumb on the left and the **Explore** menu on the right. The Explore menu (Copy Page, Open in Claude, driven by `src/content/_menu.js`) is untouched. The breadcrumb must show the full path (Documentation > Playbooks > Reset).

### Starting points for the look

- Reuse the Nextra theme where it helps: it is MIT, so components and styles can be ported if the license notice is kept.
- Current content width is `--nextra-content-width: 80rem`.
- We already use `next-themes` for dark mode, and Tailwind CSS 4.
- Ours that a replacement must keep: the breadcrumb row with Explore, the "Last updated" line, the "Question? Give us feedback" link, the navbar search box with the `/` shortcut, and the theme switcher at the bottom of the sidebar.
- The mobile menu may differ; accepted.

## Mapping

| Area                              | Today (Nextra on Next.js)                                                                            | Astro                                                                                                                                                                                | Effort | Status     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ---------- |
| Framework and routing             | Next.js 16 app router, 5 `layout.jsx`, 13 files in `src/app`                                         | Astro pages and layouts in `src/pages`, `src/layouts`                                                                                                                                | High   | UNVERIFIED |
| Deploy                            | OpenNext, `worker.js`, KV purge, `deploy.js`                                                         | `@astrojs/cloudflare` adapter (≥ 13.1.10); `deploy.js` and KV purge to be rewritten against the new build output                                                                     | High   | UNVERIFIED |
| Bundled docs content              | Nextra loader over `src/content`                                                                     | Content collections (`src/content.config.*`) with the MDX integration                                                                                                                | Medium | UNVERIFIED |
| Bundled MDX compile               | Nextra includes `remark-mark-and-unravel` and `rehype-pretty-code` by default                        | Add equivalents explicitly to keep parity with the dynamic path                                                                                                                      | Medium | UNVERIFIED |
| Navigation files                  | 13 `_meta` files                                                                                     | Collection ordering in frontmatter or a small `meta` file per folder; one-time conversion script                                                                                     | Low    | UNVERIFIED |
| Page map and sidebar              | `nextra/page-map` (7 imports), NavbarMenuItems walks it                                              | Our own sidebar component fed from the collections; blog keeps a year-based tree                                                                                                     | High   | UNVERIFIED |
| Dynamic content (R2)              | Fetched from R2, rendered with `safe-mdx` in `Page.jsx`                                              | Option A: content loader pulls R2 at build time (fully static, rebuild per publish). Option B: SSR routes on the Cloudflare adapter render R2 at request time, keeping today's model | High   | UNVERIFIED |
| MDX components                    | `@axivo/website` React components, `mdx-components.js`, Nextra `Callout`/`Tabs`/`Steps`/…            | Pure React components reused through `@astrojs/react`; Nextra-dependent ones rewritten                                                                                               | Medium | UNVERIFIED |
| Code highlighting                 | `rehype-pretty-code` + Shiki                                                                         | Same plugin through the MDX integration, or Astro's built-in Shiki                                                                                                                   | Low    | UNVERIFIED |
| TOC splicing                      | `Page.jsx` inserts entries into Nextra's TOC; heading slug has a leading dash for JSX-first headings | Astro exposes `headings` from rendered MDX; own TOC component; keep `github-slugger` for parity                                                                                      | Medium | UNVERIFIED |
| Styling                           | `nextra-theme-docs/style.css`, `--x-color-*`, `x:` prefix, `markdown.css`, `navbar.css`              | Tailwind 4 through Vite; port the Nextra color pairs as our own CSS variables                                                                                                        | High   | UNVERIFIED |
| Dark mode                         | `next-themes` via our `ThemeProvider`                                                                | Small inline script plus a class on `<html>`; no React needed                                                                                                                        | Low    | UNVERIFIED |
| Search                            | `@docsearch/react`, crawler index, scoped per section                                                | Keep DocSearch as a client island, scope per section. Pending PR #603 bumps `@docsearch/react` to v5 (major); decide before or after migration                                       | Medium | UNVERIFIED |
| Sitemap, `llms.txt`, `robots.txt` | Next routes over `nextra/page-map`                                                                   | Astro endpoints over the collections (or `@astrojs/sitemap`)                                                                                                                         | Medium | UNVERIFIED |
| OG images                         | `/og?title=…` route                                                                                  | Astro endpoint; Satori-based generation if that is what we use today                                                                                                                 | Medium | UNVERIFIED |
| Redirects                         | `src/config/*.js` rules, parent-walk redirect for unknown paths                                      | Astro `redirects` config for static rules; middleware for the parent walk                                                                                                            | Medium | UNVERIFIED |
| Third-party scripts               | `@next/third-parties`                                                                                | Plain script tags or Partytown                                                                                                                                                       | Low    | UNVERIFIED |
| Dependencies                      | `zod` 4.3.6 override for Nextra                                                                      | Override removed with Nextra                                                                                                                                                         | Low    | UNVERIFIED |

## Decisions to make

1. **Starlight or plain Astro.** Starlight gives sidebar, TOC, dark mode and pagination, but it has its own look and expects one docs site per project. Our frame is four sections with a shared two-row navbar. Plain Astro with our own layout is more upfront work, but we own the design and there is no theme to fight. Leaning: **plain Astro**, because pixel-close parity with the current frame is the goal. Decide after the proof of concept renders the frame both ways, if that's cheap.
2. **R2 content: build time or request time.** Build time is simpler and fully static. Request time matches today and publishes without a rebuild. Depends on how often reflections and blog posts are published and whether a rebuild per publish is acceptable.
3. **Image endpoint.** Two of the three Cloudflare adapter CVEs went through `/_image`. If R2 media goes through Astro's image service, stay on patched versions; otherwise serve media directly or through Cloudflare Images.

## Security

### Baseline for Astro

- Start on `@astrojs/cloudflare` ≥ 13.1.10 and a current Astro release.
- Subscribe to the `withastro/astro` GitHub security advisories; the aggregators are secondary sources.
- Keep Renovate on the new stack, as today.

### Interim, until the migration ships (written 2026-10-22)

Renovate PRs #602 (`next`), #598 (`@opennextjs/cloudflare`) and #499 (`wrangler`) carry security fixes. Cloudflare Workers Builds passes on them. ArcadeAI's experience suggests running a local build and preview with Next at or above 16.2.11 before merging. Run Test A below.

## Safety rules for all tests

- Isolated branch or worktree. No merge to `main`, no `wrangler deploy`, no writes to the production R2 bucket, KV namespace or Algolia index.
- Use throwaway Algolia indexes if search is tested.
- **Do not run `npm run build`.** `scripts/prebuild.js` runs first and uploads metadata manifests to R2. It skips R2 only without credentials, and it loads them from `.dev.vars` when the shell has none.
- Use `npx next build` directly, with no `R2_*` or `ZONE_*` variables in the shell, and copy `src/build/` from the main checkout (it is gitignored and normally generated by `prebuild.js`).
- `npm run preview` also runs `prebuild`, and `wrangler.jsonc` has `remote: true` on KV and R2.

## Test A: security updates (NOT STARTED)

Question: does Nextra 4.6.1 still build with the updated Next? ArcadeAI reported that Next 16.2.11 and later broke their Nextra build.

1. Isolated copy of the repo; install the versions from Renovate PRs #602, #598 and #499.
2. `npx next build`, then the OpenNext build.
3. Record: pass or fail, error text, whether any workaround like ArcadeAI's `lib/swc-page-extensions.ts` is needed, and Turbopack versus webpack.
4. Only after a pass, merge the three PRs and deploy as usual.

Results: _pending_

## Proof of concept (NOT STARTED)

Decision gate. Stop and reconsider if any of these fail:

1. The shared frame (Navbar, Subnavbar with breadcrumb and Explore, Footer) renders identically across two sections in light and dark mode.
2. One R2 reflection renders through the chosen path (A or B) with the same HTML as the bundled path for the same MDX.
3. DocSearch works as an island, scoped per section.
4. The build runs on the Cloudflare adapter and previews locally.

Steps:

1. Fresh Astro app with `@astrojs/mdx`, `@astrojs/react`, Tailwind 4 and `@astrojs/cloudflare`.
2. Port `Navbar`, `Subnavbar` and `Footer`; check which `@axivo/website` components import Next.js or Nextra.
3. Two sections, two or three pages each: plain MDX, one with Steps, Tabs and a code block, one with Callout.
4. One reflection from R2 (read-only) through option A or B.
5. DocSearch island.
6. Record results here and update every UNVERIFIED item.

Results: _pending_

## Phases after the proof of concept

1. Content: move 61 MDX files, convert 13 `_meta` files, keep URLs identical.
2. Components: audit `@axivo/website` and `src/components` for Next.js and Nextra imports; port or rewrite.
3. Frame and styling: layouts per section, sidebar, TOC, color variables.
4. Dynamic R2 path and TOC splicing.
5. Search, sitemap, `llms.txt`, OG images, redirects.
6. Deploy: adapter, `deploy.js`, KV purge.
7. Parity: re-run the baseline crawl and compare row by row; visual diffs in light and dark mode.
8. Cleanup: remove Next.js, Nextra, OpenNext and the `zod` override; update CLAUDE.md, Renovate and README.

Rollback: do the work on a branch; `main` stays deployable until parity passes.

## Baseline: unchanged `main` in local preview (2026-10-22)

Branch `feat/website-migration` at `243f2b9` (same as `main`). Nothing in the app was changed.

> The crawl output and script lived in `/tmp/baseline/` and are gone. Capture the baseline again, and keep it outside `/tmp`, before changing anything.

### How it was run

1. `npm ci` (844 packages, lockfile untouched).
2. `npx wrangler login` was needed first. `initOpenNextCloudflareForDev()` opens a remote session during `next build`. With an expired OAuth token the first run failed with "Your auth token has expired and could not be refreshed". The login is interactive and must be done by the owner.
3. `npm run preview`. It reissued the Let's Encrypt production certificate for `preview.axivo.com` (valid until 2027-01-21), ran `prebuild` (timestamps for 850 files, menu registry, metadata manifests for 3 blog and 134 reflections objects, which likely refreshes the manifests in R2), ran `next build` (Next.js 16.2.9, Turbopack), built the OpenNext bundle, populated the local KV cache (179 entries) and served `https://preview.axivo.com:8787`.
4. The device tool gives up waiting after about 60 seconds, so start the preview in the background and poll its log.

### Routes checked in Safari

| Path                       | Status   | Title                                                | Bytes   |
| -------------------------- | -------- | ---------------------------------------------------- | ------- |
| `/`                        | 200      | Imagine. Create. - AXIVO                             | 140,329 |
| `/blog`                    | 200      | Home – Blog \| AXIVO                                 | 108,268 |
| `/claude`                  | 200      | Home – Claude Collaboration Platform \| AXIVO        | 500,237 |
| `/claude/reflections`      | 200      | Reflections – Claude Collaboration Platform \| AXIVO | 897,502 |
| `/claude/reflections/tags` | 200      | Tags – Claude Collaboration Platform \| AXIVO        | 729,866 |
| `/k3s-cluster`             | 200      | Home – K3s Cluster \| AXIVO                          | 94,340  |
| `/k3s-cluster/wiki`        | 200      | Documentation – K3s Cluster \| AXIVO                 | 167,580 |
| `/sitemap.xml`             | 200      | (XML)                                                | 32,365  |
| `/robots.txt`              | 200      | (text)                                               | 63      |
| `/llms.txt`                | 200      | (text)                                               | 1,976   |
| `/does-not-exist-test`     | redirect | (parent-walk redirect, as designed)                  | n/a     |

Canonical links point at the production host (`https://axivo.com/...`), not the preview host. The home page was also checked visually with a Safari screenshot.

### Full sitemap crawl

A read-only Node script fetched every URL in the preview's `sitemap.xml` (8 requests at a time) and recorded status, redirect target, title, meta description, canonical link, H1, `og:image` and JSON-LD types.

| Check                                                   | Result                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------ |
| URLs in sitemap                                         | 198, all HTML, all status 200, no errors                                 |
| By section                                              | root 1, blog 5, claude 159, k3s-cluster 33                               |
| Missing title, description, canonical, H1 or `og:image` | 0                                                                        |
| JSON-LD                                                 | `Article` 134, `BlogPosting` 3, none 61                                  |
| Canonical host                                          | `axivo.com` on every page; canonical path equals page path on every page |
| Duplicate titles                                        | 6 distinct titles shared by more than one page (not yet investigated)    |
| Total HTML size                                         | about 132 MB across the 198 pages                                        |

Compare status, title, description, canonical, H1, `og:image` and JSON-LD types. Byte sizes will differ and are not meaningful.

### To capture before comparing

- Full sitemap URL list with per-page title, description, canonical, H1 and JSON-LD.
- Redirect rules from `src/config/*.js` (claude, cluster, global).
- Screenshots of key pages in light and dark mode.
- The search modal (DocSearch) opened and used.

## Open questions

- Which `@axivo/website` components import `next/*` or `nextra/*`? A grep answers this before the proof of concept.
- Does `safe-mdx` render inside an Astro React island, or should R2 MDX go through Astro's own MDX pipeline (it is our own content, so running it as MDX may be acceptable)?
- How does the parent-walk redirect work today, and does Astro middleware on the adapter reproduce it?
- What does `/og` use today (Satori or other)?
- Does Astro's content layer keep `lastModified` the way `timestamps.json` does today?

## Sources

- [shuding/nextra#5010](https://github.com/shuding/nextra/issues/5010), [#4989](https://github.com/shuding/nextra/issues/4989), [#5036](https://github.com/shuding/nextra/issues/5036)
- npm registry: `npm view nextra time` (last release 4.6.1, 2025-12-04), checked 2026-11-12.
- [ArcadeAI/docs#1250](https://github.com/ArcadeAI/docs/pull/1250): a Nextra migration to Fumadocs, merged 2026-10-19; useful for its parity checks and its Next 16.2.11 workaround.
- [CVE-2025-58179](https://www.cvelogic.com/cve/CVE-2025-58179), [CVE-2025-65019](https://advisories.gitlab.com/npm/astro/CVE-2025-65019/), [CVE-2026-41321](https://fieldguide.lutrasecurity.com/CVE-2026-41321/).
