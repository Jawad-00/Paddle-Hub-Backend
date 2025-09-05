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

}

