import { describe, expect, it } from "vitest";

import { contentData } from "@/content";
import {
  LocalArticleRepository,
  LocalCategoryRepository,
  LocalRecommendationRepository,
  LocalScenarioRepository,
  LocalTagRepository,
} from "@/repositories";
import { CategoryService, FilterService } from "@/services";
import type { ContentData } from "@/types";

function createService(data: ContentData = contentData) {
  return new CategoryService({
    categories: new LocalCategoryRepository(data),
    tags: new LocalTagRepository(data),
    recommendations: new LocalRecommendationRepository(data),
    scenarios: new LocalScenarioRepository(data),
    articles: new LocalArticleRepository(data),
    filterService: new FilterService(),
  });
}

describe("CategoryService", () => {
  it("assembles a visible category with published recommendations and real tags", async () => {
    const result = await createService().getPageData("ai-coding", {
      tags: [],
      sort: "recently-updated",
    });

    expect(result?.publishedCount).toBe(4);
    expect(result?.filteredCount).toBe(4);
    expect(result?.recommendations.map(({ recommendation }) => recommendation.slug)).toEqual([
      "claude-code",
      "cursor",
      "supabase",
      "vercel",
    ]);
    expect(
      result?.recommendations.every(({ category }) => category.id === result.category.id),
    ).toBe(true);
    expect(result?.tags.map((tag) => tag.slug)).toContain("code-generation");
    expect(
      result?.tags.every((tag) => result.recommendations.some(({ tags }) => tags.includes(tag))),
    ).toBe(true);
    expect(result?.tagSummaries.find(({ tag }) => tag.slug === "code-generation")?.count).toBe(2);
    expect(result?.tagSummaries.find(({ tag }) => tag.slug === "web")?.count).toBe(3);
  });

  it("filters by category tag, sorts results and ignores unknown tags", async () => {
    const filtered = await createService().getPageData("ai-coding", {
      tags: ["open-source"],
      sort: "name",
    });
    const unknown = await createService().getPageData("ai-coding", {
      tags: ["not-a-category-tag"],
      sort: "name",
    });

    expect(filtered?.query.tags).toEqual(["open-source"]);
    expect(filtered?.recommendations.map(({ recommendation }) => recommendation.slug)).toEqual([
      "supabase",
    ]);
    expect(unknown?.query.tags).toEqual([]);
    expect(unknown?.filteredCount).toBe(4);
    expect(filtered?.tagSummaries.find(({ tag }) => tag.slug === "code-generation")?.count).toBe(2);
  });

  it("computes the latest update and related scenarios and articles from category content", async () => {
    const data = structuredClone(contentData);
    const recommendation = data.recommendations.find((item) => item.slug === "claude-code");
    if (!recommendation) throw new Error("Missing test recommendation");
    recommendation.updatedAt = "2026-07-11T00:00:00.000Z";
    recommendation.relatedArticles = [data.articles[0]];

    const result = await createService(data).getPageData("ai-coding", {
      tags: [],
      sort: "recently-updated",
    });

    expect(result?.lastUpdatedAt).toBe("2026-07-11T00:00:00.000Z");
    expect(result?.relatedScenarios.map((scenario) => scenario.slug)).toEqual([
      "ai-website",
      "indie-inspiration",
    ]);
    expect(result?.relatedArticles.map((article) => article.id)).toEqual(["article-nextjs-docs"]);
  });

  it("does not expose missing or hidden categories", async () => {
    const data = structuredClone(contentData);
    data.categories[0].visible = false;

    await expect(
      createService(data).getPageData(data.categories[0].slug, {
        tags: [],
        sort: "recently-updated",
      }),
    ).resolves.toBeNull();
    await expect(
      createService().getPageData("missing", { tags: [], sort: "recently-updated" }),
    ).resolves.toBeNull();
  });
});
