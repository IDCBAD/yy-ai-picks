const fallbackUrl = "http://localhost:3000";

function resolveSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  try {
    return new URL(configured || fallbackUrl);
  } catch {
    return new URL(fallbackUrl);
  }
}

export const siteConfig = {
  name: "余一的 AI 推荐清单",
  description: "不是 AI 工具大全，而是一份基于真实关系整理的个人工作台。",
  url: resolveSiteUrl(),
} as const;
