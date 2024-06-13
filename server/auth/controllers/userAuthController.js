import { emailQueue } from "../config/queue.js";
import generateOtp from "../helpers/generateOtp.js";
import { userCredentialsValidation } from "../helpers/inputValidations.js";
import { createAccessToken, createRefreshToken } from "../helpers/jwtSign.js";
import otpModel from "../models/otpModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const validate = userCredentialsValidation({ name, email, password });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }
    const user = await userModel.findOne({ where: { email: email } });

    if (user) {
      const message="Email already exists"
      console.log("log user",user.socialId);
      if (user.socialId) {
        message="Email already registered with google use Google Login"
      }
      return res
        .status(409)
        .json({ success: false, message });
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
        .json({ success: true, message: "User registration successfull" });
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
    const validate = userCredentialsValidation({ email, password });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
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
      let message="Email already registered"
      if (user.socialId) {
        console.log(user.socialId);
        message="Email already registered with google use Google Login"
      }
      return res
        .status(409)
        .json({ success: true, message });
    }

    const otp = await generateOtp();
    const validate = userCredentialsValidation({ email });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const [data, created] = await otpModel.findOrCreate({
      where: { email: email },
      defaults: { otp: otp },
    });

    if (!created) {
      data.otp = otp;
      await data.save();
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

export const frogotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const validate = userCredentialsValidation({ email });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const user = await userModel.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email not found" });
    } else {
      const otp = await generateOtp();
      const [data, created] = await otpModel.findOrCreate({
        where: { email: email },
        defaults: { otp: otp },
      });

      if (!created) {
        data.otp = otp;
        await data.save();
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
      return res
        .status(200)
        .json({ success: true, message: "OTP has been sent" });
    }
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validate = userCredentialsValidation({ email });
    if (!validate.isValid) {
      return res.status(400).json({ success: false, message: validate.message });
    }

    const otpData = await otpModel.findOne({ where: { email: email } });
    const currentDate = new Date();
    if (otpData.expiresAt >= currentDate && otpData.otp == otp) {
      return res.status(200).json({ success: true, message: "OTP verified" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect OTP or OTP expired" });
    }
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password, email } = req.body;
    const validate = userCredentialsValidation({ password, email });
    if (!validate.isValid) {
      return res.status(400).json({ success: false, message: validate.message });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.update(
      { password: hashedPassword },
      { where: { email: email } }
    );
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
