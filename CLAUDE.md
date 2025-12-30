# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun --bun run dev          # Start dev server on port 3000

# Build & Production
bun --bun run build        # Build for production (SSR + prerendering)
bun --bun run start        # Run production server

# Testing
bun --bun run test         # Run Vitest tests

# Linting & Formatting
bun --bun run check        # Check with ultracite (extends Biome)
bun --bun run fix          # Fix lint/format issues
bun --bun run lint         # Biome lint only
bun --bun run format       # Biome format only

# Shadcn Components
pnpx shadcn@latest add <component>  # Add new UI component
```

## Environment Variables

Required in `.env`:
```
GEMINI_API_KEY=<required>           # Google Generative AI for chatbot
GIT_CONTRIBUTION_TOKEN=<optional>   # GitHub contributions graph
VITE_APP_TITLE=<optional>           # Defaults to "PVD Portfolio"
VITE_BASE_URL=<optional>            # Defaults to "http://localhost:3000"
```

## Architecture

**Stack**: React 19 + TanStack Start (SSR framework) + Tailwind CSS 4 + Bun

**Routing**: TanStack Router with file-based routes in `src/routes/`
- `__root.tsx` - Root layout (shell wrapper)
- `_root-layout.tsx` - Main content layout
- `_root-layout/*.tsx` - Page routes (home, about, career, skills, projects)

**Key Directories**:
- `src/components/ui/` - Shadcn components (excluded from linting)
- `src/config/` - Site configuration, projects, personal info, skills, career data
- `src/hooks/` - Custom React hooks
- `src/store/` - Zustand stores (tabs, theme, career, app-layout)
- `src/lib/` - Utilities (cn, search, contributions)
- `src/paraglide/` - Generated i18n files (excluded from linting)
- `src/themes/` - CSS theme files

**Patterns**:
- Configuration-driven content via `src/config/*.ts`
- Zustand for UI state management
- Paraglide-JS for i18n with cookie-based locale
- Valibot for schema validation (not Zod)

**React Compiler is enabled** - Do NOT add manual optimizations (`useMemo`, `useCallback`, `React.memo`). The compiler handles memoization automatically.

## Code Style

- Biome with ultracite preset for linting/formatting
- Double quotes, 2-space indentation
- Import organization is automatic
- Pre-commit hook runs `bun x ultracite fix`
- Avoid comments - code should be self-documenting
- Prefer Tailwind utility classes over arbitrary values (`w-10` > `w-[42px]`)

**Excluded from linting**: `routeTree.gen.ts`, `components/ui/*`, `paraglide/*`, route variants (`.$*.tsx`)

## i18n / Translations

**Location**: `messages/{en,vi}/*.json` → generates `src/paraglide/`

**Key Naming**: `{domain}_{context}_{element}` (e.g., `page_career_label_stack`, `ui_theme_select`)

**Translation Vibe**: "Chill Dev with Terminal Aesthetics"
- Casual & conversational, not corporate
- Dev culture references (`.exe`, `> EOF`, "push", "cooking")
- Punchy & direct phrases
- Gen-Z friendly but not cringe
- Examples: "Nothing here, chief", "Pick a vibe...", "File said no"

**Keep formal**: Action labels (`Cancel`, `Close`) and technical labels (`Stack`, `Tools`, `Infra`)
