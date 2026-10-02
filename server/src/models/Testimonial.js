const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    image: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
)

module.exports = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema)