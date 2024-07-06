import teacherModel from "../models/teacherModel.js";

export const getUsers = async (req, res) => {
  try {
    const { ids } = req.params.Ids.split(",");
    const userIds = ids.split(",");
    const users = await teacherModel.find({ _id: { $in: userIds } }).lean();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error \n", error);
    res.status(500).json({ success: false, message: "Invalid token" });
  }
};
