import { describe, expect, it } from "vitest";

import { metadata as homeMetadata } from "@/app/page";
import {
  generateMetadata as generateRecommendationMetadata,
  generateStaticParams,
} from "@/app/recommendations/[slug]/page";

describe("Phase 4 metadata", () => {
  it("defines the home title, description and canonical metadata", () => {
    expect(homeMetadata.title).toEqual({ absolute: "余一的 AI 推荐清单" });
    expect(homeMetadata.description).toContain("真实工作台");
    expect(homeMetadata.alternates?.canonical).toBe("/");
    expect(homeMetadata.openGraph).toMatchObject({ type: "website" });
    expect(homeMetadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("generates product-specific metadata for a published recommendation", async () => {
    const metadata = await generateRecommendationMetadata({
      params: Promise.resolve({ slug: "claude" }),
    });

    expect(metadata.title).toContain("Claude");
    expect(metadata.description).toContain("长文本");
    expect(metadata.alternates?.canonical).toBe("/recommendations/claude");
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });

  it("does not create valid indexed metadata for an invalid slug", async () => {
    const metadata = await generateRecommendationMetadata({
      params: Promise.resolve({ slug: "missing-recommendation" }),
    });

    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(metadata.alternates).toBeUndefined();
  });

  it("generates static params only for published recommendations", async () => {
    const params = await generateStaticParams();

    expect(params).toHaveLength(20);
    expect(params).toContainEqual({ slug: "claude" });
  });
});
