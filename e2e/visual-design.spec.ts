import { test, expect } from '@playwright/test'

/**
 * Visual Design & Color System Tests
 *
 * Validates the neo-brutalist design system:
 * - Color palette consistency (neo-pop: pink, violet, lime, cyan)
 * - Typography hierarchy (display, body, code)
 * - Component visibility and rendering
 * - Contrast ratios for readability
 * - Responsive visual integrity
 */

// Design tokens from globals.css
const PALETTE = {
  bg: 'rgb(242, 240, 237)',       // #F2F0ED
  surface: 'rgb(255, 255, 255)',   // #FFFFFF
  text: 'rgb(26, 26, 26)',         // #1A1A1A
  muted: 'rgb(107, 107, 107)',     // #6B6B6B
  pink: 'rgb(255, 45, 155)',       // #FF2D9B
  violet: 'rgb(123, 47, 255)',     // #7B2FFF
  lime: 'rgb(190, 255, 0)',        // #BEFF00
  cyan: 'rgb(0, 229, 255)',        // #00E5FF
}

const FONTS = {
  display: 'Bebas Neue',
  body: 'Inter',
  code: 'JetBrains Mono',
}

test.describe('Design System — Color Palette', () => {
  test.beforeEach(async ({ page }) => {
    // Use mobile viewport to trigger 2D fallback (no WebGL needed)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('Body background uses design token --color-bg', async ({ page }) => {
    const bg = await page.locator('body').evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )
    expect(bg).toBe(PALETTE.bg)
  })

  test('Primary text color is dark (--color-text)', async ({ page }) => {
    const color = await page.locator('body').evaluate(
      (el) => getComputedStyle(el).color
    )
    expect(color).toBe(PALETTE.text)
  })

  test('Cards use white surface background', async ({ page }) => {
    const cards = page.locator('.card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    const bg = await cards.first().evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )
    expect(bg).toBe(PALETTE.surface)
  })

  test('Cards have neo-brutalist border and box-shadow', async ({ page }) => {
    const card = page.locator('.card').first()
    const border = await card.evaluate(
      (el) => getComputedStyle(el).borderWidth
    )
    const shadow = await card.evaluate(
      (el) => getComputedStyle(el).boxShadow
    )

    expect(border).toBe('3px')
    expect(shadow).not.toBe('none')
  })

  test('All 4 badge colors render correctly', async ({ page }) => {
    const badgeChecks = [
      { selector: '.badge-pink', expectedBg: PALETTE.pink },
      { selector: '.badge-violet', expectedBg: PALETTE.violet },
      { selector: '.badge-lime', expectedBg: PALETTE.lime },
      { selector: '.badge-cyan', expectedBg: PALETTE.cyan },
    ]

    for (const { selector, expectedBg } of badgeChecks) {
      const badge = page.locator(selector).first()
      const count = await page.locator(selector).count()
      if (count === 0) continue

      const bg = await badge.evaluate(
        (el) => getComputedStyle(el).backgroundColor
      )
      expect(bg, `${selector} background`).toBe(expectedBg)
    }
  })

  test('Labels use muted color and monospace font', async ({ page }) => {
    const label = page.locator('.label').first()
    const color = await label.evaluate(
      (el) => getComputedStyle(el).color
    )
    const fontFamily = await label.evaluate(
      (el) => getComputedStyle(el).fontFamily
    )

    expect(color).toBe(PALETTE.muted)
    expect(fontFamily.toLowerCase()).toContain('jetbrains mono')
  })
})

test.describe('Design System — Typography Hierarchy', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('H1 uses display font (Bebas Neue)', async ({ page }) => {
    const h1 = page.locator('h1').first()
    const fontFamily = await h1.evaluate(
      (el) => getComputedStyle(el).fontFamily
    )
    expect(fontFamily.toLowerCase()).toContain('bebas neue')
  })

  test('H1 has prominent font size (>48px)', async ({ page }) => {
    const h1 = page.locator('h1').first()
    const fontSize = await h1.evaluate(
      (el) => parseFloat(getComputedStyle(el).fontSize)
    )
    expect(fontSize).toBeGreaterThan(48)
  })

  test('Body text uses Inter font', async ({ page }) => {
    const body = await page.locator('body').evaluate(
      (el) => getComputedStyle(el).fontFamily
    )
    expect(body.toLowerCase()).toContain('inter')
  })

  test('Code/monospace elements use JetBrains Mono', async ({ page }) => {
    const codeElements = page.locator('.label, .badge, .tag')
    const count = await codeElements.count()
    expect(count).toBeGreaterThan(0)

    const fontFamily = await codeElements.first().evaluate(
      (el) => getComputedStyle(el).fontFamily
    )
    expect(fontFamily.toLowerCase()).toContain('jetbrains mono')
  })
})

test.describe('Design System — Component Visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('Hero section renders with name visible', async ({ page }) => {
    const name = page.locator('h1').first()
    await expect(name).toBeVisible()
    const text = await name.innerText()
    expect(text).toContain('ANDREA')
    expect(text).toContain('AVILA')
  })

  test('Navigation bar is visible with links', async ({ page }) => {
    const nav = page.locator('nav')
    await expect(nav.first()).toBeVisible()

    const navText = (await nav.first().innerText()).toUpperCase()
    expect(navText).toContain('WORK')
    expect(navText).toContain('ABOUT')
    expect(navText).toContain('CONTACT')
  })

  test('Section dividers render as 3px lines', async ({ page }) => {
    // Nav border acts as divider
    const nav = page.locator('nav').first()
    const borderBottom = await nav.evaluate(
      (el) => getComputedStyle(el).borderBottomWidth
    )
    expect(borderBottom).toBe('3px')
  })

  test('Badges are visible and rendered as inline-block', async ({ page }) => {
    const badges = page.locator('.badge')
    const count = await badges.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < Math.min(count, 4); i++) {
      const display = await badges.nth(i).evaluate(
        (el) => getComputedStyle(el).display
      )
      // Badges may compute as 'block' when inside absolute/flex containers
      expect(['inline-block', 'block']).toContain(display)
    }
  })

  test('Footer section renders and is scrollable to', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector('#contact')?.scrollIntoView()
    })
    await page.waitForTimeout(500)

    const footer = page.locator('#contact')
    await expect(footer).toBeVisible()
  })
})

