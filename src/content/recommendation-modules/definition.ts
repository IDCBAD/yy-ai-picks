import type { Recommendation } from "../../types";

export type RecommendationModule = Omit<
  Recommendation,
  | "id"
  | "availabilityStatus"
  | "publishStatus"
  | "editorialStatus"
  | "publishedAt"
  | "lastCheckedAt"
  | "createdAt"
  | "updatedAt"
  | "updateLogs"
> & {
  editorialStatus?: Recommendation["editorialStatus"];
  lastCheckedAt?: string;
  reviewNote?: string;
};

const contentDate = "2026-07-16T00:00:00.000Z";

export function defineRecommendation(module: RecommendationModule): Recommendation {
  const {
    editorialStatus = "verified",
    lastCheckedAt = contentDate,
    reviewNote,
    ...content
  } = module;
  const reviewed = editorialStatus === "verified";

  return {
    ...content,
    id: `rec-${content.slug}`,
    availabilityStatus: "available",
    publishStatus: "published",
    editorialStatus,
    publishedAt: contentDate,
    lastCheckedAt,
    createdAt: contentDate,
    updatedAt: contentDate,
    updateLogs: [
      {
        id: `log-${content.slug}-2026-07-16`,
        date: lastCheckedAt,
        title: reviewed ? "作者复核" : "内容补充中",
        description:
          reviewNote ??
          (reviewed
            ? "作者已复核实际使用方式与主观判断。"
            : "已依据公开资料生成基础信息，等待补充实际使用方式与主观判断。"),
        type: "checked",
      },
    ],
  };
}
