# 项目协作规则

## 开始任务前

1. 阅读 `task.md` 以及 `docs/PRD.md`、`docs/ARCHITECTURE.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATA_MODEL.md`、`docs/ROADMAP.md`、`docs/ACCEPTANCE.md`。
2. 检查当前阶段和任务范围，不提前开发后续阶段。
3. 检查工作区现有改动并保留不属于当前任务的内容。

## 强制约束

- 禁止修改 `reference/` 目录；它只用于视觉、布局、交互和内容结构参考。
- 禁止在页面组件中写死完整业务数据；页面只能依赖 Service 或 Repository 接口。
- 禁止复制已有组件；同一业务概念只保留一套核心组件。
- 禁止无理由增加依赖；优先使用项目现有能力和浏览器标准能力。
- 禁止使用 `any`、忽略注释或关闭规则规避类型和代码检查。
- 页面默认使用 Server Components，仅在需要浏览器交互时使用 `"use client"`，并尽量放在组件树叶子位置。
- 搜索和筛选的可分享状态优先同步到 URL Search Params。
- 不进行与当前任务无关的大面积重构。
- 保持修改范围清晰，不覆盖或撤销他人已有改动。

## 文档同步

- 修改架构、目录边界、路由策略、数据访问方式或主要依赖时，同步更新 `docs/ARCHITECTURE.md`。
- 修改实体字段、枚举、关联或校验约束时，同步更新 `docs/DATA_MODEL.md`。
- 完成一个阶段时，同步更新 `docs/ROADMAP.md`。
- 修改设计令牌、响应式规则或共享视觉行为时，同步更新 `docs/DESIGN_SYSTEM.md`。
- 改变验收范围或测试覆盖时，同步更新 `docs/ACCEPTANCE.md`。

## 质量要求

完成任务后必须运行：

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

配置 Playwright 后还必须运行：

```bash
npm run test:e2e
```

出现失败时必须修复并重新运行，不得只记录失败，不得删除有效测试或关闭规则来通过检查。

## 设计与内容

- 延续 Open Design 的暖白纸张、黑色粗描边、黄色强调和硬阴影视觉，不改成通用 SaaS 模板。
- 颜色、间距、圆角、边框、阴影和字体使用统一令牌，不在页面散落重复值。
- 移动端关闭装饰旋转，支持 reduced motion，不依赖 Hover 展示关键信息。
- 工具数量、分类数量、状态、更新时间和排序结果必须从统一数据计算，禁止写死统计值。
- 外部链接必须有效且安全，不保留 `#`、提示框或空地址作为正式功能。

## 阶段边界

- Phase 0：参考分析与文档。
- Phase 1：Next.js 项目骨架、全局布局和质量工具。
- Phase 2：领域类型、Zod Schema、本地数据、Repository、Service 和数据测试。
- Phase 3：设计系统和公共组件。
- Phase 4–6：页面、完整交互与全面验收。

当前任务若明确限制阶段，禁止创建后续阶段的业务页面、数据或组件。
