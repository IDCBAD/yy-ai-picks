# 余一的 AI 推荐清单

当前完成 Phase 0 至 Phase 6：参考分析、项目基础、数据层、设计系统、全部公开页面、搜索筛选、SEO、导航闭环与发布前质量检查。

需要 Node.js 20.19+、22.13+ 或 24+。

## 本地运行

```bash
npm ci
npm run validate:content
npm run dev
```

Playwright 固定使用本机系统 Chrome，不需要下载 Chromium。

## 公开路由

```text
/                              首页
/categories/[slug]             6 个分类页
/scenarios/[slug]              6 个场景页
/recommendations/[slug]        20 个已发布推荐详情
/search?q=关键词               搜索结果
/projects                      我的项目
/about                         关于与推荐标准
/sitemap.xml                   公开页面索引
/robots.txt                    搜索引擎规则
```

`/dev/components` 仅用于本地组件检查，设置为 `noindex, nofollow`，不会进入 sitemap 或正式导航；生产环境访问时返回 404。

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

## 首页数据来源

首页遵循 `Page → HomeService → Repository → Local Content`。发布数量、最近更新时间、分类数量、关系数量、最近更新、长期关系、筛选结果、场景和项目均由服务端计算，页面不直接导入 `src/content`。

分类、使用关系和排序通过 URL Search Params 保存，例如：

```text
/?category=ai-coding&relationship=daily-use&sort=name
```

## 推荐详情页

`/recommendations/[slug]` 通过 RecommendationService 获取已发布推荐和关联内容。构建时自动为所有已发布 slug 生成静态参数；新增并发布一条推荐后，无需手工增加路由。

检查有效与无效 slug：

```text
http://127.0.0.1:3000/recommendations/claude
http://127.0.0.1:3000/recommendations/not-a-real-tool
```

第二个地址应返回 404。动态 Metadata、canonical、Open Graph、robots 和基础结构化数据由详情页生成。

正式部署前必须设置：

```bash
NEXT_PUBLIC_SITE_URL=https://你的正式域名
```

该变量用于 canonical、Open Graph、sitemap 和 robots。缺失时仅为本地开发回退到 `http://localhost:3000`。

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

在 `src/content/scenarios.ts` 增加场景和有序步骤。步骤顺序不得重复；首选和替代工具必须存在且不能重叠；场景 slug 决定公开 URL。发布场景需要填写 `publishedAt`，工具汇总由 ScenarioService 从步骤自动去重计算。

## 添加项目

在 `src/content/projects.ts` 增加唯一 `id`、`slug`、状态、问题、核心功能和技术栈。只有真实存在的 `projectUrl` 或 `developmentLogUrl` 才能填写；缺少链接时页面不会显示占位按钮。项目页按照五种统一状态自动分组。

## 搜索规则

`/search` 在服务端调用 SearchService，覆盖推荐名称、简介、URL、分类、标签、推荐理由、关联场景和项目，以及场景、项目、文章自身内容。结果按推荐、场景、项目和文章分组；浏览器只负责把 `q` 写入 URL，不持有完整内容集，也不重新实现搜索。

## sitemap 与 robots

`src/app/sitemap.ts` 从 Service 获取可见分类、已发布场景、已发布推荐和项目更新时间，生成首页、分类、场景、推荐、项目与关于页的绝对地址。搜索页、查询参数、开发预览、错误页和未发布内容不会进入 sitemap。

`src/app/robots.ts` 允许公开页面抓取并排除 `/dev/`。搜索页使用 `noindex, follow`，开发预览使用 `noindex, nofollow`。

## 内容校验

```bash
npm run validate:content
```

`src/content/index.ts` 在导入时执行全局校验，`next.config.ts` 会在开发和构建启动前加载该入口，因此非法数据会尽早阻止构建。

数据错误会列出重复 ID、重复 slug、无效关联、精选顺序、场景步骤或图片路径等具体原因。根据错误中的实体 ID 定位对应内容文件，修正后重新运行内容校验。

## 审核 needs-review 内容

当前 20 条推荐均为 `needs-review`。页面只公开中性收录说明，并隐藏统一的个人使用占位。逐项核对推荐理由、使用方式、适用范围、优缺点、定价和检查时间，记录在 `docs/CONTENT_REVIEW.md`；完成核验后再改为 `verified`。

## 全部检查

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## 环境变量与域名

复制 `.env.example` 的字段到本地环境配置。项目不需要客户端密钥；唯一公开变量是：

```bash
NEXT_PUBLIC_SITE_URL=https://你的正式域名
```

该地址用于 canonical、Open Graph、sitemap 和 robots。Vercel 可读取生产域名变量，本地开发缺失时回退到 `http://localhost:3000`；生产或 CI 地址必须使用 HTTPS。

## Logo 与图片

产品 Logo 只保存到 `public/assets/logos`，使用小写产品 slug 命名并优先采用确认可用的 SVG。位图使用压缩后的 WebP 或 PNG。推荐数据的 `logo` 只能填写 `/assets/...` 本地路径；没有可靠资源时保留分类图标或首字母回退，不使用第三方热链。

站点 favicon 位于 `src/app/icon.svg`，Web App Manifest 位于 `src/app/manifest.ts`，社交分享图由 `src/app/opengraph-image.tsx` 本地生成。

## 内容复核流程

1. 对照产品官网核对名称、地址、平台、定价、开源和自托管状态。
2. 未得到作者确认的关系、用法、理由、优缺点和适用人群保持 `needs-review`。
3. 在 `docs/CONTENT_REVIEW.md` 记录客观检查日期与待确认项。
4. 作者确认全部主观字段后再改为 `verified`；关系徽标和首页关系区块才会公开。
5. 运行 `npm run validate:content` 和全部质量命令。

## 部署流程

1. 使用符合 `package.json` 的 Node.js 版本执行 `npm ci`。
2. 设置正式 `NEXT_PUBLIC_SITE_URL`，运行全部检查和 `npm run build`。
3. 部署生产构建，不公开 `/dev/components`。
4. 按 `docs/RELEASE_CHECKLIST.md` 检查正式域名、sitemap、robots、分享图、404 和 Windows Chrome 1080P 字体。
5. 将实际结果记录到 `docs/RELEASE_REPORT.md`。

## Windows 换行

`.gitattributes` 统一文本文件使用 LF，`.bat` 和 `.cmd` 使用 CRLF；Prettier 同样输出 LF。Windows 上不需要关闭 Git 的全局 `core.autocrlf`，仓库属性会覆盖文本文件策略。出现大量仅换行变化时，先检查 `git diff --ignore-space-at-eol`，不要格式化整个仓库。

## 发布状态

当前为 **Technically ready, content approval pending**。技术检查完成，20 条推荐的个人关系和主观评价仍需作者确认；确认前不能标记为 `Ready for release`。

## 迁移 Supabase

未来新增 Supabase Repository，并实现与本地 Repository 相同的接口和契约测试。页面与 Service 不改变，只在服务端组合入口替换 Repository 实例。
