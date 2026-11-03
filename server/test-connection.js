
import "dotenv/config";
import mongoose from "mongoose";

try {
  console.log("Testing MongoDB Atlas connection...");

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log("Connected successfully!");

  const result = await mongoose.connection.db.admin().ping();
  console.log("Ping result:", result);

  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error("Connection failed:", error.message);
  console.error("Error name:", error.name);

  if (error.reason?.servers) {
    for (const [address, server] of error.reason.servers) {
      console.error(address, "=>", server.error?.message);
    }
  }

  process.exit(1);
}
