import multer from "multer";
import uploadPdf from "../helpers/certificateUpload.js";
import requestModel from "../models/categoryRequestModeldel.js";

export const uploadCertificates = async (req, res) => {
  try {
    const { category } = req.body;
    const certificates = req.files.map((file) => ({
      url: file.location,
      key: file.key,
      verified: false,
    }));
    console.log(certificates);
    await requestModel.create({userId:'131',category:category,certificates:certificates})
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
