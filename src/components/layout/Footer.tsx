'use client'

import { useState, FormEvent } from 'react'

type FormState = 'idle' | 'sending' | 'success' | 'error'

const INPUT_BASE: React.CSSProperties = {
  width: '100%',
  background: '#111118',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  color: '#e8e6e3',
  padding: '12px 16px',
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const borderFor = (field: string) => ({
    borderColor: focusedField === field ? '#FF2D9B' : 'rgba(255,255,255,0.1)',
  })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('sending')

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          user_id: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
          template_params: {
            from_name: name,
            from_email: email,
            message,
          },
        }),
      })

      if (res.ok) {
        setFormState('success')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  const buttonLabel =
    formState === 'sending' ? 'Sending...' :
    formState === 'success' ? 'Message sent!' :
    formState === 'error'   ? 'Failed — try again' :
    'Send message'

  const buttonColor =
    formState === 'success' ? '#1db96a' :
    formState === 'error'   ? '#e03e3e' :
    '#FF2D9B'

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Name + Email row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="contact-name" style={{ fontFamily: 'var(--font-code)', fontSize: '15px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            required
            autoComplete="name"
            placeholder="Your name"
            style={{ ...INPUT_BASE, ...borderFor('name') }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="contact-email" style={{ fontFamily: 'var(--font-code)', fontSize: '15px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            style={{ ...INPUT_BASE, ...borderFor('email') }}
          />
        </div>
      </div>

      {/* Message */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="contact-message" style={{ fontFamily: 'var(--font-code)', fontSize: '15px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setFocusedField('message')}
          onBlur={() => setFocusedField(null)}
          required
          rows={5}
          placeholder="Tell me about your project..."
          style={{
            ...INPUT_BASE,
            ...borderFor('message'),
            resize: 'vertical',
            lineHeight: 1.6,
            minHeight: '120px',
          }}
        />
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button
          type="submit"
          disabled={formState === 'sending'}
          style={{
            background: buttonColor,
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            fontFamily: 'var(--font-code)',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: formState === 'sending' ? 'not-allowed' : 'pointer',
            opacity: formState === 'sending' ? 0.7 : 1,
            transition: 'opacity 0.2s, background 0.3s',
          }}
          className="submit-btn"
        >
          {buttonLabel}
        </button>
        {formState === 'error' && (
          <span style={{ fontFamily: 'var(--font-code)', fontSize: '14px', color: '#e03e3e' }}>
            Something went wrong. Try emailing directly.
          </span>
        )}
      </div>
    </form>
  )
}

export function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: '#000',
        padding: 'clamp(64px, 10vh, 120px) clamp(24px, 6vw, 80px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto' }}>
        {/* Blue signal line — connects about to contact */}
        <div style={{
          width: '1px',
          height: '48px',
          background: 'linear-gradient(180deg, transparent, #00E5FF, transparent)',
          margin: '0 auto 32px auto',
          opacity: 0.3,
        }} />

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <span style={{
            fontFamily: 'var(--font-code)', fontSize: '14px', letterSpacing: '0.15em',
            background: 'linear-gradient(90deg, #FF2D9B, #7B2FFF)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
          }}>Contact</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(0,229,255,0.15), rgba(255,255,255,0.06), rgba(0,229,255,0.15))' }} />
        </div>

        {/* CTA as code */}
        <div style={{
          fontFamily: 'var(--font-code)', fontSize: 'clamp(13px, 1.3vw, 16px)',
          lineHeight: 1.8, marginBottom: '32px',
        }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>{'// '}</span>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Looking for internship opportunities in Madrid</span>
          </div>
          <div style={{ marginTop: '4px' }}>
            <span style={{ color: '#7B2FFF' }}>&lt;</span>
            <span style={{ color: '#FF2D9B' }}>a</span>
            <span style={{ color: '#00E5FF' }}> href</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>=</span>
            <a
              href="mailto:andrea15one@icloud.com"
              style={{
                color: '#BEFF00', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              className="email-link"
            >
              &quot;mailto:andrea15one@icloud.com&quot;
            </a>
            <span style={{ color: '#7B2FFF' }}>&gt;</span>
          </div>
          <div style={{ paddingLeft: '20px' }}>
            <span style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1.2, display: 'inline-block', margin: '8px 0' }}>
              Let&apos;s build something.
            </span>
          </div>
          <div>
            <span style={{ color: '#7B2FFF' }}>&lt;/</span>
            <span style={{ color: '#FF2D9B' }}>a</span>
            <span style={{ color: '#7B2FFF' }}>&gt;</span>
          </div>
        </div>

        {/* Social links */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '64px', flexWrap: 'wrap' }}>
          {[
            { label: 'GitHub', href: 'https://github.com/Andreavilaro0' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/andreavilaro0/' },
            { label: 'Email', href: 'mailto:andrea15one@icloud.com' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.label !== 'Email' ? '_blank' : undefined}
              rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
              style={{
                fontFamily: 'var(--font-code)', fontSize: '14px', color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              className="social-link"
            >
              {link.label} ↗
            </a>
          ))}
        </div>

        {/* Divider before form */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '48px' }} />

        {/* Contact form */}
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <span style={{
              fontFamily: 'var(--font-code)', fontSize: '14px', letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
            }}>Send a message</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <ContactForm />
        </div>

        {/* Footer bottom bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
          paddingTop: '48px', marginTop: '64px', borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          <span style={{ fontFamily: 'var(--font-code)', fontSize: '15px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
            Andrea Avila © 2026 — Madrid, Spain
          </span>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-code)', fontSize: '15px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
              React · Three.js · Next.js
            </span>
            <span style={{ fontFamily: 'var(--font-code)', fontSize: '15px', color: '#BEFF00', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Open to work
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .email-link:hover { opacity: 0.7; }
        .submit-btn:hover:not(:disabled) { opacity: 0.8 !important; }
        .social-link:hover { color: #fff !important; border-color: #fff !important; }
      `}</style>
    </footer>
  )
}
