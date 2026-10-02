const Destination = require('../models/Destination')
const Inquiry = require('../models/Inquiry')
const Package = require('../models/Package')
const Testimonial = require('../models/Testimonial')

const packageFields = [
  'title', 'overview', 'destination', 'duration', 'price', 'hotels', 'transport',
  'inclusions', 'exclusions', 'importantInformation', 'cancellationPolicy',
  'itinerary', 'rating', 'images', 'categories', 'type',
]
const destinationFields = ['name', 'slug', 'description', 'image', 'startingPrice', 'duration', 'category']
const testimonialFields = ['name', 'location', 'message', 'rating', 'image']

function pickFields(body, fields) {
  return Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]))
}

async function getAdminInquiries(_request, response) {
  const inquiries = await Inquiry.find()
    .populate('destination', 'name slug')
    .populate('packageId', 'title')
    .sort({ createdAt: -1 })
    .lean()
  return response.json({ count: inquiries.length, data: inquiries })
}

async function updateInquiryStatus(request, response) {
  const inquiry = await Inquiry.findByIdAndUpdate(
    request.params.id,
    { status: request.body?.status },
    { returnDocument: 'after', runValidators: true },
  )
    .populate('destination', 'name slug')
    .populate('packageId', 'title')

  if (!inquiry) return response.status(404).json({ error: 'Inquiry not found' })
  return response.json({ data: inquiry })
}

async function getAdminPackages(_request, response) {
  const packages = await Package.find()
    .populate('destination', 'name slug')
    .sort({ updatedAt: -1 })
    .lean()
  return response.json({ count: packages.length, data: packages })
}

async function createPackage(request, response) {
  const travelPackage = await Package.create(pickFields(request.body || {}, packageFields))
  await travelPackage.populate('destination', 'name slug')
  return response.status(201).json({ data: travelPackage })
}

async function updatePackage(request, response) {
  const travelPackage = await Package.findByIdAndUpdate(
    request.params.id,
    pickFields(request.body || {}, packageFields),
    { returnDocument: 'after', runValidators: true },
  ).populate('destination', 'name slug')

  if (!travelPackage) return response.status(404).json({ error: 'Package not found' })
  return response.json({ data: travelPackage })
}

async function deletePackage(request, response) {
  const travelPackage = await Package.findByIdAndDelete(request.params.id)
  if (!travelPackage) return response.status(404).json({ error: 'Package not found' })
  return response.json({ message: 'Package deleted' })
}

async function getAdminDestinations(_request, response) {
  const destinations = await Destination.find().sort({ name: 1 }).lean()
  return response.json({ count: destinations.length, data: destinations })
}

async function createDestination(request, response) {
  const destination = await Destination.create(pickFields(request.body || {}, destinationFields))
  return response.status(201).json({ data: destination })
}

async function updateDestination(request, response) {
  const destination = await Destination.findByIdAndUpdate(
    request.params.id,
    pickFields(request.body || {}, destinationFields),
    { returnDocument: 'after', runValidators: true },
  )

  if (!destination) return response.status(404).json({ error: 'Destination not found' })
  return response.json({ data: destination })
}

async function getAdminTestimonials(_request, response) {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean()
  return response.json({ count: testimonials.length, data: testimonials })
}

async function createTestimonial(request, response) {
  const testimonial = await Testimonial.create(pickFields(request.body || {}, testimonialFields))
  return response.status(201).json({ data: testimonial })
}

async function updateTestimonial(request, response) {
  const testimonial = await Testimonial.findByIdAndUpdate(
    request.params.id,
    pickFields(request.body || {}, testimonialFields),
    { returnDocument: 'after', runValidators: true },
  )

  if (!testimonial) return response.status(404).json({ error: 'Testimonial not found' })
  return response.json({ data: testimonial })
}

async function deleteTestimonial(request, response) {
  const testimonial = await Testimonial.findByIdAndDelete(request.params.id)
  if (!testimonial) return response.status(404).json({ error: 'Testimonial not found' })
  return response.json({ message: 'Testimonial deleted' })
}

module.exports = {
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
}