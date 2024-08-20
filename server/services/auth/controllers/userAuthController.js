import { emailQueue } from "../config/queue.js";
import generateOtp from "../helpers/generateOtp.js";
import hashPassword from "../helpers/hashPassword.js";
import { userCredentialsValidation } from "../helpers/inputValidations.js";
import { createAccessToken, createRefreshToken } from "../helpers/jwtSign.js";
import otpModel from "../models/otpModel.js";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import sendTaskToQueue from "../rabbitmq/producers/teacherProfileProducer.js";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password, otp, role } = req.body;

    const validate = userCredentialsValidation({ name, email, password, role });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const user = await userModel.findOne({ email: email });

    if (user) {
      const message = "Email already exists";
      if (user.socialId) {
        message = "Email already registered with google use Google Login";
      }
      return res.status(409).json({ success: false, message });
    }

    const userOtp = await otpModel.findOne({
      email: email,
      purpose: "registration",
    });
    const currentDate = new Date();
    if (userOtp?.expiresAt >= currentDate && userOtp.otp == otp) {
      const hashedPassword = await hashPassword(password);

      const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
      if (role === "teacher") { 
        await sendTaskToQueue("teacher_profile", user._id);
      }
      const query={userId:user._id}
      await sendTaskToQueue("update_wallet_queue", {query:query,update:{}});
      return res
        .status(200)
        .json({ success: true, message: `${role} registration successfull` });
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

    const user = await userModel.findOne({ email: email });
    if (user) {
      if (user.socialId) {
        return res
          .status(409)
          .json({ success: false, message: "Please login with Google" });
      }
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (verifyPassword) {
        const refreshToken = createRefreshToken({
          id: user._id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
          role: user.role,
        });
        const accessToken = createAccessToken({
          id: user._id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
          role: user.role,
        });
        const userInfo = {
          _id: user._id,
          name: user.name || "",
          email: user.email,
          profilePic: user.profilePic || "",
          role: user.role,
        };
        return res.status(200).json({
          success: true,
          message: "Login successfull",
          accessToken,
          refreshToken,
          userInfo,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found ! Please sign up" });
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
    const user = await userModel.findOne({ email: email });
    if (user) {
      let message = "Email already registered";
      if (user.socialId) {
        message = "Email already registered with google use Google Login";
      }
      return res.status(409).json({ success: true, message });
    }

    const otp = await generateOtp();
    const validate = userCredentialsValidation({ email });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const data = await otpModel.findOneAndUpdate(
      {
        email,
        purpose: "registration",
      },
      {
        otp,
        expiresAt: new Date(Date.now() + 1 * 60 * 1000),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const validate = userCredentialsValidation({ email });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const user = await userModel.findOne({ email: email });

    if (!user || user?.socialId) {
      const message = user?.socialId
        ? "Please login with Google"
        : "Email not found";
      return res.status(401).json({ success: false, message });
    } else {
      const otp = await generateOtp();

      const data = await otpModel.findOneAndUpdate(
        {
          email,
          purpose: "forgot_password",
        },
        {
          otp,
          expiresAt: new Date(Date.now() + 1 * 60 * 1000),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

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

export const forgotPasswordverifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validate = userCredentialsValidation({ email });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const otpData = await otpModel.findOne({
      email: email,
      purpose: "forgot_password",
    });
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
    const { oldPassword, password, email } = req.body;
    console.log(oldPassword, password, email);
    const user = await userModel.findOne({ email: email });
    // if (user?.socialId) {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Social login users can't change password.`,
    //   });
    // }
    const validate = userCredentialsValidation({ password, email });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const verifyPassword = await bcrypt.compare(oldPassword, user.password);

    if (!verifyPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (matchPassword) {
      return res.status(400).json({
        success: false,
        message: "New password can't be the same as the old one.",
      });
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    await user.save();
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
