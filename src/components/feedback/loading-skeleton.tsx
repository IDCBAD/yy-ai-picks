import styles from "./loading-skeleton.module.css";

export type LoadingSkeletonVariant = "card" | "list" | "title";

export interface LoadingSkeletonProps {
  variant?: LoadingSkeletonVariant;
  count?: number;
  label?: string;
  className?: string;
}

export function LoadingSkeleton({
  variant = "card",
  count = 1,
  label = "正在加载内容",
  className,
}: LoadingSkeletonProps) {
  const safeCount = Number.isFinite(count) ? Math.max(1, Math.floor(count)) : 1;
  const containerClassName = className
    ? `${styles.container} ${styles[variant]} ${className}`
    : `${styles.container} ${styles[variant]}`;

  return (
    <>
      <span className={styles.srOnly} role="status">
        {label}
      </span>
      <div aria-hidden="true" className={containerClassName}>
        {Array.from({ length: safeCount }, (_, index) => (
          <div className={styles.item} key={index}>
            {variant === "card" ? (
              <>
                <span className={`${styles.block} ${styles.cardMedia}`} />
                <span className={`${styles.block} ${styles.primaryLine}`} />
                <span className={`${styles.block} ${styles.secondaryLine}`} />
                <span className={`${styles.block} ${styles.shortLine}`} />
              </>
            ) : null}
            {variant === "list" ? (
              <>
                <span className={`${styles.block} ${styles.listIcon}`} />
                <span className={styles.listContent}>
                  <span className={`${styles.block} ${styles.primaryLine}`} />
                  <span className={`${styles.block} ${styles.secondaryLine}`} />
                </span>
              </>
            ) : null}
            {variant === "title" ? (
              <>
                <span className={`${styles.block} ${styles.titleLine}`} />
                <span className={`${styles.block} ${styles.subtitleLine}`} />
              </>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
