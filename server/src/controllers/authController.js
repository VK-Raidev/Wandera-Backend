const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

async function registerAdmin(request, response) {
  const { email, password } = request.body || {}
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return response.status(400).json({ error: 'A valid email address is required' })
  }
  if (typeof password !== 'string' || password.length < 8) {
    return response.status(400).json({ error: 'Password must be at least 8 characters' })
  }
  if (!process.env.JWT_SECRET) {
    return response.status(503).json({ error: 'Authentication is not configured' })
  }
  if (await User.exists({})) {
    return response.status(403).json({ error: 'Admin registration is closed' })
  }

  try {
    const user = await User.create({ email: normalizedEmail, password, role: 'admin' })
    return response.status(201).json({
      token: createToken(user),
      user: { id: user._id, email: user.email, role: user.role },
    })
  } catch (error) {
    if (error.code === 11000) {
      return response.status(403).json({ error: 'Admin registration is closed' })
    }
    throw error
  }
}

async function login(request, response) {
  const { email, password } = request.body || {}
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!normalizedEmail || typeof password !== 'string') {
    return response.status(400).json({ error: 'Email and password are required' })
  }
  if (!process.env.JWT_SECRET) {
    return response.status(503).json({ error: 'Authentication is not configured' })
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+password')
  if (!user || user.role !== 'admin' || !(await bcrypt.compare(password, user.password))) {
    return response.status(401).json({ error: 'Invalid email or password' })
  }

  return response.json({
    token: createToken(user),
    user: { id: user._id, email: user.email, role: user.role },
  })
}

module.exports = { login, registerAdmin }