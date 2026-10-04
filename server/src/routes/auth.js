const express = require('express')
const { loginAdmin, loginUser, logout, registerUser } = require('../controllers/authController')
const { authenticate } = require('../middleware/requireAuth')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/admin/login', loginAdmin)
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