# Mobile View Backlog: Tap-First Terminal Portfolio

Implementation backlog — restructured from PM-driven planning to developer-driven execution.
Desktop codebase already provides all data, stores, hooks, themes, i18n, and utilities.
This backlog focuses on what to build, not what to define.

---

## Priority Legend

- **P0** = Must Have (MVP) - Cannot launch without
- **P1** = Should Have (Launch) - High value, include if possible
- **P2** = Nice to Have (Post-MVP) - Defer if tight

---

## Codebase Reuse Map

What already exists and needs zero changes:

| Layer      | Reusable Assets                                                                                             |
|------------|-------------------------------------------------------------------------------------------------------------|
| **Config** | `personal-info.ts`, `projects.ts`, `skills.ts`, `career.ts`, `theme.ts`, `routes.ts`, `search/`             |
| **Stores** | `useThemeStore`, `useAppLayoutStore`, `useAssistantStore`, `useCareerStore`, `useTabsStore`                 |
| **Hooks**  | `useContributions`, `useContributionsGraph`, `useSearch`, `useAssistant`, `useFileDownload`, `useRepoStars` |
| **i18n**   | Paraglide EN/VI with all translation keys in `messages/`                                                    |
| **Themes** | 3 CSS themes (default, mono, notebook) + font loading                                                       |
| **Utils**  | `cn()`, search engine (Fuse.js), contributions API, logger, browser detection                               |
| **Server** | Contributions API endpoint, assistant LLM (Groq), middleware                                                |
| **UI**     | All shadcn components in `components/ui/`                                                                   |

What needs modification:

| File               | Change                                           |
|--------------------|--------------------------------------------------|
| `_root-layout.tsx` | Remove mobile block, add mobile detection branch |
| `lib/browser.ts`   | `isMobile` already exists — use it for routing   |

---

## PHASE 1: Shell & Navigation Core (P0)

> Critical path. Everything else depends on this. Build first, test on real device.

| ID          | Task                      | Description                                                                                                                                                                             | Priority | Acceptance Criteria                                                                                                                                     | Dependencies            | Files                                                         |
|-------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|---------------------------------------------------------------|
| **MOB-001** | Mobile route layout       | Create `_mobile-layout.tsx` as the mobile shell wrapper. Detect mobile in root and render mobile layout instead of desktop 3-panel layout.                                              | P0       | Mobile users see terminal shell instead of "hop on desktop" message. Desktop users unaffected. SSR works correctly for both.                            | None                    | `routes/_mobile-layout.tsx`, `routes/_root-layout.tsx`        |
| **MOB-002** | Terminal shell container  | Shared layout component: prompt header area, scrollable output area, fixed command dock at bottom. Monospace font, "raw shell" aesthetic, no UI chrome.                                 | P0       | Full-height terminal viewport. Output area scrolls independently. Dock stays fixed. Themes apply correctly. 8px grid spacing.                           | MOB-001                 | `components/mobile/shell.tsx`                                 |
| **MOB-003** | Command dock              | Fixed bottom bar with 3-4 context-aware monospace buttons + persistent `[#]` button. Buttons change per active view. Disabled state during ghost typing. Touch targets 44x44pt minimum. | P0       | Correct buttons render per view (see Command Dock Reference). Buttons disabled during animation. `[#]` always visible. Visual tap feedback within 60ms. | MOB-002                 | `components/mobile/command-dock.tsx`, `config/mobile-dock.ts` |
| **MOB-004** | Ghost typing hook         | `useGhostTyping` — animates command text character-by-character into prompt line, then triggers callback (navigation). 30-50ms/char, 200-500ms total. Cancellable on new tap.           | P0       | Command types visually in prompt. New tap cancels current animation. Buttons disabled during typing. 60fps rendering.                                   | MOB-002                 | `hooks/use-ghost-typing.ts`                                   |
| **MOB-005** | Smart scroll & navigation | Auto-scroll to top of new content on view change with 60-80pt clearance above dock. Back navigation restores previous scroll position. Smooth 300ms animation.                          | P0       | View transitions scroll to correct position. Back button restores position. No content hidden behind dock. Handles dynamic content height.              | MOB-002, MOB-004        | `hooks/use-mobile-scroll.ts`                                  |
| **MOB-006** | Mobile route structure    | Create mobile sub-routes: home, projects, projects/$id, about, skills, career. Wire navigation between dock buttons and routes.                                                         | P0       | All 6 routes reachable. URL updates on navigation. Direct URL access works (SSR). Ghost typing triggers before route change.                            | MOB-001 through MOB-005 | `routes/_mobile-layout/`                                      |

