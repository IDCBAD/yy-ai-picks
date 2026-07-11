import type { PlatformType, PricingType, ProjectStatus } from "@/types";

export const PRICING_LABELS: Record<PricingType, string> = {
  free: "免费",
  freemium: "免费增值",
  paid: "付费",
  "open-source": "开源",
};

export const PLATFORM_LABELS: Record<PlatformType, string> = {
  web: "Web",
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
  ios: "iOS",
  android: "Android",
  cli: "CLI",
  api: "API",
  "self-hosted": "自托管",
  "browser-extension": "浏览器扩展",
  nodejs: "Node.js",
  python: "Python",
  react: "React",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  launched: "已上线",
  iterating: "持续迭代",
  prototype: "原型阶段",
  experiment: "实验项目",
  paused: "暂停维护",
};

export function formatDisplayDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}
