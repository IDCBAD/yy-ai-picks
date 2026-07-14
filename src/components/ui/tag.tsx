import type { MouseEventHandler, ReactNode } from "react";

import { joinClassNames } from "./class-names";
import styles from "./ui.module.css";

export interface TagProps {
  children: ReactNode;
  count?: number;
  selected?: boolean;
  disabled?: boolean;
  interactive?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  "aria-label"?: string;
}

function TagContent({ children, count }: Pick<TagProps, "children" | "count">) {
  return (
    <>
      <span>{children}</span>
      {count !== undefined ? (
        <>
          <span aria-hidden="true" className={styles.tagCount}>
            {count}
          </span>
          <span className={styles.visuallyHidden}>{count} 个</span>
        </>
      ) : null}
    </>
  );
}

export function Tag({
  "aria-label": ariaLabel,
  children,
  className,
  count,
  disabled = false,
  interactive = false,
  onClick,
  selected = false,
}: TagProps) {
  const isInteractive = interactive || onClick !== undefined || disabled;
  const tagClassName = joinClassNames(
    isInteractive ? styles.tagButton : styles.tag,
    selected && styles.tagSelected,
    className,
  );

  if (isInteractive) {
    return (
      <button
        aria-label={ariaLabel}
        aria-pressed={selected}
        className={tagClassName}
        data-selected={selected || undefined}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <TagContent count={count}>{children}</TagContent>
      </button>
    );
  }

  return (
    <span className={tagClassName} data-selected={selected || undefined}>
      {ariaLabel ? (
        <>
          <span aria-hidden="true">
            <TagContent count={count}>{children}</TagContent>
          </span>
          <span className={styles.visuallyHidden}>{ariaLabel}</span>
        </>
      ) : (
        <TagContent count={count}>{children}</TagContent>
      )}
    </span>
  );
}
