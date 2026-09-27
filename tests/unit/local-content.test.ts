import { existsSync } from "node:fs";
import { join } from "node:path";
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

  it("assigns every recommendation a local Logo asset", () => {
    for (const recommendation of contentData.recommendations) {
      expect(recommendation.logo).toMatch(/^\/assets\/icons\//);
      expect(existsSync(join(process.cwd(), "public", recommendation.logo!.slice(1)))).toBe(true);
    }
  });

  it("keeps launched project URLs and project logos local, without inventing a prototype URL", () => {
    const launchedProjects = contentData.projects.filter(
      (project) => project.status === "launched",
    );
    const prototypes = contentData.projects.filter((project) => project.status === "prototype");

    expect(launchedProjects).toHaveLength(3);
    expect(prototypes).toHaveLength(1);
    expect(prototypes[0]?.projectUrl).toBeUndefined();

    for (const project of launchedProjects) {
      expect(project.projectUrl).toMatch(/^https:\/\//);
      expect(project.coverImage).toMatch(/^\/assets\/(?:icons|images)\//);
      expect(existsSync(join(process.cwd(), "public", project.coverImage!.slice(1)))).toBe(true);
    }
  });

  it("assigns every category and scenario a distinct local entry icon", () => {
    const entryAssets = [
      ...contentData.categories.map((category) => `/assets/icons/category-${category.iconKey}.png`),
      ...contentData.scenarios.map((scenario) => `/assets/icons/scenario-${scenario.iconKey}.png`),
    ];

    expect(new Set(contentData.scenarios.map((scenario) => scenario.iconKey)).size).toBe(6);
    expect(new Set(entryAssets).size).toBe(12);
    for (const asset of entryAssets) {
      expect(existsSync(join(process.cwd(), "public", asset.slice(1)))).toBe(true);
    }
  });

  it("passes the complete content data validator", () => {
    expect(validateContentData(contentData)).toEqual(contentData);
  });
});
