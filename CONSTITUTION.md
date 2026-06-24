# 🎭 Playwright Learning Path — Project Constitution v2.0 (SDD)

> **Document Type:** Software Design Document / Constitution
> **Governs:** All future feature and page generation for the Playwright Tutorial project
> **Self-Sufficient:** ✅ Yes — all design system, components, and CSS live in this repo (Appendices A–D)
> **Status:** 📋 Awaiting Approval

---

## 1. Project Identity

| Key | Value |
|-----|-------|
| **Name** | `playwright-learning-path` |
| **Directory** | `d:\my-world\wright-age\playwright-age\` |
| **Description** | Interactive Playwright tutorial SPA — beginner to senior level |
| **Stack** | React 19 + Vite 8 + TypeScript 6 + Zustand 5 + react-router-dom 7 |
| **Architecture** | Clean Architecture (3-layer) + SOLID Principles |
| **Design System** | Self-contained in `src/styles/styles.css` + shared components |
| **Deployment** | GitHub Pages via `gh-pages` (HashRouter) |
| **Subject** | Playwright End-to-End Testing Framework |
| **Brand Icon** | `PW` (replaces `TS`) |
| **Theme Color** | `#2EAD33` (Playwright green) |
| **Playground** | Deferred — no Monaco editor initially |
| **PWA** | Skipped — not needed for tutorial site |
| **Estimated Topics** | ~25-30 topics across 7 phases |

---

## 2. Architecture Overview

Dependencies flow **inward only** — presentation → data → core.

```
src/
├── core/               ← Domain: Entities + Use Cases (ZERO React/UI)
│   ├── entities/        ← Topic, Question, UserProgress, QuizResult
│   ├── repositories/    ← IQuizRepository, IProgressRepository, IThemeRepository
│   └── use-cases/       ← GetQuizQuestionsUseCase, SubmitQuizAnswerUseCase, ToggleTopicCompleteUseCase
├── data/               ← Infrastructure: Concrete repos + static data + DI
│   ├── di/              ← container.ts (single composition root)
│   ├── repositories/    ← LocalStorageProgressRepo, LocalStorageThemeRepo, StaticQuizRepository
│   └── static/          ← topics.ts, quiz-data.ts
└── presentation/       ← UI: React components, pages, stores
    ├── components/
    │   ├── content/     ← ConceptSection, CodeCard, NoteCallout
    │   ├── layout/      ← TopBar, Sidebar, PageLayout, Footer, SkipLink
    │   ├── navigation/  ← FloatingTopicNav, ProgressTracker
    │   └── quiz/        ← QuizSection, QuizCard
    ├── hooks/           ← useFocusTrap
    ├── pages/           ← HomePage, TopicPage
    ├── store/           ← progressStore, themeStore, sidebarContext
    └── utils/           ← enhanceCodeBlocks
```

### 2.1 SOLID Principles

| Principle | Concrete Implementation |
|-----------|------------------------|
| **S** — Single Responsibility | `TopicPage` only orchestrates topic rendering. `QuizCard` only handles one question. Each use case does one thing. |
| **O** — Open/Closed | New topics = add to `topics.ts` + `quiz-data.ts` + HTML file. **Zero** changes to components. |
| **L** — Liskov Substitution | All repos implement interfaces. `LocalStorageProgressRepo` can be swapped for `IndexedDBProgressRepo` seamlessly. |
| **I** — Interface Segregation | `IQuizRepository` (quiz only), `IProgressRepository` (progress only), `IThemeRepository` (theme only). |
| **D** — Dependency Inversion | Core depends on abstractions. Data provides implementations. Wired in `container.ts`. |

---

## 3. Design System

### 3.1 CSS Architecture

**One file rules all:** `src/styles/styles.css` (~3000 lines)
- Playwright-branded design system (see Section 9 for token values)
- No CSS modules, no Tailwind, no CSS-in-JS
- CSS variables for all colors, fonts, spacing
- Dark mode via `[data-theme="dark"]` selector
- Responsive breakpoints at 768px and 430px

### 3.2 Design Tokens

