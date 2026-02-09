# Mobile View Backlog: Tap-First Terminal Portfolio
---

## Priority Legend

- **P0** = Must Have (MVP Blockers) - Cannot launch without
- **P1** = Should Have (Launch) - High value, include if possible
- **P2** = Nice to Have (Post-MVP) - Defer to backlog if tight timeline

---

## PHASE 1: FOUNDATION

### Week 1: Discovery & Planning

| ID         | Task                 | Description                                                                 | Priority | Owner        | Acceptance Criteria                                                                                                                                                                             | Dependencies |
|------------|----------------------|-----------------------------------------------------------------------------|----------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| **PM-001** | Content Inventory    | Document all portfolio content: projects, skills, career, bio, social links | P0       | PM + Content | ✓ 3-5 complete projects with images<br>✓ 8-12 skills categorized<br>✓ 3-5 career entries with dates<br>✓ Bio (100-200 words)<br>✓ All social links validated                                    | None         |
| **PM-002** | User Journey Mapping | Define all navigation flows, entry/exit points                              | P0       | PM           | ✓ 5-7 primary user journeys documented<br>✓ All views connected with clear paths<br>✓ Back navigation logic defined<br>✓ External link flows mapped                                             | None         |
| **PM-003** | Command Dock Logic   | Define context-aware buttons for each view (3-4 buttons max)                | P0       | PM           | ✓ Complete button matrix for all 7 views<br>✓ Button priority order defined<br>✓ Label character limits (8-10 chars max)<br>✓ Disabled state rules specified<br>✓ Active view indicator defined | PM-002       |

### Week 2: Interaction Rules

| ID         | Task                      | Description                                                | Priority | Owner | Acceptance Criteria                                                                                                                                                                     | Dependencies |
|------------|---------------------------|------------------------------------------------------------|----------|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| **PM-004** | Ghost Typing Behavior     | Define visual feedback mechanism and interruption handling | P0       | PM    | ✓ Animation duration: 200-500ms<br>✓ Typing speed: 30-50ms/char<br>✓ Commands match terminal syntax<br>✓ **Interruption rule: Cancel on new tap**<br>✓ Button disabled during animation | PM-003       |
| **PM-005** | Direct Manipulation Rules | Define tap behavior for all listed content items           | P0       | PM    | ✓ All tappable elements defined<br>✓ Touch targets 44x44pt minimum<br>✓ Visual feedback specified (highlight)<br>✓ Long-press behavior defined<br>✓ External link confirmation modal    | PM-002       |
| **PM-006** | Smart Scroll Logic        | Define auto-scroll and position memory                     | P0       | PM    | ✓ Scroll to top of content on navigation<br>✓ 60-80pt clearance above dock<br>✓ Back navigation restores position<br>✓ Smooth animation (300ms)<br>✓ Handles dynamic content height     | PM-004       |

### Week 3: Global Features

