import { expect, test } from "@playwright/test";

const categories = [
  ["ai-assistant", "AI 助手与模型"],
  ["ai-coding", "AI 编程与开发"],
  ["agent-automation", "Agent 与自动化"],
  ["knowledge", "知识与信息管理"],
  ["content-creation", "内容与视觉创作"],
  ["indie", "独立产品与灵感"],
] as const;

const scenarios = [
  ["ai-website", "用 AI 做一个网站"],
  ["build-agent", "搭建一个 Agent"],
  ["knowledge-base", "建立个人知识库"],
  ["automation", "自动化重复工作"],
  ["media-production", "生产图片、视频与演示"],
  ["indie-inspiration", "寻找独立产品灵感"],
] as const;

test.describe("Phase 5 public pages", () => {
  test("opens all six category pages", async ({ page }) => {
    for (const [slug, title] of categories) {
      const response = await page.goto(`/categories/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
    }
  });

  test("opens all six scenario pages", async ({ page }) => {
    for (const [slug, title] of scenarios) {
      const response = await page.goto(`/scenarios/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
    }
  });

  test("renders different content for different category and scenario slugs", async ({ page }) => {
    await page.goto("/categories/ai-coding");
    await expect(page.getByRole("heading", { name: "AI 编程与开发", level: 1 })).toBeVisible();
    await page.goto("/categories/knowledge");
    await expect(page.getByRole("heading", { name: "知识与信息管理", level: 1 })).toBeVisible();

    await page.goto("/scenarios/ai-website");
    await expect(page.getByRole("heading", { name: "梳理需求", level: 3 })).toBeVisible();
    await page.goto("/scenarios/media-production");
    await expect(page.getByRole("heading", { name: "探索视觉与动态画面", level: 3 })).toBeVisible();
  });

  test("returns real 404 responses for invalid dynamic slugs", async ({ page }) => {
    for (const path of ["/categories/not-real", "/scenarios/not-real"]) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { name: "没有找到这个页面" })).toBeVisible();
    }
  });

  test("writes category filters to the URL and restores them after refresh", async ({ page }) => {
    await page.goto("/categories/ai-coding");
    const filters = page.getByRole("group", { name: "标签" });
    const firstTag = filters.getByRole("button").first();
    await firstTag.click();

    await expect(page).toHaveURL(/tags=/);
    await page.reload();
    await expect(filters.getByRole("button").first()).toHaveAttribute("aria-pressed", "true");
  });

  test("returns grouped search results", async ({ page }) => {
    await page.goto("/search?q=Claude");

    await expect(page.getByText(/“Claude”的搜索结果/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "推荐", level: 2 })).toBeVisible();
    await expect(page.locator('a[href="/recommendations/claude-code"]').first()).toBeVisible();
  });

  test("shows the search no-results state", async ({ page }) => {
    await page.goto("/search?q=definitely-no-result-99731");

    await expect(page.getByRole("heading", { name: "没有找到相关内容" })).toBeVisible();
    await expect(page.getByRole("link", { name: "清空搜索" })).toBeVisible();
  });

  test("opens projects and about pages", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "我的项目", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "已上线", level: 2 })).toBeVisible();
    const yemaiCard = page.locator("article").filter({
      has: page.getByRole("heading", { name: "页脉 · AI 阅读助手" }),
    });
    await expect(yemaiCard.locator('img[src*="project-yemai.png"]')).toBeVisible();
    await expect(
      yemaiCard.getByRole("link", { name: /打开项目：页脉 · AI 阅读助手/ }),
    ).toHaveAttribute("href", "https://github.com/IDCBAD/yemai-reading-assistant");
    await expect(
      page.getByRole("link", { name: /打开项目：余一的 AI 观察备忘录/ }),
    ).toHaveAttribute("href", "https://blog.yuyi-ai.top/");

    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "关于这份清单", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "免责声明", level: 2 })).toBeVisible();
  });

  test("keeps home and navigation destinations inside implemented routes", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href^="/categories/"]').first()).toBeVisible();
    await expect(page.locator('a[href^="/scenarios/"]').first()).toBeVisible();

    const formalLinks = await page
      .locator("header a, footer a, main a")
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")).filter((href) => href !== null),
      );
    expect(formalLinks.some((href) => href?.includes(".html"))).toBe(false);
    expect(formalLinks).not.toContain("/categories");
    expect(formalLinks).not.toContain("/scenarios");
  });

  test("opens a recommendation detail from a scenario tool", async ({ page }) => {
    await page.goto("/scenarios/build-agent");
    await page.locator('a[href="/recommendations/codex"]').first().click();

    await expect(page).toHaveURL(/\/recommendations\/codex$/);
    await expect(page.getByRole("heading", { name: "Codex", level: 1 })).toBeVisible();
  });

  for (const width of [1440, 1024, 768, 390]) {
    test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const path of [
        "/categories/ai-coding",
        "/scenarios/ai-website",
        "/search?q=AI",
        "/projects",
        "/about",
      ]) {
        await page.goto(path);
        const sizes = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          content: document.documentElement.scrollWidth,
        }));
        expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
      }
    });
  }

  test("supports keyboard search submission", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByRole("searchbox", { name: "搜索全部公开内容" });
    await input.focus();
    await input.fill("Codex");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/q=Codex/);
    await expect(page.locator('a[href="/recommendations/codex"]').first()).toBeVisible();
  });
});