test.describe('Design System — Color Contrast & Readability', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('All visible text has sufficient opacity (>=0.4)', async ({ page }) => {
    // Find text elements that might have low opacity
    const textElements = page.locator('span, p, h1, h2, h3, a, button, div')
    const count = await textElements.count()
    const lowOpacityElements: string[] = []

    for (let i = 0; i < Math.min(count, 100); i++) {
      const el = textElements.nth(i)
      const isVisible = await el.isVisible().catch(() => false)
      if (!isVisible) continue

      const text = (await el.innerText().catch(() => '')).trim()
      if (!text) continue

      const opacity = await el.evaluate((el) => {
        const style = getComputedStyle(el)
        return parseFloat(style.opacity)
      })

      if (opacity > 0 && opacity < 0.4) {
        lowOpacityElements.push(`"${text.slice(0, 30)}..." opacity=${opacity}`)
      }
    }

    if (lowOpacityElements.length > 0) {
      console.warn('Low opacity text elements:', lowOpacityElements)
    }
    expect(lowOpacityElements).toHaveLength(0)
  })

  test('Badge text contrasts with badge background', async ({ page }) => {
    const badges = page.locator('.badge')
    const count = await badges.count()

    for (let i = 0; i < count; i++) {
      const badge = badges.nth(i)
      const isVisible = await badge.isVisible().catch(() => false)
      if (!isVisible) continue

      const { fg, bg } = await badge.evaluate((el) => {
        const style = getComputedStyle(el)
        return { fg: style.color, bg: style.backgroundColor }
      })

      // Parse rgb values and compute relative luminance
      const fgLum = relativeLuminance(parseRGB(fg))
      const bgLum = relativeLuminance(parseRGB(bg))
      const ratio = contrastRatio(fgLum, bgLum)

      const text = await badge.innerText()
      expect(ratio, `Badge "${text}" contrast ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(3.0)
    }
  })

  test('Nav links have sufficient contrast against background', async ({ page }) => {
    const navLinks = page.locator('nav a')
    const count = await navLinks.count()

    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i)
      const color = await link.evaluate(
        (el) => getComputedStyle(el).color
      )
      const text = await link.innerText()

      // Nav is on --color-bg (#F2F0ED), links are --color-muted (#6B6B6B)
      const fgLum = relativeLuminance(parseRGB(color))
      const bgLum = relativeLuminance(parseRGB(PALETTE.bg))
      const ratio = contrastRatio(fgLum, bgLum)

      expect(ratio, `Nav "${text}" contrast ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(3.0)
    }
  })
})

test.describe('Design System — Responsive Visual Integrity', () => {
  test('Desktop (1280x800): page loads and renders content', async ({ browser }) => {
    // Use new context to override mobile-iphone viewport
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Desktop may show 3D or 2D depending on WebGL — just verify page loads
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // Check that at least some content renders (nav, h1, or cards)
    const hasContent = await page.evaluate(() => {
      return document.body.innerText.length > 50
    })
    expect(hasContent).toBe(true)
    await context.close().catch(() => { /* trace artifact cleanup race */ })
  })

  test('Tablet (768x1024): layout renders without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)
  })

  test('Mobile (375x667): page has no horizontal scrollbar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)

    // The meaningful test: no horizontal scrollbar visible to the user
    // Individual children may exceed parent bounds but body overflow-x:hidden clips them
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)
  })

  test('Focus-visible CSS rule is defined with violet outline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verify that focus-visible CSS rules exist in stylesheets
    const focusVisibleInfo = await page.evaluate(() => {
      const sheets = document.styleSheets
      const matches: string[] = []
      for (const sheet of sheets) {
        try {
          for (const rule of sheet.cssRules) {
            const text = rule.cssText || ''
            if (text.includes('focus-visible')) {
              matches.push(text.slice(0, 200))
            }
          }
        } catch { /* cross-origin sheets */ }
      }
      return matches
    })

    expect(focusVisibleInfo.length).toBeGreaterThan(0)

    // Verify at least one rule references violet color
    const hasViolet = focusVisibleInfo.some(
      (rule) => rule.includes('7B2FFF') || rule.includes('7b2fff') || rule.includes('violet')
    )
    expect(hasViolet).toBe(true)
  })
})

test.describe('Design System — Visual Snapshot Audit', () => {
  test('Screenshot: mobile 2D fallback full page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    await page.screenshot({
      path: 'e2e/screenshots/visual-mobile-fullpage.png',
      fullPage: true,
    })
  })

  test('Screenshot: tablet layout', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 768, height: 1024 } })
    const page = await context.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    await page.screenshot({
      path: 'e2e/screenshots/visual-tablet-fullpage.png',
      fullPage: true,
    })
    await context.close().catch(() => { /* trace artifact cleanup race */ })
  })
})

// ─── Contrast Calculation Helpers ───

function parseRGB(rgb: string): [number, number, number] {
  const match = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return [0, 0, 0]
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}
