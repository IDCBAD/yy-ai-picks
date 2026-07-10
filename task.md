# 余一的 AI 推荐清单：正式项目开发任务

你现在需要接管一个已经完成高保真视觉原型的个人推荐清单项目，并将其开发为一个结构清晰、可维护、可扩展、可以长期迭代的正式 Web 项目。

这不是一次简单的 HTML 页面转换任务。

你的目标不是机械地把 7 个静态 HTML 文件改写成 React，而是：

1. 理解产品目标。
2. 提取并固化设计系统。
3. 建立统一的数据模型。
4. 建立可替换的数据访问层。
5. 将重复页面重构为共享组件。
6. 完成所有公开页面。
7. 为未来接入 Supabase 后台保留清晰边界。
8. 保证类型检查、构建、测试和响应式验证通过。

---

## 一、项目定位

项目名称：

> 余一的 AI 推荐清单

核心定位：

> 收录我在 AI 编程、Agent 开发、自动化、知识管理和内容创作中，真正使用过、认真体验过或持续关注的工具、产品与资源。

它不是：

* 大而全的 AI 工具导航站。
* 自动抓取工具信息的网站。
* 依靠收录数量竞争的目录站。
* 没有个人判断的官网介绍集合。
* 工具排行榜。

它应该帮助用户理解：

* 这个工具是什么。
* 为什么值得推荐。
* 适合解决什么问题。
* 适合什么人。
* 我与这个工具的真实使用关系。
* 它有哪些限制。
* 有哪些同类替代。
* 它可以与哪些工具组合成工作流。

---

## 二、现有参考文件

Open Design 已经生成了一套静态高保真原型，位于：

```text
reference/opendesign/
```

其中包括：

```text
index.html
category.html
scenario.html
detail.html
search.html
projects.html
about.html
common.css
common.js
```

这些文件是：

> 视觉、布局、交互和内容结构的参考来源。

这些文件不是：

> 正式项目的代码架构基础。

要求：

1. 不要直接在这些文件上继续开发。
2. 不要修改 reference 目录中的文件。
3. 不要逐页复制 HTML 和 CSS。
4. 不要保留 7 套相互独立的页面组件。
5. 不要将 common.js 中的大型 SITE_DATA 直接复制到页面中。
6. 先分析并提取共性，再实现正式项目。
7. 视觉结果需要尽量接近参考原型。
8. 代码结构优先保证长期可维护性。

---

## 三、开发前必须完成的文档

在正式编写页面前，请先在项目中创建并完善以下文件：

```text
docs/PRD.md
docs/ARCHITECTURE.md
docs/DESIGN_SYSTEM.md
docs/DATA_MODEL.md
docs/ROADMAP.md
docs/ACCEPTANCE.md
AGENTS.md
```

### PRD.md 必须包含

* 项目背景。
* 产品定位。
* 目标用户。
* 用户核心任务。
* 页面清单。
* 功能范围。
* 当前版本不做什么。
* 用户浏览路径。
* 搜索和筛选规则。
* 推荐标准。

### ARCHITECTURE.md 必须包含

* 技术栈。
* 目录结构。
* 路由结构。
* 服务端组件与客户端组件边界。
* 数据访问方式。
* Repository 接口设计。
* 搜索实现方式。
* 静态生成策略。
* 错误和空状态处理。
* 未来接入 Supabase 的迁移方式。

### DESIGN_SYSTEM.md 必须包含

* 颜色令牌。
* 字体规则。
* 字号层级。
* 间距系统。
* 圆角。
* 边框。
* 阴影。
* 按钮。
* 标签。
* 卡片。
* 导航栏。
* 响应式断点。
* Hover 和 Focus 状态。
* reduced motion 规则。

### DATA_MODEL.md 必须包含

* Recommendation。
* Category。
* Tag。
* Scenario。
* ScenarioStep。
* Project。
* ArticleReference。
* UpdateLog。

说明各实体字段、枚举、关联关系和约束。

### ROADMAP.md 必须包含

