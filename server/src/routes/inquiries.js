const express = require('express')
const { createInquiry } = require('../controllers/inquiriesController')

const router = express.Router()

router.post('/', createInquiry)

module.exports = router