import { Check, CircleX, RefreshCw, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { AboutSection } from "@/components/about";
import { Breadcrumb, PageContainer, PageHeader } from "@/components/layout";
import { RECOMMENDATION_STATUS, StatusBadge } from "@/components/recommendation";
import { createPageMetadata } from "@/lib/page-metadata";
import { RECOMMENDATION_RELATIONSHIPS } from "@/types";

import styles from "./about-page.module.css";

const inclusionCriteria = [
  "能够说明它解决的问题、适用对象、使用场景与限制。",
  "能够与现有工具或流程形成清楚的工作关系。",
  "内容来源和对外地址可以核对，不使用空链接或占位说明。",
  "推荐关系、可用状态和检查时间有明确记录。",
];

const exclusionCriteria = [
  "只因热度、广告或收录数量而加入。",
  "无法说明实际价值，只能重复产品宣传语。",
  "缺少有效来源、无法访问或存在明显安全风险。",
  "需要编造个人经历才能形成推荐理由。",
];

export const metadata: Metadata = createPageMetadata({
  title: "关于与推荐标准",
  description: "了解这份 AI 推荐清单的定位、收录标准、审核规则、更新机制与免责声明。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageContainer className={styles.page} narrow>
      <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "关于" }]} />
      <PageHeader
        description="这不是 AI 工具大全，而是基于个人实践整理的推荐与工作流资源库。"
        eyebrow="ABOUT THIS LIST"
        title="关于这份清单"
      />

      <p className={styles.intro}>
        网站希望把工具名称之外的判断保留下来：它适合解决什么问题、可以进入哪段流程，以及有哪些边界。
      </p>

      <div className={styles.sections}>
        <AboutSection number={1} title="为什么做这个网站">
          <p>
            工具目录通常强调数量与更新速度，这里更关注选择依据和工作流关系。每条推荐都经过作者复核，保留真实体验与适用边界。
          </p>
        </AboutSection>

        <AboutSection number={2} title="网站定位">
          <p>
            这是面向 AI 编程、Agent
            开发、自动化、知识管理和内容创作的精选资源库。它提供可追溯的分类、场景、推荐关系和内容边界，不提供排行榜。
          </p>
        </AboutSection>

        <div className={styles.criteriaGrid} id="recommendation-criteria">
          <AboutSection headingLevel={2} number="03A" title="收录标准">
            <ul>
              {inclusionCriteria.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </AboutSection>
          <AboutSection headingLevel={2} number="03B" title="不收录标准" tone="muted">
            <ul>
              {exclusionCriteria.map((item) => (
                <li key={item}>
                  <CircleX aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </AboutSection>
        </div>

        <AboutSection
          description="状态描述使用全站统一映射，不在页面重复定义。"
          number={4}
          title="推荐关系状态"
        >
          <ul>
            {RECOMMENDATION_RELATIONSHIPS.map((relationship) => (
              <li key={relationship}>
                <StatusBadge relationship={relationship} />
                <span>{RECOMMENDATION_STATUS[relationship].description}</span>
              </li>
            ))}
          </ul>
        </AboutSection>

        <AboutSection number={5} title="内容更新机制">
          <p>
            <RefreshCw aria-hidden="true" />
            新增、状态变化、内容复查和归档都通过统一数据记录。页面数量、更新时间和关联结果由数据自动计算，不单独手工维护。
          </p>
        </AboutSection>

        <AboutSection number={6} title="内容说明">
          <p>
            <ShieldCheck aria-hidden="true" />
            每条推荐都结合作者的实际使用与公开资料整理，不使用“最佳”“最强”或“必选”等绝对表达；产品能力和服务条款仍应以官网最新信息为准。
          </p>
        </AboutSection>

        <AboutSection number={7} title="免责声明" tone="muted">
          <p>
            工具能力、价格、可用地区和服务条款可能变化。本站内容用于提供选择线索，不构成购买、投资、法律或安全建议；实际使用前请查看产品官网的最新说明并自行评估。
          </p>
        </AboutSection>
      </div>
    </PageContainer>
  );
}
