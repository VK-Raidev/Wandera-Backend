const dotenv = require('dotenv')

dotenv.config()

const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const { rateLimit } = require('express-rate-limit')
const destinationsRoutes = require('./routes/destinations')
const packagesRoutes = require('./routes/packages')
const inquiriesRoutes = require('./routes/inquiries')
const testimonialsRoutes = require('./routes/testimonials')
const faqsRoutes = require('./routes/faqs')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler')

const app = express()
const port = Number(process.env.PORT || 5000)
const mongoUri = process.env.MONGO_URI
const jwtSecret = process.env.JWT_SECRET
const allowedOrigins = (process.env.CLIENT_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean)

if (!mongoUri) {
  console.error('MONGO_URI is required')
  process.exit(1)
}
if (!jwtSecret || jwtSecret.length < 32) {
  console.error('JWT_SECRET must be set to a random value at least 32 characters long')
  process.exit(1)
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer between 1 and 65535')
  process.exit(1)
}
if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  console.error('CLIENT_ORIGIN is required in production')
  process.exit(1)
}

if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)

const apiRateLimit = (limit, message) => rateLimit({
  windowMs: 15 * 60 * 1000,
  limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: message },
})
const authRateLimit = apiRateLimit(10, 'Too many authentication attempts. Try again in 15 minutes.')
const inquiryRateLimit = apiRateLimit(20, 'Too many trip requests. Try again in 15 minutes.')

app.use(helmet())
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true)
    const error = new Error('This origin is not allowed to access the API')
    error.statusCode = 403
    return callback(error)
  },
}))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'wanderlust-travels-api' })
})

app.get('/api/test', (_request, response) => {
  response.send('Server is running')
})

app.use('/api/destinations', destinationsRoutes)
app.use('/api/packages', packagesRoutes)
app.use('/api/inquiries', inquiryRateLimit, inquiriesRoutes)
app.use('/api/testimonials', testimonialsRoutes)
app.use('/api/faqs', faqsRoutes)
app.use('/api/auth', authRateLimit, authRoutes)
app.use('/api/admin', adminRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

async function startServer() {
  try {
    await mongoose.connect(mongoUri)
    console.log('MongoDB Connected')
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

startServer()
