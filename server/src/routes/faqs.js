const express = require('express')
const { getFaqs } = require('../controllers/faqsController')

const router = express.Router()

router.get('/', getFaqs)

module.exports = router