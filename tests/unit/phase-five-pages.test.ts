import { describe, expect, it } from "vitest";

import { metadata as aboutMetadata } from "@/app/about/page";
import {
  generateMetadata as generateCategoryMetadata,
  generateStaticParams as generateCategoryStaticParams,
} from "@/app/categories/[slug]/page";
import { metadata as projectsMetadata } from "@/app/projects/page";
import robots from "@/app/robots";
import {
  generateMetadata as generateScenarioMetadata,
  generateStaticParams as generateScenarioStaticParams,
} from "@/app/scenarios/[slug]/page";
import { metadata as searchMetadata } from "@/app/search/page";
import sitemap from "@/app/sitemap";

describe("Phase 5 page metadata and indexing", () => {
  it("generates all visible category params and category metadata", async () => {
    const params = await generateCategoryStaticParams();
    const metadata = await generateCategoryMetadata({
      params: Promise.resolve({ slug: "ai-coding" }),
      searchParams: Promise.resolve({}),
    });

    expect(params).toHaveLength(6);
    expect(params).toContainEqual({ slug: "knowledge" });
    expect(metadata.title).toBe("AI 编程与开发");
    expect(metadata.alternates?.canonical).toBe("/categories/ai-coding");
    expect(metadata.openGraph).toMatchObject({ type: "website" });
  });

  it("marks an invalid category slug as noindex", async () => {
    const metadata = await generateCategoryMetadata({
      params: Promise.resolve({ slug: "missing-category" }),
      searchParams: Promise.resolve({}),
    });

    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(metadata.alternates).toBeUndefined();
  });

  it("generates all published scenario params and scenario metadata", async () => {
    const params = await generateScenarioStaticParams();
    const metadata = await generateScenarioMetadata({
      params: Promise.resolve({ slug: "build-agent" }),
    });

    expect(params).toHaveLength(6);
    expect(params).toContainEqual({ slug: "media-production" });
    expect(metadata.title).toBe("搭建一个 Agent");
    expect(metadata.alternates?.canonical).toBe("/scenarios/build-agent");
  });

  it("marks an invalid scenario slug as noindex", async () => {
    const metadata = await generateScenarioMetadata({
      params: Promise.resolve({ slug: "missing-scenario" }),
    });

    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("defines metadata for search, projects and about", () => {
    expect(searchMetadata.alternates?.canonical).toBe("/search");
    expect(searchMetadata.robots).toMatchObject({ index: false, follow: true });
    expect(projectsMetadata.alternates?.canonical).toBe("/projects");
    expect(aboutMetadata.alternates?.canonical).toBe("/about");
  });

  it("includes only formal indexable routes in the sitemap", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(entries).toHaveLength(38);
    expect(urls.some((url) => url.endsWith("/categories/ai-coding"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/scenarios/build-agent"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/recommendations/codex"))).toBe(true);
    expect(urls.some((url) => url.includes("/search"))).toBe(false);
    expect(urls.some((url) => url.includes("/dev/components"))).toBe(false);
  });

  it("publishes a robots policy and sitemap address", () => {
    const policy = robots();

    expect(policy.rules).toMatchObject({ allow: "/", disallow: ["/dev/"] });
    expect(policy.sitemap).toContain("/sitemap.xml");
  });
});