```css
:root {
  --bg:#fafaf9; --surface:#f2f2ef; --surface2:#e8e8e4; --border:#d4d4c8;
  --ink:#1c1c1a; --ink2:#4a4a44; --ink3:#8a8a80;
  --blue:#1d4ed8;  --blue-bg:#eff6ff;  --blue-border:#bfdbfe;
  --teal:#0f766e;  --teal-bg:#f0fdfa;  --teal-border:#99f6e4;
  --violet:#6d28d9; --violet-bg:#f5f3ff; --violet-border:#ddd6fe;
  --green:#15803d;  --green-bg:#f0fdf4;  --green-border:#bbf7d0;
  --amber:#b45309;  --amber-bg:#fffbeb;  --amber-border:#fde68a;
  --red:#b91c1c;    --red-bg:#fef2f2;   --red-border:#fecaca;
  --serif:'Playfair Display',Georgia,serif;
  --sans:'IBM Plex Sans',system-ui,sans-serif;
  --mono:'IBM Plex Mono',monospace;
  --code-font:'JetBrains Mono','JetBrainsMono Nerd Font Mono',var(--mono);
  --card-bg:#fff;
}
```

### 3.3 CSS Class Map (Section → Purpose)

| CSS Section | Key Classes | Purpose |
|-------------|-------------|---------|
| Top Bar | `#topbar`, `.tb-brand`, `.tb-brand-icon`, `.tb-back`, `.tb-topic-title`, `.tb-theme-btn` | Fixed header navigation |
| Layout | `.page-wrap`, `.wrap`, `nav`, `.content` | Grid: 220px sidebar + fluid content |
| Hero | `.hero`, `.hero-tags`, `.hero-tag`, `.hero-stats`, `.stat-n`, `.stat-l` | Dark banner at top of topic pages |
| Sections | `.sec`, `.sec-label`, `.sec h2` | Content sections with label + title |
| Cards | `.card`, `.card-head`, `.card-body`, `.card-num`, `.card-badge`, `.ph1-card`...`.ph5-card` | Numbered code examples |
| Callouts | `.note`, `.note-info`, `.note-warn`, `.note-tip`, `.note-i` | Info/warning/tip boxes |
| Code | `pre`, `code`, `.code-frame`, `.code-toolbar`, `.code-copy`, `.tok-*` | Syntax-highlighted code blocks |
| Pills | `.p`, `.p-blue`, `.p-teal`, `.p-violet`, `.p-green`, `.p-amber` | Inline tag pills |
| Tables | `table`, `th`, `td`, `.bordered` | Data tables |
| Topic Grid | `.topic-grid`, `.topic-card`, `.tc-num`, `.tc-title`, `.tc-desc`, `.tc-tags`, `.theme-*` | Homepage card grid |
| Quiz | `.quiz-sec`, `.quiz-card`, `.quiz-q`, `.quiz-opts`, `.quiz-opt`, `.quiz-fb`, `.quiz-correct`, `.quiz-wrong` | Self-test section |
| Progress | `.pg-tracker`, `.pg-label`, `.pg-done` | Completion tracking |
| Nav | `.pn-nav`, `.pn-link`, `.floating-nav-btn` | Previous/Next navigation |
| Footer | `.app-footer`, `.footer-content`, `.footer-copyright` | Page footer |
| Loader | `.page-loader-container`, `.spinner-ring` | Loading spinner |
| Animations | `.animate-page-enter`, `@keyframes pageEnter` | Page transitions |
| Accessibility | `.skip-link`, `.visually-hidden` | Screen reader support |

### 3.4 Typography

| Usage | Font | Weights | Package |
|-------|------|---------|---------|
| Body | IBM Plex Sans | 400, 400i, 600 | `@fontsource/ibm-plex-sans` |
| Headings | Playfair Display | 700, 400i | `@fontsource/playfair-display` |
| Inline code | IBM Plex Mono | 400, 500 | `@fontsource/ibm-plex-mono` |
| Code blocks | JetBrains Mono | 400, 500 | `@fontsource/jetbrains-mono` |

### 3.5 Phase Colors

| Phase | Card Class | Border Color | Num BG/Color |
|-------|-----------|-------------|--------------|
| 1 - Setup | `.ph1-card` / `.theme-blue` | `var(--blue)` | `var(--blue-bg)` / `var(--blue)` |
| 2 - Core | `.ph2-card` / `.theme-teal` | `var(--teal)` | `var(--teal-bg)` / `var(--teal)` |
| 3 - Intermediate | `.ph3-card` / `.theme-violet` | `var(--violet)` | `var(--violet-bg)` / `var(--violet)` |
| 4 - Advanced | `.ph4-card` / `.theme-green` | `var(--green)` | `var(--green-bg)` / `var(--green)` |
| 5 - Pro | `.ph5-card` / `.theme-amber` | `var(--amber)` | `var(--amber-bg)` / `var(--amber)` |

