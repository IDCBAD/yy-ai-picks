import type { RecommendationRepository, ScenarioRepository } from "@/repositories";
import type { Recommendation, Scenario, ScenarioStep } from "@/types";

export interface ScenarioServiceDependencies {
  scenarios: ScenarioRepository;
  recommendations: RecommendationRepository;
}

export interface ResolvedScenarioStep {
  step: ScenarioStep;
  primaryRecommendations: Recommendation[];
  alternativeRecommendations: Recommendation[];
}

export interface ResolvedScenario {
  scenario: Scenario;
  steps: ResolvedScenarioStep[];
  recommendations: Recommendation[];
}

function resolveIds(ids: string[], byId: Map<string, Recommendation>): Recommendation[] {
  return ids.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

function collectStepRecommendationIds(scenario: Scenario): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];

  for (const step of scenario.steps) {
    for (const id of [...step.primaryRecommendationIds, ...step.alternativeRecommendationIds]) {
      if (!seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    }
  }

  return ids;
}

export class ScenarioService {
  constructor(private readonly dependencies: ScenarioServiceDependencies) {}

  async getBySlugWithRecommendations(slug: string): Promise<ResolvedScenario | null> {
    const scenario = await this.dependencies.scenarios.getBySlug(slug);
    if (!scenario || scenario.publishStatus !== "published") {
      return null;
    }

    const recommendations = await this.dependencies.recommendations.getAllPublished();
    const byId = new Map(recommendations.map((item) => [item.id, item]));

    return {
      scenario,
      recommendations: resolveIds(collectStepRecommendationIds(scenario), byId),
      steps: scenario.steps.map((step) => ({
        step,
        primaryRecommendations: resolveIds(step.primaryRecommendationIds, byId),
        alternativeRecommendations: resolveIds(step.alternativeRecommendationIds, byId),
      })),
    };
  }

  async getUniqueRecommendations(slug: string): Promise<Recommendation[]> {
    const resolved = await this.getBySlugWithRecommendations(slug);
    if (!resolved) {
      return [];
    }

    const seen = new Set<string>();
    return resolved.recommendations.filter((recommendation) => {
      if (seen.has(recommendation.id)) {
        return false;
      }
      seen.add(recommendation.id);
      return true;
    });
  }

  async getRecommendationCount(slug: string): Promise<number> {
    return (await this.getUniqueRecommendations(slug)).length;
  }
}
