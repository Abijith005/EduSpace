import { inputValidation } from "../helpers/inptValidation.js";
import categoryModel from "../models/categoryModel.js";

export const addCategory = async (req,res) => {
  try {
    const { title, icon } = req.body;
    const validate = inputValidation(req.body);
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }
    await categoryModel.create({ title, icon });
    return res.json({ success: true, message: "Category added successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
