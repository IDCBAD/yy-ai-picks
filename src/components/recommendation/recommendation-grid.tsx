import { Children, type ReactNode } from "react";

import styles from "./recommendation.module.css";

export interface RecommendationGridProps {
  children?: ReactNode;
  emptyState?: ReactNode;
  ariaLabel?: string;
  columns?: 3 | 4;
}

export function RecommendationGrid({
  ariaLabel = "推荐列表",
  children,
  columns = 3,
  emptyState,
}: RecommendationGridProps) {
  const items = Children.toArray(children);
  if (items.length === 0) {
    return <>{emptyState ?? null}</>;
  }

  return (
    <ul aria-label={ariaLabel} className={styles.grid} data-columns={columns}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
