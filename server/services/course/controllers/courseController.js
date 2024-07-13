import jwtDecode from "../helpers/jwtDecode.js";
import cousreModel from "../models/courseModel.js";
import sendUploadTaskToQueue from "../rabbitmq/producers/uploadProducer.js";

export const uploadCourse = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).send({ message: req.fileValidationError });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ message: "No files uploaded" });
    }
    const token = req.headers.authorization.split(" ")[1];
    req.body.user_id = jwtDecode(token).id;
    await sendUploadTaskToQueue(req.files, req.body);
    res.status(200).send({
      success: true,
      message: "Files uploaded successfully and processing in background",
    });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const { page, limit, search, filter, id } = req.query;
    let totalDocs;
    let query = { title: { $regex: search, $options: "i" } };

    if (id) {
      const token = req.headers.authorization.split(" ")[1];
      const user_id = jwtDecode(token).id;
      totalDocs = await cousreModel.find({ user_id: user_id }).countDocuments();
      query = { ...query, user_id: user_id };
    } else {
      totalDocs = await cousreModel.countDocuments();
    }

    const skip = (page - 1) * limit;
    const datas = await cousreModel
      .find(query)
      .skip(skip)
      .limit(page * limit)
      .lean();

    return res.status(200).json({ success: true, courses: datas });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
