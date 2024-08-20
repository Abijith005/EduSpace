import express from "express";
import {
  getAllStudents,
  updateStudentProfile,
  updateStudentStatus,
} from "../controllers/studentController.js";
import uploadFiles from "../multerMiddlewares/profileUploadMulter.js";

const router = express.Router();

router.get("/all", getAllStudents);

router.patch("/status", updateStudentStatus);

router.put('/profile',uploadFiles.single('profilePic'),updateStudentProfile)

export default router;
