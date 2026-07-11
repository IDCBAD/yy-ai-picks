import { CircleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import styles from "./feedback-state.module.css";

export interface ErrorStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  retryAction?: ReactNode;
  backAction?: ReactNode;
  className?: string;
}

export function ErrorState({
  title,
  description,
  icon: Icon = CircleAlert,
  retryAction,
  backAction,
  className,
}: ErrorStateProps) {
  const stateClassName = className ? `${styles.state} ${className}` : styles.state;

  return (
    <section aria-label={title} className={stateClassName} role="alert">
      <span className={styles.icon}>
        <Icon aria-hidden="true" size={28} strokeWidth={2.1} />
      </span>
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
      {retryAction || backAction ? (
        <div className={styles.actions}>
          {retryAction}
          {backAction}
        </div>
      ) : null}
    </section>
  );
}
