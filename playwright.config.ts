import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Sequential — 3D scene needs stable state
  retries: 0,
  timeout: 60_000, // GLB load + WebGL init can be slow
  expect: {
    timeout: 15_000,
  },

  reporter: 'list',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 800 },
  },

  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /portfolio-desktop|ux-heuristics/,
    },
    {
      name: 'desktop-firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /portfolio-desktop|ux-heuristics/,
    },
    {
      name: 'desktop-webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /portfolio-desktop|ux-heuristics/,
    },
    {
      name: 'mobile-iphone',
      use: { ...devices['iPhone 13'] },
      testIgnore: /portfolio-desktop/,
    },
  ],

  webServer: {
    command: 'npm run dev -- --port 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
