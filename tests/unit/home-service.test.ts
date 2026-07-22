import { describe, expect, it } from "vitest";

import { contentData } from "@/content";
import {
  LocalCategoryRepository,
  LocalProjectRepository,
  LocalRecommendationRepository,
  LocalScenarioRepository,
  LocalTagRepository,
} from "@/repositories";
import { FilterService } from "@/services/filter-service";
import { HomeService } from "@/services/home-service";
import { RecommendationService } from "@/services/recommendation-service";
import type { RecommendationQuery } from "@/types";

const defaultQuery: RecommendationQuery = {
  q: "",
  tags: [],
  sort: "recently-updated",
};

function createService() {
  const recommendations = new LocalRecommendationRepository(contentData);
  const categories = new LocalCategoryRepository(contentData);
  const tags = new LocalTagRepository(contentData);
  const scenarios = new LocalScenarioRepository(contentData);
  const projects = new LocalProjectRepository(contentData);
  const recommendationService = new RecommendationService({
    recommendations,
    categories,
    tags,
    scenarios,
    projects,
  });

  return new HomeService({
    recommendationService,
    categories,
    tags,
    scenarios,
    projects,
    filterService: new FilterService(),
  });
}

describe("HomeService", () => {
  it("composes computed counts and all six published entry groups", async () => {
    const result = await createService().getPageData(defaultQuery);

    expect(result.publishedCount).toBe(26);
    expect(result.lastUpdatedAt).toBe("2026-07-22T00:00:00.000Z");
    expect(result.categories).toHaveLength(6);
    expect(result.scenarios).toHaveLength(6);
    expect(result.projects).toHaveLength(2);
    expect(result.categorySummaries.find((item) => item.category.slug === "ai-coding")?.count).toBe(
      6,
    );
    expect(result.relationshipCounts["daily-use"]).toBe(6);
  });

  it("returns exactly four recently updated recommendations in date order", async () => {
    const result = await createService().getPageData(defaultQuery);

    expect(result.recent.map((item) => item.recommendation.slug)).toEqual([
      "chatgpt",
      "codex",
      "claude-code",
      "cursor",
    ]);
  });

  it("hides unverified daily and long-term relationships from featured workflow tools", async () => {
    const result = await createService().getPageData(defaultQuery);

    expect(result.longTerm.length).toBeGreaterThan(0);
  });

  it("applies category, relationship and sort from the parsed URL query", async () => {
    const result = await createService().getPageData({
      ...defaultQuery,
      category: "agent-automation",
      relationship: "daily-use",
      sort: "name",
    });

    expect(result.filtered.map((item) => item.recommendation.slug)).toEqual(["hermes-agent"]);
  });

  it("maps recommendation cards to resolved categories and tags", async () => {
    const result = await createService().getPageData(defaultQuery);
    const first = result.filtered[0];

    expect(first.category.id).toBe(first.recommendation.categoryId);
    expect(first.tags.map((tag) => tag.id)).toEqual(first.recommendation.tagIds);
  });
});
