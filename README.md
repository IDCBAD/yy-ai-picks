# 余一的 AI 推荐清单

当前完成 Phase 0 至 Phase 3：参考分析、项目文档、Next.js 基础结构、数据层、设计系统、全局布局和公共组件。Phase 4–5 创建公开页面。

需要 Node.js 20.19+、22.13+ 或 24+。

## 本地运行

```bash
npm install
npm run dev
```

Playwright 固定使用本机系统 Chrome，不需要下载 Chromium。

## 公共组件

公共组件按职责位于 `src/components/ui`、`layout`、`recommendation`、`search`、`filters` 和 `feedback`，可从各目录入口或 `src/components/index.ts` 导入。

页面使用 `PageContainer`、`PageHeader` 和 `SectionHeader` 组合结构，不重复定义容器宽度。交互组件接收受控参数，不在内部读取 URL 或调用 Service。

## 扩展 RecommendationCard

`RecommendationCard` 接收 Phase 2 的 `Recommendation`，以及已经解析的 `Category` 和 `Tag[]`。显示差异使用 `default`、`compact`、`featured` 三种 variant；新增页面不得复制卡片。确实需要新的跨页面显示差异时，先扩展同一组件和测试。

## 增加推荐状态

推荐关系枚举定义在 `src/types/enums.ts`，文字、图标和视觉映射统一位于 `src/components/recommendation/recommendation-status.tsx`。增加状态时必须同时更新类型、数据校验、映射和组件测试，页面不能自行定义状态颜色。

## 使用设计令牌

全局令牌位于 `src/app/globals.css`。组件样式只能引用这些颜色、间距、圆角、边框、阴影、焦点和动效变量；新的共享值先加入令牌，再用于组件。

## 组件预览

运行开发服务器后访问：

```text
http://127.0.0.1:3000/dev/components
```

该页面只用于检查组件，设置为不索引，也不出现在正式导航中。

组件测试和浏览器测试：

```bash
npm run test
npm run test:e2e
```

## 数据目录

```text
src/content/
  categories.ts       六个固定分类
  tags.ts             按能力、场景和属性分组的标签
  recommendations.ts  推荐内容
  scenarios.ts        场景与步骤关系
  projects.ts         项目内容
  articles.ts         独立文章引用
  index.ts            统一校验和导出入口
```

类型位于 `src/types`，结构和关联校验位于 `src/lib/validation`。页面后续只依赖 `src/repositories` 与 `src/services`，不直接导入具体数据文件。

## 添加一条推荐

1. 在 `src/content/recommendations.ts` 增加记录。
2. 使用 `src/content/categories.ts` 和 `src/content/tags.ts` 中已有的 ID。
3. 关联场景、推荐、项目和文章时，确保目标 ID 已存在且不重复。
4. 不确定的个人评价使用中性文字，并设置 `editorialStatus: "needs-review"`。
5. 精选项设置唯一 `featuredOrder`；非精选项不能设置该字段。
6. 已发布内容必须填写 `publishedAt`，所有日期使用 ISO 8601。

## 添加分类

在 `src/content/categories.ts` 增加唯一 `id`、`slug`、顺序和完整说明。当前产品要求固定六个一级分类；新增一级分类前需要同步修改产品和数据模型文档。

## 添加标签

在 `src/content/tags.ts` 增加唯一名称和 slug，并选择 `capability`、`scenario` 或 `attribute` 分组。推荐通过标签 ID 建立关系。

## 添加场景

在 `src/content/scenarios.ts` 增加场景和有序步骤。步骤顺序不得重复；首选和替代工具必须存在且不能重叠；场景 slug 决定未来公开 URL。

## 内容校验

```bash
npm run validate:content
```

`src/content/index.ts` 在导入时执行全局校验，`next.config.ts` 会在开发和构建启动前加载该入口，因此非法数据会尽早阻止构建。

数据错误会列出重复 ID、重复 slug、无效关联、精选顺序、场景步骤或图片路径等具体原因。根据错误中的实体 ID 定位对应内容文件，修正后重新运行内容校验。

## 全部检查

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## 迁移 Supabase

未来新增 Supabase Repository，并实现与本地 Repository 相同的接口和契约测试。页面与 Service 不改变，只在服务端组合入口替换 Repository 实例。
