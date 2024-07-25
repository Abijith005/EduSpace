import mongoose from "mongoose";

const mongoUrl = process.env.MONGODB_URI;
const database = process.env.DB_NAME;
const dbConnect = async () => {
  try {
    await mongoose.connect(`${mongoUrl}/${database}`);
    console.log("DB connected successfully");
  } catch (err) {
    console.error("Error:", err);
    mongoose.connection.close();
  }
};


export default dbConnect