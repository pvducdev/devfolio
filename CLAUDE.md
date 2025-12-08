# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio site built with TanStack Start (React), featuring a resume viewer, AI assistant integration, and theme customization. The project uses Bun as the package manager and runtime.

## Development Commands

### Running the Application
```bash
bun install              # Install dependencies
bun --bun run dev        # Start dev server on port 3000
bun --bun run build      # Build for production
bun --bun run start      # Run production server
bun --bun run serve      # Preview production build
```

### Code Quality
```bash
bun --bun run test       # Run tests with Vitest
bun --bun run lint       # Lint with Biome
bun --bun run format     # Format with Biome
bun --bun run check      # Check with Ultracite
bun --bun run fix        # Fix with Ultracite
bun --bun run doctor     # Run Ultracite doctor
```

### Adding UI Components
```bash
pnpx shadcn@latest add button    # Add shadcn components
```

## Architecture

### Routing System
- **Framework**: TanStack Router with file-based routing
- **Route Location**: `src/routes/`
- **Auto-generation**: `src/routeTree.gen.ts` is auto-generated, do not edit manually
- **Root Layout**: `src/routes/__root.tsx` contains the shell component
- **Nested Layouts**: `src/routes/_root-layout.tsx` for nested layout patterns

### State Management
- **Global State**: Zustand with persist middleware (see `src/store/`)
- **Theme State**: `src/store/theme.ts` persists theme selection
- **Tabs State**: `src/store/tabs.ts` manages open tabs
- **Layout State**: `src/store/app-layout.ts` manages sidebar/panel visibility
- **Assistant State**: `src/store/assistant.ts` manages AI chat state

### Component Structure
- `src/components/ui/` - shadcn UI components (excluded from Biome linting)
- `src/components/ai-elements/` - AI streaming response components (excluded from Biome)
- `src/components/layout/` - App shell, sidebar, header, footer
- `src/components/sidebar/` - Sidebar content panels (about, projects, work experiences)
- `src/components/resume-viewer/` - PDF resume viewer with EmbedPDF
- `src/components/assistant/` - AI assistant chat interface with Gemini
- `src/components/tabs/` - Tab bar and MDX content viewer
- `src/components/welcome/` - Welcome/landing page components
- `src/components/common/` - Shared utility components

### Configuration Files
- `src/config/theme.ts` - Theme definitions (Notebook, Bubblegum, Dark Twitter, Mocha Mousse)
- `src/config/personal.ts` - Personal information configuration
- `src/config/routes.tsx` - Route configuration
- `src/config/site.ts` - Site metadata
- `src/config/gemini-system-prompt.txt` - Gemini AI system prompt
- `src/env.ts` - T3Env environment variable validation with Zod
- `src/mdx-components.tsx` - Custom MDX component provider

### Key Libraries
- **React 19** with React Compiler enabled (`babel-plugin-react-compiler`)
- **TanStack Start** for full-stack React with SSR
- **TanStack Router** for file-based routing with devtools
- **Zustand** for state management with persistence
- **@embedpdf/** packages for PDF viewing functionality
- **@google/genai** for Gemini AI integration
- **@headless-tree/react** for tree components
- **@mdx-js/rollup** for MDX content support
- **streamdown** for streaming markdown rendering (SSR bundled)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Radix UI** primitives for accessible components
- **Biome** for linting and formatting
- **Ultracite** for additional code quality checks
- **Vitest** for testing
- **@inlang/paraglide-js** for type-safe internationalization

### Path Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json and vite-tsconfig-paths)

### Environment Variables
- Use T3Env for type-safe environment variables
- Client variables must be prefixed with `VITE_`
- Add new variables to `src/env.ts` schema
- Access via `import { env } from "@/env"`

### Styling
- **Tailwind CSS v4** (using Vite plugin)
- **Theme System**: CSS variables applied via `src/lib/applyTheme.ts`
- Available themes defined in `src/config/theme.ts`
- Main styles in `src/styles.css`

### Internationalization (i18n)
- **Framework**: Paraglide.js with Inlang
- **Supported Locales**: `en` (source), `vi`
- **Message Files**: `messages/{locale}/*.json` - modular by domain (common, navigation, pages, ui, career, assistant, commands)
- **Auto-generation**: `src/paraglide/` is auto-generated, do not edit manually
- **Configuration**: `project.inlang/settings.json`
- **Usage**: Import from `@/paraglide/messages.js` and `@/paraglide/runtime.js`
- **Locale Detection**: cookie (`PARAGLIDE_LOCALE`) → browser preference → baseLocale
- **Server Integration**: Paraglide middleware in `src/server.ts`

### Git Hooks
- **Lefthook** configured for pre-commit hooks
- Runs `bun x ultracite fix` on staged files: `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.jsonc`, `.css`
- Auto-stages fixed files

### Biome Configuration
- Excludes: `src/routeTree.gen.ts`, `src/components/ui/**/*`, `src/components/ai-elements`, `src/styles.css`, `src/paraglide/**/*`
- Quote style: double quotes
- Import organization enabled
- Extends ultracite configuration

### Testing
- **Framework**: Vitest with jsdom environment
- **Testing Library**: React Testing Library
- Run single test file: `bun --bun run test path/to/test.spec.tsx`

## Important Notes

1. **Bun Runtime**: Always use `bun --bun run` instead of plain `bun run` for scripts to ensure Bun's native runtime
2. **Auto-generated Files**: Never edit `src/routeTree.gen.ts` - it's regenerated by TanStack Router
3. **shadcn Components**: UI components in `src/components/ui/` are generated and excluded from linting
4. **Theme Application**: Theme changes go through `applyTheme()` function which modifies CSS variables
5. **React Compiler**: The project uses the stable React Compiler — manual hook optimizations aren't needed
6. **TypeScript**: Strict mode enabled with strict null checks
7. **Coding Style**: Avoid comments, prefer Tailwind utility classes over arbitrary values (w-10 > w-[40px])
8. **MDX Files**: Can be imported as components; custom components provided via `src/mdx-components.tsx`
9. **SSR**: `streamdown` package is bundled for SSR via `ssr.noExternal` in vite.config.ts
10. **Paraglide Files**: Never edit `src/paraglide/` - it's regenerated from message files in `messages/`
11. **Adding Translations**: Add keys to `messages/en/*.json`, then add translations to `messages/vi/*.json`