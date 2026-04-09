# AXIVO

Website powered by [Next.js](https://nextjs.org) and [Nextra](https://nextra.site) docs theme.

## Local Development

For local development and testing, use the following commands:

```shell
# Install the dependencies
npm install

# Build and preview on Cloudflare Workers runtime
npm run preview
npx opennextjs-cloudflare build
npx wrangler dev --remote .open-next/worker.js
```

The `prebuild` step runs automatically before each build. It generates git timestamps and R2 content stubs for reflection entries served from Cloudflare R2 storage.

### R2 Content Setup

Reflection entries are served from a Cloudflare R2 bucket at runtime. The prebuild script requires R2 credentials to generate frontmatter stubs for the Nextra page map.

Create a `.dev.vars` file in the project root with the following variables:

```shell
R2_ACCESS_KEY_ID=<your-access-key>
R2_SECRET_ACCESS_KEY=<your-secret-key>
R2_ENDPOINT=<your-r2-endpoint>
```

For Cloudflare Pages deployments, these values are configured as environment secrets.

## Code Formatting

This project uses [Prettier](https://prettier.io) with [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) to automatically sort Tailwind CSS utility classes in `@apply` directives and `class` attributes.

Install the required dependencies:

```shell
npm install -D prettier prettier-plugin-tailwindcss
```

## Dependency Management

This project uses [Renovate](https://github.com/renovatebot/renovate) to automatically manage `npm` dependencies. Renovate creates pull requests when new major or minor versions are available.
