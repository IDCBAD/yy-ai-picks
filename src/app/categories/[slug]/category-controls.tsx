"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { FilterBar } from "@/components/filters";
import { Button } from "@/components/ui";
import { serializeRecommendationQuery } from "@/services";
import { SORT_OPTIONS, type SortOption, type Tag } from "@/types";

import styles from "./category-page.module.css";

const SORT_LABELS: Record<SortOption, string> = {
  "recently-updated": "最近更新",
  "recently-added": "最近收录",
  featured: "精选优先",
  name: "名称排序",
};

export interface CategoryTagOption {
  tag: Tag;
  count: number;
}

export interface CategoryControlsProps {
  categorySlug: string;
  tags: CategoryTagOption[];
  selectedTags: string[];
  sort: SortOption;
}

export function CategoryControls({
  categorySlug,
  tags,
  selectedTags,
  sort,
}: CategoryControlsProps) {
  const router = useRouter();
  const basePath = `/categories/${categorySlug}`;

  function update(nextTags: string[], nextSort: SortOption) {
    const params = serializeRecommendationQuery({ q: "", tags: nextTags, sort: nextSort });
    router.replace(params.size > 0 ? `${basePath}?${params.toString()}` : basePath, {
      scroll: false,
    });
  }

  function toggleTag(slug: string) {
    const nextTags = selectedTags.includes(slug)
      ? selectedTags.filter((item) => item !== slug)
      : [...selectedTags, slug];
    update(nextTags, sort);
  }

  return (
    <div className={styles.controls}>
      <FilterBar
        label="标签"
        onSelect={toggleTag}
        options={tags.map(({ count, tag }) => ({ value: tag.slug, label: tag.name, count }))}
        selectedValues={selectedTags}
      />
      <div className={styles.controlCommands}>
        <label className={styles.sortControl}>
          <span>排序</span>
          <select
            aria-label="分类推荐排序"
            onChange={(event) => update(selectedTags, event.currentTarget.value as SortOption)}
            value={sort}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {SORT_LABELS[option]}
              </option>
            ))}
          </select>
        </label>
        <Button
          onClick={() => update([], "recently-updated")}
          startIcon={<RotateCcw />}
          variant="ghost"
        >
          清空筛选
        </Button>
      </div>
    </div>
  );
}
