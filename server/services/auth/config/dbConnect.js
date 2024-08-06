import mongoose from "mongoose";
import hashPassword from "../helpers/hashPassword.js";
import userModel from "../models/userModel.js";


const mongoUrl = process.env.MONGODB_URI;
const database = process.env.DB_NAME;

const dbConnect = async () => {
  try {
    await mongoose.connect(`${mongoUrl}/${database}`);


    const email=process.env.ADMIN_EMAIL
    const existingAdmin = await userModel.findOne({ email });

    if (!existingAdmin) {
      const password=process.env.ADMIN_PASSWORD
       const hashedPassword = await hashPassword(password);
      const defaultAdmin = new userModel({
        name:'Admin',
        email: email,
        role:'admin',
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