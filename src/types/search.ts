import type { ArticleReference, Project, Recommendation, Scenario } from "./entities";

export interface SearchResult<T> {
  item: T;
  matchedFields: string[];
}

export type RecommendationSearchResult = SearchResult<Recommendation>;
export type ScenarioSearchResult = SearchResult<Scenario>;
export type ProjectSearchResult = SearchResult<Project>;
export type ArticleSearchResult = SearchResult<ArticleReference>;

export interface SearchResults {
  recommendations: RecommendationSearchResult[];
  scenarios: ScenarioSearchResult[];
  projects: ProjectSearchResult[];
  articles: ArticleSearchResult[];
  total: number;
}
