import { test, expect } from '@playwright/test'

test.describe('UX Heuristics — Accessibility & Usability', () => {
  // ─── 1. Skip-to-content link ───
  test('Skip-to-content link exists and is focusable with Tab', async ({ page }) => {
    await page.goto('/')

    const skipLink = page.locator('a.skip-link').first()
    await expect(skipLink).toBeAttached()
    await expect(skipLink).toHaveAttribute('href', '#main-content')
    await expect(skipLink).toHaveText('Skip to content')

    // Off-screen by default
    const boxBefore = await skipLink.boundingBox()
    expect(boxBefore).not.toBeNull()
    expect(boxBefore!.x).toBeLessThan(0)

    // Tab brings it into view
    await page.keyboard.press('Tab')
    await expect(skipLink).toBeFocused({ timeout: 5_000 })
    const boxAfter = await skipLink.boundingBox()
    expect(boxAfter).not.toBeNull()
    expect(boxAfter!.x).toBeGreaterThanOrEqual(0)
  })

  // ─── 2. All buttons have accessible names ───
  test('All buttons have aria-label or visible text', async ({ page }) => {
    await page.goto('/')

    // Wait for whichever version renders — 3D loading screen or 2D fallback
    // The 2D fallback shows "ANDREA AVILA" heading directly; 3D shows "View portfolio"
    const contentReady = page.locator('text=ANDREA AVILA').first()
    await expect(contentReady).toBeVisible({ timeout: 30_000 })

    // If 3D loaded, enter the experience
    const viewPortfolio = page.locator('text=View portfolio')
    if (await viewPortfolio.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await viewPortfolio.click()
      await page.waitForTimeout(7_000)
    }

    const buttons = page.locator('button')
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i)

      // Skip hidden/invisible buttons
      if (!(await btn.isVisible())) continue

      const ariaLabel = await btn.getAttribute('aria-label')
      const textContent = (await btn.textContent())?.trim() ?? ''
      const ariaLabelledBy = await btn.getAttribute('aria-labelledby')

      const hasAccessibleName =
        (ariaLabel && ariaLabel.length > 0) ||
        textContent.length > 0 ||
        (ariaLabelledBy && ariaLabelledBy.length > 0)

      expect(
        hasAccessibleName,
        `Button at index ${i} has no accessible name. HTML: ${await btn.evaluate((el) => el.outerHTML.slice(0, 120))}`
      ).toBeTruthy()
    }
  })

  // ─── 3. prefers-reduced-motion is respected ───
  test('No CSS animations when prefers-reduced-motion is active', async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // Check grain overlay has no animation
    const grain = page.locator('.grain-overlay')
    if (await grain.isVisible()) {
      const animDuration = await grain.evaluate(
        (el) => getComputedStyle(el).animationDuration
      )
      // Should be 0s or 0.01ms (effectively none)
      const ms = parseFloat(animDuration)
      expect(ms).toBeLessThanOrEqual(0.01)
    }

    // Verify the universal rule applies: pick any animated element
    const anyAnimated = await page.evaluate(() => {
      const all = document.querySelectorAll('*')
      for (const el of all) {
        const style = getComputedStyle(el)
        const dur = parseFloat(style.animationDuration)
        const transDur = parseFloat(style.transitionDuration)
        // Allow 0s and 0.01ms, flag anything above
        if (dur > 0.02 || transDur > 0.02) {
          return { tag: el.tagName, class: el.className, animDur: style.animationDuration, transDur: style.transitionDuration }
        }
      }
      return null
    })

    expect(
      anyAnimated,
      `Element with active animation/transition found despite reduced-motion: ${JSON.stringify(anyAnimated)}`
    ).toBeNull()
  })

  // ─── 4. Focus ring visible on interactive elements ───
  test('Focus ring visible on interactive elements', async ({ page }) => {
    await page.goto('/')

    // Tab to the skip link first
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a.skip-link').first()
    await expect(skipLink).toBeFocused({ timeout: 5_000 })

    const outline = await skipLink.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor,
      }
    })

    // Should have a visible outline (not 'none', width > 0)
    expect(outline.outlineStyle).not.toBe('none')
    expect(parseFloat(outline.outlineWidth)).toBeGreaterThan(0)

    // Wait for content — either 2D fallback or 3D
    const contentReady = page.locator('text=ANDREA AVILA').first()
    await expect(contentReady).toBeVisible({ timeout: 30_000 })

    // If 3D loaded, enter the experience
    const viewPortfolio = page.locator('text=View portfolio')
    if (await viewPortfolio.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await viewPortfolio.click()
      await page.waitForTimeout(7_000)
    }

    // Tab to an <a> link — :focus-visible activates via keyboard navigation
    // The 2D fallback uses links, not buttons, for navigation
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      const isAppLink = await page.evaluate(() => {
        const el = document.activeElement
        return el?.tagName === 'A' && !el.closest('[data-nextjs-dialog-overlay]')
      })
      if (isAppLink) break
    }

    const focusedLink = page.locator('a:focus')
    await expect(focusedLink.first()).toBeVisible({ timeout: 5_000 })

    const linkOutline = await focusedLink.first().evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      }
    })

    expect(linkOutline.outlineStyle).not.toBe('none')
    expect(parseFloat(linkOutline.outlineWidth)).toBeGreaterThan(0)
  })

  // ─── 5. Minimum color contrast ───
  test('Key text elements meet minimum contrast', async ({ page }) => {
    await page.goto('/')

    // Check primary text (#1A1A1A) on background (#F2F0ED)
    // WCAG AA requires 4.5:1 for normal text
    const contrast = await page.evaluate(() => {
      function relativeLuminance(r: number, g: number, b: number) {
        const [rs, gs, bs] = [r, g, b].map((c) => {
          const s = c / 255
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
      }

      function contrastRatio(l1: number, l2: number) {
        const lighter = Math.max(l1, l2)
        const darker = Math.min(l1, l2)
        return (lighter + 0.05) / (darker + 0.05)
      }

      function parseColor(color: string): [number, number, number] | null {
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (!match) return null
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
      }

      const body = document.body
      const bgColor = getComputedStyle(body).backgroundColor
      const textColor = getComputedStyle(body).color

      const bg = parseColor(bgColor)
      const fg = parseColor(textColor)

      if (!bg || !fg) return { ratio: 0, bg: bgColor, fg: textColor }

      const bgL = relativeLuminance(...bg)
      const fgL = relativeLuminance(...fg)
      return { ratio: contrastRatio(bgL, fgL), bg: bgColor, fg: textColor }
    })

    // WCAG AA minimum for normal text
    expect(contrast.ratio).toBeGreaterThanOrEqual(4.5)
  })

  // ─── 6. No keyboard traps ───
  test('No keyboard traps — Tab traverses all focusable elements', async ({ page }) => {
    await page.goto('/')

    // Collect focusable elements by tabbing through
    const maxTabs = 50
    const visited: string[] = []

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press('Tab')

      const activeInfo = await page.evaluate(() => {
        const el = document.activeElement
        if (!el || el === document.body) return 'body'
        const tag = el.tagName.toLowerCase()
        const id = el.id ? `#${el.id}` : ''
        const cls = el.className ? `.${String(el.className).split(' ')[0]}` : ''
        const label = el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 20) || ''
        return `${tag}${id}${cls}[${label}]`
      })

      // If we've returned to body or the same element repeats too many times, we've cycled
      if (activeInfo === 'body') break

      visited.push(activeInfo)

      // Detect trap: same element 3 times in a row
      if (visited.length >= 3) {
        const last3 = visited.slice(-3)
        const trapped = last3.every((v) => v === last3[0])
        expect(
          trapped,
          `Keyboard trap detected: focus stuck on ${last3[0]}`
        ).toBe(false)
      }
    }

    // Should have visited at least the skip-link
    expect(visited.length).toBeGreaterThan(0)
  })

  // ─── 7. Heading hierarchy ───
  test('Heading hierarchy is correct — h1 before h2, no skipped levels', async ({ page }) => {
    await page.goto('/')

    // Wait for content — either 2D fallback or 3D loading screen
    const contentReady = page.locator('text=ANDREA AVILA').first()
    await expect(contentReady).toBeVisible({ timeout: 30_000 })

    // If 3D loaded, enter the experience
    const viewPortfolio = page.locator('text=View portfolio')
    if (await viewPortfolio.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await viewPortfolio.click()
      await page.waitForTimeout(7_000)
    }

    const headings = await page.evaluate(() => {
      const all = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      return Array.from(all)
        .filter((el) => {
          const style = getComputedStyle(el)
          return style.display !== 'none' && style.visibility !== 'hidden'
        })
        .map((el) => ({
          level: parseInt(el.tagName.replace('H', '')),
          text: el.textContent?.trim().slice(0, 40) ?? '',
        }))
    })

    expect(headings.length).toBeGreaterThan(0)

    // First heading should be h1
    expect(headings[0].level).toBe(1)

    // No level should jump by more than 1 (e.g. h1 → h3 is invalid)
    for (let i = 1; i < headings.length; i++) {
      const jump = headings[i].level - headings[i - 1].level
      expect(
        jump,
        `Heading hierarchy skip: h${headings[i - 1].level} ("${headings[i - 1].text}") → h${headings[i].level} ("${headings[i].text}")`
      ).toBeLessThanOrEqual(1)
    }
  })
})