---

## 4. Routing

```tsx
<HashRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route element={<PageLayout />}>
      <Route path="/pages/:topicFile" element={<TopicPage />} />
    </Route>
  </Routes>
</HashRouter>
```

All pages **lazy-loaded** via `React.lazy()` + `<Suspense>`.

---

## 5. State Management

| Store | Tool | Persisted | Purpose |
|-------|------|-----------|---------|
| `progressStore` | Zustand | localStorage (`pw-learning-progress`) | Completed topics |
| `themeStore` | Zustand | localStorage (`pw-theme`) | Dark/light mode |
| `sidebarContext` | React Context | No | Dynamic sidebar links |

---

## 6. Content Delivery

### Path A — HTML Fetch (Primary)
`TopicPage` fetches `/content/{slug}.html` → parses with DOMParser → extracts hero, content, nav links → renders with `dangerouslySetInnerHTML` → enhances code blocks.

### Path B — React Migration (Optional)
Create `topic-content/{Name}Content.tsx` using `ConceptSection`, `CodeCard`, `NoteCallout` → register in `TopicPage.tsx`.

---

## 7. Speckit Protocol (How to Add a Topic)

### Step 1: Create `public/content/{slug}.html`

Follow the golden topic structure in **Appendix C** exactly.

### Step 2: Register in `src/data/static/topics.ts`

```typescript
{ file: 'slug.html', title: 'Title', number: '1', category: 'Category',
  desc: 'Description.', tags: [
    { label: 'tag', color: 'var(--blue)', bg: 'var(--blue-bg)' },
  ]
},
```

### Step 3: Add quiz to `src/data/static/quiz-data.ts`

```typescript
'slug.html': [
  { section: 'id', question: 'Q?', options: ['A','B','C','D'],
    answerIndex: 0, explanation: 'Because...' },
  // Cover EVERY teachable section — minimum 1 question per section id.
  // Add 2+ questions where a section is dense. No upper cap; maximize coverage.
],
```

### Step 4: Create `practice/{##}-{slug}.ts` (optional)

### Step 5: Verify

- [ ] HTML file created with correct hero, nav, sections
- [ ] Topic registered in topics.ts with 3-5 tags
- [ ] Quiz questions with section IDs matching HTML — **maximize coverage** (≥1 per teachable section, more when dense)
- [ ] Real-life analogies before every code example
- [ ] ⚠ Common Mistakes (min 3, ❌/✅ pattern)
- [ ] Cheatsheet at bottom
- [ ] Simple language, relatable variable names
- [ ] All nav `<a href>` match section `id`s

---

## 8. Content Style Rules

### Language
- **DON'T:** "Locators are resilient, auto-waiting, ARIA-compliant element selectors."
- **DO:** "A locator is like a **GPS address** for elements on a web page."

### Required Sections per Topic

| Section | Emoji | Required? |
|---------|-------|-----------|
| What is it? | 🎯 | ✅ |
| Real-Life Example | 🏪 | ✅ |
| Code Example | 💻 | ✅ |
| Common Mistakes (≥3) | ⚠️ | ✅ |
| Quick Tip | ✅ | ✅ |
| Comparison Table | 📊 | When comparing |
| Cheatsheet | 📝 | ✅ |

### Playwright Code Standards

| Rule | ❌ Avoid | ✅ Use |
|------|---------|--------|
| Selectors | `page.$('.btn')` | `page.getByRole('button', { name: 'Submit' })` |
| Assertions | Manual `if` checks | `await expect(locator).toBeVisible()` |
| Waits | `page.waitForTimeout(5000)` | Auto-waiting via locators |
| Imports | `require(...)` | `import { test, expect } from '@playwright/test'` |
| Structure | Flat test functions | `test.describe` + `beforeEach` |

---

## 9. Branding Diff (TS → PW)

