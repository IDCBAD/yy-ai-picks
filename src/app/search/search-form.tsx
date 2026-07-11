"use client";

import { useRouter } from "next/navigation";

import { SearchBar } from "@/components/search";
import { buildSearchHref } from "@/lib/navigation";

export interface SearchFormProps {
  query: string;
}

export function SearchForm({ query }: SearchFormProps) {
  const router = useRouter();

  return (
    <SearchBar
      defaultValue={query}
      onClear={() => router.push("/search")}
      onSubmit={(value) => router.push(buildSearchHref(value))}
      placeholder="搜索推荐、场景、项目或文章……"
      searchLabel="搜索全部公开内容"
    />
  );
}
