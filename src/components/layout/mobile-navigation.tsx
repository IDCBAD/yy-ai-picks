"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { isNavigationItemActive, PRIMARY_NAVIGATION } from "./navigation";
import styles from "./layout.module.css";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialogId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      setOpen(false);
      previousPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className={styles.mobileNavigation}>
      <button
        aria-controls={dialogId}
        aria-expanded={open}
        aria-label={open ? "关闭菜单" : "打开菜单"}
        className={styles.menuButton}
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
        type="button"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {open ? (
        <div className={styles.mobileLayer}>
          <div
            aria-hidden="true"
            className={styles.mobileBackdrop}
            data-testid="mobile-navigation-backdrop"
            onClick={() => setOpen(false)}
          />
          <div
            aria-label="移动导航"
            aria-modal="true"
            className={styles.mobilePanel}
            id={dialogId}
            ref={panelRef}
            role="dialog"
          >
            <div className={styles.mobilePanelHeader}>
              <strong>导航</strong>
              <button
                aria-label="关闭菜单"
                className={styles.panelClose}
                onClick={() => setOpen(false)}
                type="button"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="移动端主导航" className={styles.mobileLinks}>
              {PRIMARY_NAVIGATION.map((item) => {
                const active = isNavigationItemActive(pathname, item.href);
                return (
                  <Link aria-current={active ? "page" : undefined} href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                );
              })}
              <Link
                aria-current={isNavigationItemActive(pathname, "/search") ? "page" : undefined}
                className={styles.mobileSearchLink}
                href="/search"
              >
                <Search aria-hidden="true" size={19} />
                搜索
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
