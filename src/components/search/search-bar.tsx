"use client";

import { LoaderCircle, Search, X } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";

import styles from "./search-bar.module.css";

export interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit: (value: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  searchLabel?: string;
  submitLabel?: string;
  clearLabel?: string;
  loadingLabel?: string;
  className?: string;
}

export function SearchBar({
  value,
  defaultValue = "",
  onChange,
  onSubmit,
  onClear,
  isLoading = false,
  disabled = false,
  id,
  name = "query",
  placeholder = "搜索工具、使用场景、能力或标签……",
  searchLabel = "搜索推荐清单",
  submitLabel = "搜索",
  clearLabel = "清空搜索",
  loadingLabel = "正在搜索",
  className,
}: SearchBarProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;
  const isDisabled = disabled || isLoading;

  function updateValue(nextValue: string) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onChange?.(nextValue);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isDisabled) {
      onSubmit(currentValue.trim());
    }
  }

  function handleClear() {
    updateValue("");
    onClear?.();
    inputRef.current?.focus();
  }

  const formClassName = className ? `${styles.form} ${className}` : styles.form;

  return (
    <form
      aria-busy={isLoading || undefined}
      aria-label={searchLabel}
      className={formClassName}
      onSubmit={handleSubmit}
      role="search"
    >
      <Search aria-hidden="true" className={styles.leadingIcon} size={20} strokeWidth={2.25} />
      <input
        ref={inputRef}
        aria-label={searchLabel}
        className={styles.input}
        disabled={isDisabled}
        id={inputId}
        name={name}
        onChange={(event) => updateValue(event.currentTarget.value)}
        placeholder={placeholder}
        type="search"
        value={currentValue}
      />
      <div className={styles.actions}>
        {currentValue.length > 0 && !isLoading ? (
          <button
            aria-label={clearLabel}
            className={styles.iconButton}
            disabled={disabled}
            onClick={handleClear}
            title={clearLabel}
            type="button"
          >
            <X aria-hidden="true" size={18} strokeWidth={2.25} />
          </button>
        ) : null}
        <button
          aria-label={isLoading ? loadingLabel : submitLabel}
          className={styles.submitButton}
          disabled={isDisabled}
          type="submit"
        >
          {isLoading ? (
            <LoaderCircle
              aria-hidden="true"
              className={styles.spinner}
              size={18}
              strokeWidth={2.25}
            />
          ) : (
            <Search aria-hidden="true" size={18} strokeWidth={2.25} />
          )}
          <span>{isLoading ? loadingLabel : submitLabel}</span>
        </button>
      </div>
      {isLoading ? (
        <span className={styles.srOnly} role="status">
          {loadingLabel}
        </span>
      ) : null}
    </form>
  );
}
