const { authenticate } = require('./requireAuth')

async function requireAdmin(request, response, next) {
  const user = await authenticate(request, response)
  if (!user) return
  if (user.role !== 'admin') {
    return response.status(403).json({ error: 'Admin access is required' })
  }
  return next()
}

module.exports = requireAdmin
