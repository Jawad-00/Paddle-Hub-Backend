const BookingService = require('../services/booking.service');

class BookingController {
  static async create(req, res) {
    try {
      const { courtId, date, startTime, endTime } = req.body;
      const booking = await BookingService.createBooking({
        userId: req.user.id,          // from auth middleware
        courtId,
        date,
        startTime,
        endTime
      });
      res.status(201).json({ message: 'Booking created', booking });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async myBookings(req, res) {
    try {
      const { from, to } = req.query;
      const bookings = await BookingService.getMyBookings(req.user.id, { from, to });
      res.json(bookings);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async all(req, res) {
    try {
      const { courtId, from, to, status } = req.query;
      const bookings = await BookingService.getAllBookings({ courtId, from, to, status });
      res.json(bookings);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async cancel(req, res) {
    try {
      const booking = await BookingService.cancelBooking({
        bookingId: req.params.id,
        requester: req.user
      });
      res.json({ message: 'Booking cancelled', booking });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async reschedule(req, res) {
    try {
      const { date, startTime, endTime } = req.body;
      const booking = await BookingService.rescheduleBooking({
        bookingId: req.params.id,
        requester: req.user,
        date,
        startTime,
        endTime
      });
      res.json({ message: 'Booking rescheduled', booking });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = BookingController;
