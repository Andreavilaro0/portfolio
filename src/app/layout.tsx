import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3, Fira_Code } from 'next/font/google'
import '@/styles/globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '900'],
  variable: '--font-display',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Andrea Avila — Portfolio',
  description:
    'Full stack developer based in Madrid. Building with React, Python, Three.js — turning ideas into experiences.',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Andrea Avila — Portfolio',
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
      className={`${playfair.variable} ${sourceSans.variable} ${firaCode.variable}`}
    >
      <body className="antialiased">
        {/* Film grain — Grainy Blur trend */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
