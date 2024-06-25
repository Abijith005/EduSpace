import mongoose from "mongoose";
import adminModel from "../models/adminModel.js";
import hashPassword from "../helpers/hashPassword.js";


const mongoUrl = process.env.MONGODB_URI;
const database = process.env.DB_NAME;

const dbConnect = async () => {
  try {
    await mongoose.connect(`${mongoUrl}/${database}`);

    console.log("DB connected successfully");

    const email=process.env.ADMIN_EMAIL
    const existingAdmin = await adminModel.findOne({ email });

    if (!existingAdmin) {
      const password=process.env.ADMIN_PASSWORD
       const hashedPassword = await hashPassword(password);
      const defaultAdmin = new adminModel({
        email: email,
        password: hashedPassword,
      });

      await defaultAdmin.save(); 
      console.log("Default admin inserted successfully.");
    }

  } catch (err) {
    console.error("Error:", err);
    mongoose.connection.close();
  }
};

export default dbConnect;