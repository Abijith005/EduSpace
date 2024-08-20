import { createAccessToken } from "../helpers/jwtSign.js";
import verifyJwt from "../helpers/jwtVerify.js";
import userModel from "../models/userModel.js";

export const getNewAccessToken = async (req, res) => {
  try {
    const { token } = req.params;
    const verify = verifyJwt(token);
    if (verify) {
      const { id, email, role } = verify;
      const token = createAccessToken({ id, email, role });
      return res.status(200).json({
        success: true,
        message: "New access token created",
        accessToken: token,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized please login again" });
    }
  } catch (error) {
    console.log("Error \n", error);
    res.status(500).json({ success: false, message: "Invalid token" });
  }
};

export const decodeUserInfo = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = verifyJwt(token).id;
    const user = await userModel.findOne({ _id: userId });
    if (!userId) {
      return res.status(401).json({ success: false, message: "invalid token" });
    }
    res.status(200).json({
      success: true,
      userInfo: {
        _id: userId,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error \n", error);
    res.status(500).json({ success: false, message: "Invalid token" });
  }
};
