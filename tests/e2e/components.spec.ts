import { expect, test } from "@playwright/test";

test.describe("Phase 3 component preview", () => {
  test("renders desktop navigation and safe external links", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/dev/components");

    await expect(page.getByRole("heading", { name: "公共组件预览", level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "主导航" })).toBeVisible();

    const externalLink = page.getByRole("link", { name: /外部链接/ });
    await expect(externalLink).toHaveAttribute("target", "_blank");
    await expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "跳到主要内容" })).toBeFocused();
  });

  test("opens and closes the mobile menu with keyboard controls", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dev/components");

    const menuButton = page.getByRole("button", { name: "打开菜单" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(page.getByRole("dialog", { name: "移动导航" })).toBeVisible();
    await expect(page.locator('header button[aria-expanded="true"]')).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "移动导航" })).toBeHidden();
    await expect(menuButton).toBeFocused();
  });

  for (const width of [1440, 1024, 768, 390]) {
    test(`has no page-level horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/dev/components");

      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    });
  }

  test("removes decorative card rotation for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/dev/components");

    const featuredCard = page
      .locator('[data-variant="featured"]')
      .filter({ has: page.getByRole("heading") })
      .first();
    await expect(featuredCard).toHaveCSS("transform", "none");
  });
});
