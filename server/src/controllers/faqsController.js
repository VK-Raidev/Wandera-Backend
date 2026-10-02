const FAQ = require('../models/FAQ')

async function getFaqs(_request, response) {
  const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 }).lean()
  response.status(200).json({ count: faqs.length, data: faqs })
}

module.exports = { getFaqs }