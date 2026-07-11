import { SectionHeader } from "@/components/layout";
import type { Recommendation, ScenarioStep } from "@/types";

import styles from "./scenario.module.css";
import { ScenarioStepCard } from "./scenario-step-card";

export interface ScenarioWorkflowStep {
  step: ScenarioStep;
  primaryRecommendations: readonly Recommendation[];
  alternativeRecommendations: readonly Recommendation[];
}

export interface ScenarioWorkflowProps {
  steps: readonly ScenarioWorkflowStep[];
  title?: string;
  description?: string;
  headingLevel?: 2 | 3;
  stepHeadingLevel?: 3 | 4;
  id?: string;
}

export function ScenarioWorkflow({
  description,
  headingLevel = 2,
  id,
  stepHeadingLevel = 3,
  steps,
  title = "推荐流程",
}: ScenarioWorkflowProps) {
  const orderedSteps = [...steps].sort((left, right) => left.step.order - right.step.order);

  return (
    <section className={styles.workflow} id={id}>
      <SectionHeader
        description={description}
        headingLevel={headingLevel}
        meta={`${orderedSteps.length} 个步骤`}
        title={title}
      />
      <ol aria-label={title} className={styles.workflowList}>
        {orderedSteps.map((resolvedStep) => (
          <li className={styles.workflowItem} key={resolvedStep.step.id}>
            <ScenarioStepCard
              alternativeRecommendations={resolvedStep.alternativeRecommendations}
              headingLevel={stepHeadingLevel}
              primaryRecommendations={resolvedStep.primaryRecommendations}
              step={resolvedStep.step}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
