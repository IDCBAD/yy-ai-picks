import { contentData } from "@/content";
import type {
  ArticleReference,
  Category,
  ContentData,
  Project,
  Recommendation,
  Scenario,
} from "@/types";

import type {
  ArticleRepository,
  CategoryRepository,
  ProjectRepository,
  RecommendationRepository,
  ScenarioRepository,
} from "./contracts";

export class LocalRecommendationRepository implements RecommendationRepository {
  constructor(private readonly data: ContentData = contentData) {}

  async getAllPublished(): Promise<Recommendation[]> {
    return this.data.recommendations.filter((item) => item.publishStatus === "published");
  }

  async getBySlug(slug: string): Promise<Recommendation | null> {
    return this.data.recommendations.find((item) => item.slug === slug) ?? null;
  }

  async getByCategory(categoryId: string): Promise<Recommendation[]> {
    return this.data.recommendations.filter(
      (item) => item.publishStatus === "published" && item.categoryId === categoryId,
    );
  }

  async getFeatured(): Promise<Recommendation[]> {
    return this.data.recommendations
      .filter((item) => item.publishStatus === "published" && item.featured)
      .sort((left, right) => (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0));
  }

  async getRecentlyUpdated(limit?: number): Promise<Recommendation[]> {
    const sorted = this.data.recommendations
      .filter((item) => item.publishStatus === "published")
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));

    return limit === undefined ? sorted : sorted.slice(0, Math.max(0, limit));
  }
}

export class LocalCategoryRepository implements CategoryRepository {
  constructor(private readonly data: ContentData = contentData) {}

  async getAllVisible(): Promise<Category[]> {
    return this.data.categories.filter((item) => item.visible).sort((a, b) => a.order - b.order);
  }

  async getBySlug(slug: string): Promise<Category | null> {
    return this.data.categories.find((item) => item.slug === slug) ?? null;
  }
}

export class LocalScenarioRepository implements ScenarioRepository {
  constructor(private readonly data: ContentData = contentData) {}

  async getAllPublished(): Promise<Scenario[]> {
    return this.data.scenarios.filter((item) => item.publishStatus === "published");
  }

  async getBySlug(slug: string): Promise<Scenario | null> {
    return this.data.scenarios.find((item) => item.slug === slug) ?? null;
  }
}

export class LocalProjectRepository implements ProjectRepository {
  constructor(private readonly data: ContentData = contentData) {}

  async getAllPublished(): Promise<Project[]> {
    return this.data.projects.filter((item) => item.publishStatus === "published");
  }

  async getBySlug(slug: string): Promise<Project | null> {
    return this.data.projects.find((item) => item.slug === slug) ?? null;
  }
}

export class LocalArticleRepository implements ArticleRepository {
  constructor(private readonly data: ContentData = contentData) {}

  async getAll(): Promise<ArticleReference[]> {
    return [...this.data.articles];
  }

  async getById(id: string): Promise<ArticleReference | null> {
    return this.data.articles.find((item) => item.id === id) ?? null;
  }
}
