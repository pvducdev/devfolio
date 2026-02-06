Design Brief for the Mobile CLI of PVD Portfolio.

### **DESIGN BRIEF: The Tap-First Terminal**

**Core Concept:** A minimalist command-line interface optimized for touch. It eliminates the frustration of mobile
typing by using a context-aware **Command Dock** and **Macro Interactions**. The aesthetic is "Raw Shell"—pure
typography, black space, and no decorative UI chrome.

---

### **1. Global Interaction Rules**

* **The Command Dock:** A fixed bottom bar containing 3-4 large, monospace buttons. These replace the mobile keyboard.
* **Ghost Typing:** Tapping a button does not switch screens instantly. It triggers a script that *types* the command
  into the terminal prompt (e.g., `cd projects...`) character-by-character, then executes the view change.
* **Direct Manipulation:** Any listed item (files, directories) in the terminal output is tappable.
* **Smart Scroll:** Upon command execution, the viewport automatically scrolls so the latest output sits comfortably
  above the Command Dock.
* **The `[#]` Menu:** A persistent button in the bottom-right corner of the Command Dock. Tapping it opens a
  **Settings Drawer** that slides up from the bottom. Contains: Theme Switcher, Language Switcher, Search,
  Assistant (HeyD), and Repository link.

---

### **2. View Specifications & Wireframes**

#### **VIEW 1: The Home Shell (Landing)**

* **Purpose:** Navigation hub.
* **Content:** Minimal intro, directory listing.
* **Dock Actions:** `[ PROJECTS ]`, `[ SKILLS ]`, `[ ABOUT ]`, `[ CAREER ]`.

```text
.---------------------------------------.
|  Last login: 22:41:09 on ttys001      |
|                                       |
|  $ _                                  |
|                                       |
|  HI, I'M ALEX.                        |
|  FULL STACK DEV.                      |
|                                       |
|  Current Directory: ~/                |
|  .---------------------------------.  |
|  | > projects/                     |  |
|  | > skills/                       |  |
|  | > about_me/                     |  |
|  | > career/                       |  |
|  '---------------------------------'  |
|                                       |
|   (Select a directory to start)       |
|                                       |
|                                       |
|---------------------------------------|
| .--------. .--------. .------. .----. |
| |PROJECTS| | SKILLS | | ABOUT| |CAREER|
| '--------' '--------' '------' '----' |
|                                  [#]  |
'---------------------------------------'
```

#### **VIEW 2a: Projects List (Directory Listing)**

* **Purpose:** Browse and select a project.
* **Metaphor:** An `ls -la` style file listing. Each project is a tappable row.
* **Content:** Project name, short description, and stack summary per row.
* **Interaction:** Tapping a project row triggers Ghost Typing (`open projects/<name>`) and navigates to View 2b.
* **Dock Actions:** `[ < BACK ]`, `[ SKILLS ]`, `[ CAREER ]`.

```text
.---------------------------------------.
|  $ ls projects/                       |
|                                       |
|  > LISTING 3 ITEMS...                 |
|                                       |
|  .---------------------------------.  |
|  | 01  portfolio/                  |  |
|  |     TanStack Start, React 19   |  |
|  |                                |  |
|  | 02  ieltsy-bot/                |  |
|  |     NestJS, Telegraf, Groq     |  |
|  |                                |  |
|  | 03  daily-tech-bot/            |  |
|  |     Node.js, Redis, Vercel     |  |
|  '---------------------------------'  |
|                                       |
|   (Tap a project to open)            |
|                                       |
|---------------------------------------|
| .----------. .----------. .---------. |
| |  < BACK  | |  SKILLS  | |  CAREER | |
| '----------' '----------' '---------' |
|                                 [#]   |
'---------------------------------------'
```

#### **VIEW 2b: Project Detail (Reader Mode)**

* **Purpose:** Detailed case studies.
* **Interaction:** Tapping a project in the list clears the screen and renders the "Readme".
* **Content:** Block images (grayscale by default, color on touch), technical details, large headers.
* **Dock Actions:** `[ < BACK ]`, `[ LIVE ]`, `[ NEXT > ]`.

```text
.---------------------------------------.
|  $ open projects/fintech_app          |
|                                       |
|  # 01 FINTECH DASHBOARD               |
|  ----------------------               |
|                                       |
|  [     FULL WIDTH IMAGE BLOCK      ]  |
|                                       |
|  STACK: React Native, Node.js         |
|                                       |
|  DESCRIPTION:                         |
|  Real-time crypto trading platform    |
|  utilizing WebSockets for <50ms       |
|  data updates.                        |
|                                       |
|  > View Source Code (GitHub)          |
|                                       |
|---------------------------------------|
| .----------. .----------. .---------. |
| |  < BACK  | |   LIVE   | |  NEXT > | |
| '----------' '----------' '---------' |
|                                 [#]   |
'---------------------------------------'
```

