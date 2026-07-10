# Phase 0 and Phase 1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Document the product and reference design, then create a verified Next.js foundation without implementing business pages.

**Architecture:** Use Next.js App Router with TypeScript strict mode and Server Components by default. Keep future content access behind repository and service boundaries, while this phase provides only neutral route scaffolding, shared styles, test infrastructure, and documentation.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zod, ESLint, Prettier, Vitest, Testing Library, Playwright.

## Global Constraints

- Complete only Phase 0 and Phase 1 from `task.md`.
- Do not modify any file under `reference/`.
- Do not implement public business routes or reusable business components in this phase.
- Enable TypeScript strict mode and do not use `any` to bypass errors.
- Keep App Router components server-rendered unless browser interaction is required.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build` before completion.

---

### Task 1: Document the product and reference design

**Files:**

- Create: `docs/PRD.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/DESIGN_SYSTEM.md`
- Create: `docs/DATA_MODEL.md`
- Create: `docs/ROADMAP.md`
- Create: `docs/ACCEPTANCE.md`
- Create: `AGENTS.md`

**Interfaces:**

- Consumes: `task.md` and every file under `reference/opendesign/`
- Produces: Product scope, route contract, design tokens, data contracts, phased tasks, acceptance checks, and repository working rules

- [x] **Step 1: Record the seven reference page structures and repeated UI patterns**

Capture the home, category, scenario, recommendation detail, search, projects, and about structures, including the shared navigation, footer, cards, tags, breadcrumbs, filters, empty states, and responsive behavior.

- [x] **Step 2: Record the shared design tokens**

Use the prototype values for paper background, white surfaces, dark text, muted text, subtle border, yellow accent, accent ink, 8px spacing base, 12px/24px radii, 2.5px borders, hard shadow, soft shadow, focus ring, 1360px maximum width, and the 1024px/768px responsive thresholds.

- [x] **Step 3: Define architecture and data boundaries**

Document Server Component defaults, narrow Client Component leaves, repository and service boundaries, URL-backed search state, static generation, error states, and the future local-to-Supabase repository replacement.

- [x] **Step 4: Define every required entity and enum**

Document `Recommendation`, `Category`, `Tag`, `Scenario`, `ScenarioStep`, `Project`, `ArticleReference`, and `UpdateLog`, including identifiers, slugs, timestamps, status values, relationships, and validation constraints.

- [x] **Step 5: Define the roadmap and acceptance gates**

Mark Phase 0 and Phase 1 as complete only after all documentation, tooling, smoke tests, and build checks pass. Keep Phase 2 focused on the data layer.

### Task 2: Scaffold the Next.js foundation

**Files:**

- Create: `package.json`
- Create: `package-lock.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`
- Create: `.gitignore`
- Create: `.prettierignore`
- Create: `.prettierrc.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/components/.gitkeep`
- Create: `src/content/.gitkeep`
- Create: `src/lib/.gitkeep`
- Create: `src/repositories/.gitkeep`
- Create: `src/services/.gitkeep`
- Create: `src/types/.gitkeep`
- Create: `public/assets/images/.gitkeep`
- Create: `public/assets/icons/.gitkeep`

**Interfaces:**

- Consumes: Architecture and design constraints from Task 1
- Produces: A buildable App Router shell and stable directory ownership boundaries

- [x] **Step 1: Run the non-interactive Next.js scaffold**

Run the current `create-next-app` empty template in a temporary directory, then reproduce its generated configuration in the existing project root without moving or deleting `task.md`, `AGENTS.md`, `docs/`, or `reference/`.

Expected: A Next.js App Router project is created without changing `task.md` or `reference/`. This controlled path is required because create-next-app 16.2.10 no longer accepts `--force` for a non-empty target.

- [x] **Step 2: Replace the generated page with a neutral foundation screen**

Keep only the product name, a short statement that the foundation is ready, and no business navigation, cards, data, search, filters, or public product sections.

- [x] **Step 3: Add project directories and shared design tokens**

Create the directory placeholders and define prototype-aligned CSS custom properties in `globals.css`, without building reusable business components.

- [x] **Step 4: Confirm strict TypeScript and formatting rules**

Verify `strict: true` in `tsconfig.json`, preserve the Next.js ESLint presets, and add Prettier scripts and configuration.

### Task 3: Configure automated checks

**Files:**

- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/foundation.test.tsx`
- Create: `tests/e2e/foundation.spec.ts`
- Modify: `package.json`

**Interfaces:**

- Consumes: The neutral root route from Task 2
- Produces: Unit and browser smoke checks plus stable quality scripts

- [x] **Step 1: Add the Vitest dependencies and scripts**

Install `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event`. Configure `npm run test` to execute `vitest run`.

- [x] **Step 2: Write and run the foundation unit test**

Test that the unit test environment loads and that a deterministic foundation assertion passes.

Run: `npm run test`

Expected: One unit test file passes.

- [x] **Step 3: Add Playwright and a root-route smoke test**

Install `@playwright/test`, configure Chromium with a managed local Next.js server, and verify that `/` returns the neutral foundation heading.

Run: `npm run test:e2e`

Expected: The Chromium smoke test passes.

- [x] **Step 4: Run every quality gate**

Run: `npm run lint`

Expected: Exit code 0 with no lint errors.

Run: `npm run typecheck`

Expected: Exit code 0 with no type errors.

Run: `npm run test`

Expected: Exit code 0 with all Vitest tests passing.

Run: `npm run test:e2e`

Expected: Exit code 0 with all Playwright tests passing.

Run: `npm run build`

Expected: Exit code 0 and a successful production build.

### Task 4: Reconcile documentation with the verified project

**Files:**

- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/ROADMAP.md`
- Modify: `docs/ACCEPTANCE.md`

**Interfaces:**

- Consumes: Actual dependency versions, scripts, directory tree, and verification results
- Produces: Documentation that accurately describes the checked project state and Phase 2 handoff

- [x] **Step 1: Update architecture decisions with the final project tree and scripts**

- [x] **Step 2: Mark Phase 0 and Phase 1 complete and leave all later phases pending**

- [x] **Step 3: Record quality-gate results and remaining risks**

- [x] **Step 4: Confirm scope with repository searches**

Run: `rg --files src/app`

Expected: Only the root layout, neutral root page, and global styles exist; no concrete business route is present.

Run: `git status --short`

Expected: If the directory is not a Git repository, report that fact and use `rg --files` for the created-file inventory.
