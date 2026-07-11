import { ArrowRight } from "lucide-react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Button, ExternalLink, Tag } from "@/components/ui";

afterEach(cleanup);

describe("Button", () => {
  it.each(["primary", "secondary", "ghost"] as const)("renders the %s variant", (variant) => {
    render(<Button variant={variant}>查看推荐</Button>);

    expect(screen.getByRole("button", { name: "查看推荐" })).toHaveAttribute(
      "data-variant",
      variant,
    );
  });

  it("uses native disabled semantics and disables while loading", () => {
    const { rerender } = render(<Button disabled>暂不可用</Button>);

    expect(screen.getByRole("button", { name: "暂不可用" })).toBeDisabled();

    rerender(<Button loading>正在保存</Button>);

    expect(screen.getByRole("button", { name: "正在保存" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "正在保存" })).toHaveAttribute("aria-busy", "true");
  });

  it("supports internal links and trailing icons", () => {
    render(
      <Button endIcon={<ArrowRight />} href="/recommendations/cursor" variant="secondary">
        查看详情
      </Button>,
    );

    const link = screen.getByRole("link", { name: "查看详情" });
    expect(link).toHaveAttribute("href", "/recommendations/cursor");
    expect(link).not.toHaveAttribute("target");
  });

  it("removes navigation from disabled links", () => {
    render(
      <Button disabled href="/recommendations/cursor">
        查看详情
      </Button>,
    );

    const link = screen.getByRole("link", { name: "查看详情" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("href");
  });
});

describe("Tag", () => {
  it("exposes selected state for interactive tags", () => {
    render(
      <Tag count={12} interactive selected>
        AI 编程
      </Tag>,
    );

    const tag = screen.getByRole("button", { name: "AI 编程12 个" });
    expect(tag).toHaveAttribute("aria-pressed", "true");
    expect(tag).toHaveAttribute("data-selected", "true");
  });
});

describe("ExternalLink", () => {
  it("always opens safely and announces the new window", () => {
    render(<ExternalLink href="https://example.com">访问官网</ExternalLink>);

    const link = screen.getByRole("link", { name: "访问官网（在新窗口打开）" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps external Button links safe", () => {
    render(<Button href="https://example.com">访问官网</Button>);

    const link = screen.getByRole("link", { name: "访问官网（在新窗口打开）" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
