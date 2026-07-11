import type { ReactNode } from "react";

import styles from "./about.module.css";

export interface AboutSectionProps {
  number: number | string;
  title: string;
  children: ReactNode;
  description?: string;
  headingLevel?: 2 | 3;
  tone?: "default" | "muted";
  id?: string;
}

export function AboutSection({
  children,
  description,
  headingLevel = 2,
  id,
  number,
  title,
  tone = "default",
}: AboutSectionProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const displayNumber = typeof number === "number" ? String(number).padStart(2, "0") : number;
  const titleId = id ? `${id}-title` : undefined;

  return (
    <section aria-labelledby={titleId} className={styles.section} data-tone={tone} id={id}>
      <header className={styles.header}>
        <span className={styles.number}>{displayNumber}</span>
        <Heading id={titleId}>{title}</Heading>
        {description ? <p>{description}</p> : null}
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