---

## PHASE 2: Core Views (P0)

> All views are independent — can be built in parallel after Phase 1.
> Each view reads from existing config files. No new data needed.

| ID          | Task                 | Description                                                                                                                                                                                                              | Priority | Acceptance Criteria                                                                                                                                                                                    | Dependencies | Files                                        |
|-------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|----------------------------------------------|
| **MOB-101** | Home shell view      | Landing page: `$ _` prompt, greeting ("HI, I'M [NAME]"), role title, "Current Directory: ~/", 4 tappable directory rows (projects/, skills/, about_me/, career/), instruction text.                                      | P0       | Greeting renders from `personal-info.ts`. All 4 directories tappable. Tap triggers ghost typing (`cd projects/...`) then navigates. Dock: PROJECTS, SKILLS, ABOUT, CAREER.                             | MOB-006      | `components/mobile/views/home.tsx`           |
| **MOB-102** | ~~Projects list view~~ | ~~`ls -la` style listing. Each project as numbered row (01, 02...) with name, short description, stack summary. Tappable rows trigger ghost typing (`open projects/<name>`) and navigate to detail.~~                  | ~~P0~~   | ~~DONE~~ | MOB-006      | `components/project/mobile/project-list.tsx`, `routes/m/projects.index.tsx` |
| **MOB-103** | ~~Project detail view~~ | ~~Case study reader. Project title with number, full-width image (grayscale default), stack listing, description. NEXT button cycles to next project. LIVE opens project URL.~~                                        | ~~P0~~   | ~~DONE~~ | MOB-006      | `components/project/mobile/project-detail.tsx`, `routes/m/projects.$id.tsx` |
| **MOB-104** | About view           | Profile section: photo/avatar + name + location. Bio text. Social links as tappable rows (LinkedIn, GitHub, GitLab, Email). Vertical GitHub activity matrix (4 weeks x 7 days) with 4 density levels (░ ▒ ▓ █).          | P0       | Data from `personal-info.ts`. Contribution graph from `useContributions` hook. Social links open with confirmation. Dock: < BACK, RESUME, CONTACT. RESUME triggers PDF download. CONTACT opens mailto. | MOB-006      | `components/mobile/views/about.tsx`          |
| **MOB-105** | ~~Skills view~~      | ~~Art-directed mobile skills page: 6 sections (Core Hero with TextLoop, Stack List with dashed connectors, Devops Cascade right-aligned, Standards Cards with dashed borders, Workflow Wrap, Exploring Footer with pulsing dot + EOF). Data from `skills.ts`, i18n keys in `messages/{en,vi}/mobile.json`, dock: BACK / PROJECTS / ABOUT.~~ | ~~P0~~ | ~~DONE~~ | MOB-006      | `components/skills/mobile/*.tsx`, `routes/m/skills.tsx` |
| **MOB-106** | Career timeline view | `git log --graph` style. Vertical ASCII tree using `\|`, `o` (education), `+` (part-time), `*` (full-time). Chronological order (education first → present last). Each entry: year, role, company, 1-2 line description. | P0       | Career data from `career.ts`. Markers match employment type. Current role shows "PRESENT". Ends with "(End of log)". Dock: < BACK, RESUME, LINKEDIN.                                                   | MOB-006      | `components/mobile/views/career.tsx`         |

---