| Location | Find | Replace |
|----------|------|---------|
| TopBar icon text | `TS` | `PW` |
| TopBar brand name | `TypeScript Learning Path` | `Playwright Learning Path` |
| TopBar brand sub | `Interactive Handbook` | `E2E Testing Guide` |
| Code toolbar lang label | `TypeScript` | `Playwright` |
| Theme color meta | `#3178C6` | `#2EAD33` |
| localStorage keys | `ts-learning-progress`, `ts-theme` | `pw-learning-progress`, `pw-theme` |
| Footer credits | `TypeScript Learning Path — Interactive Handbook & Quizzes` | `Playwright Learning Path — E2E Testing Guide & Quizzes` |
| Hero radial gradient | `rgba(29,78,216,.25)` | `rgba(46,173,51,.25)` |
| Sidebar active border | `var(--blue)` | `var(--green)` |
| Nav logo badge bg | `var(--blue)` | `var(--green)` |
| Meta description | TypeScript curriculum... | Playwright tutorial... |
| Meta keywords | TypeScript, JavaScript | Playwright, E2E Testing, Automation |

---

## 10. Dependencies (package.json)

```json
{
  "name": "playwright-learning-path",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    "format": "prettier --write **/*.{js,ts,tsx,jsx,json,css,md,html,mdx}"
  },
  "dependencies": {
    "@fontsource/ibm-plex-mono": "^5.2.7",
    "@fontsource/ibm-plex-sans": "^5.2.8",
    "@fontsource/jetbrains-mono": "^5.2.8",
    "@fontsource/playfair-display": "^5.2.8",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-router-dom": "^7.14.2",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@playwright/test": "^1.60.0",
    "@types/node": "^24.12.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "gh-pages": "^6.3.0",
    "globals": "^17.5.0",
    "jsdom": "^29.1.1",
    "prettier": "^3.8.4",
    "tsx": "^4.21.0",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.58.2",
    "vite": "^8.0.10",
    "vitest": "^4.1.8"
  }
}
```

---

## 11. Curriculum Phases (Playwright)

| Phase | Color | Focus | Example Topics |
|-------|-------|-------|---------------|
| 🟢 Phase 1 | Blue | Setup & First Test | Install, Config, First Test, Test Runner |
| 🟡 Phase 2 | Teal | Locators & Selectors | getByRole, getByText, CSS/XPath, Chaining |
| 🟠 Phase 3 | Violet | Actions & Interactions | Click, Fill, Select, Keyboard, Mouse, Drag |
| 🔵 Phase 4 | Green | Assertions & Waiting | expect API, Auto-waiting, Timeouts, Retry |
| 🟣 Phase 5 | Amber | Architecture | Page Objects, Fixtures, Test Organization |
| 🔴 Phase 6 | Red | Advanced | Network Mocking, API Testing, Visual Regression |
| ⚫ Phase 7 | — | Production | CI/CD, Reporting, Debugging, Best Practices |

---

## 12. Ordering Rules

1. **No forward references** — never use POM before it's taught
2. **Preview note** — `// "..." explained fully in Topic N`
3. **Deep-dive note** — "Builds on Topic X."
4. **Progressive disclosure** OK — locators intro'd in Topic 1, expanded in Topic 5

---

## 13. Bootstrap Sequence

1. Init Vite+React+TS in `playwright-age/`
2. Install all deps from Section 10
3. Ensure `src/styles/styles.css` is present with Playwright branding (Section 9)
4. Create all core entities + interfaces (Appendix B)
5. Create all data repos + DI container (Appendix B)
6. Create all stores + context (Appendix B)
7. Create all shared components (Appendix A)
8. Create `App.tsx`, `main.tsx`, `HomePage.tsx`, `TopicPage.tsx`
9. Create empty `topics.ts` + `quiz-data.ts`
10. Create golden topic as Topic 1 (Appendix C)
11. Verify `npm run dev` + `npm run build`

---

## 14. Testing

| Level | Tool | Dir | Targets |
|-------|------|-----|---------|
| Unit | Vitest | `src/**/*.test.ts` | Use cases, entities |
| E2E | Playwright | `e2e/*.spec.ts` | Full user flows |

---

## Appendix A — Component Code Templates

> [!IMPORTANT]
> These are the **exact component signatures and implementations** used in the project, with Playwright branding applied.

