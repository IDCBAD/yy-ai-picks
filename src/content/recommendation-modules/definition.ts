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

const RECOMMENDATION_LOGOS: Record<string, string> = {
  chatgpt: "/assets/icons/openai.svg",
  codex: "/assets/icons/openai.svg",
  "claude-code": "/assets/icons/claude-code.svg",
  cursor: "/assets/icons/cursor.svg",
  ccswitch: "/assets/icons/ccswitch.png",
  vercel: "/assets/icons/vercel.svg",
  cloudflare: "/assets/icons/cloudflare.svg",
  "hermes-agent": "/assets/icons/hermes-agent.png",
  "agent-reach": "/assets/icons/agent-reach.png",
  colaos: "/assets/icons/colaos.png",
  bloome: "/assets/icons/bloome.png",
  happycapy: "/assets/icons/happycapy.svg",
  newmax: "/assets/icons/newmax.png",
  "kimi-work": "/assets/icons/kimi-work.png",
  obsidian: "/assets/icons/obsidian.svg",
  notion: "/assets/icons/notion.svg",
  youmind: "/assets/icons/youmind.png",
  aihot: "/assets/icons/aihot.png",
  "open-design": "/assets/icons/open-design.png",
  kling: "/assets/icons/kling.png",
  midjourney: "/assets/icons/midjourney.svg",
  remotion: "/assets/icons/remotion.svg",
  "ppt-master": "/assets/icons/ppt-master.png",
  "guizang-ppt-skill": "/assets/icons/guizang-ppt-skill.png",
  "awesome-design-md": "/assets/icons/awesome-design-md.png",
  catchmeta: "/assets/icons/catchmeta.png",
};

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
    logo: content.logo ?? RECOMMENDATION_LOGOS[content.slug],
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
