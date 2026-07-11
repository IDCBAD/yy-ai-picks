import {
  LocalCategoryRepository,
  LocalProjectRepository,
  LocalRecommendationRepository,
  LocalScenarioRepository,
  LocalTagRepository,
} from "@/repositories";
import { FilterService, HomeService, RecommendationService } from "@/services";

const recommendations = new LocalRecommendationRepository();
const categories = new LocalCategoryRepository();
const tags = new LocalTagRepository();
const scenarios = new LocalScenarioRepository();
const projects = new LocalProjectRepository();

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
  filterService: new FilterService(),
});