### A.1 ConceptSection
```tsx
// src/presentation/components/content/ConceptSection.tsx
import type { ReactNode } from 'react';
interface ConceptSectionProps { id: string; label: string; title: string; children: ReactNode; }
export function ConceptSection({ id, label, title, children }: Readonly<ConceptSectionProps>) {
  return (<div className="sec" id={id}><div className="sec-label">{label}</div><h2>{title}</h2>{children}</div>);
}
```

### A.2 CodeCard
```tsx
// src/presentation/components/content/CodeCard.tsx
import type { ReactNode } from 'react';
interface CodeCardProps { number?: string | number; title: string; badge?: string; badgeColorClass?: 'ph1-card'|'ph2-card'|'ph3-card'|'ph4-card'|'ph5-card'; children: ReactNode; }
export function CodeCard({ number, title, badge, badgeColorClass = 'ph1-card', children }: Readonly<CodeCardProps>) {
  return (<div className={`card ${badgeColorClass}`}><div className="card-head">{number && <div className="card-num">{number}</div>}<div className="card-title">{title}</div>{badge && <span className="card-badge">{badge}</span>}</div><div className="card-body">{children}</div></div>);
}
```

### A.3 NoteCallout
```tsx
// src/presentation/components/content/NoteCallout.tsx
import type { ReactNode } from 'react';
type NoteType = 'tip' | 'info' | 'warn';
interface NoteCalloutProps { type: NoteType; children: ReactNode; icon?: string; }
export function NoteCallout({ type, children, icon }: Readonly<NoteCalloutProps>) {
  const iconMap: Record<NoteType, string> = { tip: '✓', info: 'i', warn: '⚠' };
  return (<div className={`note note-${type}`}><span className="note-i">{icon || iconMap[type]}</span><p>{children}</p></div>);
}
```

### A.4 PageLayout
```tsx
// src/presentation/components/layout/PageLayout.tsx
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { FloatingTopicNav } from '../navigation/FloatingTopicNav';

export function PageLayout() {
  const location = useLocation();
  const topicFile = location.pathname.startsWith('/pages/') ? location.pathname.split('/').pop() : undefined;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <TopBar mode="topic" onToggleSidebar={() => setIsSidebarOpen(p => !p)} topicNavFile={topicFile} />
      {isSidebarOpen && <button className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar" style={{ border:'none',padding:0,cursor:'pointer',outline:'none' }} />}
      <div className="page-wrap"><div className="wrap">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main id="main-content" className="content animate-page-enter" key={location.pathname}><Outlet /><Footer /></main>
      </div></div>
      {topicFile && <FloatingTopicNav currentFile={topicFile} />}
    </>
  );
}
```

### A.5 SkipLink
```tsx
// src/presentation/components/layout/SkipLink.tsx
export function SkipLink() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (!main) return;
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return <a href="#main-content" className="skip-link" onClick={handleClick}>Skip to main content</a>;
}
```

### A.6 ProgressTracker
```tsx
// src/presentation/components/navigation/ProgressTracker.tsx
import { useProgressStore } from '../../store/progressStore';
interface Props { topicFile: string; }
export function ProgressTracker({ topicFile }: Readonly<Props>) {
  const { progress, toggleComplete } = useProgressStore();
  const isComplete = !!progress.completedTopics[topicFile];
  return (
    <div className="pg-tracker"><label className={`pg-label ${isComplete ? 'pg-done' : ''}`}>
      <input type="checkbox" className="pg-check" checked={isComplete} onChange={e => toggleComplete(topicFile, e.target.checked)} />
      <span className="pg-icon">{isComplete ? '✅' : '☐'}</span>
      <span className="pg-text">{isComplete ? 'Completed!' : 'Mark as completed'}</span>
    </label></div>
  );
}
```

> [!NOTE]
> Full implementations for **TopBar**, **Sidebar**, **Footer**, **QuizSection**, **QuizCard**, **FloatingTopicNav**, **useFocusTrap**, and **enhanceCodeBlocks** live in `src/presentation/`. Rebrand per the diff table in Section 9 when forking.

---

## Appendix B — Core + Data Layer Code

### B.1 Entities

