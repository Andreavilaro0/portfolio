'use client'

import { useState } from 'react'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="max-w-2xl mx-auto px-6 py-20">
      <h2
        className="text-3xl md:text-4xl mb-2 text-center"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)' }}
      >
        Send to the Kitchen
      </h2>
      <p className="text-center mb-10" style={{ color: 'var(--color-cocoa)' }}>
        Got a project idea? Let&apos;s cook something together.
      </p>

      {submitted ? (
        <div className="glass-card p-8 text-center">
          <p className="text-xl mb-2" style={{ color: 'var(--color-sage-green)' }}>
            Order received!
          </p>
          <p style={{ color: 'var(--color-cocoa)' }}>
            Andrea will reply within 24 hours.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
          className="glass-card p-8 space-y-6"
        >
          {/* Honeypot */}
          <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label htmlFor="name" className="label block mb-1.5">
              Your name, chef
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full h-12 px-4 rounded-lg border focus:ring-2"
              style={{
                backgroundColor: 'var(--color-flour-white)',
                borderColor: 'var(--color-steam-grey)',
                color: 'var(--color-espresso)',
              }}
            />
          </div>

          <div>
            <label htmlFor="email" className="label block mb-1.5">
              Your email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full h-12 px-4 rounded-lg border focus:ring-2"
              style={{
                backgroundColor: 'var(--color-flour-white)',
                borderColor: 'var(--color-steam-grey)',
                color: 'var(--color-espresso)',
              }}
            />
          </div>

          <div>
            <label htmlFor="message" className="label block mb-1.5">
              What are we cooking?
            </label>
            <textarea
              id="message"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 resize-none"
              style={{
                backgroundColor: 'var(--color-flour-white)',
                borderColor: 'var(--color-steam-grey)',
                color: 'var(--color-espresso)',
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-lg font-semibold text-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: 'var(--color-terracotta)',
              color: 'var(--color-warm-white)',
            }}
          >
            Send to the Kitchen
          </button>
        </form>
      )}
    </section>
  )
}
