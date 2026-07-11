"use client";

import type { ButtonHTMLAttributes } from "react";

import styles from "./filters.module.css";

export interface FilterPillProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick" | "onSelect" | "value"
> {
  value: string;
  label: string;
  selected: boolean;
  count?: number;
  onSelect: (value: string) => void;
}

export function FilterPill({
  value,
  label,
  selected,
  count,
  onSelect,
  className,
  type = "button",
  ...buttonProps
}: FilterPillProps) {
  const pillClassName = className ? `${styles.pill} ${className}` : styles.pill;
  const accessibleLabel = count === undefined ? label : `${label}，${count} 项`;

  return (
    <button
      {...buttonProps}
      aria-label={buttonProps["aria-label"] ?? accessibleLabel}
      aria-pressed={selected}
      className={pillClassName}
      data-selected={selected || undefined}
      onClick={() => onSelect(value)}
      type={type}
    >
      <span>{label}</span>
      {count !== undefined ? <span className={styles.count}>{count}</span> : null}
    </button>
  );
}
