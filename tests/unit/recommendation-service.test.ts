import { describe, expect, it } from "vitest";

import { contentData } from "@/content";
import {
  LocalCategoryRepository,
  LocalProjectRepository,
  LocalRecommendationRepository,
  LocalScenarioRepository,
  LocalTagRepository,
} from "@/repositories";
import { RecommendationService } from "@/services/recommendation-service";

function createService() {
  return new RecommendationService({
    recommendations: new LocalRecommendationRepository(contentData),
    categories: new LocalCategoryRepository(contentData),
    tags: new LocalTagRepository(contentData),
    scenarios: new LocalScenarioRepository(contentData),
    projects: new LocalProjectRepository(contentData),
  });
}

describe("RecommendationService", () => {
  it("computes category and tag counts from published recommendations", async () => {
    const service = createService();

    await expect(service.getCategoryCounts()).resolves.toEqual({
      "category-ai-assistant": 3,
      "category-ai-coding": 4,
      "category-agent-automation": 4,
      "category-knowledge": 3,
      "category-content-creation": 3,
      "category-indie": 3,
    });
    await expect(service.getTagCounts()).resolves.toMatchObject({
      "tag-open-source": 10,
      "tag-conversation": 2,
    });
  });

  it("assembles category, tags, scenarios and projects for a recommendation", async () => {
    const service = createService();

    const result = await service.getBySlugWithRelations("claude-code");

    expect(result?.category.slug).toBe("ai-coding");
    expect(result?.tags.map((item) => item.slug)).toContain("code-generation");
    expect(result?.scenarios.map((item) => item.slug)).toEqual([
      "ai-website",
      "indie-inspiration",
    ]);
    expect(result?.projects.map((item) => item.slug)).toEqual(["ai-recommendation-list"]);
    await expect(service.getBySlugWithRelations("missing")).resolves.toBeNull();
  });

  it("computes project status groups including empty statuses", async () => {
    const service = createService();

    const result = await service.getProjectStatusGroups();

    expect(result.launched).toHaveLength(1);
    expect(result.iterating).toHaveLength(2);
    expect(result.prototype).toHaveLength(1);
    expect(result.experiment).toEqual([]);
    expect(result.paused).toEqual([]);
  });

  it("returns the latest content update date", async () => {
    const service = createService();

    await expect(service.getLatestUpdatedAt()).resolves.toBe("2026-07-10T00:00:00.000Z");
  });
});
