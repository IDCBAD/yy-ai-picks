import { Children, type ReactNode } from "react";

import styles from "./detail.module.css";

export interface RecommendationDetailSectionProps {
  title: string;
  children?: ReactNode;
  headingLevel?: 2 | 3;
}

export function RecommendationDetailSection({
  children,
  headingLevel = 2,
  title,
}: RecommendationDetailSectionProps) {
  if (Children.count(children) === 0) {
    return null;
  }

  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <section className={styles.section}>
      <Heading>{title}</Heading>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
}
