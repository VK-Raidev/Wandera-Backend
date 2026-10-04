const jwt = require('jsonwebtoken')
const User = require('../models/User')

function getToken(request) {
  const authorization = request.get('authorization') || ''
  const [scheme, bearerToken] = authorization.split(' ')
  if (scheme === 'Bearer' && bearerToken) return bearerToken

  const cookieHeader = request.get('cookie') || ''
  const match = cookieHeader.match(/(?:^|;\s*)wandera_session=([^;]+)/)
  return match ? match[1] : ''
}

async function authenticate(request, response) {
  const token = getToken(request)
  if (!token) {
    response.status(401).json({ error: 'Sign in is required' })
    return null
  }
  if (!process.env.JWT_SECRET) {
    response.status(503).json({ error: 'Authentication is not configured' })
    return null
  }

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    response.status(401).json({ error: 'Invalid or expired session' })
    return null
  }

  const user = await User.findById(payload.sub).select('_id name email role')
  if (!user) {
    response.status(401).json({ error: 'Invalid or expired session' })
    return null
  }

  request.user = user
  return user
}

async function requireAuth(request, response, next) {
  const user = await authenticate(request, response)
  if (!user) return
  return next()
}

module.exports = { authenticate, requireAuth }
