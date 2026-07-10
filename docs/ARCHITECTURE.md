# 架构说明

## 技术栈

- Next.js 16、React 19、App Router。
- TypeScript strict。
- Tailwind CSS 4 与 CSS 设计令牌。
- Zod 用于本地内容在启动和构建阶段的结构与关联校验。
- Vitest、Testing Library 用于单元和组件测试。
- Playwright 用于真实浏览器 Smoke Test。
- ESLint 与 Prettier 统一代码检查和格式。

版本以 `package.json` 和锁文件为准。本项目不引入大型 UI 框架或全局状态库。

Playwright 优先使用其管理的 Chromium，安装依赖后需执行 `npx playwright install chromium`；若本地尚未安装该浏览器，可回退到系统 Chrome。项目要求 Node.js 20.19+、22.13+ 或 24+，以同时满足 Next.js 与测试工具要求。

## 参考原型结论

`reference/opendesign` 含七个页面、共享样式与共享脚本。它通过 `common.js` 的大型 `SITE_DATA`、字符串模板和 DOM 查询生成内容，并在各 HTML 内重复页面样式。正式项目保留其信息结构与视觉语言，但不复制这套代码组织方式，也不修改参考目录。

重复模式包括：顶栏与移动导航、面包屑、Hero、章节标题、搜索框、筛选标签、推荐卡、场景卡、状态标记、项目卡、空状态、页脚和返回顶部。它们将在 Phase 3 形成共享组件，页面只负责组合。

## 目录结构

```text
src/
  app/                 App Router、全局布局和路由状态
  components/          跨页面共享组件
  content/             经过校验的本地内容源
  lib/                 无业务归属的纯工具与配置
  repositories/        数据访问接口及实现
  services/            搜索、筛选和页面用例
  types/               领域类型和枚举
public/
  assets/
    icons/
    images/
tests/
  unit/
  e2e/
docs/                  产品、架构、设计、数据、计划和验收文档
reference/opendesign/  只读视觉参考
```

领域代码按责任分开，但避免为一次性逻辑创建无价值抽象。相互依赖的类型、校验和内容文件保持靠近。

## 路由结构

```text
/
/categories/[slug]
/scenarios/[slug]
/recommendations/[slug]
/search
/projects
/about
```

全局补充 `loading.tsx`、`error.tsx` 和 `not-found.tsx`。业务路由从 Phase 4 开始创建；Phase 1 仅保留中性的根页面以验证项目可运行。

## 服务端与客户端边界

- 页面、布局、静态内容读取和元数据默认使用 Server Components。
- 数据查询在服务端完成，序列化后的最小数据传给交互组件。
- 搜索输入、移动导航、筛选抽屉等确实依赖浏览器状态的叶子组件才使用 `"use client"`。
- 不在顶层布局建立全站 Client Component，不使用客户端请求重复获取首屏已有数据。
- 客户端状态的可分享部分优先来自 URL Search Params。

## 数据访问方式

页面依赖 Service 或 Repository 接口，不直接导入具体 JSON、TypeScript 数据文件或 Supabase SDK。Phase 2 先提供本地实现：

```ts
interface RecommendationRepository {
  getAllPublished(): Promise<Recommendation[]>;
  getBySlug(slug: string): Promise<Recommendation | null>;
  getByCategory(categoryId: string): Promise<Recommendation[]>;
  getFeatured(): Promise<Recommendation[]>;
  search(query: string): Promise<Recommendation[]>;
}
```

Repository 负责存取与基础查询，Service 负责搜索、筛选、排序、关联组装等用例。Zod 在本地内容进入 Repository 前校验，非法内容使测试或构建尽早失败。

Phase 2 已实现 Recommendation、Category、Tag、Scenario、Project 和 Article 的本地 Repository。构造函数可以接收任意经过校验的 `ContentData`，默认使用 `src/content`；测试和未来数据源可以提供其他实现。列表查询返回新数组，调用方排序不会改变底层存储顺序。

已实现四个业务 Service：

- `RecommendationService`：公开列表、精选、最近更新、分类/标签数量、关联对象、项目状态分组和全站最新日期。
- `SearchService`：推荐、场景、项目和文章四类本地搜索结果。
- `FilterService`：分类、关系、定价、开源、自托管、平台和多标签交集筛选，以及四种排序。
- `ScenarioService`：场景步骤的首选/替代工具解析、去重汇总和工具数量。

## 搜索实现

第一版使用服务端本地搜索，不接入外部搜索服务。`SearchService` 统一规范化首尾空格、英文大小写和 Unicode 文本，覆盖名称、URL/域名、简介、分类、标签、推荐理由、关联场景、关联项目和文章。空关键词返回四组空结果；结果总数由各组长度计算。

筛选采用不同条件之间的交集语义；多个标签要求全部匹配。排序支持最近更新、最近收录、精选顺序和名称。`query-params.ts` 集中解析 `q`、`category`、`relationship`、`pricing`、`openSource`、`selfHostable`、`platform`、`tags` 和 `sort`；非法值安全忽略，标签使用逗号分隔并去重。

数据量增长后，可在不改变页面调用方式的前提下把 Service 内部替换为数据库全文搜索或独立搜索服务。

## 静态生成策略

- 首页、项目页和关于页在构建时生成。
- 分类、场景和推荐详情通过已发布内容生成静态参数。
- 内容更新时间决定缓存与重新验证策略；初始本地内容可随构建发布。
- 搜索页读取 URL 参数并在服务端计算结果，避免将完整数据集发送到浏览器。
- 无效 slug 调用 `notFound()`，不渲染伪 404。

`next.config.ts` 导入 `src/content/index.ts`。该入口在配置加载时执行 `validateContentData()`，因此无效内容在正式页面生成前就会阻止开发服务或生产构建。

## 错误、加载与空状态

- 路由段使用 `loading.tsx` 提供结构稳定的加载状态。
- `error.tsx` 提供可恢复错误说明，并记录未来监控接入点。
- `not-found.tsx` 处理无效路径和 slug。
- 列表无数据、筛选无结果、关联内容缺失使用统一 `EmptyState`，不把缺失内容当异常。
- 外部服务接入后，Repository 将底层错误转为可识别的领域错误，页面不展示内部细节。

## Supabase 迁移

1. 保持领域类型、Zod Schema、Repository 接口和 Service 调用不变。
2. 新增 `SupabaseRecommendationRepository` 等实现，将表记录映射为领域实体。
3. 在服务端组合根中选择本地或 Supabase 实现，页面无须改变。
4. 数据库客户端采用延迟初始化，避免构建阶段因环境变量缺失而失败。
5. 用契约测试保证本地与 Supabase 实现返回一致语义，再迁移数据源。

## 架构决策记录

### ADR-001：App Router 与服务端优先

选择 App Router，页面和数据读取默认在服务端，减少客户端脚本并直接支持静态生成、元数据和真正的 404。

### ADR-002：Repository 与 Service 分层

选择可替换 Repository 隔离存储，Service 集中搜索与筛选规则。这样未来接入 Supabase 不需要重写页面。

### ADR-003：原型只作为参考

不复制原型的字符串模板、页面内样式和大型全局数据对象。参考目录保持只读，共同模式在后续阶段抽成共享组件与令牌。

### ADR-004：URL 保存可分享状态

搜索词和筛选条件使用 URL Search Params，支持刷新、分享、浏览器前进后退和服务端渲染，无需全局状态库。

### ADR-005：分阶段交付

Phase 0/1 建立文档、项目骨架和质量工具；Phase 2 已完成数据层；Phase 3 才创建设计系统组件，避免在边界未稳定时并行复制页面。
