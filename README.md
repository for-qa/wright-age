# 🎭 Playwright Learning Path

A comprehensive, beginner-to-senior Playwright curriculum built as a static site. Every topic is explained with **simple language**, **real-life analogies**, and **practical test examples** to make E2E testing intuitive and easy to grasp.

---

## ✨ Features

- **Interactive Topics** — hands-on lessons from installation to production patterns
- **7 Learning Phases** — Setup → Locators → Actions → Assertions → Architecture → Advanced → Production
- **Real-Life Analogies** — every concept linked to an everyday scenario
- **Code Snippets** — copy-paste-ready Playwright examples in every section
- **Modern Web App** — React 19 + Vite SPA with Clean Architecture
- **Interactive Quizzes** — context-aware quizzes with local storage progress tracking
- **Light/Dark Mode** — persistent theme toggle using Zustand state management
- **No Forward References** — every topic builds strictly on the previous one

---

## 📂 Project Structure

```text
playwright-age/
├── public/                 # Static assets
│   └── content/            # HTML topic content served dynamically
├── e2e/                    # Playwright end-to-end tests for the app
├── src/                    # React SPA source code
│   ├── core/               # Domain layer (entities, use cases)
│   ├── data/               # Infrastructure layer (repositories, DI)
│   ├── presentation/       # UI layer (React components, pages, stores)
│   ├── styles/             # Shared CSS design system
│   ├── App.tsx             # Router configuration
│   └── main.tsx            # React entry point
└── package.json
```

### Clean Architecture & SOLID

- **Core:** zero UI logic — entities and pure business rules (`SubmitQuizAnswerUseCase`, etc.)
- **Data:** local storage and static data via repository interfaces, wired in `container.ts`
- **Presentation:** React components render UI and call use cases — no hardcoded data fetching in views

---

## 🚀 Getting Started

```bash
# Install dependencies (only needed once)
npm install

# Start the development server
npm run dev
```

Then open the provided `localhost` URL in your browser.

### Scripts

| Command            | Description                      |
| ------------------ | -------------------------------- |
| `npm run dev`      | Start Vite dev server            |
| `npm run build`    | Type-check and production build  |
| `npm run preview`  | Preview production build         |
| `npm test`         | Run Vitest unit tests            |
| `npm run test:e2e` | Run Playwright app tests         |
| `npm run deploy`   | Build and deploy to GitHub Pages |

---

## 🎨 Design

- **Typography** — IBM Plex Sans, IBM Plex Mono, Playfair Display, JetBrains Mono
- **Layout** — fixed sidebar navigation + scrollable content with IntersectionObserver active state
- **Components** — hero sections, bordered tables, tip/info/warning callouts, syntax-highlighted code blocks
- **Responsive** — sidebar collapses on mobile

---

## 📄 License

This project is for personal learning and portfolio use.

---

## 🤝 Content Philosophy

Every topic follows these rules (see `CONSTITUTION.md` Section 8 for the full spec):

1. **No jargon without explanation** — if a term is used, it's defined in plain language first
2. **Real-life analogy for every code example** — checkout flows, TV remotes, cooking videos, smart elevators
3. **❌/✅ Common Mistakes** — every topic has at least 3 beginner traps with fixes
4. **Cheatsheet at the bottom** — quick reference table you can scan before an interview
5. **No forward references** — concepts are never used before they're taught
6. **Quizzes maximize coverage** — at least one question per teachable section; add more where the section is dense (no fixed cap)
