import type { MetadataRoute } from "next";

import {
  categoryService,
  projectService,
  recommendationService,
  scenarioService,
} from "@/lib/content-services";
import { siteConfig } from "@/lib/site-config";

function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, scenarios, recommendations, projects, latestUpdatedAt] = await Promise.all([
    categoryService.getVisible(),
    scenarioService.getPublished(),
    recommendationService.getPublished(),
    projectService.getPageData(),
    recommendationService.getLatestUpdatedAt(),
  ]);
  const siteUpdatedAt = latestUpdatedAt ?? "2026-07-10T00:00:00.000Z";

  return [
    {
      url: absoluteUrl("/"),
      lastModified: siteUpdatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...categories.map((category) => ({
      url: absoluteUrl(`/categories/${category.slug}`),
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...scenarios.map((scenario) => ({
      url: absoluteUrl(`/scenarios/${scenario.slug}`),
      lastModified: scenario.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...recommendations.map((recommendation) => ({
      url: absoluteUrl(`/recommendations/${recommendation.slug}`),
      lastModified: recommendation.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: absoluteUrl("/projects"),
      lastModified: projects.lastUpdatedAt ?? siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
