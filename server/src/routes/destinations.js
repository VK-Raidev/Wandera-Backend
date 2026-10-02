const express = require('express')
const { getDestinations, getDestinationBySlug } = require('../controllers/destinationsController')

const router = express.Router()

router.get('/', getDestinations)
router.get('/:slug', getDestinationBySlug)

module.exports = router