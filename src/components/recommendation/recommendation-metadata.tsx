import { Globe2 } from "lucide-react";

import type { Category, Recommendation } from "@/types";

import styles from "./recommendation.module.css";

export interface RecommendationMetadataProps {
  category: Pick<Category, "name">;
  recommendation: Pick<Recommendation, "url">;
}

export function RecommendationMetadata({ category, recommendation }: RecommendationMetadataProps) {
  const hostname = new URL(recommendation.url).hostname.replace(/^www\./, "");

  return (
    <div className={styles.metadata}>
      <span>{category.name}</span>
      <span className={styles.hostname} title={hostname}>
        <Globe2 aria-hidden="true" size={13} />
        {hostname}
      </span>
    </div>
  );
}
