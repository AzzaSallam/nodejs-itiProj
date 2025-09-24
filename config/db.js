import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB successfully:", conn.connection.host);
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;