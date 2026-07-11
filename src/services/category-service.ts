import type {
  ArticleRepository,
  CategoryRepository,
  RecommendationRepository,
  ScenarioRepository,
  TagRepository,
} from "@/repositories";
import type {
  ArticleReference,
  Category,
  Recommendation,
  RecommendationQuery,
  Scenario,
  Tag,
} from "@/types";

import type { FilterService } from "./filter-service";
import type { ResolvedRecommendation } from "./recommendation-service";

export type CategoryPageQuery = Pick<RecommendationQuery, "sort" | "tags">;

export interface CategoryTagSummary {
  tag: Tag;
  count: number;
}

export interface CategoryPageData {
  category: Category;
  query: CategoryPageQuery;
  publishedCount: number;
  filteredCount: number;
  lastUpdatedAt: string;
  tags: Tag[];
  tagSummaries: CategoryTagSummary[];
  recommendations: ResolvedRecommendation[];
  relatedScenarios: Scenario[];
  relatedArticles: ArticleReference[];
}

export interface CategoryServiceDependencies {
  categories: CategoryRepository;
  tags: TagRepository;
  recommendations: RecommendationRepository;
  scenarios: ScenarioRepository;
  articles: ArticleRepository;
  filterService: FilterService;
}

function resolveRecommendations(
  recommendations: Recommendation[],
  category: Category,
  tags: Tag[],
): ResolvedRecommendation[] {
  const tagsById = new Map(tags.map((tag) => [tag.id, tag]));

  return recommendations.map((recommendation) => ({
    recommendation,
    category,
    tags: recommendation.tagIds.flatMap((tagId) => {
      const tag = tagsById.get(tagId);
      return tag ? [tag] : [];
    }),
  }));
}

function getLatestUpdatedAt(category: Category, recommendations: Recommendation[]): string {
  return [category.updatedAt, ...recommendations.map((item) => item.updatedAt)].sort(
    (left, right) => Date.parse(right) - Date.parse(left),
  )[0];
}

export class CategoryService {
  constructor(private readonly dependencies: CategoryServiceDependencies) {}

  getVisible(): Promise<Category[]> {
    return this.dependencies.categories.getAllVisible();
  }

  async getPageData(slug: string, query: CategoryPageQuery): Promise<CategoryPageData | null> {
    const category = await this.dependencies.categories.getBySlug(slug);
    if (!category?.visible) {
      return null;
    }

    const [recommendations, visibleTags, scenarios, articles] = await Promise.all([
      this.dependencies.recommendations.getByCategory(category.id),
      this.dependencies.tags.getAllVisible(),
      this.dependencies.scenarios.getAllPublished(),
      this.dependencies.articles.getAll(),
    ]);
    const usedTagIds = new Set(recommendations.flatMap((item) => item.tagIds));
    const categoryTags = visibleTags.filter((tag) => usedTagIds.has(tag.id));
    const tagSummaries = categoryTags.map((tag) => ({
      tag,
      count: recommendations.filter((recommendation) => recommendation.tagIds.includes(tag.id))
        .length,
    }));
    const tagIdsBySlug = new Map(categoryTags.map((tag) => [tag.slug, tag.id]));
    const normalizedTagSlugs = [...new Set(query.tags)].filter((tag) => tagIdsBySlug.has(tag));
    const filtered = this.dependencies.filterService.apply(recommendations, {
      tagIds: normalizedTagSlugs.flatMap((tag) => {
        const tagId = tagIdsBySlug.get(tag);
        return tagId ? [tagId] : [];
      }),
      sort: query.sort,
    });
    const relatedScenarioIds = new Set(
      recommendations.flatMap((recommendation) => recommendation.relatedScenarioIds),
    );
    const relatedArticleIds = new Set(
      recommendations.flatMap((recommendation) =>
        recommendation.relatedArticles.map((article) => article.id),
      ),
    );

    return {
      category,
      query: { sort: query.sort, tags: normalizedTagSlugs },
      publishedCount: recommendations.length,
      filteredCount: filtered.length,
      lastUpdatedAt: getLatestUpdatedAt(category, recommendations),
      tags: categoryTags,
      tagSummaries,
      recommendations: resolveRecommendations(filtered, category, visibleTags),
      relatedScenarios: scenarios.filter((scenario) => relatedScenarioIds.has(scenario.id)),
      relatedArticles: articles.filter((article) => relatedArticleIds.has(article.id)),
    };
  }
}
