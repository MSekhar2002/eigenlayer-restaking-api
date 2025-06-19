require('dotenv').config();
const connectDB = require('../config');
const {
  fetchRestakersData,
  fetchValidatorsData,
  fetchRewardsData
} = require('../utils/web3Utils');
const Restaker = require('../models/restaker');
const Validator = require('../models/validator');
const Reward = require('../models/reward');

async function updateRestakers() {
  try {
    const restakers = await fetchRestakersData();
    console.log(`Fetched ${restakers.length} restakers`);
    
    // Use bulkWrite for efficient updates
    const bulkOps = restakers.map(restaker => ({
      updateOne: {
        filter: { userAddress: restaker.userAddress },
        update: { $set: restaker },
        upsert: true
      }
    }));
    
    if (bulkOps.length > 0) {
      const result = await Restaker.bulkWrite(bulkOps);
      console.log('Restakers update complete:', result);
    }
  } catch (error) {
    console.error('Error updating restakers:', error);
  }
}

async function updateValidators() {
  try {
    const validators = await fetchValidatorsData();
    console.log(`Fetched ${validators.length} validators`);
    
    const bulkOps = validators.map(validator => ({
      updateOne: {
        filter: { operatorAddress: validator.operatorAddress },
        update: { $set: validator },
        upsert: true
      }
    }));
    
    if (bulkOps.length > 0) {
      const result = await Validator.bulkWrite(bulkOps);
      console.log('Validators update complete:', result);
    }
  } catch (error) {
    console.error('Error updating validators:', error);
  }
}

async function updateRewards() {
  try {
    const rewards = await fetchRewardsData();
    console.log(`Fetched rewards for ${rewards.length} wallets`);
    
    const bulkOps = rewards.map(reward => ({
      updateOne: {
        filter: { walletAddress: reward.walletAddress },
        update: { $set: reward },
        upsert: true
      }
    }));
    
    if (bulkOps.length > 0) {
      const result = await Reward.bulkWrite(bulkOps);
      console.log('Rewards update complete:', result);
    }
  } catch (error) {
    console.error('Error updating rewards:', error);
  }
}

async function updateAllData() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Run all updates in parallel
    await Promise.all([
      updateRestakers(),
      updateValidators(),
      updateRewards()
    ]);
    
    console.log('All data updates complete');
  } catch (error) {
    console.error('Error in data update process:', error);
  }
}

// If running this script directly
if (require.main === module) {
  updateAllData()
    .then(() => {
      console.log('Data fetch and update complete');
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = {
  updateAllData,
  updateRestakers,
  updateValidators,
  updateRewards
}; 