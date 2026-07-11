import { describe, expect, it } from "vitest";

import { contentData } from "@/content";
import {
  LocalArticleRepository,
  LocalCategoryRepository,
  LocalProjectRepository,
  LocalRecommendationRepository,
  LocalScenarioRepository,
  LocalTagRepository,
} from "@/repositories";
import { SearchService } from "@/services/search-service";

function createService() {
  return new SearchService({
    recommendations: new LocalRecommendationRepository(contentData),
    categories: new LocalCategoryRepository(contentData),
    tags: new LocalTagRepository(contentData),
    scenarios: new LocalScenarioRepository(contentData),
    projects: new LocalProjectRepository(contentData),
    articles: new LocalArticleRepository(contentData),
  });
}

describe("SearchService", () => {
  it("supports Chinese keyword search", async () => {
    const result = await createService().search("知识");

    expect(result.total).toBeGreaterThan(0);
    expect(result.scenarios.map(({ item }) => item.slug)).toContain("knowledge-base");
  });

  it("ignores English case and trims surrounding whitespace", async () => {
    const result = await createService().search("  CLAUDE  ");

    expect(result.recommendations.map(({ item }) => item.slug)).toEqual(["claude", "claude-code"]);
  });

  it("searches recommendation names and URL domains", async () => {
    const byName = await createService().search("Cursor");
    const byDomain = await createService().search("vercel.com");

    expect(byName.recommendations.map(({ item }) => item.slug)).toContain("cursor");
    expect(byDomain.recommendations.map(({ item }) => item.slug)).toContain("vercel");
  });

  it("searches tags and category names", async () => {
    const byTag = await createService().search("浏览器控制");
    const byCategory = await createService().search("内容与视觉创作");

    expect(byTag.recommendations.map(({ item }) => item.slug)).toEqual(["browser-use"]);
    expect(byCategory.recommendations.map(({ item }) => item.slug)).toEqual([
      "midjourney",
      "figma",
      "runway",
    ]);
  });

  it("searches recommendation reasons", async () => {
    const result = await createService().search("终端编程 Agent");

    expect(result.recommendations.map(({ item }) => item.slug)).toContain("claude-code");
  });

  it("searches scenarios and makes scenario names discover related recommendations", async () => {
    const result = await createService().search("自动化重复工作");

    expect(result.scenarios.map(({ item }) => item.slug)).toContain("automation");
    expect(result.recommendations.map(({ item }) => item.slug)).toContain("n8n");
  });

  it("searches projects and project names discover related recommendations", async () => {
    const result = await createService().search("会话分析");

    expect(result.projects.map(({ item }) => item.slug)).toContain("agent-session-analysis");
    expect(result.recommendations.map(({ item }) => item.slug)).toContain("langgraph");
  });

  it("searches independent article references", async () => {
    const result = await createService().search("Remotion 文档");

    expect(result.articles.map(({ item }) => item.id)).toEqual(["article-remotion-docs"]);
  });

  it("returns explicit empty results for an empty keyword", async () => {
    await expect(createService().search("   ")).resolves.toEqual({
      recommendations: [],
      scenarios: [],
      projects: [],
      articles: [],
      total: 0,
    });
  });

  it("returns zero grouped results when nothing matches", async () => {
    const result = await createService().search("no-such-content-xyz");

    expect(result.total).toBe(0);
    expect(result.recommendations).toEqual([]);
    expect(result.scenarios).toEqual([]);
    expect(result.projects).toEqual([]);
    expect(result.articles).toEqual([]);
  });

  it("provides recommendation category and tags for direct page display", async () => {
    const data = await createService().getPageData("Cursor");

    expect(data.query).toBe("Cursor");
    expect(data.results.recommendations).toHaveLength(1);
    expect(data.results.recommendations[0].item.slug).toBe("cursor");
    expect(data.results.recommendations[0].category.slug).toBe("ai-coding");
    expect(data.results.recommendations[0].tags.map((tag) => tag.slug)).toContain(
      "code-generation",
    );
    expect(data.results.total).toBeGreaterThanOrEqual(1);
  });
});
