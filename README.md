# EigenLayer Restaking Data API

A backend service that aggregates and exposes EigenLayer restaking data, providing endpoints for user restaking information, validator metadata, and reward insights.

## Features

- Fetch and store restaking data from EigenLayer subgraphs
- Query user restaking information
- Access validator metadata including slash history
- Retrieve reward insights per wallet address
- Health check endpoint for monitoring
- Input validation and error handling
- Rate limiting and CORS support

## API Endpoints

### GET /health
Returns the health status of the API and database connection.

Example Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```

### GET /restakers
Returns a list of restakers with their restaked amount and target validator.

Example Response:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "userAddress": "0x123...",
      "amountRestakedStETH": "100.5",
      "targetAVSOperatorAddress": "0xabc..."
    }
  ]
}
```

### GET /validators
Returns a list of validators with their detailed statistics.

Example Response:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "operatorAddress": "0xabc...",
      "totalDelegatedStakeStETH": "5000",
      "slashHistory": [
        {
          "timestamp": 1678886400,
          "amountStETH": "50",
          "reason": "Misconduct X"
        }
      ],
      "status": "active"
    }
  ]
}
```

### GET /rewards/:address
Returns reward information for a specific wallet address.

Example Response:
```json
{
  "success": true,
  "data": {
    "walletAddress": "0x123...",
    "totalRewardsReceivedStETH": "75.2",
    "rewardsBreakdown": [
      {
        "operatorAddress": "0xabc...",
        "amountStETH": "60.0",
        "timestamps": [1678972800, 1679059200]
      }
    ]
  }
}
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/MSekhar2002/eigenlayer-restaking-api.git
cd eigenlayer-restaking-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/eigenlayer
PORT=5000
ETH_PROVIDER=https://mainnet.infura.io/v3/YOUR-PROJECT-ID
NODE_ENV=development
```

4. Start MongoDB:
Make sure MongoDB is running on your system.

5. Run the data fetching script:
```bash
npm run fetch-data
```

6. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## Data Sources

- EigenLayer Subgraph: Used for fetching restaking, validator, and reward data
- On-chain data via Web3.js: Used as a fallback and for real-time data verification

## Development

- The data fetching script (`scripts/fetchData.js`) can be run manually or scheduled to keep the database updated
- MongoDB is used for efficient querying and data storage
- Express.js powers the REST API endpoints
- Input validation ensures data integrity
- Rate limiting prevents API abuse
- CORS support for cross-origin requests

## Error Handling

The API implements comprehensive error handling:
- 400: Bad Request (validation errors)
- 404: Resource not found
- 429: Too Many Requests (rate limiting)
- 500: Server error
- Proper validation of Ethereum addresses
- Detailed error messages in development mode

## Security Features

- Rate limiting: 100 requests per 15 minutes per IP
- Input validation for all endpoints
- CORS configuration
- Error message sanitization in production

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

