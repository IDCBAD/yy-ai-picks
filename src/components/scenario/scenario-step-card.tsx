import { ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui";
import type { Recommendation, ScenarioStep } from "@/types";

import styles from "./scenario.module.css";

export interface ScenarioStepCardProps {
  step: ScenarioStep;
  primaryRecommendations: readonly Recommendation[];
  alternativeRecommendations: readonly Recommendation[];
  headingLevel?: 3 | 4;
}

interface RecommendationListProps {
  label: string;
  recommendations: readonly Recommendation[];
  variant: "primary" | "alternative";
}

function RecommendationList({ label, recommendations, variant }: RecommendationListProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={styles.recommendationGroup}>
      <p className={styles.recommendationGroupTitle}>{label}</p>
      <ul aria-label={`${label}工具`} className={styles.recommendationList}>
        {recommendations.map((recommendation) => (
          <li className={styles.recommendationItem} data-role={variant} key={recommendation.id}>
            <div className={styles.recommendationHeader}>
              <strong>{recommendation.name}</strong>
              <Badge variant={variant === "primary" ? "dark" : "default"}>{label}</Badge>
            </div>
            <p>{recommendation.shortDescription}</p>
            <Link href={`/recommendations/${recommendation.slug}`}>
              查看详情
              <ArrowRight aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ScenarioStepCard({
  alternativeRecommendations,
  headingLevel = 3,
  primaryRecommendations,
  step,
}: ScenarioStepCardProps) {
  const Heading = headingLevel === 3 ? "h3" : "h4";
  const stepNumber = String(step.order).padStart(2, "0");

  return (
    <article aria-labelledby={`${step.id}-title`} className={styles.stepCard}>
      <span aria-hidden="true" className={styles.stepNumber}>
        {stepNumber}
      </span>
      <div className={styles.stepContent}>
        <Heading id={`${step.id}-title`}>{step.title}</Heading>
        <p className={styles.stepDescription}>{step.description}</p>

        <div className={styles.recommendations}>
          <RecommendationList
            label="首选"
            recommendations={primaryRecommendations}
            variant="primary"
          />
          <RecommendationList
            label="替代"
            recommendations={alternativeRecommendations}
            variant="alternative"
          />
        </div>

        <div className={styles.selectionReason}>
          <Lightbulb aria-hidden="true" />
          <p>
            <strong>选择理由</strong>
            {step.selectionReason}
          </p>
        </div>

        {step.notes.length > 0 ? (
          <ul aria-label="补充说明" className={styles.notes}>
            {step.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
