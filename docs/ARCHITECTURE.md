# 架构说明

## 技术栈

- Next.js 16、React 19、App Router。
- TypeScript strict。
- Tailwind CSS 4 与 CSS 设计令牌。
- Zod 用于本地内容在启动和构建阶段的结构与关联校验。
- Vitest、Testing Library 用于单元和组件测试。
- Playwright 使用本机系统 Chrome 执行真实浏览器 Smoke Test。
- ESLint 与 Prettier 统一代码检查和格式。

版本以 `package.json` 和锁文件为准。本项目不引入大型 UI 框架或全局状态库。

Playwright 固定使用 `channel: "chrome"`，不下载托管 Chromium。项目要求 Node.js 20.19+、22.13+ 或 24+，以同时满足 Next.js 与测试工具要求。

## 参考原型结论

`reference/opendesign` 含七个页面、共享样式与共享脚本。它通过 `common.js` 的大型 `SITE_DATA`、字符串模板和 DOM 查询生成内容，并在各 HTML 内重复页面样式。正式项目保留其信息结构与视觉语言，但不复制这套代码组织方式，也不修改参考目录。

重复模式包括：顶栏与移动导航、面包屑、Hero、章节标题、搜索框、筛选标签、推荐卡、场景卡、状态标记、项目卡、空状态、页脚和返回顶部。它们将在 Phase 3 形成共享组件，页面只负责组合。

## 目录结构

```text
src/
  app/                 App Router、全局布局和路由状态
  components/          UI、布局、推荐、搜索筛选和反馈公共组件
  content/             经过校验的本地内容源
    recommendation-modules/  按用途拆分、可单独编辑的推荐内容模块
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
/                              正式首页
/categories/[slug]             6 个分类 slug，筛选请求由服务端渲染
/scenarios/[slug]              6 个静态场景页
/recommendations/[slug]        23 个静态推荐详情
/search
/projects
/about
/sitemap.xml
/robots.txt
/dev/components        内部组件预览，noindex，不进入正式导航
```

全局 `loading.tsx`、`error.tsx`、`global-error.tsx` 和 `not-found.tsx` 复用反馈组件，错误页不展示异常对象或堆栈。Phase 5 已完成全部公开路由；`/dev/components` 只在开发环境用于组件人工检查，页面自身在生产环境返回真实 404。

## 公共组件边界

```text
src/components/
  ui/              Button、Tag、Badge、Card、IconButton、ExternalLink
  layout/          Header、Footer、Navigation、Container、Header、Breadcrumb、BackToTop
  recommendation/  Logo、Status、Metadata、Card、Grid
  search/          SearchBar
  filters/         FilterPill、FilterBar
  feedback/        EmptyState、ErrorState、LoadingSkeleton
  content/         CategoryCard、ScenarioCard、ProjectCard
  scenario/        ScenarioStepCard、ScenarioWorkflow
  search-results/  SearchResultSection、SearchResultCard
  projects/        ProjectGroup
  about/           AboutSection
  dev/             预览页所需的最小交互夹具
```

组件入口使用各目录 `index.ts` 和 `src/components/index.ts` 统一导出。推荐卡接收已经解析的 Recommendation、Category 和 Tag，不读取 Repository，不调用 Service，也不复制领域模型。

## 服务端与客户端边界

- 页面、布局、静态内容读取和元数据默认使用 Server Components。
- 数据查询在服务端完成，序列化后的最小数据传给交互组件。
- 当前只有导航状态、移动菜单、首页搜索与筛选、分类筛选、搜索输入、预览交互、Logo 错误回退和返回顶部使用 `"use client"`。
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

已实现页面所需业务 Service：

- `RecommendationService`：公开列表、精选、最近更新、分类/标签数量、关联对象、项目状态分组和全站最新日期。
- `SearchService`：推荐、场景、项目和文章四类本地搜索结果。
- `FilterService`：分类、关系、定价、开源、自托管、平台和多标签交集筛选，以及四种排序。
- `ScenarioService`：场景步骤的首选/替代工具解析，并直接从步骤去重计算工具汇总和数量，不依赖手工统计。
- `HomeService`：组合首页发布数量、最近更新、分类与关系数量、长期关系、筛选结果、场景和项目。
- `CategoryService`：组合可见分类、分类内标签计数、筛选排序、推荐卡片数据、相关场景与文章。
- `ProjectService`：组合公开项目、五种状态分组、数量和项目更新时间。

