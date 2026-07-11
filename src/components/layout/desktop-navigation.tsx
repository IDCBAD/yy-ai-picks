"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavigationItemActive, PRIMARY_NAVIGATION } from "./navigation";
import styles from "./layout.module.css";

export function DesktopNavigation() {
  const pathname = usePathname();
  const searchActive = isNavigationItemActive(pathname, "/search");

  return (
    <nav aria-label="主导航" className={styles.desktopNavigation}>
      {PRIMARY_NAVIGATION.map((item) => {
        const active = isNavigationItemActive(pathname, item.href);
        return (
          <Link aria-current={active ? "page" : undefined} href={item.href} key={item.href}>
            {item.label}
          </Link>
        );
      })}
      <Link
        aria-current={searchActive ? "page" : undefined}
        className={styles.searchLink}
        href="/search"
      >
        <Search aria-hidden="true" size={17} strokeWidth={2.5} />
        搜索
      </Link>
    </nav>
  );
}
