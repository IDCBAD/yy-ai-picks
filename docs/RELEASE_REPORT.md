# Phase 6 发布报告

检查日期：2026-07-12

## 发布结论

**Technically ready, content approval pending**

站点功能、部署配置和质量检查已按 Phase 6 范围完成。20 条推荐的个人使用关系和评价仍未得到作者确认，因此不能标记为 `Ready for release`。

## 内容复核

- 已复核：20 条推荐的名称、官网、分类、标签、定价类型、平台、开源和自托管状态。
- 已复核：6 个场景的数据完整性、步骤顺序、工具解析和去重。
- 已复核：4 个项目和 4 条官方资料的展示规则与链接占位风险。
- 已修正：ChatGPT、Claude Code、LangGraph、Notion、Midjourney、Figma 和 Obsidian Help 地址。
- 已修正：ChatGPT、Claude、Claude Code、LangGraph、Obsidian、Notion 的平台或标签。
- 已修正：n8n 改为非开源，移除开源标签；保留其可自托管属性。
- 已更新：全部推荐的客观检查日期为 2026-07-12。
- 待作者确认：20 条推荐关系、个人理由、实际用法、优缺点和适用人群。
- 待作者确认：6 个场景的主要工具、可选路径和实际顺序；4 个项目的真实性、状态与描述。

公开页面只显示中性收录说明；未确认的关系徽标、首页关系筛选和长期使用区块已隐藏。场景使用“主要工具”“可选路径”，并保留复核提示。

## 1080P 字体清晰度

问题来源主要是含文字卡片及控件使用整体旋转、位移或缩放，Windows Chrome 在低像素密度屏幕上会把文字放入合成图层重新栅格化。透明混合背景和 `backdrop-filter` 也会加重观感差异。

已移除 RecommendationCard、内容卡片、搜索框、筛选标签和基础控件文字父容器上的 transform；手工旋转转移到不含文字的伪元素。Header 改为不透明背景，移除 blur；全局不再强制 `-webkit-font-smoothing` 和 `text-rendering: optimizeLegibility`。低像素密度媒体查询关闭剩余装饰旋转。

自动布局检查覆盖 1920×1080 和 390px；人工截图覆盖 1920×1080、2560×1440、3840×2160、1440、1024、768、390。字体清晰度仍会受到 Windows 系统缩放、ClearType 和显示器面板影响，部署后需在目标设备复查。

## Logo 与静态资源

- 新增本地 favicon 和 Web App Manifest。
- 推荐 Logo 保留固定尺寸容器、首字母和分类图标回退。
- 装饰 Logo 默认使用空 alt，加载失败不会改变布局。
- 没有从第三方 Logo 聚合站批量抓取资源；未确认授权的产品继续使用回退方案。

## SEO 与生产配置

- `.env.example` 提供 `NEXT_PUBLIC_SITE_URL`，Vercel 可使用生产域名变量回退。
- 页面 Metadata 包含 canonical、Open Graph、Twitter Card 和本地生成的 1200×630 分享图。
- sitemap、robots、搜索页 noindex、开发预览 noindex、404 和全局错误页已检查。
- `/dev/components` 在生产环境直接返回 404。
- 生产或 CI 中的站点地址必须使用 HTTPS；本地开发仍可回退到 localhost。

## 性能、无障碍与安全

- 页面主体继续由服务端渲染或静态生成，完整推荐数据不发送到搜索客户端。
- 客户端组件仅保留导航、输入、筛选、Logo 回退和滚动交互。
- 搜索输入改为受控值，浏览器前进后退可恢复 URL 中的关键词。
- 修正装饰 Logo 和非交互标签的辅助技术语义，保留明确焦点和新窗口提示。
- 新增根级错误页，不显示错误对象、堆栈或内部信息。
- 未发现来源不明脚本、任意远程图片配置、敏感日志或未转义 HTML。
- 全站响应增加来源策略、MIME 嗅探保护、iframe 限制和设备权限限制。

## Windows 换行

- `.gitattributes` 统一文本文件使用 LF，批处理文件保留 CRLF。
- Prettier 明确使用 LF；现有文件已按 Git 属性重新归一化。
- 未对 `reference/` 做内容修改，也未保留仅由换行造成的大面积变化。

## 测试结果

- `npm run format:check`：通过。
- `npm run lint`：通过，0 warning。
- `npm run typecheck`：通过。
- `npm run test`：21 个测试文件、129 项单元/组件测试全部通过。
- `npm run test:e2e`：系统 Chrome 中 40 项全部通过。
- `npm run build`：通过，43 个静态页面生成成功。
- 生产服务复查：首页、分享图和 manifest 返回 200；`/dev/components` 返回真实 404；安全响应头生效。

## 已知风险

1. 个人内容审核尚未完成，这是当前唯一发布审批阻碍。
2. 产品定价、平台和授权条款会变化，应在每次发布前重新核对官网。
3. 产品官方 Logo 尚未逐一完成授权确认，当前回退图标不影响功能。
4. 字体观感受 Windows 系统缩放和 ClearType 影响，自动截图不能替代真实设备观察。