`src/lib/content-services.ts` 是服务端组合入口，负责连接全部 Local Repository 与 Service。正式页面只导入组合后的 Service，不直接导入 `src/content` 或具体 Repository。

## 搜索实现

第一版使用服务端本地搜索，不接入外部搜索服务。`SearchService` 统一规范化首尾空格、英文大小写和 Unicode 文本，覆盖名称、URL/域名、简介、分类、标签、推荐理由、关联场景、关联项目和文章。空关键词返回四组空结果；结果总数由各组长度计算。

筛选采用不同条件之间的交集语义；多个标签要求全部匹配。排序支持最近更新、最近收录、精选顺序和名称。`query-params.ts` 集中解析 `q`、`category`、`relationship`、`pricing`、`openSource`、`selfHostable`、`platform`、`tags` 和 `sort`；非法值安全忽略，标签使用逗号分隔并去重。

数据量增长后，可在不改变页面调用方式的前提下把 Service 内部替换为数据库全文搜索或独立搜索服务。

## 页面生成与 Metadata

- 首页读取 URL Search Params 后在服务端组合数据，默认可静态生成，带筛选参数时服务端重新渲染。
- 推荐详情通过 `RecommendationService.getPublished()` 生成静态参数，`dynamicParams = false` 让未知 slug 直接返回 404。
- 分类页通过 `CategoryService.getVisible()`、场景页通过 `ScenarioService.getPublished()` 生成静态参数；隐藏分类、未发布场景和未知 slug 不会生成页面。
- 推荐详情的 `generateMetadata()` 只为已发布内容生成标题、简介、canonical、Open Graph 和 robots。
- 详情页输出不包含评分、价格和作者虚构信息的 `SoftwareApplication` 基础结构化数据。
- 内容更新时间决定缓存与重新验证策略；初始本地内容可随构建发布。
- 搜索页读取 URL 参数并在服务端计算结果，避免将完整数据集发送到浏览器。
- `sitemap.ts` 只列出首页、可见分类、已发布场景、已发布推荐、项目和关于页；`robots.ts` 排除开发预览。搜索页使用 `noindex, follow`。
- 无效 slug 调用 `notFound()`，不渲染伪 404。

站点地址由 `NEXT_PUBLIC_SITE_URL` 提供，Vercel 部署可回退到生产域名变量；本地缺失时使用 `http://localhost:3000`。生产和 CI 地址必须使用 HTTPS。favicon、manifest 和社交分享图均由 App Router 本地生成，不依赖第三方热链。

所有推荐仍通过 Service 和 Repository 获取。已复核推荐参与关系计数、首页关系筛选和长期使用区块；未来暂存未确认内容时，`editorialStatus !== "verified"` 的条目不会进入这些区块。

推荐内容不再集中写在一个大文件中：`src/content/recommendation-modules/` 按用途拆分模块，`index.ts` 统一汇总，`definition.ts` 只补充审核状态、日期和更新记录等公共字段。编辑单个工具时只需要修改对应模块；新增工具复制模块结构并更新关联场景，随后运行内容校验。

`next.config.ts` 导入 `src/content/index.ts`。该入口在配置加载时执行 `validateContentData()`，因此无效内容在正式页面生成前就会阻止开发服务或生产构建。

`next.config.ts` 同时为所有路由设置来源策略、MIME 嗅探保护、禁止 iframe 嵌入和摄像头/麦克风/定位权限。当前没有第三方脚本或远程图片白名单。

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

Phase 0/1 建立文档、项目骨架和质量工具；Phase 2 完成数据层；Phase 3 完成设计系统和公共组件。正式业务页面保持到 Phase 4 开始。

### ADR-006：单一图标源和最小客户端边界

公共组件统一使用 `lucide-react` 线性图标。纯展示组件保持服务端兼容，只有依赖路由、输入、滚动、焦点或图片错误状态的叶子组件进入客户端，避免把完整推荐数据发送到浏览器。

### ADR-007：Cloudflare Workers 部署

生产环境通过 OpenNext 适配器部署到 Cloudflare Workers，保留 Next.js 的服务端渲染、动态路由和生产环境访问控制。Worker 名称为 `yy-ai-picks`，自定义域名为 `picks.yuyi-ai.top`；`NEXT_PUBLIC_SITE_URL` 统一使用该 HTTPS 地址生成 canonical、sitemap 与分享元数据。增量缓存使用绑定的 R2 存储桶，静态 Next.js 资源使用一年不可变缓存。
