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
      "category-ai-assistant": 1,
      "category-ai-coding": 6,
      "category-agent-automation": 7,
      "category-knowledge": 3,
      "category-content-creation": 6,
      "category-indie": 3,
    });
    await expect(service.getTagCounts()).resolves.toMatchObject({ "tag-conversation": 1 });
  });

  it("assembles category, tags, scenarios and projects for a recommendation", async () => {
    const service = createService();

    const result = await service.getBySlugWithRelations("claude-code");

    expect(result?.category.slug).toBe("ai-coding");
    expect(result?.tags.map((item) => item.slug)).toContain("code-generation");
    expect(result?.scenarios.map((item) => item.slug)).toEqual([
      "ai-website",
      "build-agent",
      "indie-inspiration",
    ]);
    expect(result?.projects).toEqual([]);
    expect(result?.relatedRecommendations.map((item) => item.recommendation.slug)).toEqual([
      "codex",
      "cursor",
      "ccswitch",
    ]);
    expect(result?.articles).toEqual([]);
    await expect(service.getBySlugWithRelations("missing")).resolves.toBeNull();
  });

  it("does not expose unpublished recommendations by slug", async () => {
    const data = structuredClone(contentData);
    data.recommendations[0].publishStatus = "draft";
    const service = new RecommendationService({
      recommendations: new LocalRecommendationRepository(data),
      categories: new LocalCategoryRepository(data),
      tags: new LocalTagRepository(data),
      scenarios: new LocalScenarioRepository(data),
      projects: new LocalProjectRepository(data),
    });

    await expect(service.getBySlugWithRelations("chatgpt")).resolves.toBeNull();
  });

  it("returns empty optional relation groups without inventing content", async () => {
    const result = await createService().getBySlugWithRelations("vercel");

    expect(result?.projects).toEqual([]);
    expect(result?.articles).toEqual([]);
  });

  it("computes project status groups including empty statuses", async () => {
    const service = createService();

    const result = await service.getProjectStatusGroups();

    expect(result.launched).toHaveLength(2);
    expect(result.prototype).toHaveLength(1);
  });

  it("returns the latest content update date", async () => {
    const service = createService();

    await expect(service.getLatestUpdatedAt()).resolves.toBe("2026-07-22T00:00:00.000Z");
  });
});