## PHASE 3: Global Features (P0 + P1)

> Settings drawer is the container. Features inside wire existing systems.

| ID          | Task                        | Description                                                                                                                                                                                                      | Priority | Acceptance Criteria                                                                                                                                       | Dependencies     | Files                                       |
|-------------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|---------------------------------------------|
| **MOB-201** | Settings drawer             | Bottom sheet triggered by `[#]` button. Half-screen slide-up (250ms) with dimmed backdrop (40% opacity). Dismissible via tap outside or CLOSE. Contains: theme, language, search, assistant, repo link, version. | P0       | Opens from any view. Slides up smoothly at 60fps. Backdrop dims content. Tap outside closes. Z-index above all content. Shows app version from `site.ts`. | MOB-003          | `components/mobile/settings-drawer.tsx`     |
| **MOB-202** | Theme switcher              | Inline selector in settings drawer. 3 options: C x J, Mono, Notebook. Selection triggers ghost typing feedback (`> theme --set mono`). Instant apply, no reload.                                                 | P0       | Wires to existing `useThemeStore`. All 3 themes apply correctly to mobile shell. Persists in localStorage. Ghost typing feedback on change.               | MOB-201          | Integrated in `settings-drawer.tsx`         |
| **MOB-203** | Language toggle             | EN/VI switch in settings drawer. Triggers ghost typing feedback (`> lang --set vi`).                                                                                                                             | P1       | Wires to existing Paraglide i18n. Toggle persists. All translated keys update.                                                                            | MOB-201          | Integrated in `settings-drawer.tsx`         |
| **MOB-204** | Image grayscale interaction | Project images default to CSS grayscale filter. Tap/hold removes filter (shows color). Release returns to grayscale. Smooth 200ms CSS transition.                                                                | P0       | Works on all project images in detail view. No separate image files needed. Transition smooth. Touch events handled correctly (no ghost clicks).          | MOB-103          | Integrated in `project-detail.tsx`          |
| **MOB-205** | External link confirmation  | Modal/dialog for external links: "Open [domain] in browser?" with confirm/cancel. All external links open with `rel="noopener noreferrer"` in new window.                                                        | P0       | Triggers on social links, source code links, LinkedIn. Consistent across all views. Cancel returns to current view.                                       | MOB-104, MOB-106 | `components/mobile/external-link-modal.tsx` |

---

## PHASE 4: Polish & Post-MVP (P1 + P2)

> Each task is self-contained. Build only after Phase 1-3 ship.

| ID          | Task                     | Description                                                                                                                                                                                                     | Priority | Acceptance Criteria                                                                                                                  | Dependencies | Files                                   |
|-------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------|--------------|-----------------------------------------|
| **MOB-301** | Search overlay           | Full-screen overlay from settings drawer. Text input activates keyboard. Fuzzy search across pages, projects, skills, career. Results grouped by category. Max 20 results. Command: `grep -r "query"`.          | P2       | Wires to existing `useSearch` hook + Fuse.js indices. Real-time results. Tap result navigates to view. Empty state with suggestions. | MOB-201      | `components/mobile/views/search.tsx`    |
| **MOB-302** | HeyD assistant overlay   | Full-screen chat overlay from settings drawer. Suggestion chips on fresh load. Text input with keyboard. Streaming markdown responses. Slash commands (/help, /clear, /theme, /feedback). Session-only history. | P2       | Wires to existing `useAssistant` hook + Groq LLM. Streaming works. Rate limiting (10 msgs/session). Slash commands functional.       | MOB-201      | `components/mobile/views/assistant.tsx` |
| **MOB-303** | Loading & error states   | Terminal-style loading messages ("LOADING...", progress dots). Error states with retry. Network failure handling. GitHub API rate limit fallback to static data. Empty states with ASCII art.                   | P1       | Loading visible on slow network. Retry works. Graceful degradation offline. No blank screens.                                        | All P0 tasks | Integrated across views                 |
| **MOB-304** | Performance optimization | Lazy load below-fold images. Code split P2 features (search, assistant). Bundle size <5MB. TTI <2s on 4G. 60fps all animations. No memory leaks in 10min session.                                               | P0       | Lighthouse mobile score >90 performance. Ghost typing at 60fps. Drawer animation at 60fps.                                           | All P0 tasks | Build config + lazy imports             |
| **MOB-305** | Easter eggs              | Tap avatar 5x for fun animation. Hidden terminal commands (`whoami`, `sudo`). Fun 404 page with ASCII art.                                                                                                      | P2       | Discoverable but not obvious. Does not interfere with core UX.                                                                       | MOB-104      | Integrated in views                     |
| **MOB-306** | Mobile i18n keys         | Add mobile-specific translation keys for terminal commands, dock labels, ghost typing text, drawer labels. Follow existing key pattern `{domain}_{context}_{element}`.                                          | P1       | All mobile UI text translatable. Terminal vibe maintained in both EN/VI. Keys added to `messages/{en,vi}/`.                          | MOB-201      | `messages/{en,vi}/mobile.json`          |

