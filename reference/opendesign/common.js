/* ═══════════════════════════════════════════════════════
   余一的推荐清单 — 共享交互脚本
   ═══════════════════════════════════════════════════════ */

// ─────────────── Shared Data ───────────────
const SITE_DATA = {
  categories: [
    { id: 'ai-assistant', name: 'AI 助手与模型', desc: '对话模型、搜索助手、本地模型与多模型客户端。', icon: 'assistant', count: 6 },
    { id: 'ai-coding', name: 'AI 编程与开发', desc: '从需求到代码、调试、部署和维护的 AI 开发工具。', icon: 'coding', count: 8 },
    { id: 'agent-automation', name: 'Agent 与自动化', desc: 'Agent 框架、工作流平台、浏览器自动化和企业自动化工具。', icon: 'agent', count: 8 },
    { id: 'knowledge', name: '知识与信息管理', desc: '信息获取、收藏、阅读、知识库与个人 Wiki 工具。', icon: 'knowledge', count: 7 },
    { id: 'content-creation', name: '内容与视觉创作', desc: '图像、视频、音频、写作、设计和内容生产工具。', icon: 'creation', count: 8 },
    { id: 'indie', name: '独立产品与灵感', desc: '值得关注的独立产品、开源项目和个人网站。', icon: 'indie', count: 5 }
  ],

  scenarios: [
    { id: 'ai-website', title: '用 AI 做一个网站', desc: '从需求、UI、编码到部署的一套工具组合。', icon: 'website' },
    { id: 'build-agent', title: '搭建一个 Agent', desc: 'Agent 框架、模型、搜索、工具调用与观测。', icon: 'agent' },
    { id: 'knowledge-base', title: '建立个人知识库', desc: '信息收集、阅读、整理、检索与长期沉淀。', icon: 'knowledge' },
    { id: 'automation', title: '自动化重复工作', desc: 'RPA、工作流平台、浏览器自动化与系统集成。', icon: 'automation' },
    { id: 'media-production', title: '生产图片和视频', desc: '图像生成、视频生成、设计与内容生产工具。', icon: 'media' },
    { id: 'indie-inspiration', title: '寻找独立产品灵感', desc: '个人网站、小工具、开源项目与优秀产品案例。', icon: 'indie' }
  ],

  tools: [
    { name: 'ChatGPT', url: 'chat.openai.com', cat: 'ai-assistant', desc: '通用 AI 对话助手，覆盖写作、编程、分析。', status: '长期使用', tags: ['#对话', '#通用', '#付费'], pricing: '免费 + 付费', platform: 'Web / iOS / Android', openSource: false },
    { name: 'Claude', url: 'claude.ai', cat: 'ai-assistant', desc: '擅长长文本理解和代码生成的 AI 助手。', status: '每天使用', tags: ['#对话', '#长文本', '#代码'], pricing: '免费 + 付费', platform: 'Web / iOS / Android', openSource: false },
    { name: 'Perplexity', url: 'perplexity.ai', cat: 'ai-assistant', desc: 'AI 驱动的搜索引擎，带引用来源。', status: '长期使用', tags: ['#搜索', '#引用'], pricing: '免费 + 付费', platform: 'Web / iOS / Android', openSource: false },
    { name: 'NotebookLM', url: 'notebooklm.google.com', cat: 'ai-assistant', desc: 'Google 的 AI 笔记工具，支持文档对话。', status: '正在体验', tags: ['#笔记', '#文档对话'], pricing: '免费', platform: 'Web', openSource: false },
    { name: 'Ollama', url: 'ollama.com', cat: 'ai-assistant', desc: '本地运行大语言模型，一行命令搞定。', status: '长期使用', tags: ['#本地', '#开源', '#CLI'], pricing: '免费 / 开源', platform: 'macOS / Linux / Windows', openSource: true },
    { name: 'Cherry Studio', url: 'cherry-ai.com', cat: 'ai-assistant', desc: '桌面端多模型 AI 聊天客户端。', status: '持续关注', tags: ['#多模型', '#桌面端', '#开源'], pricing: '免费 / 开源', platform: 'macOS / Windows / Linux', openSource: true },
    { name: 'Codex', url: 'openai.com/codex', cat: 'ai-coding', desc: 'OpenAI 的 CLI 编程 Agent，支持多文件修改。', status: '项目用过', tags: ['#CLI', '#Agent', '#代码生成'], pricing: '付费', platform: 'CLI', openSource: false },
    { name: 'Claude Code', url: 'claude.ai/code', cat: 'ai-coding', desc: 'Anthropic 的终端 Agent，理解全项目上下文。', status: '每天使用', tags: ['#CLI', '#Agent', '#多文件'], pricing: '付费', platform: 'CLI', openSource: false },
    { name: 'Cursor', url: 'cursor.com', cat: 'ai-coding', desc: '基于代码库上下文进行编辑和生成的 AI 代码编辑器。', status: '项目用过', tags: ['#AI-IDE', '#代码生成', '#付费'], pricing: '免费 + 付费', platform: 'macOS / Windows / Linux', openSource: false },
    { name: 'GitHub Copilot', url: 'github.com/features/copilot', cat: 'ai-coding', desc: 'AI 代码补全，集成在 IDE 中的编程助手。', status: '长期使用', tags: ['#补全', '#IDE插件', '#付费'], pricing: '免费 + 付费', platform: 'VS Code / JetBrains', openSource: false },
    { name: 'v0', url: 'v0.dev', cat: 'ai-coding', desc: 'Vercel 的 AI UI 生成工具，描述即出组件。', status: '正在体验', tags: ['#UI生成', '#React', '#免费'], pricing: '免费 + 付费', platform: 'Web', openSource: false },
    { name: 'Supabase', url: 'supabase.com', cat: 'ai-coding', desc: '开源 Firebase 替代品，Postgres + Auth + 实时。', status: '长期使用', tags: ['#后端', '#数据库', '#开源'], pricing: '免费 + 付费', platform: 'Web / 自托管', openSource: true },
    { name: 'Vercel', url: 'vercel.com', cat: 'ai-coding', desc: '前端部署平台，零配置自动 CI/CD。', status: '每天使用', tags: ['#部署', '#CI/CD', '#免费层'], pricing: '免费 + 付费', platform: 'Web', openSource: false },
    { name: 'Shadcn/ui', url: 'ui.shadcn.com', cat: 'ai-coding', desc: '可复制粘贴的 React 组件，设计精美。', status: '长期使用', tags: ['#组件库', '#React', '#开源'], pricing: '免费 / 开源', platform: 'React', openSource: true },
    { name: 'LangGraph', url: 'langchain.com/langgraph', cat: 'agent-automation', desc: '基于图的 Agent 编排框架，支持状态管理和循环。', status: '项目用过', tags: ['#Agent', '#图编排', '#开源'], pricing: '免费 / 开源', platform: 'Python / JS', openSource: true },
    { name: 'Dify', url: 'dify.ai', cat: 'agent-automation', desc: '开源 LLMOps 平台，可视化搭建 AI 应用。', status: '长期使用', tags: ['#LLMOps', '#可视化', '#自托管'], pricing: '免费 + 付费', platform: 'Web / 自托管', openSource: true },
    { name: 'n8n', url: 'n8n.io', cat: 'agent-automation', desc: '开源工作流自动化平台，节点丰富可自托管。', status: '每天使用', tags: ['#自动化', '#工作流', '#开源'], pricing: '免费 + 付费', platform: 'Web / 自托管', openSource: true },
    { name: 'LangChain', url: 'langchain.com', cat: 'agent-automation', desc: 'LLM 应用开发框架，工具链和组件丰富。', status: '项目用过', tags: ['#框架', '#LLM', '#开源'], pricing: '免费 / 开源', platform: 'Python / JS', openSource: true },
    { name: 'AutoGen', url: 'microsoft.github.io/autogen', cat: 'agent-automation', desc: '微软的多 Agent 对话框架，支持角色协作。', status: '正在体验', tags: ['#多Agent', '#微软', '#开源'], pricing: '免费 / 开源', platform: 'Python', openSource: true },
    { name: 'AgentScope', url: 'agentscope.io', cat: 'agent-automation', desc: '阿里达摩院的 Agent 框架，支持分布式多 Agent。', status: '持续关注', tags: ['#多Agent', '#分布式', '#开源'], pricing: '免费 / 开源', platform: 'Python', openSource: true },
    { name: 'Tavily', url: 'tavily.com', cat: 'agent-automation', desc: '为 AI Agent 设计的搜索 API，结果质量高。', status: '项目用过', tags: ['#搜索API', '#Agent', '#免费层'], pricing: '免费 + 付费', platform: 'API', openSource: false },
    { name: 'Browser Use', url: 'browser-use.com', cat: 'agent-automation', desc: '浏览器自动化 Agent，网页操作和表单填写。', status: '正在体验', tags: ['#浏览器', '#自动化', '#开源'], pricing: '免费 / 开源', platform: 'Python', openSource: true },
    { name: 'Obsidian', url: 'obsidian.md', cat: 'knowledge', desc: '本地 Markdown 笔记，双链和插件生态强大。', status: '每天使用', tags: ['#笔记', '#双链', '#本地'], pricing: '免费 + 付费', platform: 'macOS / Windows / Linux', openSource: false },
    { name: 'Notion', url: 'notion.so', cat: 'knowledge', desc: '一体化笔记和知识管理工具，协作友好。', status: '长期使用', tags: ['#协作', '#数据库', '#多平台'], pricing: '免费 + 付费', platform: 'Web / macOS / iOS / Android', openSource: false },
    { name: 'Readwise', url: 'readwise.io', cat: 'knowledge', desc: '高亮收集和间隔复习，串联所有阅读来源。', status: '长期使用', tags: ['#高亮', '#复习', '#集成'], pricing: '付费', platform: 'Web / iOS / Android', openSource: false },
    { name: 'RSSHub', url: 'rsshub.app', cat: 'knowledge', desc: '开源 RSS 生成器，万物皆可订阅。', status: '每天使用', tags: ['#RSS', '#开源', '#自托管'], pricing: '免费 / 开源', platform: 'Web / 自托管', openSource: true },
    { name: 'Tana', url: 'tana.io', cat: 'knowledge', desc: '超节点笔记，组合性极强的知识工具。', status: '正在体验', tags: ['#超节点', '#结构化'], pricing: '免费 + 付费', platform: 'Web / macOS / iOS', openSource: false },
    { name: 'Zotero', url: 'zotero.org', cat: 'knowledge', desc: '学术文献管理，引用和笔记一体化。', status: '项目用过', tags: ['#文献', '#引用', '#开源'], pricing: '免费 / 开源', platform: 'macOS / Windows / Linux', openSource: true },
    { name: 'Midjourney', url: 'midjourney.com', cat: 'content-creation', desc: '最强的 AI 图像生成工具，艺术质感行业标杆。', status: '长期使用', tags: ['#图像生成', '#艺术', '#付费'], pricing: '付费', platform: 'Web / Discord', openSource: false },
    { name: 'GPT Image', url: 'openai.com/dall-e', cat: 'content-creation', desc: 'OpenAI 的图像生成，文字渲染和指令遵循强。', status: '长期使用', tags: ['#图像生成', '#文字渲染'], pricing: '付费', platform: 'Web / API', openSource: false },
    { name: 'Ideogram', url: 'ideogram.ai', cat: 'content-creation', desc: 'AI 图像生成，文字渲染能力最强。', status: '正在体验', tags: ['#图像生成', '#文字', '#免费层'], pricing: '免费 + 付费', platform: 'Web', openSource: false },
    { name: 'Kling', url: 'klingai.com', cat: 'content-creation', desc: '可灵 AI 视频生成，国产视频大模型。', status: '正在体验', tags: ['#视频生成', '#国产'], pricing: '免费 + 付费', platform: 'Web', openSource: false },
    { name: 'Runway', url: 'runwayml.com', cat: 'content-creation', desc: 'AI 视频生成和编辑工具，支持文生视频。', status: '持续关注', tags: ['#视频生成', '#编辑', '#付费'], pricing: '免费 + 付费', platform: 'Web', openSource: false },
    { name: 'Figma', url: 'figma.com', cat: 'content-creation', desc: '协作式 UI 设计工具，行业标准。', status: '每天使用', tags: ['#UI设计', '#协作', '#免费层'], pricing: '免费 + 付费', platform: 'Web / macOS / Windows', openSource: false },
    { name: 'Excalidraw', url: 'excalidraw.com', cat: 'content-creation', desc: '手绘风格在线白板，画架构图和流程图。', status: '长期使用', tags: ['#白板', '#手绘', '#开源'], pricing: '免费 / 开源', platform: 'Web', openSource: true },
    { name: 'Remotion', url: 'remotion.dev', cat: 'content-creation', desc: '用 React 编程生成视频，代码即视频。', status: '持续关注', tags: ['#视频', '#React', '#开源'], pricing: '免费 + 付费', platform: 'Node.js', openSource: true },
    { name: '小工具站', url: '—', cat: 'indie', desc: '值得关注的独立小工具和产品案例。', status: '持续关注', tags: ['#独立产品', '#小工具'], pricing: '—', platform: 'Web', openSource: false },
    { name: '优秀个人博客', url: '—', cat: 'indie', desc: '设计和开发者社区中的优秀个人博客。', status: '持续关注', tags: ['#博客', '#个人'], pricing: '—', platform: 'Web', openSource: false },
    { name: '开源项目', url: '—', cat: 'indie', desc: '值得关注的开源项目和技术实践。', status: '持续关注', tags: ['#开源', '#项目'], pricing: '免费 / 开源', platform: 'GitHub', openSource: true },
    { name: '个人开发者产品', url: '—', cat: 'indie', desc: '独立开发者构建的微型 SaaS 和工具。', status: '持续关注', tags: ['#独立开发', '#SaaS'], pricing: '—', platform: 'Web', openSource: false },
    { name: '创意交互网站', url: '—', cat: 'indie', desc: '富有创意的交互实验和设计探索。', status: '持续关注', tags: ['#创意', '#交互'], pricing: '—', platform: 'Web', openSource: false }
  ],

  projects: [
    { name: '个人博客', status: '已上线', desc: '记录技术探索、项目开发和思考的个人空间。', stack: ['Next.js', 'MDX', 'Vercel'], url: '#', log: '#' },
    { name: 'Agent 会话分析工具', status: '持续迭代', desc: '可视化分析 Agent 对话流程，调试工具调用和推理链。', stack: ['React', 'LangGraph', 'D3.js'], url: '#', log: '#' },
    { name: '推荐清单', status: '已上线', desc: '这个网站本身——我的个人工具与资源推荐平台。', stack: ['HTML', 'CSS', 'Vanilla JS'], url: '#', log: '#' },
    { name: '自动化工作流模板库', status: '原型阶段', desc: '可复用的 n8n 和 Dify 工作流模板集合。', stack: ['n8n', 'Dify'], url: '#', log: '#' }
  ]
};

