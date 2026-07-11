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
  Scenario,
  ScenarioStep,
  Tag,
} from "@/types";

export interface ScenarioServiceDependencies {
  scenarios: ScenarioRepository;
  recommendations: RecommendationRepository;
  categories: CategoryRepository;
  tags: TagRepository;
  articles: ArticleRepository;
}

export interface ScenarioRecommendation extends Recommendation {
  category: Category;
  tags: Tag[];
}

export interface ResolvedScenarioStep {
  step: ScenarioStep;
  primaryRecommendations: ScenarioRecommendation[];
  alternativeRecommendations: ScenarioRecommendation[];
}

export interface ResolvedScenario {
  scenario: Scenario;
  steps: ResolvedScenarioStep[];
  recommendations: ScenarioRecommendation[];
  relatedCategories: Category[];
  relatedArticles: ArticleReference[];
}

function resolveIds(
  ids: string[],
  byId: Map<string, ScenarioRecommendation>,
): ScenarioRecommendation[] {
  return ids.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

function collectStepRecommendationIds(scenario: Scenario): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];

  for (const step of scenario.steps) {
    for (const id of [...step.primaryRecommendationIds, ...step.alternativeRecommendationIds]) {
      if (!seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    }
  }

  return ids;
}

export class ScenarioService {
  constructor(private readonly dependencies: ScenarioServiceDependencies) {}

  getPublished(): Promise<Scenario[]> {
    return this.dependencies.scenarios.getAllPublished();
  }

  async getBySlugWithRecommendations(slug: string): Promise<ResolvedScenario | null> {
    const scenario = await this.dependencies.scenarios.getBySlug(slug);
    if (!scenario || scenario.publishStatus !== "published") {
      return null;
    }

    const [recommendations, categories, tags, articles] = await Promise.all([
      this.dependencies.recommendations.getAllPublished(),
      this.dependencies.categories.getAllVisible(),
      this.dependencies.tags.getAllVisible(),
      this.dependencies.articles.getAll(),
    ]);
    const categoriesById = new Map(categories.map((item) => [item.id, item]));
    const tagsById = new Map(tags.map((item) => [item.id, item]));
    const resolvedRecommendations = recommendations.flatMap((recommendation) => {
      const category = categoriesById.get(recommendation.categoryId);
      if (!category) {
        return [];
      }
      return [
        {
          ...recommendation,
          category,
          tags: recommendation.tagIds.flatMap((tagId) => {
            const tag = tagsById.get(tagId);
            return tag ? [tag] : [];
          }),
        },
      ];
    });
    const byId = new Map(resolvedRecommendations.map((item) => [item.id, item]));
    const steps = [...scenario.steps].sort((left, right) => left.order - right.order);
    const scenarioRecommendations = resolveIds(
      collectStepRecommendationIds({ ...scenario, steps }),
      byId,
    );
    const relatedCategoryIds = new Set(scenarioRecommendations.map((item) => item.category.id));
    const relatedArticleIds = new Set(scenario.relatedArticles.map((article) => article.id));

    return {
      scenario,
      recommendations: scenarioRecommendations,
      steps: steps.map((step) => ({
        step,
        primaryRecommendations: resolveIds(step.primaryRecommendationIds, byId),
        alternativeRecommendations: resolveIds(step.alternativeRecommendationIds, byId),
      })),
      relatedCategories: categories.filter((category) => relatedCategoryIds.has(category.id)),
      relatedArticles: articles.filter((article) => relatedArticleIds.has(article.id)),
    };
  }

  getPageData(slug: string): Promise<ResolvedScenario | null> {
    return this.getBySlugWithRecommendations(slug);
  }

  async getUniqueRecommendations(slug: string): Promise<Recommendation[]> {
    const resolved = await this.getBySlugWithRecommendations(slug);
    if (!resolved) {
      return [];
    }

    const seen = new Set<string>();
    return resolved.recommendations.filter((recommendation) => {
      if (seen.has(recommendation.id)) {
        return false;
      }
      seen.add(recommendation.id);
      return true;
    });
  }

  async getRecommendationCount(slug: string): Promise<number> {
    return (await this.getUniqueRecommendations(slug)).length;
  }
}