---

## Implementation Order (Critical Path)

```
MOB-001 (mobile layout)
  └─> MOB-002 (terminal shell)
        ├─> MOB-003 (command dock)
        ├─> MOB-004 (ghost typing)
        └─> MOB-005 (smart scroll)
              └─> MOB-006 (route structure)
                    ├─> MOB-101 (home)        ─┐
                    ├─> MOB-102 (projects)     │ parallel
                    ├─> MOB-103 (project detail)│
                    ├─> MOB-104 (about)        │
                    ├─> MOB-105 (skills)       │
                    └─> MOB-106 (career)      ─┘
                          └─> MOB-201 (settings drawer)
                                ├─> MOB-202 (theme)
                                ├─> MOB-203 (language)
                                └─> MOB-204 (image interaction)
                                      └─> MOB-301+ (post-mvp)
```

---

## File Structure (New Files)

```
src/
├── routes/
│   ├── _mobile-layout.tsx              # Mobile shell route layout
│   └── _mobile-layout/
│       ├── index.tsx                    # Mobile home (redirect or view)
│       ├── projects.tsx                 # Projects list
│       ├── projects.$id.tsx            # Project detail
│       ├── about.tsx                    # About view
│       ├── skills.tsx                   # Skills view
│       └── career.tsx                   # Career view
├── components/mobile/
│   ├── shell.tsx                        # Terminal shell container
│   ├── command-dock.tsx                 # Fixed bottom navigation
│   ├── settings-drawer.tsx             # [#] menu bottom sheet
│   ├── external-link-modal.tsx         # External link confirmation
│   └── views/
│       ├── home.tsx                     # Home shell content
│       ├── projects-list.tsx           # ls -la project listing
│       ├── project-detail.tsx          # Project case study reader
│       ├── about.tsx                    # Bio + contributions
│       ├── skills.tsx                   # htop-style skills
│       ├── career.tsx                  # git log timeline
│       ├── search.tsx                  # Search overlay (P2)
│       └── assistant.tsx               # HeyD chat overlay (P2)
├── hooks/
│   ├── use-ghost-typing.ts            # Ghost typing animation
│   └── use-mobile-scroll.ts           # Mobile scroll management
├── config/
│   └── mobile-dock.ts                  # Command dock button matrix
└── messages/
    ├── en/mobile.json                  # Mobile-specific EN translations
    └── vi/mobile.json                  # Mobile-specific VI translations
```

---

## Command Dock Button Reference

