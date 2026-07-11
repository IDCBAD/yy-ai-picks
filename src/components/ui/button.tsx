import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { joinClassNames } from "./class-names";
import { ExternalLink } from "./external-link";
import styles from "./ui.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  className?: string;
}

export interface ButtonElementProps
  extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
  external?: never;
}

export interface ButtonLinkProps
  extends
    ButtonBaseProps,
    Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      keyof ButtonBaseProps | "href" | "rel" | "target"
    > {
  href: string;
  external?: boolean;
}

export type ButtonProps = ButtonElementProps | ButtonLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  ghost: styles.buttonGhost,
};

function isExternalHref(href: string): boolean {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);
}

function ButtonContent({
  children,
  endIcon,
  loading,
  loadingLabel,
  startIcon,
}: Pick<ButtonBaseProps, "children" | "endIcon" | "loading" | "loadingLabel" | "startIcon">) {
  return (
    <>
      {loading ? (
        <span aria-hidden="true" className={joinClassNames(styles.buttonIcon, styles.spinner)}>
          <LoaderCircle />
        </span>
      ) : startIcon ? (
        <span aria-hidden="true" className={styles.buttonIcon}>
          {startIcon}
        </span>
      ) : null}
      <span className={styles.buttonLabel}>
        {loading && loadingLabel ? loadingLabel : children}
      </span>
      {!loading && endIcon ? (
        <span aria-hidden="true" className={styles.buttonIcon}>
          {endIcon}
        </span>
      ) : null}
    </>
  );
}

export function Button(props: ButtonProps) {
  if (typeof props.href === "string") {
    const {
      children,
      className,
      disabled = false,
      endIcon,
      external,
      href,
      loading = false,
      loadingLabel,
      startIcon,
      variant = "primary",
      ...anchorProps
    } = props;
    const buttonClassName = joinClassNames(styles.button, variantClasses[variant], className);
    const content = (
      <ButtonContent
        endIcon={endIcon}
        loading={loading}
        loadingLabel={loadingLabel}
        startIcon={startIcon}
      >
        {children}
      </ButtonContent>
    );

    if (disabled || loading) {
      return (
        <span
          aria-busy={loading || undefined}
          aria-disabled="true"
          className={buttonClassName}
          data-variant={variant}
          role="link"
        >
          {content}
        </span>
      );
    }

    if (external ?? isExternalHref(href)) {
      return (
        <ExternalLink
          {...anchorProps}
          className={buttonClassName}
          data-variant={variant}
          href={href}
        >
          {content}
        </ExternalLink>
      );
    }

    return (
      <Link {...anchorProps} className={buttonClassName} data-variant={variant} href={href}>
        {content}
      </Link>
    );
  }

  const {
    children,
    className,
    disabled = false,
    endIcon,
    loading = false,
    loadingLabel,
    startIcon,
    type = "button",
    variant = "primary",
    ...buttonProps
  } = props;

  return (
    <button
      {...buttonProps}
      aria-busy={loading || undefined}
      className={joinClassNames(styles.button, variantClasses[variant], className)}
      data-variant={variant}
      disabled={disabled || loading}
      type={type}
    >
      <ButtonContent
        endIcon={endIcon}
        loading={loading}
        loadingLabel={loadingLabel}
        startIcon={startIcon}
      >
        {children}
      </ButtonContent>
    </button>
  );
}
