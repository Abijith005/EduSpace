import { emailQueue } from "../config/queue.js";
import generateOtp from "../helpers/generateOtp.js";
import hashPassword from "../helpers/hashPassword.js";
import { userCredentialsValidation } from "../helpers/inputValidations.js";
import { createAccessToken, createRefreshToken } from "../helpers/jwtSign.js";
import adminModel from "../models/adminModel.js";
import otpModel from "../models/otpModel.js";
import studentModel from "../models/studentModel.js";
import teacherModel from "../models/teacherModel.js";
import bcrypt from "bcrypt";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password, otp, role } = req.body;
    const model = role == "student" ? studentModel : teacherModel;
    console.log(model, role);
    const validate = userCredentialsValidation({ name, email, password, role });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }
    const user = await model.findOne({ email: email });

    if (user) {
      const message = "Email already exists";
      if (user.socialId) {
        message = "Email already registered with google use Google Login";
      }
      return res.status(409).json({ success: false, message });
    }

    const userOtp = await otpModel.findOne({
      email: email,
      user_type: role.toLowerCase(),
      purpose: "registration",
    });
    const currentDate = new Date();
    if (userOtp?.expiresAt >= currentDate && userOtp.otp == otp) {
      const hashedPassword = await hashPassword(password);
      await model.create({ name, email, password: hashedPassword });
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
    const { email, password, role } = req.body;
    console.log(email, password);
    const model =
      role == "student"
        ? studentModel
        : role == "teacher"
        ? teacherModel
        : adminModel;
    const validate = userCredentialsValidation({ email, password });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const user = await model.findOne({ email: email });
    if (user) {
      if (user.socialId) {
        return res.status(409).json({success:false,message:"Please login with Google"})
      }
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (verifyPassword) {
        const refreshToken = createRefreshToken({
          id: user.id,
          name:user.name,
          email: user.email,
          profilePic:user.profilePic,
          role: role,
        });
        const accessToken = createAccessToken({
          id: user.id,
          name:user.name,
          email: user.email,
          profilePic:user.profilePic,
          role: role,
        });
        return res.status(200).json({
          success: true,
          message: "Login successfull",
          accessToken,
          refreshToken,
          userInfo:{name:user.name,email:user.email,profilePic:user.profilePic,role:role}
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
    const { email, role } = req.body;
    const model = role == "student" ? studentModel : teacherModel;
    const user = await model.findOne({ email: email });
    console.log(user);
    if (user) {
      let message = "Email already registered";
      if (user.socialId) {
        message = "Email already registered with google use Google Login";
      }
      return res.status(409).json({ success: true, message });
    }

    const otp = await generateOtp();
    const validate = userCredentialsValidation({ email, role });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const data = await otpModel.findOne({
      email,
      purpose: "registration",
      user_type: role.toLowerCase(),
    });
    if (data) {
      data.otp = otp;
      data.expiresAt = new Date(Date.now() + 1 * 60 * 1000);
      await data.save();
    } else {
      await otpModel.create({
        email,
        otp,
        purpose: "registration",
        user_type: role.toLowerCase(),
      });
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

export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;
    const model = role == "student" ? studentModel : teacherModel;
    const validate = userCredentialsValidation({ email, role });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const user = await model.findOne({ email: email });

    if (!user || user?.socialId) {
      const message = user?.socialId
        ? "Please login with Google"
        : "Email not found";
      return res.status(401).json({ success: false, message });
    } else {
      const otp = await generateOtp();
      const data = await otpModel.findOne({
        email,
        purpose: "forgot_password",
        user_type: role.toLowerCase(),
      });

      if (data) {
        data.otp = otp;
        data.expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        await data.save();
      } else {
        await otpModel.create({
          email,
          otp,
          purpose: "forgot_password",
          user_type: role.toLowerCase(),
        });
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

export const forgotPasswordverifyOtp = async (req, res) => {
  try {
    const { email, otp, role } = req.body;
    const validate = userCredentialsValidation({ email });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const otpData = await otpModel.findOne({
      email: email,
      purpose: "forgot_password",
      user_type: role.toLowerCase(),
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
    const { password, email } = req.body;
    const validate = userCredentialsValidation({ password, email });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const hashedPassword = await hashPassword(password);
    await studentModel.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
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

export const adminLogin = async () => {
  try {
    const { email, password, role } = req.body;
    const validate = userCredentialsValidation({ email, password, role });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }

    const admin = await adminModel.findOne({ email: email });

    if (admin) {
      const verifyPassword = await bcrypt.compare(password, admin.password);
      if (verifyPassword) {
        const refreshToken = createRefreshToken({
          id: admin.id,
          email: admin.email,
          role: "admin",
        });
        const accessToken = createAccessToken({
          id: admin.id,
          email: admin.email,
          role: "admin",
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
        .json({ success: false, message: "Admin not found" });
    }
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
