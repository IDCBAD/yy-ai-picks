import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { Category } from "@/types";

import { ContentEntryIcon } from "./content-entry-icon";
import styles from "./content-card.module.css";

export interface CategoryCardProps {
  category: Category;
  count: number;
  headingLevel?: 2 | 3;
}

export function CategoryCard({ category, count, headingLevel = 3 }: CategoryCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className={styles.card}>
      <Link className={styles.cardLink} href={`/categories/${category.slug}`}>
        <span aria-hidden="true" className={styles.iconBox}>
          <ContentEntryIcon iconKey={category.iconKey} kind="category" />
        </span>
        <span className={styles.cardBody}>
          <Heading>{category.name}</Heading>
          <span className={styles.description}>{category.shortDescription}</span>
          <span className={styles.meta}>
            {count} 条推荐
            <ArrowRight aria-hidden="true" />
          </span>
        </span>
      </Link>
    </article>
  );
}
