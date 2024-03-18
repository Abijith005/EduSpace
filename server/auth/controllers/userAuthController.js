import { emailQueue } from "../config/queue.js";
import generateOtp from "../helpers/generateOtp.js";
import { userCredentialsValidation } from "../helpers/inputValidations.js";
import { createAccessToken, createRefreshToken } from "../helpers/jwtSign.js";
import otpModel from "../models/otpModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export const userRegister = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, otp } = req.body;
    const validation = userCredentialsValidation({ name, email, password });
    if (!name || !email || !password || !validation) {
      const message = !validation
        ? "Input validation failed"
        : "All fields are required";
      return res.status(400).json({ success: false, message: message });
    }
    const user = await userModel.findOne({ where: { email: email } });

    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const userOtp = await otpModel.findOne({ where: { email: email } });
    const currentDate = new Date();
    if (userOtp.expiresAt >= currentDate && userOtp.otp == otp) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      userModel.create({ name, email, password: hashedPassword });
      return res
        .status(200)
        .json({ success: false, message: "User registration successfull" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect OTP or OTP expired" });
    }
  } catch (error) {
    console.log("Error \n", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validation = userCredentialsValidation({ email, password });
    if (!email || !password || !validation) {
      const message = !validation
        ? "Input validation failed"
        : "All fields are required";
      return res.status(400).json({ success: false, message: message });
    }

    const user = await userModel.findOne({ where: { email: email } });

    if (user) {
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (verifyPassword) {
        const refreshToken = createRefreshToken({
          id: user.id,
          email: user.email,
          role: "user",
        });
        const accessToken = createAccessToken({
          id: user.id,
          email: user.email,
          role: "user",
        });
        return res.status(200).json({
          success: true,
          message: "Login successfull",
          accessToken,
          refreshToken,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const userRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ where: { email: email } });
    if (user) {
      return res
        .status(409)
        .json({ success: true, message: "Email already exists" });
    }

    const otp = await generateOtp();
    const validation = userCredentialsValidation({ email });
    if (!email || !validation) {
      const message = !validation
        ? "Input validation failed"
        : "All fields are required";
      return res.status(400).json({ success: false, message: message });
    }
    const job = {};
    job.subject = "EduSpace Email Verification";
    job.html = `<h1>Welcome to Eduspace!</h1>
    <p>Thank you for registering with Eduspace, your online e-learning platform.</p>
    <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
    <p>Please use this OTP to verify your email address and complete the registration process.</p>
    <p>If you didn't request this OTP, please ignore this email.</p>
    <p>For any assistance, feel free to contact our support team.</p>
    <p>Thank you for choosing Eduspace!</p>`;
    job.email = email;
    await emailQueue.add(job);
    const [data, created] = await otpModel.findOrCreate({
      where: { email: email },
      defaults: { otp: otp },
    });

    if (!created) {
      data.otp = otp;
      await data.save();
    }
    return res
      .status(200)
      .json({ success: true, message: "OTP send successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
