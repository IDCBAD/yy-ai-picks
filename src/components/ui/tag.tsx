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
        <span aria-label={`${count} 个`} className={styles.tagCount}>
          {count}
        </span>
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
    <span aria-label={ariaLabel} className={tagClassName} data-selected={selected || undefined}>
      <TagContent count={count}>{children}</TagContent>
    </span>
  );
}
