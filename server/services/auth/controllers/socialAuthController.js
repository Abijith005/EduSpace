import { userCredentialsValidation } from "../helpers/inputValidations.js";
import { createAccessToken, createRefreshToken } from "../helpers/jwtSign.js";
import studentModel from "../models/studentModel.js";

export const userSocialLogin = async (req, res) => {
  try {
    const { name, email, profilePic,socialId } = req.body;
    const validate = userCredentialsValidation({ name, email, profilePic,socialId });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }
    let user = await studentModel.findOne({ email: email });
    if (user&&!user.socialId) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }
    let message="Login successfull"
    if (!user) {
      user = await studentModel.create({ name, email, profilePic,socialId });
      message="User registration successfull"
    }
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
      message,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

 