```typescript
// src/core/entities/Topic.ts
export interface TopicTag { label: string; color: string; bg: string; }
export interface Topic {
  readonly file: string; readonly title: string; readonly number: string;
  readonly category?: string; readonly desc?: string; readonly tags?: TopicTag[];
}

// src/core/entities/Question.ts
export interface Question {
  readonly section: string; readonly question: string;
  readonly options: readonly string[]; readonly answerIndex: number; readonly explanation: string;
}

// src/core/entities/UserProgress.ts
export interface UserProgress { readonly completedTopics: Record<string, number>; }

// src/core/entities/QuizResult.ts
export interface QuizResult {
  readonly topicFile: string; readonly score: number; readonly total: number; readonly answeredAt: number;
}
```

### B.2 Repository Interfaces

```typescript
// src/core/repositories/IQuizRepository.ts
import type { Question } from '../entities/Question';
export interface IQuizRepository { getQuestionsForTopic(topicFile: string): Question[]; }

// src/core/repositories/IProgressRepository.ts
import type { UserProgress } from '../entities/UserProgress';
export interface IProgressRepository {
  getProgress(): UserProgress; markComplete(topicFile: string): void; markIncomplete(topicFile: string): void;
}

// src/core/repositories/IThemeRepository.ts
export interface IThemeRepository { getTheme(): 'dark' | 'light'; setTheme(theme: 'dark' | 'light'): void; }
```

### B.3 Use Cases

```typescript
// src/core/use-cases/GetQuizQuestionsUseCase.ts
import type { IQuizRepository } from '../repositories/IQuizRepository';
import type { Question } from '../entities/Question';
export class GetQuizQuestionsUseCase {
  constructor(private readonly quizRepo: IQuizRepository) {}
  execute(topicFile: string): Question[] { return this.quizRepo.getQuestionsForTopic(topicFile); }
}

// src/core/use-cases/SubmitQuizAnswerUseCase.ts
import type { Question } from '../entities/Question';
export class SubmitQuizAnswerUseCase {
  execute(question: Question, selectedIndex: number): boolean { return question.answerIndex === selectedIndex; }
}

// src/core/use-cases/ToggleTopicCompleteUseCase.ts
import type { IProgressRepository } from '../repositories/IProgressRepository';
export class ToggleTopicCompleteUseCase {
  constructor(private readonly progressRepo: IProgressRepository) {}
  markComplete(topicFile: string): void { this.progressRepo.markComplete(topicFile); }
  markIncomplete(topicFile: string): void { this.progressRepo.markIncomplete(topicFile); }
}
```

### B.4 Data Repositories

```typescript
// src/data/repositories/StaticQuizRepository.ts
import type { IQuizRepository } from '../../core/repositories/IQuizRepository';
import type { Question } from '../../core/entities/Question';
import { quizData } from '../static/quiz-data';
export class StaticQuizRepository implements IQuizRepository {
  getQuestionsForTopic(topicFile: string): Question[] { return quizData[topicFile] || []; }
}

// src/data/repositories/LocalStorageProgressRepo.ts
import type { IProgressRepository } from '../../core/repositories/IProgressRepository';
import type { UserProgress } from '../../core/entities/UserProgress';
const STORAGE_KEY = 'pw-learning-progress';
export class LocalStorageProgressRepo implements IProgressRepository {
  getProgress(): UserProgress {
    try { const d = localStorage.getItem(STORAGE_KEY); return { completedTopics: d ? JSON.parse(d) : {} }; }
    catch { return { completedTopics: {} }; }
  }
  markComplete(topicFile: string): void { const p = this.getProgress(); p.completedTopics[topicFile] = Date.now(); this.save(p); }
  markIncomplete(topicFile: string): void { const p = this.getProgress(); delete p.completedTopics[topicFile]; this.save(p); }
  private save(p: UserProgress): void { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p.completedTopics)); } catch {} }
}

// src/data/repositories/LocalStorageThemeRepo.ts
import type { IThemeRepository } from '../../core/repositories/IThemeRepository';
const THEME_KEY = 'pw-theme';
export class LocalStorageThemeRepo implements IThemeRepository {
  getTheme(): 'dark' | 'light' {
    try { const t = localStorage.getItem(THEME_KEY); return t === 'dark' || t === 'light' ? t : 'dark'; }
    catch { return 'dark'; }
  }
  setTheme(theme: 'dark' | 'light'): void { try { localStorage.setItem(THEME_KEY, theme); } catch {} }
}
```

### B.5 DI Container

