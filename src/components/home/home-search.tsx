"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { SearchBar } from "@/components/search";
import { buildSearchHref } from "@/lib/navigation";

import styles from "./home-controls.module.css";

export interface HomeSearchProps {
  hotKeywords: string[];
}

export function HomeSearch({ hotKeywords }: HomeSearchProps) {
  const router = useRouter();

  return (
    <div className={styles.searchBlock}>
      <SearchBar
        onSubmit={(query) => {
          if (query) router.push(buildSearchHref(query));
        }}
      />
      <div className={styles.hotKeywords}>
        <span>热门：</span>
        {hotKeywords.map((keyword) => (
          <Link href={buildSearchHref(keyword)} key={keyword}>
            {keyword}
          </Link>
        ))}
      </div>
    </div>
  );
}
