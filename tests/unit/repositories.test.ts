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

describe("LocalRecommendationRepository", () => {
  const repository = new LocalRecommendationRepository(contentData);

  it("returns all published recommendations", async () => {
    const result = await repository.getAllPublished();

    expect(result).toHaveLength(20);
    expect(result.every((item) => item.publishStatus === "published")).toBe(true);
  });

  it("gets a recommendation by slug and returns null for an invalid slug", async () => {
    await expect(repository.getBySlug("claude")).resolves.toMatchObject({ id: "rec-claude" });
    await expect(repository.getBySlug("missing")).resolves.toBeNull();
  });

  it("filters published recommendations by category", async () => {
    const result = await repository.getByCategory("category-ai-assistant");

    expect(result.map((item) => item.slug)).toEqual(["chatgpt", "claude", "ollama"]);
  });

  it("sorts featured recommendations by featured order", async () => {
    const result = await repository.getFeatured();

    expect(result.map((item) => item.slug)).toEqual([
      "claude",
      "vercel",
      "n8n",
      "obsidian",
      "figma",
      "excalidraw",
    ]);
  });

  it("sorts recently updated recommendations and applies a limit", async () => {
    const result = await repository.getRecentlyUpdated(3);

    expect(result.map((item) => item.slug)).toEqual(["claude", "claude-code", "cursor"]);
  });
});

describe("other local repositories", () => {
  it("returns visible categories in configured order", async () => {
    const repository = new LocalCategoryRepository(contentData);

    const result = await repository.getAllVisible();

    expect(result.map((item) => item.order)).toEqual([1, 2, 3, 4, 5, 6]);
    await expect(repository.getBySlug("ai-coding")).resolves.toMatchObject({
      id: "category-ai-coding",
    });
    await expect(repository.getBySlug("missing")).resolves.toBeNull();
  });

  it("returns published scenarios and projects by slug", async () => {
    const scenarioRepository = new LocalScenarioRepository(contentData);
    const projectRepository = new LocalProjectRepository(contentData);

    await expect(scenarioRepository.getAllPublished()).resolves.toHaveLength(6);
    await expect(scenarioRepository.getBySlug("build-agent")).resolves.toMatchObject({
      id: "scenario-build-agent",
    });
    await expect(scenarioRepository.getBySlug("missing")).resolves.toBeNull();
    await expect(projectRepository.getAllPublished()).resolves.toHaveLength(4);
    await expect(projectRepository.getBySlug("personal-blog")).resolves.toMatchObject({
      id: "project-personal-blog",
    });
    await expect(projectRepository.getBySlug("missing")).resolves.toBeNull();
  });

  it("returns articles and supports ID lookup", async () => {
    const repository = new LocalArticleRepository(contentData);

    await expect(repository.getAll()).resolves.toHaveLength(4);
    await expect(repository.getById("article-remotion-docs")).resolves.toMatchObject({
      title: "Remotion 文档",
    });
    await expect(repository.getById("missing")).resolves.toBeNull();
  });

  it("returns visible tags and supports ID lookup", async () => {
    const repository = new LocalTagRepository(contentData);

    const result = await repository.getAllVisible();

    expect(result.length).toBeGreaterThan(20);
    await expect(repository.getById("tag-open-source")).resolves.toMatchObject({
      slug: "open-source",
    });
    await expect(repository.getById("missing")).resolves.toBeNull();
  });
});
