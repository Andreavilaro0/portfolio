import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    viewTransition: true,
  },
  async headers() {
    return [
      {
        source: '/models/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: 'andrea-avila',
  project: 'portfolio-3d',
  silent: true,
  disableServerWebpackPlugin: true,
})
