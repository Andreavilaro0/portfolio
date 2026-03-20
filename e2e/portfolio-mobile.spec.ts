import { test, expect } from '@playwright/test'

test.describe('Mobile fallback — no 3D', () => {
  test.use({ viewport: { width: 375, height: 812 } }) // iPhone viewport

  test('Mobile shows flat PortfolioContent, not 3D scene', async ({ page }) => {
    await page.goto('/')

    // Should NOT show loading screen (mobile skips 3D entirely)
    await expect(page.locator('text=View portfolio')).toBeHidden({ timeout: 5_000 })
    await expect(page.locator('text=Loading workspace...')).toBeHidden({ timeout: 5_000 })

    // Should show the full PortfolioContent directly
    // Hero section from Hero.tsx
    const heroName = page.locator('h1:has-text("ANDREA")').first()
    await expect(heroName).toBeVisible({ timeout: 10_000 })

    await page.screenshot({ path: 'e2e/screenshots/08-mobile-hero.png', fullPage: false })
  })

  test('Mobile portfolio is scrollable and readable', async ({ page }) => {
    await page.goto('/')

    // Wait for content
    await expect(page.locator('h1:has-text("ANDREA")').first()).toBeVisible({ timeout: 10_000 })

    // Scroll to projects section
    await page.evaluate(() => {
      const el = document.querySelector('#projects')
      el?.scrollIntoView({ behavior: 'instant' })
    })
    await page.waitForTimeout(500)

    await page.screenshot({ path: 'e2e/screenshots/09-mobile-projects.png', fullPage: false })

    // CivicAid section should be visible
    await expect(page.locator('text=CLARA').first()).toBeVisible()
  })

  test('Mobile has no nav arrows (no 3D mode)', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(3_000)

    // Nav arrows should not exist
    await expect(page.locator('text=Monitor')).toBeHidden()
    await expect(page.locator('text=MacBook')).toBeHidden()
  })
})