#### **VIEW 3: About (Profile & Git Graph)**

* **Purpose:** Biography and activity proof.
* **Content:** ASCII/Pixelated Avatar, Bio text, social links, and a **Vertical GitHub Activity Matrix** (optimized for
  portrait screens).
* **Social Links:** LinkedIn, GitHub, GitLab, Email — rendered as tappable rows below the bio.
* **Dock Actions:** `[ < BACK ]`, `[ RESUME ]` (Triggers PDF download), `[ CONTACT ]` (Triggers `mailto:`).

```text
.---------------------------------------.
|  $ cat about_me.txt                   |
|                                       |
|  [ PHOTO ]  ALEX DEVELOPER            |
|             Loc: Hanoi, VN            |
|                                       |
|  BIO:                                 |
|  Specialized in scalable APIs and     |
|  minimalist interfaces.               |
|                                       |
|  # LINKS                              |
|  ------                               |
|  > LinkedIn                           |
|  > GitHub                             |
|  > GitLab                             |
|  > Email                              |
|                                       |
|  # GIT ACTIVITY (Last 30 Days)        |
|  -----------------------------        |
|  Status: Heavy Contribution           |
|                                       |
|     M  T  W  T  F  S  S               |
|  1  ░  ░  ▒  █  █  ▓  ░               |
|  2  █  █  █  ▒  ░  ░  ░               |
|  3  ▓  ▓  █  █  ▒  ▒  ░               |
|  4  █  █  ░  ░  ░  ░  ░               |
|                                       |
|  [Legend: ░ Low  ->  █ High]          |
|                                       |
|---------------------------------------|
| .----------. .----------. .---------. |
| |  < BACK  | |  RESUME  | | CONTACT | |
| '----------' '----------' '---------' |
|                                 [#]   |
'---------------------------------------'
```

#### **VIEW 4: Skills (System Monitor)**

* **Purpose:** Technical proficiency.
* **Style:** Styled like `top` or `htop` process viewer.
* **Content:** Skills listed as "processes" with active status or resource usage bars.
* **Dock Actions:** `[ < BACK ]`, `[ PROJECTS ]`, `[ ABOUT ]`.

```text
.---------------------------------------.
|  $ run skills_check.sh                |
|                                       |
|  > ANALYZING STACK... [OK]            |
|  > CPU LOAD: 12%  MEM: 40%            |
|                                       |
|  PID   SKILL        STATUS            |
|  -------------------------            |
|  101   Javascript   [ACTIVE]          |
|  102   React/Next   [ACTIVE]          |
|  103   Python       [IDLE  ]          |
|                                       |
|  # PROFICIENCY METRICS                |
|  ---------------------                |
|  [ Docker     ]  [#########.] 90%     |
|  [ AWS        ]  [######....] 60%     |
|  [ CI/CD      ]  [##########] 100%    |
|                                       |
|---------------------------------------|
| .----------. .----------. .---------. |
| |  < BACK  | | PROJECTS | |  ABOUT  | |
| '----------' '----------' '---------' |
|                                 [#]   |
'---------------------------------------'
```

#### **VIEW 5: Career (Timeline)**

* **Purpose:** Display professional journey chronologically.
* **Metaphor:** A **`git log --graph`** style visualization. The timeline is rendered as a vertical tree structure using
  ASCII characters (`|`, `*`, `o`).
* **Content:**
    * **Order:** Reverse Chronological (Current role at top) OR Chronological. *Design decision: Chronological (
      Education first -> Current last)* allows the user to follow the growth story naturally as they scroll down.
    * **Markers:**
        * `o` = Education (The root/init).
        * `+` = Part-time/Contract roles (Branching out).
        * `*` = Full-time roles (Major commits).
* **Dock Actions:** `[ < BACK ]`, `[ RESUME ]`, `[ LINKEDIN ]`.

