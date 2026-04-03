# AXIVO

Website powered by [Next.js](https://nextjs.org) and [Nextra](https://nextra.site) docs theme.

## Local Development

For local development and testing, use the following commands:

```shell
# Install the dependencies
npm install

# Build the application
npm run build

# Run the development server with Turbopack
npm run dev

# Build and preview on Cloudflare Workers runtime
npm run preview
```

## Code Formatting

This project uses [Prettier](https://prettier.io) with [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) to automatically sort Tailwind CSS utility classes in `@apply` directives and `class` attributes.

Install the required dependencies:

```shell
npm install -D prettier prettier-plugin-tailwindcss
```

## Dependency Management

This project uses [Renovate](https://github.com/renovatebot/renovate) to automatically manage `npm` dependencies. Renovate creates pull requests when new major or minor versions are available.