| View                | Button 1 | Button 2 | Button 3 | Button 4 | Notes                                     |
|---------------------|----------|----------|----------|----------|-------------------------------------------|
| **Home**            | PROJECTS | SKILLS   | ABOUT    | CAREER   | All primary sections                      |
| **Projects List**   | < BACK   | SKILLS   | CAREER   | —        | Cross-nav to other sections               |
| **Project Detail**  | < BACK   | LIVE     | NEXT >   | —        | LIVE only if demo URL exists; NEXT cycles |
| **About**           | < BACK   | RESUME   | CONTACT  | —        | RESUME = PDF download; CONTACT = mailto   |
| **Skills**          | < BACK   | PROJECTS | ABOUT    | —        | Cross-nav to related sections             |
| **Career**          | < BACK   | RESUME   | LINKEDIN | —        | Resume + external LinkedIn link           |
| **Settings Drawer** | —        | —        | —        | CLOSE    | Drawer has inline options                 |
| **Search**          | —        | —        | —        | CLOSE    | Full-screen overlay                       |
| **Assistant**       | —        | —        | —        | CLOSE    | Full-screen overlay                       |

**Persistent:** `[#]` button in bottom-right corner on ALL views (except overlays)

---

## Business Rules

### Interaction Rules

1. **Command Dock**: 3-4 buttons max per view, monospace font, fixed bottom
2. **Back Button**: Always leftmost when present, returns to previous view
3. **Ghost Typing**: 200-500ms total, 30-50ms/char, realistic terminal commands
4. **Animation Interruption**: New tap cancels current and starts new immediately
5. **Double-Tap Prevention**: Buttons disabled during ghost typing (no queue)
6. **Auto-Scroll**: Scroll to top on navigation, 60-80pt clearance above dock
7. **Scroll Memory**: Back navigation restores previous scroll position
8. **Touch Targets**: 44x44pt minimum for all interactive elements
9. **Visual Feedback**: Tap highlight within 60ms
10. **External Links**: Confirmation modal before opening

### Visual Rules

- Typography, themes, color contrast: Extend from desktop
- Image default: Grayscale CSS filter
- Image interaction: Color on tap/hold, grayscale on release
- Spacing: 8px grid
- No UI chrome: Pure typography, black space, no decorative elements
- Terminal prompts: `$`, `>`, `#` used consistently

### Performance Targets

- Time to Interactive: <2s on 4G
- First Contentful Paint: <800ms
- Time to First Byte: <200ms
- Animation frame rate: 60fps (ghost typing, drawer, scroll)
- Total bundle: <5MB including assets
- Image lazy loading: Below-fold images on scroll
- Code splitting: P2 features in separate bundles
- Memory: No leaks in 10min session

### Data & Privacy

- localStorage: `theme` and `language` only
- sessionStorage: `scrollPositions`, `lastView` only
- No user tracking for MVP
- GitHub API: 60 req/hr, fallback to static/cached data (1hr TTL)
- Assistant messages: Session-only, not persisted
- External links: `rel="noopener noreferrer"`, new window
- Resume download: <2MB

### Error Handling

- Empty project list: "No projects yet" placeholder with ASCII art
- Network failure: Error message + retry button
- GitHub API rate limit: Fallback to cached/static data
- Slow network: Loading skeleton (non-blocking)
- Broken images: Alt text + placeholder
- PDF download fail: Error toast + retry
- Theme apply fail: Fallback to default (C x J)
- Search no results: "No matches found" + suggestions
- Assistant API error: "Assistant unavailable" + feedback option

---

## MVP Scope

### P0 - Cannot Launch Without

- Home, Projects (list + detail), About, Skills, Career views
- Settings drawer with theme switching
- Command dock navigation with ghost typing
- Smart scroll + direct manipulation
- Image grayscale interaction
- Resume download + contact link
- GitHub activity visualization
- Performance targets met
- Works on iPhone SE+ and equivalent Android

### P1 - Include If Possible

- Language toggle (EN/VI)
- Mobile-specific i18n keys
- Loading & error states
- 404 page with ASCII art

### P2 - Post-MVP

- Search overlay
- HeyD AI assistant overlay
- Easter eggs
- Deep linking
- PWA features
- Project filtering by stack

---

*This backlog is implementation-ready. All content, data, and infrastructure exist in the desktop codebase.
Reference `docs/mobile-design-brief.md` for wireframes and visual specifications.*