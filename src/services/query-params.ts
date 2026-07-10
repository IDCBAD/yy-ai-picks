import {
  PLATFORM_TYPES,
  PRICING_TYPES,
  RECOMMENDATION_RELATIONSHIPS,
  SORT_OPTIONS,
} from "@/types";
import type { RecommendationQuery } from "@/types";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isEnumValue<T extends string>(values: readonly T[], value: string | null): value is T {
  return value !== null && values.some((candidate) => candidate === value);
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseSlug(value: string | null): string | undefined {
  const normalized = value?.trim();
  return normalized && slugPattern.test(normalized) ? normalized : undefined;
}

function parseTags(value: string | null): string[] {
  const tags = (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => slugPattern.test(tag));

  return [...new Set(tags)];
}

export function parseRecommendationQuery(searchParams: URLSearchParams): RecommendationQuery {
  const relationship = searchParams.get("relationship");
  const pricing = searchParams.get("pricing");
  const platform = searchParams.get("platform");
  const sort = searchParams.get("sort");
  const parsed: RecommendationQuery = {
    q: searchParams.get("q")?.trim() ?? "",
    tags: parseTags(searchParams.get("tags")),
    sort: isEnumValue(SORT_OPTIONS, sort) ? sort : "recently-updated",
  };
  const category = parseSlug(searchParams.get("category"));
  const openSource = parseBoolean(searchParams.get("openSource"));
  const selfHostable = parseBoolean(searchParams.get("selfHostable"));

  if (category) parsed.category = category;
  if (isEnumValue(RECOMMENDATION_RELATIONSHIPS, relationship)) {
    parsed.relationship = relationship;
  }
  if (isEnumValue(PRICING_TYPES, pricing)) parsed.pricing = pricing;
  if (openSource !== undefined) parsed.openSource = openSource;
  if (selfHostable !== undefined) parsed.selfHostable = selfHostable;
  if (isEnumValue(PLATFORM_TYPES, platform)) parsed.platform = platform;

  return parsed;
}

export function serializeRecommendationQuery(query: RecommendationQuery): URLSearchParams {
  const params = new URLSearchParams();
  const q = query.q.trim();

  if (q) params.set("q", q);
  if (query.category) params.set("category", query.category);
  if (query.relationship) params.set("relationship", query.relationship);
  if (query.pricing) params.set("pricing", query.pricing);
  if (query.openSource !== undefined) params.set("openSource", String(query.openSource));
  if (query.selfHostable !== undefined) {
    params.set("selfHostable", String(query.selfHostable));
  }
  if (query.platform) params.set("platform", query.platform);
  if (query.tags.length > 0) params.set("tags", [...new Set(query.tags)].join(","));
  if (query.sort !== "recently-updated") params.set("sort", query.sort);

  return params;
}
