# 余一的 AI 推荐清单

当前完成 Phase 0 与 Phase 1：参考分析、项目文档、Next.js 基础结构和自动检查。Phase 2 创建业务数据，Phase 3 创建共享组件，Phase 4–5 创建公开页面。

需要 Node.js 20.19+、22.13+ 或 24+。

## 本地运行

```bash
npm install
npx playwright install chromium
npm run dev
```

## 检查

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

新增推荐、分类、场景、项目及迁移 Supabase 的说明将在对应数据层完成后补充，避免文档描述尚不存在的接口。
