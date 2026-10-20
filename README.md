# PVD Portfolio

A developer portfolio with IDE-inspired design, built with React 19 and TanStack Start, deployed on Cloudflare Workers.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Contributing](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Scripts

| Command                  | Description                         |
| ------------------------ | ----------------------------------- |
| `pnpm dev`               | Start dev server                    |
| `pnpm build`             | Build for production                |
| `pnpm preview`           | Preview the production build        |
| `pnpm test`              | Run tests                           |
| `pnpm typecheck`         | Type-check with `tsc`               |
| `pnpm check`             | Lint and format check               |
| `pnpm fix`               | Auto-fix lint/format issues         |
| `pnpm deploy:staging`    | Build and deploy to staging         |
| `pnpm deploy:production` | Build and deploy to production      |
| `pnpm cf-typegen`        | Regenerate Cloudflare binding types |

## Environment Variables

Create `.env` in the project root:

```bash
# Server - Required
LLM_API_KEY=                    # LLM provider API key (Groq)
LOGTAIL_SOURCE_TOKEN=           # Logtail logging token
LOGTAIL_INGESTING_HOST=         # Logtail host
GIT_CONTRIBUTION_TOKEN=         # GitLab token for the contribution graph

# Server - Optional
GITHUB_TOKEN=                   # GitHub token for the repo star count

# Client - Required
VITE_LOGTAIL_SOURCE_TOKEN=      # Client-side logging
VITE_LOGTAIL_INGESTING_HOST=    # Client-side logging host

# Client - Optional
VITE_APP_TITLE=                 # Site title (default: "PVD Portfolio")
VITE_BASE_URL=                  # Base URL (default: "http://localhost:3000")
```

Deployed environments read the server variables from Wrangler secrets (see `wrangler.jsonc`).

## Editing Content

All portfolio content is typed data in `src/config/`. The pages, sidebar trees, search index, SEO tags and the assistant's system prompt are built from it.

| File               | Content                                               |
| ------------------ | ----------------------------------------------------- |
| `personal-info.ts` | Name, role, contact links, resume, avatar             |
| `career.ts`        | Career timeline entries                               |
| `projects.ts`      | Projects, their screenshots, dependencies, category   |
| `skills.ts`        | Core skills, stack, DevOps, standards, workflow       |
| `site.ts`          | Site title, URL, SEO meta, repository, assistant name |

Bio and interests are localized in `messages/{en,vi}/pages.json`.

## Project Structure

```
src/
  routes/         # File-based routing (TanStack Router); desktop at /, mobile at /m
  components/     # One folder per feature (UI, stores, hooks, server functions)
    ui/           # Shadcn components
  config/         # Portfolio content
  lib/            # Feature-agnostic helpers (browser, logger, routes)
  middleware/     # Server middleware (cache, rate limit)
  env/            # Validated environment variables
  themes/         # Theme stylesheets
  paraglide/      # Generated i18n (do not edit)
  server.ts       # Cloudflare Worker entry
messages/         # Translation files (en, vi)
```

## Tech Stack

- **Framework**: TanStack Start (SSR) on Cloudflare Workers
- **UI**: React 19, Tailwind CSS 4, Shadcn, Motion
- **State**: Zustand
- **Validation**: Valibot
- **i18n**: Paraglide-JS
- **Assistant**: Groq
- **Testing**: Vitest
- **Linting**: oxlint and oxfmt (via ultracite)

## Adding UI Components

```bash
pnpm dlx shadcn@latest add <component>
```

## Notes

- React Compiler is enabled - avoid manual `useMemo`/`useCallback`
- Translations go in `messages/{en,vi}/`
