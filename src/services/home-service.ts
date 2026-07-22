import type {
  CategoryRepository,
  ProjectRepository,
  ScenarioRepository,
  TagRepository,
} from "@/repositories";
import type {
  Category,
  Project,
  Recommendation,
  RecommendationQuery,
  RecommendationRelationship,
  Scenario,
  Tag,
} from "@/types";
import { RECOMMENDATION_RELATIONSHIPS } from "@/types";

import type { FilterService } from "./filter-service";
import type { RecommendationService, ResolvedRecommendation } from "./recommendation-service";

export interface CategorySummary {
  category: Category;
  count: number;
}

export interface HomePageData {
  query: RecommendationQuery;
  publishedCount: number;
  lastUpdatedAt: string | null;
  recent: ResolvedRecommendation[];
  scenarios: Scenario[];
  categories: Category[];
  categorySummaries: CategorySummary[];
  relationshipCounts: Record<RecommendationRelationship, number>;
  popularTags: Tag[];
  longTerm: ResolvedRecommendation[];
  filtered: ResolvedRecommendation[];
  projects: Project[];
}

export interface HomeServiceDependencies {
  recommendationService: RecommendationService;
  categories: CategoryRepository;
  tags: TagRepository;
  scenarios: ScenarioRepository;
  projects: ProjectRepository;
  filterService: FilterService;
}

function resolveCards(
  recommendations: Recommendation[],
  categories: Category[],
  tags: Tag[],
): ResolvedRecommendation[] {
  const categoriesById = new Map(categories.map((item) => [item.id, item]));
  const tagsById = new Map(tags.map((item) => [item.id, item]));

  return recommendations.map((recommendation) => {
    const category = categoriesById.get(recommendation.categoryId);
    if (!category) {
      throw new Error(`Missing category for recommendation ${recommendation.id}`);
    }
    return {
      recommendation,
      category,
      tags: recommendation.tagIds.flatMap((tagId) => {
        const tag = tagsById.get(tagId);
        return tag ? [tag] : [];
      }),
    };
  });
}

export class HomeService {
  constructor(private readonly dependencies: HomeServiceDependencies) {}

  async getPageData(query: RecommendationQuery): Promise<HomePageData> {
    const [
      recommendations,
      recent,
      lastUpdatedAt,
      categoryCounts,
      tagCounts,
      categories,
      tags,
      scenarios,
      projects,
    ] = await Promise.all([
      this.dependencies.recommendationService.getPublished(),
      this.dependencies.recommendationService.getRecentlyUpdated(4),
      this.dependencies.recommendationService.getLatestUpdatedAt(),
      this.dependencies.recommendationService.getCategoryCounts(),
      this.dependencies.recommendationService.getTagCounts(),
      this.dependencies.categories.getAllVisible(),
      this.dependencies.tags.getAllVisible(),
      this.dependencies.scenarios.getAllPublished(),
      this.dependencies.projects.getAllPublished(),
    ]);

    const category = query.category
      ? categories.find((item) => item.slug === query.category)
      : undefined;
    const tagsBySlug = new Map(tags.map((item) => [item.slug, item.id]));
    const verifiedRecommendations = recommendations.filter(
      (item) => item.editorialStatus === "verified",
    );
    const filterSource = query.relationship ? verifiedRecommendations : recommendations;
    const filtered = this.dependencies.filterService.apply(filterSource, {
      categoryId: category?.id,
      relationship: query.relationship,
      pricing: query.pricing,
      openSource: query.openSource,
      selfHostable: query.selfHostable,
      platform: query.platform,
      tagIds: query.tags.flatMap((slug) => {
        const id = tagsBySlug.get(slug);
        return id ? [id] : [];
      }),
      sort: query.sort,
    });
    const longTerm = this.dependencies.filterService
      .apply(verifiedRecommendations, { sort: "featured" })
      .filter((item) => item.relationship === "daily-use" || item.relationship === "long-term-use")
      .slice(0, 6);
    const relationshipCounts = Object.fromEntries(
      RECOMMENDATION_RELATIONSHIPS.map((relationship) => [
        relationship,
        verifiedRecommendations.filter((item) => item.relationship === relationship).length,
      ]),
    ) as Record<RecommendationRelationship, number>;

    return {
      query: { ...query, category: category?.slug },
      publishedCount: recommendations.length,
      lastUpdatedAt,
      recent: resolveCards(recent, categories, tags),
      scenarios,
      categories,
      categorySummaries: categories.map((item) => ({
        category: item,
        count: categoryCounts[item.id] ?? 0,
      })),
      relationshipCounts,
      popularTags: [...tags]
        .sort((left, right) => (tagCounts[right.id] ?? 0) - (tagCounts[left.id] ?? 0))
        .slice(0, 5),
      longTerm: resolveCards(longTerm, categories, tags),
      filtered: resolveCards(filtered, categories, tags),
      projects: projects.slice(0, 2),
    };
  }
}
