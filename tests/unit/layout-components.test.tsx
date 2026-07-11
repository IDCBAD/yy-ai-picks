import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { BackToTop } from "@/components/layout/back-to-top";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SiteHeader } from "@/components/layout/site-header";

let pathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

describe("layout components", () => {
  beforeEach(() => {
    pathname = "/";
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
  });

  it("marks the current breadcrumb item as plain text", () => {
    render(
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "分类", href: "/categories" },
          { label: "AI 编程" },
        ]}
      />,
    );

    expect(screen.getByRole("navigation", { name: "面包屑" })).toBeInTheDocument();
    expect(screen.getByText("AI 编程")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "AI 编程" })).not.toBeInTheDocument();
  });

  it("opens the mobile menu and closes it with Escape", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "打开菜单" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "移动导航" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "移动导航" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes the mobile menu after the route changes", async () => {
    const user = userEvent.setup();
    const view = render(<SiteHeader />);
    await user.click(screen.getByRole("button", { name: "打开菜单" }));

    pathname = "/categories";
    view.rerender(<SiteHeader />);

    expect(screen.queryByRole("dialog", { name: "移动导航" })).not.toBeInTheDocument();
  });

  it("closes the mobile menu when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole("button", { name: "打开菜单" }));

    await user.click(screen.getByTestId("mobile-navigation-backdrop"));

    expect(screen.queryByRole("dialog", { name: "移动导航" })).not.toBeInTheDocument();
  });

  it("shows BackToTop after the threshold and respects reduced motion", () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollTo });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    render(<BackToTop threshold={100} />);
    const button = document.querySelector<HTMLButtonElement>('button[aria-label="返回顶部"]')!;

    expect(button).toHaveAttribute("tabindex", "-1");
    expect(button).toHaveAttribute("aria-hidden", "true");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 140 });
    act(() => fireEvent.scroll(window));

    expect(button).toHaveAttribute("tabindex", "0");
    expect(button).toHaveAttribute("aria-hidden", "false");
    fireEvent.click(button);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
