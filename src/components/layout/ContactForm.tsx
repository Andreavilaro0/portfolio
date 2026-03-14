'use client'

import { useState } from 'react'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="max-w-2xl mx-auto px-6 py-20">
      <h2
        className="text-3xl md:text-4xl mb-2 text-center"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
      >
        Get in Touch
      </h2>
      <p className="text-center mb-10" style={{ color: 'var(--color-muted)' }}>
        Got a project idea? Let&apos;s build something together.
      </p>

      {submitted ? (
        <div className="card p-8 text-center">
          <p className="text-xl mb-2" style={{ color: 'var(--color-pink)' }}>
            Message sent!
          </p>
          <p style={{ color: 'var(--color-muted)' }}>
            Andrea will reply within 24 hours.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
          className="card p-8 space-y-6"
        >
          {/* Honeypot */}
          <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label htmlFor="name" className="label block mb-1.5">
              Your name
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full h-12 px-4 border-3 focus:ring-2"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                borderRadius: '0px',
                borderWidth: '3px',
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
              className="w-full h-12 px-4 border-3 focus:ring-2"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                borderRadius: '0px',
                borderWidth: '3px',
              }}
            />
          </div>

          <div>
            <label htmlFor="message" className="label block mb-1.5">
              Your message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              className="w-full px-4 py-3 border-3 focus:ring-2 resize-none"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                borderRadius: '0px',
                borderWidth: '3px',
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 font-semibold text-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: 'var(--color-pink)',
              color: '#fff',
              borderRadius: '0px',
              border: '3px solid var(--color-text)',
              boxShadow: '4px 4px 0px var(--color-text)',
            }}
          >
            Send Message
          </button>
        </form>
      )}
    </section>
  )
}
