import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("project foundation", () => {
  it("renders the neutral project heading", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "余一的 AI 推荐清单" })).toBeInTheDocument();
  });
});
