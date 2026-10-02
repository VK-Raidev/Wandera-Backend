const mongoose = require('mongoose')
const Destination = require('../models/Destination')
const Inquiry = require('../models/Inquiry')
const Package = require('../models/Package')

async function createInquiry(request, response) {
  const { name, phone, email, destination, travelDate, travelers, budget, message, packageId } =
    request.body || {}

  if (!name || !phone || !email || !destination || !travelDate || travelers === undefined) {
    return response.status(400).json({ error: 'Name, phone, email, destination, travelDate, and travelers are required' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return response.status(400).json({ error: 'A valid email address is required' })
  }

  if (!Number.isInteger(Number(travelers)) || Number(travelers) < 1) {
    return response.status(400).json({ error: 'travelers must be a positive whole number' })
  }

  if (Number.isNaN(Date.parse(travelDate))) {
    return response.status(400).json({ error: 'travelDate must be a valid date' })
  }

  if (budget !== undefined && (!Number.isFinite(Number(budget)) || Number(budget) < 0)) {
    return response.status(400).json({ error: 'budget must be a non-negative number' })
  }

  let destinationDocument
  if (mongoose.isObjectIdOrHexString(destination)) {
    destinationDocument = await Destination.findById(destination).select('_id')
  } else {
    destinationDocument = await Destination.findOne({ slug: String(destination).trim() }).select('_id')
  }

  if (!destinationDocument) {
    return response.status(404).json({ error: 'Destination not found' })
  }

  let packageDocument
  if (packageId !== undefined && packageId !== '') {
    if (!mongoose.isObjectIdOrHexString(packageId)) {
      return response.status(400).json({ error: 'packageId must be a valid package ID' })
    }
    packageDocument = await Package.findById(packageId).select('_id destination')
    if (!packageDocument) {
      return response.status(404).json({ error: 'Package not found' })
    }
    if (!packageDocument.destination.equals(destinationDocument._id)) {
      return response.status(400).json({ error: 'Package does not belong to the selected destination' })
    }
  }

  const inquiry = await Inquiry.create({
    name,
    phone,
    email,
    destination: destinationDocument._id,
    travelDate,
    travelers: Number(travelers),
    ...(budget !== undefined && { budget: Number(budget) }),
    message,
    ...(packageDocument && { packageId: packageDocument._id }),
  })

  return response.status(201).json({ message: 'Inquiry submitted successfully', data: inquiry })
}

module.exports = { createInquiry }