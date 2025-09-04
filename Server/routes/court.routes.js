const express = require('express');
const CourtController = require('../controllers/court.controller');

const router = express.Router();

// Admin actions
router.post('/', CourtController.createCourt);
router.put('/:id', CourtController.updateCourt);
router.delete('/:id', CourtController.deleteCourt);
router.post('/:id/closed-date', CourtController.addClosedDate);

// Public actions
router.get('/', CourtController.getCourts);
router.get('/:id', CourtController.getCourt);

module.exports = router;
