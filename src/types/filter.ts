import type { PlatformType, PricingType, RecommendationRelationship, SortOption } from "./enums";

export interface RecommendationFilterCriteria {
  categoryId?: string;
  relationship?: RecommendationRelationship;
  pricing?: PricingType;
  openSource?: boolean;
  selfHostable?: boolean;
  platform?: PlatformType;
  tagIds?: string[];
  sort?: SortOption;
}
