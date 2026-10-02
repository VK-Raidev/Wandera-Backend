const Destination = require('../models/Destination')

async function getDestinations(_request, response) {
  const destinations = await Destination.find().sort({ name: 1 }).lean()
  response.status(200).json({ count: destinations.length, data: destinations })
}

async function getDestinationBySlug(request, response) {
  const destination = await Destination.findOne({ slug: request.params.slug }).lean()

  if (!destination) {
    return response.status(404).json({ error: 'Destination not found' })
  }

  return response.status(200).json({ data: destination })
}

module.exports = { getDestinations, getDestinationBySlug }