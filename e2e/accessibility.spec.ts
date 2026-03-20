import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Audit', () => {
  test('1) Home page passes axe audit without critical violations', async ({ page }) => {
    await page.goto('/')
    // Wait for the page to be interactive (loading screen visible)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )

    if (critical.length > 0) {
      const summary = critical.map(
        (v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`
      )
      console.error('Critical/serious a11y violations:', summary)
    }

    expect(critical).toHaveLength(0)
  })

  test('2) Mobile fallback passes axe audit (375x667)', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
    })
    const page = await context.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Mobile triggers 2D fallback — wait for portfolio content
    await page.waitForTimeout(2000)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )

    if (critical.length > 0) {
      const summary = critical.map(
        (v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`
      )
      console.error('Mobile critical/serious a11y violations:', summary)
    }

    expect(critical).toHaveLength(0)
    await context.close()
  })

  test('3) All images have alt text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const imagesWithoutAlt = await page.locator('img:not([alt])').count()
    const imagesWithEmptyAlt = await page.locator('img[alt=""]').count()
    // Decorative images with alt="" are acceptable, but images without alt at all are not
    expect(imagesWithoutAlt).toBe(0)

    // Log decorative images for awareness
    if (imagesWithEmptyAlt > 0) {
      console.log(`Info: ${imagesWithEmptyAlt} decorative images with alt=""`)
    }
  })

  test('4) All links have descriptive text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const links = page.locator('a')
    const count = await links.count()

    const problems: string[] = []
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      const text = (await link.innerText()).trim()
      const ariaLabel = await link.getAttribute('aria-label')
      const title = await link.getAttribute('title')
      const ariaLabelledBy = await link.getAttribute('aria-labelledby')
      const hasImg = (await link.locator('img[alt]:not([alt=""])').count()) > 0
      const hasSvgTitle = (await link.locator('svg title').count()) > 0

      const hasAccessibleName =
        text.length > 0 ||
        (ariaLabel && ariaLabel.trim().length > 0) ||
        (title && title.trim().length > 0) ||
        ariaLabelledBy ||
        hasImg ||
        hasSvgTitle

      if (!hasAccessibleName) {
        const href = await link.getAttribute('href')
        problems.push(`Link missing accessible name: href="${href}"`)
      }
    }

    if (problems.length > 0) {
      console.error('Links without descriptive text:', problems)
    }

    expect(problems).toHaveLength(0)
  })

  test('5) Landmarks exist (main, nav)', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Check for main landmark (role="main" or <main>)
    const mainLandmark = page.locator('main, [role="main"]')
    const mainCount = await mainLandmark.count()
    expect(mainCount).toBeGreaterThanOrEqual(1)

    // Check for nav landmark (role="navigation" or <nav>)
    const navLandmark = page.locator('nav, [role="navigation"]')
    const navCount = await navLandmark.count()
    expect(navCount).toBeGreaterThanOrEqual(1)
  })

  test('6) HTML lang attribute is defined', async ({ page }) => {
    await page.goto('/')

    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBeTruthy()
    expect(lang!.length).toBeGreaterThanOrEqual(2)
  })
})
