import { validateContentData } from "../lib/validation";

import { articles } from "./articles";
import { categories } from "./categories";
import { projects } from "./projects";
import { recommendations } from "./recommendations";
import { scenarios } from "./scenarios";
import { tags } from "./tags";

export { articles, categories, projects, recommendations, scenarios, tags };

export const contentData = validateContentData({
  categories,
  tags,
  recommendations,
  scenarios,
  projects,
  articles,
});
