const mongoose = require('mongoose');

const CourtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['available', 'maintenance', 'closed'], default: 'available' },
    image: { type: String },

    openingHour: { type: String, default: "08:00" }, // 8 AM
    closingHour: { type: String, default: "22:00" }, // 10 PM

    closedDates: [
      {
        date: { type: Date, required: true },
        reason: { type: String }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Court', CourtSchema);