至少拆分为：

* Phase 0：文档与架构。
* Phase 1：设计系统和数据层。
* Phase 2：公共组件。
* Phase 3：首页和详情页。
* Phase 4：其他页面。
* Phase 5：搜索、筛选和状态。
* Phase 6：测试和质量检查。
* Future：Supabase 与后台。

### ACCEPTANCE.md 必须包含

* 页面验收。
* 组件复用验收。
* 类型检查。
* ESLint。
* 构建。
* 单元测试。
* E2E 测试。
* 响应式测试。
* 键盘操作。
* 无障碍检查。
* 外部链接安全。
* 404、加载、错误和空状态。

### AGENTS.md 必须包含

* 每次任务开始前先阅读 docs。
* 禁止在页面组件中写死完整业务数据。
* 禁止复制已有组件。
* 禁止无理由增加依赖。
* 禁止修改 reference 目录。
* 修改架构时同步更新 ARCHITECTURE.md。
* 修改字段时同步更新 DATA_MODEL.md。
* 完成任务后必须运行 lint、typecheck、test 和 build。
* 出现失败时必须修复，不得只记录失败。
* 保持提交范围清晰。
* 不进行与当前任务无关的大面积重构。

完成以上文档后，再开始正式开发。

---

## 四、技术栈

使用：

```text
Next.js
TypeScript
App Router
Tailwind CSS
Zod
Vitest
Testing Library
Playwright
```

要求：

* 启用 TypeScript strict。
* 使用 ESLint。
* 使用统一格式化配置。
* 不使用 any 逃避类型问题。
* 不使用大型 UI 框架替代原有视觉。
* 可以使用少量无样式基础组件库，但必须保留现有设计语言。
* 不引入 Redux 等不必要的全局状态库。
* 搜索和筛选状态优先同步到 URL Search Params。
* 页面默认使用服务端组件。
* 仅在需要浏览器交互时使用 `"use client"`。
* 控制客户端 JavaScript 体积。

---

## 五、路由结构

正式路由使用：

```text
/
 /categories/[slug]
 /scenarios/[slug]
 /recommendations/[slug]
 /search
 /projects
 /about
```

同时实现：

```text
not-found.tsx
error.tsx
loading.tsx
```

旧的：

```text
category.html
scenario.html
detail.html
```

只作为参考，不保留为正式路由。

---

## 六、页面范围

需要完成以下公开页面。

### 1. 首页

包含：

1. Hero。
2. 搜索。
3. 最近更新。
4. 使用场景入口。
5. 分类浏览。
6. 我长期在用。
7. 全部推荐。
8. 我的项目。
9. 页脚。

### 2. 分类页

包含：

* 分类信息。
* 分类推荐数量。
* 子标签筛选。
* 推荐列表。
* 相关场景。
* 相关文章。
* 无内容状态。

### 3. 场景页

包含：

* 场景介绍。
* 适用人群。
* 分步骤工作流。
* 每步首选工具。
* 每步替代工具。
* 选择原因。
* 涉及工具汇总。
* 相关文章。
* 更新时间。

### 4. 推荐详情页

包含：

1. 基础信息。
2. 我为什么推荐。
3. 我怎么使用。
4. 适合谁。
5. 不适合谁。
6. 优点和限制。
7. 推荐场景。
8. 同类替代。
9. 相关文章和项目。
10. 更新记录。
11. 最后检查时间。

### 5. 搜索页

匹配：

* 工具名称。
* 描述。
* 分类。
* 标签。
* 推荐理由。
* 使用场景。
* 项目。
* 相关文章。

结果按类型分组：

* 推荐工具。
* 场景清单。
* 我的项目。
* 文章引用。

### 6. 我的项目页

按状态分组：

* 已上线。
* 持续迭代。
* 原型阶段。
* 实验项目。
* 暂停维护。

### 7. 关于页

包含：

* 为什么做这个网站。
* 推荐标准。
* 收录标准。
* 不收录标准。
* 推荐状态解释。
* 更新机制。
* 免责声明。

