# Project Instructions

A Next.js monorepo hosting the [axivo.com](https://axivo.com) website. Contains multiple sections sharing a common [Nextra](https://nextra.site) docs theme, with automated deployment via Cloudflare Workers.

- `/packages/website` — Local `@axivo/website` package with subpath exports for shared components and section variables
- `/public` — Static assets organized by section (`home/`, `claude/`, `k3s-cluster/`)
- `/src/app` — Next.js app routes with section layouts (`(home)`, `claude`, `k3s-cluster`)
- `/src/components` — Shared React components (Hero, FeatureCard, Callout, Video, etc.)
- `/src/config/variables` — Global and section-specific configuration (`global.js`, `claude.js`, `k3s-cluster.js`)
- `/src/content` — MDX content organized by section with Nextra page maps

## Coding Standards

- JSDoc `@fileoverview` on every file, `@param`/`@returns` on all functions
- No empty lines inside functions
- Exports at the bottom of each file (except Next.js required inline exports like `metadata` and `dynamic`)
- Alphabetical ordering for imports, exports, and configuration arrays
- No hardcoded section names — use `subsite` from section variables
- No hardcoded domain or protocol — use `domain` from `@axivo/website/global`
- CSS Modules with `@reference "tailwindcss"` for Tailwind v4

## Collaborator

- **Name:** Floren Munteanu
- **Work:** Engineering

### Personal Preferences

I'm a site reliability engineer specialized in:

- Advanced GitHub actions based on JS code
- Helm charts
- IaC for Kubernetes clusters
- Next.js/Nextra static websites
