import { describe, expect, it } from "vitest";

import { contentData } from "@/content";
import {
  LocalArticleRepository,
  LocalCategoryRepository,
  LocalRecommendationRepository,
  LocalScenarioRepository,
  LocalTagRepository,
} from "@/repositories";
import { ScenarioService } from "@/services/scenario-service";
import type { ContentData } from "@/types";

function createService(data: ContentData = contentData) {
  return new ScenarioService({
    scenarios: new LocalScenarioRepository(data),
    recommendations: new LocalRecommendationRepository(data),
    categories: new LocalCategoryRepository(data),
    tags: new LocalTagRepository(data),
    articles: new LocalArticleRepository(data),
  });
}

describe("ScenarioService", () => {
  it("resolves primary and alternative recommendations for every step", async () => {
    const result = await createService().getBySlugWithRecommendations("build-agent");

    expect(result?.steps[0].primaryRecommendations.map((item) => item.slug)).toEqual(["chatgpt"]);
    expect(result?.steps[0].alternativeRecommendations).toEqual([]);
    expect(result?.steps[1].primaryRecommendations.map((item) => item.slug)).toEqual([
      "codex",
      "claude-code",
    ]);
    expect(result?.recommendations[0].category.slug).toBe("ai-assistant");
    expect(result?.recommendations[0].tags.length).toBeGreaterThan(0);
  });

  it("returns null for an invalid scenario slug", async () => {
    await expect(createService().getBySlugWithRecommendations("missing")).resolves.toBeNull();
  });

  it("returns a deduplicated scenario tool summary in configured order", async () => {
    const result = await createService().getUniqueRecommendations("build-agent");

    expect(result.map((item) => item.slug)).toEqual([
      "chatgpt",
      "codex",
      "claude-code",
      "ccswitch",
      "hermes-agent",
      "dify",
      "n8n",
      "agent-reach",
    ]);
    expect(new Set(result.map((item) => item.id)).size).toBe(result.length);
  });

  it("computes the scenario tool count", async () => {
    await expect(createService().getRecommendationCount("build-agent")).resolves.toBe(8);
    await expect(createService().getRecommendationCount("missing")).resolves.toBe(0);
  });

  it("derives the tool summary from scenario steps", async () => {
    const data = structuredClone(contentData);
    data.scenarios[0].recommendationIds = ["rec-chatgpt"];
    const service = createService(data);

    const result = await service.getUniqueRecommendations("ai-website");

    expect(result.map((item) => item.slug)).toEqual([
      "chatgpt",
      "open-design",
      "awesome-design-md",
      "codex",
      "claude-code",
      "cursor",
      "ccswitch",
      "vercel",
      "cloudflare",
    ]);
  });

  it("returns published scenarios and orders steps by their order field", async () => {
    const data = structuredClone(contentData);
    data.scenarios[0].steps.reverse();

    const service = createService(data);
    const scenarios = await service.getPublished();
    const result = await service.getPageData("ai-website");

    expect(scenarios).toHaveLength(6);
    expect(scenarios.every((scenario) => scenario.publishStatus === "published")).toBe(true);
    expect(result?.steps.map(({ step }) => step.order)).toEqual([1, 2, 3, 4]);
  });

  it("returns deduplicated related categories and canonical related articles", async () => {
    const data = structuredClone(contentData);
    data.scenarios[0].relatedArticles = [data.articles[0]];

    const result = await createService(data).getPageData("ai-website");

    expect(result?.relatedCategories.map((category) => category.slug)).toEqual([
      "ai-assistant",
      "ai-coding",
      "content-creation",
      "indie",
    ]);
    expect(result?.relatedArticles.map((article) => article.id)).toEqual(["article-nextjs-docs"]);
  });
});