// ─────────────── Category Icons (SVG) ───────────────
const CAT_ICONS = {
  assistant: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="13" rx="2"/><circle cx="9" cy="11" r="1.2"/><circle cx="15" cy="11" r="1.2"/><path d="M9 15h6"/><path d="M12 3v3"/><circle cx="12" cy="3" r="1"/></svg>',
  coding: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 6 2 12 8 18"/><polyline points="16 6 22 12 16 18"/></svg>',
  agent: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/><path d="M12 12v3"/><circle cx="8" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></svg>',
  knowledge: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  creation: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/></svg>',
  indie: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  website: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><circle cx="6" cy="6.5" r="0.5" fill="currentColor"/><circle cx="8" cy="6.5" r="0.5" fill="currentColor"/></svg>',
  automation: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
  media: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M13 9l4 6"/><path d="M17 9l-4 6"/></svg>'
};

function getCatIcon(iconKey) {
  return CAT_ICONS[iconKey] || CAT_ICONS.assistant;
}

// ─────────────── Status Colors ───────────────
const STATUS_STYLES = {
  '每天使用': 'accent',
  '长期使用': 'dark',
  '项目用过': '',
  '正在体验': '',
  '持续关注': '',
  '我的项目': 'accent'
};

function getStatusClass(status) {
  return STATUS_STYLES[status] || '';
}

