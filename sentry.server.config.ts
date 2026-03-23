import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NODE_ENV === 'production'
    ? 'https://5c620195a6f64ca5b4b1b1fcc86c6b5a@o4511068665544704.ingest.de.sentry.io/4511068692217936'
    : undefined,

  tracesSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0,
})
