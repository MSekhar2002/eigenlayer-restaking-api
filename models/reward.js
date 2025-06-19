const mongoose = require('mongoose');

const RewardBreakdownSchema = new mongoose.Schema({
  operatorAddress: { type: String, required: true },
  amountStETH: { type: String, required: true },
  timestamps: [{ type: Number }]
}, { _id: false });

const RewardSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, index: true },
  totalRewardsReceivedStETH: { type: String, required: true },
  rewardsBreakdown: [RewardBreakdownSchema],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reward', RewardSchema); 