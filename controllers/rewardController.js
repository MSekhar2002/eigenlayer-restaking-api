const Reward = require('../models/reward');

exports.getRewardsByAddress = async (req, res, next) => {
  try {
    const { address } = req.params;
    const rewards = await Reward.findOne({ walletAddress: address.toLowerCase() });
    
    if (!rewards) {
      return res.status(404).json({
        success: false,
        error: 'No rewards found for this address'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rewards
    });
  } catch (err) {
    next(err);
  }
}; 