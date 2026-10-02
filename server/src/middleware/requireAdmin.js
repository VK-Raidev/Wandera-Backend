const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function requireAdmin(request, response, next) {
  const authorization = request.get('authorization') || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ error: 'A valid bearer token is required' })
  }
  if (!process.env.JWT_SECRET) {
    return response.status(503).json({ error: 'Authentication is not configured' })
  }

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return response.status(401).json({ error: 'Invalid or expired token' })
  }

  const user = await User.findById(payload.sub).select('_id email role')
  if (!user || user.role !== 'admin') {
    return response.status(403).json({ error: 'Admin access is required' })
  }

  request.user = user
  return next()
}

module.exports = requireAdmin