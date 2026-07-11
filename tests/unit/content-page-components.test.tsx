import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryCard, ProjectCard, ScenarioCard } from "@/components/content";
import { RecommendationDetailSection, UpdateTimeline } from "@/components/detail";
import type { UpdateLog } from "@/types";

import { createValidContentData } from "../fixtures/content-data";

const data = createValidContentData();

describe("content page components", () => {
  it("renders category and scenario cards with typed content and valid route links", () => {
    render(
      <>
        <CategoryCard category={data.categories[0]} count={7} />
        <ScenarioCard scenario={data.scenarios[0]} />
      </>,
    );

    expect(screen.getByRole("link", { name: /Category One/ })).toHaveAttribute(
      "href",
      "/categories/category-one",
    );
    expect(screen.getByText("7 条推荐")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Scenario One/ })).toHaveAttribute(
      "href",
      "/scenarios/scenario-one",
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  });

  it("renders project metadata with a valid fallback link", () => {
    render(<ProjectCard project={data.projects[0]} />);

    expect(screen.getByText("原型阶段")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Project One 技术栈" })).toHaveTextContent(
      "TypeScript",
    );
    expect(screen.getByRole("link", { name: /查看项目/ })).toHaveAttribute("href", "/projects");
  });

  it("uses safe external project links without nesting anchors", () => {
    const project = {
      ...data.projects[0],
      projectUrl: "https://example.com/project",
      developmentLogUrl: "https://example.com/project/log",
    };
    const { container } = render(<ProjectCard project={project} />);

    expect(screen.getByRole("link", { name: /查看项目/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByRole("link", { name: /开发记录/ })).toHaveAttribute("target", "_blank");
    expect(container.querySelector("a a")).toBeNull();
  });

  it("hides a detail section when content is absent", () => {
    const { rerender } = render(<RecommendationDetailSection title="我为什么推荐" />);
    expect(screen.queryByRole("heading", { name: "我为什么推荐" })).not.toBeInTheDocument();

    rerender(
      <RecommendationDetailSection title="我为什么推荐">
        <p>推荐理由</p>
      </RecommendationDetailSection>,
    );
    expect(screen.getByRole("heading", { name: "我为什么推荐", level: 2 })).toBeInTheDocument();
  });

  it("sorts update logs newest first without changing the input", () => {
    const updates: UpdateLog[] = [
      { id: "old", date: "2026-01-01", title: "较早更新", description: "旧内容", type: "added" },
      { id: "new", date: "2026-03-01", title: "最近更新", description: "新内容", type: "updated" },
    ];

    render(<UpdateTimeline updates={updates} />);

    const items = screen.getAllByRole("listitem");
    expect(within(items[0]).getByRole("heading", { name: "最近更新" })).toBeInTheDocument();
    expect(within(items[1]).getByRole("heading", { name: "较早更新" })).toBeInTheDocument();
    expect(updates.map((update) => update.id)).toEqual(["old", "new"]);
  });
});
