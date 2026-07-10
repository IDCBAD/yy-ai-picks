import type { PlatformType, PricingType, RecommendationRelationship, SortOption } from "./enums";

export interface RecommendationQuery {
  q: string;
  category?: string;
  relationship?: RecommendationRelationship;
  pricing?: PricingType;
  openSource?: boolean;
  selfHostable?: boolean;
  platform?: PlatformType;
  tags: string[];
  sort: SortOption;
}
