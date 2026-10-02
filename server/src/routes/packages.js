const express = require('express')
const { getPackages, getPackageByIdOrSlug } = require('../controllers/packagesController')

const router = express.Router()

router.get('/', getPackages)
router.get('/:identifier', getPackageByIdOrSlug)

module.exports = router