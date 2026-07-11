import { Beaker, FlaskConical, PauseCircle, RefreshCw, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ProjectCard } from "@/components/content";
import { PROJECT_STATUS_LABELS } from "@/lib/presentation";
import type { Project, ProjectStatus } from "@/types";

import styles from "./projects.module.css";

const PROJECT_STATUS_DESCRIPTIONS: Record<ProjectStatus, string> = {
  launched: "已经对外发布并可实际使用的项目",
  iterating: "已经发布，仍在持续完善的项目",
  prototype: "用于验证想法和关键路径的早期原型",
  experiment: "用于探索新方向的实验性项目",
  paused: "目前暂停维护，保留阶段成果的项目",
};

const PROJECT_STATUS_ICONS: Record<ProjectStatus, LucideIcon> = {
  launched: Rocket,
  iterating: RefreshCw,
  prototype: FlaskConical,
  experiment: Beaker,
  paused: PauseCircle,
};

export interface ProjectGroupProps {
  status: ProjectStatus;
  projects: readonly Project[];
  description?: string;
  headingLevel?: 2 | 3;
  cardHeadingLevel?: 2 | 3;
  id?: string;
}

export function ProjectGroup({
  cardHeadingLevel = 3,
  description,
  headingLevel = 2,
  id,
  projects,
  status,
}: ProjectGroupProps) {
  if (projects.length === 0) {
    return null;
  }

  const Heading = headingLevel === 2 ? "h2" : "h3";
  const Icon = PROJECT_STATUS_ICONS[status];
  const titleId = id ? `${id}-title` : `projects-${status}-title`;

  return (
    <section aria-labelledby={titleId} className={styles.group} id={id}>
      <div className={styles.groupHeader}>
        <div className={styles.groupTitle}>
          <span aria-hidden="true" className={styles.groupIcon} data-status={status}>
            <Icon />
          </span>
          <div>
            <Heading id={titleId}>{PROJECT_STATUS_LABELS[status]}</Heading>
            <p>{description ?? PROJECT_STATUS_DESCRIPTIONS[status]}</p>
          </div>
        </div>
        <span className={styles.groupCount}>{projects.length} 个项目</span>
      </div>
      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <ProjectCard
            headingLevel={cardHeadingLevel}
            key={project.id}
            project={project}
            showCollectionLink={false}
            showDetails
          />
        ))}
      </div>
    </section>
  );
}
