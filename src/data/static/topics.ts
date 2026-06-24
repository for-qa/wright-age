import type { Topic } from '../../core/entities/Topic';

export const topics: Topic[] = [
  // ── Phase 1 — Foundation ─────────────────────────────────────────
  { file: 'pw-why-playwright.html', title: 'Why Playwright in 2026', number: '1', category: 'Foundation',
    desc: 'Selenium vs Playwright — flaky tests, architecture, auto-wait, e-commerce impact, and career context.',
    tags: [
      { label: 'Selenium', color: 'var(--amber)', bg: 'var(--amber-bg)' },
      { label: 'Auto-Wait', color: 'var(--green)', bg: 'var(--green-bg)' },
      { label: 'Architecture', color: 'var(--blue)', bg: 'var(--blue-bg)' },
      { label: 'Career', color: 'var(--violet)', bg: 'var(--violet-bg)' },
    ],
  },
  // ── Phase 1 — Getting Started & Setup ──────────────────────────────
  { file: 'pw-setup-first-test.html', title: 'Setup & First Test', number: '2', category: 'Setup',
    desc: 'Install Playwright, write your first e-commerce test on Sauce Demo, run it in multiple modes, and tune config for checkout flows.',
    tags: [
      { label: 'Install', color: 'var(--blue)', bg: 'var(--blue-bg)' },
      { label: 'Sauce Demo', color: 'var(--green)', bg: 'var(--green-bg)' },
      { label: 'Checkout', color: 'var(--teal)', bg: 'var(--teal-bg)' },
      { label: 'Config', color: 'var(--violet)', bg: 'var(--violet-bg)' },
    ],
  },
  // ── Phase 2 — Locators & Selectors ───────────────────────────────
  { file: 'pw-locators.html', title: 'Locator Strategies', number: '3', category: 'Locators',
    desc: 'Locator hierarchy, getByRole, getByText, getByTestId, chaining, e-commerce patterns, and debugging brittle selectors.',
    tags: [
      { label: 'getByRole', color: 'var(--blue)', bg: 'var(--blue-bg)' },
      { label: 'getByTestId', color: 'var(--green)', bg: 'var(--green-bg)' },
      { label: 'Chaining', color: 'var(--teal)', bg: 'var(--teal-bg)' },
      { label: 'Codegen', color: 'var(--violet)', bg: 'var(--violet-bg)' },
    ],
  },
  // ── Phase 2 — Locators & Selectors (continued) ───────────────────
  { file: 'pw-auto-wait.html', title: 'Auto-Wait & Web-First Assertions', number: '4', category: 'Assertions',
    desc: 'Race conditions, actionability checks, web-first expect(), soft assertions, timeouts, and when explicit waits are needed.',
    tags: [
      { label: 'Auto-Wait', color: 'var(--green)', bg: 'var(--green-bg)' },
      { label: 'expect()', color: 'var(--blue)', bg: 'var(--blue-bg)' },
      { label: 'Actionability', color: 'var(--teal)', bg: 'var(--teal-bg)' },
      { label: 'Anti-Patterns', color: 'var(--amber)', bg: 'var(--amber-bg)' },
    ],
  },
  // ── Phase 3 — Test Architecture ──────────────────────────────────
  { file: 'pw-page-object-model.html', title: 'Page Object Model for E-Commerce', number: '5', category: 'Architecture',
    desc: 'Three-layer POM, BasePage, cart/checkout page objects, components, flows, and maintainable spec structure.',
    tags: [
      { label: 'POM', color: 'var(--blue)', bg: 'var(--blue-bg)' },
      { label: 'Components', color: 'var(--green)', bg: 'var(--green-bg)' },
      { label: 'Flows', color: 'var(--teal)', bg: 'var(--teal-bg)' },
      { label: 'DRY', color: 'var(--violet)', bg: 'var(--violet-bg)' },
    ],
  },
  // ── Phase 3 — API & Speed ────────────────────────────────────────
  { file: 'pw-api-hybrid.html', title: 'API Testing & Hybrid Workflows', number: '6', category: 'API',
    desc: 'request fixture, API auth with storageState, hybrid setup, test data factories, contract validation, and performance gains.',
    tags: [
      { label: 'request', color: 'var(--blue)', bg: 'var(--blue-bg)' },
      { label: 'Hybrid', color: 'var(--green)', bg: 'var(--green-bg)' },
      { label: 'storageState', color: 'var(--teal)', bg: 'var(--teal-bg)' },
      { label: 'Fixtures', color: 'var(--violet)', bg: 'var(--violet-bg)' },
    ],
  },
  // ── Phase 3 — Network & Edge Cases ───────────────────────────────
  { file: 'pw-network-mocking.html', title: 'Network Interception & Mocking', number: '7', category: 'Network',
    desc: 'page.route fulfill/continue/abort, payment and inventory mocks, HAR playback, offline mode, and mock fixtures.',
    tags: [
      { label: 'page.route', color: 'var(--blue)', bg: 'var(--blue-bg)' },
      { label: 'HAR', color: 'var(--green)', bg: 'var(--green-bg)' },
      { label: 'Payments', color: 'var(--teal)', bg: 'var(--teal-bg)' },
      { label: 'Offline', color: 'var(--amber)', bg: 'var(--amber-bg)' },
    ],
  },
  // ── Phase 4 — Visual & Mobile ────────────────────────────────────
  { file: 'pw-visual-mobile.html', title: 'Visual & Mobile Testing', number: '8', category: 'Visual',
    desc: 'toHaveScreenshot baselines, masking dynamic content, device profiles, responsive breakpoints, mobile UX, and CI with Docker.',
    tags: [
      { label: 'Screenshots', color: 'var(--blue)', bg: 'var(--blue-bg)' },
      { label: 'devices', color: 'var(--green)', bg: 'var(--green-bg)' },
      { label: 'Responsive', color: 'var(--teal)', bg: 'var(--teal-bg)' },
      { label: 'CI / Docker', color: 'var(--violet)', bg: 'var(--violet-bg)' },
    ],
  },
  // ── Phase 4 — Debugging ────────────────────────────────────────────
  { file: 'pw-trace-debugging.html', title: 'Debugging with Trace Viewer', number: '9', category: 'Debugging',
    desc: 'Inspector, page.pause, Trace Viewer, UI Mode, flaky test patterns, e-commerce debug logs, and CI trace artifacts.',
    tags: [
      { label: 'Trace Viewer', color: 'var(--blue)', bg: 'var(--blue-bg)' },
      { label: '--debug', color: 'var(--green)', bg: 'var(--green-bg)' },
      { label: 'UI Mode', color: 'var(--teal)', bg: 'var(--teal-bg)' },
      { label: 'Flaky Tests', color: 'var(--amber)', bg: 'var(--amber-bg)' },
    ],
  },
  // ── Phase 5 — CI/CD & Scale ────────────────────────────────────────
  { file: 'pw-ci-parallel.html', title: 'CI/CD & Parallel Execution', number: '10', category: 'CI/CD',
    desc: 'GitHub Actions, workers, sharding, blob reports, test tags, staging secrets, and scaling to 200+ tests in minutes.',
    tags: [
      { label: 'GitHub Actions', color: 'var(--blue)', bg: 'var(--blue-bg)' },
      { label: 'Sharding', color: 'var(--green)', bg: 'var(--green-bg)' },
      { label: 'Workers', color: 'var(--teal)', bg: 'var(--teal-bg)' },
      { label: '@smoke', color: 'var(--violet)', bg: 'var(--violet-bg)' },
    ],
  },
];
