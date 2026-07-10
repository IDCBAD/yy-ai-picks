import type { ArticleReference, Category, Project, Recommendation, Scenario, Tag } from "@/types";

export interface RecommendationRepository {
  getAllPublished(): Promise<Recommendation[]>;
  getBySlug(slug: string): Promise<Recommendation | null>;
  getByCategory(categoryId: string): Promise<Recommendation[]>;
  getFeatured(): Promise<Recommendation[]>;
  getRecentlyUpdated(limit?: number): Promise<Recommendation[]>;
}

export interface CategoryRepository {
  getAllVisible(): Promise<Category[]>;
  getBySlug(slug: string): Promise<Category | null>;
}

export interface ScenarioRepository {
  getAllPublished(): Promise<Scenario[]>;
  getBySlug(slug: string): Promise<Scenario | null>;
}

export interface ProjectRepository {
  getAllPublished(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
}

export interface ArticleRepository {
  getAll(): Promise<ArticleReference[]>;
  getById(id: string): Promise<ArticleReference | null>;
}

export interface TagRepository {
  getAllVisible(): Promise<Tag[]>;
  getById(id: string): Promise<Tag | null>;
}
