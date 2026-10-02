const mongoose = require('mongoose')
const Destination = require('../models/Destination')
const Package = require('../models/Package')

const categoryAliases = {
  mountains: 'Mountain',
  mountain: 'Mountain',
  beaches: 'Beach',
  beach: 'Beach',
  'hill stations': 'Hill station',
  'hill-stations': 'Hill station',
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function getPackages(request, response) {
  const query = {}
  const { category } = request.query
  const type = request.query.type?.toLowerCase()

  if (type) {
    if (!['domestic', 'international'].includes(type)) {
      return response.status(400).json({ error: 'type must be domestic or international' })
    }
    query.type = type
  }

  if (category) {
    const normalizedCategory = categoryAliases[category.trim().toLowerCase()] || category.trim()
    const destinationIds = await Destination.find({
      category: new RegExp(`^${escapeRegex(normalizedCategory)}$`, 'i'),
    }).distinct('_id')
    query.destination = { $in: destinationIds }
  }

  const packages = await Package.find(query)
    .populate('destination', 'name slug image category description')
    .sort({ price: 1 })
    .lean()

  return response.status(200).json({ count: packages.length, data: packages })
}

async function getPackageByIdOrSlug(request, response) {
  const { identifier } = request.params
  let travelPackage

  if (mongoose.isObjectIdOrHexString(identifier)) {
    travelPackage = await Package.findById(identifier)
      .populate('destination', 'name slug image category description')
      .lean()
  } else {
    const title = identifier.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
    travelPackage = await Package.findOne({
      title: new RegExp(`^${escapeRegex(title)}$`, 'i'),
    })
      .populate('destination', 'name slug image category description')
      .lean()
  }

  if (!travelPackage) {
    return response.status(404).json({ error: 'Package not found' })
  }

  return response.status(200).json({ data: travelPackage })
}

module.exports = { getPackages, getPackageByIdOrSlug }