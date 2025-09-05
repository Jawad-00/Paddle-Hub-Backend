const Booking = require('../models/Booking');
const Court = require('../models/Court');
const { hhmmToMinutes, rangesOverlap, toYMD } = require('../utils/time');

class BookingService {
      static async createBooking({ userId, courtId, date, startTime, endTime }) {
    if (!userId || !courtId || !date || !startTime || !endTime) {
      throw new Error('Missing required fields');
    }

    const startMin = hhmmToMinutes(startTime);
    const endMin = hhmmToMinutes(endTime);
    if (isNaN(startMin) || isNaN(endMin) || startMin >= endMin) {
      throw new Error('Invalid time range');
    }

    const court = await Court.findById(courtId);
    if (!court) throw new Error('Court not found');

    if (court.status !== 'available') {
      throw new Error(`Court is not available (status: ${court.status})`);
    }

    const ymd = toYMD(date);
    const isClosedDay = (court.closedDates || []).some(cd => toYMD(cd.date) === ymd);
    if (isClosedDay) throw new Error('Court is closed on this date');

    const openMin = hhmmToMinutes(court.openingHour || '08:00');
    const closeMin = hhmmToMinutes(court.closingHour || '22:00');
    if (startMin < openMin || endMin > closeMin) {
      throw new Error(`Booking must be within ${court.openingHour}-${court.closingHour}`);
    }

    const existing = await Booking.find({
      court: courtId,
      date: new Date(ymd),
      status: 'booked'
    });

    const overlap = existing.some(b => {
      const bStart = hhmmToMinutes(b.startTime);
      const bEnd = hhmmToMinutes(b.endTime);
      return rangesOverlap(startMin, endMin, bStart, bEnd);
    });

    if (overlap) throw new Error('Timeslot already booked');

    const booking = await Booking.create({
      user: userId,
      court: courtId,
      date: new Date(ymd),
      startTime,
      endTime,
      status: 'booked'
    });

    return booking.populate([{ path: 'user', select: 'email phone role' }, { path: 'court' }]);
  }
  static async createBooking({ userId, courtId, date, startTime, endTime }) {
    // basic validations
    if (!userId || !courtId || !date || !startTime || !endTime) {
      throw new Error('Missing required fields');
    }

    const startMin = hhmmToMinutes(startTime);
    const endMin = hhmmToMinutes(endTime);
    if (isNaN(startMin) || isNaN(endMin) || startMin >= endMin) {
      throw new Error('Invalid time range');
    }

    // check court exists
    const court = await Court.findById(courtId);
    if (!court) throw new Error('Court not found');

    // court status must be available
    if (court.status !== 'available') {
      throw new Error(`Court is not available (status: ${court.status})`);
    }

    // check closed dates (match by Y-M-D)
    const ymd = toYMD(date);
    const isClosedDay = (court.closedDates || []).some(cd => toYMD(cd.date) === ymd);
    if (isClosedDay) throw new Error('Court is closed on this date');

    // respect opening/closing hours
    const openMin = hhmmToMinutes(court.openingHour || '08:00');
    const closeMin = hhmmToMinutes(court.closingHour || '22:00');
    if (startMin < openMin || endMin > closeMin) {
      throw new Error(`Booking must be within ${court.openingHour}-${court.closingHour}`);
    }

    // conflict check (same court, same date, overlapping time, status booked)
    const existing = await Booking.find({
      court: courtId,
      date: new Date(ymd), // date normalized to day boundary
      status: 'booked'
    });

    const overlap = existing.some(b => {
      const bStart = hhmmToMinutes(b.startTime);
      const bEnd = hhmmToMinutes(b.endTime);
      return rangesOverlap(startMin, endMin, bStart, bEnd);
    });

    if (overlap) throw new Error('Timeslot already booked');

    // create booking
    const booking = await Booking.create({
      user: userId,
      court: courtId,
      date: new Date(ymd),
      startTime,
      endTime,
      status: 'booked'
    });

    return booking.populate([{ path: 'user', select: 'email phone role' }, { path: 'court' }]);
  }
  static async createBooking({ userId, courtId, date, startTime, endTime }) {
    // basic validations
    if (!userId || !courtId || !date || !startTime || !endTime) {
      throw new Error('Missing required fields');
    }

    const startMin = hhmmToMinutes(startTime);
    const endMin = hhmmToMinutes(endTime);
    if (isNaN(startMin) || isNaN(endMin) || startMin >= endMin) {
      throw new Error('Invalid time range');
    }

    // check court exists
    const court = await Court.findById(courtId);
    if (!court) throw new Error('Court not found');

    // court status must be available
    if (court.status !== 'available') {
      throw new Error(`Court is not available (status: ${court.status})`);
    }

    // check closed dates (match by Y-M-D)
    const ymd = toYMD(date);
    const isClosedDay = (court.closedDates || []).some(cd => toYMD(cd.date) === ymd);
    if (isClosedDay) throw new Error('Court is closed on this date');

    // respect opening/closing hours
    const openMin = hhmmToMinutes(court.openingHour || '08:00');
    const closeMin = hhmmToMinutes(court.closingHour || '22:00');
    if (startMin < openMin || endMin > closeMin) {
      throw new Error(`Booking must be within ${court.openingHour}-${court.closingHour}`);
    }

    // conflict check (same court, same date, overlapping time, status booked)
    const existing = await Booking.find({
      court: courtId,
      date: new Date(ymd), // date normalized to day boundary
      status: 'booked'
    });

    const overlap = existing.some(b => {
      const bStart = hhmmToMinutes(b.startTime);
      const bEnd = hhmmToMinutes(b.endTime);
      return rangesOverlap(startMin, endMin, bStart, bEnd);
    });

    if (overlap) throw new Error('Timeslot already booked');

    const booking = await Booking.create({
      user: userId,
      court: courtId,
      date: new Date(ymd),
      startTime,
      endTime,
      status: 'booked'
    });

    return booking.populate([{ path: 'user', select: 'email phone role' }, { path: 'court' }]);
  }
  static async getMyBookings(userId, { from, to } = {}) {
    const query = { user: userId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }
    return Booking.find(query).populate('court').sort({ date: 1, startTime: 1 });
  }

    static async getAllBookings({ courtId, from, to, status }) {
    const query = {};
    if (courtId) query.court = courtId;
    if (status) query.status = status;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }
    return Booking.find(query)
      .populate([{ path: 'user', select: 'email phone role' }, { path: 'court' }])
      .sort({ date: 1, startTime: 1 });
  }
   static async cancelBooking({ bookingId, requester }) {
    const booking = await Booking.findById(bookingId).populate('user');
    if (!booking) throw new Error('Booking not found');
    if (booking.status === 'cancelled') return booking;

    // permission: admin or owner
    if (requester.role !== 'admin' && booking.user._id.toString() !== requester.id) {
      throw new Error('Not authorized to cancel this booking');
    }

    booking.status = 'cancelled';
    await booking.save();
    return booking;
  }


}

