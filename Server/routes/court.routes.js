const express = require('express');
const CourtController = require('../controllers/court.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.post('/', auth('admin'), upload.single('image'), CourtController.createCourt);
router.put('/:id', auth('admin'), upload.single('image'), CourtController.updateCourt);
router.delete('/:id', auth('admin'), CourtController.deleteCourt);
router.post('/:id/closed-date', auth('admin'), CourtController.addClosedDate);

router.get('/', CourtController.getCourts);
router.get('/:id', CourtController.getCourt);

module.exports = router;
