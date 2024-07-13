import express from "express";
import uploadFiles from "../multerMiddlewares/uploadFiles.js";
import { getAllCourses, uploadCourse } from "../controllers/courseController.js";

const router = express.Router();

router.post(`/uploadCourse`,uploadFiles,uploadCourse)

router.get(`/all`,getAllCourses)


export default router