```typescript
// src/data/di/container.ts
import { StaticQuizRepository } from '../repositories/StaticQuizRepository';
import { LocalStorageProgressRepo } from '../repositories/LocalStorageProgressRepo';
import { LocalStorageThemeRepo } from '../repositories/LocalStorageThemeRepo';
import { GetQuizQuestionsUseCase } from '../../core/use-cases/GetQuizQuestionsUseCase';
import { SubmitQuizAnswerUseCase } from '../../core/use-cases/SubmitQuizAnswerUseCase';
import { ToggleTopicCompleteUseCase } from '../../core/use-cases/ToggleTopicCompleteUseCase';

const quizRepo = new StaticQuizRepository();
const progressRepo = new LocalStorageProgressRepo();
const themeRepo = new LocalStorageThemeRepo();

export const getQuizQuestionsUseCase = new GetQuizQuestionsUseCase(quizRepo);
export const submitQuizAnswerUseCase = new SubmitQuizAnswerUseCase();
export const toggleTopicCompleteUseCase = new ToggleTopicCompleteUseCase(progressRepo);
export const themeRepository = themeRepo;
export const progressRepository = progressRepo;
```

### B.6 Zustand Stores

```typescript
// src/presentation/store/progressStore.ts
import { create } from 'zustand';
import { progressRepository, toggleTopicCompleteUseCase } from '../../data/di/container';
import type { UserProgress } from '../../core/entities/UserProgress';
interface ProgressState { progress: UserProgress; toggleComplete: (topicFile: string, isComplete: boolean) => void; }
export const useProgressStore = create<ProgressState>((set) => ({
  progress: progressRepository.getProgress(),
  toggleComplete: (topicFile, isComplete) => {
    if (isComplete) toggleTopicCompleteUseCase.markComplete(topicFile);
    else toggleTopicCompleteUseCase.markIncomplete(topicFile);
    set({ progress: progressRepository.getProgress() });
  },
}));

// src/presentation/store/themeStore.ts
import { create } from 'zustand';
import { themeRepository } from '../../data/di/container';
interface ThemeState { theme: 'dark' | 'light'; toggleTheme: () => void; }
export const useThemeStore = create<ThemeState>((set) => {
  const initialTheme = themeRepository.getTheme();
  document.documentElement.dataset.theme = initialTheme;
  return {
    theme: initialTheme,
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      themeRepository.setTheme(newTheme);
      document.documentElement.dataset.theme = newTheme;
      return { theme: newTheme };
    }),
  };
});

// src/presentation/store/sidebarContext.tsx
import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
interface SidebarSection { href: string; label: string; isGroup?: boolean; }
interface SidebarContextValue { sections: SidebarSection[]; setSections: (s: SidebarSection[]) => void; }
const SidebarContext = createContext<SidebarContextValue>({ sections: [], setSections: () => {} });
export function SidebarProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [sections, setSections] = useState<SidebarSection[]>([]);
  const value = useMemo(() => ({ sections, setSections }), [sections]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
export function useSidebar() { return useContext(SidebarContext); }
```

---

## Appendix C — Golden Topic Example

> [!TIP]
> This is the **canonical reference implementation**. Every future topic must follow this structure exactly.

### C.1 topics.ts Entry

```typescript
{ file: 'pw-getting-started.html', title: 'Getting Started', number: '1', category: 'Setup',
  desc: 'Install Playwright, write your first test, run it, and understand the project structure — with real-life analogies.',
  tags: [
    { label: 'Install', color: 'var(--blue)', bg: 'var(--blue-bg)' },
    { label: 'First Test', color: 'var(--green)', bg: 'var(--green-bg)' },
    { label: 'npx', color: 'var(--teal)', bg: 'var(--teal-bg)' },
    { label: 'Config', color: 'var(--violet)', bg: 'var(--violet-bg)' },
  ],
},
```

### C.2 quiz-data.ts Entry

> **Quiz policy:** Cover every teachable `section` id in the HTML — minimum 1 question each; add 2+ for dense sections. No maximum cap.

```typescript
'pw-setup-first-test.html': [
  { section: 'sf-install', question: 'Which command initializes a new Playwright project?',
    options: ['npm install playwright', 'npx playwright install', 'npm init playwright@latest', 'npx create-playwright'],
    answerIndex: 2, explanation: '<code>npm init playwright@latest</code> scaffolds a full project with config, example test, and browser binaries.' },
  // ... one or more questions per section id (sf-prerequisites, sf-browsers, sf-run, etc.)
],
```

