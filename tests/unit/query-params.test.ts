import { describe, expect, it } from "vitest";

import { parseRecommendationQuery, serializeRecommendationQuery } from "@/services/query-params";

describe("recommendation query parameters", () => {
  it("parses all supported parameters", () => {
    const params = new URLSearchParams({
      q: "Agent",
      category: "agent-automation",
      relationship: "daily-use",
      pricing: "freemium",
      openSource: "true",
      selfHostable: "false",
      platform: "web",
      tags: "open-source,self-hostable",
      sort: "name",
    });

    expect(parseRecommendationQuery(params)).toEqual({
      q: "Agent",
      category: "agent-automation",
      relationship: "daily-use",
      pricing: "freemium",
      openSource: true,
      selfHostable: false,
      platform: "web",
      tags: ["open-source", "self-hostable"],
      sort: "name",
    });
  });

  it("safely ignores invalid values and falls back to defaults", () => {
    const params = new URLSearchParams({
      category: "bad value!",
      relationship: "sometimes",
      pricing: "unknown",
      openSource: "yes",
      selfHostable: "1",
      platform: "terminal",
      tags: "valid-tag,bad value!",
      sort: "popular",
    });

    expect(parseRecommendationQuery(params)).toEqual({
      q: "",
      tags: ["valid-tag"],
      sort: "recently-updated",
    });
  });

  it("trims and deduplicates multiple tags", () => {
    const params = new URLSearchParams({
      tags: "open-source, self-hostable,open-source",
    });

    expect(parseRecommendationQuery(params).tags).toEqual(["open-source", "self-hostable"]);
  });

  it("encodes and decodes Chinese keywords without losing values", () => {
    const query = {
      q: "个人知识管理",
      category: "knowledge",
      relationship: "long-term-use" as const,
      pricing: "freemium" as const,
      openSource: false,
      selfHostable: false,
      platform: "web" as const,
      tags: ["personal-knowledge", "web"],
      sort: "featured" as const,
    };

    const encoded = serializeRecommendationQuery(query);

    expect(encoded.toString()).toContain(
      "q=%E4%B8%AA%E4%BA%BA%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86",
    );
    expect(parseRecommendationQuery(encoded)).toEqual(query);
  });

  it("returns explicit default parameters", () => {
    expect(parseRecommendationQuery(new URLSearchParams())).toEqual({
      q: "",
      tags: [],
      sort: "recently-updated",
    });
  });
});
