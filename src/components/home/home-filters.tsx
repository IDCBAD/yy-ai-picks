"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { FilterBar } from "@/components/filters";
import { RECOMMENDATION_STATUS } from "@/components/recommendation";
import { Button } from "@/components/ui";
import { serializeRecommendationQuery } from "@/services";
import type { CategorySummary } from "@/services/home-service";
import {
  RECOMMENDATION_RELATIONSHIPS,
  SORT_OPTIONS,
  type RecommendationQuery,
  type RecommendationRelationship,
  type SortOption,
} from "@/types";

import styles from "./home-controls.module.css";

const SORT_LABELS: Record<SortOption, string> = {
  "recently-updated": "最近更新",
  "recently-added": "最近收录",
  featured: "精选优先",
  name: "名称排序",
};

export interface HomeFiltersProps {
  categories: CategorySummary[];
  relationshipCounts: Record<RecommendationRelationship, number>;
  query: RecommendationQuery;
}

export function HomeFilters({ categories, query, relationshipCounts }: HomeFiltersProps) {
  const router = useRouter();
  const relationshipOptions = RECOMMENDATION_RELATIONSHIPS.map((relationship) => ({
    value: relationship,
    label: RECOMMENDATION_STATUS[relationship].label,
    count: relationshipCounts[relationship],
  })).filter((option) => option.count > 0);

  function update(nextQuery: RecommendationQuery) {
    const params = serializeRecommendationQuery(nextQuery);
    router.replace(params.size > 0 ? `/?${params.toString()}` : "/", { scroll: false });
  }

  function updateCategory(value: string) {
    update({
      ...query,
      category: value === "all" || query.category === value ? undefined : value,
    });
  }

  function updateRelationship(value: string) {
    const relationship = value as RecommendationRelationship;
    update({
      ...query,
      relationship: query.relationship === relationship ? undefined : relationship,
    });
  }

  return (
    <div className={styles.filters}>
      <FilterBar
        label="分类"
        onSelect={updateCategory}
        options={[
          {
            value: "all",
            label: "全部",
            count: categories.reduce((sum, item) => sum + item.count, 0),
          },
          ...categories.map(({ category, count }) => ({
            value: category.slug,
            label: category.name,
            count,
          })),
        ]}
        selectedValues={[query.category ?? "all"]}
      />
      {relationshipOptions.length > 0 ? (
        <FilterBar
          label="使用关系"
          onSelect={updateRelationship}
          options={relationshipOptions}
          selectedValues={query.relationship ? [query.relationship] : []}
        />
      ) : null}
      <div className={styles.filterCommands}>
        <label className={styles.sortControl}>
          <span>排序</span>
          <select
            aria-label="推荐排序"
            onChange={(event) =>
              update({ ...query, sort: event.currentTarget.value as SortOption })
            }
            value={query.sort}
          >
            {SORT_OPTIONS.map((sort) => (
              <option key={sort} value={sort}>
                {SORT_LABELS[sort]}
              </option>
            ))}
          </select>
        </label>
        <Button
          onClick={() => update({ q: "", tags: [], sort: "recently-updated" })}
          startIcon={<RotateCcw />}
          variant="ghost"
        >
          清空筛选
        </Button>
      </div>
    </div>
  );
}
