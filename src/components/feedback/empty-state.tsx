import { SearchX, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import styles from "./feedback-state.module.css";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const stateClassName = className ? `${styles.state} ${className}` : styles.state;

  return (
    <section aria-label={title} className={stateClassName} role="status">
      <span className={styles.icon}>
        <Icon aria-hidden="true" size={28} strokeWidth={2.1} />
      </span>
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
      {primaryAction || secondaryAction ? (
        <div className={styles.actions}>
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </section>
  );
}
