import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AboutSection } from "@/components/about";
import { ProjectGroup } from "@/components/projects";
import { ScenarioWorkflow } from "@/components/scenario";
import { SearchResultCard, SearchResultSection } from "@/components/search-results";
import type { Recommendation, ScenarioStep } from "@/types";

import { createValidContentData } from "../fixtures/content-data";

const data = createValidContentData();
const primaryRecommendation = data.recommendations[0];
const alternativeRecommendation: Recommendation = {
  ...primaryRecommendation,
  id: "rec-two",
  slug: "tool-two",
  name: "Tool Two",
  url: "https://example.com/tool-two",
};

function createStep(id: string, order: number, title: string): ScenarioStep {
  return {
    ...data.scenarios[0].steps[0],
    id,
    order,
    title,
    alternativeRecommendationIds: [alternativeRecommendation.id],
    notes: ["Keep the original input available."],
  };
}

describe("Phase 5 shared display components", () => {
  it("renders an ordered scenario workflow with primary and alternative tools", () => {
    const laterStep = createStep("step-two", 2, "Publish the result");
    const firstStep = createStep("step-one", 1, "Evaluate the tool");

    render(
      <ScenarioWorkflow
        steps={[
          {
            step: laterStep,
            primaryRecommendations: [primaryRecommendation],
            alternativeRecommendations: [alternativeRecommendation],
          },
          {
            step: firstStep,
            primaryRecommendations: [primaryRecommendation],
            alternativeRecommendations: [alternativeRecommendation],
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "推荐流程" })).toBeInTheDocument();
    const workflowItems = screen
      .getAllByRole("listitem")
      .filter((item) => item.querySelector("article"));
    expect(
      within(workflowItems[0]).getByRole("heading", { name: "Evaluate the tool" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("首选").length).toBeGreaterThan(0);
    expect(screen.getAllByText("替代").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /查看详情/ })[0]).toHaveAttribute(
      "href",
      "/recommendations/tool-one",
    );
    expect(screen.getAllByRole("list", { name: "补充说明" })).toHaveLength(2);
  });

  it("uses the existing scenario and project cards for non-recommendation search results", () => {
    render(
      <SearchResultSection count={2} headingLevel={3} title="场景与项目">
        <SearchResultCard item={data.scenarios[0]} type="scenario" />
        <SearchResultCard item={data.projects[0]} type="project" />
      </SearchResultSection>,
    );

    expect(screen.getByRole("heading", { level: 3, name: "场景与项目" })).toBeInTheDocument();
    expect(screen.getByText("2 条结果")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Scenario One/ })).toHaveAttribute(
      "href",
      "/scenarios/scenario-one",
    );
    expect(screen.queryByRole("link", { name: /查看项目/ })).not.toBeInTheDocument();
  });

  it("renders article search results with a safe external link", () => {
    render(<SearchResultCard headingLevel={2} item={data.articles[0]} type="article" />);

    expect(
      screen.getByRole("heading", { level: 2, name: data.articles[0].title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /阅读原文/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("groups projects by the shared status presentation and hides empty groups", () => {
    const { rerender } = render(
      <ProjectGroup headingLevel={3} projects={data.projects} status="prototype" />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "原型阶段" })).toBeInTheDocument();
    expect(screen.getByText("1 个项目")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Project One" })).toBeInTheDocument();
    expect(screen.getByText(data.projects[0].problem)).toBeInTheDocument();
    expect(screen.getByText(data.projects[0].coreFeatures[0])).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /查看项目/ })).not.toBeInTheDocument();

    rerender(<ProjectGroup projects={[]} status="paused" />);
    expect(screen.queryByRole("heading", { name: "暂停维护" })).not.toBeInTheDocument();
  });

  it("renders configurable about-section headings and numbering", () => {
    render(
      <AboutSection
        description="A concise editorial standard."
        headingLevel={3}
        id="selection-standard"
        number={2}
        title="收录标准"
      >
        <p>Only material with direct experience is included.</p>
      </AboutSection>,
    );

    const section = screen.getByRole("region", { name: "收录标准" });
    expect(within(section).getByText("02")).toBeInTheDocument();
    expect(
      within(section).getByRole("heading", { level: 3, name: "收录标准" }),
    ).toBeInTheDocument();
    expect(within(section).getByText(/direct experience/)).toBeInTheDocument();
  });
});
