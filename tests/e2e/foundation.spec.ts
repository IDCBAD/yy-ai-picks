import { expect, test } from "@playwright/test";

test("opens the project foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "余一的 AI 推荐清单" })).toBeVisible();
});
