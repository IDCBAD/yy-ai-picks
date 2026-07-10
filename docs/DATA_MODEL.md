# 数据模型

## 原则

- 所有公开页面由统一领域数据生成，页面不得保存完整业务数据副本。
- 本地内容在进入 Repository 前通过 Zod 校验；非法 slug、枚举、日期或关联在测试和构建时失败。
- 实体使用稳定 `id` 建立关联，公开路由使用唯一 `slug`。
- 日期使用 ISO 8601 字符串；可选字段缺失时不以空字符串冒充有效值。
- 列表字段默认空数组，便于页面稳定渲染。
- 本文只定义契约；类型、Schema、数据与 Repository 在 Phase 2 实现。

## Recommendation

| 字段                       | 类型                       | 约束                                |
| -------------------------- | -------------------------- | ----------------------------------- |
| `id`                       | string                     | 必填、全局唯一、稳定                |
| `slug`                     | string                     | 必填、URL 安全、全局唯一            |
| `name`                     | string                     | 必填、去除首尾空白                  |
| `url`                      | string                     | 必填、合法 `https` 地址             |
| `categoryId`               | string                     | 必须引用存在的 Category             |
| `tagIds`                   | string[]                   | 每项必须引用存在的 Tag，不重复      |
| `shortDescription`         | string                     | 必填，用于卡片与元数据              |
| `recommendationReason`     | string                     | 必填，必须体现个人判断              |
| `usageDescription`         | string?                    | 可选，描述实际用法                  |
| `suitableFor`              | string[]                   | 至少一项                            |
| `unsuitableFor`            | string[]?                  | 可选                                |
| `strengths`                | string[]                   | 至少一项                            |
| `limitations`              | string[]                   | 至少一项，不隐藏已知限制            |
| `pricing`                  | Pricing                    | 必填枚举                            |
| `platforms`                | string[]                   | 至少一项、去重                      |
| `isOpenSource`             | boolean                    | 必填                                |
| `selfHostable`             | boolean                    | 必填                                |
| `accessRegion`             | string?                    | 可选，说明地区限制或可用性          |
| `relationship`             | RecommendationRelationship | 必填枚举                            |
| `status`                   | PublicationStatus          | 必填枚举                            |
| `logo`                     | string?                    | 可选，本地资源路径                  |
| `coverImage`               | string?                    | 可选，本地资源路径                  |
| `featured`                 | boolean                    | 必填                                |
| `featuredOrder`            | number?                    | 精选时可选，非负整数                |
| `relatedScenarioIds`       | string[]                   | 引用 Scenario，去重                 |
| `relatedRecommendationIds` | string[]                   | 引用其他 Recommendation，不得自引用 |
| `relatedProjectIds`        | string[]                   | 引用 Project，去重                  |
| `relatedArticles`          | ArticleReference[]         | 可为空数组                          |
| `publishedAt`              | ISODateTime?               | 发布时建议存在                      |
| `lastCheckedAt`            | ISODateTime?               | 最近复查时间                        |
| `createdAt`                | ISODateTime                | 必填                                |
| `updatedAt`                | ISODateTime                | 必填，不早于 `createdAt`            |
| `updateLogs`               | UpdateLog[]                | 按日期倒序展示                      |

## Category

| 字段               | 类型              | 约束                       |
| ------------------ | ----------------- | -------------------------- |
| `id`               | string            | 唯一、稳定                 |
| `slug`             | string            | 唯一、URL 安全             |
| `name`             | string            | 六个固定一级分类之一       |
| `shortDescription` | string            | 卡片说明                   |
| `description`      | string            | 分类页说明                 |
| `icon`             | string            | 图标映射键，不保存任意 SVG |
| `order`            | number            | 非负整数、全局唯一优先顺序 |
| `status`           | PublicationStatus | 控制公开可见性             |

固定一级分类：AI 助手与模型、AI 编程与开发、Agent 与自动化、知识与信息管理、内容与视觉创作、独立产品与灵感。

## Tag

| 字段          | 类型    | 约束                             |
| ------------- | ------- | -------------------------------- |
| `id`          | string  | 唯一、稳定                       |
| `slug`        | string  | 唯一、URL 安全                   |
| `name`        | string  | 必填                             |
| `categoryId`  | string? | 可选；存在时限制为该分类的子标签 |
| `description` | string? | 可选                             |
| `order`       | number  | 非负整数                         |

## Scenario

