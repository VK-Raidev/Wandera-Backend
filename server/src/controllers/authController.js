const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const sessionCookieName = 'wandera_session'
const sessionDurationMs = 60 * 60 * 1000

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

function setSessionCookie(response, user) {
  response.cookie(sessionCookieName, createToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionDurationMs,
  })
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role }
}

function validateCredentials(email, password, response) {
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    response.status(400).json({ error: 'A valid email address is required' })
    return null
  }
  if (typeof password !== 'string' || password.length < 8) {
    response.status(400).json({ error: 'Password must be at least 8 characters' })
    return null
  }
  return normalizedEmail
}

async function registerUser(request, response) {
  const { name, email, password } = request.body || {}
  const normalizedEmail = validateCredentials(email, password, response)
  const normalizedName = typeof name === 'string' ? name.trim() : ''

  if (!normalizedEmail) return
  if (!normalizedName || normalizedName.length > 100) {
    return response.status(400).json({ error: 'Name is required and must be 100 characters or fewer' })
  }
  if (!process.env.JWT_SECRET) {
    return response.status(503).json({ error: 'Authentication is not configured' })
  }

  try {
    const user = await User.create({ name: normalizedName, email: normalizedEmail, password, role: 'user' })
    setSessionCookie(response, user)
    return response.status(201).json({ user: publicUser(user) })
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({ error: 'An account with this email already exists' })
    }
    throw error
  }
}

async function login(request, response, requiredRole) {
  const { email, password } = request.body || {}
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!normalizedEmail || typeof password !== 'string') {
    return response.status(400).json({ error: 'Email and password are required' })
  }
  if (!process.env.JWT_SECRET) {
    return response.status(503).json({ error: 'Authentication is not configured' })
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+password')
  if (!user || user.role !== requiredRole || !(await bcrypt.compare(password, user.password))) {
    return response.status(401).json({ error: 'Invalid email or password' })
  }

  setSessionCookie(response, user)
  return response.json({ user: publicUser(user) })
}

async function loginUser(request, response) {
  return login(request, response, 'user')
}

async function loginAdmin(request, response) {
  return login(request, response, 'admin')
}

function logout(_request, response) {
  response.clearCookie(sessionCookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  return response.status(204).end()
}

module.exports = { loginAdmin, loginUser, logout, registerUser }