```text
.---------------------------------------.
|  $ ./view_career.sh                   |
|                                       |
|  > LOADING TIMELINE...                |
|  > SORT: CHRONOLOGICAL                |
|                                       |
|  2018                                 |
|  o  EDUCATION                         |
|  |  BSc Computer Science              |
|  |  Hanoi University of S&T           |
|  |                                    |
|  |                                    |
|  2020                                 |
|  +  WEB INTERN (Part-Time)            |
|  |  Local Agency                      |
|  |  > HTML/CSS, Wordpress             |
|  |                                    |
|  |                                    |
|  2021                                 |
|  +  FREELANCE DEV (Part-Time)         |
|  |  Upwork / Remote                   |
|  |  > React UI Components             |
|  |                                    |
|  |                                    |
|  2022                                 |
|  *  JUNIOR DEV (Full-Time)            |
|  |  Fintech Startup VN                |
|  |  > Built KYC flow, Node.js         |
|  |                                    |
|  |                                    |
|  2024 - PRESENT                       |
|  *  SENIOR ENGINEER (Full-Time)       |
|     Global Outsourcing Co.            |
|     > Leading team of 5               |
|     > System Architecture             |
|                                       |
|  (End of log)                         |
|                                       |
|---------------------------------------|
| .----------. .----------. .---------. |
| |  < BACK  | |  RESUME  | | LINKEDIN| |
| '----------' '----------' '---------' |
|                                 [#]   |
'---------------------------------------'
```

---

### **3. The `[#]` Settings Drawer**

* **Purpose:** Centralized access to global features that don't need a dedicated view.
* **Trigger:** Tap the `[#]` button (present on every dock).
* **Behavior:** Slides up from the bottom as a half-screen drawer overlay.
* **Content:**

```text
.---------------------------------------.
|                                       |
|  (current view dimmed behind)         |
|                                       |
|---------------------------------------|
|  # SETTINGS                           |
|  ----------                           |
|                                       |
|  > Theme     : C x J               ▼ |
|  > Language   : EN                  ▼ |
|                                       |
|  ---                                  |
|                                       |
|  > Search...            (Tap to open) |
|  > HeyD Assistant       (Tap to open) |
|                                       |
|  ---                                  |
|                                       |
|  > GitHub Repo              ★ Stars   |
|  > v1.1.1                             |
|                                       |
|                          [ CLOSE ]    |
'---------------------------------------'
```

* **Theme Selector:** Tapping `Theme` expands inline to show 3 options (C x J, Mono, Notebook). Selection triggers
  Ghost Typing: `> theme --set mono`.
* **Language Selector:** Tapping `Language` toggles between EN / VI. Triggers Ghost Typing: `> lang --set vi`.
* **Search:** Opens a full-screen search overlay (see View 6).
* **HeyD Assistant:** Opens the assistant view (see View 7).
* **GitHub Repo:** External link to the repository.
* **Version:** Displays current app version.

---

### **4. Overlay Views**

#### **VIEW 6: Search (Command Palette)**

* **Purpose:** Quick navigation across all content.
* **Trigger:** Opened from the `[#]` Settings Drawer.
* **Behavior:** Full-screen overlay with a text input at the top. This is one of the few views that activates the
  mobile keyboard.
* **Content:** Fuzzy search results grouped by category (Pages, Skills, Career). Tapping a result navigates to the
  relevant view.

```text
.---------------------------------------.
|  $ grep -r "___"                      |
|                                       |
|  [  Type to search...             ]   |
|                                       |
|  # PAGES                              |
|  > About                              |
|  > Skills                             |
|  > Career                             |
|                                       |
|  # SKILLS                             |
|  > React / Next.js                    |
|  > Docker                             |
|  > TypeScript                         |
|                                       |
|  # CAREER                             |
|  > Senior Engineer - KOVA Paint       |
|  > Frontend Collaborator - SIV        |
|                                       |
|                          [ CLOSE ]    |
'---------------------------------------'
```

#### **VIEW 7: HeyD Assistant (Chat)**

* **Purpose:** AI-powered conversational assistant for portfolio Q&A.
* **Trigger:** Opened from the `[#]` Settings Drawer.
* **Behavior:** Full-screen overlay. Chat interface with streaming responses. The input activates the mobile keyboard.
* **Features:** Slash commands (`/help`, `/clear`, `/theme`, `/feedback`), suggestion chips on fresh load, streaming
  markdown responses.

```text
.---------------------------------------.
|  $ ./heyd --interactive               |
|                                       |
|  HEYD v1.0                            |
|  Your dev assistant. Type anything.   |
|                                       |
|  .---------------------------------.  |
|  | Suggestions:                    |  |
|  | > "What's your stack?"         |  |
|  | > "Tell me about yourself"     |  |
|  | > "Latest project?"            |  |
|  '---------------------------------'  |
|                                       |
|  USER: What's your stack?             |
|                                       |
|  HEYD: I primarily work with React,   |
|  TypeScript, and Node.js. For SSR     |
|  I use TanStack Start and Next.js...  |
|  > typing...                          |
|                                       |
|---------------------------------------|
|  [  Type a message...          ] [>]  |
'---------------------------------------'
```
