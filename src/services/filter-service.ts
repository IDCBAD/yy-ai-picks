import type { Recommendation, RecommendationFilterCriteria, SortOption } from "@/types";

function compareRecommendations(
  left: Recommendation,
  right: Recommendation,
  sort: SortOption,
): number {
  switch (sort) {
    case "recently-updated":
      return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
    case "recently-added":
      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    case "featured": {
      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1;
      }
      if (left.featured && right.featured) {
        return (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0);
      }
      return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
    }
    case "name":
      return left.name.localeCompare(right.name, "en", { sensitivity: "base" });
  }
}

export class FilterService {
  apply(
    recommendations: Recommendation[],
    criteria: RecommendationFilterCriteria,
  ): Recommendation[] {
    const filtered = recommendations.filter((recommendation) => {
      if (criteria.categoryId && recommendation.categoryId !== criteria.categoryId) {
        return false;
      }
      if (criteria.relationship && recommendation.relationship !== criteria.relationship) {
        return false;
      }
      if (criteria.pricing && recommendation.pricing !== criteria.pricing) {
        return false;
      }
      if (
        criteria.openSource !== undefined &&
        recommendation.isOpenSource !== criteria.openSource
      ) {
        return false;
      }
      if (
        criteria.selfHostable !== undefined &&
        recommendation.selfHostable !== criteria.selfHostable
      ) {
        return false;
      }
      if (criteria.platform && !recommendation.platforms.includes(criteria.platform)) {
        return false;
      }
      if (
        criteria.tagIds?.length &&
        !criteria.tagIds.every((tagId) => recommendation.tagIds.includes(tagId))
      ) {
        return false;
      }
      return true;
    });

    const { sort } = criteria;
    return sort ? filtered.sort((left, right) => compareRecommendations(left, right, sort)) : filtered;
  }
}
