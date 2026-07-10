import { describe, expect, it } from "vitest";

import { contentData } from "@/content";
import { LocalRecommendationRepository, LocalScenarioRepository } from "@/repositories";
import { ScenarioService } from "@/services/scenario-service";

function createService() {
  return new ScenarioService({
    scenarios: new LocalScenarioRepository(contentData),
    recommendations: new LocalRecommendationRepository(contentData),
  });
}

describe("ScenarioService", () => {
  it("resolves primary and alternative recommendations for every step", async () => {
    const result = await createService().getBySlugWithRecommendations("build-agent");

    expect(result?.steps[0].primaryRecommendations.map((item) => item.slug)).toEqual(["claude"]);
    expect(result?.steps[0].alternativeRecommendations.map((item) => item.slug)).toEqual([
      "chatgpt",
      "ollama",
    ]);
    expect(result?.steps[1].primaryRecommendations.map((item) => item.slug)).toEqual([
      "langgraph",
    ]);
  });

  it("returns null for an invalid scenario slug", async () => {
    await expect(createService().getBySlugWithRecommendations("missing")).resolves.toBeNull();
  });

  it("returns a deduplicated scenario tool summary in configured order", async () => {
    const result = await createService().getUniqueRecommendations("build-agent");

    expect(result.map((item) => item.slug)).toEqual([
      "claude",
      "chatgpt",
      "ollama",
      "langgraph",
      "dify",
      "browser-use",
      "n8n",
    ]);
    expect(new Set(result.map((item) => item.id)).size).toBe(result.length);
  });

  it("computes the scenario tool count", async () => {
    await expect(createService().getRecommendationCount("build-agent")).resolves.toBe(7);
    await expect(createService().getRecommendationCount("missing")).resolves.toBe(0);
  });
});
