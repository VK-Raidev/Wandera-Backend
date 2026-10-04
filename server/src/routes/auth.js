const express = require('express')
const { rateLimit } = require('express-rate-limit')
const { loginAdmin, loginUser, logout, registerUser } = require('../controllers/authController')
const { authenticate } = require('../middleware/requireAuth')
const { createAccountLoginRateLimit } = require('../middleware/authRateLimit')

const router = express.Router()
const registrationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many registration attempts. Try again in 15 minutes.' },
})
const accountLoginRateLimit = createAccountLoginRateLimit()

router.post('/register', registrationRateLimit, registerUser)
router.post('/login', accountLoginRateLimit, loginUser)
router.post('/admin/login', accountLoginRateLimit, loginAdmin)
router.post('/logout', logout)
router.get('/me', async (request, response) => {
  const user = await authenticate(request, response)
  if (!user) return
  return response.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
})

module.exports = router