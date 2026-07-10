# Phase 2 Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a validated local content model, replaceable repositories, centralized search/filter services, and tested URL query rules without creating business pages or Phase 3 UI components.

**Architecture:** Domain enums and entities live in `src/types`; Zod schemas and cross-entity validation live in `src/lib/validation`; local content is split by entity in `src/content`; repositories isolate storage; services implement queries and relation assembly. `next.config.ts` imports the validated content entry so invalid local data fails before a build proceeds.

**Tech Stack:** TypeScript strict, Zod 4, Vitest, Next.js 16.

## Global Constraints

- Complete only Phase 2; do not create business routes or Phase 3 UI components.
- Do not modify `reference/`.
- Do not use `any`, HTML strings, JSX, DOM operations, external search libraries, Supabase, or placeholder URLs.
- Keep shared enums in one source and derive types from those constants.
- Use 24 representative recommendations with valid URLs, covering all six categories and six scenarios.
- Do not invent personal usage claims; uncertain editorial text must use `editorialStatus: "needs-review"`.
- All counts, sorting, grouping, and latest dates are computed from content.
- Every production behavior starts with a failing test and is re-run after implementation.

---

### Task 1: Domain types and structural validation

**Files:**
- Create: `src/types/enums.ts`
- Create: `src/types/entities.ts`
- Create: `src/types/search.ts`
- Create: `src/types/index.ts`
- Create: `src/lib/validation/content-schemas.ts`
- Create: `src/lib/validation/validate-content-data.ts`
- Create: `src/lib/validation/index.ts`
- Create: `tests/fixtures/content-data.ts`
- Create: `tests/unit/content-validation.test.ts`
- Modify: `package.json`

**Interfaces:**
- `validateContentData(input: unknown): ContentData`
- `contentDataSchema: z.ZodType<ContentData>`
- Entities: `Recommendation`, `Category`, `Tag`, `Scenario`, `ScenarioStep`, `Project`, `ArticleReference`, `UpdateLog`, `ContentData`
- Enums: recommendation relationship, publish status, availability, pricing, project status, tag group, platform, article type, update-log type, editorial status, sort option

- [ ] Write a valid minimal data fixture and a test that imports `validateContentData`; run it and confirm the module is missing.
- [ ] Add Zod and implement the enum constants, entity types, and structural schemas; run the valid-data test and confirm it passes.
- [ ] Add one failing test at a time for duplicate IDs, duplicate slugs, duplicate tag names, bad category/tag/scenario/project references, self-reference, duplicate relations, featured order, scenario step order and overlap, published completeness, and local asset paths.
- [ ] Implement each cross-entity rule in `validateContentData`, re-running the focused test after every rule.
- [ ] Run `npm run test -- tests/unit/content-validation.test.ts` and confirm all validation tests pass.

### Task 2: Validated local content

**Files:**
- Create: `src/content/categories.ts`
- Create: `src/content/tags.ts`
- Create: `src/content/articles.ts`
- Create: `src/content/recommendations.ts`
- Create: `src/content/scenarios.ts`
- Create: `src/content/projects.ts`
- Create: `src/content/index.ts`
- Create: `tests/unit/local-content.test.ts`
- Remove: `src/content/.gitkeep`

**Interfaces:**
- `contentData: ContentData`
- Named exports: `categories`, `tags`, `articles`, `recommendations`, `scenarios`, `projects`

- [ ] Write tests requiring exactly six fixed categories, six fixed scenarios, 20–30 recommendations, coverage for every category, valid URLs, no `#`/`—` placeholders, and successful global validation; run and confirm failure.
- [ ] Add grouped tags and articles with stable IDs and slugs.
- [ ] Add 24 representative recommendations from the reference facts, using neutral copy and explicit editorial review status.
- [ ] Add six scenario workflows whose primary and alternative recommendations all exist and do not overlap.
- [ ] Add projects without inventing unavailable URLs, then export validated `contentData`.
- [ ] Run `npm run test -- tests/unit/local-content.test.ts tests/unit/content-validation.test.ts` and confirm both files pass.

### Task 3: Repository contracts and local implementations

