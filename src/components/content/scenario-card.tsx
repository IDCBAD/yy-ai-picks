import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { Scenario } from "@/types";

import { ContentEntryIcon } from "./content-entry-icon";
import styles from "./content-card.module.css";

export interface ScenarioCardProps {
  scenario: Scenario;
  headingLevel?: 2 | 3;
}

export function ScenarioCard({ headingLevel = 3, scenario }: ScenarioCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className={styles.card}>
      <Link className={styles.cardLink} href={`/scenarios/${scenario.slug}`}>
        <span aria-hidden="true" className={styles.iconBox}>
          <ContentEntryIcon iconKey={scenario.iconKey} kind="scenario" />
        </span>
        <span className={styles.cardBody}>
          <Heading>{scenario.title}</Heading>
          <span className={styles.description}>{scenario.shortDescription}</span>
          <span className={styles.action}>
            查看场景
            <ArrowRight aria-hidden="true" />
          </span>
        </span>
      </Link>
    </article>
  );
}
