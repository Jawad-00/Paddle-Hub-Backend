const express = require('express');
const BookingController = require('../controllers/booking.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', auth(['user', 'admin']), BookingController.create);
router.get('/my', auth(['user', 'admin']), BookingController.myBookings);
router.patch('/:id/cancel', auth(['user', 'admin']), BookingController.cancel);
router.patch('/:id/reschedule', auth(['user', 'admin']), BookingController.reschedule);

router.get('/', auth('admin'), BookingController.all);

module.exports = router;
