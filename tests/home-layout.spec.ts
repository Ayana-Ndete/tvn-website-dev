import { test, expect } from "@playwright/test"

for (const width of [1440, 390]) {
  test(`customer homepage layout at ${width}px`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/website/")
    await expect(page.locator("#hero .hero-artwork")).toBeVisible({ timeout: 20000 })
    await expect(page.locator("#hero .home-agent")).toHaveCount(0)
    await expect(page.locator("#ai .home-agent")).toHaveCount(1)
    await page.screenshot({ path: `test-results/home-${width}.png` })
    const sections = await page
      .locator("main section[id]")
      .evaluateAll((nodes) => nodes.map((n) => n.id))
    expect(sections).toEqual([
      "hero",
      "at-a-glance",
      "services",
      "ai",
      "work",
      "journey",
      "about",
      "contact",
    ])
    expect(await page.locator("#services article").count()).toBe(5)
    expect(await page.locator("#work details").count()).toBe(5)
    const details = page.locator("#work details").first()
    await details.locator("summary").click()
    await expect(details).toHaveAttribute("open", "")
    await expect(details.locator(".detail")).toBeVisible()
    await expect(
      page.locator('#contact a[href^="mailto:"]').first(),
    ).toBeAttached()
    if (width < 1024) {
      await page.getByRole("button", { name: "Open menu", exact: true }).click()
      await page
        .locator("#mobile-navigation")
        .getByRole("link", { name: "AI & Agents", exact: true })
        .click()
      await expect(page).toHaveURL(/#ai$/)
      await expect(page.locator("#mobile-navigation")).toHaveCount(0)
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((i) => i.complete && i.naturalWidth === 0)
            .map((i) => i.src),
        ),
    ).toEqual([])
    expect(errors).toEqual([])
  })
}

test("homepage original motion controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/website/")
  await page
    .getByRole("button", { name: "Pause animation", exact: true })
    .click()
  await expect(page.locator(".hero-artwork")).toHaveClass(/is-paused/)
  await page
    .getByRole("button", { name: "Resume animation", exact: true })
    .click()
  await expect(page.locator(".hero-artwork")).not.toHaveClass(/is-paused/)
  await page.locator("#work").scrollIntoViewIfNeeded()
  await expect(page.locator("#work article").first()).toBeVisible()
  expect(errors).toEqual([])
})

test("more projects open complete details and restore keyboard focus", async ({ page }) => {
  await page.goto("/website/")
  const links = page.locator(".more a[data-project]")
  await expect(links).toHaveCount(12)
  for (let index = 0; index < 12; index++) {
    const link = links.nth(index)
    const name = await link.locator("..").locator("h3").innerText()
    await link.click()
    const dialog = page.locator(".home-project-dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.locator("h2")).toHaveText(name)
    await expect(dialog.getByRole("heading", { name: "Overview", exact: true })).toBeVisible()
    expect(await dialog.locator("li").count()).toBeGreaterThan(0)
    for (const image of await dialog.locator("img").all()) {
      await expect(image).toBeVisible()
      expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    }
    if (["tradeconnect", "sps", "drc-payments", "ujumbe", "ppb", "eac-harmonisation"].includes(await link.getAttribute("data-project") ?? "")) {
      await expect(dialog.locator("img")).toHaveCount(0)
    }
    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeVisible()
    await expect(link).toBeFocused()
  }
})
