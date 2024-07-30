import jwtDecode from "../helpers/jwtDecode.js";
import membersModel from "../models/membersModel.js";

export const getAllCommunities = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = jwtDecode(token).id;
    const memberDetails = await membersModel
      .findOne({ user_id })
      .populate("communityIds")
      .lean();
    if (memberDetails) {
      memberDetails["communities"] = memberDetails.communityIds;
      delete memberDetails.communityIds;
    }
    res.status(200).json({ success: true, memberDetails });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
