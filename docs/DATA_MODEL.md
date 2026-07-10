# 数据模型

## 实现位置

- 统一枚举：`src/types/enums.ts`
- 实体：`src/types/entities.ts`
- 搜索、筛选和查询参数类型：`src/types/search.ts`、`filter.ts`、`query.ts`
- Zod Schema：`src/lib/validation/content-schemas.ts`
- 跨实体校验：`src/lib/validation/validate-content-data.ts`
- 本地内容：`src/content`

页面不得复制或补全这些数据，只能通过 Repository 和 Service 获取稳定领域模型。

## Recommendation

| 字段                                      | 类型                       | 约束                                                |
| ----------------------------------------- | -------------------------- | --------------------------------------------------- |
| `id`、`slug`                              | string                     | 分别唯一；slug 只含小写字母、数字和连字符           |
| `name`、`url`                             | string                     | 名称非空；URL 必须为 HTTPS                          |
| `categoryId`                              | string                     | 引用存在的 Category                                 |
| `tagIds`                                  | string[]                   | 引用存在的 Tag，不重复                              |
| `shortDescription`                        | string                     | 必填展示摘要                                        |
| `recommendationReason`                    | string                     | 必填；不确定个人判断使用中性文字                    |
| `usageDescription`                        | string?                    | 可选的使用方式说明                                  |
| `suitableFor`、`strengths`、`limitations` | string[]                   | 至少一项                                            |
| `unsuitableFor`                           | string[]                   | 必填数组，可为空                                    |
| `pricing`                                 | PricingType                | 统一枚举                                            |
| `platforms`                               | PlatformType[]             | 至少一项                                            |
| `isOpenSource`、`selfHostable`            | boolean                    | 必填                                                |
| `accessRegion`                            | string?                    | 可选地区说明                                        |
| `relationship`                            | RecommendationRelationship | 原型提供的使用关系                                  |
| `availabilityStatus`                      | RecommendationAvailability | 可用、受限、不可用或未知                            |
| `publishStatus`                           | PublishStatus              | 草稿、发布、归档或不可用                            |
| `editorialStatus`                         | EditorialStatus            | 已复核或待复核                                      |
| `logo`、`coverImage`                      | string?                    | 仅允许 `/assets/icons` 或 `/assets/images` 本地路径 |
| `featured`、`featuredOrder`               | boolean、number?           | 精选必须有唯一顺序；非精选不能有顺序                |
| `relatedScenarioIds`                      | string[]                   | 引用存在的 Scenario，不重复                         |
| `relatedRecommendationIds`                | string[]                   | 引用其他 Recommendation，不重复且不能自引用         |
| `relatedProjectIds`                       | string[]                   | 引用存在的 Project，不重复                          |
| `relatedArticles`                         | ArticleReference[]         | 每项 ID 必须存在于独立文章数据                      |
| `publishedAt`                             | ISO 8601?                  | 已发布推荐必填                                      |
| `lastCheckedAt`                           | ISO 8601?                  | 最近内容复查时间                                    |
| `createdAt`、`updatedAt`                  | ISO 8601                   | 必填                                                |
| `updateLogs`                              | UpdateLog[]                | 更新记录                                            |

## Category

字段：`id`、`slug`、`name`、`shortDescription`、`longDescription`、`iconKey`、`order`、`visible`、`createdAt`、`updatedAt`。

当前固定六类：AI 助手与模型、AI 编程与开发、Agent 与自动化、知识与信息管理、内容与视觉创作、独立产品与灵感。分类数量由已发布推荐动态计算，不保存 `count`。

## Tag

字段：`id`、`slug`、`name`、`group`、`description`、`visible`。ID、slug 和名称唯一。

标签分组：

- `capability`：对话、搜索、代码生成、浏览器控制、图像生成等能力。
- `scenario`：Agent 开发、独立开发、个人知识管理、内容创作等场景。
- `attribute`：开源、可自托管、付费、API、Web、桌面端等属性。

## Scenario 与 ScenarioStep

Scenario 字段：`id`、`slug`、`title`、`shortDescription`、`longDescription`、`audience`、`recommendationIds`、`steps`、`relatedArticles`、`publishStatus`、`publishedAt`、`updatedAt`。

ScenarioStep 字段：`id`、`order`、`title`、`description`、`primaryRecommendationIds`、`alternativeRecommendationIds`、`selectionReason`、`notes`。

步骤顺序在场景内唯一；所有工具必须存在；首选与替代不能重叠。场景 URL 使用 slug，不使用原型查询参数或失效锚点。

## Project

字段：`id`、`slug`、`name`、`shortDescription`、`problem`、`coreFeatures`、`techStack`、`status`、`publishStatus`、`coverImage?`、`projectUrl?`、`developmentLogUrl?`、`createdAt`、`updatedAt`。

原型中的 `#` 链接没有进入数据；未知地址保持字段缺失，不使用占位 URL。

## ArticleReference

字段：`id`、`title`、`url`、`type`、`description`、`publishedAt?`。文章是独立领域对象，不依赖具体博客系统；URL 必须为 HTTPS。

## UpdateLog

字段：`id`、`date`、`title`、`description`、`type`。类型包括新增、更新、状态变化、复查和归档。

## 统一枚举

```text
RecommendationRelationship:
daily-use | long-term-use | used-in-project | testing | watching | my-product

PublishStatus:
draft | published | archived | unavailable

RecommendationAvailability:
available | limited | unavailable | unknown

PricingType:
free | freemium | paid | open-source

ProjectStatus:
launched | iterating | prototype | experiment | paused

TagGroup:
capability | scenario | attribute

PlatformType:
web | macos | windows | linux | ios | android | cli | api | self-hosted |
browser-extension | nodejs | python | react

EditorialStatus:
verified | needs-review

SortOption:
recently-updated | recently-added | featured | name
```

## 全局数据集校验

`validateContentData()` 先执行所有单体 Schema，再执行：

- 各实体 ID、路由实体 slug、标签名称唯一。
- 分类、标签、场景、推荐、项目和文章引用有效。
- 推荐不能引用自己；所有关联数组不允许重复。
- 推荐与场景关系双向一致；场景汇总工具必须等于步骤中的首选和替代工具集合。
- 精选顺序存在、唯一且只属于精选推荐。
- 已发布推荐具有发布时间和完整展示字段。
- 场景步骤顺序唯一，步骤工具存在，首选与替代不重叠；工具数量直接从步骤去重计算。
- 图片路径符合公开资源目录规范。

`src/content/index.ts` 是统一校验入口；`next.config.ts` 在开发和构建前加载它，使非法内容尽早失败。

## 当前本地数据

- 6 个固定分类。
- 30 个分组标签。
- 20 条具有真实 HTTPS URL 的代表性推荐，覆盖全部分类。
- 6 个场景及其步骤工具关系。
- 4 个项目，不包含原型中的 `#` 占位地址。
- 4 条独立文档引用。

所有推荐个人评价均标记为 `needs-review`，没有编造原型未提供的深度使用经历。
