# 验收标准

## 本轮验收

- [x] `docs` 中六份指定文档与实施计划存在且内容完整。
- [x] 根目录 `AGENTS.md` 包含所有强制工作规则。
- [x] `reference/opendesign` 全部文件已分析且没有被修改。
- [x] Next.js App Router 项目可运行，TypeScript strict 已开启。
- [x] 基础目录、全局布局、全局样式和中性根页面存在。
- [x] 没有实现具体业务路由、业务数据或业务组件。
- [x] ESLint、Prettier、Vitest、Testing Library、Playwright 配置存在。
- [x] `npm run lint`、`npm run typecheck`、`npm run test`、`npm run test:e2e`、`npm run build` 全部退出码为 0。

Playwright 优先使用其管理的 Chromium；新环境在首次执行 E2E 前需要运行 `npx playwright install chromium`，本地未安装时可回退到系统 Chrome。

## 页面验收

完整版本需要覆盖首页、分类、场景、推荐详情、搜索、项目、关于七类公开页面。每页具备正确标题、描述、canonical、Open Graph、Twitter Card 和 robots 策略；无效 slug 返回真正的 404。

本轮只验收中性根页面能打开，不验收业务内容。

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

完整版本至少覆盖 RecommendationCard、SearchBar、FilterBar、EmptyState、StatusBadge，并检查可见内容、交互、键盘行为和可访问名称。本轮未创建业务组件，不提前编写这些测试。

## E2E 测试

完整版本至少覆盖：首页打开、分类入口、场景入口、推荐详情、外部官网、搜索结果、无结果、筛选写入 URL、无效 slug 404、移动导航开关。

本轮 Playwright 只验证根页面可以由真实浏览器打开，后续逐阶段扩展，不用占位测试冒充业务覆盖。

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
