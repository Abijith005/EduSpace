import multer from "multer";
import uploadPdf from "../helpers/certificateUpload.js";

export const uploadCertificates = async (req, res) => {
  try {
    const files = req.files.map((file) => ({
      url: file.location,
      key: file.key,
    }));

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
