# 验收标准

## 基础验收

- [x] `docs` 中六份指定文档与实施计划存在且内容完整。
- [x] 根目录 `AGENTS.md` 包含所有强制工作规则。
- [x] `reference/opendesign` 全部文件已分析且没有被修改。
- [x] Next.js App Router 项目可运行，TypeScript strict 已开启。
- [x] 基础目录、全局布局、全局样式和中性根页面存在。
- [x] 没有实现具体业务路由。
- [x] ESLint、Prettier、Vitest、Testing Library、Playwright 配置存在。
- [x] `npm run lint`、`npm run typecheck`、`npm run test`、`npm run test:e2e`、`npm run build` 全部退出码为 0。

Playwright 固定使用本机系统 Chrome，不执行 Chromium 下载。

## Phase 2 数据层验收

- [x] 八类核心实体和统一枚举只有一份定义。
- [x] 六个固定分类、六个场景和 20 条代表性推荐通过 Zod 与跨实体校验。
- [x] 重复 ID/slug、无效分类/标签/场景/推荐/项目引用、自引用和重复关联会失败。
- [x] 精选顺序、发布字段、场景步骤顺序、首选与替代重叠和本地资源路径会失败。
- [x] 本地 Repository 覆盖推荐、分类、标签、场景、项目和文章。
- [x] Recommendation、Search、Filter、Scenario Service 集中管理统计、关系、搜索、筛选和步骤解析。
- [x] URL 参数解析安全处理非法值、多标签和中文编码往返。
- [x] 构建配置在页面加载前导入并校验本地内容。
- [x] 没有新增正式业务页面或 Phase 3 UI 组件。

## Phase 3 设计系统验收

- [x] 颜色、字体、字号、行高、间距、圆角、边框、阴影、焦点、动效、断点和层级由全局令牌控制。
- [x] 根布局具备 Skip Link，以及语义化 Header、Nav、Main 和 Footer。
- [x] 完成 PageContainer、Header、Footer、MobileNavigation、Breadcrumb、SectionHeader、BackToTop。
- [x] 完成 Button、Tag、Badge、Card、IconButton、ExternalLink 和六种 StatusBadge 映射。
- [x] 完成 SearchBar、FilterPill、FilterBar、EmptyState、ErrorState、LoadingSkeleton。
- [x] RecommendationCard 基于 Phase 2 类型，统一支持三种 variant、Logo 回退、标签 `+N` 和安全外链。
- [x] 移动菜单支持当前路由、Esc、点击外部关闭、焦点限制、焦点归还和背景滚动锁定。
- [x] 1440px、1024px、768px、390px 的组件预览没有页面级横向溢出。
- [x] 移动端与 reduced motion 下关闭卡片旋转，骨架屏停止非必要动画。
- [x] `/dev/components` 可供人工检查，设置 noindex，不在正式导航中。
- [x] 没有新增正式首页、分类、场景、推荐详情、搜索结果、项目或关于页面。

## Phase 4 首页与推荐详情验收

- [x] 首页所有数量、更新时间、最近更新、分类、关系、场景和项目来自 Service/Repository。
- [x] 首页复用 RecommendationCard，并通过 URL Search Params 保存分类、关系和排序状态。
- [x] 搜索框生成 `/search?q=关键词`，但未提前实现搜索结果页。
- [x] 推荐详情通过 slug 查询已发布内容，不公开 draft、archived 或 unavailable 内容。
- [x] 详情解析分类、标签、场景、同类推荐、项目和文章；无内容章节不显示。
- [x] `needs-review` 显示审核提示并隐藏统一个人使用占位。
- [x] 推荐详情实现动态 Metadata、已发布 slug 静态参数和基础结构化数据。
- [x] 无效推荐 slug 返回真正的 404，并使用 noindex Metadata。
- [x] 全局加载、错误和 404 状态复用 Phase 3 组件，不暴露内部错误。
- [x] 1440px、1024px、768px、390px 无页面级横向溢出。
- [x] 没有创建分类、场景、搜索结果、项目、关于或后台页面。

## 页面验收

