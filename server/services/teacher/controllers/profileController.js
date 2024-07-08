import jwtDecode from "../helpers/jwtDecode.js";
import requestModel from "../models/categoryRequestModeldel.js";

export const uploadCertificates = async (req, res) => {
  try {
    const { category } = req.body;
    const token=req.headers.authorization.split(' ')[1]
    const userId= jwtDecode(token).id
    const certificates = req.files.map((file) => ({
      url: file.location,
      key: file.key,
      verified: false,
    }));
    console.log(certificates);
    await requestModel.create({
      userId: userId,
      category: category,
      certificates: certificates,
    });
    res
      .status(200)
      .json({ success: true, message: "Certficates uploaded successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { currentPage, limit } = req.query;
    const totalData = await requestModel.countDocuments();
    const skip = (currentPage - 1) * limit;
    const requests = await requestModel
      .find()
      .limit(limit * currentPage)
      .skip(skip)
      .lean();
    res.status(200).json({ success: true, requests, totalData });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
