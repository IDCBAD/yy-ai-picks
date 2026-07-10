import type {
  CategoryRepository,
  ProjectRepository,
  RecommendationRepository,
  ScenarioRepository,
  TagRepository,
} from "@/repositories";
import type { Category, Project, ProjectStatus, Recommendation, Scenario, Tag } from "@/types";

export interface RecommendationServiceDependencies {
  recommendations: RecommendationRepository;
  categories: CategoryRepository;
  tags: TagRepository;
  scenarios: ScenarioRepository;
  projects: ProjectRepository;
}

export interface RecommendationWithRelations {
  recommendation: Recommendation;
  category: Category;
  tags: Tag[];
  scenarios: Scenario[];
  projects: Project[];
}

function orderByIds<T extends { id: string }>(ids: string[], items: T[]): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

export class RecommendationService {
  constructor(private readonly dependencies: RecommendationServiceDependencies) {}

  getPublished(): Promise<Recommendation[]> {
    return this.dependencies.recommendations.getAllPublished();
  }

  getFeatured(): Promise<Recommendation[]> {
    return this.dependencies.recommendations.getFeatured();
  }

  getRecentlyUpdated(limit?: number): Promise<Recommendation[]> {
    return this.dependencies.recommendations.getRecentlyUpdated(limit);
  }

  async getCategoryCounts(): Promise<Record<string, number>> {
    const [categories, recommendations] = await Promise.all([
      this.dependencies.categories.getAllVisible(),
      this.dependencies.recommendations.getAllPublished(),
    ]);
    const counts = Object.fromEntries(categories.map((category) => [category.id, 0]));

    for (const recommendation of recommendations) {
      counts[recommendation.categoryId] = (counts[recommendation.categoryId] ?? 0) + 1;
    }

    return counts;
  }

  async getTagCounts(): Promise<Record<string, number>> {
    const [tags, recommendations] = await Promise.all([
      this.dependencies.tags.getAllVisible(),
      this.dependencies.recommendations.getAllPublished(),
    ]);
    const counts = Object.fromEntries(tags.map((tag) => [tag.id, 0]));

    for (const recommendation of recommendations) {
      for (const tagId of recommendation.tagIds) {
        counts[tagId] = (counts[tagId] ?? 0) + 1;
      }
    }

    return counts;
  }

  async getBySlugWithRelations(slug: string): Promise<RecommendationWithRelations | null> {
    const recommendation = await this.dependencies.recommendations.getBySlug(slug);
    if (!recommendation) {
      return null;
    }

    const [categories, tags, scenarios, projects] = await Promise.all([
      this.dependencies.categories.getAllVisible(),
      this.dependencies.tags.getAllVisible(),
      this.dependencies.scenarios.getAllPublished(),
      this.dependencies.projects.getAllPublished(),
    ]);
    const category = categories.find((item) => item.id === recommendation.categoryId);
    if (!category) {
      throw new Error(`Missing category for recommendation ${recommendation.id}`);
    }

    return {
      recommendation,
      category,
      tags: orderByIds(recommendation.tagIds, tags),
      scenarios: orderByIds(recommendation.relatedScenarioIds, scenarios),
      projects: orderByIds(recommendation.relatedProjectIds, projects),
    };
  }

  async getProjectStatusGroups(): Promise<Record<ProjectStatus, Project[]>> {
    const projects = await this.dependencies.projects.getAllPublished();
    const groups: Record<ProjectStatus, Project[]> = {
      launched: [],
      iterating: [],
      prototype: [],
      experiment: [],
      paused: [],
    };

    for (const project of projects) {
      groups[project.status].push(project);
    }

    return groups;
  }

  async getLatestUpdatedAt(): Promise<string | null> {
    const [recommendations, categories, scenarios, projects] = await Promise.all([
      this.dependencies.recommendations.getAllPublished(),
      this.dependencies.categories.getAllVisible(),
      this.dependencies.scenarios.getAllPublished(),
      this.dependencies.projects.getAllPublished(),
    ]);
    const dates = [
      ...recommendations.map((item) => item.updatedAt),
      ...categories.map((item) => item.updatedAt),
      ...scenarios.map((item) => item.updatedAt),
      ...projects.map((item) => item.updatedAt),
    ];

    return dates.sort((left, right) => Date.parse(right) - Date.parse(left))[0] ?? null;
  }
}
