const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const { validateRewardAddress, handleValidationErrors } = require('../middleware/validation');

router.get('/:address', validateRewardAddress, handleValidationErrors, rewardController.getRewardsByAddress);

module.exports = router; 