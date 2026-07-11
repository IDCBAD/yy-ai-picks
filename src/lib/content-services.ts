import {
  LocalArticleRepository,
  LocalCategoryRepository,
  LocalProjectRepository,
  LocalRecommendationRepository,
  LocalScenarioRepository,
  LocalTagRepository,
} from "@/repositories";
import {
  CategoryService,
  FilterService,
  HomeService,
  ProjectService,
  RecommendationService,
  ScenarioService,
  SearchService,
} from "@/services";

const recommendations = new LocalRecommendationRepository();
const categories = new LocalCategoryRepository();
const tags = new LocalTagRepository();
const scenarios = new LocalScenarioRepository();
const projects = new LocalProjectRepository();
const articles = new LocalArticleRepository();
const filterService = new FilterService();

export const recommendationService = new RecommendationService({
  recommendations,
  categories,
  tags,
  scenarios,
  projects,
});

export const homeService = new HomeService({
  recommendationService,
  categories,
  tags,
  scenarios,
  projects,
  filterService,
});

export const categoryService = new CategoryService({
  categories,
  tags,
  recommendations,
  scenarios,
  articles,
  filterService,
});

export const scenarioService = new ScenarioService({
  scenarios,
  recommendations,
  categories,
  tags,
  articles,
});

export const searchService = new SearchService({
  recommendations,
  categories,
  tags,
  scenarios,
  projects,
  articles,
});

export const projectService = new ProjectService({ projects });
