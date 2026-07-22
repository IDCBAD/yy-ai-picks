"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { ExternalLink } from "@/components/ui/external-link";

import styles from "./content-card.module.css";

export interface ProjectVisitLinkProps {
  href: string;
  projectName: string;
}

export function ProjectVisitLink({ href, projectName }: ProjectVisitLinkProps) {
  const [isActivated, setIsActivated] = useState(false);

  function playActivationFeedback() {
    setIsActivated(false);
    requestAnimationFrame(() => setIsActivated(true));
  }

  return (
    <ExternalLink
      aria-label={`打开项目：${projectName}`}
      className={`${styles.projectVisit}${isActivated ? ` ${styles.projectVisitActivated}` : ""}`}
      href={href}
      onAnimationEnd={() => setIsActivated(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          playActivationFeedback();
        }
      }}
      onPointerDown={playActivationFeedback}
      showIcon={false}
    >
      <span>打开项目</span>
      <span aria-hidden="true" className={styles.projectVisitIcon}>
        <ArrowUpRight />
      </span>
    </ExternalLink>
  );
}
