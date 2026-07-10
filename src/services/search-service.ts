import type {
  ArticleRepository,
  CategoryRepository,
  ProjectRepository,
  RecommendationRepository,
  ScenarioRepository,
  TagRepository,
} from "@/repositories";
import type { SearchResult, SearchResults } from "@/types";

export interface SearchServiceDependencies {
  recommendations: RecommendationRepository;
  categories: CategoryRepository;
  tags: TagRepository;
  scenarios: ScenarioRepository;
  projects: ProjectRepository;
  articles: ArticleRepository;
}

function normalize(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("en-US");
}

function findMatchedFields(
  fields: Record<string, string | string[]>,
  normalizedQuery: string,
): string[] {
  return Object.entries(fields)
    .filter(([, value]) => {
      const values = Array.isArray(value) ? value : [value];
      return values.some((candidate) => normalize(candidate).includes(normalizedQuery));
    })
    .map(([field]) => field);
}

function toSearchResult<T>(item: T, matchedFields: string[]): SearchResult<T> {
  return { item, matchedFields };
}

export class SearchService {
  constructor(private readonly dependencies: SearchServiceDependencies) {}

  async search(query: string): Promise<SearchResults> {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
      return {
        recommendations: [],
        scenarios: [],
        projects: [],
        articles: [],
        total: 0,
      };
    }

    const [recommendations, categories, tags, scenarios, projects, articles] = await Promise.all([
      this.dependencies.recommendations.getAllPublished(),
      this.dependencies.categories.getAllVisible(),
      this.dependencies.tags.getAllVisible(),
      this.dependencies.scenarios.getAllPublished(),
      this.dependencies.projects.getAllPublished(),
      this.dependencies.articles.getAll(),
    ]);
    const categoriesById = new Map(categories.map((item) => [item.id, item]));
    const tagsById = new Map(tags.map((item) => [item.id, item]));
    const scenariosById = new Map(scenarios.map((item) => [item.id, item]));
    const projectsById = new Map(projects.map((item) => [item.id, item]));

    const recommendationResults = recommendations.flatMap((recommendation) => {
      const category = categoriesById.get(recommendation.categoryId);
      const recommendationTags = recommendation.tagIds.flatMap((id) => {
        const tag = tagsById.get(id);
        return tag ? [tag.name, tag.slug] : [];
      });
      const recommendationScenarios = recommendation.relatedScenarioIds.flatMap((id) => {
        const scenario = scenariosById.get(id);
        return scenario ? [scenario.title, scenario.shortDescription] : [];
      });
      const recommendationProjects = recommendation.relatedProjectIds.flatMap((id) => {
        const project = projectsById.get(id);
        return project ? [project.name, project.shortDescription] : [];
      });
      const matchedFields = findMatchedFields(
        {
          name: recommendation.name,
          url: recommendation.url,
          description: recommendation.shortDescription,
          category: category ? [category.name, category.slug] : [],
          tags: recommendationTags,
          reason: recommendation.recommendationReason,
          scenarios: recommendationScenarios,
          projects: recommendationProjects,
          articles: recommendation.relatedArticles.flatMap((article) => [
            article.title,
            article.description,
          ]),
        },
        normalizedQuery,
      );

      return matchedFields.length > 0 ? [toSearchResult(recommendation, matchedFields)] : [];
    });

    const scenarioResults = scenarios.flatMap((scenario) => {
      const recommendationNames = scenario.recommendationIds.flatMap((id) => {
        const recommendation = recommendations.find((item) => item.id === id);
        return recommendation ? [recommendation.name] : [];
      });
      const matchedFields = findMatchedFields(
        {
          title: scenario.title,
          description: [scenario.shortDescription, scenario.longDescription],
          audience: scenario.audience,
          recommendations: recommendationNames,
        },
        normalizedQuery,
      );
      return matchedFields.length > 0 ? [toSearchResult(scenario, matchedFields)] : [];
    });

    const projectResults = projects.flatMap((project) => {
      const matchedFields = findMatchedFields(
        {
          name: project.name,
          description: [project.shortDescription, project.problem],
          features: project.coreFeatures,
          technology: project.techStack,
        },
        normalizedQuery,
      );
      return matchedFields.length > 0 ? [toSearchResult(project, matchedFields)] : [];
    });

    const articleResults = articles.flatMap((article) => {
      const matchedFields = findMatchedFields(
        {
          title: article.title,
          description: article.description,
          url: article.url,
        },
        normalizedQuery,
      );
      return matchedFields.length > 0 ? [toSearchResult(article, matchedFields)] : [];
    });

    return {
      recommendations: recommendationResults,
      scenarios: scenarioResults,
      projects: projectResults,
      articles: articleResults,
      total:
        recommendationResults.length +
        scenarioResults.length +
        projectResults.length +
        articleResults.length,
    };
  }
}
