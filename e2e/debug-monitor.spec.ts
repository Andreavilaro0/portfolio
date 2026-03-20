import { test, expect } from '@playwright/test'

test('Debug: inspect monitor HTML content', async ({ page }) => {
  const logs: string[] = []
  page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`))

  await page.goto('/')

  // Wait for loading screen
  const viewBtn = page.locator('text=View portfolio')
  const hasViewBtn = await viewBtn.isVisible({ timeout: 15_000 }).catch(() => false)

  if (!hasViewBtn) {
    // 2D fallback path — no 3D loading screen
    console.log('2D fallback detected, skipping 3D debug')
    return
  }

  await page.click('text=View portfolio')

  // Wait for intro to complete and seated mode
  await page.waitForTimeout(7_000)

  // 1. Check if monitor-scroll div exists
  const scrollDiv = page.locator('.monitor-scroll')
  const scrollCount = await scrollDiv.count()
  console.log(`monitor-scroll divs: ${scrollCount}`)

  // 2. Get computed styles of the MonitorPortfolio container
  if (scrollCount > 0) {
    const styles = await scrollDiv.first().evaluate((el) => {
      const child = el.firstElementChild as HTMLElement
      if (!child) return 'no child element'
      const cs = window.getComputedStyle(child)
      return JSON.stringify({
        width: cs.width,
        height: cs.height,
        color: cs.color,
        background: cs.backgroundColor,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        overflow: cs.overflow,
        display: cs.display,
        visibility: cs.visibility,
        opacity: cs.opacity,
        innerText: child.innerText?.substring(0, 200),
        childCount: child.children.length,
      })
    })
    console.log(`MonitorPortfolio computed styles: ${styles}`)
  }

  // 3. Check CSS variable availability
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement
    const cs = window.getComputedStyle(root)
    return JSON.stringify({
      '--color-text': cs.getPropertyValue('--color-text'),
      '--color-bg': cs.getPropertyValue('--color-bg'),
      '--color-pink': cs.getPropertyValue('--color-pink'),
      '--font-display': cs.getPropertyValue('--font-display'),
      '--font-body': cs.getPropertyValue('--font-body'),
      '--font-code': cs.getPropertyValue('--font-code'),
    })
  })
  console.log(`CSS variables on :root: ${cssVars}`)

  // 4. Screenshot
  await page.screenshot({
    path: 'e2e/screenshots/debug-monitor-full.png',
    fullPage: false,
  })

  // 5. Check console errors
  const errors = logs.filter(l => l.startsWith('[error]'))
  console.log(`Console errors: ${errors.length}`)
  errors.forEach(e => console.log(`  ${e}`))
})
