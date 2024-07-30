import userModel from "../models/userModel.js";

export const getUsersByIds = async (query) => {
  try {
    return await userModel.find(query).lean();
  } catch (error) {
    console.log("Error \n", error);
  }
};

export const updateByIds = async (data) => {
  try {
    const { query, update } = data;
    return await userModel.updateOne(query, update);
  } catch (error) {
    console.log("Error \n", error);
    throw error;
  }
};
