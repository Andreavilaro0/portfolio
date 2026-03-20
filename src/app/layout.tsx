import type { Metadata } from 'next'
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Andrea Avila — Developer',
  description:
    'Full stack developer based in Madrid. Building with React, Python, Three.js — turning ideas into experiences.',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Andrea Avila — Developer',
    description:
      'Full stack developer portfolio by Andrea Avila. Projects in AI, robotics, photography, and systems.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        {/* Film grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
