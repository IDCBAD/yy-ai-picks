import { z } from "zod";

import {
  ARTICLE_TYPES,
  EDITORIAL_STATUSES,
  PLATFORM_TYPES,
  PRICING_TYPES,
  PROJECT_STATUSES,
  PUBLISH_STATUSES,
  RECOMMENDATION_AVAILABILITIES,
  RECOMMENDATION_RELATIONSHIPS,
  TAG_GROUPS,
  UPDATE_LOG_TYPES,
} from "../../types";
import type {
  ArticleReference,
  Category,
  ContentData,
  Project,
  Recommendation,
  Scenario,
  ScenarioStep,
  Tag,
  UpdateLog,
} from "../../types";

const idSchema = z.string().trim().min(1);
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const textSchema = z.string().trim().min(1);
const iso8601Schema = z
  .string()
  .refine(
    (value) =>
      /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/.test(value) &&
      !Number.isNaN(Date.parse(value)),
    "Expected an ISO 8601 date string",
  );
const urlSchema = z
  .string()
  .url()
  .refine((value) => value.startsWith("https://"), "Expected an HTTPS URL");
const localAssetSchema = z
  .string()
  .regex(/^\/assets\/(?:icons|images)\/[a-zA-Z0-9/_-]+\.[a-zA-Z0-9]+$/);

export const articleReferenceSchema: z.ZodType<ArticleReference> = z.object({
  id: idSchema,
  title: textSchema,
  url: urlSchema,
  type: z.enum(ARTICLE_TYPES),
  description: textSchema,
  publishedAt: iso8601Schema.optional(),
});

export const updateLogSchema: z.ZodType<UpdateLog> = z.object({
  id: idSchema,
  date: iso8601Schema,
  title: textSchema,
  description: textSchema,
  type: z.enum(UPDATE_LOG_TYPES),
});

export const categorySchema: z.ZodType<Category> = z.object({
  id: idSchema,
  slug: slugSchema,
  name: textSchema,
  shortDescription: textSchema,
  longDescription: textSchema,
  iconKey: slugSchema,
  order: z.number().int().nonnegative(),
  visible: z.boolean(),
  createdAt: iso8601Schema,
  updatedAt: iso8601Schema,
});

export const tagSchema: z.ZodType<Tag> = z.object({
  id: idSchema,
  slug: slugSchema,
  name: textSchema,
  group: z.enum(TAG_GROUPS),
  description: textSchema,
  visible: z.boolean(),
});

export const recommendationSchema: z.ZodType<Recommendation> = z.object({
  id: idSchema,
  slug: slugSchema,
  name: textSchema,
  url: urlSchema,
  categoryId: idSchema,
  tagIds: z.array(idSchema),
  shortDescription: textSchema,
  recommendationReason: textSchema,
  usageDescription: textSchema.optional(),
  suitableFor: z.array(textSchema).min(1),
  unsuitableFor: z.array(textSchema),
  strengths: z.array(textSchema).min(1),
  limitations: z.array(textSchema).min(1),
  pricing: z.enum(PRICING_TYPES),
  platforms: z.array(z.enum(PLATFORM_TYPES)).min(1),
  isOpenSource: z.boolean(),
  selfHostable: z.boolean(),
  accessRegion: textSchema.optional(),
  relationship: z.enum(RECOMMENDATION_RELATIONSHIPS),
  availabilityStatus: z.enum(RECOMMENDATION_AVAILABILITIES),
  publishStatus: z.enum(PUBLISH_STATUSES),
  editorialStatus: z.enum(EDITORIAL_STATUSES),
  logo: localAssetSchema.optional(),
  coverImage: localAssetSchema.optional(),
  featured: z.boolean(),
  featuredOrder: z.number().int().nonnegative().optional(),
  relatedScenarioIds: z.array(idSchema),
  relatedRecommendationIds: z.array(idSchema),
  relatedProjectIds: z.array(idSchema),
  relatedArticles: z.array(articleReferenceSchema),
  publishedAt: iso8601Schema.optional(),
  lastCheckedAt: iso8601Schema.optional(),
  createdAt: iso8601Schema,
  updatedAt: iso8601Schema,
  updateLogs: z.array(updateLogSchema),
});

export const scenarioStepSchema: z.ZodType<ScenarioStep> = z.object({
  id: idSchema,
  order: z.number().int().positive(),
  title: textSchema,
  description: textSchema,
  primaryRecommendationIds: z.array(idSchema).min(1),
  alternativeRecommendationIds: z.array(idSchema),
  selectionReason: textSchema,
  notes: z.array(textSchema),
});

export const scenarioSchema: z.ZodType<Scenario> = z.object({
  id: idSchema,
  slug: slugSchema,
  title: textSchema,
  shortDescription: textSchema,
  longDescription: textSchema,
  audience: z.array(textSchema).min(1),
  recommendationIds: z.array(idSchema).min(1),
  steps: z.array(scenarioStepSchema).min(1),
  relatedArticles: z.array(articleReferenceSchema),
  publishStatus: z.enum(PUBLISH_STATUSES),
  publishedAt: iso8601Schema,
  updatedAt: iso8601Schema,
});

export const projectSchema: z.ZodType<Project> = z.object({
  id: idSchema,
  slug: slugSchema,
  name: textSchema,
  shortDescription: textSchema,
  problem: textSchema,
  coreFeatures: z.array(textSchema).min(1),
  techStack: z.array(textSchema).min(1),
  status: z.enum(PROJECT_STATUSES),
  publishStatus: z.enum(PUBLISH_STATUSES),
  coverImage: localAssetSchema.optional(),
  projectUrl: urlSchema.optional(),
  developmentLogUrl: urlSchema.optional(),
  createdAt: iso8601Schema,
  updatedAt: iso8601Schema,
});

export const contentDataSchema: z.ZodType<ContentData> = z.object({
  categories: z.array(categorySchema),
  tags: z.array(tagSchema),
  recommendations: z.array(recommendationSchema),
  scenarios: z.array(scenarioSchema),
  projects: z.array(projectSchema),
  articles: z.array(articleReferenceSchema),
});
