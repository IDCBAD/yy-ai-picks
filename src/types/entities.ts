import type {
  ArticleType,
  EditorialStatus,
  PlatformType,
  PricingType,
  ProjectStatus,
  PublishStatus,
  RecommendationAvailability,
  RecommendationRelationship,
  TagGroup,
  UpdateLogType,
} from "./enums";

export interface ArticleReference {
  id: string;
  title: string;
  url: string;
  type: ArticleType;
  description: string;
  publishedAt?: string;
}

export interface UpdateLog {
  id: string;
  date: string;
  title: string;
  description: string;
  type: UpdateLogType;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  iconKey: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  group: TagGroup;
  description: string;
  visible: boolean;
}

export interface Recommendation {
  id: string;
  slug: string;
  name: string;
  url: string;
  categoryId: string;
  tagIds: string[];
  shortDescription: string;
  recommendationReason: string;
  usageDescription?: string;
  suitableFor: string[];
  unsuitableFor: string[];
  strengths: string[];
  limitations: string[];
  pricing: PricingType;
  platforms: PlatformType[];
  isOpenSource: boolean;
  selfHostable: boolean;
  accessRegion?: string;
  relationship: RecommendationRelationship;
  availabilityStatus: RecommendationAvailability;
  publishStatus: PublishStatus;
  editorialStatus: EditorialStatus;
  logo?: string;
  coverImage?: string;
  featured: boolean;
  featuredOrder?: number;
  relatedScenarioIds: string[];
  relatedRecommendationIds: string[];
  relatedProjectIds: string[];
  relatedArticles: ArticleReference[];
  publishedAt?: string;
  lastCheckedAt?: string;
  createdAt: string;
  updatedAt: string;
  updateLogs: UpdateLog[];
}

export interface ScenarioStep {
  id: string;
  order: number;
  title: string;
  description: string;
  primaryRecommendationIds: string[];
  alternativeRecommendationIds: string[];
  selectionReason: string;
  notes: string[];
}

export interface Scenario {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  audience: string[];
  recommendationIds: string[];
  steps: ScenarioStep[];
  relatedArticles: ArticleReference[];
  publishStatus: PublishStatus;
  publishedAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  problem: string;
  coreFeatures: string[];
  techStack: string[];
  status: ProjectStatus;
  publishStatus: PublishStatus;
  coverImage?: string;
  projectUrl?: string;
  developmentLogUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentData {
  categories: Category[];
  tags: Tag[];
  recommendations: Recommendation[];
  scenarios: Scenario[];
  projects: Project[];
  articles: ArticleReference[];
}
