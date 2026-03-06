'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
    },
  }),
}

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden" aria-label="Hero — Andrea's Kitchen">
      <a href="#projects" className="skip-link">
        Skip to projects
      </a>

      {/* Wood grain counter strip with bottom fade */}
      <div className="relative">
        <div className="wood-grain h-[200px] w-full" />
        <div
          className="absolute bottom-0 left-0 w-full h-16"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, var(--color-cream) 100%)',
          }}
        />
      </div>

      {/* Hero content */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-5xl md:text-7xl lg:text-8xl mb-5 leading-[1.1]"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)', fontWeight: 900 }}
        >
          Andrea&apos;s Kitchen
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
          className="text-xl md:text-2xl mb-6"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)', fontWeight: 600 }}
        >
          Recipes for Digital Products
        </motion.p>

        {/* Herb sprig divider — draws on with stroke animation */}
        <motion.svg
          className="mx-auto mb-8"
          width="80"
          height="16"
          viewBox="0 0 80 16"
          fill="none"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.path
            d="M4 8 C20 2, 30 14, 40 8 C50 2, 60 14, 76 8"
            stroke="var(--color-sage-green)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="40"
            cy="8"
            r="2"
            fill="var(--color-sage-green)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.0 }}
          />
        </motion.svg>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ color: 'var(--color-cocoa)' }}
        >
          Full stack developer based in Madrid.
          I take raw ingredients — React, Python, Three.js —
          and turn them into experiences people actually enjoy.
        </motion.p>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="label tracking-widest"
        >
          Browse the menu below.
        </motion.p>

        <motion.svg
          className="mx-auto mt-6"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-steam-grey)"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </motion.svg>
      </div>
    </section>
  )
}
