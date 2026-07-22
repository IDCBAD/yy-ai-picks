import { expect, test } from "@playwright/test";

const keyPages = [
  "/",
  "/categories/ai-coding",
  "/scenarios/ai-website",
  "/recommendations/codex",
  "/search?q=Codex",
  "/projects",
  "/about",
] as const;

test.describe("Phase 6 release checks", () => {
  test("serves every sitemap page and excludes non-indexable routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const xml = await response.text();
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

    expect(urls).toHaveLength(41);
    expect(urls.some((url) => url.includes("/search"))).toBe(false);
    expect(urls.some((url) => url.includes("/dev/"))).toBe(false);

    for (const url of urls) {
      const pageResponse = await request.get(url);
      expect(pageResponse.status(), url).toBe(200);
    }
  });

  test("keeps search input synchronized with browser history", async ({ page }) => {
    await page.goto("/search?q=Codex");
    const input = page.getByRole("searchbox", { name: "搜索全部公开内容" });
    await expect(input).toHaveValue("Codex");

    await input.fill("ChatGPT");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/q=ChatGPT/);
    await expect(input).toHaveValue("ChatGPT");

    await page.goBack();
    await expect(page).toHaveURL(/q=Codex/);
    await expect(input).toHaveValue("Codex");
  });

  test("has one main heading and safe external links on key pages", async ({ page }) => {
    for (const path of keyPages) {
      await page.goto(path);
      await expect(page.locator("main h1")).toHaveCount(1);

      const externalLinks = page.locator('main a[target="_blank"]');
      for (let index = 0; index < (await externalLinks.count()); index += 1) {
        const link = externalLinks.nth(index);
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
        await expect(link).toContainText("在新窗口打开");
      }
    }
  });

  test("has no invalid formal links on representative pages", async ({ page }) => {
    const hrefs = new Set<string>();

    for (const path of keyPages) {
      await page.goto(path);
      const pageHrefs = await page
        .locator("header a, main a, footer a")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      pageHrefs.forEach((href) => {
        if (href) hrefs.add(href);
      });
    }

    expect([...hrefs].some((href) => href.includes(".html"))).toBe(false);
    expect([...hrefs].some((href) => href === "#" || href.startsWith("javascript:"))).toBe(false);
  });

  test("keeps the 1920x1080 layout stable", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    for (const path of keyPages) {
      await page.goto(path);
      const layout = await page.evaluate(() => ({
        contentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      expect(layout.contentWidth, path).toBeLessThanOrEqual(layout.viewportWidth);
    }
  });

  test("keeps development and error routes out of search indexes", async ({ page }) => {
    await page.goto("/dev/components");
    await expect(page.locator('meta[name="robots"][content*="nofollow"]')).toHaveAttribute(
      "content",
      /noindex, nofollow/i,
    );

    const response = await page.goto("/recommendations/not-real");
    expect(response?.status()).toBe(404);
    await expect(page.locator('meta[name="robots"][content*="nofollow"]')).toHaveAttribute(
      "content",
      /noindex, nofollow/i,
    );
  });
});
