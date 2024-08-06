import express from "express";
import {
  getRequests,
  removeApprovedCategories,
  updateCertificates,
  updateRequestStatus,
  uploadCertificates,
} from "../controllers/profileController.js";
import uploadPdf from "../s3UploadMiddelwares/certificateUpload.js";
import multer from "multer";

const router = express.Router();

router.post(
  "/upload/certificates",
  uploadPdf,
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      let message;
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          message = "File size is too large. Maximum allowed size is 5MB.";
          break;
        case "LIMIT_FILE_COUNT":
          message = "Too many files. Maximum allowed number of files is 3.";
          break;
        case "LIMIT_UNEXPECTED_FILE":
          message = "Unexpected file field.";
          break;
        default:
          message = err.message;
          break;
      }
      return res.status(400).json({ success: false, message });
    } else if (err) {
      console.error("Error \n", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
    next();
  },
  uploadCertificates
);

router.get("/requests/all", getRequests);

router.put("/requests/updateCertificates", updateCertificates);

router.put("/requests/updateRequestStatus", updateRequestStatus);

router.patch("/removeApprovedCategory", removeApprovedCategories);
export default router;