### C.3 HTML Content File Structure

```html
<!-- public/content/pw-getting-started.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Getting Started — Playwright Learning Path</title>
  <meta name="description" content="Install Playwright, write your first test, and understand project structure." />
</head>
<body>
  <div id="topbar">
    <div class="tb-brand"><div class="tb-brand-icon">PW</div>
      <div><div class="tb-brand-name">Playwright Learning Path</div><div class="tb-brand-sub">E2E Testing Guide</div></div>
    </div>
    <a class="tb-back" href="../index.html">← Back to Index</a>
    <div class="tb-topic-title">Getting Started</div>
  </div>

  <div class="page-wrap"><div class="wrap">
    <nav id="nav-getting-started">
      <div class="nav-logo"><div class="v">Setup</div><h2>Getting Started</h2></div>
      <div class="nav-group">Basics</div>
      <a href="#gs-what">What is Playwright?</a>
      <a href="#gs-install">Installation</a>
      <div class="nav-group">Your First Test</div>
      <a href="#gs-first-test">Writing a Test</a>
      <a href="#gs-run">Running Tests</a>
      <div class="nav-group">Project</div>
      <a href="#gs-structure">Project Structure</a>
      <a href="#gs-config">Configuration</a>
      <div class="nav-group">Watch Out!</div>
      <a href="#gs-mistakes">⚠ Common Mistakes</a>
      <div class="nav-group">Reference</div>
      <a href="#gs-cheatsheet">Cheatsheet</a>
    </nav>

    <div class="content">
      <div class="hero" id="gs-top">
        <div class="hero-tags">
          <span class="hero-tag">Playwright</span>
          <span class="hero-tag">Getting Started</span>
          <span class="hero-tag">First Test</span>
        </div>
        <h1>Getting <span>Started</span></h1>
        <p>Everything you need to install Playwright, write your first test, and understand the project.</p>
        <div class="hero-stats">
          <div class="stat"><div class="stat-n">5</div><div class="stat-l">Concepts</div></div>
          <div class="stat"><div class="stat-n">3</div><div class="stat-l">Commands</div></div>
        </div>
      </div>

      <!-- Sections follow the .sec pattern with .card, .note, pre>code blocks -->
      <!-- Each section has id matching nav anchors -->
      <!-- Last section is always #gs-cheatsheet -->
    </div>
  </div></div>
</body>
</html>
```

---

## Appendix D — CSS Organization Reference

The `styles.css` file is organized in this exact order:

| Line Range | Section | Key Classes |
|-----------|---------|-------------|
| 1–65 | Design Tokens + Reset | `:root`, `[data-theme="dark"]`, `*` |
| 67–162 | Top Bar | `#topbar`, `.tb-*` |
| 164–350 | Layout + Content + Code | `.page-wrap`, `.wrap`, `nav`, `.sec`, `pre`, `.code-frame` |
| 351–480 | Home Page | `.home-container`, `.home-wrap`, `.home-roadmap-btn` |
| 481–1070 | Roadmap Modal | `.roadmap-modal`, `.rm-*` |
| 1071–1435 | Code Toggle + Mobile Modal | `.rm-code-*`, `@media` |
| 1438–1610 | Topic Cards | `.topic-grid`, `.topic-card`, `.tc-*`, `.theme-*` |
| 1610–1680 | Score Grid + Prev/Next + Progress + Theme | `.sgrid`, `.pn-*`, `.pg-*`, `.tb-theme-btn` |
| 1681–1833 | Quiz | `.quiz-*` |
| 1834–1930 | Mobile Responsive | `@media (max-width: 768px)` |
| 1931–2020 | Page Loader + Animations | `.page-loader-*`, `@keyframes` |
| 2020–2120 | Footer | `.app-footer`, `.footer-*` |
| 2121–2810 | Playground | `.playground-*`, `.console-*`, `.btn` |
| 2811–2970 | Milestone Tabs + Accessibility + Toast | `.rm-tab-*`, `.skip-link`, `.toast` |
| 2972–3081 | Practice Panel + Editor Overlay | `.practice-*`, `.editor-loading-overlay` |

> [!CAUTION]
> This appendix + `src/styles/styles.css` is the **only** CSS reference for the project.
