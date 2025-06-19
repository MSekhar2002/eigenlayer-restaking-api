const Validator = require('../models/validator');

exports.getValidators = async (req, res, next) => {
  try {
    const validators = await Validator.find({}).sort({ lastUpdated: -1 });
    
    res.status(200).json({
      success: true,
      count: validators.length,
      data: validators
    });
  } catch (err) {
    next(err);
  }
}; 