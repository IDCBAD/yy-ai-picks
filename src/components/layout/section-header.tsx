import type { ReactNode } from "react";

import styles from "./layout.module.css";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  meta?: ReactNode;
  action?: ReactNode;
  headingLevel?: 2 | 3;
  id?: string;
}

export function SectionHeader({
  action,
  description,
  headingLevel = 2,
  id,
  meta,
  title,
}: SectionHeaderProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div className={styles.sectionHeader}>
      <div className={styles.sectionCopy}>
        <Heading id={id}>{title}</Heading>
        {description ? <p>{description}</p> : null}
      </div>
      {meta || action ? (
        <div className={styles.sectionAside}>
          {meta ? <span className={styles.sectionMeta}>{meta}</span> : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}
