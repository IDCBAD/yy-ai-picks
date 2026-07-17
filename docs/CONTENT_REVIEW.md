# 内容维护说明

## 当前状态

- 全部 23 条推荐均已完成作者复核，并以已确认状态公开展示。
- 基础定位、官网、平台、开源与自托管信息优先来自官方站点或官方仓库，最近一次内容检查为 2026-07-16。
- 推荐理由、使用方式、适合与不适合的人、优点和限制均以作者复核后的判断为准。
- 工具能力、套餐、可用地区、授权与商用规则可能变化，实际使用前仍应查看官网最新说明。

## 编辑位置

- 推荐内容：`src/content/recommendation-modules/`
- 公共日期和更新记录：`src/content/recommendation-modules/definition.ts`
- 场景中的工具组合：`src/content/scenarios.ts`
- 标签：`src/content/tags.ts`

## 当前模块

| 模块               | 工具                                                                   | 维护重点                                   |
| ------------------ | ---------------------------------------------------------------------- | ------------------------------------------ |
| `ai-assistants.ts` | ChatGPT、Codex                                                         | 常用任务与选择边界                         |
| `development.ts`   | Claude Code、Cursor、CCSwitch、Vercel、Cloudflare                      | 开发流程、发布方式与成本边界               |
| `knowledge.ts`     | Obsidian、Notion、YouMind、AIHot                                       | 信息从收集到沉淀的真实路径                 |
| `automation.ts`    | Hermes Agent、Dify、n8n、Agent-Reach                                   | 自动化权限、异常处理与自托管成本           |
| `creation.ts`      | OpenDesign、Kling、Midjourney、Remotion、PPT Master、guizang-ppt-skill | 产出质量、版权、授权、设备兼容性与交付方式 |
| `resources.ts`     | awesome-design-md、catchmeta                                           | 参考资料的用途、版权边界与复用方式         |

## 后续更新流程

1. 修改对应工具模块中的推荐理由、使用方式和边界。
2. 如工作流变化，同步调整场景中的工具关系。
3. 新增工具时补充官网、分类、标签与关联内容。
4. 运行内容检查和完整页面检查后再发布。

## 名称约定

- `OpenDesign` 指向 `open-design.ai`。
- `AIHot` 指向 `aihot.virxact.com`。
- Remotion、Dify 与 n8n 存在特定许可证或商业使用条件，描述保持谨慎并以官方当前规则为准。
