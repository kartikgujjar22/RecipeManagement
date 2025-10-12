const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL;
if (!MONGO_URI) {
  console.warn('No MongoDB URI found in environment (MONGO_URI or MONGODB_URL). Skipping DB connection.');
}

const connectDB = async () => {
  if (!MONGO_URI) return;
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error occurred in mongoDB connection:', err.message || err);
    process.exit(1);
  }
};

module.exports = connectDB;