---

## 七、一级分类

固定使用以下 6 个一级分类：

```text
AI 助手与模型
AI 编程与开发
Agent 与自动化
知识与信息管理
内容与视觉创作
独立产品与灵感
```

分类必须通过数据驱动生成。

不要在不同页面重复定义分类数组。

---

## 八、推荐关系状态

统一使用以下枚举：

```text
daily-use
long-term-use
used-in-project
testing
watching
my-product
```

对应中文：

```text
每天使用
长期使用
项目用过
正在体验
持续关注
我的项目
```

状态文字、颜色和图标必须通过统一映射组件呈现。

不得在页面中各自实现。

---

## 九、数据模型

Recommendation 至少包含：

```ts
type Recommendation = {
  id: string
  slug: string
  name: string
  url: string

  categoryId: string
  tagIds: string[]

  shortDescription: string
  recommendationReason: string
  usageDescription?: string

  suitableFor: string[]
  unsuitableFor?: string[]
  strengths: string[]
  limitations: string[]

  pricing: 'free' | 'freemium' | 'paid' | 'open-source'
  platforms: string[]
  isOpenSource: boolean
  selfHostable: boolean
  accessRegion?: string

  relationship:
    | 'daily-use'
    | 'long-term-use'
    | 'used-in-project'
    | 'testing'
    | 'watching'
    | 'my-product'

  status: 'draft' | 'published' | 'archived' | 'unavailable'

  logo?: string
  coverImage?: string

  featured: boolean
  featuredOrder?: number

  relatedScenarioIds: string[]
  relatedRecommendationIds: string[]
  relatedProjectIds: string[]
  relatedArticles: ArticleReference[]

  publishedAt?: string
  lastCheckedAt?: string
  createdAt: string
  updatedAt: string

  updateLogs: UpdateLog[]
}
```

需要使用 Zod Schema 对本地内容数据进行校验。

项目启动或构建时，非法数据应当尽早暴露。

---

## 十、数据访问架构

禁止页面直接依赖具体数据文件。

定义 Repository 接口，例如：

```ts
interface RecommendationRepository {
  getAllPublished(): Promise<Recommendation[]>
  getBySlug(slug: string): Promise<Recommendation | null>
  getByCategory(categoryId: string): Promise<Recommendation[]>
  getFeatured(): Promise<Recommendation[]>
  search(query: string): Promise<Recommendation[]>
}
```

第一阶段实现：

```text
LocalRecommendationRepository
```

未来预留：

```text
SupabaseRecommendationRepository
```

页面只能依赖 Service 或 Repository 接口。

不要让页面知道数据来自本地 TypeScript、JSON 还是 Supabase。

---

## 十一、组件约束

至少抽取以下公共组件：

```text
SiteHeader
SiteFooter
MobileNavigation
Breadcrumb
SearchBar
SearchDialog
FilterBar
FilterDrawer
CategoryPill
Tag
StatusBadge
ExternalLink
SectionHeader
RecommendationCard
RecommendationGrid
RecommendationLogo
CategoryCard
ScenarioCard
ScenarioStep
ProjectCard
ArticleReferenceCard
EmptyState
ErrorState
LoadingSkeleton
BackToTop
```

要求：

* 同一业务概念只有一套核心组件。
* 不允许首页、分类页和搜索页分别实现不同版本的 RecommendationCard。
* 可以通过 variant 控制展示差异。
* variant 数量应保持克制。
* 不要创建大量只使用一次、没有抽象价值的组件。
* 页面负责组合，组件负责展示和交互，Service 负责业务数据。

---

## 十二、设计系统约束

视觉风格必须延续 Open Design 原型。

### 核心色

```text
背景：#FFF8EC
卡片：#FFFFFF
主文字：#1A1A1A
辅助文字：#6B6357
边框辅助：#E0D8C8
强调色：#E8C547
强调深色：#8A7300
```

### 视觉特征

