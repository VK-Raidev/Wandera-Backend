const mongoose = require('mongoose')

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    startingPrice: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true },
)

module.exports = mongoose.models.Destination || mongoose.model('Destination', destinationSchema)