import { inputValidation } from "../helpers/inptValidation.js";
import categoryModel from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
  try {
    const { title, icon } = req.body;
    const validate = inputValidation(req.body);
    if (!validate.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validate.message });
    }
    await categoryModel.create({ title, icon });
    return res
      .status(201)
      .json({ success: true, message: "Category added successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { page, limit } = req.query;
    let categories;
    let totalPages;
    if (page && limit) {
      const skip = (page - 1) * limit;
      const totalDocs = await categoryModel.countDocuments();
      totalPages = Math.ceil(totalDocs / limit);
      categories = await categoryModel
        .find()
        .skip(skip)
        .limit(page * limit)
        .lean();
    } else {
      categories = await categoryModel.find().lean();
    }
    res.status(200).json({ success: true, categories, totalPages });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getCategoriesByIds = async (categoryIds) => {
  try {
    return await categoryModel.find({ _id: { $in: categoryIds } }).lean();
  } catch (error) {
    console.log("Error \n", error);
  }
};

export const updateCategoryStatus = async (req, res) => {
  try {
    const { categoryId, status } = req.body;
    await categoryModel.findByIdAndUpdate(
      { _id: categoryId },
      { $set: { activeStatus: status } }
    );
    res
      .status(200)
      .json({ success: true, message: "Category status updated successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