* 暖白纸张背景。
* 黑色粗描边。
* 黄色强调。
* 硬阴影。
* 轻微剪贴簿感。
* 个人编辑手册感。
* 圆角卡片。
* 克制使用不规则旋转。

### 约束

* 不使用紫色科技渐变。
* 不使用玻璃拟态。
* 不改成普通 SaaS 风格。
* 不改成标准 shadcn 默认主题。
* 不使用复杂 3D。
* 不使用 emoji 代替图标。
* 不让所有卡片随机旋转。
* 移动端关闭卡片旋转。
* 正文内容优先保证可读性。

### 设计令牌

颜色、圆角、阴影、间距和字体必须定义为统一 Token。

不得在页面中散落重复的十六进制颜色和阴影值。

---

## 十三、搜索与筛选

搜索和筛选必须数据驱动。

搜索需要支持：

* 名称。
* 域名。
* 简介。
* 分类。
* 标签。
* 推荐理由。
* 使用场景。

首页筛选条件：

* 分类。
* 使用关系。
* 定价。
* 是否开源。
* 是否支持自托管。
* 平台。

要求：

* 搜索关键词同步到 URL。
* 筛选条件同步到 URL。
* 页面刷新后筛选状态保留。
* 支持清空筛选。
* 显示结果数量。
* 显示无结果状态。
* 不要依赖不可维护的 DOM 查询实现过滤。
* 搜索逻辑集中在 SearchService。

第一阶段允许使用本地搜索，不需要接入外部搜索服务。

---

## 十四、SEO 和元数据

每个页面需要正确生成：

* title。
* description。
* canonical。
* Open Graph。
* Twitter Card。
* robots 策略。

推荐详情页、分类页和场景页需要基于内容动态生成 metadata。

实现：

* sitemap。
* robots.txt。
* 基础结构化数据。

无效 slug 返回真正的 404。

---

## 十五、可访问性

必须满足：

* 全键盘可操作。
* 清晰的 focus-visible。
* 合理的语义标签。
* 图片具有 alt。
* 图标按钮具有 aria-label。
* 移动菜单具有 aria-expanded。
* 筛选抽屉具有正确语义。
* 颜色对比度可读。
* 支持 prefers-reduced-motion。
* 点击区域不小于 44px。
* 不依赖 Hover 才能获取关键信息。

---

## 十六、响应式要求

重点检查：

```text
1440px
1024px
768px
390px
```

要求：

* 桌面端工具网格合理使用 3～4 列。
* 平板端根据宽度调整为 2～3 列。
* 移动端单列。
* 移动端导航折叠。
* 移动端筛选使用抽屉。
* 分类标签允许横向滚动。
* 详情页双栏内容在移动端改为上下布局。
* 场景步骤在移动端改为纵向时间线。
* 移动端禁用卡片旋转。
* 不允许横向页面溢出。

---

## 十七、第一阶段不做的功能

当前版本明确不做：

* 管理后台。
* 用户注册。
* 用户登录。
* 收藏同步。
* 评论。
* 排行榜。
* 会员。
* 投稿审核。
* 多角色权限。
* 实时协作。
* 自动抓取第三方工具。
* 自动生成推荐理由。
* 复杂数据统计。

但数据结构和 Repository 边界需要允许未来接入 Supabase。

---

## 十八、实施顺序

必须按照以下顺序推进。

### Phase 0：分析与文档

* 阅读全部参考文件。
* 提取页面结构。
* 提取设计令牌。
* 建立 docs。
* 建立 AGENTS.md。
* 输出实现计划。

### Phase 1：项目骨架

* 初始化 Next.js。
* 配置 TypeScript strict。
* 配置 ESLint。
* 配置测试。
* 创建目录结构。
* 创建全局布局。

### Phase 2：数据层

* 创建类型。
* 创建 Zod Schema。
* 创建本地内容数据。
* 创建 Repository。
* 创建 Service。
* 添加数据校验测试。

### Phase 3：设计系统和公共组件

先完成：

