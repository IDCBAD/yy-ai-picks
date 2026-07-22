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
    ).toEqual(["chatgpt"]);
    expect(
      service
        .apply(contentData.recommendations, { relationship: "daily-use" })
        .map((item) => item.slug),
    ).toEqual(["chatgpt", "codex", "ccswitch", "obsidian", "hermes-agent", "open-design"]);
    expect(
      service.apply(contentData.recommendations, { pricing: "paid" }).map((item) => item.slug),
    ).toEqual(["codex", "claude-code", "newmax", "midjourney"]);
  });

  it("filters by open source, self hosting and platform", () => {
    const openSource = service.apply(contentData.recommendations, { openSource: true });
    const selfHostable = service.apply(contentData.recommendations, { selfHostable: true });
    const cli = service.apply(contentData.recommendations, { platform: "cli" });

    expect(openSource.every((item) => item.isOpenSource)).toBe(true);
    expect(selfHostable.every((item) => item.selfHostable)).toBe(true);
    expect(cli.map((item) => item.slug)).toContain("codex");
  });

  it("requires every selected tag", () => {
    const result = service.apply(contentData.recommendations, {
      tagIds: ["tag-agent", "tag-skill"],
    });

    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every(
        (item) => item.tagIds.includes("tag-agent") && item.tagIds.includes("tag-skill"),
      ),
    ).toBe(true);
  });

  it("combines different filters with intersection semantics", () => {
    const result = service.apply(contentData.recommendations, {
      categoryId: "category-agent-automation",
      selfHostable: true,
      platform: "macos",
    });

    expect(result.map((item) => item.slug)).toEqual(["hermes-agent"]);
  });

  it("sorts by recently updated and recently added dates", () => {
    expect(service.apply(contentData.recommendations, { sort: "recently-updated" })[0].slug).toBe(
      "chatgpt",
    );
    expect(service.apply(contentData.recommendations, { sort: "recently-added" })[0].slug).toBe(
      "chatgpt",
    );
  });

  it("sorts featured items by configured order before other items", () => {
    const result = service.apply(contentData.recommendations, { sort: "featured" });

    expect(result.slice(0, 6).map((item) => item.slug)).toEqual([
      "chatgpt",
      "codex",
      "ccswitch",
      "obsidian",
      "hermes-agent",
      "open-design",
    ]);
  });

  it("sorts names consistently", () => {
    const result = service.apply(contentData.recommendations, { sort: "name" });

    expect(result.slice(0, 3).map((item) => item.name)).toEqual([
      "Agent-Reach",
      "AIHot",
      "awesome-design-md",
    ]);
  });
});
