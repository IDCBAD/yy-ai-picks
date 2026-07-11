import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Link from "next/link";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/feedback";
import { FilterBar } from "@/components/filters";
import { SearchBar } from "@/components/search";

afterEach(cleanup);

describe("SearchBar", () => {
  it("submits the entered value and clears it", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    const handleClear = vi.fn();
    const handleChange = vi.fn();

    render(
      <SearchBar
        defaultValue="Cursor"
        onChange={handleChange}
        onClear={handleClear}
        onSubmit={handleSubmit}
      />,
    );

    const input = screen.getByRole("searchbox", { name: "搜索推荐清单" });
    await user.clear(input);
    await user.type(input, "  Agent  ");
    await user.keyboard("{Enter}");

    expect(handleSubmit).toHaveBeenCalledWith("Agent");

    await user.click(screen.getByRole("button", { name: "清空搜索" }));

    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(handleChange).toHaveBeenLastCalledWith("");
    expect(handleClear).toHaveBeenCalledOnce();
  });

  it("reports its loading state and blocks duplicate submissions", () => {
    const handleSubmit = vi.fn();

    render(<SearchBar defaultValue="Agent" isLoading onSubmit={handleSubmit} />);

    expect(screen.getByRole("search", { name: "搜索推荐清单" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent("正在搜索");
    expect(screen.getByRole("button", { name: "正在搜索" })).toBeDisabled();

    fireEvent.submit(screen.getByRole("search", { name: "搜索推荐清单" }));
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});

describe("FilterBar", () => {
  it("reports the selected filter and exposes selected state", async () => {
    const user = userEvent.setup();

    function FilterHarness() {
      const [selected, setSelected] = useState(["all"]);

      return (
        <FilterBar
          label="分类"
          onSelect={(value) => setSelected([value])}
          options={[
            { value: "all", label: "全部", count: 20 },
            { value: "coding", label: "AI 编程", count: 6 },
          ]}
          selectedValues={selected}
        />
      );
    }

    render(<FilterHarness />);

    const allFilter = screen.getByRole("button", { name: "全部，20 项" });
    const codingFilter = screen.getByRole("button", { name: "AI 编程，6 项" });
    expect(allFilter).toHaveAttribute("aria-pressed", "true");

    await user.click(codingFilter);

    expect(codingFilter).toHaveAttribute("aria-pressed", "true");
    expect(allFilter).toHaveAttribute("aria-pressed", "false");
  });
});

describe("feedback states", () => {
  it("renders usable empty-state actions", async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();
    const handleBrowse = vi.fn();

    render(
      <EmptyState
        description="试试调整筛选条件。"
        primaryAction={<button onClick={handleReset}>重置筛选</button>}
        secondaryAction={<button onClick={handleBrowse}>浏览全部</button>}
        title="没有找到匹配的推荐"
      />,
    );

    await user.click(screen.getByRole("button", { name: "重置筛选" }));
    await user.click(screen.getByRole("button", { name: "浏览全部" }));

    expect(handleReset).toHaveBeenCalledOnce();
    expect(handleBrowse).toHaveBeenCalledOnce();
  });

  it("renders recoverable error actions without technical details", () => {
    render(
      <ErrorState
        backAction={<Link href="/">返回首页</Link>}
        description="请稍后重试。"
        retryAction={<button>重新加载</button>}
        title="内容暂时无法显示"
      />,
    );

    expect(screen.getByRole("alert", { name: "内容暂时无法显示" })).toHaveTextContent(
      "请稍后重试。",
    );
    expect(screen.getByRole("button", { name: "重新加载" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回首页" })).toHaveAttribute("href", "/");
  });

  it("announces loading while hiding skeleton shapes from assistive technology", () => {
    const { container } = render(<LoadingSkeleton count={2} label="正在加载推荐" variant="card" />);

    expect(screen.getByRole("status")).toHaveTextContent("正在加载推荐");
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });
});
