import { describe, expect, it } from "vitest";

import { contentData } from "@/content";
import { FilterService } from "@/services/filter-service";

describe("FilterService", () => {
  const service = new FilterService();

  it("returns a new unfiltered array when filters are clear", () => {
    const result = service.apply(contentData.recommendations, {});

    expect(result).toEqual(contentData.recommendations);
    expect(result).not.toBe(contentData.recommendations);
  });

  it("filters by category, relationship and pricing", () => {
    expect(
      service
        .apply(contentData.recommendations, { categoryId: "category-ai-assistant" })
        .map((item) => item.slug),
    ).toEqual(["chatgpt", "claude", "ollama"]);
    expect(
      service
        .apply(contentData.recommendations, { relationship: "daily-use" })
        .map((item) => item.slug),
    ).toEqual(["claude", "claude-code", "vercel", "n8n", "obsidian", "figma", "rsshub"]);
    expect(
      service.apply(contentData.recommendations, { pricing: "paid" }).map((item) => item.slug),
    ).toEqual(["claude-code", "midjourney"]);
  });

  it("filters by open source, self hosting and platform", () => {
    const openSource = service.apply(contentData.recommendations, { openSource: true });
    const selfHostable = service.apply(contentData.recommendations, { selfHostable: true });
    const cli = service.apply(contentData.recommendations, { platform: "cli" });

    expect(openSource.every((item) => item.isOpenSource)).toBe(true);
    expect(selfHostable.every((item) => item.selfHostable)).toBe(true);
    expect(cli.map((item) => item.slug)).toEqual(["ollama", "claude-code"]);
  });

  it("requires every selected tag", () => {
    const result = service.apply(contentData.recommendations, {
      tagIds: ["tag-open-source", "tag-self-hostable"],
    });

    expect(result.map((item) => item.slug)).toEqual(["supabase", "dify", "n8n", "rsshub"]);
  });

  it("combines different filters with intersection semantics", () => {
    const result = service.apply(contentData.recommendations, {
      categoryId: "category-agent-automation",
      openSource: true,
      selfHostable: true,
      platform: "web",
    });

    expect(result.map((item) => item.slug)).toEqual(["dify", "n8n"]);
  });

  it("sorts by recently updated and recently added dates", () => {
    expect(service.apply(contentData.recommendations, { sort: "recently-updated" })[0].slug).toBe(
      "claude",
    );
    expect(service.apply(contentData.recommendations, { sort: "recently-added" })[0].slug).toBe(
      "remotion",
    );
  });

  it("sorts featured items by configured order before other items", () => {
    const result = service.apply(contentData.recommendations, { sort: "featured" });

    expect(result.slice(0, 6).map((item) => item.slug)).toEqual([
      "claude",
      "vercel",
      "n8n",
      "obsidian",
      "figma",
      "excalidraw",
    ]);
  });

  it("sorts names consistently", () => {
    const result = service.apply(contentData.recommendations, { sort: "name" });

    expect(result.slice(0, 3).map((item) => item.name)).toEqual([
      "Browser Use",
      "ChatGPT",
      "Claude",
    ]);
  });
});
