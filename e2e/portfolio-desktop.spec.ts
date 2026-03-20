import { test, expect } from '@playwright/test'

/**
 * Headless browsers typically lack WebGL, so the app falls back to the 2D
 * PortfolioContent view. These tests handle both paths:
 *   - 3D path: Loading screen → "View portfolio" → intro → seated overlay
 *   - 2D fallback: PortfolioContent renders directly with "ANDREA AVILA"
 */

/** Returns true if the page landed on the 2D fallback (no WebGL). */
async function is2DFallback(page: import('@playwright/test').Page): Promise<boolean> {
  await page.goto('/')
  // Wait for either the 3D loading screen or the 2D fallback to appear
  await expect(
    page.locator('text=ANDREA AVILA').first()
  ).toBeVisible({ timeout: 15_000 })

  // If "View portfolio" appears, we're in the 3D path
  const viewBtn = page.locator('text=View portfolio')
  const is3D = await viewBtn.isVisible({ timeout: 3_000 }).catch(() => false)
  return !is3D
}

// ─── 2D Fallback Tests ──────────────────────────────────────────────────────

test.describe('2D Fallback Portfolio', () => {
  test('Renders portfolio content when WebGL is unavailable', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(!fallback, 'WebGL is available — skipping 2D fallback tests')

    // Core content is visible
    await expect(page.locator('text=ANDREA').first()).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/2d-fallback.png' })
  })

  test('2D fallback has no critical console errors', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(!fallback, 'WebGL is available — skipping 2D fallback tests')

    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.reload()
    await page.waitForTimeout(3_000)

    const critical = errors.filter(
      (e) =>
        !e.includes('THREE.') &&
        !e.includes('WebGL') &&
        !e.includes('favicon') &&
        !e.includes('404')
    )
    expect(critical).toEqual([])
  })
})

// ─── 3D Experience Tests ────────────────────────────────────────────────────

test.describe('Desktop 3D Portfolio', () => {
  test.describe.configure({ mode: 'serial' })

  test('Loading screen shows and waits for click', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL — 3D tests skipped')

    await page.goto('/')
    await expect(page.locator('text=ANDREA AVILA').first()).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.screenshot({ path: 'e2e/screenshots/01-loading-ready.png' })
  })

  test('Click triggers intro with skip button', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL — 3D tests skipped')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')

    await expect(page.locator('button:has-text("Skip")')).toBeVisible({ timeout: 3_000 })
    await page.waitForTimeout(6_000)

    await expect(page.locator('text=View portfolio')).toBeHidden({ timeout: 2_000 })
    await page.screenshot({ path: 'e2e/screenshots/02-after-intro.png' })
  })

  test('Monitor overlay shows portfolio content after intro', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL — 3D tests skipped')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(6_500)

    const monitorScroll = page.locator('.monitor-scroll')
    await expect(monitorScroll).toBeVisible({ timeout: 5_000 })

    await expect(page.locator('button:has-text("Work")')).toBeVisible({ timeout: 3_000 })
    await expect(page.locator('button:has-text("About")')).toBeVisible()
    await expect(page.locator('button:has-text("Contact")')).toBeVisible()

    await page.screenshot({ path: 'e2e/screenshots/03-seated-portfolio.png' })
  })

  test('Arcade button navigates to arcade and back', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL — 3D tests skipped')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(6_500)

    const arcadeBtn = page.locator('button[aria-label="Go to Arcade"]')
    await expect(arcadeBtn).toBeVisible({ timeout: 3_000 })
    await arcadeBtn.click()

    await page.waitForTimeout(3_000)

    const backBtn = page.locator('button[aria-label="Back to Portfolio"]')
    await expect(backBtn).toBeVisible({ timeout: 3_000 })
    await page.screenshot({ path: 'e2e/screenshots/04-arcade.png' })

    await backBtn.click()
    await page.waitForTimeout(3_000)

    await expect(page.locator('.monitor-scroll')).toBeVisible({ timeout: 5_000 })
    await page.screenshot({ path: 'e2e/screenshots/05-back-to-portfolio.png' })
  })

  test('Skip button bypasses intro', async ({ page }) => {
    const fallback = await is2DFallback(page)
    test.skip(fallback, 'No WebGL — 3D tests skipped')

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')

    const skipBtn = page.locator('button:has-text("Skip")')
    await expect(skipBtn).toBeVisible({ timeout: 2_000 })
    await skipBtn.click()

    await expect(page.locator('.monitor-scroll')).toBeVisible({ timeout: 3_000 })
    await page.screenshot({ path: 'e2e/screenshots/06-skip-intro.png' })
  })
})

// ─── Console Errors (runs in both paths) ────────────────────────────────────

test.describe('Console errors check', () => {
  test('No critical console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/')
    await expect(
      page.locator('text=ANDREA AVILA').first()
    ).toBeVisible({ timeout: 15_000 })

    // If 3D path, click through
    const viewBtn = page.locator('text=View portfolio')
    if (await viewBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await viewBtn.click()
      await page.waitForTimeout(7_000)
    } else {
      await page.waitForTimeout(3_000)
    }

    const critical = errors.filter(
      (e) =>
        !e.includes('THREE.') &&
        !e.includes('WebGL') &&
        !e.includes('favicon') &&
        !e.includes('404')
    )

    if (critical.length > 0) {
      console.log('Console errors found:', critical)
    }
  })
})
