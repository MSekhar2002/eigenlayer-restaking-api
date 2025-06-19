const Web3 = require('web3');
const axios = require('axios');

// Initialize web3 with an Ethereum provider (e.g., Infura)
const web3 = new Web3(process.env.ETH_PROVIDER || 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID');

// EigenLayer subgraph URL (replace with actual URL)
const EIGENLAYER_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/eigenlayer/eigenlayer';

// Fetch restakers data from subgraph
async function fetchRestakersData() {
  const query = `
    {
      delegations {
        delegator {
          id
        }
        amount
        operator {
          id
        }
      }
    }
  `;

  try {
    const response = await axios.post(EIGENLAYER_SUBGRAPH, { query });
    return response.data.data.delegations.map(delegation => ({
      userAddress: delegation.delegator.id,
      amountRestakedStETH: delegation.amount,
      targetAVSOperatorAddress: delegation.operator.id,
      lastUpdated: new Date()
    }));
  } catch (error) {
    console.error('Error fetching restakers data:', error);
    return [];
  }
}

// Fetch validators data from subgraph
async function fetchValidatorsData() {
  const query = `
    {
      operators {
        id
        totalDelegated
        slashings {
          amount
          timestamp
          reason
        }
        status
      }
    }
  `;

  try {
    const response = await axios.post(EIGENLAYER_SUBGRAPH, { query });
    return response.data.data.operators.map(operator => ({
      operatorAddress: operator.id,
      totalDelegatedStakeStETH: operator.totalDelegated,
      slashHistory: operator.slashings.map(slash => ({
        timestamp: parseInt(slash.timestamp),
        amountStETH: slash.amount,
        reason: slash.reason || 'Unknown'
      })),
      status: operator.status || 'active',
      lastUpdated: new Date()
    }));
  } catch (error) {
    console.error('Error fetching validators data:', error);
    return [];
  }
}

// Fetch rewards data from subgraph
async function fetchRewardsData() {
  const query = `
    {
      rewards {
        recipient {
          id
        }
        amount
        operator {
          id
        }
        timestamp
      }
    }
  `;

  try {
    const response = await axios.post(EIGENLAYER_SUBGRAPH, { query });
    
    // Group rewards by recipient
    const rewardsByWallet = {};
    
    response.data.data.rewards.forEach(reward => {
      const walletAddress = reward.recipient.id;
      
      if (!rewardsByWallet[walletAddress]) {
        rewardsByWallet[walletAddress] = {
          walletAddress,
          totalRewardsReceivedStETH: '0',
          rewardsBreakdown: {},
          lastUpdated: new Date()
        };
      }
      
      // Add to total rewards
      rewardsByWallet[walletAddress].totalRewardsReceivedStETH = 
        (parseFloat(rewardsByWallet[walletAddress].totalRewardsReceivedStETH) + 
         parseFloat(reward.amount)).toString();
      
      // Add to operator breakdown
      const operatorAddress = reward.operator.id;
      if (!rewardsByWallet[walletAddress].rewardsBreakdown[operatorAddress]) {
        rewardsByWallet[walletAddress].rewardsBreakdown[operatorAddress] = {
          operatorAddress,
          amountStETH: '0',
          timestamps: []
        };
      }
      
      rewardsByWallet[walletAddress].rewardsBreakdown[operatorAddress].amountStETH = 
        (parseFloat(rewardsByWallet[walletAddress].rewardsBreakdown[operatorAddress].amountStETH) + 
         parseFloat(reward.amount)).toString();
      
      rewardsByWallet[walletAddress].rewardsBreakdown[operatorAddress].timestamps.push(
        parseInt(reward.timestamp)
      );
    });
    
    // Convert breakdown objects to arrays
    return Object.values(rewardsByWallet).map(reward => ({
      ...reward,
      rewardsBreakdown: Object.values(reward.rewardsBreakdown)
    }));
  } catch (error) {
    console.error('Error fetching rewards data:', error);
    return [];
  }
}

module.exports = {
  fetchRestakersData,
  fetchValidatorsData,
  fetchRewardsData
}; 