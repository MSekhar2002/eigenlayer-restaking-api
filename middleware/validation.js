const { body, param, validationResult } = require('express-validator');

// Validation rules
const validateAddress = [
  param('address')
    .isEthereumAddress()
    .withMessage('Invalid Ethereum address format')
];

const validateRewardAddress = [
  param('address')
    .isEthereumAddress()
    .withMessage('Invalid Ethereum address format')
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateAddress,
  validateRewardAddress,
  handleValidationErrors
}; 