完整版本需要覆盖首页、分类、场景、推荐详情、搜索、项目、关于七类公开页面。每页具备正确标题、描述、canonical、Open Graph、Twitter Card 和 robots 策略；无效 slug 返回真正的 404。

Phase 3 验收中性根页面和内部组件预览，不验收正式业务内容。

## 组件复用验收

- 同一业务概念只有一套核心组件，显示差异使用少量明确 variant。
- 首页、分类页和搜索页不各自复制 RecommendationCard。
- 页面负责组合，组件负责展示与交互，Service 负责业务规则。
- 不创建只使用一次且没有边界价值的包装组件。

## 类型与代码检查

- TypeScript `strict: true`，没有通过 `any`、忽略注释或关闭规则规避错误。
- ESLint 无错误；格式配置覆盖 TypeScript、TSX、CSS、JSON 和 Markdown。
- 构建不依赖未声明的本地环境变量或远程字体下载。

## 构建

- `npm run build` 成功生成生产构建。
- 所有静态参数和内容校验在构建时可执行。
- 未来外部客户端采用延迟初始化，模块导入不因环境变量缺失而崩溃。

## 单元测试

完整版本至少覆盖：Zod 数据校验、RecommendationRepository、SearchService、分类筛选、状态映射和 URL 参数解析。本轮至少有一项基础测试证明 Vitest 环境可运行。

## 组件测试

Phase 3 已覆盖 RecommendationCard、RecommendationLogo、SearchBar、FilterBar、EmptyState、StatusBadge、Button、Tag、Breadcrumb、移动导航、BackToTop 和外链安全属性。

## E2E 测试

完整版本至少覆盖：首页打开、分类入口、场景入口、推荐详情、外部官网、搜索结果、无结果、筛选写入 URL、无效 slug 404、移动导航开关。

Phase 3 Playwright 验证根页面和组件预览、桌面导航、移动菜单、Esc、键盘焦点、外链安全、四个目标宽度、横向溢出和 reduced motion。业务流程从 Phase 4 开始扩展。

## 响应式测试

- 重点宽度：1440px、1024px、768px、390px。
- 桌面网格 3–4 列，平板 2–3 列，移动端单列。
- 无页面级横向溢出；标签的局部横向滚动不扩张页面。
- 移动导航折叠、筛选使用抽屉、详情双栏改为上下布局、场景流程改为纵向。
- 移动端与 reduced motion 环境关闭装饰旋转。

## 键盘与无障碍

- 所有操作可用键盘完成，Tab 顺序符合视觉顺序。
- `focus-visible` 清晰；图标按钮有 `aria-label`；图片有有效 alt。
- 移动菜单与筛选抽屉提供 `aria-expanded`、Escape 关闭、焦点限制、焦点归还和背景滚动锁定。
- 点击区域至少 44×44px，颜色对比度可读，不依赖 Hover 才能获取关键信息。
- `prefers-reduced-motion` 下关闭非必要动效。

## 外部链接安全

- 外部 URL 必须有效，不允许 `#` 或提示框作为正式占位。
- 新窗口链接使用 `target="_blank"` 时同时使用 `rel="noopener noreferrer"`。
- URL 与显示域名来自校验后的数据，不拼接未经处理的后台内容。

## 状态验收

- 加载状态保持布局稳定，不造成大幅跳动。
- 错误状态提供清晰说明和可恢复操作，不暴露内部错误。
- 空状态区分“当前没有内容”和“筛选无结果”。
- 404 覆盖未知路径和无效分类、场景、推荐 slug。

## 原型问题回归清单

- [ ] 每个推荐详情均读取自己的 slug，不再全部显示 Cursor。
- [ ] 场景深链接可直接打开并在刷新后保持。
- [ ] 工具总数和分类数量完全由数据计算。
- [ ] 最近更新、最近收录和名称排序均使用真实字段。
- [ ] 地区可用性筛选使用真实数据，不对全部项目返回真。
- [ ] 分类、场景、详情、搜索统一使用正式路由。
- [ ] 文章、项目和官网链接不存在占位地址。
- [ ] 动态内容由 React 安全渲染，不直接拼入 `innerHTML`。
