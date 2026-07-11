export interface NavigationItem {
  href: string;
  label: string;
}

export const PRIMARY_NAVIGATION: NavigationItem[] = [
  { href: "/", label: "首页" },
  { href: "/categories", label: "分类" },
  { href: "/scenarios", label: "场景清单" },
  { href: "/projects", label: "我的项目" },
  { href: "/about", label: "关于" },
];

export function isNavigationItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
