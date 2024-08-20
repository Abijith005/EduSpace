import hashPassword from "../helpers/hashPassword.js";
import { userCredentialsValidation } from "../helpers/inputValidations.js";
import { createAccessToken, createRefreshToken } from "../helpers/jwtSign.js";
import generatePassword from "../helpers/passorwordGenerator.js";
import userModel from "../models/userModel.js";
import sendTaskToQueue from "../rabbitmq/producers/teacherProfileProducer.js";
export const userSocialSignup = async (req, res) => {
  try {
    const { name, email, profilePic, socialId, role } = req.body;
    const validate = userCredentialsValidation({
      name,
      email,
      profilePic,
      socialId,
      role,
    });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }
    let user = await userModel.findOne({ email: email });
    if ((user && !user.socialId) || (user && user?.role != role)) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }
    let message = "Login successfull";
    if (!user) {
      const password = await generatePassword();
      console.log(password);
      const hashedPassword=await hashPassword(password)
      user = await userModel.create({
        name,
        email,
        profilePic,
        socialId,
        role,
        password:hashedPassword
      });
      message = "User registration successfull";
      if (role === "teacher") {
        await sendTaskToQueue("teacher_profile", user._id);
      }
      const query = { userId: user._id };
      await sendTaskToQueue("update_wallet_queue", {query:query,update:{}});
    }
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
    return res.status(200).json({
      success: true,
      message,
      accessToken,
      refreshToken,
      userInfo: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const userSocialSignIn = async (req, res) => {
  try {
    const { name, email, profilePic, socialId } = req.body;
    const validate = userCredentialsValidation({
      name,
      email,
      profilePic,
      socialId,
    });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }
    let user = await userModel.findOne({ email: email });

    if (user && !user.socialId) {
      return res.status(409).json({
        success: false,
        message: "Email already registered ! Login with password",
      });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found ! Please sign up" });
    }

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

    return res.status(200).json({
      success: true,
      message: "Login successfull",
      accessToken,
      refreshToken,
      userInfo: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
