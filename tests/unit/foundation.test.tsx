import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe("home page", () => {
  it("renders computed data with the shared recommendation card", async () => {
    render(await HomePage({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByRole("heading", { level: 1, name: "余一的 AI 推荐清单" }),
    ).toBeInTheDocument();
    expect(screen.getByText("已发布推荐").nextSibling).toHaveTextContent("23");
    expect(screen.getAllByRole("link", { name: "Codex" })[0]).toHaveAttribute(
      "href",
      "/recommendations/codex",
    );
  });
});
