import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';

  try {
    await mongoose.connect(`${uri}/thecollegestore?authSource=admin`);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting MongoDB:", err);
  }
}
