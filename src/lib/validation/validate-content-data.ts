import type { ContentData } from "@/types";

import { contentDataSchema } from "./content-schemas";

export class ContentValidationError extends Error {
  constructor(readonly issues: string[]) {
    super(issues.join("\n"));
    this.name = "ContentValidationError";
  }
}

function collectDuplicates<T>(
  items: T[],
  getValue: (item: T) => string,
  label: string,
  issues: string[],
) {
  const seen = new Set<string>();

  for (const item of items) {
    const value = getValue(item);
    if (seen.has(value)) {
      issues.push(`Duplicate ${label}: ${value}`);
    }
    seen.add(value);
  }
}

function collectDuplicateValues(values: string[], label: string, issues: string[]) {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      issues.push(`Duplicate ${label}: ${value}`);
    }
    seen.add(value);
  }
}

export function validateContentData(input: unknown): ContentData {
  const data = contentDataSchema.parse(input);
  const issues: string[] = [];

  collectDuplicates(data.categories, (item) => item.id, "category ID", issues);
  collectDuplicates(data.categories, (item) => item.slug, "category slug", issues);
  collectDuplicates(data.tags, (item) => item.id, "tag ID", issues);
  collectDuplicates(data.tags, (item) => item.slug, "tag slug", issues);
  collectDuplicates(data.tags, (item) => item.name, "tag name", issues);
  collectDuplicates(data.recommendations, (item) => item.id, "recommendation ID", issues);
  collectDuplicates(data.recommendations, (item) => item.slug, "recommendation slug", issues);
  collectDuplicates(data.scenarios, (item) => item.id, "scenario ID", issues);
  collectDuplicates(data.scenarios, (item) => item.slug, "scenario slug", issues);
  collectDuplicates(data.projects, (item) => item.id, "project ID", issues);
  collectDuplicates(data.projects, (item) => item.slug, "project slug", issues);
  collectDuplicates(data.articles, (item) => item.id, "article ID", issues);

  const categoryIds = new Set(data.categories.map((item) => item.id));
  const tagIds = new Set(data.tags.map((item) => item.id));
  const recommendationIds = new Set(data.recommendations.map((item) => item.id));
  const scenarioIds = new Set(data.scenarios.map((item) => item.id));
  const projectIds = new Set(data.projects.map((item) => item.id));
  const articleIds = new Set(data.articles.map((item) => item.id));
  const featuredOrders = new Set<number>();

  for (const recommendation of data.recommendations) {
    if (!categoryIds.has(recommendation.categoryId)) {
      issues.push(
        `Recommendation ${recommendation.id} references unknown category: ${recommendation.categoryId}`,
      );
    }

    collectDuplicateValues(recommendation.tagIds, "tag relation", issues);
    collectDuplicateValues(recommendation.relatedScenarioIds, "scenario relation", issues);
    collectDuplicateValues(
      recommendation.relatedRecommendationIds,
      "recommendation relation",
      issues,
    );
    collectDuplicateValues(recommendation.relatedProjectIds, "project relation", issues);

    for (const tagId of recommendation.tagIds) {
      if (!tagIds.has(tagId)) {
        issues.push(`Recommendation ${recommendation.id} references unknown tag: ${tagId}`);
      }
    }
    for (const scenarioId of recommendation.relatedScenarioIds) {
      if (!scenarioIds.has(scenarioId)) {
        issues.push(`Recommendation ${recommendation.id} references unknown scenario: ${scenarioId}`);
      }
    }
    for (const relatedId of recommendation.relatedRecommendationIds) {
      if (relatedId === recommendation.id) {
        issues.push(`Recommendation ${recommendation.id} cannot reference itself`);
      } else if (!recommendationIds.has(relatedId)) {
        issues.push(
          `Recommendation ${recommendation.id} references unknown related recommendation: ${relatedId}`,
        );
      }
    }
    for (const projectId of recommendation.relatedProjectIds) {
      if (!projectIds.has(projectId)) {
        issues.push(`Recommendation ${recommendation.id} references unknown project: ${projectId}`);
      }
    }
    for (const article of recommendation.relatedArticles) {
      if (!articleIds.has(article.id)) {
        issues.push(`Recommendation ${recommendation.id} references unknown article: ${article.id}`);
      }
    }

    if (recommendation.featured && recommendation.featuredOrder === undefined) {
      issues.push(`Featured recommendation ${recommendation.id} requires an order`);
    }
    if (!recommendation.featured && recommendation.featuredOrder !== undefined) {
      issues.push(`Non-featured recommendation ${recommendation.id} cannot have an order`);
    }
    if (recommendation.featuredOrder !== undefined) {
      if (featuredOrders.has(recommendation.featuredOrder)) {
        issues.push(`Duplicate featured order: ${recommendation.featuredOrder}`);
      }
      featuredOrders.add(recommendation.featuredOrder);
    }
    if (recommendation.publishStatus === "published" && !recommendation.publishedAt) {
      issues.push(`Published recommendation ${recommendation.id} requires publishedAt`);
    }
  }

  for (const scenario of data.scenarios) {
    collectDuplicateValues(scenario.recommendationIds, "scenario recommendation relation", issues);
    const stepOrders = new Set<number>();

    for (const recommendationId of scenario.recommendationIds) {
      if (!recommendationIds.has(recommendationId)) {
        issues.push(`Scenario ${scenario.id} references unknown recommendation: ${recommendationId}`);
      }
    }

    for (const article of scenario.relatedArticles) {
      if (!articleIds.has(article.id)) {
        issues.push(`Scenario ${scenario.id} references unknown article: ${article.id}`);
      }
    }

    for (const step of scenario.steps) {
      if (stepOrders.has(step.order)) {
        issues.push(`Duplicate scenario step order in ${scenario.id}: ${step.order}`);
      }
      stepOrders.add(step.order);

      collectDuplicateValues(step.primaryRecommendationIds, "primary recommendation relation", issues);
      collectDuplicateValues(
        step.alternativeRecommendationIds,
        "alternative recommendation relation",
        issues,
      );

      for (const recommendationId of [
        ...step.primaryRecommendationIds,
        ...step.alternativeRecommendationIds,
      ]) {
        if (!recommendationIds.has(recommendationId)) {
          issues.push(
            `Scenario ${scenario.id} step ${step.id} references unknown recommendation: ${recommendationId}`,
          );
        }
      }

      const primaryIds = new Set(step.primaryRecommendationIds);
      const overlap = step.alternativeRecommendationIds.filter((id) => primaryIds.has(id));
      if (overlap.length > 0) {
        issues.push(
          `Primary and alternative recommendations overlap in ${scenario.id}/${step.id}: ${overlap.join(", ")}`,
        );
      }
    }
  }

  if (issues.length > 0) {
    throw new ContentValidationError(issues);
  }

  return data;
}
