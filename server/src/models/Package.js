const mongoose = require('mongoose')

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false },
)

const packageCategories = ['Mountains', 'Beaches', 'Religious', 'Adventure', 'Family', 'Couple']

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    overview: { type: String, trim: true, default: '' },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
      index: true,
    },
    duration: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    hotels: { type: [String], default: [] },
    transport: { type: String, trim: true, default: '' },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    importantInformation: { type: [String], default: [] },
    cancellationPolicy: { type: String, trim: true, default: '' },
    itinerary: { type: [itineraryDaySchema], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    images: { type: [String], default: [] },
    categories: { type: [{ type: String, enum: packageCategories }], default: [] },
    type: { type: String, enum: ['domestic', 'international'], required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.models.Package || mongoose.model('Package', packageSchema)