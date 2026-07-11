import {
  BriefcaseBusiness,
  Eye,
  FlaskConical,
  Hammer,
  Repeat2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { RecommendationRelationship } from "@/types";

import styles from "./recommendation.module.css";

interface StatusPresentation {
  label: string;
  tone: "accent" | "dark" | "neutral" | "info" | "muted";
  icon: LucideIcon;
}

export const RECOMMENDATION_STATUS: Record<RecommendationRelationship, StatusPresentation> = {
  "daily-use": { label: "每天使用", tone: "accent", icon: Sparkles },
  "long-term-use": { label: "长期使用", tone: "dark", icon: Repeat2 },
  "used-in-project": { label: "项目用过", tone: "neutral", icon: BriefcaseBusiness },
  testing: { label: "正在体验", tone: "info", icon: FlaskConical },
  watching: { label: "持续关注", tone: "muted", icon: Eye },
  "my-product": { label: "我的项目", tone: "accent", icon: Hammer },
};

export interface StatusBadgeProps {
  relationship: RecommendationRelationship;
  compact?: boolean;
}

export function StatusBadge({ compact = false, relationship }: StatusBadgeProps) {
  const presentation = RECOMMENDATION_STATUS[relationship];
  const Icon = presentation.icon;

  return (
    <span
      className={`${styles.statusBadge} ${styles[presentation.tone]} ${compact ? styles.statusCompact : ""}`}
      data-relationship={relationship}
    >
      <Icon aria-hidden="true" size={compact ? 13 : 15} strokeWidth={2.3} />
      {presentation.label}
    </span>
  );
}
