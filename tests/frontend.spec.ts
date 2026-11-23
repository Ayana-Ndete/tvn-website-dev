import { test, expect } from "@playwright/test"

for (const path of [
  "/",
  "/services",
  "/about",
  "/projects",
  "/portfolio",
  "/products",
  "/code-centre",
  "/contact",
]) {
  test(`direct load and refresh: ${path}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    await page.goto(path)
    await expect(page.locator("h1").first()).toBeVisible()
    await expect(page.locator(".site-nav")).toBeVisible()
    await page.reload()
    await expect(page.locator("h1").first()).toBeVisible()
    expect(errors).toEqual([])
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.src),
        ),
    ).toEqual([])
  })
}

test("history URL retains its anchor", async ({ page }) => {
  await page.goto("/history")
  await expect(page).toHaveURL(/\/about#history$/)
  await expect(page.locator("#history")).toBeAttached()
})

test("home mobile navigation and motion controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await page.getByRole("button", { name: "Open menu", exact: true }).click()
  await expect(page.locator("#mobile-navigation")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.locator("#mobile-navigation")).toHaveCount(0)
  await page
    .getByRole("button", { name: "Pause animation", exact: true })
    .click()
  await expect(page.locator(".hero-artwork")).toHaveClass(/is-paused/)
  await page
    .getByRole("button", { name: "Resume animation", exact: true })
    .click()
  await expect(page.locator(".hero-artwork")).not.toHaveClass(/is-paused/)
})

test("navbar uses page routes for destinations that have already been migrated", async ({ page }) => {
  await page.goto("/")
  const navigation = page.locator(".nav-desktop")
  await expect(navigation.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "/website/")
  await expect(navigation.getByRole("link", { name: "Services", exact: true })).toHaveAttribute("href", "/website/services")
  await expect(navigation.getByRole("link", { name: "Our Work", exact: true })).toHaveAttribute("href", "/website/projects")
  await expect(navigation.getByRole("link", { name: "About", exact: true })).toHaveAttribute("href", "/website/about")
  await expect(page.getByRole("link", { name: "Let’s talk", exact: true })).toHaveAttribute("href", "/website/contact")
})

test("projects are presented in priority order and expand their details in place", async ({
  page,
}) => {
  await page.goto("/projects")
  await expect(page.locator(".work-case").first()).toContainText(
    "Sarit Belong Loyalty Management System",
  )
  await expect(page.locator(".work-case").nth(1)).toContainText(
    "DTIC Export Barrier Reporting & Resolution (NTB) Platform",
  )
  await expect(page.locator(".work-case").nth(3)).toContainText(
    "EAC Sanitary & Phytosanitary (SPS) Platform",
  )
  await page.getByRole("button", { name: "View case study" }).first().click()
  const firstProject = page.locator(".work-case").first()
  await expect(firstProject.locator(".work-case-details")).toBeVisible()
  await expect(firstProject.getByText("Scope", { exact: true })).toBeVisible()
  await expect(firstProject.getByText("Outputs", { exact: true })).toBeVisible()
  await expect(page.locator("dialog")).toHaveCount(0)
  await page.reload()
  await expect(page.locator(".work-case").first().locator(".work-case-details")).toHaveCount(0)
  await page.goto("/projects#case-study-sarit-belong")
  await expect(page.locator(".work-case").first().locator(".work-case-details")).toBeVisible()
  await firstProject.getByRole("button", { name: "Close case study" }).click()
  await expect(firstProject.locator(".work-case-details")).toHaveCount(0)
})

test("contact form presents the available services and validates required fields", async ({ page }) => {
  await page.goto("/contact")
  await expect(page.getByRole("heading", { name: "Have a project in mind?" })).toBeVisible()
  await expect(page.getByLabel("What do you need help with?")).toHaveCount(1)
  await expect(page.getByLabel("What do you need help with?")).toContainText("AI & Agentic Systems")
  await page.getByRole("button", { name: /Send enquiry/ }).click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(page.getByLabel("Full name")).toBeFocused()
})

test("Code Centre live filters and browser-local publishing", async ({
  page,
}) => {
  await page.goto("/code-centre")
  const search = page.getByRole("searchbox", { name: "Search articles" })
  await search.fill("unfindable-article")
  await expect(page.locator(".cc-card")).toHaveCount(0)
  await page.getByRole("button", { name: /Clear filters/ }).click()
  await expect(page.locator(".cc-card").first()).toBeVisible()
  await page.getByRole("button", { name: "DevOps", exact: true }).click()
  await expect(page.locator(".cc-card-icon").first()).toHaveAttribute(
    "data-topic",
    "DevOps",
  )
  await page.goto("/code-centre#java-queue-empty")
  await expect(page.locator(".cc-article-layout h1")).toBeVisible()
  await expect(page.locator(".cc-code").first()).toBeVisible()
  await page.goto("/code-centre#write")
  await page.getByLabel("Post title").fill("Nuxt migration test")
  await page.getByLabel("Your name").fill("Frontend test")
  await page
    .getByLabel("Short summary")
    .fill("Browser-local publishing still works.")
  await page
    .getByLabel("Article content")
    .fill(
      '## Check\n\nThe content is preserved.\n\n```java\nSystem.out.println("ok");\n```',
    )
  await page.reload()
  await expect(page.getByLabel("Post title")).toHaveValue("Nuxt migration test")
  await page.getByRole("button", { name: "Preview", exact: true }).click()
  await expect(page.locator(".cc-preview h2").first()).toHaveText(
    "Nuxt migration test",
  )
  await page.getByRole("button", { name: /Save post locally/ }).click()
  await expect(page.locator(".cc-article-layout h1")).toHaveText(
    "Nuxt migration test",
  )
  await page.reload()
  await expect(page.locator(".cc-article-layout h1")).toHaveText(
    "Nuxt migration test",
  )
})

for (const path of ['/about', '/projects', '/code-centre']) {
  test(`mobile navigation: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(path)
    const toggle = page.locator('.nav-toggle')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('.nav-mobile')).toBeVisible()
    await expect(page.locator('.nav-mobile').getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/website/')
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
}

test('normal-motion pages initialize without runtime errors', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const path of ['/', '/about', '/projects', '/code-centre']) {
    await page.goto(path)
    await expect(page.locator('h1').first()).toBeVisible()
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2))
    await expect(page.locator('.site-nav')).toBeVisible()
  }
  expect(errors).toEqual([])
})
