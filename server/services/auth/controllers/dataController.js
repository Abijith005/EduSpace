import otpModel from "../models/otpModel.js";
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

export const getOtp = async (query) => {
  try { 
    return await otpModel.findOne(query);
  } catch (error) {
    console.log("Error \n", error);
    throw error;
  }
};
