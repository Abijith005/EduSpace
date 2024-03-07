import { userCredentialsValidation } from "../helpers/inputValidations.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (!userCredentialsValidation({name, email, password})) {
      return res
        .status(400)
        .json({ success: false, message: "Input validation failed" });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    userModel.create({ name, email, password: hashedPassword });
  } catch (error) {
    console.log("Error \n", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (!userCredentialsValidation({email, password})) {
      console.log('not valid');
      return res
        .status(400)
        .json({ success: false, message: "Input validation failed" });
    }

    console.log('here');
    const [user,metadata]=await userModel.findOne({where:{email:email}})
    console.log(user,'\n',metadata,'===========================');
  } catch (error) {
    console.log("Error \n", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
