const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(limiter);
app.use(express.json());

// Connect to MongoDB
dbConnect();

// Routes
app.use('/health', require('./routes/health'));
app.use('/restakers', require('./routes/restakers'));
app.use('/validators', require('./routes/validators'));
app.use('/rewards', require('./routes/rewards'));

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

function dbConnect() {
  connectDB();
}
