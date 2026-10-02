const express = require('express')
const requireAdmin = require('../middleware/requireAdmin')
const {
  createDestination,
  createPackage,
  createTestimonial,
  deletePackage,
  deleteTestimonial,
  getAdminDestinations,
  getAdminInquiries,
  getAdminPackages,
  getAdminTestimonials,
  updateDestination,
  updateInquiryStatus,
  updatePackage,
  updateTestimonial,
} = require('../controllers/adminController')

const router = express.Router()

router.use(requireAdmin)
router.get('/me', (request, response) => {
  response.json({
    user: {
      id: request.user._id,
      email: request.user.email,
      role: request.user.role,
    },
  })
})
router.get('/inquiries', getAdminInquiries)
router.patch('/inquiries/:id', updateInquiryStatus)
router.route('/packages').get(getAdminPackages).post(createPackage)
router.route('/packages/:id').put(updatePackage).delete(deletePackage)
router.route('/destinations').get(getAdminDestinations).post(createDestination)
router.put('/destinations/:id', updateDestination)
router.route('/testimonials').get(getAdminTestimonials).post(createTestimonial)
router.route('/testimonials/:id').put(updateTestimonial).delete(deleteTestimonial)

module.exports = router