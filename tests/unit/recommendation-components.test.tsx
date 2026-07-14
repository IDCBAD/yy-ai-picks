import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RecommendationCard } from "@/components/recommendation/recommendation-card";
import { RecommendationLogo } from "@/components/recommendation/recommendation-logo";
import {
  RECOMMENDATION_STATUS,
  StatusBadge,
} from "@/components/recommendation/recommendation-status";
import { contentData } from "@/content";
import { RECOMMENDATION_RELATIONSHIPS } from "@/types";

const recommendation = contentData.recommendations[0];
const category = contentData.categories.find((item) => item.id === recommendation.categoryId)!;
const tags = contentData.tags.slice(0, 5);

describe("recommendation components", () => {
  it("maps every relationship to one shared presentation", () => {
    const { rerender } = render(<StatusBadge relationship="daily-use" />);

    for (const relationship of RECOMMENDATION_RELATIONSHIPS) {
      rerender(<StatusBadge relationship={relationship} />);
      expect(screen.getByText(RECOMMENDATION_STATUS[relationship].label)).toBeInTheDocument();
    }
  });

  it("falls back to the category icon when a logo fails", () => {
    const { container } = render(
      <RecommendationLogo
        categoryIconKey="coding"
        name="Broken Tool"
        src="/assets/dev/missing-logo.svg"
      />,
    );

    const image = container.querySelector("img");
    expect(image).not.toBeNull();
    fireEvent.error(image!);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders typed fields, a +N tag summary, and safe links", () => {
    render(
      <RecommendationCard
        category={category}
        recommendation={recommendation}
        tags={tags}
        variant="featured"
      />,
    );

    expect(screen.getByRole("heading", { name: recommendation.name })).toBeInTheDocument();
    expect(screen.getByText(recommendation.shortDescription)).toBeInTheDocument();
    expect(screen.getByText("另有 2 个标签")).toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看详情/ })).toHaveAttribute(
      "href",
      `/recommendations/${recommendation.slug}`,
    );
    expect(screen.getByRole("link", { name: /访问官网/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });
});
