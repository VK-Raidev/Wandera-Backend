const mongoose = require('mongoose')

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    travelDate: { type: Date, required: true },
    travelers: { type: Number, required: true, min: 1 },
    budget: { type: Number, min: 0 },
    message: { type: String, trim: true, default: '' },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'confirmed', 'closed'],
      default: 'pending',
    },
  },
  { timestamps: true },
)

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema)