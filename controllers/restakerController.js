const Restaker = require('../models/restaker');

exports.getRestakers = async (req, res, next) => {
  try {
    const restakers = await Restaker.find({}).sort({ lastUpdated: -1 });
    
    res.status(200).json({
      success: true,
      count: restakers.length,
      data: restakers
    });
  } catch (err) {
    next(err);
  }
}; 