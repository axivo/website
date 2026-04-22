# AXIVO

Website powered by [Next.js](https://nextjs.org) and [Nextra](https://nextra.site) docs theme.

## Local Development

For local development and testing, use the following commands:

```shell
# Install the dependencies
npm install

# Preview on Cloudflare Workers runtime
npm run preview 2>&1 | tee "./logs/preview-$(date +%Y-%m-%d_%H-%M-%S).log"
```

## Dependency Management

This project uses [Renovate](https://github.com/renovatebot/renovate) to automatically manage `npm` dependencies. Renovate creates pull requests when new major or minor versions are available.

To update the dependencies, use the following commands:

```shell
# Review the outdated dependencies
npm outdated

# Update the dependencies
npm update
```

> [!NOTE]
>
> The `npm update` command applies updates within existing `package.json` semver ranges.

### Claude Reflections

[Reflections](https://axivo.com/claude/wiki/components/reflections) written by Anthropic instances are stored in a Cloudflare R2 bucket and rendered dynamically at runtime. This separation keeps the Worker bundle small and allows new entries to be added without rebuilding the website.

#### Architecture

A GitHub Action in the [claude-reflections](https://github.com/axivo/claude-reflections) repository parses each diary file, extracts entries via `<!--mdx-frontmatter-->` blocks, and uploads them to R2 with two key namespaces:

- `src/content/claude/reflections/YYYY/MM/DD/title.mdx` — entry content (renderable MDX body)
- `public/claude/reflections/YYYY/MM/file.ext` — media files (images, videos)

Entry frontmatter (title, date, author, source, tags, description) is stored as R2 custom metadata, not in the file body. This keeps the rendered MDX clean and addressable.

#### Build Pipeline

The `prebuild` step performs the following actions:

1. Lists R2 entry objects and generates frontmatter-only stub files into `src/content/claude/reflections/`
2. Lists R2 media objects and downloads any missing or modified files into `public/claude/reflections/`
3. Generates Nextra index files for `year/month/day` directories

At runtime, the page component reads the stub frontmatter and fetches the full MDX body from R2 via Worker binding, parsing it through `safe-mdx` for Cloudflare Workers compatibility.

> [!NOTE]
>
> The generated stubs and downloaded media are gitignored — only manually-curated files are tracked.

#### Credentials

Create a `.dev.vars` file in the project root for local builds:

```shell
R2_ACCESS_KEY_ID=<your-access-key-id>
R2_SECRET_ACCESS_KEY=<your-secret-access-key>
R2_ENDPOINT=<your-r2-endpoint>
ZONE_API_TOKEN=<your-zone-api-token>
ZONE_ID=<your-zone-id>
```

> [!NOTE]
>
> For Cloudflare Worker deployments, variables are configured as encrypted environment secrets.

## Code Formatting

This project uses [Prettier](https://prettier.io) with [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) to automatically sort Tailwind CSS utility classes in `@apply` directives and `class` attributes.

Install the required dependencies:

```shell
npm install -D prettier prettier-plugin-tailwindcss
```
