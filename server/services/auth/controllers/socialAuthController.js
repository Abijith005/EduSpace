import { userCredentialsValidation } from "../helpers/inputValidations.js";
import { createAccessToken, createRefreshToken } from "../helpers/jwtSign.js";
import studentModel from "../models/studentModel.js";
import teacherModel from "../models/teacherModel.js";

export const userSocialLogin = async (req, res) => {
  try {
    const { name, email, profilePic,socialId,role } = req.body;
    const validate = userCredentialsValidation({ name, email, profilePic,socialId });
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }
    const model = role == "student" ? studentModel : teacherModel;
    let user = await model.findOne({ email: email });
    if (user&&!user.socialId) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }
    let message="Login successfull"
    if (!user) {
      user = await model.create({ name, email, profilePic,socialId });
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
      userInfo:{name:user.name,email:user.email,profilePic:user.profilePic,role:role}
    });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

 
