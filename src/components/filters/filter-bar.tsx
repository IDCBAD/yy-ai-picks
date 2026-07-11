"use client";

import { FilterPill } from "./filter-pill";
import styles from "./filters.module.css";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterBarProps {
  label: string;
  options: readonly FilterOption[];
  selectedValues: readonly string[];
  onSelect: (value: string) => void;
  className?: string;
}

export function FilterBar({ label, options, selectedValues, onSelect, className }: FilterBarProps) {
  const barClassName = className ? `${styles.bar} ${className}` : styles.bar;
  const selectedValueSet = new Set(selectedValues);

  return (
    <div aria-label={label} className={barClassName} role="group">
      <span className={styles.label}>{label}</span>
      <div className={styles.scroller}>
        {options.map((option) => (
          <FilterPill
            key={option.value}
            count={option.count}
            disabled={option.disabled}
            label={option.label}
            onSelect={onSelect}
            selected={selectedValueSet.has(option.value)}
            value={option.value}
          />
        ))}
      </div>
    </div>
  );
}