* Header。
* Footer。
* Button。
* Tag。
* StatusBadge。
* SearchBar。
* SectionHeader。
* RecommendationCard。
* EmptyState。

在这些组件稳定前，不要同时开发所有页面。

### Phase 4：首页和推荐详情页

优先完成：

```text
/
 /recommendations/[slug]
```

这两个页面用于验证：

* 设计系统。
* 数据层。
* 卡片。
* 路由。
* 详情模型。
* 响应式。

### Phase 5：其他页面

依次完成：

```text
/categories/[slug]
/scenarios/[slug]
/search
/projects
/about
```

### Phase 6：质量检查

* lint。
* typecheck。
* unit tests。
* e2e tests。
* build。
* 响应式截图检查。
* 键盘操作检查。
* 链接检查。
* 空状态检查。
* 404 检查。

不要在 Phase 3 前并行生成所有页面。

---

## 十九、测试要求

至少实现以下测试。

### 单元测试

* Zod 数据校验。
* RecommendationRepository。
* SearchService。
* 分类筛选。
* 状态映射。
* URL 参数解析。

### 组件测试

* RecommendationCard。
* SearchBar。
* FilterBar。
* EmptyState。
* StatusBadge。

### E2E Smoke Test

至少覆盖：

1. 首页可以打开。
2. 分类入口可以进入分类页。
3. 场景入口可以进入场景页。
4. 推荐卡片可以进入详情页。
5. 外部官网链接正确。
6. 搜索可以返回结果。
7. 搜索无结果状态正确。
8. 筛选状态可以写入 URL。
9. 无效 slug 返回 404。
10. 移动端导航可以打开和关闭。

---

## 二十、质量门槛

任务完成前必须运行：

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

如果配置了 Playwright，还必须运行：

```bash
npm run test:e2e
```

所有命令必须通过。

禁止：

* 用关闭规则的方式绕过错误。
* 删除测试来通过检查。
* 使用 any 绕过类型错误。
* 只报告问题而不修复。
* 因为参考原型能够运行就认为正式项目完成。

---

## 二十一、工作方式

在开始时：

1. 检查项目目录。
2. 阅读 reference/opendesign 中的所有文件。
3. 总结设计结构和重复模式。
4. 创建 docs 和 AGENTS.md。
5. 创建分阶段任务清单。
6. 再开始编码。

开发过程中：

* 每完成一个阶段更新 ROADMAP.md。
* 重大架构决策写入 ARCHITECTURE.md。
* 数据模型变化同步到 DATA_MODEL.md。
* 不要无理由偏离参考视觉。
* 不要因为追求抽象而制造过度复杂架构。
* 优先建立清晰边界，而不是炫技。
* 发现参考原型中的交互或数据问题时，可以修正，但需要在文档中说明。

---

## 二十二、最终交付内容

最终需要交付：

1. 可运行的 Next.js 项目。
2. 完整的 docs 文档。
3. AGENTS.md。
4. 数据驱动的 7 类公开页面。
5. 可复用的组件体系。
6. 本地 Repository 实现。
7. Supabase Repository 预留说明。
8. 搜索和筛选。
9. 响应式实现。
10. 测试。
11. README。
12. 环境变量示例。
13. 构建和部署说明。

README 中必须说明：

* 如何安装。
* 如何启动。
* 如何添加新推荐。
* 如何添加分类。
* 如何添加场景。
* 如何添加项目。
* 如何运行测试。
* 如何构建。
* 后续如何迁移到 Supabase。

---

## 二十三、最终验收原则

最终实现必须满足：

1. Open Design 是视觉参考，而不是正式代码结构。
2. 页面由统一数据模型驱动。
3. 页面不直接依赖具体存储实现。
4. 相同业务组件不得重复实现。
5. 所有分类、状态和标签统一维护。
6. 搜索和筛选逻辑集中管理。
7. 网站在手机和桌面端都可正常使用。
8. 后续接入后台不需要推翻页面组件。
9. 网站体现个人判断，而不是工具数量。
10. lint、typecheck、test、build 全部通过。