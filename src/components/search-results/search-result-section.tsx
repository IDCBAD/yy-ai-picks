import type { ReactNode } from "react";

import { SectionHeader } from "@/components/layout";

import styles from "./search-results.module.css";

export type SearchResultSectionLayout = "grid" | "list" | "bare";

export interface SearchResultSectionProps {
  title: string;
  count: number;
  children: ReactNode;
  description?: string;
  headingLevel?: 2 | 3;
  layout?: SearchResultSectionLayout;
  id?: string;
}

export function SearchResultSection({
  children,
  count,
  description,
  headingLevel = 2,
  id,
  layout = "grid",
  title,
}: SearchResultSectionProps) {
  return (
    <section className={styles.resultSection} id={id}>
      <SectionHeader
        description={description}
        headingLevel={headingLevel}
        meta={`${count} 条结果`}
        title={title}
      />
      {layout === "bare" ? (
        children
      ) : (
        <div className={layout === "list" ? styles.resultList : styles.resultGrid}>{children}</div>
      )}
    </section>
  );
}
