import teacherModel from "../models/teacherModel.js";

export const getUsersByIds= async (userIds) => {
  try {
    return await teacherModel.find({ _id: { $in: userIds } });
  } catch (error) {
    console.log("Error \n", error);
  }
};
