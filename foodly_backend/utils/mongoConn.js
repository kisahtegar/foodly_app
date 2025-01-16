const mongoose = require("mongoose");

/**
 * Connect to MongoDB database.
 *
 * This utility function establishes a connection to the MongoDB database using the
 * connection string stored in the environment variable `MONGO_URL`. It attempts to
 * connect initially, and if the connection fails, it tries to reconnect. A message
 * is logged to indicate the success or failure of the connection.
 *
 * @example
 * // To connect to the database
 * connectDB();
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to the DB successfully");
  } catch (err) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Reconnected to the DB successfully");
  }
};

module.exports = connectDB;
