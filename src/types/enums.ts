export const RECOMMENDATION_RELATIONSHIPS = [
  "daily-use",
  "long-term-use",
  "used-in-project",
  "testing",
  "watching",
  "my-product",
] as const;

export const PUBLISH_STATUSES = ["draft", "published", "archived", "unavailable"] as const;

export const RECOMMENDATION_AVAILABILITIES = [
  "available",
  "limited",
  "unavailable",
  "unknown",
] as const;

export const PRICING_TYPES = ["free", "freemium", "paid", "open-source"] as const;

export const PROJECT_STATUSES = ["launched", "prototype"] as const;

export const TAG_GROUPS = ["capability", "scenario", "attribute"] as const;

export const PLATFORM_TYPES = [
  "web",
  "macos",
  "windows",
  "linux",
  "ios",
  "android",
  "cli",
  "api",
  "self-hosted",
  "browser-extension",
  "nodejs",
  "python",
  "react",
] as const;

export const ARTICLE_TYPES = ["article", "guide", "video", "case-study", "documentation"] as const;

export const UPDATE_LOG_TYPES = [
  "added",
  "updated",
  "status-change",
  "checked",
  "archived",
] as const;

export const EDITORIAL_STATUSES = ["verified", "needs-review"] as const;

export const SORT_OPTIONS = ["recently-updated", "recently-added", "featured", "name"] as const;

export type RecommendationRelationship = (typeof RECOMMENDATION_RELATIONSHIPS)[number];
export type PublishStatus = (typeof PUBLISH_STATUSES)[number];
export type RecommendationAvailability = (typeof RECOMMENDATION_AVAILABILITIES)[number];
export type PricingType = (typeof PRICING_TYPES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type TagGroup = (typeof TAG_GROUPS)[number];
export type PlatformType = (typeof PLATFORM_TYPES)[number];
export type ArticleType = (typeof ARTICLE_TYPES)[number];
export type UpdateLogType = (typeof UPDATE_LOG_TYPES)[number];
export type EditorialStatus = (typeof EDITORIAL_STATUSES)[number];
export type SortOption = (typeof SORT_OPTIONS)[number];
