import { test, expect } from '@playwright/test'

const SCREENSHOTS = 'e2e/screenshots/visual-qa'

// Helper: detect if we're in 2D fallback (no WebGL)
async function is2DFallback(page: import('@playwright/test').Page): Promise<boolean> {
  await page.goto('/')
  await expect(page.locator('text=ANDREA AVILA').first()).toBeVisible({ timeout: 15_000 })
  const viewBtn = page.locator('text=View portfolio')
  return !(await viewBtn.isVisible({ timeout: 3_000 }).catch(() => false))
}

// ─── 3D Experience Visual QA ──────────────────────────────────────────────────

test.describe('3D Visual QA', () => {
  test.describe.configure({ mode: 'serial' })

  test('01 — Loading screen', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.screenshot({ path: `${SCREENSHOTS}/3d-01-loading.png` })
  })

  test('02 — Intro animation (2s mark)', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: `${SCREENSHOTS}/3d-02-intro-2s.png` })
  })

  test('03 — Intro animation (4s mark)', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(4000)
    await page.screenshot({ path: `${SCREENSHOTS}/3d-03-intro-4s.png` })
  })

  test('04 — Seated mode (portfolio overlay)', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(6500)
    await expect(page.locator('.monitor-scroll')).toBeVisible({ timeout: 5_000 })
    await page.screenshot({ path: `${SCREENSHOTS}/3d-04-seated-portfolio.png` })
  })

  test('05 — Portfolio scrolled to projects', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(6500)

    // Click Work nav button to scroll to projects
    const workBtn = page.locator('button:has-text("Work")')
    await expect(workBtn).toBeVisible({ timeout: 3_000 })
    await workBtn.click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${SCREENSHOTS}/3d-05-scrolled-work.png` })
  })

  test('06 — Portfolio scrolled to contact', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(6500)

    const contactBtn = page.locator('button:has-text("Contact")')
    await expect(contactBtn).toBeVisible({ timeout: 3_000 })
    await contactBtn.click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${SCREENSHOTS}/3d-06-scrolled-contact.png` })
  })

  test('07 — Arcade mode', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(6500)

    const arcadeBtn = page.locator('button[aria-label="Go to Arcade"]')
    await expect(arcadeBtn).toBeVisible({ timeout: 3_000 })
    await arcadeBtn.click()
    await page.waitForTimeout(3000)
    await page.screenshot({ path: `${SCREENSHOTS}/3d-07-arcade.png` })
  })

  test('08 — Skip intro (instant)', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')

    const skipBtn = page.locator('button:has-text("Skip")')
    await expect(skipBtn).toBeVisible({ timeout: 2_000 })
    await skipBtn.click()
    await page.waitForTimeout(1000)
    await page.screenshot({ path: `${SCREENSHOTS}/3d-08-skip-result.png` })
  })
})

// ─── 2D Mobile Fallback Visual QA ────────────────────────────────────────────

test.describe('2D Fallback Visual QA', () => {
  test.use({ viewport: { width: 375, height: 812 } }) // iPhone sized

  test('09 — Mobile hero', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=ANDREA AVILA').first()).toBeVisible({ timeout: 10_000 })
    await page.screenshot({ path: `${SCREENSHOTS}/2d-09-mobile-hero.png` })
  })

  test('10 — Mobile nav', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 10_000 })
    await page.screenshot({ path: `${SCREENSHOTS}/2d-10-mobile-nav.png` })
  })

  test('11 — Mobile about section', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    const about = page.locator('#about')
    if (await about.isVisible().catch(() => false)) {
      await about.scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
    }
    await page.screenshot({ path: `${SCREENSHOTS}/2d-11-mobile-about.png` })
  })

  test('12 — Mobile project (CivicAid)', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    const project = page.locator('text=CLARA').first()
    if (await project.isVisible().catch(() => false)) {
      await project.scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
    }
    await page.screenshot({ path: `${SCREENSHOTS}/2d-12-mobile-project.png` })
  })

  test('13 — Mobile footer/contact', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    const footer = page.locator('#contact')
    if (await footer.isVisible().catch(() => false)) {
      await footer.scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
    }
    await page.screenshot({ path: `${SCREENSHOTS}/2d-13-mobile-contact.png` })
  })

  test('14 — Mobile full page scroll', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: `${SCREENSHOTS}/2d-14-mobile-full.png`, fullPage: true })
  })
})

// ─── Desktop 2D Fallback (1280px, simulating no WebGL) ───────────────────────

test.describe('2D Desktop Fallback Visual QA', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('15 — Desktop 2D full page', async ({ page }) => {
    // Force 2D by checking if it naturally falls back
    await page.goto('/')
    await page.waitForTimeout(3000)
    await page.screenshot({ path: `${SCREENSHOTS}/2d-15-desktop-full.png`, fullPage: true })
  })
})