| 字段                       | 类型               | 约束                 |
| -------------------------- | ------------------ | -------------------- |
| `id`                       | string             | 唯一、稳定           |
| `slug`                     | string             | 唯一、URL 安全       |
| `title`                    | string             | 必填                 |
| `shortDescription`         | string             | 场景入口说明         |
| `description`              | string             | 场景详情说明         |
| `audience`                 | string[]           | 至少一项             |
| `icon`                     | string             | 图标映射键           |
| `steps`                    | ScenarioStep[]     | 至少一项，顺序唯一   |
| `relatedRecommendationIds` | string[]           | 从步骤工具汇总并校验 |
| `relatedArticles`          | ArticleReference[] | 可为空数组           |
| `status`                   | PublicationStatus  | 必填                 |
| `updatedAt`                | ISODateTime        | 必填                 |

## ScenarioStep

| 字段                           | 类型     | 约束                                |
| ------------------------------ | -------- | ----------------------------------- |
| `id`                           | string   | 在所属 Scenario 内唯一              |
| `order`                        | number   | 从 1 开始、连续且不重复             |
| `title`                        | string   | 必填                                |
| `description`                  | string   | 必填                                |
| `primaryRecommendationId`      | string   | 必须引用存在且公开的 Recommendation |
| `alternativeRecommendationIds` | string[] | 不得包含首选项、不得重复            |
| `reason`                       | string   | 说明选择首选工具的原因              |

## Project

| 字段                | 类型          | 约束                          |
| ------------------- | ------------- | ----------------------------- |
| `id`                | string        | 唯一、稳定                    |
| `slug`              | string        | 唯一、URL 安全                |
| `name`              | string        | 必填                          |
| `shortDescription`  | string        | 必填                          |
| `description`       | string?       | 可选                          |
| `status`            | ProjectStatus | 必填                          |
| `url`               | string?       | 存在时为合法 `https` 地址     |
| `repositoryUrl`     | string?       | 存在时为合法 `https` 地址     |
| `coverImage`        | string?       | 本地资源路径                  |
| `tagIds`            | string[]      | 引用 Tag，去重                |
| `recommendationIds` | string[]      | 项目实际使用的 Recommendation |
| `featured`          | boolean       | 必填                          |
| `startedAt`         | ISODate?      | 可选                          |
| `launchedAt`        | ISODate?      | 已上线项目建议存在            |
| `updatedAt`         | ISODateTime   | 必填                          |

项目状态：`launched`、`iterating`、`prototype`、`experiment`、`paused`，分别对应已上线、持续迭代、原型阶段、实验项目、暂停维护。

## ArticleReference

| 字段          | 类型        | 约束                                      |
| ------------- | ----------- | ----------------------------------------- |
| `id`          | string      | 唯一、稳定                                |
| `title`       | string      | 必填                                      |
| `url`         | string      | 合法 `https` 地址，不允许 `#` 占位        |
| `source`      | string      | 站点或作者名称                            |
| `summary`     | string?     | 可选                                      |
| `publishedAt` | ISODate?    | 可选                                      |
| `type`        | ArticleType | `article`、`guide`、`video`、`case-study` |

## UpdateLog

| 字段          | 类型          | 约束                                                       |
| ------------- | ------------- | ---------------------------------------------------------- |
| `id`          | string        | 在所属实体内唯一                                           |
| `date`        | ISODate       | 必填                                                       |
| `title`       | string        | 必填                                                       |
| `description` | string        | 必填                                                       |
| `type`        | UpdateLogType | `added`、`updated`、`status-change`、`checked`、`archived` |

## 枚举

```text
RecommendationRelationship:
daily-use | long-term-use | used-in-project | testing | watching | my-product

PublicationStatus:
draft | published | archived | unavailable

Pricing:
free | freemium | paid | open-source

ProjectStatus:
launched | iterating | prototype | experiment | paused
```

推荐关系中文映射固定为：每天使用、长期使用、项目用过、正在体验、持续关注、我的项目。文字、颜色和图标由统一映射提供。

## 关联关系

- Category 一对多 Recommendation；Tag 与 Recommendation 多对多。
- Scenario 包含有序 ScenarioStep；每个步骤引用一个首选推荐和多个替代推荐。
- Recommendation 可与 Scenario、Recommendation、Project 多对多关联。
- Recommendation 与 Scenario 可嵌入 ArticleReference；若文章需要独立搜索，Repository 应将其规范化为可检索记录。
- UpdateLog 隶属于 Recommendation；未来可扩展到 Project，但不在初始接口中混用。

## 全局校验

- 所有 `id`、`slug` 唯一，所有引用必须存在。
- 已发布内容不能引用草稿或不可用内容作为首选入口。
- 数量、更新时间、精选列表和分类统计均由数据计算，不写死。原型中“42 个工具”与实际 41 条不一致的问题不得延续。
- 排序必须有明确字段；“最近更新”和“最近收录”分别使用 `updatedAt` 与 `createdAt`/`publishedAt`。
- 所有外部 URL 使用 `https`；文章和项目不得使用 `#` 占位。
- 图片路径必须指向 `public` 内存在资源，并提供可读替代文字来源。
