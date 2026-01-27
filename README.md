# PVD Portfolio

A developer portfolio with IDE-inspired design, built with React 19 and TanStack Start.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Contributing](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

## Quick Start

```bash
bun install
bun --bun run dev
```

Open http://localhost:3000

## Scripts

| Command               | Description                 |
|-----------------------|-----------------------------|
| `bun --bun run dev`   | Start dev server            |
| `bun --bun run build` | Build for production        |
| `bun --bun run start` | Run production server       |
| `bun --bun run test`  | Run tests                   |
| `bun --bun run check` | Lint and format check       |
| `bun --bun run fix`   | Auto-fix lint/format issues |

## Environment Variables

Create `.env` in the project root:

```bash
# Server - Required
LLM_API_KEY=                    # LLM provider API key (Groq)
LOGTAIL_SOURCE_TOKEN=           # Logtail logging token
LOGTAIL_INGESTING_HOST=         # Logtail host

# Server - Optional
GIT_CONTRIBUTION_TOKEN=         # GitLab contributions
GITHUB_TOKEN=                   # GitHub contributions

# Client - Required
VITE_LOGTAIL_SOURCE_TOKEN=      # Client-side logging
VITE_LOGTAIL_INGESTING_HOST=    # Client-side logging host

# Client - Optional
VITE_APP_TITLE=                 # Site title (default: "PVD Portfolio")
VITE_BASE_URL=                  # Base URL (default: "http://localhost:3000")
```

## Project Structure

```
src/
  routes/         # File-based routing (TanStack Router)
  components/     # React components
    ui/           # Shadcn components
  config/         # Site content and settings
  store/          # Zustand state
  hooks/          # Custom hooks
  lib/            # Utilities
  paraglide/      # Generated i18n (do not edit)
messages/         # Translation files (en, vi)
```

## Tech Stack

- **Framework**: TanStack Start (SSR)
- **UI**: React 19, Tailwind CSS 4, Shadcn
- **State**: Zustand
- **Validation**: Valibot
- **i18n**: Paraglide-JS
- **Testing**: Vitest
- **Linting**: Biome (via ultracite)

## Adding UI Components

```bash
bunx --bun shadcn@latest add <component>
```

## Notes

- React Compiler is enabled - avoid manual `useMemo`/`useCallback`
- Edit content in `src/config/` files
- Translations go in `messages/{en,vi}/`
