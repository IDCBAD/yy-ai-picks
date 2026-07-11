import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HomeFilters } from "@/components/home/home-filters";
import { HomeSearch } from "@/components/home/home-search";
import { buildSearchHref } from "@/lib/navigation";
import type { Category } from "@/types";

const push = vi.fn();
const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));

const category: Category = {
  id: "category-ai-coding",
  slug: "ai-coding",
  name: "AI 编程与开发",
  shortDescription: "AI 开发工具。",
  longDescription: "面向完整开发流程的 AI 工具。",
  iconKey: "coding",
  order: 1,
  visible: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("home interactions", () => {
  beforeEach(() => {
    push.mockReset();
    replace.mockReset();
  });

  it("builds an encoded search URL and submits it from the hero", async () => {
    expect(buildSearchHref("Agent 工作流")).toBe("/search?q=Agent+%E5%B7%A5%E4%BD%9C%E6%B5%81");
    const user = userEvent.setup();
    render(<HomeSearch hotKeywords={["Agent"]} />);

    await user.type(screen.getByRole("searchbox", { name: "搜索推荐清单" }), "Agent 工作流");
    await user.click(screen.getByRole("button", { name: "搜索" }));

    expect(push).toHaveBeenCalledWith("/search?q=Agent+%E5%B7%A5%E4%BD%9C%E6%B5%81");
  });

  it("writes category filters to the home URL", async () => {
    const user = userEvent.setup();
    render(
      <HomeFilters
        categories={[{ category, count: 4 }]}
        query={{ q: "", tags: [], sort: "recently-updated" }}
        relationshipCounts={{
          "daily-use": 7,
          "long-term-use": 5,
          "used-in-project": 3,
          testing: 2,
          watching: 3,
          "my-product": 0,
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: /AI 编程与开发/ }));

    expect(replace).toHaveBeenCalledWith("/?category=ai-coding", { scroll: false });
  });
});
