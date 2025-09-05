const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
    date: { type: Date, required: true },           // date (no time component)
    startTime: { type: String, required: true },    // "HH:mm" 24h
    endTime: { type: String, required: true },      // "HH:mm" 24h
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' }
  },
  { timestamps: true }
);

// helpful compound index to speed up conflict checks
BookingSchema.index({ court: 1, date: 1, startTime: 1, endTime: 1, status: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