| ID         | Task                  | Description                                    | Priority | Owner | Acceptance Criteria                                                                                                                                                                                                                                                        | Dependencies |
|------------|-----------------------|------------------------------------------------|----------|-------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| **PM-007** | Settings Drawer Spec  | Define [#] menu content, behavior, and z-index | P0       | PM    | ✓ Half-screen drawer slides up (250ms)<br>✓ Backdrop dimmed (40% opacity)<br>✓ Dismissible via tap outside or close<br>✓ Contains: Theme, Language, Search, Assistant, Repo, Version<br>✓ Z-index above all content                                                        | PM-003       |
| **PM-008** | Theme System Rules    | Define 3 themes with specific color palettes   | P0       | PM    | ✓ **C x J**: Black bg, green text, terminal aesthetic<br>✓ **Mono**: White bg, black text, minimalist<br>✓ **Notebook**: Cream bg (#F5F3EE), dark blue text, subtle texture<br>✓ WCAG AA contrast (4.5:1 min)<br>✓ Instant apply (no reload)<br>✓ Persists in localStorage | PM-007       |
| **PM-009** | Language/Localization | Define EN/VI toggle for static UI text         | P1       | PM    | ✓ Toggle between English/Vietnamese<br>✓ All static text translatable<br>✓ Content can remain single language<br>✓ Persists in localStorage<br>✓ Translation keys documented (50+ keys)                                                                                    | PM-007       |

### Week 4: Core View Requirements

| ID         | Task                       | Description                                              | Priority | Owner | Acceptance Criteria                                                                                                                                                                                                                                                                                                                                 | Dependencies   |
|------------|----------------------------|----------------------------------------------------------|----------|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **PM-010** | Home View Requirements     | Define landing page: greeting, directory listing, dock   | P0       | PM    | ✓ "HI, I'M [NAME]" + title<br>✓ Last login timestamp (can be static)<br>✓ 4 directory items tappable<br>✓ Instruction text clear<br>✓ Dock: 4 buttons (PROJECTS, SKILLS, ABOUT, CAREER)<br>✓ Loading state specified                                                                                                                                | PM-001, PM-003 |
| **PM-011** | Projects View Architecture | Define list (2a) and detail (2b) with image interactions | P0       | PM    | ✓ List: `ls -la` style, numbered 01-NN<br>✓ Each row: name, description (40-60 chars), stack (3-5 items)<br>✓ Detail: Full case study (200-300 words)<br>✓ **Images: Grayscale default, color on tap/hold**<br>✓ **"View Source Code (GitHub)" link**<br>✓ NEXT button cycles through projects<br>✓ Pagination if >10 projects                      | PM-001, PM-005 |
| **PM-012** | About View Requirements    | Define bio, ASCII avatar, social links, GitHub activity  | P0       | PM    | ✓ **ASCII/Pixelated avatar** style (200x200pt)<br>✓ Bio 100-200 words<br>✓ 3-6 social links as tappable rows<br>✓ **Vertical GitHub Activity Matrix** (4 weeks × 7 days)<br>✓ Activity levels: ░ ▒ ▓ █ (4 levels)<br>✓ Data source: GitHub API or static snapshot<br>✓ **Update frequency: Weekly or static**<br>✓ Resume download behavior defined | PM-001         |
| **PM-013** | Skills View Requirements   | Define system monitor style with proficiency bars        | P0       | PM    | ✓ System stats header (CPU/MEM metaphor)<br>✓ Skills table: PID, Name, Status columns<br>✓ Status: [ACTIVE] (used in 6 months) / [IDLE]<br>✓ Proficiency bars: ASCII `[####.....]` + %<br>✓ 8-12 skills minimum<br>✓ Can be categorized or flat                                                                                                     | PM-001         |
| **PM-014** | Career View Requirements   | Define git log timeline with markers                     | P0       | PM    | ✓ Chronological order (education → present)<br>✓ Vertical ASCII tree: `│`, `o`, `+`, `*`<br>✓ Markers: o=Education, +=Part-time, *=Full-time<br>✓ Each entry: Year, role, company, 1-2 line description<br>✓ "PRESENT" for current role<br>✓ "(End of log)" at bottom                                                                               | PM-001         |

---

## PHASE 2: CONTENT & DESIGN

### Week 5-6: Content Production

| ID         | Task                   | Description                                          | Priority | Owner              | Acceptance Criteria                                                                                                                                                                                                                                                         | Dependencies          |
|------------|------------------------|------------------------------------------------------|----------|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| **PM-015** | Content Creation       | Write all case studies, bio, career descriptions     | P0       | Content + PM       | ✓ 3-5 project case studies written (200-300 words)<br>✓ Each includes: Problem, Solution, Results<br>✓ Bio written in first person, authentic voice<br>✓ Career descriptions concise (1-2 lines)<br>✓ All content grammar/spell checked<br>✓ **Peer reviewed by 2+ people** | PM-010 through PM-014 |
| **PM-035** | Content Strategy Guide | Define what makes compelling case studies            | P1       | PM + Content       | ✓ Template for project case studies<br>✓ Tone guidelines (direct, efficient, terminal vibe)<br>✓ Examples of good vs bad descriptions<br>✓ Project ordering rationale (chronological vs priority)<br>✓ Content update process defined                                       | PM-001                |
| **PM-016** | Asset Optimization     | Optimize images, create ASCII avatar, prepare resume | P0       | Content + Designer | ✓ Project images: WebP format, <200KB each<br>✓ **ASCII/pixelated avatar created** (400x400 source)<br>✓ Profile photo optimized <50KB<br>✓ Resume PDF <2MB, mobile-readable<br>✓ Responsive image sizes (1x, 2x, 3x)<br>✓ Lazy loading strategy defined                    | PM-015                |
| **PM-034** | Image Interaction Spec | Define grayscale-to-color behavior                   | P0       | PM                 | ✓ Default state: Grayscale filter (CSS)<br>✓ **Tap/hold: Remove filter (color)**<br>✓ **Tap release: Return to grayscale** OR stay color (TBD)<br>✓ Smooth transition (200ms)<br>✓ Works on all project images<br>✓ No separate image files needed                          | PM-011, PM-016        |

### Week 7: System Design

| ID         | Task                    | Description                                         | Priority | Owner         | Acceptance Criteria                                                                                                                                                                                                                                                                         | Dependencies           |
|------------|-------------------------|-----------------------------------------------------|----------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|
| **PM-017** | Navigation Flow Docs    | Document all paths, state transitions, deep linking | P0       | PM            | ✓ Every view reachable from home<br>✓ No dead ends (except external links)<br>✓ Back button logic consistent<br>✓ Cross-navigation mapped<br>✓ **Deep linking URLs defined** (optional for MVP)<br>✓ Edge cases documented                                                                  | PM-003, PM-006         |
| **PM-018** | Data & State Management | Define localStorage, session storage, API usage     | P0       | PM            | ✓ **localStorage**: Theme, Language only<br>✓ **sessionStorage**: Scroll positions, last view<br>✓ **GitHub API**: Rate limit handling (60/hr)<br>✓ API fallback: Static data if rate limited<br>✓ No user tracking for MVP<br>✓ Cache strategy (TTL for GitHub data)                       | PM-008, PM-009, PM-012 |
| **PM-033** | Loading & Error States  | Define all loading, empty, and error scenarios      | P0       | PM            | ✓ **Loading states**: Skeleton screens OR loading message<br>✓ **Empty states**: "No projects yet" placeholder<br>✓ **Error states**: Network failure, 404, rate limits<br>✓ **Offline behavior**: Graceful degradation message<br>✓ Retry mechanisms defined<br>✓ Toast/notification style | PM-017                 |
| **PM-032** | Visual Design Quality   | Define consistency checks for terminal aesthetic    | P1       | PM + Designer | ✓ Typography: Monospace font specified (e.g., JetBrains Mono)<br>✓ "Raw Shell" aesthetic maintained<br>✓ No decorative UI chrome<br>✓ Consistent spacing (8px grid system)<br>✓ Terminal prompt style defined (`$`, `>`, `#`)<br>✓ ASCII art guidelines                                     | PM-008                 |

### Week 8: QA Preparation

| ID         | Task                     | Description                                     | Priority | Owner | Acceptance Criteria                                                                                                                                                                                                                                                  | Dependencies          |
|------------|--------------------------|-------------------------------------------------|----------|-------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| **PM-019** | User Acceptance Criteria | Define success criteria and performance targets | P0       | PM    | ✓ UAT checklist for each view (7 views)<br>✓ **Performance**: TTI <2s, 60fps animations<br>✓ **Device matrix**: iPhone SE, 13, 15; Samsung S21, S24; Pixel 7<br>✓ **Browsers**: Safari (iOS), Chrome (Android)<br>✓ Network: 3G, 4G, WiFi<br>✓ No P0 bugs for launch | PM-010 through PM-014 |

---

## PHASE 3: ADVANCED FEATURES

### Week 9-10: Optional Features

| ID         | Task                  | Description                                 | Priority | Owner         | Acceptance Criteria                                                                                                                                                                                                                                                                                                                                                       | Dependencies   |
|------------|-----------------------|---------------------------------------------|----------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **PM-020** | Search Feature        | Full-screen fuzzy search across all content | P2       | PM            | ✓ Real-time fuzzy search as user types<br>✓ Searchable: Pages, projects, skills, career<br>✓ Results grouped by category<br>✓ Max 20 results<br>✓ Empty state with suggestions<br>✓ Command: `grep -r "query"`<br>✓ **Can defer to post-MVP**                                                                                                                             | PM-007, PM-015 |
| **PM-021** | HeyD AI Assistant     | Chat interface with streaming responses     | P2       | PM            | ✓ Text input with keyboard<br>✓ **Suggestion chips**: "What's your stack?", "Latest project?", "Contact info?"<br>✓ **Slash commands**: /help, /clear, /theme, /feedback<br>✓ **Streaming markdown responses**<br>✓ Session-only history (no persistence)<br>✓ Knowledge base: Portfolio content only<br>✓ Rate limiting (10 msgs/session)<br>✓ **Can defer to post-MVP** | PM-007, PM-015 |
| **PM-037** | Easter Eggs & Delight | Hidden interactions for engaged users       | P2       | PM + Designer | ✓ Tap avatar 5x for fun animation/message<br>✓ Konami code or gesture for secret<br>✓ Hidden terminal commands (e.g., `whoami`)<br>✓ Seasonal themes (optional)<br>✓ Fun 404 page with ASCII art<br>✓ **Can defer to post-MVP**                                                                                                                                           | PM-010, PM-012 |

### Week 11: Integration & Polish

| ID         | Task                        | Description                                  | Priority | Owner    | Acceptance Criteria                                                                                                                                                                                                                                                        | Dependencies |
|------------|-----------------------------|----------------------------------------------|----------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| **PM-022** | Feature Integration Testing | Ensure all features work together seamlessly | P0       | PM + QA  | ✓ Theme applies to all views<br>✓ Language applies to all views<br>✓ Navigation works from all views<br>✓ **Animation interruption handled**<br>✓ **No conflicts between features**<br>✓ Settings drawer works from all views<br>✓ **If P2 features not ready, skip them** | All P0 tasks |
| **PM-023** | Performance Optimization    | Meet 60fps and load time targets             | P0       | PM + Dev | ✓ Time to First Byte <200ms<br>✓ First Contentful Paint <800ms<br>✓ TTI <2s on 4G<br>✓ 60fps animations (ghost typing, drawer, scroll)<br>✓ No memory leaks in 10min session<br>✓ Lazy load below-fold images<br>✓ Code splitting for P2 features                          | PM-022       |

---

## Comprehensive Business Rules

### 🎮 Interaction Rules (Must Follow)

1. **Command Dock**: 3-4 buttons maximum per view, monospace font, fixed bottom position
2. **Back Button**: Always leftmost position when present, returns to previous view
3. **Ghost Typing**: 200-500ms total animation, 30-50ms per character, realistic terminal commands
4. **Animation Interruption**: New tap cancels current animation and starts new one immediately
5. **Double-Tap Prevention**: Buttons disabled during ghost typing animation (no queue)
6. **Auto-Scroll**: On navigation, scroll to top with 60-80pt clearance above Command Dock
7. **Scroll Position Memory**: Back navigation restores previous scroll position
8. **Touch Targets**: Minimum 44x44pt for all interactive elements (iOS/Android standard)
9. **Visual Feedback**: Tap shows highlight/color shift immediately (60ms response)
10. **External Links**: Require confirmation modal: "Open [domain] in browser?"

### 📝 Content Rules (Minimums)

Extend from desktop

### 🎨 Visual Rules (Standards)

21. **Typography**: Extend from desktop
22. **Themes**: Extend from desktop
23. **Color Contrast**: Extend from desktop
24. **Image Default**: Grayscale filter via CSS
25. **Image Interaction**: Color on tap/hold, return to grayscale on release (or toggle - TBD)
26. **ASCII Avatar**: Pixelated/ASCII style, 200x200pt display size
27. **GitHub Activity**: Same as desktop
28. **Spacing**: 8px grid system for consistency
29. **No UI Chrome**: Pure typography, black space, no decorative elements
30. **Terminal Prompt**: Use `$`, `>`, `#` consistently

### ⚡ Performance Rules (Targets)

31. **Time to Interactive**: <2 seconds on 4G
32. **First Contentful Paint**: <800ms
33. **Time to First Byte**: <200ms
34. **Animation Frame Rate**: 60fps on target devices (iPhone 11+, Android equivalent)
35. **Ghost Typing**: Must render at 60fps (no dropped frames)
36. **Drawer Animation**: Smooth 250ms slide with 60fps
37. **Total Bundle Size**: <5MB including all assets
38. **Image Lazy Loading**: Below-the-fold images load on scroll
39. **Code Splitting**: P2 features (Search, Assistant) in separate bundles
40. **Memory**: No leaks during 10-minute session

### 💾 Data & Privacy Rules (Compliance)

41. **localStorage Keys**: `theme` and `language` only
42. **sessionStorage Keys**: `scrollPositions`, `lastView` only
43. **No User Tracking**: No analytics, cookies, or third-party scripts for MVP
44. **No Login**: No authentication or user accounts
45. **GitHub API**: 60 requests/hour limit, fallback to static data if exceeded
46. **API Caching**: GitHub activity data cached for 1 hour (TTL)
47. **No Conversation Storage**: Assistant messages not persisted (session-only)
48. **PII Protection**: No collection of personal user information
49. **External Links**: All open in new window with `rel="noopener noreferrer"`
50. **Resume Download**: Trigger browser download, <2MB file size

### 🎯 Edge Cases & Error Handling

61. **Empty Project List**: Show placeholder "No projects yet" with ASCII art
62. **Network Failure**: Show error message with retry button
63. **GitHub API Rate Limit**: Fallback to cached or static data
64. **Slow Network**: Show loading skeleton (not blocking)
65. **Broken Images**: Show alt text + placeholder icon
66. **PDF Download Fail**: Show error toast with retry option
67. **External Link Fail**: Show error "Could not open link"
68. **Theme Apply Fail**: Fallback to default theme (C x J)
69. **Search No Results**: Show "No matches found" + top 5 suggestions
70. **Assistant API Error**: Show "Assistant unavailable" with feedback option

---

## MVP Scope Definition

### ✅ MUST HAVE (P0) - Cannot Launch Without

**Core Views:**

- ✅ Home View (Landing)
- ✅ Projects List (View 2a)
- ✅ Project Detail (View 2b)
- ✅ About View with GitHub activity
- ✅ Skills View with proficiency bars
- ✅ Career Timeline
- ✅ Settings Drawer

**Core Interactions:**

- ✅ Command Dock navigation (3-4 buttons per view)
- ✅ Ghost typing animation (200-500ms)
- ✅ Direct manipulation (tap items)
- ✅ Smart scroll on navigation
- ✅ [#] button to open Settings Drawer

**Core Features:**

- ✅ Theme switching (3 themes: C x J, Mono, Notebook)
- ✅ Image grayscale-to-color interaction
- ✅ Resume download button
- ✅ Contact/email link
- ✅ Social links (LinkedIn, GitHub, Email minimum)
- ✅ GitHub activity visualization
- ✅ Responsive mobile layout

**Quality:**

- ✅ Performance targets met (TTI <2s, 60fps)
- ✅ Works on 6+ device types
- ✅ Zero P0 bugs, <5 P1 bugs
- ✅ Basic accessibility (WCAG AA)
- ✅ SEO basics (meta tags, social cards)

### 🟡 SHOULD HAVE (P1) - High Value, Include If Possible

- 🟡 Language toggle (EN/VI)
- 🟡 Easter eggs (avatar tap, hidden commands)
- 🟡 Content strategy guide
- 🟡 Visual design consistency audit
- 🟡 Advanced SEO (structured data, sitemap)
- 🟡 404 page with ASCII art
- 🟡 Copy refinement polish
- 🟡 Maintenance plan documentation

### ⏸️ NICE TO HAVE (P2) - Defer to Post-MVP Backlog

- ⏸️ Search functionality (View 6)
- ⏸️ HeyD AI Assistant (View 7)
- ⏸️ Deep linking (shareable URLs per view)
- ⏸️ Analytics integration (privacy-first)
- ⏸️ View transition animations (beyond ghost typing)
- ⏸️ Project filtering by tech stack
- ⏸️ Dark mode auto-detection
- ⏸️ Progressive Web App (PWA) features

---

## Dependencies Matrix (Critical Path)

| Task       | Depends On         | Potential Blocker           | Mitigation Strategy                               |
|------------|--------------------|-----------------------------|---------------------------------------------------|
| PM-003     | PM-002             | User journeys unclear       | Prioritize journey mapping Week 1                 |
| PM-010-014 | PM-001, PM-003     | Content not ready           | Start content collection Day 1                    |
| PM-015     | PM-001, PM-010-014 | Content approval delays     | Parallel drafting + review process                |
| PM-016     | PM-015             | Asset procurement/creation  | Use placeholders, finalize in Week 7              |
| PM-034     | PM-011, PM-016     | Image interaction unclear   | User test early, have fallback (no interaction)   |
| PM-018     | PM-012             | GitHub API access           | Prepare static fallback data                      |
| PM-022     | All P0 tasks       | Features incomplete         | Can launch without P2 features                    |
| PM-024     | PM-022, PM-023     | QA finds critical bugs      | Buffer time in Week 13, cut P1 features if needed |
| PM-026     | PM-024, PM-025     | Beta testers unavailable    | Recruit testers early, have 15+ backups           |
| PM-028     | All P0 tasks       | Launch checklist incomplete | Daily standup Week 15, strict cutoff              |
| PM-030     | PM-028, PM-029     | Domain/hosting issues       | Configure domain/hosting Week 14                  |

---

## Sprint Breakdown (Agile Workflow)

### 🏃 Sprint 1: Foundation

**Goal:** Complete all discovery and interaction rules  
**Tasks:** PM-001, PM-002, PM-003, PM-004, PM-005, PM-006  
**Demo:** User journey maps + interaction prototypes

### 🏃 Sprint 2: Global Features & Views

**Goal:** Define Settings Drawer, themes, and all view requirements  
**Tasks:** PM-007, PM-008, PM-009, PM-010, PM-011, PM-012, PM-013, PM-014  
**Demo:** Complete view specifications + theme examples

### 🏃 Sprint 3: Content Production

**Goal:** All content written and assets created  
**Tasks:** PM-015, PM-035, PM-016, PM-034  
**Demo:** Real content in all views, ASCII avatar, optimized images

### 🏃 Sprint 4: System Design

**Goal:** Define all flows, states, and quality standards  
**Tasks:** PM-017, PM-018, PM-033, PM-032, PM-019  
**Demo:** Complete navigation flows + loading/error states

### 🏃 Sprint 5: Advanced Features (Optional)

**Goal:** Implement P2 features if time allows  
**Tasks:** PM-020, PM-021, PM-037  
**Demo:** Search + Assistant working (or skipped)

### 🏃 Sprint 6: Integration & Performance

**Goal:** Everything works together, meets performance targets  
**Tasks:** PM-022, PM-023  
**Demo:** Fully integrated product, performance audit results
---

## Command Dock Button Reference

| View                | Button 1 | Button 2 | Button 3 | Button 4 | Notes                                                    |
|---------------------|----------|----------|----------|----------|----------------------------------------------------------|
| **Home**            | PROJECTS | SKILLS   | ABOUT    | CAREER   | All primary sections                                     |
| **Projects List**   | < BACK   | SKILLS   | CAREER   | —        | Cross-nav to other sections                              |
| **Project Detail**  | < BACK   | LIVE     | NEXT >   | —        | LIVE only if demo exists; NEXT cycles or returns to list |
| **About**           | < BACK   | RESUME   | CONTACT  | —        | RESUME downloads PDF; CONTACT opens mailto:              |
| **Skills**          | < BACK   | PROJECTS | ABOUT    | —        | Cross-nav to related sections                            |
| **Career**          | < BACK   | RESUME   | LINKEDIN | —        | Resume + external LinkedIn link                          |
| **Settings Drawer** | —        | —        | —        | CLOSE    | Drawer has inline options, CLOSE dismisses               |
| **Search**          | —        | —        | —        | CLOSE    | Full-screen overlay, ESC or CLOSE dismisses              |
| **Assistant**       | —        | —        | —        | CLOSE    | Full-screen overlay, ESC or CLOSE dismisses              |

**Persistent:** [#] button in bottom-right corner of Command Dock on ALL views (except overlays)

---

**END OF ENHANCED BACKLOG**

*This document focuses on business requirements, user experience, and mobile view strategy. Technical implementation
details (frameworks, code architecture, CI/CD) should be documented separately by the development team.*