**Files:**
- Create: `src/repositories/contracts.ts`
- Create: `src/repositories/local-repositories.ts`
- Create: `src/repositories/index.ts`
- Create: `tests/unit/repositories.test.ts`
- Remove: `src/repositories/.gitkeep`

**Interfaces:**
- `RecommendationRepository`: published, slug, category, featured, recently updated
- `CategoryRepository`: visible, slug
- `ScenarioRepository`: published, slug
- `ProjectRepository`: published, slug
- `ArticleRepository`: all, ID
- Local implementations accept `ContentData` through constructors and default to validated local content.

- [ ] Write repository tests for published filtering, slug hit/miss, category filtering, featured order, recent-update order and limit, visible categories, published scenarios/projects, and article lookup; run and confirm imports fail.
- [ ] Implement contracts and local repositories without React or display formatting.
- [ ] Return new arrays for list operations so callers cannot reorder repository storage.
- [ ] Run `npm run test -- tests/unit/repositories.test.ts` and confirm all repository tests pass.

### Task 4: Services, search, filters, and URL parameters

**Files:**
- Create: `src/services/recommendation-service.ts`
- Create: `src/services/search-service.ts`
- Create: `src/services/filter-service.ts`
- Create: `src/services/scenario-service.ts`
- Create: `src/services/query-params.ts`
- Create: `src/services/index.ts`
- Create: `tests/unit/recommendation-service.test.ts`
- Create: `tests/unit/search-service.test.ts`
- Create: `tests/unit/filter-service.test.ts`
- Create: `tests/unit/scenario-service.test.ts`
- Create: `tests/unit/query-params.test.ts`
- Remove: `src/services/.gitkeep`

**Interfaces:**
- `RecommendationService`: published, featured, recent, category/tag counts, related content
- `SearchService.search(query: string): Promise<SearchResults>`; empty trimmed query returns empty grouped results
- `FilterService.apply(items, criteria): Recommendation[]`; empty criteria returns a new unfiltered array
- `ScenarioService.getBySlugWithRecommendations(slug)` and `getUniqueRecommendations(slug)`
- `parseRecommendationQuery(searchParams)` and `serializeRecommendationQuery(query)`

- [ ] Write and run failing tests for computed recommendation counts and relation assembly.
- [ ] Implement `RecommendationService` and make its tests pass.
- [ ] Write and run failing tests for Chinese search, case-insensitive English search, name, URL/domain, tags, category, reason, scenario, project, article, empty query and no results.
- [ ] Implement normalized local search with grouped typed results and computed total.
- [ ] Write and run failing tests for single and combined filters, each supported property, each sort mode, and clearing filters.
- [ ] Implement `FilterService` with intersection semantics and stable sorting.
- [ ] Write and run failing tests for scenario step resolution, preferred/alternative tools and deduplicated tool summaries; implement `ScenarioService`.
- [ ] Write and run failing tests for valid, invalid, default, multi-tag, encoded and round-trip URL parameters; implement parsing and serialization.
- [ ] Run all service and query tests together and confirm they pass.

### Task 5: Build-time validation and documentation

**Files:**
- Modify: `next.config.ts`
- Modify: `docs/DATA_MODEL.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/ROADMAP.md`
- Modify: `README.md`
- Modify: `docs/ACCEPTANCE.md`

**Interfaces:**
- Next configuration imports `contentData`, causing validation before build configuration completes.
- README documents adding recommendations, categories, tags and scenarios, plus validation and diagnosis commands.

- [ ] Add a test proving the local content entry validates, then import it from `next.config.ts` for build-time failure.
- [ ] Update architecture with repository constructors, local-to-Supabase replacement, search/filter semantics and build validation.
- [ ] Update the exact implemented fields, enums, relationships and rules in `DATA_MODEL.md`.
- [ ] Mark only Phase 2 complete in `ROADMAP.md` and update Phase 2 acceptance coverage.
- [ ] Update README content-authoring and troubleshooting instructions.
- [ ] Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build`; all must exit 0.
- [ ] Confirm `rg --files src/app src/components` shows no new business route or Phase 3 component.
