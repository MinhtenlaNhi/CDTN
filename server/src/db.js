const mongoose = require("mongoose");

let connected = false;

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !String(uri).trim()) {
    console.warn("[db] MONGODB_URI is not set — auth API will return 503.");
    return false;
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15_000,
      socketTimeoutMS: 45_000
    });
    connected = true;
    console.log("[db] MongoDB connected.");
    return true;
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    return false;
  }
}

function isDbReady() {
  return connected && mongoose.connection.readyState === 1;
}

module.exports = { connectDb, isDbReady };
