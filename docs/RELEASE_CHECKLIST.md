# 发布检查清单

## 内容

- [ ] 逐条确认 20 条推荐的个人使用关系、理由、优点、限制和适用人群。
- [ ] 确认 6 个场景的主要工具、可选路径和步骤顺序。
- [ ] 确认项目名称、状态、说明以及可公开链接。
- [ ] 所有已发布内容均有最近检查日期，不含绝对化表述或占位链接。
- [ ] `docs/CONTENT_REVIEW.md` 与公开数据状态一致。

## 环境与构建

- [ ] Node.js 版本满足 `package.json` 的 `engines`。
- [ ] 根据 `.env.example` 设置 `NEXT_PUBLIC_SITE_URL=https://正式域名`。
- [ ] 生产环境生成的 canonical、sitemap 和 robots 不含 localhost。
- [ ] `npm ci`、`npm run build` 和生产启动成功。

## 自动检查

- [ ] `npm run format:check`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run test:e2e`，使用系统 Chrome，不下载 Chromium。

## 页面与搜索引擎

- [ ] 首页、分类、场景、推荐详情、搜索、项目、关于和 404 可访问。
- [ ] 每页 title、description、canonical、Open Graph 和 Twitter Card 正确。
- [ ] favicon、manifest 和社交分享图可访问。
- [ ] sitemap 只包含 35 个正式公开地址，且全部返回 200。
- [ ] robots 排除 `/dev/`；搜索页和开发预览页不进入索引。
- [ ] 无效分类、场景和推荐 slug 返回 404。

## 链接与资源

- [ ] Header、Footer、面包屑、卡片和关联入口形成完整导航。
- [ ] 不存在空链接、`.html`、`javascript:void(0)` 或示例域名。
- [ ] 外链使用新窗口、安全属性，并告知用户会打开新窗口。
- [ ] Logo 使用本地资源；没有已确认资源时使用稳定回退，不使用第三方热链。
- [ ] 图片尺寸固定，加载失败不引发布局跳动。

## 视觉与无障碍

- [ ] 在 1920×1080、2560×1440、3840×2160、1440、1024、768、390 宽度检查重点页面。
- [ ] 1080P 下正文、标题和 Hover 状态清晰，无文字父容器旋转或缩放。
- [ ] 无页面级横向滚动，移动端布局、标签换行和菜单正常。
- [ ] 每页一个主 `h1`；Skip Link、焦点、键盘、Escape、reduced motion 正常。
- [ ] 图片替代文本、按钮名称、标题层级、点击区域和颜色对比度合格。

## 安全与部署后检查

- [ ] 未提交密钥；`.env*` 忽略规则正确，仅提交 `.env.example`。
- [ ] 页面不渲染未经处理的 HTML，不输出堆栈或敏感日志。
- [ ] 没有任意远程图片域名、第三方脚本或生产调试页面。
- [ ] 部署后重新检查首页、搜索、404、sitemap、robots、分享图和正式域名。
- [ ] 部署后在 Windows Chrome 100% 浏览器缩放下复查 1080P 字体。
