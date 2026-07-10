# 余一的 AI 推荐清单

当前完成 Phase 0 至 Phase 2：参考分析、项目文档、Next.js 基础结构、统一数据模型、本地内容、Repository、Service、搜索筛选和 URL 参数规则。Phase 3 创建共享组件，Phase 4–5 创建公开页面。

需要 Node.js 20.19+、22.13+ 或 24+。

## 本地运行

```bash
npm install
npx playwright install chromium
npm run dev
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
