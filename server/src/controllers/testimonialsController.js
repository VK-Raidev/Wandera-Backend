const Testimonial = require('../models/Testimonial')

async function getTestimonials(_request, response) {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean()
  response.status(200).json({ count: testimonials.length, data: testimonials })
}

module.exports = { getTestimonials }