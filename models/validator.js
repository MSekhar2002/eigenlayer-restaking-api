const mongoose = require('mongoose');

const SlashHistorySchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  amountStETH: { type: String, required: true },
  reason: { type: String }
}, { _id: false });

const ValidatorSchema = new mongoose.Schema({
  operatorAddress: { type: String, required: true, index: true },
  totalDelegatedStakeStETH: { type: String, required: true },
  slashHistory: [SlashHistorySchema],
  status: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Validator', ValidatorSchema); 