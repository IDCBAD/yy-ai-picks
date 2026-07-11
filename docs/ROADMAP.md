# 路线图

本路线图采用 `task.md`“实施顺序”中的 Phase 编号。前文对文档内容的阶段示例被归并到相同工作中，避免出现两套互相冲突的编号。

## Phase 0：分析与文档

- [x] 阅读 `reference/opendesign` 的全部 HTML、CSS、JS 和 artifact JSON。
- [x] 记录七类页面结构、共享模式、设计令牌、交互和响应式规则。
- [x] 记录原型风险：详情固定为 Cursor、场景深链接失效、数量不一致、排序占位、无效链接、无完整弹窗行为、字体资源缺失和动态字符串拼接。
- [x] 完成 `PRD.md`、`ARCHITECTURE.md`、`DESIGN_SYSTEM.md`、`DATA_MODEL.md`、`ROADMAP.md`、`ACCEPTANCE.md`。
- [x] 完成根目录 `AGENTS.md`。
- [x] 完成 Phase 0/1 实施计划。

完成标准：文档覆盖 `task.md` 指定章节，架构与设计结论可追溯到参考文件，reference 目录没有修改。

## Phase 1：项目骨架

- [x] 初始化 Next.js App Router、TypeScript strict、Tailwind CSS 与 ESLint。
- [x] 建立 `src/app`、`components`、`content`、`lib`、`repositories`、`services`、`types` 和静态资源目录。
- [x] 创建全局布局、设计令牌和中性根页面，不开发业务页面。
- [x] 配置 Prettier、Vitest、Testing Library 和 Playwright。
- [x] 添加基础单元测试与根路由浏览器 Smoke Test。
- [x] 通过 lint、typecheck、test、test:e2e 和 build。

完成标准：项目可安装、启动、测试和构建；只有中性根页面，没有分类、场景、推荐详情、搜索、项目或关于业务页面。

## Phase 2：数据层

- [x] 创建八类领域类型及全部枚举。
- [x] 创建 Zod Schema 与跨实体关联校验。
- [x] 整理并修正本地分类、标签、推荐、场景、项目和文章数据。
- [x] 实现 Repository 接口和本地 Repository。
- [x] 实现集中式 SearchService 与筛选参数解析。
- [x] 从统一数据计算数量、精选、排序与更新时间。
- [x] 添加 Schema、Repository、搜索、分类筛选、状态映射和 URL 参数测试。
- [x] 更新 `DATA_MODEL.md` 与 `ARCHITECTURE.md`。

完成标准：非法本地数据在测试或构建时失败；页面未来只需依赖 Service/Repository，不依赖具体文件。

## Phase 3：设计系统和公共组件

- [x] 固化颜色、字体、字号、间距、圆角、边框、阴影、焦点和动效令牌。
- [x] 创建 SiteHeader、SiteFooter、MobileNavigation、Button、Tag、StatusBadge。
- [x] 创建 Breadcrumb、SearchBar、SectionHeader、RecommendationCard、EmptyState。
- [x] 创建其余清单中的公共组件，保持每种业务概念一套核心组件。
- [x] 添加组件测试、键盘操作和 reduced motion 检查。

完成标准：核心组件稳定后才进入页面开发，移动端关闭卡片旋转，无重复卡片实现。

## Phase 4：首页和推荐详情页

- [x] 实现 `/`。
- [x] 实现 `/recommendations/[slug]` 与动态 metadata。
- [x] 验证设计系统、数据层、卡片、语义路由、详情模型、响应式与真正的 404。

## Phase 5：其他页面

- [ ] 实现 `/categories/[slug]`。
- [ ] 实现 `/scenarios/[slug]`。
- [ ] 实现 `/search`。
- [ ] 实现 `/projects`。
- [ ] 实现 `/about`。
- [ ] 实现 sitemap、robots.txt 和基础结构化数据。

## Phase 6：测试和质量检查

- [ ] 完成单元、组件和十项 E2E Smoke Test。
- [ ] 在 1440px、1024px、768px、390px 检查布局与截图。
- [ ] 检查键盘、焦点、语义、对比度、链接安全和 reduced motion。
- [ ] 检查加载、错误、空状态和 404。
- [ ] 通过 lint、typecheck、test、test:e2e 和 build。

## Future：Supabase 与后台

- [ ] 设计 Supabase 表、索引、约束和迁移。
- [ ] 实现 Supabase Repository 并通过与本地实现相同的契约测试。
- [ ] 在服务端组合根切换数据源，不改变页面接口。
- [ ] 按实际需求再评估后台、身份验证、内容编辑和发布流程。

## 本轮边界

Phase 0 至 Phase 4 已完成。Phase 5 及以后任务保持待办；当前正式业务页面只有首页和推荐详情，分类、场景、搜索、项目和关于页面尚未开发。
