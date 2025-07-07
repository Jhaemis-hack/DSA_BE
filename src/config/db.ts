const mongoose = require("mongoose");

require('@dotenvx/dotenvx').config()

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

/**
 * Database connection function
 * @returns {Promise<void>}
 */

const DB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connection Successful...🚀");
  } catch (error) {
    await mongoose.connection.close();
    console.log("DB connection failed...❌. Connection closed.");
  }
};

export default DB;
