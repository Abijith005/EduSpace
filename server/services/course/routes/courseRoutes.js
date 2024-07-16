import express from "express";
import uploadFiles from "../multerMiddlewares/uploadFiles.js";
import { getAllCourses, updateCourse, uploadCourse } from "../controllers/courseController.js";

const router = express.Router();

router.post(`/uploadCourse`,uploadFiles,uploadCourse)

router.get(`/all`,getAllCourses)

router.put(`/updateCourse/:course_id`,uploadFiles,updateCourse)


export default router