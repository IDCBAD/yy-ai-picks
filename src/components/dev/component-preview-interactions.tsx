"use client";

import { useState } from "react";

import { FilterBar, type FilterOption } from "@/components/filters";
import { SearchBar } from "@/components/search";
import { Tag } from "@/components/ui";

export interface ComponentPreviewInteractionsProps {
  filterOptions: FilterOption[];
}

export function ComponentPreviewInteractions({ filterOptions }: ComponentPreviewInteractionsProps) {
  const [query, setQuery] = useState("Agent");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);
  const [selectedTag, setSelectedTag] = useState(true);

  function toggleFilter(value: string) {
    setSelectedFilters((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  return (
    <div>
      <SearchBar
        onChange={setQuery}
        onClear={() => setSubmittedQuery("")}
        onSubmit={setSubmittedQuery}
        value={query}
      />
      <p aria-live="polite">{submittedQuery ? `已提交：${submittedQuery}` : "尚未提交搜索"}</p>
      <FilterBar
        label="组件筛选示例"
        onSelect={toggleFilter}
        options={filterOptions}
        selectedValues={selectedFilters}
      />
      <Tag interactive onClick={() => setSelectedTag((current) => !current)} selected={selectedTag}>
        可切换标签
      </Tag>
    </div>
  );
}
