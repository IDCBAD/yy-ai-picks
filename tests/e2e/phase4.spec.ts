import { expect, test } from "@playwright/test";

test.describe("Phase 4 home and recommendation details", () => {
  test("opens the home page with computed hero data", async ({ page }) => {
    await page.goto("/");

    const hero = page.locator("section").filter({
      has: page.getByRole("heading", { name: "余一的 AI 推荐清单", level: 1 }),
    });
    await expect(hero).toContainText("20");
    await expect(hero).toContainText("2026/07/10");
    await expect(page.getByRole("search", { name: "搜索推荐清单" })).toBeVisible();
  });

  test("opens a real recommendation detail from a reused card", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/recommendations/claude"]').first().click();

    await expect(page).toHaveURL(/\/recommendations\/claude$/);
    await expect(page.getByRole("heading", { name: "Claude", level: 1 })).toBeVisible();
    await expect(
      page.getByRole("paragraph").filter({ hasText: "支持长文本理解与代码生成的 AI 助手。" }),
    ).toBeVisible();
  });

  test("renders distinct content for different slugs", async ({ page }) => {
    await page.goto("/recommendations/claude");
    await expect(page.getByRole("heading", { name: "Claude", level: 1 })).toBeVisible();

    await page.goto("/recommendations/cursor");
    await expect(page.getByRole("heading", { name: "Cursor", level: 1 })).toBeVisible();
    await expect(page.getByRole("paragraph").filter({ hasText: /代码库上下文/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Claude", level: 1 })).toHaveCount(0);
  });

  test("returns a real 404 for an invalid recommendation slug", async ({ page }) => {
    const response = await page.goto("/recommendations/not-a-real-tool");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "没有找到这个页面" })).toBeVisible();
  });

  test("uses safe attributes for the official website action", async ({ page }) => {
    await page.goto("/recommendations/claude");

    const official = page.getByRole("link", { name: /访问官网/ }).first();
    await expect(official).toHaveAttribute("target", "_blank");
    await expect(official).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("writes home filters to the URL and preserves them after refresh", async ({ page }) => {
    await page.goto("/");
    const categoryFilters = page.getByRole("group", { name: "分类" });
    const coding = categoryFilters.getByRole("button", { name: /AI 编程与开发/ });
    await coding.click();

    await expect(page).toHaveURL(/category=ai-coding/);
    await page.reload();
    await expect(categoryFilters.getByRole("button", { name: /AI 编程与开发/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.getByRole("list", { name: "全部推荐结果" }).getByRole("listitem"),
    ).toHaveCount(4);
  });

  for (const width of [1440, 1024, 768, 390]) {
    test(`keeps the home and detail layouts within ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/recommendations/claude"]) {
        await page.goto(path);
        const sizes = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          content: document.documentElement.scrollWidth,
        }));
        expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
      }
    });
  }

  test("exposes the main actions to keyboard navigation", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "跳到主要内容" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });
});
