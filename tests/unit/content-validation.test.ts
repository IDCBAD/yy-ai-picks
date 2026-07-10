import { describe, expect, it } from "vitest";

import { validateContentData } from "@/lib/validation";
import { createValidContentData } from "../fixtures/content-data";

describe("validateContentData", () => {
  it("accepts a structurally valid and relationally complete data set", () => {
    const input = createValidContentData();

    expect(validateContentData(input)).toEqual(input);
  });

  it("rejects duplicate recommendation IDs", () => {
    const input = createValidContentData();
    input.recommendations.push({
      ...structuredClone(input.recommendations[0]),
      slug: "tool-two",
      name: "Tool Two",
    });

    expect(() => validateContentData(input)).toThrow(/duplicate recommendation id/i);
  });

  it("rejects duplicate recommendation slugs", () => {
    const input = createValidContentData();
    input.recommendations.push({
      ...structuredClone(input.recommendations[0]),
      id: "rec-two",
      name: "Tool Two",
    });

    expect(() => validateContentData(input)).toThrow(/duplicate recommendation slug/i);
  });

  it("rejects duplicate tag names", () => {
    const input = createValidContentData();
    input.tags.push({
      ...structuredClone(input.tags[0]),
      id: "tag-two",
      slug: "tag-two",
    });

    expect(() => validateContentData(input)).toThrow(/duplicate tag name/i);
  });

  it("rejects an invalid category reference", () => {
    const input = createValidContentData();
    input.recommendations[0].categoryId = "missing-category";

    expect(() => validateContentData(input)).toThrow(/unknown category/i);
  });

  it("rejects invalid tag references", () => {
    const input = createValidContentData();
    input.recommendations[0].tagIds = ["missing-tag"];

    expect(() => validateContentData(input)).toThrow(/unknown tag/i);
  });

  it("rejects invalid scenario and project references", () => {
    const input = createValidContentData();
    input.recommendations[0].relatedScenarioIds = ["missing-scenario"];
    input.recommendations[0].relatedProjectIds = ["missing-project"];

    expect(() => validateContentData(input)).toThrow(/unknown scenario/i);
    expect(() => validateContentData(input)).toThrow(/unknown project/i);
  });

  it("rejects invalid related recommendation references", () => {
    const input = createValidContentData();
    input.recommendations[0].relatedRecommendationIds = ["missing-recommendation"];

    expect(() => validateContentData(input)).toThrow(/unknown related recommendation/i);
  });

  it("rejects recommendation self references", () => {
    const input = createValidContentData();
    input.recommendations[0].relatedRecommendationIds = ["rec-one"];

    expect(() => validateContentData(input)).toThrow(/cannot reference itself/i);
  });

  it("rejects duplicate recommendation relations", () => {
    const input = createValidContentData();
    input.recommendations[0].tagIds = ["tag-one", "tag-one"];

    expect(() => validateContentData(input)).toThrow(/duplicate tag relation/i);
  });

  it("rejects invalid scenario recommendation references", () => {
    const input = createValidContentData();
    input.scenarios[0].recommendationIds = ["missing-recommendation"];
    input.scenarios[0].steps[0].primaryRecommendationIds = ["missing-recommendation"];

    expect(() => validateContentData(input)).toThrow(/scenario.+unknown recommendation/i);
  });

  it("requires featured recommendations to have an order", () => {
    const input = createValidContentData();
    Reflect.deleteProperty(input.recommendations[0], "featuredOrder");

    expect(() => validateContentData(input)).toThrow(/featured recommendation.+order/i);
  });

  it("rejects featured order on non-featured recommendations", () => {
    const input = createValidContentData();
    input.recommendations[0].featured = false;

    expect(() => validateContentData(input)).toThrow(/non-featured recommendation.+order/i);
  });

  it("rejects duplicate featured order values", () => {
    const input = createValidContentData();
    input.recommendations.push({
      ...structuredClone(input.recommendations[0]),
      id: "rec-two",
      slug: "tool-two",
      name: "Tool Two",
      relatedScenarioIds: [],
      relatedProjectIds: [],
    });

    expect(() => validateContentData(input)).toThrow(/duplicate featured order/i);
  });

  it("requires published recommendations to have a publication date", () => {
    const input = createValidContentData();
    Reflect.deleteProperty(input.recommendations[0], "publishedAt");

    expect(() => validateContentData(input)).toThrow(/published recommendation.+publishedAt/i);
  });

  it("rejects duplicate scenario step order", () => {
    const input = createValidContentData();
    input.scenarios[0].steps.push({
      ...structuredClone(input.scenarios[0].steps[0]),
      id: "step-two",
    });

    expect(() => validateContentData(input)).toThrow(/duplicate scenario step order/i);
  });

  it("rejects overlap between primary and alternative tools", () => {
    const input = createValidContentData();
    input.scenarios[0].steps[0].alternativeRecommendationIds = ["rec-one"];

    expect(() => validateContentData(input)).toThrow(/primary and alternative.+overlap/i);
  });

  it("requires scenario recommendation summaries to match step tools", () => {
    const input = createValidContentData();
    input.recommendations.push({
      ...structuredClone(input.recommendations[0]),
      id: "rec-two",
      slug: "tool-two",
      name: "Tool Two",
      featured: false,
      relatedScenarioIds: [],
      relatedProjectIds: [],
    });
    Reflect.deleteProperty(input.recommendations[1], "featuredOrder");
    input.scenarios[0].steps[0].alternativeRecommendationIds = ["rec-two"];

    expect(() => validateContentData(input)).toThrow(
      /scenario recommendation summary.+step tools/i,
    );
  });

  it("requires recommendation and scenario relations to be bidirectional", () => {
    const input = createValidContentData();
    input.recommendations[0].relatedScenarioIds = [];

    expect(() => validateContentData(input)).toThrow(/missing reciprocal scenario relation/i);
  });

  it("rejects image paths outside the public asset convention", () => {
    const input = createValidContentData();
    input.recommendations[0].logo = "https://example.com/logo.png";

    expect(() => validateContentData(input)).toThrow();
  });
});