// ─────────────── Render Top Nav ───────────────
function renderNav(activePage) {
  const links = [
    { href: 'index.html', label: '首页', key: 'home' },
    { href: 'category.html', label: '分类', key: 'category' },
    { href: 'scenario.html', label: '场景清单', key: 'scenario' },
    { href: 'projects.html', label: '我的项目', key: 'projects' },
    { href: 'about.html', label: '关于', key: 'about' }
  ];
  return `
    <nav class="topnav" data-od-id="topnav">
      <div class="container topnav-inner">
        <a href="index.html" class="topnav-logo" data-od-id="brand-logo" aria-label="返回首页">
          <span class="topnav-logo-dot"></span>
          余一的推荐清单
        </a>
        <div class="topnav-links" id="topnav-links">
          ${links.map(l => `<a href="${l.href}" class="${activePage === l.key ? 'active' : ''}">${l.label}</a>`).join('')}
          <button class="topnav-cta" onclick="window.location.href='search.html'" aria-label="搜索">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            搜索
          </button>
        </div>
        <button class="topnav-menu-btn" aria-label="打开菜单" aria-expanded="false" id="menu-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </nav>`;
}

// ─────────────── Render Footer ───────────────
function renderFooter() {
  return `
    <footer class="footer" id="footer" data-od-id="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand-block">
            <div class="footer-brand">
              <span class="topnav-logo-dot"></span>
              余一的推荐清单
            </div>
            <p class="footer-tagline">收录我在 AI 编程、Agent 开发、自动化、知识管理和内容创作中，真正使用过、认真体验过或持续关注的工具与项目。</p>
          </div>
          <div class="footer-col">
            <h4>浏览</h4>
            <ul>
              <li><a href="index.html">首页</a></li>
              <li><a href="category.html">分类浏览</a></li>
              <li><a href="scenario.html">场景清单</a></li>
              <li><a href="search.html">搜索</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>个人</h4>
            <ul>
              <li><a href="projects.html">我的项目</a></li>
              <li><a href="#">个人博客</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="about.html">关于推荐标准</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>分类</h4>
            <ul>
              <li><a href="category.html?cat=ai-assistant">AI 助手与模型</a></li>
              <li><a href="category.html?cat=ai-coding">AI 编程与开发</a></li>
              <li><a href="category.html?cat=agent-automation">Agent 与自动化</a></li>
              <li><a href="category.html?cat=knowledge">知识与信息管理</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-copy">© 2026 余一的推荐清单 · 最后更新 2026-07-10</div>
          <p class="footer-note">所有推荐都带有个人判断，不代表绝对排名。</p>
        </div>
      </div>
    </footer>`;
}

// ─────────────── Render Back to Top ───────────────
function renderBackToTop() {
  return `<button class="back-to-top" id="back-to-top" aria-label="返回顶部">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
  </button>`;
}

// ─────────────── Init Shared Interactions ───────────────
function initShared() {
  // Mobile menu toggle
  const menuBtn = document.getElementById('menu-btn');
  const topnavLinks = document.getElementById('topnav-links');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      topnavLinks.classList.toggle('mobile-open');
    });
  }

  // Back to top
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }, { passive: true });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShared);
} else {
  initShared();
}
