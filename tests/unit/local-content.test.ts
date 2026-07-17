import { describe, expect, it } from "vitest";

import { contentData } from "@/content";
import { validateContentData } from "@/lib/validation";

describe("local content", () => {
  it("contains the six fixed categories and six required scenarios", () => {
    expect(contentData.categories).toHaveLength(6);
    expect(contentData.scenarios).toHaveLength(6);
  });

  it("contains a representative 20 to 30 recommendation set", () => {
    expect(contentData.recommendations.length).toBeGreaterThanOrEqual(20);
    expect(contentData.recommendations.length).toBeLessThanOrEqual(30);
  });

  it("covers every fixed category with at least one recommendation", () => {
    const coveredCategoryIds = new Set(
      contentData.recommendations.map((recommendation) => recommendation.categoryId),
    );

    expect(coveredCategoryIds).toEqual(
      new Set(contentData.categories.map((category) => category.id)),
    );
  });

  it("contains no placeholder URLs or unreviewed personal claims", () => {
    for (const recommendation of contentData.recommendations) {
      expect(recommendation.url).toMatch(/^https:\/\//);
      expect(recommendation.url).not.toContain("#");
      expect(recommendation.url).not.toContain("—");
      expect(recommendation.editorialStatus).toBe("verified");
    }
  });

  it("passes the complete content data validator", () => {
    expect(validateContentData(contentData)).toEqual(contentData);
  });
});
