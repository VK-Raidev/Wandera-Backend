const { ipKeyGenerator, rateLimit } = require('express-rate-limit')

const defaultWindowMs = 15 * 60 * 1000
const defaultAttemptLimit = 15
const rateLimitMessage = 'Too many failed sign-in attempts for this account. Try again in 15 minutes.'

function createAccountLoginRateLimit({ limit = defaultAttemptLimit, windowMs = defaultWindowMs } = {}) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator(request) {
      const email = typeof request.body?.email === 'string'
        ? request.body.email.trim().toLowerCase().slice(0, 254)
        : ''
      if (email) return `account:${email}`

      const clientIp = request.ip || request.socket.remoteAddress || 'unknown'
      return `missing-account:${ipKeyGenerator(clientIp)}`
    },
    message: { error: rateLimitMessage },
  })
}

module.exports = { createAccountLoginRateLimit }
